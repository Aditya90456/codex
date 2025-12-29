const express = require('express');
const { VM } = require('vm2');
const router = express.Router();
const problems = require('../data/problems');

// Execute code with test cases
router.post('/', async (req, res) => {
  try {
    const { code, language, problemId, testCases } = req.body;

    if (!code || !language) {
      return res.status(400).json({ error: 'Code and language are required' });
    }

    // Get problem for test cases if problemId provided
    let problem = null;
    let casesToRun = testCases || [];

    if (problemId) {
      problem = problems.find(p => p.id === parseInt(problemId));
      if (problem) {
        casesToRun = problem.testCases || [];
      }
    }

    const results = await executeCode(code, language, casesToRun);
    
    res.json({
      success: true,
      results,
      totalTests: casesToRun.length,
      passedTests: results.filter(r => r.passed).length
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || 'Code execution failed'
    });
  }
});

// Run custom test case
router.post('/custom', async (req, res) => {
  try {
    const { code, language, input } = req.body;

    if (!code || !language) {
      return res.status(400).json({ error: 'Code and language are required' });
    }

    const result = await executeCustomCode(code, language, input);
    
    res.json({
      success: true,
      result
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || 'Code execution failed'
    });
  }
});

async function executeCode(code, language, testCases) {
  const results = [];

  for (const testCase of testCases) {
    try {
      const result = await runSingleTest(code, language, testCase);
      results.push(result);
    } catch (error) {
      results.push({
        input: testCase.input,
        expected: testCase.expected,
        actual: null,
        passed: false,
        error: error.message,
        runtime: 0
      });
    }
  }

  return results;
}

async function runSingleTest(code, language, testCase) {
  const startTime = Date.now();
  
  if (language === 'javascript') {
    return await executeJavaScript(code, testCase, startTime);
  } else if (language === 'python') {
    // For now, we'll simulate Python execution
    // In production, you'd use a proper Python executor
    return {
      input: testCase.input,
      expected: testCase.expected,
      actual: 'Python execution not implemented',
      passed: false,
      error: 'Python execution not supported in this demo',
      runtime: Date.now() - startTime
    };
  }
  
  throw new Error(`Language ${language} not supported`);
}

async function executeJavaScript(code, testCase, startTime) {
  const vm = new VM({
    timeout: 5000, // 5 second timeout
    sandbox: {
      console: {
        log: () => {}, // Disable console.log in sandbox
        error: () => {}
      }
    }
  });

  try {
    // Execute the user's code in the VM
    vm.run(code);

    // Get the function name from the code (simple regex)
    const functionMatch = code.match(/(?:var|function|const|let)\s+(\w+)\s*[=\(]/);
    const functionName = functionMatch ? functionMatch[1] : null;

    if (!functionName) {
      throw new Error('Could not find function name in code');
    }

    // Prepare the test execution
    const testCode = `
      ${code}
      
      // Execute the function with test input
      const result = ${functionName}(${prepareInput(testCase.input)});
      result;
    `;

    const actual = vm.run(testCode);
    const runtime = Date.now() - startTime;

    // Compare results
    const passed = deepEqual(actual, testCase.expected);

    return {
      input: testCase.input,
      expected: testCase.expected,
      actual,
      passed,
      error: null,
      runtime
    };

  } catch (error) {
    return {
      input: testCase.input,
      expected: testCase.expected,
      actual: null,
      passed: false,
      error: error.message,
      runtime: Date.now() - startTime
    };
  }
}

async function executeCustomCode(code, language, input) {
  const startTime = Date.now();

  if (language === 'javascript') {
    const vm = new VM({
      timeout: 5000,
      sandbox: {
        console: {
          log: (...args) => console.log(...args),
          error: (...args) => console.error(...args)
        }
      }
    });

    try {
      const result = vm.run(code);
      return {
        output: result,
        error: null,
        runtime: Date.now() - startTime
      };
    } catch (error) {
      return {
        output: null,
        error: error.message,
        runtime: Date.now() - startTime
      };
    }
  }

  throw new Error(`Language ${language} not supported`);
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