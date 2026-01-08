const express = require('express');
const router = express.Router();
const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');
const User = require('../models/User');

// Clerk webhook to sync user data
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const payload = req.body;
    const headers = req.headers;
    
    // Verify webhook signature (implement based on Clerk docs)
    // const isValid = verifyWebhookSignature(payload, headers);
    // if (!isValid) return res.status(400).json({ error: 'Invalid signature' });
    
    const event = JSON.parse(payload.toString());
    
    switch (event.type) {
      case 'user.created':
        await handleUserCreated(event.data);
        break;
      case 'user.updated':
        await handleUserUpdated(event.data);
        break;
      case 'user.deleted':
        await handleUserDeleted(event.data);
        break;
    }
    
    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Clerk webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Get current user from Clerk
router.get('/user', ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const clerkUserId = req.auth.userId;
    
    let user = await User.findOne({ clerkId: clerkUserId });
    
    if (!user) {
      // Create user if doesn't exist
      user = new User({
        clerkId: clerkUserId,
        email: req.auth.sessionClaims?.email || '',
        username: req.auth.sessionClaims?.username || `user_${Date.now()}`,
        name: req.auth.sessionClaims?.name || 'Anonymous User'
      });
      await user.save();
    }
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get Clerk user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user data'
    });
  }
});

// Update user profile
router.put('/user', ClerkExpressRequireAuth(), async (req, res) => {
  try {
    const clerkUserId = req.auth.userId;
    const updates = req.body;
    
    const user = await User.findOneAndUpdate(
      { clerkId: clerkUserId },
      updates,
      { new: true, runValidators: true }
    );
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Update Clerk user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user'
    });
  }
});

// Helper functions for webhook events
async function handleUserCreated(userData) {
  try {
    const user = new User({
      clerkId: userData.id,
      email: userData.email_addresses?.[0]?.email_address || '',
      username: userData.username || `user_${Date.now()}`,
      name: `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || 'Anonymous User',
      avatar: userData.image_url || null
    });
    
    await user.save();
    console.log('User created from Clerk webhook:', user.username);
  } catch (error) {
    console.error('Error creating user from webhook:', error);
  }
}

async function handleUserUpdated(userData) {
  try {
    await User.findOneAndUpdate(
      { clerkId: userData.id },
      {
        email: userData.email_addresses?.[0]?.email_address || '',
        username: userData.username || `user_${Date.now()}`,
        name: `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || 'Anonymous User',
        avatar: userData.image_url || null
      }
    );
    
    console.log('User updated from Clerk webhook:', userData.id);
  } catch (error) {
    console.error('Error updating user from webhook:', error);
  }
}

async function handleUserDeleted(userData) {
  try {
    await User.findOneAndDelete({ clerkId: userData.id });
    console.log('User deleted from Clerk webhook:', userData.id);
  } catch (error) {
    console.error('Error deleting user from webhook:', error);
  }
}

module.exports = router;