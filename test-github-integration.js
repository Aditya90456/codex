const fetch = require('node-fetch');

async function testGitHubIntegration() {
  console.log('🧪 Testing GitHub Integration...\n');

  const backendUrl = 'http://localhost:3001';
  
  // Test 1: Check if backend is running
  console.log('1️⃣ Checking backend health...');
  try {
    const healthResponse = await fetch(`${backendUrl}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Backend is running:', healthData);
  } catch (error) {
    console.log('❌ Backend is not running. Start it with: npm start');
    console.log('   Or: cd backend && npm start');
    return;
  }

  // Test 2: Test GitHub sync endpoint
  console.log('\n2️⃣ Testing GitHub sync endpoint...');
  
  const testSolution = {
    fileName: 'test-solution.js',
    folderPath: 'Easy/Array',
    content: `/*
 * Problem: Two Sum
 * Difficulty: Easy
 * Category: Array
 * 
 * Description:
 * Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.
 * 
 * Submission Result:
 * - Status: Accepted ✅
 * - Test Cases Passed: 3/3
 * - Runtime: 52ms
 * - Memory: 42.1 MB
 * 
 * Submitted: ${new Date().toISOString()}
 * Language: javascript
 */

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
}
`,
    problemTitle: 'Two Sum',
    language: 'javascript'
  };

  try {
    const response = await fetch(`${backendUrl}/api/github/sync-solution`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testSolution)
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('✅ GitHub sync successful!');
      console.log('📁 File URL:', data.fileUrl);
      console.log('\n🎉 GitHub integration is working perfectly!');
      console.log('\n📝 Next steps:');
      console.log('   1. Go to your LeetCode editor');
      console.log('   2. Solve a problem and submit it');
      console.log('   3. Click "Download Solution for GitHub"');
      console.log('   4. Check your GitHub repository: leetcode-solutions');
    } else {
      console.log('❌ GitHub sync failed:', data.error);
      console.log('\n🔧 Troubleshooting:');
      console.log('   1. Check if GITHUB_TOKEN is set in backend/.env');
      console.log('   2. Verify token has "repo" scope');
      console.log('   3. Get token from: https://github.com/settings/tokens');
    }
  } catch (error) {
    console.log('❌ Error testing GitHub sync:', error.message);
  }
}

testGitHubIntegration();
