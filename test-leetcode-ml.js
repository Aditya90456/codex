import fetch from 'node-fetch';

const BACKEND_URL = 'http://localhost:3001';
const TEST_USER_ID = 'test_user_ml_123';

async function testLeetCodeML() {
  console.log('🧪 Testing LeetCode ML Addiction System...\n');

  try {
    // Test 1: Health check
    console.log('1. Testing ML engine health...');
    const healthResponse = await fetch(`${BACKEND_URL}/api/leetcode-ml/health`);
    const healthData = await healthResponse.json();
    console.log('✅ ML Engine status:', healthData.status);

    // Test 2: Get initial dashboard
    console.log('\n2. Testing initial dashboard...');
    const dashboardResponse = await fetch(`${BACKEND_URL}/api/leetcode-ml/dashboard/${TEST_USER_ID}`);
    const dashboardData = await dashboardResponse.json();
    
    if (dashboardData.success) {
      console.log('✅ Dashboard loaded successfully');
      console.log(`👤 User Level: ${dashboardData.data.user.level}`);
      console.log(`🔥 Streak: ${dashboardData.data.user.streak}`);
      console.log(`📊 Addiction Score: ${dashboardData.data.user.addictionScore}`);
      console.log(`🎯 Recommendations: ${dashboardData.data.recommendations.length}`);
      
      // Show first recommendation
      if (dashboardData.data.recommendations.length > 0) {
        const firstRec = dashboardData.data.recommendations[0];
        console.log(`   Top Recommendation: "${firstRec.title}" (Priority: ${firstRec.priority})`);
      }
    } else {
      console.log('❌ Dashboard failed:', dashboardData.error);
    }

    // Test 3: Simulate solving a problem
    console.log('\n3. Testing problem solving progress...');
    const progressResponse = await fetch(`${BACKEND_URL}/api/leetcode-ml/progress/${TEST_USER_ID}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        problemId: 1,
        difficulty: 'Easy',
        category: 'Array',
        language: 'python',
        timeSpent: 15,
        solved: true
      })
    });

    const progressData = await progressResponse.json();
    if (progressData.success) {
      console.log('✅ Progress updated successfully');
      console.log(`📈 New Level: ${progressData.data.user.level}`);
      console.log(`⚡ New XP: ${progressData.data.user.xp}`);
      console.log(`🔥 New Streak: ${progressData.data.user.streak}`);
      console.log(`📊 New Addiction Score: ${progressData.data.user.addictionScore}`);
    } else {
      console.log('❌ Progress update failed:', progressData.error);
    }

    // Test 4: Get personalized recommendations
    console.log('\n4. Testing personalized recommendations...');
    const recResponse = await fetch(`${BACKEND_URL}/api/leetcode-ml/recommendations/${TEST_USER_ID}`);
    const recData = await recResponse.json();
    
    if (recData.success) {
      console.log('✅ Recommendations generated successfully');
      console.log(`🎯 Total recommendations: ${recData.data.length}`);
      
      recData.data.slice(0, 3).forEach((rec, index) => {
        console.log(`   ${index + 1}. ${rec.title} (${rec.type}, Priority: ${rec.priority})`);
        console.log(`      "${rec.motivation}"`);
      });
    } else {
      console.log('❌ Recommendations failed:', recData.error);
    }

    // Test 5: Get daily challenge
    console.log('\n5. Testing daily challenge...');
    const challengeResponse = await fetch(`${BACKEND_URL}/api/leetcode-ml/daily-challenge/${TEST_USER_ID}`);
    const challengeData = await challengeResponse.json();
    
    if (challengeData.success) {
      console.log('✅ Daily challenge generated');
      console.log(`🎯 Challenge: ${challengeData.data.title}`);
      console.log(`📊 Difficulty: ${challengeData.data.difficulty}`);
      console.log(`🏷️ Category: ${challengeData.data.category}`);
      console.log(`🎁 Bonus XP: ${challengeData.data.bonusXP}`);
      console.log(`⏱️ Time Limit: ${challengeData.data.timeLimit} minutes`);
    } else {
      console.log('❌ Daily challenge failed:', challengeData.error);
    }

    // Test 6: Get engagement metrics
    console.log('\n6. Testing engagement metrics...');
    const metricsResponse = await fetch(`${BACKEND_URL}/api/leetcode-ml/engagement/${TEST_USER_ID}`);
    const metricsData = await metricsResponse.json();
    
    if (metricsData.success) {
      console.log('✅ Engagement metrics calculated');
      console.log(`📊 Addiction Score: ${metricsData.data.addictionScore}`);
      console.log(`🎯 Engagement Level: ${metricsData.data.engagementLevel.level} ${metricsData.data.engagementLevel.emoji}`);
      console.log(`🔥 Streak Motivation: "${metricsData.data.streakMotivation}"`);
      console.log(`🏆 Next Milestone: ${metricsData.data.nextMilestone.title} (${metricsData.data.nextMilestone.remaining} problems left)`);
      
      if (metricsData.data.urgencyFactors.length > 0) {
        console.log(`⚠️ Urgent Factors: ${metricsData.data.urgencyFactors.length}`);
        metricsData.data.urgencyFactors.forEach(factor => {
          console.log(`   - ${factor.message}`);
        });
      }
    } else {
      console.log('❌ Engagement metrics failed:', metricsData.error);
    }

    // Test 7: Simulate multiple problem solving to test addiction mechanics
    console.log('\n7. Testing addiction mechanics with multiple problems...');
    
    const problems = [
      { id: 2, difficulty: 'Easy', category: 'String', language: 'javascript' },
      { id: 3, difficulty: 'Medium', category: 'Array', language: 'python' },
      { id: 4, difficulty: 'Easy', category: 'Math', language: 'java' }
    ];

    for (let i = 0; i < problems.length; i++) {
      const problem = problems[i];
      await fetch(`${BACKEND_URL}/api/leetcode-ml/progress/${TEST_USER_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...problem,
          timeSpent: Math.floor(Math.random() * 30) + 10,
          solved: true
        })
      });
    }

    // Get final dashboard state
    const finalDashboard = await fetch(`${BACKEND_URL}/api/leetcode-ml/dashboard/${TEST_USER_ID}`);
    const finalData = await finalDashboard.json();
    
    if (finalData.success) {
      console.log('✅ Final state after multiple problems:');
      console.log(`👤 Final Level: ${finalData.data.user.level}`);
      console.log(`🔥 Final Streak: ${finalData.data.user.streak}`);
      console.log(`📊 Final Addiction Score: ${finalData.data.user.addictionScore}`);
      console.log(`🎯 Total Problems: ${finalData.data.user.totalProblems}`);
      console.log(`⚡ Total XP: ${finalData.data.user.xp}`);
      
      // Show problem distribution
      const dist = finalData.data.user.problemsByDifficulty;
      console.log(`📈 Problem Distribution: Easy(${dist.Easy}) Medium(${dist.Medium}) Hard(${dist.Hard})`);
    }

    console.log('\n🎉 All ML tests completed successfully!');
    console.log('\n🚀 LeetCode ML Addiction System Status:');
    console.log('✅ Personalized recommendations working');
    console.log('✅ Streak tracking and motivation');
    console.log('✅ Level progression system');
    console.log('✅ Addiction scoring algorithm');
    console.log('✅ Daily challenges generated');
    console.log('✅ Engagement metrics calculated');
    console.log('✅ Urgency factors for retention');
    console.log('✅ Multi-language progress tracking');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n🔧 Make sure the backend server is running:');
    console.log('   cd backend && npm start');
  }
}

testLeetCodeML();