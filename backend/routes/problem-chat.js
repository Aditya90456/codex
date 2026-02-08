const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');
const {
  sendFriendRequestNotification,
  sendNewMessageNotification,
  sendFriendRequestAcceptedNotification
} = require('../utils/email-notifications');

// In-memory storage for chat messages (in production, use a database)
let chatMessages = {};
let userFriends = {};
let chatRooms = {};
let friendRequests = {}; // New: store friend requests

// Data file paths
const dataDir = path.join(__dirname, '../data');
const messagesFile = path.join(dataDir, 'chat-messages.json');
const friendsFile = path.join(dataDir, 'user-friends.json');
const roomsFile = path.join(dataDir, 'chat-rooms.json');
const requestsFile = path.join(dataDir, 'friend-requests.json');

// Initialize data files
async function initializeDataFiles() {
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }

  try {
    const messages = await fs.readFile(messagesFile, 'utf8');
    chatMessages = JSON.parse(messages);
  } catch {
    chatMessages = {};
    await fs.writeFile(messagesFile, JSON.stringify(chatMessages, null, 2));
  }

  try {
    const friends = await fs.readFile(friendsFile, 'utf8');
    userFriends = JSON.parse(friends);
  } catch {
    userFriends = {};
    await fs.writeFile(friendsFile, JSON.stringify(userFriends, null, 2));
  }

  try {
    const rooms = await fs.readFile(roomsFile, 'utf8');
    chatRooms = JSON.parse(rooms);
  } catch {
    chatRooms = {};
    await fs.writeFile(roomsFile, JSON.stringify(chatRooms, null, 2));
  }

  try {
    const requests = await fs.readFile(requestsFile, 'utf8');
    friendRequests = JSON.parse(requests);
  } catch {
    friendRequests = {};
    await fs.writeFile(requestsFile, JSON.stringify(friendRequests, null, 2));
  }
}

// Save data to files
async function saveMessages() {
  await fs.writeFile(messagesFile, JSON.stringify(chatMessages, null, 2));
}

async function saveFriends() {
  await fs.writeFile(friendsFile, JSON.stringify(userFriends, null, 2));
}

async function saveRooms() {
  await fs.writeFile(roomsFile, JSON.stringify(chatRooms, null, 2));
}

async function saveRequests() {
  await fs.writeFile(requestsFile, JSON.stringify(friendRequests, null, 2));
}

// Initialize on startup
initializeDataFiles();

// Send friend request
router.post('/friends/request', async (req, res) => {
  try {
    const { fromUserId, fromUserEmail, fromUserName, toUserEmail } = req.body;

    if (!fromUserId || !toUserEmail || !fromUserEmail) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: fromUserId, fromUserEmail, and toUserEmail'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(toUserEmail)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email address format'
      });
    }

    if (fromUserEmail === toUserEmail) {
      return res.status(400).json({
        success: false,
        error: 'Cannot send friend request to yourself'
      });
    }

    // Check if already friends (by email)
    if (userFriends[fromUserId]?.some(f => f.email === toUserEmail)) {
      return res.json({
        success: false,
        error: 'Already friends with this user'
      });
    }

    // Store requests by email for easier lookup
    if (!friendRequests[toUserEmail]) {
      friendRequests[toUserEmail] = [];
    }

    // Check if request already exists
    const existingRequest = friendRequests[toUserEmail].find(
      r => r.fromUserEmail === fromUserEmail && r.status === 'pending'
    );

    if (existingRequest) {
      return res.json({
        success: false,
        error: 'Friend request already sent'
      });
    }

    // Create friend request
    const request = {
      id: Date.now().toString(),
      fromUserId,
      fromUserEmail,
      fromUserName: fromUserName || fromUserEmail,
      toUserEmail,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    friendRequests[toUserEmail].push(request);
    await saveRequests();

    // Send email notification (using email as identifier)
    await sendFriendRequestNotification(toUserEmail, fromUserName, fromUserEmail);

    res.json({
      success: true,
      message: 'Friend request sent successfully',
      request
    });

  } catch (error) {
    console.error('Send friend request error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send friend request'
    });
  }
});

