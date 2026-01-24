// Quick test script to check Gemini API
const fetch = require('node-fetch');
require('dotenv').config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyDPblUGrO9vgzKfSNP4uDbt6htpr9_zxTc';

async function testGeminiAPI() {
  console.log('🧪 Testing Gemini API configurations...\n');
  
  const testConfigs = [
    {
      name: 'v1 with gemini-1.5-flash',
      url: `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`
    },
    {
      name: 'v1beta with gemini-1.5-flash',
      url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`
    },
    {
      name: 'v1 with gemini-pro',
      url: `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`
    },
    {
      name: 'v1beta with gemini-pro',
      url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`
    }
  ];

  const testPayload = {
    contents: [{
      parts: [{
        text: "Hello, generate a simple HTML button"
      }]
    }],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 100
    }
  };

  for (const config of testConfigs) {
    try {
      console.log(`Testing: ${config.name}`);
      const response = await fetch(config.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testPayload)
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`✅ SUCCESS: ${config.name}`);
        console.log(`   Response: ${data.candidates?.[0]?.content?.parts?.[0]?.text?.substring(0, 50)}...`);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.log(`❌ FAILED: ${config.name}`);
        console.log(`   Status: ${response.status}`);
        console.log(`   Error: ${errorData.error?.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.log(`❌ ERROR: ${config.name}`);
      console.log(`   ${error.message}`);
    }
    console.log('');
  }
}

// Also test listing available models
async function listModels() {
  console.log('📋 Listing available models...\n');
  
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${GEMINI_API_KEY}`);
    if (response.ok) {
      const data = await response.json();
      console.log('Available models:');
      data.models?.forEach(model => {
        console.log(`  - ${model.name} (${model.displayName})`);
      });
    } else {
      console.log('Failed to list models');
    }
  } catch (error) {
    console.log('Error listing models:', error.message);
  }
}

async function main() {
  console.log('🔑 API Key:', GEMINI_API_KEY ? `${GEMINI_API_KEY.substring(0, 10)}...` : 'NOT SET');
  console.log('');
  
  await listModels();
  console.log('\n' + '='.repeat(50) + '\n');
  await testGeminiAPI();
}

main().catch(console.error);