const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const { VM } = require('vm2');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration - Allow multiple origins for deployment
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://localhost:5174',
  'https://codex-playground-editor.vercel.app',
  process.env.FRONTEND_URL,
  // Add deployment patterns
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
app.use(bodyParser.urlencoded({ extended: true }));

// Import AI Generator routes
const aiGeneratorRoutes = require('./routes/ai-generator');
const codeExplainerRoutes = require('./routes/code-explainer');
const codeCompletionRoutes = require('./routes/code-completion');
const leetcodeRoutes = require('./routes/leetcode-execute');
const githubRoutes = require('./routes/github');

// In-memory storage (for simplicity)
let users = [];
let problems = [];
let submissions = [];

// Sample problems data
const sampleProblems = [
  {
    id: '1',
    title: 'Two Sum',
    difficulty: 'Easy',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
      }
    ],
    starterCode: {
      javascript: `function twoSum(nums, target) {
    // Your code here
}`,
      python: `def two_sum(nums, target):
    # Your code here
    pass`,
      java: `public int[] twoSum(int[] nums, int target) {
    // Your code here
}`,
      cpp: `vector<int> twoSum(vector<int>& nums, int target) {
    // Your code here
}`
    },
    testCases: [
      { input: [[2, 7, 11, 15], 9], expectedOutput: [0, 1] },
      { input: [[3, 2, 4], 6], expectedOutput: [1, 2] },
      { input: [[3, 3], 6], expectedOutput: [0, 1] }
    ]
  },
  {
    id: '2',
    title: 'Reverse String',
    difficulty: 'Easy',
    description: 'Write a function that reverses a string. The input string is given as an array of characters s.',
    examples: [
      {
        input: 's = ["h","e","l","l","o"]',
        output: '["o","l","l","e","h"]'
      }
    ],
    starterCode: {
      javascript: `function reverseString(s) {
    // Your code here
}`,
      python: `def reverse_string(s):
    # Your code here
    pass`,
      java: `public void reverseString(char[] s) {
    // Your code here
}`,
      cpp: `void reverseString(vector<char>& s) {
    // Your code here
}`
    },
    testCases: [
      { input: [['h','e','l','l','o']], expectedOutput: ['o','l','l','e','h'] },
      { input: [['H','a','n','n','a','h']], expectedOutput: ['h','a','n','n','a','H'] }
    ]
  }
];

// Initialize with sample data
problems = sampleProblems;

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    geminiConfigured: !!process.env.GEMINI_API_KEY
  });
});

// Mount AI Generator routes
app.use('/api/ai', aiGeneratorRoutes);
app.use('/api/ai', codeExplainerRoutes);
app.use('/api/code-completion', codeCompletionRoutes);
app.use('/api/leetcode', leetcodeRoutes);
app.use('/api/github', githubRoutes);

// Mount Spotify routes
const spotifyRoutes = require('./routes/spotify');
app.use('/api/spotify', spotifyRoutes);

// Mount Jamendo routes (Free music API)
const jamendoRoutes = require('./routes/jamendo');
app.use('/api/jamendo', jamendoRoutes);

console.log('✅ AI Generator routes mounted');
console.log('✅ GitHub integration routes mounted');
console.log('✅ Code Explainer routes mounted');
console.log('✅ Code Completion routes mounted');
console.log('✅ LeetCode Execution routes mounted');
console.log('✅ Spotify integration routes mounted');

// API Routes

// Get all problems
app.get('/api/problems', (req, res) => {
  const { difficulty, search } = req.query;
  
  let filteredProblems = problems;
  
  if (difficulty) {
    filteredProblems = filteredProblems.filter(p => p.difficulty === difficulty);
  }
  
  if (search) {
    filteredProblems = filteredProblems.filter(p => 
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  res.json({
    success: true,
    data: filteredProblems.map(p => ({
      id: p.id,
      title: p.title,
      difficulty: p.difficulty,
      description: p.description.substring(0, 200) + '...'
    }))
  });
});

// Get specific problem
app.get('/api/problems/:id', (req, res) => {
  const problem = problems.find(p => p.id === req.params.id);
  
  if (!problem) {
    return res.status(404).json({
      success: false,
      message: 'Problem not found'
    });
  }
  
  res.json({
    success: true,
    data: problem
  });
});

// Execute code
app.post('/api/execute', (req, res) => {
  try {
    const { code, language, problemId, testCases: customTestCases } = req.body;
    
    if (!code || !language) {
      return res.status(400).json({
        success: false,
        message: 'Code and language are required'
      });
    }
    
    let testCases = customTestCases;
    
    // If problemId provided, get test cases from problem
    if (problemId) {
      const problem = problems.find(p => p.id === problemId);
      if (problem) {
        testCases = problem.testCases;
      }
    }
    
    if (!testCases || testCases.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No test cases provided'
      });
    }
    
    // Execute code (currently only JavaScript supported)
    if (language !== 'javascript') {
      return res.json({
        success: true,
        data: {
          status: 'Error',
          message: `${language} execution not implemented yet`,
          testResults: testCases.map((tc, i) => ({
            testCase: i + 1,
            status: 'Error',
            input: tc.input,
            expectedOutput: tc.expectedOutput,
            actualOutput: null,
            error: `${language} execution not implemented`
          }))
        }
      });
    }
    
    const results = executeJavaScript(code, testCases);
    
    res.json({
      success: true,
      data: results
    });
    
  } catch (error) {
    console.error('Execution error:', error);
    res.status(500).json({
      success: false,
      message: 'Code execution failed',
      error: error.message
    });
  }
});