// Get pending friend requests
router.get('/friends/requests/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Get user's email from Clerk or use userId as fallback
    // In production, you'd fetch this from Clerk API
    // For now, we'll check all requests and filter by userId
    
    let allRequests = [];
    
    // Collect all requests where the user is the recipient
    for (const [email, requests] of Object.entries(friendRequests)) {
      const userRequests = requests.filter(r => r.status === 'pending');
      allRequests.push(...userRequests);
    }
    
    res.json({
      success: true,
      requests: allRequests
    });

  } catch (error) {
    console.error('Get friend requests error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get friend requests'
    });
  }
});

// Accept/Reject friend request
router.post('/friends/respond', async (req, res) => {
  try {
    const { userId, requestId, action } = req.body; // action: 'accept' or 'reject'

    if (!userId || !requestId || !action) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: userId, requestId, action'
      });
    }

    // Find the request across all email keys
    let request = null;
    let requestEmail = null;
    
    for (const [email, requests] of Object.entries(friendRequests)) {
      const foundRequest = requests.find(r => r.id === requestId);
      if (foundRequest) {
        request = foundRequest;
        requestEmail = email;
        break;
      }
    }

    if (!request) {
      return res.status(404).json({
        success: false,
        error: 'Friend request not found'
      });
    }

    if (action === 'accept') {
      // Add both users as friends
      if (!userFriends[userId]) {
        userFriends[userId] = [];
      }
      if (!userFriends[request.fromUserId]) {
        userFriends[request.fromUserId] = [];
      }

      // Add friend with email
      userFriends[userId].push({
        id: request.fromUserId,
        email: request.fromUserEmail,
        name: request.fromUserName,
        addedAt: new Date().toISOString()
      });

      // Get current user's email (would come from Clerk in production)
      const currentUserEmail = requestEmail;

      userFriends[request.fromUserId].push({
        id: userId,
        email: currentUserEmail,
        name: userId,
        addedAt: new Date().toISOString()
      });

      await saveFriends();
      request.status = 'accepted';
      
      // Send email notification to the requester
      await sendFriendRequestAcceptedNotification(request.fromUserEmail, userId);
    } else {
      request.status = 'rejected';
    }

    await saveRequests();

    res.json({
      success: true,
      message: `Friend request ${action}ed successfully`,
      friends: userFriends[userId]
    });

  } catch (error) {
    console.error('Respond to friend request error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to respond to friend request'
    });
  }
});

// Add friend
router.post('/friends/add', async (req, res) => {
  try {
    const { userId, friendId, friendName } = req.body;

    if (!userId || !friendId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: userId and friendId'
      });
    }

    if (!userFriends[userId]) {
      userFriends[userId] = [];
    }

    // Check if already friends
    const alreadyFriends = userFriends[userId].some(f => f.id === friendId);
    if (alreadyFriends) {
      return res.json({
        success: true,
        message: 'Already friends',
        friends: userFriends[userId]
      });
    }

    // Add friend
    userFriends[userId].push({
      id: friendId,
      name: friendName || friendId,
      addedAt: new Date().toISOString()
    });

    // Add reciprocal friendship
    if (!userFriends[friendId]) {
      userFriends[friendId] = [];
    }
    userFriends[friendId].push({
      id: userId,
      name: userId,
      addedAt: new Date().toISOString()
    });

    await saveFriends();

    res.json({
      success: true,
      message: 'Friend added successfully',
      friends: userFriends[userId]
    });

  } catch (error) {
    console.error('Add friend error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add friend'
    });
  }
});

// Get user's friends
router.get('/friends/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const friends = userFriends[userId] || [];
    
    res.json({
      success: true,
      friends: friends
    });

  } catch (error) {
    console.error('Get friends error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get friends'
    });
  }
});

