const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const problems = require('../data/problems');

// In-memory storage for submissions (use database in production)
const submissions = [];

// Submit solution
router.post('/', async (req, res) => {
  try {
    const { problemId, code, language } = req.body;

    if (!problemId || !code || !language) {
      return res.status(400).json({ 
        error: 'Problem ID, code, and language are required' 
      });
    }

    const problem = problems.find(p => p.id === parseInt(problemId));
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }

    // Execute code against test cases
    const executeModule = require('./execute');
    const testResults = await executeCodeForSubmission(code, language, problem.testCases);

    const submission = {
      id: uuidv4(),
      problemId: parseInt(problemId),
      problemTitle: problem.title,
      code,
      language,
      status: testResults.allPassed ? 'Accepted' : 'Wrong Answer',
      runtime: testResults.averageRuntime,
      memory: Math.floor(Math.random() * 50) + 10, // Mock memory usage
      testResults: testResults.results,
      totalTests: testResults.totalTests,
      passedTests: testResults.passedTests,
      submittedAt: new Date().toISOString(),
      userId: req.headers['user-id'] || 'anonymous' // In production, get from auth
    };

    submissions.push(submission);

    res.json({
      success: true,
      submission: {
        id: submission.id,
        status: submission.status,
        runtime: submission.runtime,
        memory: submission.memory,
        passedTests: submission.passedTests,
        totalTests: submission.totalTests,
        submittedAt: submission.submittedAt
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || 'Submission failed'
    });
  }
});

// Get submission by ID
router.get('/:id', (req, res) => {
  try {
    const submission = submissions.find(s => s.id === req.params.id);
    
    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    res.json(submission);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch submission' });
  }
});

// Get user submissions with pagination
router.get('/user/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10, status, problemId } = req.query;

    let userSubmissions = submissions.filter(s => s.userId === userId);

    // Filter by status
    if (status) {
      userSubmissions = userSubmissions.filter(s => 
        s.status.toLowerCase() === status.toLowerCase()
      );
    }

    // Filter by problem
    if (problemId) {
      userSubmissions = userSubmissions.filter(s => 
        s.problemId === parseInt(problemId)
      );
    }

    // Sort by submission date (newest first)
    userSubmissions.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedSubmissions = userSubmissions.slice(startIndex, endIndex);

    res.json({
      submissions: paginatedSubmissions,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(userSubmissions.length / limit),
        totalSubmissions: userSubmissions.length,
        hasNext: endIndex < userSubmissions.length,
        hasPrev: startIndex > 0
      }
    });

  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

// Get submission statistics for a user
router.get('/user/:userId/stats', (req, res) => {
  try {
    const { userId } = req.params;
    const userSubmissions = submissions.filter(s => s.userId === userId);

    const stats = {
      totalSubmissions: userSubmissions.length,
      acceptedSubmissions: userSubmissions.filter(s => s.status === 'Accepted').length,
      wrongAnswerSubmissions: userSubmissions.filter(s => s.status === 'Wrong Answer').length,
      runtimeErrorSubmissions: userSubmissions.filter(s => s.status === 'Runtime Error').length,
      acceptanceRate: 0,
      averageRuntime: 0,
      problemsSolved: new Set(userSubmissions.filter(s => s.status === 'Accepted').map(s => s.problemId)).size,
      languageStats: {},
      difficultyStats: {
        Easy: 0,
        Medium: 0,
        Hard: 0
      }
    };

    if (stats.totalSubmissions > 0) {
      stats.acceptanceRate = Math.round((stats.acceptedSubmissions / stats.totalSubmissions) * 100);
      stats.averageRuntime = Math.round(
        userSubmissions.reduce((sum, s) => sum + s.runtime, 0) / userSubmissions.length
      );
    }

    // Language statistics
    userSubmissions.forEach(submission => {
      stats.languageStats[submission.language] = (stats.languageStats[submission.language] || 0) + 1;
    });

    // Difficulty statistics (count solved problems by difficulty)
    const solvedProblems = userSubmissions.filter(s => s.status === 'Accepted');
    solvedProblems.forEach(submission => {
      const problem = problems.find(p => p.id === submission.problemId);
      if (problem) {
        stats.difficultyStats[problem.difficulty]++;
      }
    });

    res.json(stats);

  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user statistics' });
  }
});

// Helper function to execute code for submission
async function executeCodeForSubmission(code, language, testCases) {
  const { VM } = require('vm2');
  const results = [];
  let totalRuntime = 0;

  for (const testCase of testCases) {
    const startTime = Date.now();
    
    try {
      if (language === 'javascript') {
        const vm = new VM({
          timeout: 5000,
          sandbox: {
            console: { log: () => {}, error: () => {} }
          }
        });

        vm.run(code);
        
        const functionMatch = code.match(/(?:var|function|const|let)\s+(\w+)\s*[=\(]/);
        const functionName = functionMatch ? functionMatch[1] : null;

        if (!functionName) {
          throw new Error('Could not find function name in code');
        }

        const testCode = `
          ${code}
          const result = ${functionName}(${prepareInput(testCase.input)});
          result;
        `;

        const actual = vm.run(testCode);
        const runtime = Date.now() - startTime;
        totalRuntime += runtime;

        const passed = deepEqual(actual, testCase.expected);

        results.push({
          input: testCase.input,
          expected: testCase.expected,
          actual,
          passed,
          error: null,
          runtime
        });

      } else {
        throw new Error(`Language ${language} not supported`);
      }

    } catch (error) {
      const runtime = Date.now() - startTime;
      totalRuntime += runtime;
      
      results.push({
        input: testCase.input,
        expected: testCase.expected,
        actual: null,
        passed: false,
        error: error.message,
        runtime
      });
    }
  }

  const passedTests = results.filter(r => r.passed).length;
  
  return {
    results,
    totalTests: testCases.length,
    passedTests,
    allPassed: passedTests === testCases.length,
    averageRuntime: Math.round(totalRuntime / testCases.length)
  };
}

function prepareInput(input) {
  if (typeof input === 'object') {
    return Object.values(input).map(val => JSON.stringify(val)).join(', ');
  }
  return JSON.stringify(input);
}

function deepEqual(a, b) {
  if (a === b) return true;
  
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }
  
  if (typeof a === 'object' && typeof b === 'object' && a !== null && b !== null) {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    for (const key of keysA) {
      if (!keysB.includes(key) || !deepEqual(a[key], b[key])) return false;
    }
    return true;
  }
  
  return false;
}

module.exports = router;