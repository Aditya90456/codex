const { Clerk } = require('@clerk/clerk-sdk-node');

// Initialize Clerk with your secret key
const clerkSecretKey = process.env.CLERK_SECRET_KEY;

if (!clerkSecretKey) {
  console.warn('⚠️  CLERK_SECRET_KEY not found in environment variables');
  console.warn('⚠️  Clerk metadata sync will be disabled');
}

const clerk = clerkSecretKey ? Clerk({ secretKey: clerkSecretKey }) : null;

/**
 * Update user's public metadata in Clerk
 * @param {string} userId - Clerk user ID
 * @param {object} metadata - Metadata to update
 */
async function updateUserMetadata(userId, metadata) {
  try {
    if (!clerk) {
      console.warn('Clerk not initialized, skipping metadata update');
      return false;
    }

    console.log(`📊 Updating Clerk metadata for user ${userId}:`, metadata);
    
    await clerk.users.updateUserMetadata(userId, {
      publicMetadata: metadata
    });
    
    console.log('✅ Clerk metadata updated successfully');
    return true;
  } catch (error) {
    console.error('❌ Error updating Clerk metadata:', error.message);
    if (error.errors) {
      console.error('Details:', error.errors);
    }
    return false;
  }
}

/**
 * Increment a counter in user's metadata
 * @param {string} userId - Clerk user ID
 * @param {string} field - Field name to increment
 * @param {number} amount - Amount to increment (default: 1)
 */
async function incrementUserStat(userId, field, amount = 1) {
  try {
    if (!clerk) {
      console.warn('Clerk not initialized, skipping stat increment');
      return false;
    }

    console.log(`📈 Incrementing ${field} by ${amount} for user ${userId}`);

    // Get current user data
    const user = await clerk.users.getUser(userId);
    const currentValue = user.publicMetadata[field] || 0;
    const newValue = currentValue + amount;
    
    console.log(`   Current: ${currentValue} → New: ${newValue}`);
    
    // Update with new value
    await clerk.users.updateUserMetadata(userId, {
      publicMetadata: {
        ...user.publicMetadata,
        [field]: newValue
      }
    });
    
    console.log(`✅ ${field} updated successfully`);
    return true;
  } catch (error) {
    console.error(`❌ Error incrementing ${field}:`, error.message);
    if (error.errors) {
      console.error('Details:', error.errors);
    }
    return false;
  }
}

/**
 * Decrement a counter in user's metadata
 * @param {string} userId - Clerk user ID
 * @param {string} field - Field name to decrement
 * @param {number} amount - Amount to decrement (default: 1)
 */
async function decrementUserStat(userId, field, amount = 1) {
  try {
    if (!clerk) {
      console.warn('Clerk not initialized, skipping stat decrement');
      return false;
    }

    console.log(`📉 Decrementing ${field} by ${amount} for user ${userId}`);

    // Get current user data
    const user = await clerk.users.getUser(userId);
    const currentValue = user.publicMetadata[field] || 0;
    const newValue = Math.max(0, currentValue - amount);
    
    console.log(`   Current: ${currentValue} → New: ${newValue}`);
    
    // Update with new value (don't go below 0)
    await clerk.users.updateUserMetadata(userId, {
      publicMetadata: {
        ...user.publicMetadata,
        [field]: newValue
      }
    });
    
    console.log(`✅ ${field} updated successfully`);
    return true;
  } catch (error) {
    console.error(`❌ Error decrementing ${field}:`, error.message);
    if (error.errors) {
      console.error('Details:', error.errors);
    }
    return false;
  }
}

/**
 * Set a specific value in user's metadata
 * @param {string} userId - Clerk user ID
 * @param {string} field - Field name
 * @param {any} value - Value to set
 */
async function setUserStat(userId, field, value) {
  try {
    if (!clerk) {
      console.warn('Clerk not initialized, skipping stat update');
      return false;
    }

    console.log(`📝 Setting ${field} = ${value} for user ${userId}`);

    // Get current user data
    const user = await clerk.users.getUser(userId);
    
    // Update with new value
    await clerk.users.updateUserMetadata(userId, {
      publicMetadata: {
        ...user.publicMetadata,
        [field]: value
      }
    });
    
    console.log(`✅ ${field} set successfully`);
    return true;
  } catch (error) {
    console.error(`❌ Error setting ${field}:`, error.message);
    if (error.errors) {
      console.error('Details:', error.errors);
    }
    return false;
  }
}

module.exports = {
  updateUserMetadata,
  incrementUserStat,
  decrementUserStat,
  setUserStat
};
