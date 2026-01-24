// Test React AI API call
const fetch = require('node-fetch');

async function testReactAI() {
  console.log('🧪 Testing React AI API call...\n');
  
  const API_URL = 'http://localhost:3001';
  const testPrompt = 'Create a simple todo app with React hooks';
  
  try {
    console.log('📤 Sending request to:', `${API_URL}/api/ai/generate`);
    console.log('📝 Prompt:', testPrompt);
    console.log('🎯 Output Type: react\n');
    
    const response = await fetch(`${API_URL}/api/ai/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        prompt: testPrompt,
        outputType: 'react',
        temperature: 0.7
      })
    });

    console.log('📊 Response Status:', response.status);
    console.log('📊 Response OK:', response.ok);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('❌ Error Response:', errorText);
      return;
    }

    const data = await response.json();
    console.log('✅ Response received!');
    console.log('📋 Response structure:');
    console.log('  - success:', data.success);
    console.log('  - source:', data.source);
    console.log('  - content type:', typeof data.content);
    
    if (data.content) {
      if (typeof data.content === 'object') {
        console.log('  - content keys:', Object.keys(data.content));
        console.log('  - content.code exists:', !!data.content.code);
        console.log('  - content.html exists:', !!data.content.html);
        console.log('  - content.content exists:', !!data.content.content);
      } else {
        console.log('  - content length:', data.content.length);
        console.log('  - content preview:', data.content.substring(0, 100) + '...');
      }
    }
    
    console.log('\n🎉 React AI API test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testReactAI();