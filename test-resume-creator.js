const fs = require('fs');
const path = require('path');

// Test the Resume Creator API
async function testResumeCreator() {
  console.log('🧪 Testing Resume Creator API...\n');

  const baseURL = 'http://localhost:3001';
  
  // Test data
  const testUserId = 'test-user-123';
  const testPersonalInfo = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    linkedin: 'https://linkedin.com/in/johndoe',
    github: 'https://github.com/johndoe'
  };
  
  const testCustomizations = {
    includeProjects: true,
    includeSkills: true,
    includeAchievements: true,
    includeCertifications: true,
    focusArea: 'fullstack',
    template: 'professional'
  };

  // Create sample user ML data
  const sampleUserData = {
    [testUserId]: {
      user: {
        totalProblems: 150,
        streak: 45,
        longestStreak: 67,
        level: 12,
        addictionScore: 85,
        problemsByDifficulty: {
          Easy: 60,
          Medium: 70,
          Hard: 20
        },
        solvingPatterns: {
          languages: {
            'JavaScript': 80,
            'Python': 45,
            'Java': 25
          },
          problemTypes: {
            'Array': 40,
            'String': 25,
            'Tree': 20,
            'Dynamic Programming': 15,
            'Graph': 10
          }
        }
      },
      metrics: {
        engagementLevel: {
          level: 'High',
          score: 85
        }
      }
    }
  };

  // Ensure backend data directory exists and create sample data
  const backendDataDir = path.join(__dirname, 'backend', 'data');
  if (!fs.existsSync(backendDataDir)) {
    fs.mkdirSync(backendDataDir, { recursive: true });
  }

  const userMLDataFile = path.join(backendDataDir, 'user-ml-data.json');
  fs.writeFileSync(userMLDataFile, JSON.stringify(sampleUserData, null, 2));
  console.log('✅ Created sample user ML data');

  try {
    // Test 1: Generate Resume
    console.log('1️⃣ Testing resume generation...');
    const generateResponse = await fetch(`${baseURL}/api/resume-creator/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: testUserId,
        personalInfo: testPersonalInfo,
        customizations: testCustomizations
      })
    });

    if (!generateResponse.ok) {
      throw new Error(`Generate request failed: ${generateResponse.status}`);
    }

    const generateData = await generateResponse.json();
    console.log('✅ Resume generated successfully');
    console.log(`   - Name: ${generateData.data.personalInfo.name}`);
    console.log(`   - Template: ${generateData.data.template}`);
    console.log(`   - Skills: ${generateData.data.skills.programming.length} languages`);
    console.log(`   - Projects: ${generateData.data.projects.length} projects`);
    console.log(`   - Achievements: ${generateData.data.achievements.length} achievements`);

    // Test 2: Get Resume History
    console.log('\n2️⃣ Testing resume history...');
    const historyResponse = await fetch(`${baseURL}/api/resume-creator/history/${testUserId}`);
    
    if (!historyResponse.ok) {
      throw new Error(`History request failed: ${historyResponse.status}`);
    }

    const historyData = await historyResponse.json();
    console.log('✅ Resume history retrieved successfully');
    console.log(`   - Total resumes: ${historyData.count}`);

    // Test 3: Export Resume (TXT)
    console.log('\n3️⃣ Testing resume export (TXT)...');
    const exportResponse = await fetch(`${baseURL}/api/resume-creator/export`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        resumeData: generateData.data,
        format: 'txt'
      })
    });

    if (!exportResponse.ok) {
      throw new Error(`Export request failed: ${exportResponse.status}`);
    }

    const exportedText = await exportResponse.text();
    console.log('✅ Resume exported successfully');
    console.log(`   - Format: TXT`);
    console.log(`   - Size: ${exportedText.length} characters`);

    // Test 4: Export Resume (JSON)
    console.log('\n4️⃣ Testing resume export (JSON)...');
    const exportJSONResponse = await fetch(`${baseURL}/api/resume-creator/export`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        resumeData: generateData.data,
        format: 'json'
      })
    });

    if (!exportJSONResponse.ok) {
      throw new Error(`JSON export request failed: ${exportJSONResponse.status}`);
    }

    const exportedJSON = await exportJSONResponse.text();
    console.log('✅ Resume exported as JSON successfully');
    console.log(`   - Format: JSON`);
    console.log(`   - Size: ${exportedJSON.length} characters`);

    // Test 5: Get Templates
    console.log('\n5️⃣ Testing templates endpoint...');
    const templatesResponse = await fetch(`${baseURL}/api/resume-creator/templates`);
    
    if (!templatesResponse.ok) {
      throw new Error(`Templates request failed: ${templatesResponse.status}`);
    }

    const templatesData = await templatesResponse.json();
    console.log('✅ Templates retrieved successfully');
    console.log(`   - Available templates: ${Object.keys(templatesData.data).length}`);
    console.log(`   - Templates: ${Object.keys(templatesData.data).join(', ')}`);

    console.log('\n🎉 All Resume Creator tests passed!');
    console.log('\n📋 Sample Resume Preview:');
    console.log('=' .repeat(50));
    console.log(exportedText.substring(0, 500) + '...');
    console.log('=' .repeat(50));

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Run tests
if (require.main === module) {
  testResumeCreator().catch(console.error);
}

module.exports = { testResumeCreator };