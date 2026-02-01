// Test the LeetCode API with the fixed input parsing
import fetch from 'node-fetch';

const API_BASE = 'http://localhost:3001/api/leetcode';

async function testRun() {
  console.log('Testing /run endpoint...');
  
  const testCode = `
function twoSum(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    return [];
}`;

  const testCases = [
    { input: '[2,7,11,15], 9', expected: '[0,1]' },
    { input: '[3,2,4], 6', expected: '[1,2]' },
    { input: '[3,3], 6', expected: '[0,1]' }
  ];

  try {
    const response = await fetch(`${API_BASE}/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: testCode,
        language: 'javascript',
        testCases: testCases,
        problemId: 1,
        userId: 'test-user'
      })
    });

    const result = await response.json();
    console.log('✅ Run test result:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.log('❌ Run test error:', error.message);
  }
}

async function testSubmit() {
  console.log('\nTesting /submit endpoint...');
  
  const testCode = `
function twoSum(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    return [];
}`;

  try {
    const response = await fetch(`${API_BASE}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: testCode,
        language: 'javascript',
        problemId: 1,
        userId: 'test-user'
      })
    });

    const result = await response.json();
    console.log('✅ Submit test result:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.log('❌ Submit test error:', error.message);
  }
}

async function testErrorHandling() {
  console.log('\nTesting error handling...');
  
  const buggyCode = `
function twoSum(nums, target) {
    console.log(undefinedVariable); // This should cause a ReferenceError
    return [0, 1];
}`;

  const testCases = [
    { input: '[2,7,11,15], 9', expected: '[0,1]' }
  ];

  try {
    const response = await fetch(`${API_BASE}/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: buggyCode,
        language: 'javascript',
        testCases: testCases,
        problemId: 1,
        userId: 'test-user'
      })
    });

    const result = await response.json();
    console.log('✅ Error handling test result:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.log('❌ Error handling test error:', error.message);
  }
}

async function runTests() {
  await testRun();
  await testSubmit();
  await testErrorHandling();
}

runTests().catch(console.error);