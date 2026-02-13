const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

const USERS_FILE = path.join(__dirname, '../data/users-count.json');

// Ensure data file exists
async function ensureDataFile() {
  try {
    await fs.access(USERS_FILE);
  } catch {
    const initialData = {
      totalUsers: 1,
      users: [],
      lastUpdated: new Date().toISOString()
    };
    await fs.mkdir(path.dirname(USERS_FILE), { recursive: true });
    await fs.writeFile(USERS_FILE, JSON.stringify(initialData, null, 2));
  }
}

// Read users data
async function readUsersData() {
  await ensureDataFile();
  const data = await fs.readFile(USERS_FILE, 'utf-8');
  return JSON.parse(data);
}

// Write users data
async function writeUsersData(data) {
  await fs.writeFile(USERS_FILE, JSON.stringify(data, null, 2));
}

// Get platform statistics
router.get('/platform', async (req, res) => {
  try {
    console.log('📊 Stats API called');
    const data = await readUsersData();
    
    res.json({
      success: true,
      stats: {
        totalUsers: data.totalUsers,
        registeredUsers: data.users.length,
        lastUpdated: data.lastUpdated
      }
    });
  } catch (error) {
    console.error('❌ Stats API error:', error.message);
    res.json({
      success: true,
      stats: {
        totalUsers: 1,
        registeredUsers: 0,
        lastUpdated: new Date().toISOString()
      }
    });
  }
});

// Register a new user (called when user signs up)
router.post('/register-user', async (req, res) => {
  try {
    const { userId, userName, email } = req.body;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'userId is required'
      });
    }

    const data = await readUsersData();
    
    // Check if user already registered
    if (!data.users.find(u => u.userId === userId)) {
      data.users.push({
        userId,
        userName: userName || 'Anonymous',
        email: email || '',
        registeredAt: new Date().toISOString()
      });
      data.totalUsers = data.users.length;
      data.lastUpdated = new Date().toISOString();
      
      await writeUsersData(data);
      console.log(`✅ New user registered: ${userName || userId} (Total: ${data.totalUsers})`);
    }

    res.json({
      success: true,
      totalUsers: data.totalUsers
    });
  } catch (error) {
    console.error('❌ Register user error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Manually update total count (for admin/testing)
router.post('/update', async (req, res) => {
  try {
    const { totalUsers } = req.body;
    
    if (totalUsers !== undefined) {
      const data = await readUsersData();
      data.totalUsers = parseInt(totalUsers);
      data.lastUpdated = new Date().toISOString();
      await writeUsersData(data);
      
      console.log('📝 Stats manually updated:', data.totalUsers);
    }
    
    const data = await readUsersData();
    res.json({ success: true, stats: { totalUsers: data.totalUsers } });
  } catch (error) {
    console.error('❌ Update stats error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
