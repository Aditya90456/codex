// Quick test for stats API
const fetch = require('node-fetch');

async function testStatsAPI() {
  console.log('🧪 Testing Stats API...\n');
  
  try {
    const response = await fetch('http://localhost:3001/api/stats/platform');
    const data = await response.json();
    
    console.log('✅ Response received:');
    console.log(JSON.stringify(data, null, 2));
    
    if (data.success) {
      console.log('\n📊 Platform Stats:');
      console.log(`   Total Users: ${data.stats.totalUsers}`);
      console.log(`   Active Users: ${data.stats.activeUsers}`);
      console.log(`   New Today: ${data.stats.newUsersToday}`);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\nMake sure:');
    console.log('1. Backend is running (npm start in backend folder)');
    console.log('2. Backend is on port 3001');
  }
}

testStatsAPI();
