const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Sync Clerk user with backend
router.post('/sync', async (req, res) => {
  try {
    const { clerkId, email, username, firstName, lastName, imageUrl } = req.body;

    if (!clerkId || !email) {
      return res.status(400).json({
        success: false,
        message: 'Clerk ID and email are required'
      });
    }

    // Check if user already exists by Clerk ID
    let user = await User.findOne({ clerkId });

    if (user) {
      // Update existing user
      user.email = email;
      user.username = username || user.username;
      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      user.avatar = imageUrl || user.avatar;
      user.lastLoginAt = new Date();
      
      await user.save();
    } else {
      // Check if user exists by email (migration case)
      user = await User.findOne({ email });
      
      if (user) {
        // Link existing user to Clerk
        user.clerkId = clerkId;
        user.username = username || user.username;
        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.avatar = imageUrl || user.avatar;
        user.lastLoginAt = new Date();
        
        await user.save();
      } else {
        // Create new user
        user = new User({
          clerkId,
          email,
          username: username || email.split('@')[0],
          firstName: firstName || 'User',
          lastName: lastName || '',
          avatar: imageUrl,
          lastLoginAt: new Date(),
          // Set a default password (won't be used with Clerk)
          password: 'clerk-managed'
        });
        
        await user.save();
      }
    }

    // Get user subscription if exists
    // This would be implemented based on your subscription model
    const subscription = null; // TODO: Implement subscription lookup

    res.json({
      success: true,
      user: user.getPublicProfile(),
      subscription
    });

  } catch (error) {
    console.error('Clerk sync error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to sync user with backend'
    });
  }
});

// Webhook handler for Clerk events
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    // TODO: Verify webhook signature
    const event = req.body;

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
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

async function handleUserCreated(userData) {
  try {
    const user = new User({
      clerkId: userData.id,
      email: userData.email_addresses[0]?.email_address,
      username: userData.username || userData.email_addresses[0]?.email_address.split('@')[0],
      firstName: userData.first_name || 'User',
      lastName: userData.last_name || '',
      avatar: userData.image_url,
      password: 'clerk-managed'
    });
    
    await user.save();
    console.log('User created via webhook:', user.username);
  } catch (error) {
    console.error('Error creating user from webhook:', error);
  }
}

async function handleUserUpdated(userData) {
  try {
    const user = await User.findOne({ clerkId: userData.id });
    if (user) {
      user.email = userData.email_addresses[0]?.email_address || user.email;
      user.username = userData.username || user.username;
      user.firstName = userData.first_name || user.firstName;
      user.lastName = userData.last_name || user.lastName;
      user.avatar = userData.image_url || user.avatar;
      
      await user.save();
      console.log('User updated via webhook:', user.username);
    }
  } catch (error) {
    console.error('Error updating user from webhook:', error);
  }
}

async function handleUserDeleted(userData) {
  try {
    const user = await User.findOne({ clerkId: userData.id });
    if (user) {
      user.isActive = false;
      await user.save();
      console.log('User deactivated via webhook:', user.username);
    }
  } catch (error) {
    console.error('Error deactivating user from webhook:', error);
  }
}

module.exports = router;