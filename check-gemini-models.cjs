const https = require('https');

const GEMINI_API_KEY = 'AIzaSyDPblUGrO9vgzKfSNP4uDbt6htpr9_zxTc';

console.log('🔍 Checking available Gemini models...\n');

// List available models
const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`;

https.get(listUrl, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    if (res.statusCode === 200) {
      try {
        const result = JSON.parse(data);
        
        console.log('✅ Available Gemini Models:\n');
        
        if (result.models && result.models.length > 0) {
          result.models.forEach((model, index) => {
            const supportsGenerate = model.supportedGenerationMethods?.includes('generateContent');
            const icon = supportsGenerate ? '✅' : '❌';
            
            console.log(`${icon} ${index + 1}. ${model.name}`);
            console.log(`   Display Name: ${model.displayName}`);
            console.log(`   Description: ${model.description}`);
            console.log(`   Supports generateContent: ${supportsGenerate ? 'YES' : 'NO'}`);
            
            if (model.supportedGenerationMethods) {
              console.log(`   Methods: ${model.supportedGenerationMethods.join(', ')}`);
            }
            console.log('');
          });
          
          // Find best model for code completion
          const codeModels = result.models.filter(m => 
            m.supportedGenerationMethods?.includes('generateContent') &&
            (m.name.includes('flash') || m.name.includes('pro'))
          );
          
          if (codeModels.length > 0) {
            console.log('\n🎯 Recommended Models for Code Completion:\n');
            codeModels.forEach((model, index) => {
              console.log(`${index + 1}. ${model.name}`);
              console.log(`   Use in backend: '${model.name}:generateContent'`);
              console.log('');
            });
          }
          
        } else {
          console.log('⚠️  No models found');
        }
        
      } catch (error) {
        console.log('❌ Failed to parse response:', error.message);
        console.log('Raw response:', data.substring(0, 500));
      }
    } else {
      console.log(`❌ Request failed with status ${res.statusCode}`);
      console.log('Response:', data);
    }
  });
}).on('error', (error) => {
  console.log('❌ Network error:', error.message);
});