// Submit solution
app.post('/api/submit', (req, res) => {
  try {
    const { code, language, problemId } = req.body;
    
    if (!code || !language || !problemId) {
      return res.status(400).json({
        success: false,
        message: 'Code, language, and problemId are required'
      });
    }
    
    const problem = problems.find(p => p.id === problemId);
    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found'
      });
    }
    
    // Execute code with test cases
    const results = executeJavaScript(code, problem.testCases);
    
    // Create submission
    const submission = {
      id: uuidv4(),
      problemId,
      code,
      language,
      status: results.status,
      testResults: results.testResults,
      runtime: results.runtime,
      createdAt: new Date().toISOString()
    };
    
    submissions.push(submission);
    
    res.json({
      success: true,
      data: {
        submissionId: submission.id,
        status: submission.status,
        testResults: submission.testResults
      }
    });
    
  } catch (error) {
    console.error('Submit error:', error);
    res.status(500).json({
      success: false,
      message: 'Submission failed',
      error: error.message
    });
  }
});

// Get submissions
app.get('/api/submissions', (req, res) => {
  res.json({
    success: true,
    data: submissions.map(s => ({
      id: s.id,
      problemId: s.problemId,
      language: s.language,
      status: s.status,
      runtime: s.runtime,
      createdAt: s.createdAt
    }))
  });
});

// Custom code execution (playground)
app.post('/api/execute/custom', (req, res) => {
  try {
    const { code, language, input = '' } = req.body;
    
    if (!code || !language) {
      return res.status(400).json({
        success: false,
        message: 'Code and language are required'
      });
    }
    
    if (language !== 'javascript') {
      return res.json({
        success: true,
        data: {
          output: '',
          status: 'Error',
          error: `${language} execution not implemented yet`
        }
      });
    }
    
    const result = executeCustomJavaScript(code, input);
    
    res.json({
      success: true,
      data: result
    });
    
  } catch (error) {
    console.error('Custom execution error:', error);
    res.status(500).json({
      success: false,
      message: 'Code execution failed',
      error: error.message
    });
  }
});

// JavaScript execution functions
function executeJavaScript(code, testCases) {
  const testResults = [];
  let totalRuntime = 0;
  
  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    const startTime = Date.now();
    
    try {
      const vm = new VM({
        timeout: 5000,
        sandbox: {}
      });
      
      // Wrap the code to call the function
      const wrappedCode = `
        ${code}
        
        // Call the function with test input
        const args = ${JSON.stringify(testCase.input)};
        const result = typeof twoSum !== 'undefined' ? twoSum(...args) : 
                      typeof reverseString !== 'undefined' ? (reverseString(args[0]), args[0]) :
                      eval('(' + ${JSON.stringify(code)} + ')(...args)');
        result;
      `;
      
      const result = vm.run(wrappedCode);
      const runtime = Date.now() - startTime;
      totalRuntime += runtime;
      
      // Compare result
      const passed = JSON.stringify(result) === JSON.stringify(testCase.expectedOutput);
      
      testResults.push({
        testCase: i + 1,
        status: passed ? 'Passed' : 'Failed',
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        actualOutput: result,
        runtime
      });
      
    } catch (error) {
      testResults.push({
        testCase: i + 1,
        status: 'Error',
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        actualOutput: null,
        runtime: Date.now() - startTime,
        error: error.message
      });
    }
  }
  
  const allPassed = testResults.every(r => r.status === 'Passed');
  
  return {
    status: allPassed ? 'Accepted' : 'Wrong Answer',
    testResults,
    runtime: totalRuntime
  };
}

function executeCustomJavaScript(code, input) {
  const startTime = Date.now();
  
  try {
    const vm = new VM({
      timeout: 5000,
      sandbox: {
        console: {
          log: (...args) => args.join(' ')
        },
        input: input
      }
    });
    
    const result = vm.run(code);
    const runtime = Date.now() - startTime;
    
    return {
      output: result !== undefined ? String(result) : '',
      runtime,
      status: 'Success'
    };
    
  } catch (error) {
    return {
      output: '',
      runtime: Date.now() - startTime,
      status: 'Error',
      error: error.message
    };
  }
}

// Error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Start server - Bind to 0.0.0.0 for Render.com compatibility
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Codex Backend running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});