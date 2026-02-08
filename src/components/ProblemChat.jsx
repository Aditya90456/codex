import { useState, useEffect, useRef } from 'react';
import { useUser } from '@clerk/clerk-react';

const ProblemChat = ({ problemId, problemTitle }) => {
  const { user } = useUser();
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [roomId, setRoomId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showFriendsList, setShowFriendsList] = useState(false);
  const [newFriendId, setNewFriendId] = useState('');
  const [shareCode, setShareCode] = useState(false);
  const [codeToShare, setCodeToShare] = useState('');
  const [friendRequests, setFriendRequests] = useState([]);
  const [showRequests, setShowRequests] = useState(false);
  const messagesEndRef = useRef(null);
  const pollIntervalRef = useRef(null);

  useEffect(() => {
    if (user) {
      fetchFriends();
      fetchFriendRequests();
    }
  }, [user]);

  useEffect(() => {
    if (roomId) {
      fetchMessages();
      // Poll for new messages every 3 seconds
      pollIntervalRef.current = setInterval(fetchMessages, 3000);
      return () => {
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current);
        }
      };
    }
  }, [roomId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchFriends = async () => {
    try {
      const response = await fetch(`/api/problem-chat/friends/${user.id}`);
      const data = await response.json();
      if (data.success) {
        setFriends(data.friends || []);
      } else {
        setFriends([]);
      }
    } catch (error) {
      console.error('Error fetching friends:', error);
      setFriends([]);
    }
  };

  const fetchFriendRequests = async () => {
    try {
      const response = await fetch(`/api/problem-chat/friends/requests/${user.id}`);
      const data = await response.json();
      if (data.success) {
        setFriendRequests(data.requests || []);
      } else {
        setFriendRequests([]);
      }
    } catch (error) {
      console.error('Error fetching friend requests:', error);
      setFriendRequests([]);
    }
  };

  const sendFriendRequest = async () => {
    const email = newFriendId.trim();
    if (!email) return;

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address');
      return;
    }

    try {
      const response = await fetch('/api/problem-chat/friends/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromUserId: user.id,
          fromUserEmail: user.primaryEmailAddress?.emailAddress || user.emailAddresses?.[0]?.emailAddress,
          fromUserName: user.fullName || user.username || user.id,
          toUserEmail: email
        })
      });

      const data = await response.json();
      if (data.success) {
        setNewFriendId('');
        alert('Friend request sent successfully!');
      } else {
        alert(data.error || 'Failed to send friend request');
      }
    } catch (error) {
      console.error('Error sending friend request:', error);
      alert('Failed to send friend request');
    }
  };

  const respondToRequest = async (requestId, action) => {
    try {
      const response = await fetch('/api/problem-chat/friends/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          requestId,
          action
        })
      });

      const data = await response.json();
      if (data.success) {
        setFriends(data.friends);
        fetchFriendRequests();
        alert(`Friend request ${action}ed!`);
      }
    } catch (error) {
      console.error('Error responding to request:', error);
      alert('Failed to respond to friend request');
    }
  };

  const startChat = async (friend) => {
    setSelectedFriend(friend);
    setLoading(true);

    try {
      const response = await fetch('/api/problem-chat/room/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemId,
          userId: user.id,
          friendId: friend.id
        })
      });

      const data = await response.json();
      if (data.success) {
        setRoomId(data.room.id);
        setMessages(data.messages);
        setShowFriendsList(false);
      }
    } catch (error) {
      console.error('Error starting chat:', error);
      alert('Failed to start chat');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    if (!roomId) return;

    try {
      const response = await fetch(`/api/problem-chat/messages/${roomId}`);
      const data = await response.json();
      if (data.success) {
        setMessages(data.messages || []);
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      setMessages([]);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() && !codeToShare.trim()) return;

    try {
      const response = await fetch('/api/problem-chat/message/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId,
          userId: user.id,
          userName: user.fullName || user.username || user.id,
          message: newMessage.trim(),
          code: shareCode ? codeToShare : null
        })
      });

      const data = await response.json();
      if (data.success) {
        setMessages([...messages, data.message]);
        setNewMessage('');
        setCodeToShare('');
        setShareCode(false);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!user) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800">Please sign in to use the chat feature</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-lg">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-lg">Problem Chat</h3>
            <p className="text-sm text-blue-100">{problemTitle}</p>
          </div>
          <button
            onClick={() => setShowFriendsList(!showFriendsList)}
            className="px-3 py-1 bg-white text-blue-600 rounded-lg hover:bg-blue-50 text-sm font-medium"
          >
            {selectedFriend ? 'Change Friend' : 'Select Friend'}
          </button>
        </div>
        {selectedFriend && (
          <div className="mt-2 text-sm">
            Chatting with: <span className="font-semibold">{selectedFriend.name}</span>
          </div>
        )}
      </div>

      {/* Friends List */}
      {showFriendsList && (
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-semibold text-gray-800">Your Friends</h4>
            {friendRequests && friendRequests.length > 0 && (
              <button
                onClick={() => setShowRequests(!showRequests)}
                className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm flex items-center gap-1"
              >
                <span className="font-bold">{friendRequests.length}</span>
                Requests
              </button>
            )}
          </div>

          {/* Friend Requests */}
          {showRequests && friendRequests && friendRequests.length > 0 && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <h5 className="font-medium text-blue-900 mb-2">Friend Requests</h5>
              <div className="space-y-2">
                {friendRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between bg-white p-2 rounded">
                    <div>
                      <div className="font-medium text-gray-800">{request.fromUserName}</div>
                      <div className="text-xs text-gray-500">{request.fromUserEmail}</div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => respondToRequest(request.id, 'accept')}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => respondToRequest(request.id, 'reject')}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Send Friend Request */}
          <div className="mb-4 flex gap-2">
            <input
              type="email"
              value={newFriendId}
              onChange={(e) => setNewFriendId(e.target.value)}
              placeholder="Enter friend's email address"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={sendFriendRequest}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Send Request
            </button>
          </div>

          {/* Friends List */}
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {!friends || friends.length === 0 ? (
              <p className="text-gray-500 text-sm">No friends yet. Send friend requests to start chatting!</p>
            ) : (
              friends.map((friend) => (
                <button
                  key={friend.id}
                  onClick={() => startChat(friend)}
                  className="w-full text-left px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
                >
                  <div className="font-medium text-gray-800">{friend.name}</div>
                  <div className="text-xs text-gray-500">{friend.email}</div>
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {/* Messages Area */}
      {selectedFriend && roomId ? (
        <>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {!messages || messages.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.userId === user.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      msg.userId === user.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    <div className="text-xs opacity-75 mb-1">
                      {msg.userName} • {new Date(msg.timestamp).toLocaleTimeString()}
                    </div>
                    <div className="whitespace-pre-wrap break-words">{msg.message}</div>
                    {msg.code && (
                      <div className="mt-2 p-2 bg-black bg-opacity-20 rounded text-xs font-mono overflow-x-auto">
                        <pre>{msg.code}</pre>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Code Share Section */}
          {shareCode && (
            <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Share Code:</span>
                <button
                  onClick={() => {
                    setShareCode(false);
                    setCodeToShare('');
                  }}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Cancel
                </button>
              </div>
              <textarea
                value={codeToShare}
                onChange={(e) => setCodeToShare(e.target.value)}
                placeholder="Paste your code here..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                rows={4}
              />
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <button
                onClick={() => setShareCode(!shareCode)}
                className={`px-3 py-2 rounded-lg ${
                  shareCode
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                title="Share code"
              >
                {'</>'}
              </button>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim() && !codeToShare.trim()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <div className="text-4xl mb-4">💬</div>
            <p>Select a friend to start chatting about this problem</p>
          </div>
        </div>
      )}

      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  );
};

export default ProblemChat;
