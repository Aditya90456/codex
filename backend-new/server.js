const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { connectDB } = require('./config/database');
require('dotenv').config();

// Import routes
const authRouter = require('./routes/auth');
const problemsRouter = require('./routes/problems');
const submissionsRouter = require('./routes/submissions');
const executeRouter = require('./routes/execute');
// const usersRouter = require('./routes/users'); // Not created yet
const dashboardRouter = require('./routes/dashboard');
const projectsRouter = require('./routes/projects');
// const editorRouter = require('./routes/editor'); // Not created yet
const clerkRouter = require('./routes/clerk');
const aiGeneratorRouter = require('./routes/ai-generator');
const dsaAIRouter = require('./routes/dsa-ai');
const codeExplainerRouter = require('./routes/code-explainer');
const codeCompletionRouter = require('./routes/code-completion');

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize database connection
const initializeApp = async () => {
  const dbConnected = await connectDB();
  
  if (dbConnected) {
    console.log('✅ Database connection established');
  } else {
    console.log('⚠️  Starting without database connection');
  }
};

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.RATE_LIMIT_MAX || 100,
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Code execution rate limiting
const executeLimit = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10,
  message: {
    error: 'Too many code executions, please try again later.',
    retryAfter: '1 minute'
  }
});

// Middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "ws:", "wss:"]
    }
  }
}));

// CORS configuration - Allow multiple origins for deployment
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5174',
  process.env.FRONTEND_URL,
  // Add Vercel deployment patterns
  /\.vercel\.app$/,
  /\.netlify\.app$/,
  /\.render\.com$/
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, curl)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (typeof allowedOrigin === 'string') {
        return origin === allowedOrigin;
      }
      if (allowedOrigin instanceof RegExp) {
        return allowedOrigin.test(origin);
      }
      return false;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.log(`⚠️  CORS blocked origin: ${origin}`);
      // In production, allow all origins for now (can be restricted later)
      if (process.env.NODE_ENV === 'production') {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400 // 24 hours
}));

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Apply rate limiting
app.use('/api/', limiter);
app.use('/api/execute', executeLimit);

// Health check
app.get('/health', (req, res) => {
  const mongoose = require('mongoose');
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: '2.0.0',
    database: {
      status: dbStatus,
      message: dbStatus === 'connected' ? 'MongoDB connected' : 'Running in offline mode'
    }
  });
});

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/auth/clerk', clerkRouter);
app.use('/api/problems', problemsRouter);
app.use('/api/submissions', submissionsRouter);
app.use('/api/execute', executeRouter);
// app.use('/api/users', usersRouter); // Not created yet
app.use('/api/dashboard', dashboardRouter);
app.use('/api/projects', projectsRouter);
// app.use('/api/editor', editorRouter); // Not created yet
app.use('/api/ai', aiGeneratorRouter);
app.use('/api/ai', dsaAIRouter);
app.use('/api/ai', codeExplainerRouter);
app.use('/api/code-completion', codeCompletionRouter);

console.log('✅ AI Generator route registered');
console.log('✅ DSA AI route registered');
console.log('✅ Code Explainer route registered');
console.log('✅ Code Completion route registered');

// API documentation endpoint
app.get('/api', (req, res) => { 
  res.json({
    name: 'Codex Playground API',
    version: '2.0.0',
    description: 'Rebuilt backend API for Codex Playground coding environment',
    endpoints: {
      auth: {
        'POST /api/auth/register': 'Register new user',
        'POST /api/auth/login': 'User login',
        'GET /api/auth/me': 'Get current user',
        'PUT /api/auth/profile': 'Update user profile',
        'POST /api/auth/logout': 'User logout'
      },
      problems: {
        'GET /api/problems': 'Get all problems with pagination',
        'GET /api/problems/:id': 'Get specific problem',
        'GET /api/problems/random': 'Get random problem',
        'POST /api/problems': 'Create new problem (admin)'
      },
      execute: {
        'POST /api/execute': 'Execute code with test cases',
        'POST /api/execute/custom': 'Run custom code'
      },
      submissions: {
        'POST /api/submissions': 'Submit solution',
        'GET /api/submissions/:id': 'Get submission details',
        'GET /api/submissions/user/:userId': 'Get user submissions'
      },
      users: {
        'GET /api/users': 'Get users leaderboard',
        'GET /api/users/:id': 'Get user profile'
      },
      dashboard: {
        'GET /api/dashboard/stats': 'Get dashboard statistics',
        'GET /api/dashboard/activity': 'Get recent activity'
      },
      ai: {
        'POST /api/ai/generate': 'Generate content with AI (web, mobile, document, api, data)',
        'GET /api/ai/health': 'AI service health check',
        'POST /api/ai/dsa-hint': 'Get AI hint for DSA problem',
        'POST /api/ai/explain-solution': 'Get solution explanation',
        'POST /api/ai/review-code': 'Get AI code review',
        'POST /api/ai/explain-code': 'Get step-by-step code explanation with Gemini AI'
      }
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => ({
      field: e.path,
      message: e.message
    }));
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors
    });
  }
  
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `${field} already exists`
    });
  }
  
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired'
    });
  }
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false,
    message: `Route ${req.originalUrl} not found` 
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Initialize and start server
const startServer = async () => {
  await initializeApp();
  
  app.listen(PORT, () => {
    console.log(`🚀 Codex Playground Backend v2.0.0 running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`📚 API docs: http://localhost:${PORT}/api`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState === 1) {
      console.log(`🍃 Database: Connected`);
    } else {
      console.log(`⚠️  Database: Not connected (running in offline mode)`);
    }
  });
};

startServer().catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});