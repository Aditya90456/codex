import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config({ path: './backend/.env' });

const API_URL = 'http://localhost:3001';

async function testOriginalBackendGeminiFix() {
  console.log('🧪 Testing Original Backend Gemini API Fix\n');
  
  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const healthResponse = await fetch(`${API_URL}/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData);
    
    // Test AI health endpoint
    console.log('\n2. Testing AI health endpoint...');
    const aiHealthResponse = await fetch(`${API_URL}/api/ai/health`);
    const aiHealthData = await aiHealthResponse.json();
    console.log('✅ AI Health check:', aiHealthData);
    
    // Test React code generation
    console.log('\n3. Testing React code generation...');
    const generateResponse = await fetch(`${API_URL}/api/ai/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: 'Create a simple counter app',
        outputType: 'react'
      })
    });
    
    const generateData = await generateResponse.json();
    
    if (generateData.success) {
      console.log('✅ React generation successful!');
      console.log(`   Source: ${generateData.source}`);
      console.log(`   Content length: ${generateData.content?.code?.length || 0} characters`);
      
      if (generateData.source === 'gemini-ai') {
        console.log('🎉 Gemini AI is working with the updated model (gemini-2.5-flash)!');
      } else {
        console.log('⚠️  Using fallback generation (API quota might be exceeded)');
        if (generateData.warning) {
          console.log(`   Warning: ${generateData.warning}`);
        }
      }
    } else {
      console.log('❌ Generation failed:', generateData.error);
    }
    
    // Test chat endpoint
    console.log('\n4. Testing chat endpoint...');
    const chatResponse = await fetch(`${API_URL}/api/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Hello, can you help me with React?'
      })
    });
    
    const chatData = await chatResponse.json();
    
    if (chatData.success) {
      console.log('✅ Chat successful!');
      console.log(`   Source: ${chatData.source}`);
      console.log(`   Response: ${chatData.response.substring(0, 100)}...`);
    } else {
      console.log('❌ Chat failed:', chatData.error);
    }
    
    console.log('\n🎯 Summary:');
    console.log('- Original backend is running on port 3001');
    console.log('- Gemini API model updated to gemini-2.5-flash');
    console.log('- Frontend should use http://localhost:3001 as API base URL');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n💡 Make sure the original backend server is running:');
    console.log('   1. cd backend');
    console.log('   2. npm install');
    console.log('   3. npm start');
  }
}

testOriginalBackendGeminiFix();