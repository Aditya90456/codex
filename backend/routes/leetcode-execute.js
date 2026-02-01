const express = require('express');
const router = express.Router();
const { VM } = require('vm2');
const { exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const os = require('os');
const util = require('util');
const execPromise = util.promisify(exec);
const { dsaTestCases } = require('../data/dsa-test-cases');
const { dsaProblemsList } = require('../data/dsa-problems-list');

// In-memory user data storage (replace with database in production)
const userSubmissions = new Map(); // userId -> submissions[]
const userStats = new Map(); // userId -> stats object
const problemAttempts = new Map(); // userId -> problemId -> attempts[]
const userSolutions = new Map(); // userId -> problemId -> best solution

// LeetCode-style code execution with test cases
router.post('/run', async (req, res) => {
  try {
    const { code, language, testCases, problemId, userId } = req.body;

    if (!code || !language) {
      return res.status(400).json({ 
        success: false,
        error: 'Code and language are required' 
      });
    }

    if (!testCases || testCases.length === 0) {
      return res.status(400).json({ 
        success: false,
        error: 'At least one test case is required' 
      });
    }

    const results = await executeCode(code, language, testCases);
    
    // Track user run attempt
    if (userId) {
      trackUserRun(userId, problemId, language, results);
    }
    
    res.json({
      success: true,
      results,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Code execution error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Submit solution with full test suite
router.post('/submit', async (req, res) => {
  try {
    const { code, language, problemId, userId } = req.body;

    if (!code || !language || !problemId) {
      return res.status(400).json({ 
        success: false,
        error: 'Code, language, and problemId are required' 
      });
    }

    // Get test cases from 150 DSA problems
    const allTestCases = getAllTestCases(problemId);
    
    if (!allTestCases || allTestCases.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Problem not found or no test cases available'
      });
    }
    
    // Execute against all test cases
    const results = await executeCode(code, language, allTestCases);
    
    // Calculate statistics
    const stats = calculateStats(results);
    
    // Save submission for user
    const submission = {
      submissionId: generateSubmissionId(),
      userId,
      problemId,
      code,
      language,
      accepted: stats.allPassed,
      totalTestCases: stats.total,
      passedTestCases: stats.passed,
      failedTestCases: stats.failed,
      runtime: stats.avgRuntime,
      memory: stats.avgMemory,
      timestamp: new Date().toISOString(),
      results
    };
    
    if (userId) {
      saveUserSubmission(userId, submission);
      updateUserStats(userId, submission);
      
      // Save best solution if accepted
      if (stats.allPassed) {
        saveBestSolution(userId, problemId, submission);
      }
    }
    
    res.json({
      success: true,
      submissionId: submission.submissionId,
      accepted: stats.allPassed,
      totalTestCases: stats.total,
      passedTestCases: stats.passed,
      failedTestCases: stats.failed,
      runtime: stats.avgRuntime,
      memory: stats.avgMemory,
      results,
      stats,
      userStats: userId ? getUserStats(userId) : null,
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

// Get test cases for a specific problem from the 150 DSA problems
function getAllTestCases(problemId) {
  const id = parseInt(problemId);
  
  // Return test cases from the data file
  if (dsaTestCases[id]) {
    return dsaTestCases[id];
  }
  
  // Default test cases for unknown problems
  return [
    { input: '[2,7,11,15], 9', expected: '[0,1]' },
    { input: '[3,2,4], 6', expected: '[1,2]' },
    { input: '[3,3], 6', expected: '[0,1]' }
  ];
}

// Get problem details from 150 DSA problems
router.get('/problem/:problemId', (req, res) => {
  const { problemId } = req.params;
  
  // Mock problem data - in production, fetch from database or import from dsaProblems.js
  const problems = {
    1: {
      id: 1,
      title: "Two Sum",
      difficulty: "Easy",
      category: "Arrays",
      description: "Given an array of integers nums and an integer target, return indices of the two numbers that add up to target.",
      examples: [
        { input: "[2,7,11,15], target = 9", output: "[0,1]" },
        { input: "[3,2,4], target = 6", output: "[1,2]" }
      ],
      testCases: getAllTestCases(1)
    },
    2: {
      id: 2,
      title: "Best Time to Buy and Sell Stock",
      difficulty: "Easy",
      category: "Arrays",
      description: "Find the maximum profit from buying and selling a stock once.",
      examples: [
        { input: "[7,1,5,3,6,4]", output: "5" }
      ],
      testCases: getAllTestCases(2)
    },
    3: {
      id: 3,
      title: "Contains Duplicate",
      difficulty: "Easy",
      category: "Arrays",
      description: "Return true if any value appears at least twice in the array.",
      examples: [
        { input: "[1,2,3,1]", output: "true" }
      ],
      testCases: getAllTestCases(3)
    }
  };
  
  const problem = problems[problemId];
  
  if (!problem) {
    return res.status(404).json({
      success: false,
      message: 'Problem not found'
    });
  }
  
  res.json({
    success: true,
    problem
  });
});

// Get all problems list
router.get('/problems', (req, res) => {
  const { category, difficulty, limit = 50, offset = 0 } = req.query;
  
  // Use the complete list of 150 problems
  let problems = dsaProblemsList.map(p => ({ ...p, solved: false }));
  
  // Filter by category
  if (category) {
    problems = problems.filter(p => p.category === category);
  }
  
  // Filter by difficulty
  if (difficulty) {
    problems = problems.filter(p => p.difficulty === difficulty);
  }
  
  // Pagination
  const total = problems.length;
  const paginatedProblems = problems.slice(parseInt(offset), parseInt(offset) + parseInt(limit));
  
  res.json({
    success: true,
    total,
    problems: paginatedProblems
  });
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
      console: {
        log: (...args) => console.log('[User Code]:', ...args)
      }
    }
  });

  try {
    // Parse input string to extract values
    let nums, target;
    
    // Handle different input formats
    if (input.includes('], ')) {
      // Format: "[2,7,11,15], 9"
      const parts = input.split('], ');
      nums = JSON.parse(parts[0] + ']');
      target = parseInt(parts[1].replace(/\D/g, '')); // Extract only digits
    } else if (input.includes(', target = ')) {
      // Format: "[2,7,11,15], target = 9"
      const parts = input.split(', target = ');
      nums = JSON.parse(parts[0]);
      target = parseInt(parts[1]);
    } else {
      // Try to match pattern: [array], number
      const arrayTargetMatch = input.match(/\[([^\]]+)\],\s*(?:target\s*=\s*)?(\d+)/);
      if (arrayTargetMatch) {
        nums = JSON.parse(`[${arrayTargetMatch[1]}]`);
        target = parseInt(arrayTargetMatch[2]);
      } else {
        // Try to parse as simple array
        const arrayMatch = input.match(/\[([^\]]+)\]/);
        if (arrayMatch) {
          nums = JSON.parse(`[${arrayMatch[1]}]`);
          target = null;
        } else {
          // Fallback: try direct parse
          try {
            const parsed = JSON.parse(input);
            if (Array.isArray(parsed)) {
              nums = parsed;
              target = null;
            } else {
              nums = parsed.nums || parsed[0];
              target = parsed.target || parsed[1];
            }
          } catch (e) {
            throw new Error(`Invalid input format: ${input}`);
          }
        }
      }
    }

    const wrappedCode = `
      ${code}
      
      // Execute the main function
      const nums = ${JSON.stringify(nums)};
      ${target !== null ? `const target = ${target};` : ''}
      
      const result = typeof solution === 'function' 
        ? solution(nums${target !== null ? ', target' : ''})
        : (typeof twoSum === 'function' ? twoSum(nums${target !== null ? ', target' : ''}) : null);
      
      result;
    `;

    const result = vm.run(wrappedCode);
    return result;
  } catch (error) {
    // Parse real JavaScript errors
    const errorMessage = error.message;
    const errorStack = error.stack || '';
    
    // Detect error type
    if (errorMessage.includes('SyntaxError') || errorMessage.includes('Unexpected token')) {
      throw new Error(`Compilation Error: ${errorMessage}\n\nCheck your syntax - missing brackets, semicolons, or invalid JavaScript syntax.`);
    } else if (errorMessage.includes('ReferenceError')) {
      const match = errorMessage.match(/(\w+) is not defined/);
      const varName = match ? match[1] : 'variable';
      throw new Error(`Runtime Error: ReferenceError - ${varName} is not defined\n\nMake sure all variables are declared before use.`);
    } else if (errorMessage.includes('TypeError')) {
      throw new Error(`Runtime Error: TypeError - ${errorMessage}\n\nCheck your data types and method calls.`);
    } else if (errorMessage.includes('RangeError')) {
      throw new Error(`Runtime Error: RangeError - ${errorMessage}\n\nPossible infinite loop or stack overflow.`);
    } else if (error.killed || errorMessage.includes('timeout')) {
      throw new Error(`Time Limit Exceeded\n\nYour code took longer than 5 seconds to execute. Optimize your algorithm.`);
    } else {
      throw new Error(`Runtime Error: ${errorMessage}`);
    }
  }
}

// Execute Python code with detailed error handling
async function executePython(code, input) {
  const tempDir = path.join(os.tmpdir(), `leetcode_${Date.now()}`);
  const tempFile = path.join(tempDir, 'solution.py');
  
  try {
    await fs.mkdir(tempDir, { recursive: true });
    
    // Parse input string to extract values
    let nums, target;
    
    // Handle different input formats
    if (input.includes('], ')) {
      // Format: "[2,7,11,15], 9"
      const parts = input.split('], ');
      nums = JSON.parse(parts[0] + ']');
      target = parseInt(parts[1].replace(/\D/g, '')); // Extract only digits
    } else if (input.includes(', target = ')) {
      // Format: "[2,7,11,15], target = 9"
      const parts = input.split(', target = ');
      nums = JSON.parse(parts[0]);
      target = parseInt(parts[1]);
    } else {
      // Try to match pattern: [array], number
      const arrayTargetMatch = input.match(/\[([^\]]+)\],\s*(?:target\s*=\s*)?(\d+)/);
      if (arrayTargetMatch) {
        nums = JSON.parse(`[${arrayTargetMatch[1]}]`);
        target = parseInt(arrayTargetMatch[2]);
      } else {
        // Fallback
        try {
          const parsed = JSON.parse(`[${input}]`);
          nums = parsed[0];
          target = parsed[1];
        } catch (e) {
          nums = JSON.parse(input);
          target = 0;
        }
      }
    }

    const wrappedCode = `
import json
import sys

${code}

# Execute
nums = ${JSON.stringify(nums)}
target = ${target}

if 'twoSum' in dir():
    result = twoSum(nums, target)
elif 'two_sum' in dir():
    result = two_sum(nums, target)
elif 'Solution' in dir():
    result = Solution().twoSum(nums, target)
else:
    result = None

print(json.dumps(result))
`;

    await fs.writeFile(tempFile, wrappedCode);
    
    const { stdout, stderr } = await execPromise(`python "${tempFile}"`, {
      timeout: 5000,
      cwd: tempDir
    });

    if (stderr && !stderr.includes('Warning')) {
      // Parse Python errors
      const errorMessage = stderr;
      
      if (errorMessage.includes('SyntaxError')) {
        const lineMatch = errorMessage.match(/line (\d+)/);
        throw new Error(`Compilation Error: SyntaxError on line ${lineMatch ? lineMatch[1] : 'unknown'}\n\n${errorMessage}\n\nCheck your Python syntax - missing colons, incorrect indentation, or invalid syntax.`);
      } else if (errorMessage.includes('IndentationError')) {
        throw new Error(`Compilation Error: IndentationError\n\n${errorMessage}\n\nPython requires consistent indentation. Use either spaces or tabs, not both.`);
      } else if (errorMessage.includes('NameError')) {
        const match = errorMessage.match(/name '(\w+)' is not defined/);
        const varName = match ? match[1] : 'variable';
        throw new Error(`Runtime Error: NameError - '${varName}' is not defined\n\nMake sure all variables and functions are defined before use.`);
      } else if (errorMessage.includes('TypeError')) {
        throw new Error(`Runtime Error: TypeError\n\n${errorMessage}\n\nCheck your data types and function arguments.`);
      } else if (errorMessage.includes('IndexError')) {
        throw new Error(`Runtime Error: IndexError - list index out of range\n\n${errorMessage}\n\nYou're trying to access an index that doesn't exist in the list.`);
      } else if (errorMessage.includes('KeyError')) {
        throw new Error(`Runtime Error: KeyError\n\n${errorMessage}\n\nThe key doesn't exist in the dictionary.`);
      } else if (errorMessage.includes('AttributeError')) {
        throw new Error(`Runtime Error: AttributeError\n\n${errorMessage}\n\nThe object doesn't have the attribute or method you're trying to access.`);
      } else if (errorMessage.includes('RecursionError') || errorMessage.includes('maximum recursion depth')) {
        throw new Error(`Runtime Error: RecursionError - Maximum recursion depth exceeded\n\nYour recursive function is calling itself too many times. Check your base case.`);
      } else if (errorMessage.includes('ZeroDivisionError')) {
        throw new Error(`Runtime Error: ZeroDivisionError - Division by zero\n\nYou're trying to divide by zero.`);
      } else {
        throw new Error(`Runtime Error: ${errorMessage}`);
      }
    }

    const result = JSON.parse(stdout.trim());
    return result;
  } catch (error) {
    if (error.killed) {
      throw new Error('Time Limit Exceeded\n\nYour code took longer than 5 seconds to execute. Optimize your algorithm.');
    }
    if (error.message.startsWith('Compilation Error') || error.message.startsWith('Runtime Error')) {
      throw error;
    }
    throw new Error(`Runtime Error: ${error.message}`);
  } finally {
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
    } catch (e) {
      // Ignore cleanup errors
    }
  }
}

// Execute Java code with detailed error handling
async function executeJava(code, input) {
  const tempDir = path.join(os.tmpdir(), `leetcode_${Date.now()}`);
  const className = 'Solution';
  const javaFile = path.join(tempDir, `${className}.java`);
  
  try {
    await fs.mkdir(tempDir, { recursive: true });
    
    // Parse input string to extract values
    let nums, target;
    
    // Handle different input formats
    if (input.includes('], ')) {
      // Format: "[2,7,11,15], 9"
      const parts = input.split('], ');
      nums = JSON.parse(parts[0] + ']');
      target = parseInt(parts[1].replace(/\D/g, '')); // Extract only digits
    } else if (input.includes(', target = ')) {
      // Format: "[2,7,11,15], target = 9"
      const parts = input.split(', target = ');
      nums = JSON.parse(parts[0]);
      target = parseInt(parts[1]);
    } else {
      // Try to match pattern: [array], number
      const arrayTargetMatch = input.match(/\[([^\]]+)\],\s*(?:target\s*=\s*)?(\d+)/);
      if (arrayTargetMatch) {
        nums = JSON.parse(`[${arrayTargetMatch[1]}]`);
        target = parseInt(arrayTargetMatch[2]);
      } else {
        // Fallback
        try {
          const parsed = JSON.parse(`[${input}]`);
          nums = parsed[0];
          target = parsed[1];
        } catch (e) {
          nums = JSON.parse(input);
          target = 0;
        }
      }
    }

    const wrappedCode = `
import java.util.*;

${code}

class Main {
    public static void main(String[] args) {
        Solution solution = new Solution();
        int[] nums = {${nums.join(', ')}};
        int target = ${target};
        int[] result = solution.twoSum(nums, target);
        
        System.out.print("[");
        for (int i = 0; i < result.length; i++) {
            System.out.print(result[i]);
            if (i < result.length - 1) System.out.print(",");
        }
        System.out.println("]");
    }
}
`;

    await fs.writeFile(javaFile, wrappedCode);
    
    // Compile
    try {
      await execPromise(`javac "${javaFile}"`, { 
        timeout: 5000,
        cwd: tempDir 
      });
    } catch (compileError) {
      const errorMessage = compileError.stderr || compileError.message;
      
      if (errorMessage.includes('error:')) {
        // Extract specific compilation errors
        const errors = errorMessage.split('\n').filter(line => line.includes('error:'));
        throw new Error(`Compilation Error:\n\n${errors.join('\n')}\n\nFix the syntax errors in your Java code.`);
      }
      throw new Error(`Compilation Error: ${errorMessage}`);
    }
    
    // Run
    const { stdout, stderr } = await execPromise(`java -cp "${tempDir}" Main`, {
      timeout: 5000,
      cwd: tempDir
    });

    if (stderr) {
      // Parse Java runtime errors
      if (stderr.includes('Exception in thread')) {
        if (stderr.includes('NullPointerException')) {
          throw new Error(`Runtime Error: NullPointerException\n\n${stderr}\n\nYou're trying to access a null object.`);
        } else if (stderr.includes('ArrayIndexOutOfBoundsException')) {
          throw new Error(`Runtime Error: ArrayIndexOutOfBoundsException\n\n${stderr}\n\nYou're trying to access an array index that doesn't exist.`);
        } else if (stderr.includes('StackOverflowError')) {
          throw new Error(`Runtime Error: StackOverflowError\n\nYour recursive function is calling itself too many times. Check your base case.`);
        } else if (stderr.includes('OutOfMemoryError')) {
          throw new Error(`Runtime Error: OutOfMemoryError\n\nYour code is using too much memory. Optimize your algorithm.`);
        } else if (stderr.includes('ArithmeticException')) {
          throw new Error(`Runtime Error: ArithmeticException\n\n${stderr}\n\nArithmetic error (possibly division by zero).`);
        } else if (stderr.includes('ClassCastException')) {
          throw new Error(`Runtime Error: ClassCastException\n\n${stderr}\n\nInvalid type casting.`);
        } else {
          throw new Error(`Runtime Error: ${stderr}`);
        }
      }
      throw new Error(`Runtime Error: ${stderr}`);
    }

    const result = JSON.parse(stdout.trim());
    return result;
  } catch (error) {
    if (error.killed) {
      throw new Error('Time Limit Exceeded\n\nYour code took longer than 5 seconds to execute. Optimize your algorithm.');
    }
    if (error.message.startsWith('Compilation Error') || error.message.startsWith('Runtime Error')) {
      throw error;
    }
    throw new Error(`Runtime Error: ${error.message}`);
  } finally {
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
    } catch (e) {
      // Ignore cleanup errors
    }
  }
}

// Execute C++ code with detailed error handling
async function executeCpp(code, input) {
  const tempDir = path.join(os.tmpdir(), `leetcode_${Date.now()}`);
  const cppFile = path.join(tempDir, 'solution.cpp');
  const outputFile = path.join(tempDir, 'solution.exe');
  
  try {
    await fs.mkdir(tempDir, { recursive: true });
    
    // Parse input string to extract values
    let nums, target;
    
    // Handle different input formats
    if (input.includes('], ')) {
      // Format: "[2,7,11,15], 9"
      const parts = input.split('], ');
      nums = JSON.parse(parts[0] + ']');
      target = parseInt(parts[1].replace(/\D/g, '')); // Extract only digits
    } else if (input.includes(', target = ')) {
      // Format: "[2,7,11,15], target = 9"
      const parts = input.split(', target = ');
      nums = JSON.parse(parts[0]);
      target = parseInt(parts[1]);
    } else {
      // Try to match pattern: [array], number
      const arrayTargetMatch = input.match(/\[([^\]]+)\],\s*(?:target\s*=\s*)?(\d+)/);
      if (arrayTargetMatch) {
        nums = JSON.parse(`[${arrayTargetMatch[1]}]`);
        target = parseInt(arrayTargetMatch[2]);
      } else {
        // Fallback
        try {
          const parsed = JSON.parse(`[${input}]`);
          nums = parsed[0];
          target = parsed[1];
        } catch (e) {
          nums = JSON.parse(input);
          target = 0;
        }
      }
    }

    const wrappedCode = `
#include <iostream>
#include <vector>
using namespace std;

${code}

int main() {
    Solution solution;
    vector<int> nums = {${nums.join(', ')}};
    int target = ${target};
    vector<int> result = solution.twoSum(nums, target);
    
    cout << "[";
    for (int i = 0; i < result.size(); i++) {
        cout << result[i];
        if (i < result.size() - 1) cout << ",";
    }
    cout << "]" << endl;
    
    return 0;
}
`;

    await fs.writeFile(cppFile, wrappedCode);
    
    // Compile
    const compileCmd = process.platform === 'win32' 
      ? `g++ "${cppFile}" -o "${outputFile}"` 
      : `g++ "${cppFile}" -o "${outputFile}"`;
    
    try {
      await execPromise(compileCmd, { 
        timeout: 5000,
        cwd: tempDir 
      });
    } catch (compileError) {
      const errorMessage = compileError.stderr || compileError.message;
      
      if (errorMessage.includes('error:')) {
        // Extract specific compilation errors
        const errors = errorMessage.split('\n').filter(line => line.includes('error:'));
        throw new Error(`Compilation Error:\n\n${errors.join('\n')}\n\nFix the syntax errors in your C++ code.`);
      }
      throw new Error(`Compilation Error: ${errorMessage}`);
    }
    
    // Run
    const runCmd = process.platform === 'win32' 
      ? `"${outputFile}"` 
      : outputFile;
      
    const { stdout, stderr } = await execPromise(runCmd, {
      timeout: 5000,
      cwd: tempDir
    });

    if (stderr && !stderr.includes('warning')) {
      // Parse C++ runtime errors
      if (stderr.includes('segmentation fault') || stderr.includes('SIGSEGV')) {
        throw new Error(`Runtime Error: Segmentation Fault\n\nYou're trying to access memory that doesn't belong to your program. Common causes:\n- Array index out of bounds\n- Dereferencing null pointer\n- Stack overflow from infinite recursion`);
      } else if (stderr.includes('abort') || stderr.includes('SIGABRT')) {
        throw new Error(`Runtime Error: Program Aborted\n\n${stderr}\n\nYour program was terminated abnormally.`);
      } else if (stderr.includes('floating point exception') || stderr.includes('SIGFPE')) {
        throw new Error(`Runtime Error: Floating Point Exception\n\nArithmetic error (possibly division by zero).`);
      } else {
        throw new Error(`Runtime Error: ${stderr}`);
      }
    }

    const result = JSON.parse(stdout.trim());
    return result;
  } catch (error) {
    if (error.killed) {
      throw new Error('Time Limit Exceeded\n\nYour code took longer than 5 seconds to execute. Optimize your algorithm.');
    }
    if (error.message.startsWith('Compilation Error') || error.message.startsWith('Runtime Error')) {
      throw error;
    }
    throw new Error(`Runtime Error: ${error.message}`);
  } finally {
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
    } catch (e) {
      // Ignore cleanup errors
    }
  }
}

