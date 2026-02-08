// Test Email-Based Problem Chat System

const BASE_URL = 'http://localhost:3001/api/problem-chat';

async function testEmailChat() {
  console.log('🧪 Testing Email-Based Problem Chat System...\n');

  try {
    // Test 1: Send friend request using email
    console.log('1️⃣ Testing Send Friend Request (Email-Based)...');
    const sendRequestResponse = await fetch(`${BASE_URL}/friends/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fromUserId: 'user_123',
        fromUserEmail: 'john@example.com',
        fromUserName: 'John Doe',
        toUserEmail: 'alice@example.com'
      })
    });
    const sendRequestData = await sendRequestResponse.json();
    console.log('✅ Send Friend Request:', sendRequestData.success ? 'SUCCESS' : 'FAILED');
    if (sendRequestData.success) {
      console.log(`   Request ID: ${sendRequestData.request.id}`);
      console.log(`   From: ${sendRequestData.request.fromUserEmail}`);
      console.log(`   To: ${sendRequestData.request.toUserEmail}\n`);
    } else {
      console.log(`   Error: ${sendRequestData.error}\n`);
    }

    // Test 2: Get friend requests
    console.log('2️⃣ Testing Get Friend Requests...');
    const getRequestsResponse = await fetch(`${BASE_URL}/friends/requests/user_456`);
    const getRequestsData = await getRequestsResponse.json();
    console.log('✅ Get Friend Requests:', getRequestsData.success ? 'SUCCESS' : 'FAILED');
    console.log(`   Pending requests: ${getRequestsData.requests.length}`);
    if (getRequestsData.requests.length > 0) {
      getRequestsData.requests.forEach(req => {
        console.log(`   - From: ${req.fromUserName} (${req.fromUserEmail})`);
      });
    }
    console.log('');

    // Test 3: Accept friend request
    if (sendRequestData.success) {
      console.log('3️⃣ Testing Accept Friend Request...');
      const acceptResponse = await fetch(`${BASE_URL}/friends/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'user_456',
          requestId: sendRequestData.request.id,
          action: 'accept'
        })
      });
      const acceptData = await acceptResponse.json();
      console.log('✅ Accept Request:', acceptData.success ? 'SUCCESS' : 'FAILED');
      if (acceptData.success) {
        console.log(`   Friends count: ${acceptData.friends?.length || 0}\n`);
      }
    }

    // Test 4: Get friends list
    console.log('4️⃣ Testing Get Friends List...');
    const getFriendsResponse = await fetch(`${BASE_URL}/friends/user_123`);
    const getFriendsData = await getFriendsResponse.json();
    console.log('✅ Get Friends:', getFriendsData.success ? 'SUCCESS' : 'FAILED');
    console.log(`   Total friends: ${getFriendsData.friends.length}`);
    if (getFriendsData.friends.length > 0) {
      getFriendsData.friends.forEach(friend => {
        console.log(`   - ${friend.name} (${friend.email})`);
      });
    }
    console.log('');

    // Test 5: Create chat room
    console.log('5️⃣ Testing Create Chat Room...');
    const createRoomResponse = await fetch(`${BASE_URL}/room/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        problemId: 'two-sum',
        userId: 'user_123',
        friendId: 'user_456'
      })
    });
    const createRoomData = await createRoomResponse.json();
    console.log('✅ Create Room:', createRoomData.success ? 'SUCCESS' : 'FAILED');
    console.log(`   Room ID: ${createRoomData.room?.id}\n`);

    const roomId = createRoomData.room.id;

    // Test 6: Send message
    console.log('6️⃣ Testing Send Message...');
    const sendMessageResponse = await fetch(`${BASE_URL}/message/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        roomId,
        userId: 'user_123',
        userName: 'John Doe',
        message: 'Hey! Can you help me with this problem?'
      })
    });
    const sendMessageData = await sendMessageResponse.json();
    console.log('✅ Send Message:', sendMessageData.success ? 'SUCCESS' : 'FAILED\n');

    // Test 7: Email validation
    console.log('7️⃣ Testing Email Validation...');
    const invalidEmailResponse = await fetch(`${BASE_URL}/friends/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fromUserId: 'user_123',
        fromUserEmail: 'john@example.com',
        fromUserName: 'John Doe',
        toUserEmail: 'invalid-email'
      })
    });
    const invalidEmailData = await invalidEmailResponse.json();
    console.log('✅ Email Validation:', !invalidEmailData.success ? 'SUCCESS (rejected invalid email)' : 'FAILED');
    if (!invalidEmailData.success) {
      console.log(`   Error message: ${invalidEmailData.error}\n`);
    }

    console.log('\n🎉 All Email-Based Tests Completed!');
    console.log('\n✨ Email-Based Chat Features:');
    console.log('   • Send friend requests using email addresses');
    console.log('   • Email validation');
    console.log('   • Accept/reject requests');
    console.log('   • View friends with email addresses');
    console.log('   • All chat features work with email-based friends');
    console.log('   • Email notifications (when configured)');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// Run the test
testEmailChat();
