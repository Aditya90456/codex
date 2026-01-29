// Test script for AI Code Explainer with Gemini

const testCodeExplainer = async () => {
  console.log('🧪 Testing AI Code Explainer with Gemini...\n');

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

  const requestBody = {
    code: testCode,
    problemTitle: "Two Sum",
    language: "javascript"
  };

  try {
    console.log('📤 Sending request to backend...');
    console.log('Problem:', requestBody.problemTitle);
    console.log('Language:', requestBody.language);
    console.log('');

    const response = await fetch('http://localhost:3001/api/ai/explain-code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    
    console.log('✅ Success! Received explanation from Gemini AI\n');
    console.log('📊 Algorithm:', data.explanation.algorithm);
    console.log('⏱️  Time Complexity:', data.explanation.timeComplexity);
    console.log('💾 Space Complexity:', data.explanation.spaceComplexity);
    console.log('');
    console.log('📝 Steps:');
    data.explanation.steps.forEach((step, index) => {
      console.log(`  ${index + 1}. ${step.title}`);
      console.log(`     ${step.description}`);
    });
    console.log('');
    console.log('💡 Key Insights:');
    data.explanation.keyInsights.forEach((insight, index) => {
      console.log(`  ${index + 1}. ${insight}`);
    });
    console.log('');
    console.log('🎉 Test completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('');
    console.log('Troubleshooting:');
    console.log('1. Make sure backend server is running: cd backend && npm start');
    console.log('2. Check GEMINI_API_KEY is set in backend/.env');
    console.log('3. Verify server is on port 3001');
    console.log('4. Check internet connection for Gemini API');
  }
};

// Run the test
testCodeExplainer();
