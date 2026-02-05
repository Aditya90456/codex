const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function testAITemplateGeneration() {
  console.log('🤖 Testing AI Template Generation with Gemini 2.5 Flash...\n');
  
  try {
    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    console.log('✅ Gemini AI initialized successfully');
    
    // Test user data
    const testUserStats = {
      userId: 'test-user-123',
      totalProblems: 150,
      streak: 25,
      level: 12,
      addictionScore: 85,
      solvingPatterns: {
        languages: {
          'JavaScript': 60,
          'Python': 45,
          'Java': 25,
          'TypeScript': 20
        },
        problemTypes: {
          'Array': 35,
          'String': 25,
          'Tree': 20,
          'Dynamic Programming': 15,
          'Graph': 10
        }
      }
    };
    
    const testPersonalInfo = {
      name: 'Alex Johnson',
      email: 'alex.johnson@example.com',
      location: 'San Francisco, CA'
    };
    
    const focusArea = 'fullstack';
    
    console.log('📊 Test User Profile:');
    console.log(`   • Name: ${testPersonalInfo.name}`);
    console.log(`   • Focus Area: ${focusArea}`);
    console.log(`   • Problems Solved: ${testUserStats.totalProblems}`);
    console.log(`   • Coding Level: ${testUserStats.level}`);
    console.log(`   • Top Languages: ${Object.keys(testUserStats.solvingPatterns.languages).slice(0, 3).join(', ')}`);
    console.log('');
    
    const prompt = `
You are an expert resume designer and career counselor. Generate a personalized resume template configuration based on the following user data:

USER PROFILE:
- Name: ${testPersonalInfo.name}
- Focus Area: ${focusArea}
- Problems Solved: ${testUserStats.totalProblems}
- Coding Streak: ${testUserStats.streak} days
- Coding Level: ${testUserStats.level}
- Engagement Score: ${testUserStats.addictionScore}

CODING PATTERNS:
- Languages: ${JSON.stringify(testUserStats.solvingPatterns.languages)}
- Problem Types: ${JSON.stringify(testUserStats.solvingPatterns.problemTypes)}

REQUIREMENTS:
1. Create a unique template name and description
2. Choose appropriate colors based on focus area and personality
3. Select fonts that match the professional level
4. Design layout structure that highlights strengths
5. Recommend sections to emphasize based on coding patterns

Generate a JSON response with this exact structure:
{
  "templateName": "unique_template_name",
  "displayName": "Human Readable Template Name",
  "description": "Detailed description of when to use this template",
  "targetRole": "specific job role this template is optimized for",
  "styles": {
    "primaryColor": "#hex_color",
    "secondaryColor": "#hex_color",
    "accentColor": "#hex_color",
    "fontFamily": "font_name, fallback",
    "headerStyle": "centered|left-aligned|minimal|bold",
    "sectionDivider": "line|colored-bar|dotted|none",
    "layout": "traditional|modern|creative|technical",
    "spacing": "compact|normal|spacious"
  },
  "sectionPriority": {
    "summary": 1-10,
    "skills": 1-10,
    "projects": 1-10,
    "experience": 1-10,
    "achievements": 1-10,
    "certifications": 1-10,
    "stats": 1-10
  },
  "customizations": {
    "emphasizeProjects": true/false,
    "showCodingStats": true/false,
    "highlightStreaks": true/false,
    "technicalFocus": true/false,
    "minimalistDesign": true/false
  },
  "aiRecommendations": [
    "specific recommendation 1",
    "specific recommendation 2",
    "specific recommendation 3"
  ]
}

Make the template unique and tailored to this specific user's coding journey and career goals.`;

    console.log('🔄 Generating AI template...');
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('📝 Raw AI Response:');
    console.log(text);
    console.log('');
    
    // Parse the JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid AI response format - no JSON found');
    }
    
    const aiTemplate = JSON.parse(jsonMatch[0]);
    
    console.log('✅ AI Template Generated Successfully!');
    console.log('');
    console.log('🎨 Template Details:');
    console.log(`   • Name: ${aiTemplate.displayName}`);
    console.log(`   • Target Role: ${aiTemplate.targetRole}`);
    console.log(`   • Primary Color: ${aiTemplate.styles.primaryColor}`);
    console.log(`   • Layout: ${aiTemplate.styles.layout}`);
    console.log(`   • Font: ${aiTemplate.styles.fontFamily}`);
    console.log('');
    console.log('📋 Description:');
    console.log(`   ${aiTemplate.description}`);
    console.log('');
    console.log('🎯 AI Recommendations:');
    aiTemplate.aiRecommendations.forEach((rec, index) => {
      console.log(`   ${index + 1}. ${rec}`);
    });
    console.log('');
    console.log('⚙️ Customizations:');
    Object.entries(aiTemplate.customizations).forEach(([key, value]) => {
      console.log(`   • ${key}: ${value}`);
    });
    
    console.log('\n🎉 AI Template Generation Test PASSED!');
    console.log('✨ Features working:');
    console.log('   • Gemini 2.5 Flash integration');
    console.log('   • Personalized template generation');
    console.log('   • JSON parsing and validation');
    console.log('   • Smart color and layout selection');
    console.log('   • AI-powered recommendations');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.message.includes('API key')) {
      console.error('💡 Make sure GEMINI_API_KEY is set in your .env file');
    }
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// Run the test
testAITemplateGeneration();