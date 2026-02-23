// Enhanced Test Case Runner with Comprehensive Test Coverage
// Supports 150+ DSA problems with real test cases and syntax validation

import { executeCode } from './codeExecutionService';
import { getTestCasesForProblem, hasTestCases } from './comprehensiveTestCases';

/**
 * Enhanced Test Runner with syntax validation and comprehensive test coverage
 */
export class EnhancedTestRunner {
  constructor(problem, language, code) {
    this.problem = problem;
    this.language = language;
    this.code = code;
    this.results = [];
    this.syntaxErrors = [];
  }
  
  /**
   * Validate code syntax before execution
   */
  validateSyntax() {
    const errors = [];
    
    if (!this.code || this.code.trim().length === 0) {
      errors.push({
        type: 'error',
        message: 'Code cannot be empty',
        line: 0
      });
      return { valid: false, errors };
    }
    
    if (this.language === 'javascript') {
      // Check for balanced braces
      const openBraces = (this.code.match(/{/g) || []).length;
      const closeBraces = (this.code.match(/}/g) || []).length;
      if (openBraces !== closeBraces) {
        errors.push({
          type: 'error',
          message: `Mismatched braces: ${openBraces} opening '{', ${closeBraces} closing '}'`,
          line: null
        });
      }
      
      // Check for balanced parentheses
      const openParens = (this.code.match(/\(/g) || []).length;
      const closeParens = (this.code.match(/\)/g) || []).length;
      if (openParens !== closeParens) {
        errors.push({
          type: 'error',
          message: `Mismatched parentheses: ${openParens} opening '(', ${closeParens} closing ')'`,
          line: null
        });
      }
      
      // Check for balanced brackets
      const openBrackets = (this.code.match(/\[/g) || []).length;
      const closeBrackets = (this.code.match(/\]/g) || []).length;
      if (openBrackets !== closeBrackets) {
        errors.push({
          type: 'error',
          message: `Mismatched brackets: ${openBrackets} opening '[', ${closeBrackets} closing ']'`,
          line: null
        });
      }
      
      // Check for function definition
      if (!this.code.includes('function') && !this.code.includes('=>') && !this.code.includes('class')) {
        errors.push({
          type: 'warning',
          message: 'No function definition found. Make sure you define the required function.',
          line: null
        });
      }
      
      // Try to parse with Function constructor
      try {
        new Function(this.code);
      } catch (e) {
        const match = e.message.match(/line (\d+)/);
        errors.push({
          type: 'error',
          message: `JavaScript Syntax Error: ${e.message}`,
          line: match ? parseInt(match[1]) : null
        });
      }
    }
    
    if (this.language === 'python') {
      // Check for function/class definition
      if (!this.code.includes('def ') && !this.code.includes('class ')) {
        errors.push({
          type: 'warning',
          message: 'No function or class definition found',
          line: null
        });
      }
      
      // Check indentation
      const lines = this.code.split('\n');
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.trim().length > 0 && !line.trim().startsWith('#')) {
          const spaces = line.match(/^\s*/)[0].length;
          if (spaces > 0 && spaces % 4 !== 0) {
            errors.push({
              type: 'warning',
              message: `Inconsistent indentation (use 4 spaces)`,
              line: i + 1
            });
            break;
          }
        }
      }
      
