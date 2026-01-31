const express = require('express');
const router = express.Router();
const { VM } = require('vm2');
const { exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const util = require('util');
const execPromise = util.promisify(exec);

// Code execution with test cases
router.post('/run', async (req, res) => {
  try {
    const { code, language, testCases, problemId } = req.body;

    if (!code || !language) {
      return res.status(400).json({ error: 'Code and language are required' });
    }

    const results = await executeCode(code, language, testCases || []);
    
    res.json({
      success: true,
      results,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Code execution error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Submit solution with full test suite
router.post('/submit', async (req, res) => {
  try {
    const { code, language, problemId, userId } = req.body;

    if (!code || !language || !problemId) {
      return res.status(400).json({ error: 'Code, language, and problemId are required' });
    }

    // Get all test cases for the problem
    const allTestCases = await getAllTestCases(problemId);
    
    // Execute against all test cases
    const results = await executeCode(code, language, allTestCases);
    
    // Calculate statistics
    const stats = calculateStats(results);
    
    // Save submission if userId provided
    if (userId) {
      await saveSubmission(userId, problemId, code, language, stats);
    }

    res.json({
      success: true,
      accepted: stats.allPassed,
      totalTestCases: stats.total,
      passedTestCases: stats.passed,
      failedTestCases: stats.failed,
      runtime: stats.avgRuntime,
      memory: stats.avgMemory,
      results,
      stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Submission error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Dry run with step-by-step execution
router.post('/dry-run', async (req, res) => {
  try {
    const { code, language, input } = req.body;

    const dryRunResult = await performDryRun(code, language, input);
    
    res.json({
      success: true,
      steps: dryRunResult.steps,
      variables: dryRunResult.variables,
      output: dryRunResult.output,
      visualizations: dryRunResult.visualizations
    });
  } catch (error) {
    console.error('Dry run error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get runtime analysis
router.post('/analyze', async (req, res) => {
  try {
    const { code, language, problemId } = req.body;

    const analysis = await analyzeCode(code, language);
    
    res.json({
      success: true,
      timeComplexity: analysis.timeComplexity,
      spaceComplexity: analysis.spaceComplexity,
      suggestions: analysis.suggestions,
      optimizations: analysis.optimizations
    });
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Execute code with test cases
async function executeCode(code, language, testCases) {
  const results = [];

  for (const testCase of testCases) {
    const startTime = Date.now();
    const startMemory = process.memoryUsage().heapUsed;

    try {
      let output;
      let error = null;

      switch (language) {
        case 'javascript':
        case 'typescript':
          output = await executeJavaScript(code, testCase.input);
          break;
        case 'python':
          output = await executePython(code, testCase.input);
          break;
        case 'java':
          output = await executeJava(code, testCase.input);
          break;
        case 'cpp':
          output = await executeCpp(code, testCase.input);
          break;
        default:
          throw new Error(`Unsupported language: ${language}`);
      }

      const endTime = Date.now();
      const endMemory = process.memoryUsage().heapUsed;

      const passed = compareOutput(output, testCase.expected);

      results.push({
        input: testCase.input,
        expected: testCase.expected,
        output,
        passed,
        runtime: endTime - startTime,
        memory: Math.max(0, endMemory - startMemory),
        error: null
      });
    } catch (err) {
      results.push({
        input: testCase.input,
        expected: testCase.expected,
        output: null,
        passed: false,
        runtime: Date.now() - startTime,
        memory: 0,
        error: err.message
      });
    }
  }

  return results;
}

// Execute JavaScript code safely
async function executeJavaScript(code, input) {
  const vm = new VM({
    timeout: 5000,
    sandbox: {
      input,
      console: {
        log: (...args) => console.log('[User Code]:', ...args)
      }
    }
  });

  try {
    const wrappedCode = `
      ${code}
      
      // Execute the main function
      const result = typeof solution === 'function' 
        ? solution(${JSON.stringify(input)})
        : (typeof twoSum === 'function' ? twoSum(${JSON.stringify(input)}) : null);
      
      result;
    `;

    const result = vm.run(wrappedCode);
    return result;
  } catch (error) {
    throw new Error(`Runtime Error: ${error.message}`);
  }
}

// Execute Python code
async function executePython(code, input) {
  const tempFile = path.join(__dirname, `temp_${Date.now()}.py`);
  
  try {
    const wrappedCode = `
import json
import sys

${code}

# Execute
input_data = ${JSON.stringify(input)}
result = solution(input_data) if 'solution' in dir() else None
print(json.dumps(result))
`;

    await fs.writeFile(tempFile, wrappedCode);
    
    const { stdout, stderr } = await execPromise(`python ${tempFile}`, {
      timeout: 5000
    });

    if (stderr) {
      throw new Error(stderr);
    }

    return JSON.parse(stdout.trim());
  } finally {
    try {
      await fs.unlink(tempFile);
    } catch (e) {
      // Ignore cleanup errors
    }
  }
}

// Execute Java code
async function executeJava(code, input) {
  const className = 'Solution';
  const tempDir = path.join(__dirname, `temp_${Date.now()}`);
  const javaFile = path.join(tempDir, `${className}.java`);
  
  try {
    await fs.mkdir(tempDir, { recursive: true });
    
    const wrappedCode = `
import java.util.*;

${code}

public class Main {
  public static void main(String[] args) {
    Solution solution = new Solution();
    // Execute solution
    System.out.println("Result");
  }
}
`;

    await fs.writeFile(javaFile, wrappedCode);
    
    // Compile
    await execPromise(`javac ${javaFile}`, { timeout: 5000 });
    
    // Run
    const { stdout } = await execPromise(`java -cp ${tempDir} Main`, {
      timeout: 5000
    });

    return stdout.trim();
  } finally {
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
    } catch (e) {
      // Ignore cleanup errors
    }
  }
}

// Execute C++ code
async function executeCpp(code, input) {
  const tempFile = path.join(__dirname, `temp_${Date.now()}.cpp`);
  const outputFile = path.join(__dirname, `temp_${Date.now()}.out`);
  
  try {
    const wrappedCode = `
#include <iostream>
#include <vector>
using namespace std;

${code}

int main() {
  // Execute solution
  return 0;
}
`;

    await fs.writeFile(tempFile, wrappedCode);
    
    // Compile
    await execPromise(`g++ ${tempFile} -o ${outputFile}`, { timeout: 5000 });
    
    // Run
    const { stdout } = await execPromise(outputFile, { timeout: 5000 });

    return stdout.trim();
  } finally {
    try {
      await fs.unlink(tempFile);
      await fs.unlink(outputFile);
    } catch (e) {
      // Ignore cleanup errors
    }
  }
}

// Perform dry run with step tracking
async function performDryRun(code, language, input) {
  // Simplified dry run - tracks execution steps
  const steps = [];
  const variables = {};
  
  // Parse code and simulate execution
  // This is a simplified version - full implementation would use AST parsing
  
  return {
    steps: [
      { line: 1, action: 'Initialize', variables: { input } },
      { line: 2, action: 'Process', variables: { temp: [] } },
      { line: 3, action: 'Return', variables: { result: null } }
    ],
    variables,
    output: null,
    visualizations: {
      array: [],
      tree: null,
      graph: null
    }
  };
}

// Analyze code complexity
async function analyzeCode(code, language) {
  // Simplified analysis
  return {
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
    suggestions: [
      'Consider using a hash map for O(1) lookups',
      'Current solution has optimal time complexity'
    ],
    optimizations: [
      'Use two-pointer technique',
      'Avoid nested loops'
    ]
  };
}

// Compare outputs
function compareOutput(actual, expected) {
  return JSON.stringify(actual) === JSON.stringify(expected);
}

// Calculate statistics
function calculateStats(results) {
  const passed = results.filter(r => r.passed).length;
  const failed = results.length - passed;
  const avgRuntime = results.reduce((sum, r) => sum + r.runtime, 0) / results.length;
  const avgMemory = results.reduce((sum, r) => sum + r.memory, 0) / results.length;

  return {
    total: results.length,
    passed,
    failed,
    allPassed: failed === 0,
    avgRuntime: Math.round(avgRuntime),
    avgMemory: Math.round(avgMemory / 1024), // Convert to KB
    passRate: ((passed / results.length) * 100).toFixed(2)
  };
}

// Get all test cases for a problem
async function getAllTestCases(problemId) {
  // Mock test cases - in production, fetch from database
  return [
    { input: { nums: [2, 7, 11, 15], target: 9 }, expected: [0, 1] },
    { input: { nums: [3, 2, 4], target: 6 }, expected: [1, 2] },
    { input: { nums: [3, 3], target: 6 }, expected: [0, 1] }
  ];
}

// Save submission
async function saveSubmission(userId, problemId, code, language, stats) {
  // Save to database
  console.log('Saving submission:', { userId, problemId, stats });
}

module.exports = router;
