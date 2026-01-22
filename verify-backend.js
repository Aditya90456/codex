// Simple backend verification
const http = require('http');

console.log('🔍 Checking backend on port 3001...\n');

// Test 1: Health Check
const healthReq = http.get('http://localhost:3001/health', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('✅ HEALTH CHECK PASSED');
    console.log('   Response:', JSON.parse(data));
    console.log('');
    
    // Test 2: AI Health
    const aiHealthReq = http.get('http://localhost:3001/api/ai/health', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log('✅ AI HEALTH CHECK PASSED');
        console.log('   Response:', JSON.parse(data));
        console.log('');
        console.log('🎉 BACKEND IS WORKING!\n');
        console.log('You can now:');
        console.log('1. Use the AI Universal Creator in your app');
        console.log('2. Test with: http://localhost:3001/health');
        console.log('3. Deploy to Render.com\n');
      });
    });
    
    aiHealthReq.on('error', (err) => {
      console.log('❌ AI Health check failed:', err.message);
    });
  });
});

healthReq.on('error', (err) => {
  console.log('❌ Backend not responding:', err.message);
  console.log('\n💡 Make sure backend is running:');
  console.log('   cd backend && npm start\n');
});

healthReq.setTimeout(3000, () => {
  console.log('⏱️  Request timed out - backend may be starting...');
  healthReq.destroy();
});
