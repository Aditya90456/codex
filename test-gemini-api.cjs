require('dotenv').config({ path: './backend/.env' });

console.log('🧪 Testing Gemini API Configuration...\n');

// Check if API key is loaded
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.log('❌ GEMINI_API_KEY not found in environment variables');
  console.log('\n📝 To fix:');
  console.log('   1. Check backend/.env file exists');
  console.log('   2. Verify GEMINI_API_KEY is set');
  console.log('   3. Restart backend server');
  process.exit(1);
}

console.log('✅ GEMINI_API_KEY found!');
console.log(`   Key: ${apiKey.substring(0, 20)}...${apiKey.substring(apiKey.length - 4)}`);
console.log(`   Length: ${apiKey.length} characters`);

// Test API key format
if (apiKey.startsWith('AIza')) {
  console.log('✅ API key format looks correct (starts with AIza)');
} else {
  console.log('⚠️  API key format might be incorrect (should start with AIza)');
}

// Test API call
console.log('\n🌐 Testing API connection...');

const https = require('https');

const testPrompt = 'Say "Hello from Gemini!" in one sentence.';
const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

const data = JSON.stringify({
  contents: [{
    parts: [{
      text: testPrompt
    }]
  }]
});

const options = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = https.request(apiUrl, options, (res) => {
  let responseData = '';
  
  res.on('data', (chunk) => {
    responseData += chunk;
  });
  
  res.on('end', () => {
    if (res.statusCode === 200) {
      try {
        const result = JSON.parse(responseData);
        const text = result.candidates[0].content.parts[0].text;
        console.log('✅ API connection successful!');
        console.log(`   Response: ${text}`);
        console.log('\n🎉 Gemini API is working perfectly!');
        console.log('\n📝 Next steps:');
        console.log('   1. Restart backend: cd backend && npm start');
        console.log('   2. The warning should disappear');
        console.log('   3. AI features will use Gemini instead of fallback');
      } catch (error) {
        console.log('⚠️  Received response but failed to parse:', error.message);
        console.log('   Raw response:', responseData.substring(0, 200));
      }
    } else {
      console.log(`❌ API request failed with status ${res.statusCode}`);
      console.log('   Response:', responseData);
      
      if (res.statusCode === 400) {
        console.log('\n💡 Possible issues:');
        console.log('   - API key might be invalid');
        console.log('   - API key might be expired');
        console.log('   - Request format might be incorrect');
      } else if (res.statusCode === 403) {
        console.log('\n💡 Possible issues:');
        console.log('   - API key doesn\'t have permission');
        console.log('   - Gemini API not enabled for this key');
        console.log('   - Get new key from: https://makersuite.google.com/app/apikey');
      }
    }
  });
});

req.on('error', (error) => {
  console.log('❌ Network error:', error.message);
  console.log('\n💡 Possible issues:');
  console.log('   - No internet connection');
  console.log('   - Firewall blocking request');
  console.log('   - Proxy configuration needed');
});

req.write(data);
req.end();
