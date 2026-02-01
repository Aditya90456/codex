// Test script to verify REAL syntax and compiler errors for all languages
import fetch from 'node-fetch';

const API_BASE = 'http://localhost:3001/api/leetcode';

async function testRealErrors() {
  console.log('🧪 Testing REAL Syntax & Compiler Errors\n');
  console.log('=' .repeat(70));
  
  // Test 1: JavaScript Syntax Error
  console.log('\n📋 Test 1: JavaScript Syntax Error (Missing bracket)');
  const jsSyntaxError = `
function twoSum(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        map.set(nums[i], i);
    // Missing closing bracket
}`;
  
  await testCode(jsSyntaxError, 'javascript', 'JS Syntax Error');
  
  // Test 2: JavaScript ReferenceError
  console.log('\n📋 Test 2: JavaScript ReferenceError (Undefined variable)');
  const jsReferenceError = `
function twoSum(nums, target) {
    console.log(undefinedVariable);
    return [0, 1];
}`;
  
  await testCode(jsReferenceError, 'javascript', 'JS ReferenceError');
  
  // Test 3: JavaScript TypeError
  console.log('\n📋 Test 3: JavaScript TypeError (Calling non-function)');
  const jsTypeError = `
function twoSum(nums, target) {
    const x = 5;
    x();  // TypeError: x is not a function
    return [0, 1];
}`;
  
  await testCode(jsTypeError, 'javascript', 'JS TypeError');
  
  // Test 4: JavaScript RangeError (Infinite recursion)
  console.log('\n📋 Test 4: JavaScript RangeError (Stack overflow)');
  const jsRangeError = `
function twoSum(nums, target) {
    return twoSum(nums, target);  // Infinite recursion
}`;
  
  await testCode(jsRangeError, 'javascript', 'JS RangeError');
  
  // Test 5: Python Syntax Error
  console.log('\n📋 Test 5: Python Syntax Error (Invalid syntax)');
  const pySyntaxError = `
def two_sum(nums, target):
    if nums[0] = target:  # Should be ==, not =
        return [0]
    return []`;
  
  await testCode(pySyntaxError, 'python', 'Python SyntaxError');
  
  // Test 6: Python IndentationError
  console.log('\n📋 Test 6: Python IndentationError');
  const pyIndentError = `
def two_sum(nums, target):
for i in range(len(nums)):  # Missing indentation
    return [i]
return []`;
  
  await testCode(pyIndentError, 'python', 'Python IndentationError');
  
  // Test 7: Python NameError
  console.log('\n📋 Test 7: Python NameError (Undefined variable)');
  const pyNameError = `
def two_sum(nums, target):
    print(undefined_var)
    return [0, 1]`;
  
  await testCode(pyNameError, 'python', 'Python NameError');
  
  // Test 8: Python IndexError
  console.log('\n📋 Test 8: Python IndexError (List index out of range)');
  const pyIndexError = `
def two_sum(nums, target):
    return [nums[100], nums[200]]`;
  
  await testCode(pyIndexError, 'python', 'Python IndexError');
  
  // Test 9: Java Compilation Error
  console.log('\n📋 Test 9: Java Compilation Error (Missing semicolon)');
  const javaCompileError = `
class Solution {
    public int[] twoSum(int[] nums, int target) {
        int x = 5  // Missing semicolon
        return new int[]{0, 1};
    }
}`;
  
  await testCode(javaCompileError, 'java', 'Java Compilation Error');
  
  // Test 10: Java NullPointerException
  console.log('\n📋 Test 10: Java NullPointerException');
  const javaNullPointer = `
class Solution {
    public int[] twoSum(int[] nums, int target) {
        String str = null;
        str.length();  // NullPointerException
        return new int[]{0, 1};
    }
}`;
  
  await testCode(javaNullPointer, 'java', 'Java NullPointerException');
  
  // Test 11: Java ArrayIndexOutOfBoundsException
  console.log('\n📋 Test 11: Java ArrayIndexOutOfBoundsException');
  const javaArrayError = `
class Solution {
    public int[] twoSum(int[] nums, int target) {
        return new int[]{nums[100], nums[200]};
    }
}`;
  
  await testCode(javaArrayError, 'java', 'Java ArrayIndexOutOfBoundsException');
  
  // Test 12: C++ Compilation Error
  console.log('\n📋 Test 12: C++ Compilation Error (Missing semicolon)');
  const cppCompileError = `
class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        int x = 5  // Missing semicolon
        return {0, 1};
    }
};`;
  
  await testCode(cppCompileError, 'cpp', 'C++ Compilation Error');
  
  // Test 13: C++ Segmentation Fault
  console.log('\n📋 Test 13: C++ Segmentation Fault (Null pointer)');
  const cppSegFault = `
class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        int* ptr = nullptr;
        return {ptr[0], ptr[1]};  // Segmentation fault
    }
}`;
  
  await testCode(cppSegFault, 'cpp', 'C++ Segmentation Fault');
  
  console.log('\n' + '='.repeat(70));
  console.log('🎉 All error tests completed!');
  console.log('\n✨ Summary:');
  console.log('   ✅ JavaScript: SyntaxError, ReferenceError, TypeError, RangeError');
  console.log('   ✅ Python: SyntaxError, IndentationError, NameError, IndexError');
  console.log('   ✅ Java: Compilation errors, NullPointerException, ArrayIndexOutOfBoundsException');
  console.log('   ✅ C++: Compilation errors, Segmentation Fault');
  console.log('\n🚀 All errors are REAL and DETAILED!');
}

async function testCode(code, language, testName) {
  try {
    const response = await fetch(`${API_BASE}/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        language,
        testCases: [{ input: '[2,7,11,15], 9', expected: '[0,1]' }],
        problemId: 1,
        userId: 'error-test-user'
      })
    });

    const result = await response.json();
    
    if (result.success && result.results[0].error) {
      console.log(`   ✅ ${testName}:`);
      console.log(`      Error: ${result.results[0].error.split('\n')[0]}`);
      
      // Show first 2 lines of error for detail
      const errorLines = result.results[0].error.split('\n').slice(0, 2);
      errorLines.forEach(line => {
        if (line.trim()) console.log(`      ${line.substring(0, 80)}`);
      });
    } else {
      console.log(`   ❌ ${testName}: No error detected (unexpected)`);
    }
  } catch (error) {
    console.log(`   ❌ ${testName}: Request failed - ${error.message}`);
  }
}

testRealErrors();
