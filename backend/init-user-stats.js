require('dotenv').config();
const { Clerk } = require('@clerk/clerk-sdk-node');

const clerk = Clerk({ secretKey: process.env.CLERK_SECRET_KEY });

/**
 * Initialize stats for a user
 * This sets up the metadata fields if they don't exist
 */
async function initializeUserStats(userId) {
  try {
    console.log(`\n🔧 Initializing stats for user: ${userId}`);
    
    // Get current user
    const user = await clerk.users.getUser(userId);
    console.log(`📋 Current metadata:`, user.publicMetadata);
    
    // Set default values for missing fields
    const defaultStats = {
      blogsWritten: 0,
      blogsRead: 0,
      blogsLiked: 0,
      studyGroups: 0,
      solvedProblems: 0,
      streak: 0,
      rating: 1200
    };
    
    // Merge with existing metadata (don't overwrite existing values)
    const newMetadata = {
      ...defaultStats,
      ...user.publicMetadata
    };
    
    console.log(`📝 New metadata:`, newMetadata);
    
    // Update user metadata
    await clerk.users.updateUserMetadata(userId, {
      publicMetadata: newMetadata
    });
    
    console.log(`✅ Stats initialized successfully!`);
    console.log(`\nYou can now:`);
    console.log(`1. Create blogs → blogsWritten will increment`);
    console.log(`2. Read blogs → blogsRead will increment`);
    console.log(`3. Like blogs → blogsLiked will increment`);
    console.log(`4. Join groups → studyGroups will increment`);
    
  } catch (error) {
    console.error(`❌ Error initializing stats:`, error.message);
    if (error.errors) {
      console.error('Details:', error.errors);
    }
  }
}

/**
 * Initialize stats for all users in your Clerk application
 */
async function initializeAllUsers() {
  try {
    console.log('🔍 Fetching all users...\n');
    
    const users = await clerk.users.getUserList();
    console.log(`Found ${users.length} users\n`);
    
    for (const user of users) {
      await initializeUserStats(user.id);
    }
    
    console.log(`\n✅ All users initialized!`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Get command line argument
const command = process.argv[2];
const userId = process.argv[3];

if (command === 'all') {
  // Initialize all users
  initializeAllUsers();
} else if (command === 'user' && userId) {
  // Initialize specific user
  initializeUserStats(userId);
} else {
  console.log('Usage:');
  console.log('  node init-user-stats.js all              # Initialize all users');
  console.log('  node init-user-stats.js user USER_ID     # Initialize specific user');
  console.log('\nExample:');
  console.log('  node init-user-stats.js user user_2rLmXXXXXXXXXXXXXXXX');
}
