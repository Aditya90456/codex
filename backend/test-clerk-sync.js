const { incrementUserStat, setUserStat } = require('./utils/clerk-sync');

// Test Clerk sync functionality
async function testClerkSync() {
  console.log('🧪 Testing Clerk Sync...\n');

  // Replace with your actual Clerk user ID
  const testUserId = 'user_2rLmXXXXXXXXXXXXXXXXXX'; // Update this!

  console.log('Testing with user ID:', testUserId);
  console.log('Make sure to update the testUserId in this file!\n');

  try {
    // Test 1: Set initial values
    console.log('Test 1: Setting initial stats...');
    await setUserStat(testUserId, 'blogsWritten', 5);
    await setUserStat(testUserId, 'blogsRead', 10);
    await setUserStat(testUserId, 'blogsLiked', 3);
    await setUserStat(testUserId, 'studyGroups', 2);
    console.log('✅ Initial stats set\n');

    // Test 2: Increment stats
    console.log('Test 2: Incrementing stats...');
    await incrementUserStat(testUserId, 'blogsWritten');
    await incrementUserStat(testUserId, 'blogsRead');
    await incrementUserStat(testUserId, 'blogsLiked');
    await incrementUserStat(testUserId, 'studyGroups');
    console.log('✅ Stats incremented\n');

    console.log('✅ All tests passed!');
    console.log('\nCheck your Clerk Dashboard to verify:');
    console.log('https://dashboard.clerk.com');
    console.log('\nExpected values:');
    console.log('- blogsWritten: 6');
    console.log('- blogsRead: 11');
    console.log('- blogsLiked: 4');
    console.log('- studyGroups: 3');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('\nPossible issues:');
    console.error('1. CLERK_SECRET_KEY not set in backend/.env');
    console.error('2. Invalid user ID');
    console.error('3. Network connection issue');
  }
}

// Run tests
testClerkSync();
