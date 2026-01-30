// Test AI Code Explainer with Original Backend
const fetch = require('node-fetch');

const BACKEND_URL = 'http://localhost:3001';

async function testCodeExplainer() {
  console.log('🧪 Testing AI Code Explainer with Original Backend...\n');

  const testCode = `function twoSum(nums, target) {
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
    console.log('📡 Sending request to:', `${BACKEND_URL}/api/ai/explain-code`);
    
    const response = await fetch(`${BACKEND_URL}/api/ai/explain-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code: testCode,
        problemTitle: 'Two Sum',
        language: 'javascript'
      })
    });

    console.log('📊 Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error response:', errorText);
      return;
    }

    const data = await response.json();
    
    console.log('\n✅ Success! AI Explanation received:\n');
    console.log('Algorithm:', data.explanation.algorithm);
    console.log('Time Complexity:', data.explanation.timeComplexity);
    console.log('Space Complexity:', data.explanation.spaceComplexity);
    console.log('\nSteps:');
    data.explanation.steps.forEach((step, i) => {
      console.log(`  ${i + 1}. ${step.title}`);
      console.log(`     ${step.description}`);
    });
    console.log('\nKey Insights:');
    data.explanation.keyInsights.forEach((insight, i) => {
      console.log(`  ${i + 1}. ${insight}`);
    });

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('\n💡 Make sure:');
    console.error('   1. Backend is running: cd backend && npm start');
    console.error('   2. GEMINI_API_KEY is set in backend/.env');
    console.error('   3. Port 3001 is not blocked');
  }
}

// Run test
testCodeExplainer();