// Create or get chat room for a problem
router.post('/room/create', async (req, res) => {
  try {
    const { problemId, userId, friendId } = req.body;

    if (!problemId || !userId || !friendId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: problemId, userId, friendId'
      });
    }

    // Create room ID (sorted to ensure same room for both users)
    const participants = [userId, friendId].sort();
    const roomId = `${problemId}_${participants.join('_')}`;

    if (!chatRooms[roomId]) {
      chatRooms[roomId] = {
        id: roomId,
        problemId,
        participants,
        createdAt: new Date().toISOString(),
        lastActivity: new Date().toISOString()
      };
      await saveRooms();
    }

    // Initialize messages array for this room if not exists
    if (!chatMessages[roomId]) {
      chatMessages[roomId] = [];
    }

    res.json({
      success: true,
      room: chatRooms[roomId],
      messages: chatMessages[roomId]
    });

  } catch (error) {
    console.error('Create room error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create chat room'
    });
  }
});

// Send message
router.post('/message/send', async (req, res) => {
  try {
    const { roomId, userId, userName, message, code } = req.body;

    if (!roomId || !userId || !message) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: roomId, userId, message'
      });
    }

    if (!chatMessages[roomId]) {
      chatMessages[roomId] = [];
    }

    const newMessage = {
      id: Date.now().toString(),
      userId,
      userName: userName || userId,
      message,
      code: code || null,
      timestamp: new Date().toISOString()
    };

    chatMessages[roomId].push(newMessage);

    // Update room last activity
    if (chatRooms[roomId]) {
      chatRooms[roomId].lastActivity = new Date().toISOString();
      await saveRooms();
      
      // Send email notification to other participants
      const room = chatRooms[roomId];
      const otherParticipants = room.participants.filter(p => p !== userId);
      
      // Get problem title from room ID (format: problemId_user1_user2)
      const problemId = room.problemId;
      const messagePreview = message.length > 100 ? message.substring(0, 100) + '...' : message;
      
      // Send notifications to all other participants
      for (const participantId of otherParticipants) {
        // Get participant's email from friends list
        const participantFriend = userFriends[userId]?.find(f => f.id === participantId);
        const participantEmail = participantFriend?.email || participantId;
        
        await sendNewMessageNotification(
          participantEmail,
          userName,
          problemId,
          messagePreview
        );
      }
    }

    await saveMessages();

    res.json({
      success: true,
      message: newMessage
    });

  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send message'
    });
  }
});

// Get messages for a room
router.get('/messages/:roomId', async (req, res) => {
  try {
    const { roomId } = req.params;
    const { limit = 50 } = req.query;

    const messages = chatMessages[roomId] || [];
    const limitedMessages = messages.slice(-parseInt(limit));

    res.json({
      success: true,
      messages: limitedMessages,
      total: messages.length
    });

  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get messages'
    });
  }
});

// Get user's active chat rooms
router.get('/rooms/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const userRooms = Object.values(chatRooms).filter(room => 
      room.participants.includes(userId)
    );

    // Sort by last activity
    userRooms.sort((a, b) => 
      new Date(b.lastActivity) - new Date(a.lastActivity)
    );

    res.json({
      success: true,
      rooms: userRooms
    });

  } catch (error) {
    console.error('Get rooms error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get chat rooms'
    });
  }
});

// Delete message
router.delete('/message/:roomId/:messageId', async (req, res) => {
  try {
    const { roomId, messageId } = req.params;
    const { userId } = req.body;

    if (!chatMessages[roomId]) {
      return res.status(404).json({
        success: false,
        error: 'Room not found'
      });
    }

    const messageIndex = chatMessages[roomId].findIndex(m => m.id === messageId);
    if (messageIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Message not found'
      });
    }

    // Check if user owns the message
    if (chatMessages[roomId][messageIndex].userId !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this message'
      });
    }

    chatMessages[roomId].splice(messageIndex, 1);
    await saveMessages();

    res.json({
      success: true,
      message: 'Message deleted successfully'
    });

  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete message'
    });
  }
});

module.exports = router;
