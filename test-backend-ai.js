// Test script for backend AI endpoints
const API_BASE = 'http://localhost:3001';

async function testHealthCheck() {
  console.log('🔍 Testing health check...');
  try {
    const response = await fetch(`${API_BASE}/health`);
    const data = await response.json();
    console.log('✅ Health check:', data);
    return data;
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
    return null;
  }
}

async function testAIHealth() {
  console.log('\n🔍 Testing AI health check...');
  try {
    const response = await fetch(`${API_BASE}/api/ai/health`);
    const data = await response.json();
    console.log('✅ AI health check:', data);
    return data;
  } catch (error) {
    console.error('❌ AI health check failed:', error.message);
    return null;
  }
}

async function testAIChat() {
  console.log('\n🔍 Testing AI chat endpoint...');
  try {
    const response = await fetch(`${API_BASE}/api/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Hello, how are you?' })
    });
    const data = await response.json();
    console.log('✅ AI chat response:', data);
    return data;
  } catch (error) {
    console.error('❌ AI chat failed:', error.message);
    return null;
  }
}

async function testAIGenerate() {
  console.log('\n🔍 Testing AI code generation...');
  try {
    const response = await fetch(`${API_BASE}/api/ai/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        prompt: 'Create a simple calculator',
        outputType: 'web'
      })
    });
    const data = await response.json();
    console.log('✅ AI generation response:', {
      success: data.success,
      source: data.source,
      contentLength: data.content?.html?.length || data.content?.code?.length || 0,
      warning: data.warning
    });
    return data;
  } catch (error) {
    console.error('❌ AI generation failed:', error.message);
    return null;
  }
}

async function runTests() {
  console.log('🚀 Starting backend AI tests...\n');
  
  const health = await testHealthCheck();
  if (!health) {
    console.error('\n❌ Backend is not running. Please start it first with: npm start');
    return;
  }
  
  await testAIHealth();
  await testAIChat();
  await testAIGenerate();
  
  console.log('\n✅ All tests completed!');
}

runTests();
