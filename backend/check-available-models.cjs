const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function checkAvailableModels() {
  console.log('🔍 Checking available Gemini models...\n');
  
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // List available models
    const models = await genAI.listModels();
    
    console.log('📋 Available Models:');
    models.forEach((model, index) => {
      console.log(`${index + 1}. ${model.name}`);
      console.log(`   Display Name: ${model.displayName}`);
      console.log(`   Description: ${model.description}`);
      console.log(`   Supported Methods: ${model.supportedGenerationMethods?.join(', ') || 'N/A'}`);
      console.log('');
    });
    
    // Test with gemini-pro
    console.log('🧪 Testing with gemini-pro model...');
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const result = await model.generateContent("Hello, can you generate a simple JSON object with name and description fields?");
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ Test successful!');
    console.log('Response:', text);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.message.includes('API key')) {
      console.error('💡 Make sure GEMINI_API_KEY is set in your .env file');
    }
  }
}

checkAvailableModels();