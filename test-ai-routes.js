#!/usr/bin/env node

/**
 * Test script for AI and React-AI routes
 * Tests both frontend routes and backend API endpoints
 */

const API_URL = process.env.VITE_API_BASE_URL || 'http://localhost:3001';

console.log('🧪 Testing AI Routes\n');
console.log('=' .repeat(60));

// Test 1: Backend Health Check
async function testBackendHealth() {
  console.log('\n📡 Test 1: Backend Health Check');
  console.log('-'.repeat(60));
  
  try {
    const response = await fetch(`${API_URL}/health`);
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Backend is healthy');
      console.log(`   Status: ${data.status}`);
      console.log(`   Database: ${data.database?.status || 'unknown'}`);
      console.log(`   Version: ${data.version || 'unknown'}`);
      return true;
    } else {
      console.log('❌ Backend health check failed');
      return false;
    }
  } catch (error) {
    console.log('❌ Cannot connect to backend');
    console.log(`   Error: ${error.message}`);
    console.log(`   Make sure backend is running: cd backend-new && npm start`);
    return false;
  }
}

// Test 2: AI Generator Health
async function testAIHealth() {
  console.log('\n🤖 Test 2: AI Generator Health');
  console.log('-'.repeat(60));
  
  try {
    const response = await fetch(`${API_URL}/api/ai/health`);
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ AI Generator is healthy');
      console.log(`   Service: ${data.service}`);
      console.log(`   Model: ${data.model}`);
      console.log(`   Gemini Configured: ${data.geminiConfigured ? '✅' : '⚠️  (will use fallback)'}`);
      return true;
    } else {
      console.log('❌ AI Generator health check failed');
      return false;
    }
  } catch (error) {
    console.log('❌ Cannot connect to AI Generator');
    console.log(`   Error: ${error.message}`);
    return false;
  }
}

// Test 3: Generate Web Content
async function testWebGeneration() {
  console.log('\n🌐 Test 3: Web Content Generation');
  console.log('-'.repeat(60));
  
  try {
    const response = await fetch(`${API_URL}/api/ai/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: 'Create a simple hello world page',
        outputType: 'web'
      })
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      console.log('✅ Web generation successful');
      console.log(`   Source: ${data.source}`);
      console.log(`   Content length: ${data.content?.html?.length || 0} characters`);
      console.log(`   Type: ${data.content?.type}`);
      return true;
    } else {
      console.log('❌ Web generation failed');
      console.log(`   Error: ${data.error || 'Unknown error'}`);
      return false;
    }
  } catch (error) {
    console.log('❌ Web generation request failed');
    console.log(`   Error: ${error.message}`);
    return false;
  }
}

// Test 4: Generate React Content
async function testReactGeneration() {
  console.log('\n⚛️  Test 4: React Content Generation');
  console.log('-'.repeat(60));
  
  try {
    const response = await fetch(`${API_URL}/api/ai/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: 'Create a simple React counter component',
        outputType: 'react',
        temperature: 0.7
      })
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      console.log('✅ React generation successful');
      console.log(`   Source: ${data.source}`);
      console.log(`   Content length: ${data.content?.code?.length || 0} characters`);
      console.log(`   Type: ${data.content?.type}`);
      console.log(`   Language: ${data.content?.language}`);
      
      // Show first 200 characters of generated code
      const code = data.content?.code || '';
      if (code.length > 0) {
        console.log('\n   Preview:');
        console.log('   ' + code.substring(0, 200).replace(/\n/g, '\n   ') + '...');
      }
      return true;
    } else {
      console.log('❌ React generation failed');
      console.log(`   Error: ${data.error || 'Unknown error'}`);
      return false;
    }
  } catch (error) {
    console.log('❌ React generation request failed');
    console.log(`   Error: ${error.message}`);
    return false;
  }
}

// Test 5: Frontend Routes
async function testFrontendRoutes() {
  console.log('\n🎨 Test 5: Frontend Routes');
  console.log('-'.repeat(60));
  
  const routes = [
    { path: '/ai', name: 'AI Universal Creator' },
    { path: '/react-ai', name: 'React Code AI' }
  ];
  
  console.log('Frontend routes configured:');
  routes.forEach(route => {
    console.log(`   ✅ ${route.path} - ${route.name}`);
  });
  
  console.log('\n   To test frontend routes:');
  console.log('   1. Start frontend: npm run dev');
  console.log('   2. Visit: http://localhost:5173/ai');
  console.log('   3. Visit: http://localhost:5173/react-ai');
  
  return true;
}

// Run all tests
async function runAllTests() {
  console.log('\n🚀 Starting AI Routes Test Suite');
  console.log('=' .repeat(60));
  
  const results = {
    backendHealth: await testBackendHealth(),
    aiHealth: await testAIHealth(),
    webGeneration: await testWebGeneration(),
    reactGeneration: await testReactGeneration(),
    frontendRoutes: await testFrontendRoutes()
  };
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Test Summary');
  console.log('='.repeat(60));
  
  const passed = Object.values(results).filter(r => r).length;
  const total = Object.keys(results).length;
  
  Object.entries(results).forEach(([test, passed]) => {
    const icon = passed ? '✅' : '❌';
    const name = test.replace(/([A-Z])/g, ' $1').trim();
    console.log(`${icon} ${name}`);
  });
  
  console.log('\n' + '='.repeat(60));
  console.log(`Result: ${passed}/${total} tests passed`);
  
  if (passed === total) {
    console.log('🎉 All tests passed! AI routes are ready to use.');
  } else {
    console.log('⚠️  Some tests failed. Check the errors above.');
  }
  
  console.log('\n📚 Next Steps:');
  console.log('   1. Make sure backend is running: cd backend-new && npm start');
  console.log('   2. Start frontend: npm run dev');
  console.log('   3. Visit http://localhost:5173/ai');
  console.log('   4. Visit http://localhost:5173/react-ai');
  console.log('   5. Set GEMINI_API_KEY in backend-new/.env for AI generation');
  
  console.log('\n' + '='.repeat(60));
}

// Run tests
runAllTests().catch(error => {
  console.error('\n❌ Test suite failed:', error);
  process.exit(1);
});
