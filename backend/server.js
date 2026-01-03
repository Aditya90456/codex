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
const usersRouter = require('./routes/users');
const dashboardRouter = require('./routes/dashboard');
const projectsRouter = require('./routes/projects');
const editorRouter = require('./routes/editor');
const clerkRouter = require('./routes/clerk');

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize database connection
const initializeApp = async () => {
  // Connect to database
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
  max: process.env.RATE_LIMIT_MAX || 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Code execution rate limiting (more restrictive)
const executeLimit = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 code executions per minute
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

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
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
    version: process.env.npm_package_version || '1.0.0',
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
app.use('/api/users', usersRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/editor', editorRouter);

// API documentation endpoint
app.get('/api', (req, res) => { 
  res.json({
    name: 'Codex Playground API',
    version: '1.0.0',
    description: 'Backend API for Codex coding playground with LeetCode-style problems',
    endpoints: {
      auth: {
        'POST /api/auth/register': 'Register new user',
        'POST /api/auth/login': 'User login',
        'GET /api/auth/me': 'Get current user',
        'PUT /api/auth/profile': 'Update user profile',
        'PUT /api/auth/preferences': 'Update user preferences',
        'PUT /api/auth/password': 'Change password',
        'POST /api/auth/logout': 'User logout'
      },
      problems: {
        'GET /api/problems': 'Get all problems with pagination',
        'GET /api/problems/:id': 'Get specific problem',
        'GET /api/problems/:id/stats': 'Get problem statistics',
        'GET /api/problems/random/pick': 'Get random problem',
        'POST /api/problems': 'Create new problem (admin)',
        'PUT /api/problems/:id': 'Update problem (admin)',
        'DELETE /api/problems/:id': 'Delete problem (admin)'
      },
      execute: {
        'POST /api/execute': 'Execute code with test cases',
        'POST /api/execute/custom': 'Run custom code'
      },
      submissions: {
        'POST /api/submissions': 'Submit solution',
        'GET /api/submissions/:id': 'Get submission details',
        'GET /api/submissions/user/:userId': 'Get user submissions',
        'GET /api/submissions/user/:userId/stats': 'Get user submission stats'
      },
      users: {
        'GET /api/users': 'Get users leaderboard',
        'GET /api/users/:id': 'Get user profile',
        'GET /api/users/:id/stats': 'Get user statistics'
      },
      dashboard: {
        'GET /api/dashboard/stats': 'Get dashboard statistics',
        'GET /api/dashboard/activity': 'Get recent activity',
        'GET /api/dashboard/leaderboard': 'Get global leaderboard'
      }
    },
    documentation: 'https://github.com/codex-team/playground-api'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  // Mongoose validation error
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
  
  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `${field} already exists`
    });
  }
  
  // JWT errors
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
  
  // Default error
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
    console.log(`🚀 Codex Playground Backend running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`📚 API docs: http://localhost:${PORT}/api`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    
    // Check database connection status
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState === 1) {
      console.log(`🍃 Database: Connected`);
    } else {
      console.log(`⚠️  Database: Not connected (running in offline mode)`);
      console.log(`   Authentication will work with JWT tokens only`);
    }
  });
};

startServer().catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});