      // Check for common syntax issues
      if (this.code.includes('print(') && !this.code.includes('return')) {
        errors.push({
          type: 'warning',
          message: 'Function should return a value, not print it',
          line: null
        });
      }
    }
    
    this.syntaxErrors = errors;
    return { valid: errors.filter(e => e.type === 'error').length === 0, errors };
  }

  /**
   * Generate comprehensive test cases for a problem
   */
  generateTestCases() {
    const testCases = [];
    
    // Try to get test cases from comprehensive database
    if (hasTestCases(this.problem.id)) {
      const dbTestCases = getTestCasesForProblem(this.problem.id);
      dbTestCases.testCases.forEach((tc, index) => {
        testCases.push({
          id: `test_${index + 1}`,
          type: index < 2 ? 'example' : 'hidden',
          input: tc.input,
          expected: tc.expected,
          explanation: tc.explanation || '',
        });
      });
    } else {
      // Fallback to problem examples
      if (this.problem.examples) {
        this.problem.examples.forEach((example, index) => {
          testCases.push({
            id: `example_${index + 1}`,
            type: 'example',
            input: example.input,
            expected: example.output,
            explanation: example.explanation || '',
          });
        });
      }
      
      // Add generic edge cases
      testCases.push(
        { id: 'edge_empty', type: 'hidden', input: '[]', expected: '[]', explanation: 'Empty input' },
        { id: 'edge_single', type: 'hidden', input: '[1]', expected: '[1]', explanation: 'Single element' }
      );
    }

    return testCases;
  }

  /**
   * Wrap user code with proper function structure for execution
   */
  wrapCodeForExecution(testCase) {
    const functionName = this.extractFunctionName();
    
    if (this.language === 'javascript') {
      return `
${this.code}

// Test execution
try {
  const input = ${testCase.input};
  let result;
  
  // Handle different input formats
  if (Array.isArray(input)) {
    if (input.length === 1) {
      result = ${functionName}(input[0]);
    } else if (input.length === 2) {
      result = ${functionName}(input[0], input[1]);
    } else {
      result = ${functionName}(...input);
    }
  } else {
    result = ${functionName}(input);
  }
  
  console.log(JSON.stringify(result));
} catch (error) {
  console.error('Runtime Error:', error.message);
  console.error('Stack:', error.stack);
}
      `;
    }
    
    if (this.language === 'python') {
      return `
${this.code}

# Test execution
import json
import sys

try:
    input_data = ${testCase.input.replace(/"/g, "'")}
    
    if isinstance(input_data, list):
        if len(input_data) == 1:
            result = ${functionName}(input_data[0])
        elif len(input_data) == 2:
            result = ${functionName}(input_data[0], input_data[1])
        else:
            result = ${functionName}(*input_data)
    else:
        result = ${functionName}(input_data)
    
    print(json.dumps(result))
except Exception as e:
    print(f"Runtime Error: {str(e)}", file=sys.stderr)
    import traceback
    traceback.print_exc(file=sys.stderr)
      `;
    }

    return this.code;
  }

  /**
   * Extract function name from code
   */
  extractFunctionName() {
    if (this.language === 'javascript') {
      // Try different patterns
      const patterns = [
        /function\s+(\w+)/,
        /const\s+(\w+)\s*=/,
        /let\s+(\w+)\s*=/,
        /var\s+(\w+)\s*=/,
        /(\w+)\s*=\s*function/,
        /(\w+)\s*=\s*\(/
      ];
      
      for (const pattern of patterns) {
        const match = this.code.match(pattern);
        if (match) return match[1];
      }
    }
    
    if (this.language === 'python') {
      const match = this.code.match(/def\s+(\w+)/);
      if (match) return match[1];
    }

    // Fallback to problem-based function names
    const title = this.problem.title.toLowerCase();
    if (title.includes('two sum')) return 'twoSum';
    if (title.includes('buy') && title.includes('sell')) return 'maxProfit';
    if (title.includes('duplicate')) return 'containsDuplicate';
    if (title.includes('product')) return 'productExceptSelf';
    if (title.includes('maximum subarray')) return 'maxSubArray';
    if (title.includes('anagram')) return 'isAnagram';
    if (title.includes('palindrome')) return 'isPalindrome';
    if (title.includes('longest substring')) return 'lengthOfLongestSubstring';
    if (title.includes('valid parentheses')) return 'isValid';
    if (title.includes('reverse linked list')) return 'reverseList';
    if (title.includes('merge')) return 'mergeTwoLists';
    if (title.includes('cycle')) return 'hasCycle';
    if (title.includes('depth')) return 'maxDepth';
    if (title.includes('invert')) return 'invertTree';
    if (title.includes('climbing stairs')) return 'climbStairs';
    if (title.includes('house robber')) return 'rob';
    if (title.includes('coin change')) return 'coinChange';
    if (title.includes('islands')) return 'numIslands';
    
    return 'solution';
  }

  /**
   * Run all test cases with syntax validation
   */
  async runAllTests() {
    // First, validate syntax
    const syntaxValidation = this.validateSyntax();
    
    if (!syntaxValidation.valid) {
      console.error('❌ Syntax validation failed');
      syntaxValidation.errors.forEach(err => {
        console.error(`${err.type.toUpperCase()}: ${err.message}${err.line ? ` (line ${err.line})` : ''}`);
      });
      
      return {
        syntaxErrors: syntaxValidation.errors,
        results: [],
        summary: {
          totalPassed: 0,
          totalTests: 0,
          allPassed: false,
          syntaxValid: false
        }
      };
    }
    
    const testCases = this.generateTestCases();
    const results = [];
    
    console.log(`🧪 Running ${testCases.length} test cases...`);
    
    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];
      console.log(`Running test ${i + 1}/${testCases.length}: ${testCase.id}`);
      
      try {
        const wrappedCode = this.wrapCodeForExecution(testCase);
        const startTime = Date.now();
        
        const executionResult = await executeCode(wrappedCode, this.language, '');
        const endTime = Date.now();
        
        const output = executionResult.output.trim();
        const expected = testCase.expected.trim();
        
        // Normalize output for comparison
        const normalizedOutput = this.normalizeOutput(output);
        const normalizedExpected = this.normalizeOutput(expected);
        
        const passed = normalizedOutput === normalizedExpected;
        
        results.push({
          id: testCase.id,
          type: testCase.type,
          input: testCase.input,
          expected: expected,
          output: output,
          passed: passed,
          runtime: endTime - startTime,
          memory: executionResult.memory || 0,
          error: executionResult.error || null,
          explanation: testCase.explanation || ''
        });
        
        console.log(`Test ${testCase.id}: ${passed ? '✅ PASS' : '❌ FAIL'}`);
        
      } catch (error) {
        results.push({
          id: testCase.id,
          type: testCase.type,
          input: testCase.input,
          expected: testCase.expected,
          output: '',
          passed: false,
          runtime: 0,
          memory: 0,
          error: error.message,
          explanation: testCase.explanation || ''
        });
        
        console.log(`Test ${testCase.id}: ❌ ERROR - ${error.message}`);
      }
    }
    
    this.results = results;
    return {
      syntaxErrors: [],
      results,
      summary: this.getSummary()
    };
  }

  /**
   * Normalize output for comparison
   */
  normalizeOutput(output) {
    if (!output) return '';
    
    // Remove quotes from strings
    let normalized = output.replace(/^["']|["']$/g, '');
    
    // Handle JSON arrays/objects
    try {
      const parsed = JSON.parse(output);
      return JSON.stringify(parsed);
    } catch {
      return normalized;
    }
  }

  /**
   * Get test summary
   */
  getSummary() {
    if (!this.results.length) return null;
    
    const passed = this.results.filter(r => r.passed).length;
    const total = this.results.length;
    const examplesPassed = this.results.filter(r => r.type === 'example' && r.passed).length;
    const examplesTotal = this.results.filter(r => r.type === 'example').length;
    const hiddenPassed = this.results.filter(r => r.type === 'hidden' && r.passed).length;
    const hiddenTotal = this.results.filter(r => r.type === 'hidden').length;
    
    const avgRuntime = this.results.reduce((sum, r) => sum + r.runtime, 0) / total;
    const maxMemory = Math.max(...this.results.map(r => r.memory));
    
    return {
      totalPassed: passed,
      totalTests: total,
      examplesPassed,
      examplesTotal,
      hiddenPassed,
      hiddenTotal,
      allPassed: passed === total,
      syntaxValid: this.syntaxErrors.length === 0,
      avgRuntime: Math.round(avgRuntime),
      maxMemory,
      passRate: Math.round((passed / total) * 100)
    };
  }
}

/**
 * Quick function to run tests for a problem
 */
export const runProblemTests = async (problem, language, code) => {
  const runner = new EnhancedTestRunner(problem, language, code);
  const { syntaxErrors, results, summary } = await runner.runAllTests();
  
  return {
    syntaxErrors,
    results,
    summary,
    runner
  };
};

export default EnhancedTestRunner;
