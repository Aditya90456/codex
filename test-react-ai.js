// Quick test for React AI endpoint
const testReactAI = async () => {
  console.log('🧪 Testing React AI endpoint...\n');

  try {
    const response = await fetch('http://localhost:3001/api/ai/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        prompt: 'Create a simple React counter component',
        outputType: 'react',
        temperature: 0.7
      })
    });

    console.log('Response status:', response.status);
    
    const data = await response.json();
    console.log('\n✅ Response received:');
    console.log('- Success:', data.success);
    console.log('- Source:', data.source);
    console.log('- Output Type:', data.outputType);
    console.log('- Code length:', data.content?.code?.length || 0, 'characters');
    
    if (data.warning) {
      console.log('\n⚠️  Warning:', data.warning);
    }

    if (data.content?.code) {
      console.log('\n📝 Generated code preview (first 200 chars):');
      console.log(data.content.code.substring(0, 200) + '...');
    }

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
  }
};

testReactAI();