// Compare outputs
function compareOutput(actual, expected) {
  // Convert both to strings for comparison, removing spaces
  const actualStr = JSON.stringify(actual).replace(/\s/g, '');
  let expectedStr;
  
  if (typeof expected === 'string') {
    // If expected is already a string, try to parse it first, then stringify to normalize
    try {
      const parsed = JSON.parse(expected);
      expectedStr = JSON.stringify(parsed).replace(/\s/g, '');
    } catch (e) {
      // If parsing fails, treat as string and remove spaces
      expectedStr = expected.replace(/\s/g, '');
    }
  } else {
    expectedStr = JSON.stringify(expected).replace(/\s/g, '');
  }
  
  return actualStr === expectedStr;
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

// User tracking functions
function trackUserRun(userId, problemId, language, results) {
  if (!problemAttempts.has(userId)) {
    problemAttempts.set(userId, new Map());
  }
  
  const userProblems = problemAttempts.get(userId);
  if (!userProblems.has(problemId)) {
    userProblems.set(problemId, []);
  }
  
  userProblems.get(problemId).push({
    type: 'run',
    language,
    passed: results.every(r => r.passed),
    timestamp: new Date().toISOString()
  });
}

function saveUserSubmission(userId, submission) {
  if (!userSubmissions.has(userId)) {
    userSubmissions.set(userId, []);
  }
  
  userSubmissions.get(userId).push(submission);
  
  // Keep only last 100 submissions per user
  const submissions = userSubmissions.get(userId);
  if (submissions.length > 100) {
    userSubmissions.set(userId, submissions.slice(-100));
  }
}

function updateUserStats(userId, submission) {
  if (!userStats.has(userId)) {
    userStats.set(userId, {
      totalSubmissions: 0,
      acceptedSubmissions: 0,
      solvedProblems: new Set(),
      totalRuns: 0,
      languagesUsed: new Set(),
      avgRuntime: 0,
      avgMemory: 0,
      bestRuntime: Infinity,
      streak: 0,
      lastSubmissionDate: null,
      problemsByDifficulty: {
        easy: 0,
        medium: 0,
        hard: 0
      }
    });
  }
  
  const stats = userStats.get(userId);
  
  stats.totalSubmissions++;
  stats.languagesUsed.add(submission.language);
  
  if (submission.accepted) {
    stats.acceptedSubmissions++;
    stats.solvedProblems.add(submission.problemId);
    stats.bestRuntime = Math.min(stats.bestRuntime, submission.runtime);
  }
  
  // Update streak
  const today = new Date().toDateString();
  const lastDate = stats.lastSubmissionDate ? new Date(stats.lastSubmissionDate).toDateString() : null;
  
  if (lastDate === today) {
    // Same day, no change
  } else if (lastDate === new Date(Date.now() - 86400000).toDateString()) {
    // Yesterday, increment streak
    stats.streak++;
  } else if (lastDate) {
    // Streak broken
    stats.streak = 1;
  } else {
    // First submission
    stats.streak = 1;
  }
  
  stats.lastSubmissionDate = new Date().toISOString();
  
  // Update averages
  const allSubmissions = userSubmissions.get(userId) || [];
  const acceptedSubs = allSubmissions.filter(s => s.accepted);
  
  if (acceptedSubs.length > 0) {
    stats.avgRuntime = Math.round(
      acceptedSubs.reduce((sum, s) => sum + s.runtime, 0) / acceptedSubs.length
    );
    stats.avgMemory = Math.round(
      acceptedSubs.reduce((sum, s) => sum + s.memory, 0) / acceptedSubs.length
    );
  }
}

function saveBestSolution(userId, problemId, submission) {
  if (!userSolutions.has(userId)) {
    userSolutions.set(userId, new Map());
  }
  
  const solutions = userSolutions.get(userId);
  const existing = solutions.get(problemId);
  
  // Save if no existing solution or if this one is faster
  if (!existing || submission.runtime < existing.runtime) {
    solutions.set(problemId, {
      code: submission.code,
      language: submission.language,
      runtime: submission.runtime,
      memory: submission.memory,
      timestamp: submission.timestamp
    });
  }
}

function getUserStats(userId) {
  const stats = userStats.get(userId);
  if (!stats) {
    return {
      totalSubmissions: 0,
      acceptedSubmissions: 0,
      solvedProblems: 0,
      totalRuns: 0,
      languagesUsed: [],
      avgRuntime: 0,
      avgMemory: 0,
      bestRuntime: null,
      streak: 0,
      acceptanceRate: 0
    };
  }
  
  return {
    totalSubmissions: stats.totalSubmissions,
    acceptedSubmissions: stats.acceptedSubmissions,
    solvedProblems: stats.solvedProblems.size,
    totalRuns: stats.totalRuns,
    languagesUsed: Array.from(stats.languagesUsed),
    avgRuntime: stats.avgRuntime,
    avgMemory: stats.avgMemory,
    bestRuntime: stats.bestRuntime === Infinity ? null : stats.bestRuntime,
    streak: stats.streak,
    acceptanceRate: stats.totalSubmissions > 0 
      ? ((stats.acceptedSubmissions / stats.totalSubmissions) * 100).toFixed(1)
      : 0,
    lastSubmissionDate: stats.lastSubmissionDate
  };
}

function generateSubmissionId() {
  return `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// User-based API endpoints

// Get user statistics
router.get('/user/:userId/stats', (req, res) => {
  const { userId } = req.params;
  const stats = getUserStats(userId);
  
  res.json({
    success: true,
    userId,
    stats
  });
});

// Get user submission history
router.get('/user/:userId/submissions', (req, res) => {
  const { userId } = req.params;
  const { limit = 20, offset = 0 } = req.query;
  
  const submissions = userSubmissions.get(userId) || [];
  const paginatedSubmissions = submissions
    .slice()
    .reverse()
    .slice(offset, offset + parseInt(limit));
  
  res.json({
    success: true,
    userId,
    total: submissions.length,
    submissions: paginatedSubmissions.map(s => ({
      submissionId: s.submissionId,
      problemId: s.problemId,
      language: s.language,
      accepted: s.accepted,
      runtime: s.runtime,
      memory: s.memory,
      timestamp: s.timestamp
    }))
  });
});

// Get user's best solution for a problem
router.get('/user/:userId/problem/:problemId/solution', (req, res) => {
  const { userId, problemId } = req.params;
  
  const solutions = userSolutions.get(userId);
  const solution = solutions ? solutions.get(problemId) : null;
  
  if (!solution) {
    return res.status(404).json({
      success: false,
      message: 'No solution found for this problem'
    });
  }
  
  res.json({
    success: true,
    userId,
    problemId,
    solution
  });
});

// Get user's problem attempts
router.get('/user/:userId/problem/:problemId/attempts', (req, res) => {
  const { userId, problemId } = req.params;
  
  const userProblems = problemAttempts.get(userId);
  const attempts = userProblems ? userProblems.get(problemId) : null;
  
  res.json({
    success: true,
    userId,
    problemId,
    totalAttempts: attempts ? attempts.length : 0,
    attempts: attempts || []
  });
});

// Get leaderboard
router.get('/leaderboard', (req, res) => {
  const { limit = 10, sortBy = 'solvedProblems' } = req.query;
  
  const leaderboard = Array.from(userStats.entries())
    .map(([userId, stats]) => ({
      userId,
      solvedProblems: stats.solvedProblems.size,
      acceptedSubmissions: stats.acceptedSubmissions,
      totalSubmissions: stats.totalSubmissions,
      streak: stats.streak,
      avgRuntime: stats.avgRuntime,
      acceptanceRate: stats.totalSubmissions > 0 
        ? ((stats.acceptedSubmissions / stats.totalSubmissions) * 100).toFixed(1)
        : 0
    }))
    .sort((a, b) => {
      if (sortBy === 'solvedProblems') return b.solvedProblems - a.solvedProblems;
      if (sortBy === 'streak') return b.streak - a.streak;
      if (sortBy === 'acceptanceRate') return parseFloat(b.acceptanceRate) - parseFloat(a.acceptanceRate);
      return b.acceptedSubmissions - a.acceptedSubmissions;
    })
    .slice(0, parseInt(limit));
  
  res.json({
    success: true,
    leaderboard
  });
});

// Delete user data (GDPR compliance)
router.delete('/user/:userId', (req, res) => {
  const { userId } = req.params;
  
  userSubmissions.delete(userId);
  userStats.delete(userId);
  problemAttempts.delete(userId);
  userSolutions.delete(userId);
  
  res.json({
    success: true,
    message: 'User data deleted successfully'
  });
});

module.exports = router;
