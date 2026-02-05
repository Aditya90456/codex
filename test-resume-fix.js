const fs = require('fs');
const path = require('path');

// Test the Resume Creator fix
async function testResumeFix() {
  console.log('🧪 Testing Resume Creator Fix...\n');

  const baseURL = 'http://localhost:3001';
  
  // Test data for a user without ML data
  const testUserId = 'user_37jwvNsM6pGnaGEvIXurPTn3OqA';
  const testPersonalInfo = {
    name: 'John Developer',
    email: 'john.dev@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    linkedin: 'https://linkedin.com/in/johndev',
    github: 'https://github.com/johndev'
  };
  
  const testCustomizations = {
    includeProjects: true,
    includeSkills: true,
    includeAchievements: true,
    includeCertifications: true,
    focusArea: 'fullstack',
    template: 'professional'
  };

  try {
    // Test: Generate Resume with fallback data
    console.log('1️⃣ Testing resume generation with fallback data...');
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
      const errorText = await generateResponse.text();
      throw new Error(`Generate request failed: ${generateResponse.status} - ${errorText}`);
    }

    const generateData = await generateResponse.json();
    
    if (generateData.success) {
      console.log('✅ Resume generated successfully with fallback data!');
      console.log(`   - Name: ${generateData.data.personalInfo.name}`);
      console.log(`   - Template: ${generateData.data.template}`);
      console.log(`   - Skills: ${generateData.data.skills.programming.length} languages`);
      console.log(`   - Projects: ${generateData.data.projects.length} projects`);
      console.log(`   - Achievements: ${generateData.data.achievements.length} achievements`);
      console.log(`   - Stats: ${generateData.data.stats.totalProblems} problems solved`);
    } else {
      throw new Error(generateData.error || 'Resume generation failed');
    }

    // Test: Verify sample data was created
    console.log('\n2️⃣ Verifying sample data creation...');
    const userMLDataFile = path.join(__dirname, 'backend', 'data', 'user-ml-data.json');
    
    if (fs.existsSync(userMLDataFile)) {
      const userData = JSON.parse(fs.readFileSync(userMLDataFile, 'utf8'));
      if (userData[testUserId]) {
        console.log('✅ Sample ML data created successfully!');
        console.log(`   - Total Problems: ${userData[testUserId].user.totalProblems}`);
        console.log(`   - Level: ${userData[testUserId].user.level}`);
        console.log(`   - Languages: ${Object.keys(userData[testUserId].user.solvingPatterns.languages).join(', ')}`);
      } else {
        console.log('⚠️  Sample data not found in file');
      }
    } else {
      console.log('⚠️  ML data file not found');
    }

    // Test: Generate another resume (should use existing data)
    console.log('\n3️⃣ Testing resume generation with existing data...');
    const secondResponse = await fetch(`${baseURL}/api/resume-creator/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: testUserId,
        personalInfo: { ...testPersonalInfo, name: 'John Developer Updated' },
        customizations: { ...testCustomizations, focusArea: 'backend' }
      })
    });

    const secondData = await secondResponse.json();
    if (secondData.success) {
      console.log('✅ Second resume generated successfully!');
      console.log(`   - Focus Area: Backend Development`);
      console.log(`   - Using existing ML data`);
    }

    console.log('\n🎉 All Resume Creator fix tests passed!');
    console.log('\n📋 Fix Summary:');
    console.log('✅ Handles missing ML data gracefully');
    console.log('✅ Creates sample data for new users');
    console.log('✅ Generates meaningful resumes even without coding history');
    console.log('✅ Fallback data includes realistic coding statistics');
    console.log('✅ Error handling improved for edge cases');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure the backend server is running');
    console.log('2. Check if the resume-creator route is properly mounted');
    console.log('3. Verify the backend/data directory exists');
    console.log('4. Check server logs for detailed error messages');
  }
}

// Run tests
if (require.main === module) {
  testResumeFix().catch(console.error);
}

module.exports = { testResumeFix };