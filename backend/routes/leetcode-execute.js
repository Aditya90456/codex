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
    // Parse input - handle different formats
    let parsedArgs = [];
    
    try {
      if (input.startsWith('"') && input.endsWith('"')) {
        // String input
        parsedArgs = [input.slice(1, -1)];
      } else if (input.includes('], ')) {
        // Array with additional param
        const parts = input.split('], ');
        const array = JSON.parse(parts[0] + ']');
        const secondParam = parseInt(parts[1].replace(/[^\d-]/g, ''));
        parsedArgs = [array, secondParam];
      } else if (input.includes(', target = ')) {
        // Array with target
        const parts = input.split(', target = ');
        parsedArgs = [JSON.parse(parts[0]), parseInt(parts[1])];
      } else if (input.startsWith('[') && input.endsWith(']')) {
        // Single array
        parsedArgs = [JSON.parse(input)];
      } else if (input.includes(',')) {
        // Multiple comma-separated values
        const parts = input.split(',').map(p => p.trim());
        parsedArgs = parts.map(p => {
          try {
            return JSON.parse(p);
          } catch {
            return p.replace(/^["']|["']$/g, '');
          }
        });
      } else {
        // Single value
        try {
          parsedArgs = [JSON.parse(input)];
        } catch {
          parsedArgs = [input.replace(/^["']|["']$/g, '')];
        }
      }
    } catch (e) {
      parsedArgs = [input];
    }

    // Generic wrapper that auto-detects function
    const wrappedCode = `
      ${code}
      
      // Parse arguments
      const args = ${JSON.stringify(parsedArgs)};
      
      // Auto-detect function to call
      let result = null;
      
      // Check for class-based solution
      if (typeof Solution !== 'undefined') {
        const sol = new Solution();
        const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(sol))
          .filter(name => name !== 'constructor' && typeof sol[name] === 'function');
        
        if (methods.length > 0) {
          const methodName = methods[0];
          result = sol[methodName](...args);
        }
      } else {
        // Look for standalone functions
        const functionNames = Object.keys(this).filter(key => 
          typeof this[key] === 'function' && 
          !key.startsWith('_') &&
          key !== 'console'
        );
        
        if (functionNames.length > 0) {
          const funcName = functionNames[0];
          result = this[funcName](...args);
        }
      }
      
      result;
    `;

    const result = vm.run(wrappedCode);
    return result;
  } catch (error) {
    const errorMessage = error.message;
    
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
  // Use web-based Python execution (no local Python needed!)
  console.log('🌐 Using web-based Python compiler (no Python installation required)');
  
  try {
    const fetch = require('node-fetch');
    
    // Parse input - handle different input formats
    let parsedArgs = [];
    
    try {
      // Try to detect input type and parse accordingly
      if (input.startsWith('"') && input.endsWith('"')) {
        // String input like "abcabcbb"
        parsedArgs = [input.slice(1, -1)];
      } else if (input.includes('], ')) {
        // Array with additional param like "[2,7,11,15], 9"
        const parts = input.split('], ');
        const array = JSON.parse(parts[0] + ']');
        const secondParam = parts[1].replace(/[^\d-]/g, '');
        parsedArgs = [array, parseInt(secondParam)];
      } else if (input.includes(', target = ')) {
        // Array with target like "[2,7,11,15], target = 9"
        const parts = input.split(', target = ');
        parsedArgs = [JSON.parse(parts[0]), parseInt(parts[1])];
      } else if (input.startsWith('[') && input.endsWith(']')) {
        // Single array input
        parsedArgs = [JSON.parse(input)];
      } else if (input.includes(',')) {
        // Multiple comma-separated values
        const parts = input.split(',').map(p => p.trim());
        parsedArgs = parts.map(p => {
          try {
            return JSON.parse(p);
          } catch {
            return p.replace(/^["']|["']$/g, '');
          }
        });
      } else {
        // Single value
        try {
          parsedArgs = [JSON.parse(input)];
        } catch {
          parsedArgs = [input.replace(/^["']|["']$/g, '')];
        }
      }
    } catch (e) {
      console.error('Input parsing error:', e);
      parsedArgs = [input];
    }

    // Build generic Python wrapper that auto-detects function
    const wrappedCode = `
import json
import sys
import inspect

${code}

# Parse arguments
args = ${JSON.stringify(parsedArgs)}

# Auto-detect function to call
result = None

# Check if Solution class exists
if 'Solution' in dir():
    sol = Solution()
    # Get all methods of Solution class
    methods = [method for method in dir(sol) if not method.startswith('_')]
    
    if methods:
        # Use the first public method found
        method_name = methods[0]
        method = getattr(sol, method_name)
        
        # Call with appropriate number of arguments
        try:
            if len(args) == 1:
                result = method(args[0])
            elif len(args) == 2:
                result = method(args[0], args[1])
            elif len(args) == 3:
                result = method(args[0], args[1], args[2])
            else:
                result = method(*args)
        except TypeError as e:
            # Try unpacking if single arg is a list
            if len(args) == 1 and isinstance(args[0], list):
                result = method(*args[0])
            else:
                raise e
else:
    # Look for standalone functions
    functions = [name for name in dir() if callable(eval(name)) and not name.startswith('_') and name not in ['json', 'sys', 'inspect']]
    
    if functions:
        # Use the first function found
        func_name = functions[0]
        func = eval(func_name)
        
        # Call with appropriate number of arguments
        try:
            if len(args) == 1:
                result = func(args[0])
            elif len(args) == 2:
                result = func(args[0], args[1])
            elif len(args) == 3:
                result = func(args[0], args[1], args[2])
            else:
                result = func(*args)
        except TypeError as e:
            # Try unpacking if single arg is a list
            if len(args) == 1 and isinstance(args[0], list):
                result = func(*args[0])
            else:
                raise e

# Output result as JSON
print(json.dumps(result))
`;

    // Use Piston API
    const response = await fetch('https://emkc.org/api/v2/piston/execute', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        language: 'python',
        version: '3.10.0',
        files: [{
          content: wrappedCode
        }]
      }),
      timeout: 10000
    });

    const result = await response.json();
    
    // Check for runtime errors
    if (result.run && result.run.code !== 0) {
      const errorMsg = result.run.stderr || result.run.output;
      
      if (errorMsg.includes('SyntaxError')) {
        const lineMatch = errorMsg.match(/line (\d+)/);
        throw new Error(`Compilation Error: SyntaxError on line ${lineMatch ? lineMatch[1] : 'unknown'}\n\n${errorMsg}\n\nCheck your Python syntax.`);
      } else if (errorMsg.includes('IndentationError')) {
        throw new Error(`Compilation Error: IndentationError\n\n${errorMsg}\n\nPython requires consistent indentation.`);
      } else if (errorMsg.includes('NameError')) {
        const match = errorMsg.match(/name '(\w+)' is not defined/);
        const varName = match ? match[1] : 'variable';
        throw new Error(`Runtime Error: NameError - '${varName}' is not defined\n\nMake sure all variables are defined before use.`);
      } else if (errorMsg.includes('TypeError')) {
        throw new Error(`Runtime Error: TypeError\n\n${errorMsg}\n\nCheck your data types and function arguments.`);
      } else if (errorMsg.includes('IndexError')) {
        throw new Error(`Runtime Error: IndexError - list index out of range\n\n${errorMsg}`);
      } else if (errorMsg.includes('KeyError')) {
        throw new Error(`Runtime Error: KeyError\n\n${errorMsg}`);
      } else if (errorMsg.includes('RecursionError')) {
        throw new Error(`Runtime Error: RecursionError - Maximum recursion depth exceeded\n\nCheck your base case.`);
      } else if (errorMsg.includes('ZeroDivisionError')) {
        throw new Error(`Runtime Error: ZeroDivisionError - Division by zero`);
      } else {
        throw new Error(`Runtime Error: ${errorMsg}`);
      }
    }

    // Parse output
    if (result.run && result.run.stdout) {
      const output = result.run.stdout.trim();
      try {
        return JSON.parse(output);
      } catch (e) {
        return output;
      }
    }

    throw new Error('No output from Python compiler');
    
  } catch (error) {
    if (error.message.startsWith('Compilation Error') || error.message.startsWith('Runtime Error')) {
      throw error;
    }
    throw new Error(`Python Execution Error: ${error.message}\n\n💡 Python is running in web-based mode (no local installation needed!)`);
  }
}

// Execute Java code with detailed error handling
async function executeJava(code, input) {
  // Use web-based Java execution (no local JDK needed!)
  console.log('🌐 Using web-based Java compiler (no JDK installation required)');
  
  try {
    const fetch = require('node-fetch');
    
    // Parse input - handle different formats
    let parsedArgs = [];
    
    try {
      if (input.startsWith('"') && input.endsWith('"')) {
        // String input
        parsedArgs = [input.slice(1, -1)];
      } else if (input.includes('], ')) {
        // Array with additional param
        const parts = input.split('], ');
        const array = JSON.parse(parts[0] + ']');
        const secondParam = parseInt(parts[1].replace(/[^\d-]/g, ''));
        parsedArgs = [array, secondParam];
      } else if (input.includes(', target = ')) {
        // Array with target
        const parts = input.split(', target = ');
        parsedArgs = [JSON.parse(parts[0]), parseInt(parts[1])];
      } else if (input.startsWith('[') && input.endsWith(']')) {
        // Single array
        parsedArgs = [JSON.parse(input)];
      } else if (input.includes(',')) {
        // Multiple comma-separated values
        const parts = input.split(',').map(p => p.trim());
        parsedArgs = parts.map(p => {
          try {
            return JSON.parse(p);
          } catch {
            return p.replace(/^["']|["']$/g, '');
          }
        });
      } else {
        // Single value
        try {
          parsedArgs = [JSON.parse(input)];
        } catch {
          parsedArgs = [input.replace(/^["']|["']$/g, '')];
        }
      }
    } catch (e) {
      parsedArgs = [input];
    }

    // Build Java code with reflection to auto-detect method
    const wrappedCode = `
import java.util.*;
import java.lang.reflect.*;
import com.google.gson.*;

${code}

class Main {
    public static void main(String[] args) {
        try {
            Solution solution = new Solution();
            Gson gson = new Gson();
            
            // Parse arguments from JSON
            String argsJson = ${JSON.stringify(JSON.stringify(parsedArgs))};
            JsonArray jsonArgs = JsonParser.parseString(argsJson).getAsJsonArray();
            
            // Get all public methods of Solution class
            Method[] methods = Solution.class.getDeclaredMethods();
            Method targetMethod = null;
            
            for (Method method : methods) {
                if (Modifier.isPublic(method.getModifiers()) && !method.getName().equals("main")) {
                    targetMethod = method;
                    break;
                }
            }
            
            if (targetMethod == null) {
                System.out.println("Error: No public method found in Solution class");
                return;
            }
            
            // Prepare arguments based on method parameters
            Class<?>[] paramTypes = targetMethod.getParameterTypes();
            Object[] methodArgs = new Object[paramTypes.length];
            
            for (int i = 0; i < paramTypes.length && i < jsonArgs.size(); i++) {
                JsonElement arg = jsonArgs.get(i);
                
                if (paramTypes[i] == int.class) {
                    methodArgs[i] = arg.getAsInt();
                } else if (paramTypes[i] == String.class) {
                    methodArgs[i] = arg.getAsString();
                } else if (paramTypes[i] == int[].class) {
                    JsonArray arr = arg.getAsJsonArray();
                    int[] intArr = new int[arr.size()];
                    for (int j = 0; j < arr.size(); j++) {
                        intArr[j] = arr.get(j).getAsInt();
                    }
                    methodArgs[i] = intArr;
                } else if (paramTypes[i] == String[].class) {
                    JsonArray arr = arg.getAsJsonArray();
                    String[] strArr = new String[arr.size()];
                    for (int j = 0; j < arr.size(); j++) {
                        strArr[j] = arr.get(j).getAsString();
                    }
                    methodArgs[i] = strArr;
                }
            }
            
            // Invoke method
            Object result = targetMethod.invoke(solution, methodArgs);
            
            // Print result as JSON
            System.out.println(gson.toJson(result));
            
        } catch (Exception e) {
            System.err.println("Error: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
`;

    // Use Piston API
    const response = await fetch('https://emkc.org/api/v2/piston/execute', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        language: 'java',
        version: '15.0.2',
        files: [{
          name: 'Main.java',
          content: wrappedCode
        }]
      }),
      timeout: 10000
    });

    const result = await response.json();
    
    // Check for compilation errors
    if (result.compile && result.compile.code !== 0) {
      const errorMsg = result.compile.stderr || result.compile.output;
      if (errorMsg.includes('error:')) {
        const errors = errorMsg.split('\n').filter(line => line.includes('error:')).slice(0, 5);
        throw new Error(`Compilation Error:\n\n${errors.join('\n')}\n\nFix the syntax errors in your Java code.`);
      }
      throw new Error(`Compilation Error: ${errorMsg}`);
    }

    // Check for runtime errors
    if (result.run && result.run.code !== 0) {
      const errorMsg = result.run.stderr || result.run.output;
      
      if (errorMsg.includes('NullPointerException')) {
        throw new Error(`Runtime Error: NullPointerException\n\n${errorMsg}\n\nYou're trying to access a null object.`);
      } else if (errorMsg.includes('ArrayIndexOutOfBoundsException')) {
        throw new Error(`Runtime Error: ArrayIndexOutOfBoundsException\n\n${errorMsg}\n\nArray index out of bounds.`);
      } else if (errorMsg.includes('StackOverflowError')) {
        throw new Error(`Runtime Error: StackOverflowError\n\nRecursive function calling itself too many times.`);
      } else if (errorMsg.includes('ArithmeticException')) {
        throw new Error(`Runtime Error: ArithmeticException\n\n${errorMsg}`);
      } else {
        throw new Error(`Runtime Error: ${errorMsg}`);
      }
    }

    // Parse output
    if (result.run && result.run.stdout) {
      const output = result.run.stdout.trim();
      try {
        return JSON.parse(output);
      } catch (e) {
        return output;
      }
    }

    throw new Error('No output from Java compiler');
    
  } catch (error) {
    if (error.message.startsWith('Compilation Error') || error.message.startsWith('Runtime Error')) {
      throw error;
    }
    throw new Error(`Java Execution Error: ${error.message}\n\n💡 Java is running in web-based mode (no JDK installation needed!)`);
  }
}

// Execute C++ code with detailed error handling using web-based compiler
async function executeCpp(code, input) {
  // Use online C++ compiler API (no local g++ needed!)
  console.log('🌐 Using web-based C++ compiler (no g++ installation required)');
  
  try {
    const fetch = require('node-fetch');
    
    // Parse input - handle different formats
    let parsedArgs = [];
    
    try {
      if (input.startsWith('"') && input.endsWith('"')) {
        // String input
        parsedArgs = [input.slice(1, -1)];
      } else if (input.includes('], ')) {
        // Array with additional param
        const parts = input.split('], ');
        const array = JSON.parse(parts[0] + ']');
        const secondParam = parseInt(parts[1].replace(/[^\d-]/g, ''));
        parsedArgs = [array, secondParam];
      } else if (input.includes(', target = ')) {
        // Array with target
        const parts = input.split(', target = ');
        parsedArgs = [JSON.parse(parts[0]), parseInt(parts[1])];
      } else if (input.startsWith('[') && input.endsWith(']')) {
        // Single array
        parsedArgs = [JSON.parse(input)];
      } else if (input.includes(',')) {
        // Multiple comma-separated values
        const parts = input.split(',').map(p => p.trim());
        parsedArgs = parts.map(p => {
          try {
            return JSON.parse(p);
          } catch {
            return p.replace(/^["']|["']$/g, '');
          }
        });
      } else {
        // Single value
        try {
          parsedArgs = [JSON.parse(input)];
        } catch {
          parsedArgs = [input.replace(/^["']|["']$/g, '')];
        }
      }
    } catch (e) {
      parsedArgs = [input];
    }

    // Extract method name and return type from user code using regex
    const methodMatch = code.match(/(vector<int>|vector<string>|int|string|bool|double|float|long|ListNode\*|TreeNode\*)\s+(\w+)\s*\(/);
    const returnType = methodMatch ? methodMatch[1] : 'auto';
    const methodName = methodMatch ? methodMatch[2] : 'solve';

    // Build arguments based on parsed input
    let argsCode = '';
    let callArgs = '';
    
    if (parsedArgs.length === 1 && Array.isArray(parsedArgs[0])) {
      // Single array argument
      argsCode = `vector<int> arg1 = {${parsedArgs[0].join(', ')}};`;
      callArgs = 'arg1';
    } else if (parsedArgs.length === 2) {
      // Two arguments (e.g., array and target)
      if (Array.isArray(parsedArgs[0])) {
        argsCode = `vector<int> arg1 = {${parsedArgs[0].join(', ')}};\n    int arg2 = ${parsedArgs[1]};`;
        callArgs = 'arg1, arg2';
      } else {
        argsCode = `int arg1 = ${parsedArgs[0]};\n    int arg2 = ${parsedArgs[1]};`;
        callArgs = 'arg1, arg2';
      }
    } else if (parsedArgs.length === 1 && typeof parsedArgs[0] === 'string') {
      // String argument
      argsCode = `string arg1 = "${parsedArgs[0]}";`;
      callArgs = 'arg1';
    } else {
      // Default: treat as integers
      argsCode = parsedArgs.map((arg, i) => `int arg${i+1} = ${arg};`).join('\n    ');
      callArgs = parsedArgs.map((_, i) => `arg${i+1}`).join(', ');
    }

    // Determine output code based on return type
    let outputCode = '';
    if (returnType.includes('vector')) {
      // Vector return type
      outputCode = `
    // Print vector result
    cout << "[";
    if (result.size() > 0) {
        for (size_t i = 0; i < result.size(); i++) {
            cout << result[i];
            if (i < result.size() - 1) cout << ",";
        }
    }
    cout << "]" << endl;`;
    } else if (returnType === 'bool') {
      // Boolean return type
      outputCode = `
    // Print boolean result
    cout << (result ? "true" : "false") << endl;`;
    } else if (returnType === 'string') {
      // String return type
      outputCode = `
    // Print string result
    cout << "\\"" << result << "\\"" << endl;`;
    } else {
      // Numeric return type (int, double, float, long)
      outputCode = `
    // Print numeric result
    cout << result << endl;`;
    }

    // Wrap code with main function and all common headers
    const wrappedCode = `
#include <iostream>
#include <vector>
#include <unordered_map>
#include <unordered_set>
#include <map>
#include <set>
#include <queue>
#include <stack>
#include <algorithm>
#include <string>
#include <cmath>
using namespace std;

${code}

int main() {
    Solution solution;
    ${argsCode}
    auto result = solution.${methodName}(${callArgs});
    ${outputCode}
    
    return 0;
}
`;

    // Use Piston API (free, no API key needed!)
    const response = await fetch('https://emkc.org/api/v2/piston/execute', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        language: 'c++',
        version: '10.2.0',
        files: [{
          content: wrappedCode
        }]
      }),
      timeout: 10000
    });

    const result = await response.json();
    
    // Check for compilation errors
    if (result.compile && result.compile.code !== 0) {
      const errorMsg = result.compile.stderr || result.compile.output;
      if (errorMsg.includes('error:')) {
        const errors = errorMsg.split('\n').filter(line => line.includes('error:')).slice(0, 5);
        throw new Error(`Compilation Error:\n\n${errors.join('\n')}\n\nFix the syntax errors in your C++ code.`);
      }
      throw new Error(`Compilation Error: ${errorMsg}`);
    }

    // Check for runtime errors
    if (result.run && result.run.code !== 0) {
      const errorMsg = result.run.stderr || result.run.output;
      
      if (errorMsg.includes('Segmentation fault') || errorMsg.includes('SIGSEGV')) {
        throw new Error(`Runtime Error: Segmentation Fault\n\nYou're trying to access memory that doesn't belong to your program. Common causes:\n- Array index out of bounds\n- Dereferencing null pointer\n- Stack overflow from infinite recursion`);
      } else if (errorMsg.includes('abort') || errorMsg.includes('SIGABRT')) {
        throw new Error(`Runtime Error: Program Aborted\n\n${errorMsg}\n\nYour program was terminated abnormally.`);
      } else if (errorMsg.includes('floating point exception') || errorMsg.includes('SIGFPE')) {
        throw new Error(`Runtime Error: Floating Point Exception\n\nArithmetic error (possibly division by zero).`);
      } else {
        throw new Error(`Runtime Error: ${errorMsg}`);
      }
    }

    // Parse output
    if (result.run && result.run.stdout) {
      const output = result.run.stdout.trim();
      
      try {
        return JSON.parse(output);
      } catch (e) {
        // If output isn't JSON, return as is
        return output;
      }
    }

    throw new Error('No output from C++ compiler');
    
  } catch (error) {
    if (error.message.startsWith('Compilation Error') || error.message.startsWith('Runtime Error')) {
      throw error;
    }
    
    // Fallback: Show helpful message about using online compiler
    throw new Error(`C++ Execution Error: ${error.message}

💡 C++ is running in web-based mode (no local installation needed!)

If you're experiencing issues, try:
1. Using JavaScript or Python instead
2. Testing your code at: https://www.onlinegdb.com/online_c++_compiler
3. Checking your C++ syntax

Your code is being compiled online, so it may take a few seconds.`);
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
