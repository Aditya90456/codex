const express = require('express');
const { body, validationResult } = require('express-validator');
const { VM } = require('vm2');
const Problem = require('../models/Problem');
const Submission = require('../models/Submission');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Code execution timeout (5 seconds)
const EXECUTION_TIMEOUT = 5000;

// Execute code with test cases
router.post('/', auth, [
  body('code').isLength({ min: 1 }),
  body('language').isIn(['javascript', 'python', 'java', 'cpp']),
  body('problemId').optional().isMongoId(),
  body('testCases').optional().isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { code, language, problemId, testCases: customTestCases } = req.body;
    let testCases = customTestCases;

    // If problemId is provided, get test cases from problem
    if (problemId) {
      const problem = await Problem.findById(problemId);
      if (!problem) {
        return res.status(404).json({
          success: false,
          message: 'Problem not found'
        });
      }
      testCases = problem.testCases;
    }

    if (!testCases || testCases.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No test cases provided'
      });
    }

    // Execute code based on language
    let results;
    switch (language) {
      case 'javascript':
        results = await executeJavaScript(code, testCases);
        break;
      case 'python':
        results = await executePython(code, testCases);
        break;
      case 'java':
        results = await executeJava(code, testCases);
        break;
      case 'cpp':
        results = await executeCpp(code, testCases);
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Unsupported language'
        });
    }

    // Calculate overall status
    const allPassed = results.testResults.every(result => result.status === 'Passed');
    const overallStatus = allPassed ? 'Accepted' : 'Wrong Answer';

    // If this is a submission (has problemId), update the submission
    if (problemId && req.body.submissionId) {
      await Submission.findByIdAndUpdate(req.body.submissionId, {
        status: overallStatus,
        testResults: results.testResults,
        runtime: results.totalRuntime,
        memory: results.totalMemory
      });
    }

    res.json({
      success: true,
      data: {
        status: overallStatus,
        ...results
      }
    });

  } catch (error) {
    console.error('Code execution error:', error);
    res.status(500).json({
      success: false,
      message: 'Code execution failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Execute custom code (playground mode)
router.post('/custom', auth, [
  body('code').isLength({ min: 1 }),
  body('language').isIn(['javascript', 'python', 'java', 'cpp']),
  body('input').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { code, language, input = '' } = req.body;

    let result;
    switch (language) {
      case 'javascript':
        result = await executeCustomJavaScript(code, input);
        break;
      case 'python':
        result = await executeCustomPython(code, input);
        break;
      case 'java':
        result = await executeCustomJava(code, input);
        break;
      case 'cpp':
        result = await executeCustomCpp(code, input);
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Unsupported language'
        });
    }

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Custom code execution error:', error);
    res.status(500).json({
      success: false,
      message: 'Code execution failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// JavaScript execution functions
async function executeJavaScript(code, testCases) {
  const testResults = [];
  let totalRuntime = 0;
  let totalMemory = 0;

  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    const startTime = Date.now();
    
    try {
      const vm = new VM({
        timeout: EXECUTION_TIMEOUT,
        sandbox: {
          console: {
            log: () => {}, // Disable console.log in test execution
          }
        }
      });

      // Prepare the code with function call
      const wrappedCode = `
        ${code}
        
        // Call the main function with test input
        const result = solution(${JSON.stringify(testCase.input)});
        result;
      `;

      const result = vm.run(wrappedCode);
      const runtime = Date.now() - startTime;
      totalRuntime += runtime;

      // Compare result with expected output
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

  return {
    testResults,
    totalRuntime,
    totalMemory: totalMemory || 0
  };
}

async function executeCustomJavaScript(code, input) {
  const startTime = Date.now();
  
  try {
    const vm = new VM({
      timeout: EXECUTION_TIMEOUT,
      sandbox: {
        console: {
          log: (...args) => {
            return args.join(' ');
          }
        },
        input: input
      }
    });

    const result = vm.run(code);
    const runtime = Date.now() - startTime;

    return {
      output: result || '',
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

// Placeholder functions for other languages
// In a production environment, these would use proper language-specific execution
async function executePython(code, testCases) {
  // This is a simplified placeholder
  // In production, you'd use a Python execution service
  return {
    testResults: testCases.map((tc, i) => ({
      testCase: i + 1,
      status: 'Error',
      input: tc.input,
      expectedOutput: tc.expectedOutput,
      actualOutput: null,
      runtime: 0,
      error: 'Python execution not implemented in this demo'
    })),
    totalRuntime: 0,
    totalMemory: 0
  };
}

async function executeJava(code, testCases) {
  return {
    testResults: testCases.map((tc, i) => ({
      testCase: i + 1,
      status: 'Error',
      input: tc.input,
      expectedOutput: tc.expectedOutput,
      actualOutput: null,
      runtime: 0,
      error: 'Java execution not implemented in this demo'
    })),
    totalRuntime: 0,
    totalMemory: 0
  };
}

async function executeCpp(code, testCases) {
  return {
    testResults: testCases.map((tc, i) => ({
      testCase: i + 1,
      status: 'Error',
      input: tc.input,
      expectedOutput: tc.expectedOutput,
      actualOutput: null,
      runtime: 0,
      error: 'C++ execution not implemented in this demo'
    })),
    totalRuntime: 0,
    totalMemory: 0
  };
}

async function executeCustomPython(code, input) {
  return {
    output: '',
    runtime: 0,
    status: 'Error',
    error: 'Python execution not implemented in this demo'
  };
}

async function executeCustomJava(code, input) {
  return {
    output: '',
    runtime: 0,
    status: 'Error',
    error: 'Java execution not implemented in this demo'
  };
}

async function executeCustomCpp(code, input) {
  return {
    output: '',
    runtime: 0,
    status: 'Error',
    error: 'C++ execution not implemented in this demo'
  };
}

module.exports = router;