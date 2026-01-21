// Quick test script for AI Generator API
// Run with: node test-ai-api.js

const testAIGenerator = async () => {
  console.log('🧪 Testing AI Generator API...\n');

  const tests = [
    { prompt: 'Todo List App', outputType: 'web' },
    { prompt: 'Weather App', outputType: 'mobile' },
    { prompt: 'User Guide', outputType: 'document' },
    { prompt: 'Blog System', outputType: 'api' },
    { prompt: 'Sales Analysis', outputType: 'data' }
  ];

  for (const test of tests) {
    try {
      console.log(`Testing ${test.outputType}: "${test.prompt}"...`);
      
      const response = await fetch('http://localhost:3001/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(test)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success) {
        const contentLength = (data.content.html || data.content.code || data.content.content).length;
        console.log(`✅ Success! Generated ${contentLength} characters\n`);
      } else {
        console.log(`❌ Failed: ${data.error}\n`);
      }
    } catch (error) {
      console.log(`❌ Error: ${error.message}\n`);
    }
  }

  // Test health endpoint
  try {
    console.log('Testing health endpoint...');
    const response = await fetch('http://localhost:3001/api/ai/health');
    const data = await response.json();
    console.log(`✅ Health check: ${data.status}\n`);
  } catch (error) {
    console.log(`❌ Health check failed: ${error.message}\n`);
  }

  console.log('🎉 All tests completed!');
};

// Run tests
testAIGenerator().catch(console.error);
