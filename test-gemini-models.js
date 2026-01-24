import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config({ path: './backend-new/.env' });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

async function listAvailableModels() {
  try {
    console.log('🔍 Checking available Gemini models...');
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models?key=${GEMINI_API_KEY}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error response:', errorText);
      return;
    }
    
    const data = await response.json();
    console.log('✅ Available models:');
    
    if (data.models) {
      data.models.forEach(model => {
        console.log(`  - ${model.name} (${model.displayName})`);
        if (model.supportedGenerationMethods) {
          console.log(`    Methods: ${model.supportedGenerationMethods.join(', ')}`);
        }
      });
    } else {
      console.log('No models found in response:', data);
    }
    
  } catch (error) {
    console.error('❌ Error listing models:', error.message);
  }
}

async function testModel(modelName) {
  try {
    console.log(`\n🧪 Testing model: ${modelName}`);
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/${modelName}:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: 'Hello, can you generate a simple React component?'
          }]
        }]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ ${modelName} failed:`, errorText);
    } else {
      const data = await response.json();
      console.log(`✅ ${modelName} works!`);
      if (data.candidates && data.candidates[0]) {
        const text = data.candidates[0].content.parts[0].text;
        console.log(`   Response length: ${text.length} characters`);
      }
    }
    
  } catch (error) {
    console.error(`❌ Error testing ${modelName}:`, error.message);
  }
}

async function main() {
  console.log('🚀 Gemini API Model Checker\n');
  
  if (!GEMINI_API_KEY) {
    console.error('❌ GEMINI_API_KEY not found in environment variables');
    return;
  }
  
  console.log('🔑 API Key found:', GEMINI_API_KEY.substring(0, 10) + '...');
  
  // List available models
  await listAvailableModels();
  
  // Test common model names
  const modelsToTest = [
    'gemini-1.5-flash',
    'gemini-1.5-pro',
    'gemini-2.0-flash',
    'gemini-2.5-flash',
    'gemini-3-flash-preview',
    'gemini-pro'
  ];
  
  console.log('\n🧪 Testing individual models...');
  for (const model of modelsToTest) {
    await testModel(model);
  }
}

main().catch(console.error);