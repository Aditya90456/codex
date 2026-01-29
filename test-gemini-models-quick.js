// Quick test to check available Gemini models
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = 'AIzaSyDPblUGrO9vgzKfSNP4uDbt6htpr9_zxTc';
const genAI = new GoogleGenerativeAI(apiKey);

const modelsToTry = [
  'gemini-pro',
  'gemini-1.5-pro',
  'gemini-1.5-flash',
  'gemini-1.5-flash-latest',
  'models/gemini-1.5-flash',
  'models/gemini-pro'
];

async function testModels() {
  console.log('Testing Gemini models...\n');
  
  for (const modelName of modelsToTry) {
    try {
      console.log(`Testing: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent('Say "Hello"');
      const response = await result.response;
      const text = response.text();
      console.log(`✅ ${modelName} works! Response: ${text.substring(0, 50)}\n`);
      break; // Stop after first working model
    } catch (error) {
      console.log(`❌ ${modelName} failed: ${error.message}\n`);
    }
  }
}

testModels();
