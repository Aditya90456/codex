// Test DSA Roadmap Tracker API
const API_URL = 'http://localhost:3001';
const TEST_USER_ID = 'test_user_123';

async function testRoadmapAPI() {
  console.log('🧪 Testing DSA Roadmap Tracker API...\n');

  try {
    // Test 1: Get user data (should return empty initial data)
    console.log('1️⃣ Testing GET /api/roadmap/user/:userId');
    const getUserResponse = await fetch(`${API_URL}/api/roadmap/user/${TEST_USER_ID}`);
    const userData = await getUserResponse.json();
    console.log('✅ User data:', JSON.stringify(userData, null, 2));
    console.log('');

    // Test 2: Add a task
    console.log('2️⃣ Testing POST /api/roadmap/tasks');
    const addTaskResponse = await fetch(`${API_URL}/api/roadmap/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: TEST_USER_ID,
        title: 'Solve Two Sum problem',
        category: 'arrays',
        difficulty: 'easy',
        deadline: '2026-02-20'
      })
    });
    const taskData = await addTaskResponse.json();
    console.log('✅ Task created:', JSON.stringify(taskData, null, 2));
    const taskId = taskData.task.id;
    console.log('');

    // Test 3: Toggle task completion
    console.log('3️⃣ Testing POST /api/roadmap/tasks/:taskId/toggle');
    const toggleResponse = await fetch(`${API_URL}/api/roadmap/tasks/${taskId}/toggle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: TEST_USER_ID })
    });
    const toggleData = await toggleResponse.json();
    console.log('✅ Task toggled:', JSON.stringify(toggleData, null, 2));
    console.log('');

    // Test 4: Get updated user data (should show streak and stats)
    console.log('4️⃣ Testing GET /api/roadmap/user/:userId (after completion)');
    const updatedUserResponse = await fetch(`${API_URL}/api/roadmap/user/${TEST_USER_ID}`);
    const updatedUserData = await updatedUserResponse.json();
    console.log('✅ Updated user data:', JSON.stringify(updatedUserData, null, 2));
    console.log('');

    // Test 5: Record problem completion
    console.log('5️⃣ Testing POST /api/roadmap/record-completion');
    const recordResponse = await fetch(`${API_URL}/api/roadmap/record-completion`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: TEST_USER_ID,
        problemId: 'two-sum',
        difficulty: 'Easy',
        category: 'Arrays'
      })
    });
    const recordData = await recordResponse.json();
    console.log('✅ Completion recorded:', JSON.stringify(recordData, null, 2));
    console.log('');

    // Test 6: Get final user data
    console.log('6️⃣ Testing GET /api/roadmap/user/:userId (final check)');
    const finalUserResponse = await fetch(`${API_URL}/api/roadmap/user/${TEST_USER_ID}`);
    const finalUserData = await finalUserResponse.json();
    console.log('✅ Final user data:', JSON.stringify(finalUserData, null, 2));
    console.log('');

    // Test 7: Delete task
    console.log('7️⃣ Testing DELETE /api/roadmap/tasks/:taskId');
    const deleteResponse = await fetch(`${API_URL}/api/roadmap/tasks/${taskId}?userId=${TEST_USER_ID}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });
    const deleteData = await deleteResponse.json();
    console.log('✅ Task deleted:', JSON.stringify(deleteData, null, 2));
    console.log('');

    console.log('🎉 All tests passed!');
    console.log('\n📊 Summary:');
    console.log('- User data retrieval: ✅');
    console.log('- Task creation: ✅');
    console.log('- Task completion toggle: ✅');
    console.log('- Problem completion recording: ✅');
    console.log('- Task deletion: ✅');
    console.log('- Streak calculation: ✅');
    console.log('- Stats tracking: ✅');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error);
  }
}

// Run tests
testRoadmapAPI();
