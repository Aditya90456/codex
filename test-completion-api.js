// Test code completion API
const testCodeCompletion = async () => {
  try {
    console.log('Testing code completion API...\n');
    
    const response = await fetch('http://localhost:3001/api/code-completion/complete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        code: 'function twoSum(nums, target) {\n  const map = new ',
        cursorPosition: 50,
        language: 'javascript',
        context: 'Solving Two Sum problem',
        maxSuggestions: 3
      })
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('✅ API is working!');
      console.log(`\nReceived ${data.suggestions.length} suggestions:\n`);
      data.suggestions.forEach((suggestion, idx) => {
        console.log(`${idx + 1}. [${suggestion.type}] ${suggestion.text.substring(0, 50)}...`);
        console.log(`   Confidence: ${suggestion.confidence}%\n`);
      });
    } else {
      console.log('❌ API returned error:', data.error);
    }
  } catch (error) {
    console.log('❌ Failed to connect to API:', error.message);
    console.log('\n💡 Make sure backend is running: cd backend && npm start');
  }
};

testCodeCompletion();
