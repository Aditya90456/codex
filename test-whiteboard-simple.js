// Simple test for AI Whiteboard

async function testWhiteboard() {
  console.log('🎨 Testing AI Whiteboard API...\n');

  try {
    console.log('Sending request to: http://localhost:3001/api/ai/visualize-logic');
    
    const response = await fetch('http://localhost:3001/api/ai/visualize-logic', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        problemTitle: 'Two Sum',
        code: 'function twoSum(nums, target) { return []; }'
      })
    });

    console.log('Response status:', response.status);
    console.log('Response OK:', response.ok);

    const data = await response.json();
    
    console.log('\nResponse data:');
    console.log(JSON.stringify(data, null, 2));

    if (data.success) {
      console.log('\n✅ SUCCESS!');
      console.log('Animation steps:', data.animation.steps?.length || 0);
    } else {
      console.log('\n❌ FAILED');
      console.log('Error:', data.error);
    }

  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.log('\nTroubleshooting:');
    console.log('1. Is backend running? (cd backend && npm start)');
    console.log('2. Check backend console for errors');
    console.log('3. Verify GEMINI_API_KEY in backend/.env');
  }
}

testWhiteboard();
