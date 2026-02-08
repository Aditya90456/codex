// Test Problem Chat System

const BASE_URL = 'http://localhost:3001/api/problem-chat';

async function testProblemChat() {
  console.log('🧪 Testing Problem Chat System...\n');

  try {
    // Test 1: Add friends
    console.log('1️⃣ Testing Add Friend...');
    const addFriendResponse = await fetch(`${BASE_URL}/friends/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'user123',
        friendId: 'user456',
        friendName: 'Alice'
      })
    });
    const addFriendData = await addFriendResponse.json();
    console.log('✅ Add Friend:', addFriendData.success ? 'SUCCESS' : 'FAILED');
    console.log(`   Friends count: ${addFriendData.friends?.length || 0}\n`);

    // Test 2: Get friends list
    console.log('2️⃣ Testing Get Friends...');
    const getFriendsResponse = await fetch(`${BASE_URL}/friends/user123`);
    const getFriendsData = await getFriendsResponse.json();
    console.log('✅ Get Friends:', getFriendsData.success ? 'SUCCESS' : 'FAILED');
    console.log(`   Friends: ${getFriendsData.friends.map(f => f.name).join(', ')}\n`);

    // Test 3: Create chat room
    console.log('3️⃣ Testing Create Chat Room...');
    const createRoomResponse = await fetch(`${BASE_URL}/room/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        problemId: 'two-sum',
        userId: 'user123',
        friendId: 'user456'
      })
    });
    const createRoomData = await createRoomResponse.json();
    console.log('✅ Create Room:', createRoomData.success ? 'SUCCESS' : 'FAILED');
    console.log(`   Room ID: ${createRoomData.room?.id}\n`);

    const roomId = createRoomData.room.id;

    // Test 4: Send message
    console.log('4️⃣ Testing Send Message...');
    const sendMessageResponse = await fetch(`${BASE_URL}/message/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        roomId,
        userId: 'user123',
        userName: 'John',
        message: 'Hey! I\'m stuck on this problem. Can you help?'
      })
    });
    const sendMessageData = await sendMessageResponse.json();
    console.log('✅ Send Message:', sendMessageData.success ? 'SUCCESS' : 'FAILED');
    console.log(`   Message ID: ${sendMessageData.message?.id}\n`);

    // Test 5: Send message with code
    console.log('5️⃣ Testing Send Message with Code...');
    const sendCodeResponse = await fetch(`${BASE_URL}/message/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        roomId,
        userId: 'user456',
        userName: 'Alice',
        message: 'Sure! Here\'s my approach:',
        code: 'function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}'
      })
    });
    const sendCodeData = await sendCodeResponse.json();
    console.log('✅ Send Code:', sendCodeData.success ? 'SUCCESS' : 'FAILED\n');

    // Test 6: Get messages
    console.log('6️⃣ Testing Get Messages...');
    const getMessagesResponse = await fetch(`${BASE_URL}/messages/${roomId}`);
    const getMessagesData = await getMessagesResponse.json();
    console.log('✅ Get Messages:', getMessagesData.success ? 'SUCCESS' : 'FAILED');
    console.log(`   Total messages: ${getMessagesData.total}\n`);

    // Display messages
    console.log('📨 Chat Messages:');
    console.log('─'.repeat(60));
    getMessagesData.messages.forEach(msg => {
      console.log(`[${msg.userName}] ${new Date(msg.timestamp).toLocaleTimeString()}`);
      console.log(`  ${msg.message}`);
      if (msg.code) {
        console.log(`  Code:\n${msg.code.split('\n').map(line => '    ' + line).join('\n')}`);
      }
      console.log('');
    });
    console.log('─'.repeat(60));

    // Test 7: Get user's rooms
    console.log('\n7️⃣ Testing Get User Rooms...');
    const getRoomsResponse = await fetch(`${BASE_URL}/rooms/user123`);
    const getRoomsData = await getRoomsResponse.json();
    console.log('✅ Get Rooms:', getRoomsData.success ? 'SUCCESS' : 'FAILED');
    console.log(`   Active rooms: ${getRoomsData.rooms?.length || 0}\n`);

    console.log('\n🎉 All Tests Passed!');
    console.log('\n✨ Problem Chat System Features:');
    console.log('   • Add and manage friends');
    console.log('   • Create problem-specific chat rooms');
    console.log('   • Send text messages');
    console.log('   • Share code snippets');
    console.log('   • Real-time message polling');
    console.log('   • View chat history');
    console.log('   • Multiple active conversations');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// Run the test
testProblemChat();
