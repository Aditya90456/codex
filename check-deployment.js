// Deployment Status Checker
// Usage: node check-deployment.js <your-backend-url>

const backendUrl = process.argv[2] || 'http://localhost:3001';

console.log(`🔍 Checking deployment status for: ${backendUrl}\n`);

async function checkEndpoint(url, name) {
  try {
    console.log(`Testing ${name}...`);
    const response = await fetch(url);
    const data = await response.json();
    
    if (response.ok) {
      console.log(`✅ ${name}: OK`);
      console.log(`   Response:`, JSON.stringify(data, null, 2));
      return true;
    } else {
      console.log(`❌ ${name}: Failed (${response.status})`);
      console.log(`   Response:`, JSON.stringify(data, null, 2));
      return false;
    }
  } catch (error) {
    console.log(`❌ ${name}: Error - ${error.message}`);
    return false;
  }
}

async function runChecks() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  const results = {
    health: await checkEndpoint(`${backendUrl}/health`, 'Health Check'),
    aiHealth: await checkEndpoint(`${backendUrl}/api/ai/health`, 'AI Health Check'),
    problems: await checkEndpoint(`${backendUrl}/api/problems`, 'Problems API'),
  };
  
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('\n📊 Summary:');
  console.log(`   Health Check: ${results.health ? '✅' : '❌'}`);
  console.log(`   AI Service: ${results.aiHealth ? '✅' : '❌'}`);
  console.log(`   Problems API: ${results.problems ? '✅' : '❌'}`);
  
  const allPassed = Object.values(results).every(r => r);
  
  if (allPassed) {
    console.log('\n🎉 All checks passed! Backend is working correctly.');
  } else {
    console.log('\n⚠️  Some checks failed. Please review the errors above.');
    console.log('\n💡 Troubleshooting tips:');
    console.log('   1. Check if the backend is running');
    console.log('   2. Verify environment variables are set');
    console.log('   3. Check Render logs for errors');
    console.log('   4. Ensure GEMINI_API_KEY is configured');
  }
  
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

runChecks();
