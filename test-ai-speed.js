import fetch from 'node-fetch';

const API_URL = 'http://localhost:3001';

async function testAISpeed() {
  console.log('⚡ Testing AI Speed Optimizations\n');
  
  try {
    // Test health endpoint
    console.log('1. Testing speed-optimized health endpoint...');
    const healthResponse = await fetch(`${API_URL}/api/ai/health`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData.service);
    console.log('   Optimizations:', healthData.optimizations);
    
    // Test fast React code generation
    console.log('\n2. Testing FAST React code generation...');
    const startTime = Date.now();
    
    const generateResponse = await fetch(`${API_URL}/api/ai/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: 'Create a simple todo app',
        outputType: 'react'
      })
    });
    
    const generateData = await generateResponse.json();
    const generationTime = Date.now() - startTime;
    
    if (generateData.success) {
      console.log('✅ FAST React generation successful!');
      console.log(`   ⚡ Generation time: ${generationTime}ms`);
      console.log(`   Source: ${generateData.source}`);
      console.log(`   Content length: ${generateData.content?.code?.length || 0} characters`);
      
      if (generateData.source === 'gemini-ai') {
        console.log('🚀 Speed-optimized Gemini AI is working!');
      } else {
        console.log('⚠️  Using fallback (still fast)');
      }
    } else {
      console.log('❌ Generation failed:', generateData.error);
    }
    
    // Test fast chat
    console.log('\n3. Testing FAST chat response...');
    const chatStartTime = Date.now();
    
    const chatResponse = await fetch(`${API_URL}/api/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Quick help with React hooks?'
      })
    });
    
    const chatData = await chatResponse.json();
    const chatTime = Date.now() - chatStartTime;
    
    if (chatData.success) {
      console.log('✅ FAST Chat successful!');
      console.log(`   ⚡ Chat time: ${chatTime}ms`);
      console.log(`   Source: ${chatData.source}`);
      console.log(`   Response: ${chatData.response.substring(0, 80)}...`);
    } else {
      console.log('❌ Chat failed:', chatData.error);
    }
    
    console.log('\n🎯 Speed Optimization Summary:');
    console.log(`- React Generation: ${generationTime}ms`);
    console.log(`- Chat Response: ${chatTime}ms`);
    console.log('- Reduced token limits for faster responses');
    console.log('- Optimized safety settings');
    console.log('- Shorter system prompts');
    console.log('- Single candidate generation');
    
  } catch (error) {
    console.error('❌ Speed test failed:', error.message);
  }
}

testAISpeed();