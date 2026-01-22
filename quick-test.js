// Quick test of backend AI
const API_BASE = 'http://localhost:3001';

async function quickTest() {
  console.log('🧪 QUICK BACKEND AI TEST\n');
  console.log('='.repeat(50));
  
  // Test 1: Health Check
  console.log('\n1️⃣  Testing Backend Health...');
  try {
    const res = await fetch(`${API_BASE}/health`);
    const data = await res.json();
    console.log('   ✅ Backend Status:', data.status);
    console.log('   ✅ Gemini Configured:', data.geminiConfigured);
  } catch (error) {
    console.log('   ❌ Backend not running!');
    return;
  }
  
  // Test 2: AI Health
  console.log('\n2️⃣  Testing AI Service...');
  try {
    const res = await fetch(`${API_BASE}/api/ai/health`);
    const data = await res.json();
    console.log('   ✅ AI Service:', data.status);
    console.log('   ✅ Gemini Ready:', data.geminiConfigured);
  } catch (error) {
    console.log('   ❌ AI service error:', error.message);
  }
  
  // Test 3: AI Chat
  console.log('\n3️⃣  Testing AI Chat (Gemini)...');
  try {
    const res = await fetch(`${API_BASE}/api/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Say hello in one sentence' })
    });
    const data = await res.json();
    console.log('   ✅ AI Response:', data.response.substring(0, 100) + '...');
    console.log('   ✅ Source:', data.source);
  } catch (error) {
    console.log('   ❌ Chat error:', error.message);
  }
  
  // Test 4: Code Execution
  console.log('\n4️⃣  Testing Code Execution...');
  try {
    const res = await fetch(`${API_BASE}/api/execute/custom`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        code: 'console.log("Hello from backend!"); 2 + 2',
        language: 'javascript'
      })
    });
    const data = await res.json();
    console.log('   ✅ Execution Status:', data.data.status);
    console.log('   ✅ Output:', data.data.output);
  } catch (error) {
    console.log('   ❌ Execution error:', error.message);
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('✅ ALL TESTS COMPLETED!\n');
}

quickTest();
