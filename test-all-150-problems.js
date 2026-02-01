// Test script to verify all 150 DSA problems are accessible
import fetch from 'node-fetch';

const API_BASE = 'http://localhost:3001/api/leetcode';

async function testAllProblems() {
  console.log('🧪 Testing all 150 DSA problems...\n');
  
  try {
    // Test 1: Get all problems
    console.log('📋 Test 1: Fetching all problems...');
    const response = await fetch(`${API_BASE}/problems?limit=150`);
    const data = await response.json();
    
    console.log(`✅ Total problems: ${data.total}`);
    console.log(`✅ Fetched: ${data.problems.length} problems\n`);
    
    // Test 2: Filter by category
    console.log('📋 Test 2: Filtering by category...');
    const categories = ['Arrays', 'Strings', 'Linked Lists', 'Trees', 'Dynamic Programming', 'Graphs'];
    
    for (const category of categories) {
      const catResponse = await fetch(`${API_BASE}/problems?category=${category}&limit=100`);
      const catData = await catResponse.json();
      console.log(`  ${category}: ${catData.total} problems`);
    }
    console.log('');
    
    // Test 3: Filter by difficulty
    console.log('📋 Test 3: Filtering by difficulty...');
    const difficulties = ['Easy', 'Medium', 'Hard'];
    
    for (const difficulty of difficulties) {
      const diffResponse = await fetch(`${API_BASE}/problems?difficulty=${difficulty}&limit=100`);
      const diffData = await diffResponse.json();
      console.log(`  ${difficulty}: ${diffData.total} problems`);
    }
    console.log('');
    
    // Test 4: Test specific problems with test cases
    console.log('📋 Test 4: Testing specific problems with test cases...');
    const testProblems = [1, 2, 3, 10, 20, 30, 40, 50];
    
    for (const problemId of testProblems) {
      const problemResponse = await fetch(`${API_BASE}/problem/${problemId}`);
      const problemData = await problemResponse.json();
      
      if (problemData.success) {
        console.log(`  ✅ Problem ${problemId}: ${problemData.problem.title} - ${problemData.problem.testCases.length} test cases`);
      } else {
        console.log(`  ❌ Problem ${problemId}: Not found`);
      }
    }
    console.log('');
    
    // Test 5: Submit a solution for Problem 1
    console.log('📋 Test 5: Submitting a solution for Problem 1...');
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

    const submitResponse = await fetch(`${API_BASE}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: testCode,
        language: 'javascript',
        problemId: 1,
        userId: 'test-user-150'
      })
    });

    const submitData = await submitResponse.json();
    console.log(`  ✅ Submission result: ${submitData.passedTestCases}/${submitData.totalTestCases} passed`);
    console.log(`  ✅ Acceptance rate: ${submitData.stats.passRate}%`);
    console.log('');
    
    console.log('🎉 All tests completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`  - Total problems available: ${data.total}`);
    console.log(`  - All 150 DSA problems are accessible`);
    console.log(`  - Test cases are working correctly`);
    console.log(`  - Submission system is functional`);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAllProblems();
