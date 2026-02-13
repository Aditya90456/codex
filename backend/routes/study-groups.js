const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const fs = require('fs').promises;
const path = require('path');
const { incrementUserStat, decrementUserStat } = require('../utils/clerk-sync');

// Data directory
const DATA_DIR = path.join(__dirname, '../data/study-groups');

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    console.error('Error creating data directory:', error);
  }
}

ensureDataDir();

// Helper functions
async function readData(filename) {
  try {
    const data = await fs.readFile(path.join(DATA_DIR, filename), 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return null;
  }
}

async function writeData(filename, data) {
  await fs.writeFile(path.join(DATA_DIR, filename), JSON.stringify(data, null, 2));
}

// Create a new study group
router.post('/create', async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      isPrivate,
      maxMembers,
      creatorId,
      creatorName,
      tags
    } = req.body;

    if (!name || !creatorId) {
      return res.status(400).json({
        success: false,
        error: 'Group name and creator ID are required'
      });
    }

    const groupId = crypto.randomBytes(8).toString('hex');
    const inviteCode = crypto.randomBytes(4).toString('hex').toUpperCase();

    const group = {
      id: groupId,
      name,
      description: description || '',
      category: category || 'General',
      isPrivate: isPrivate || false,
      maxMembers: maxMembers || 50,
      inviteCode: isPrivate ? inviteCode : null,
      creatorId,
      creatorName,
      tags: tags || [],
      members: [{
        userId: creatorId,
        userName: creatorName,
        role: 'admin',
        joinedAt: new Date().toISOString(),
        problemsSolved: 0,
        contributions: 0
      }],
      challenges: [],
      messages: [],
      stats: {
        totalProblems: 0,
        totalMembers: 1,
        activeMembers: 1,
        averageProgress: 0
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await writeData(`group_${groupId}.json`, group);

    res.json({
      success: true,
      group,
      message: 'Study group created successfully'
    });

  } catch (error) {
    console.error('Create group error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create study group'
    });
  }
});

// Get all public groups or search
router.get('/discover', async (req, res) => {
  try {
    const { search, category, limit = 20 } = req.query;
    
    const files = await fs.readdir(DATA_DIR);
    const groupFiles = files.filter(f => f.startsWith('group_'));
    
    let groups = [];
    for (const file of groupFiles) {
      const group = await readData(file);
      if (group && !group.isPrivate) {
        // Remove sensitive data
        const publicGroup = {
          id: group.id,
          name: group.name,
          description: group.description,
          category: group.category,
          tags: group.tags,
          creatorName: group.creatorName,
          stats: group.stats,
          createdAt: group.createdAt
        };
        groups.push(publicGroup);
      }
    }

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      groups = groups.filter(g => 
        g.name.toLowerCase().includes(searchLower) ||
        g.description.toLowerCase().includes(searchLower) ||
        g.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Filter by category
    if (category && category !== 'All') {
      groups = groups.filter(g => g.category === category);
    }

    // Sort by members
    groups.sort((a, b) => b.stats.totalMembers - a.stats.totalMembers);

    // Limit results
    groups = groups.slice(0, parseInt(limit));

    res.json({
      success: true,
      groups,
      total: groups.length
    });

  } catch (error) {
    console.error('Discover groups error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch groups'
    });
  }
});

// Get group details
router.get('/:groupId', async (req, res) => {
  try {
    const { groupId } = req.params;
    const group = await readData(`group_${groupId}.json`);

    if (!group) {
      return res.status(404).json({
        success: false,
        error: 'Group not found'
      });
    }

    res.json({
      success: true,
      group
    });

  } catch (error) {
    console.error('Get group error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get group'
    });
  }
});

// Join a group
router.post('/:groupId/join', async (req, res) => {
  try {
    const { groupId } = req.params;
    const { userId, userName, inviteCode } = req.body;

    if (!userId || !userName) {
      return res.status(400).json({
        success: false,
        error: 'User ID and name are required'
      });
    }

    const group = await readData(`group_${groupId}.json`);

    if (!group) {
      return res.status(404).json({
        success: false,
        error: 'Group not found'
      });
    }

    // Check if already a member
    if (group.members.some(m => m.userId === userId)) {
      return res.status(400).json({
        success: false,
        error: 'Already a member of this group'
      });
    }

    // Check if group is full
    if (group.members.length >= group.maxMembers) {
      return res.status(400).json({
        success: false,
        error: 'Group is full'
      });
    }

    // Check invite code for private groups
    if (group.isPrivate && group.inviteCode !== inviteCode) {
      return res.status(403).json({
        success: false,
        error: 'Invalid invite code'
      });
    }

    // Add member
    group.members.push({
      userId,
      userName,
      role: 'member',
      joinedAt: new Date().toISOString(),
      problemsSolved: 0,
      contributions: 0
    });

    group.stats.totalMembers = group.members.length;
    group.stats.activeMembers = group.members.length;
    group.updatedAt = new Date().toISOString();

    await writeData(`group_${groupId}.json`, group);

    // Sync to Clerk metadata
    await incrementUserStat(userId, 'studyGroups');

    res.json({
      success: true,
      group,
      message: 'Joined group successfully'
    });

  } catch (error) {
    console.error('Join group error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to join group'
    });
  }
});

// Leave a group
router.post('/:groupId/leave', async (req, res) => {
  try {
    const { groupId } = req.params;
    const { userId } = req.body;

    const group = await readData(`group_${groupId}.json`);

    if (!group) {
      return res.status(404).json({
        success: false,
        error: 'Group not found'
      });
    }

    // Can't leave if you're the creator
    if (group.creatorId === userId) {
      return res.status(400).json({
        success: false,
        error: 'Group creator cannot leave. Delete the group instead.'
      });
    }

    // Remove member
    group.members = group.members.filter(m => m.userId !== userId);
    group.stats.totalMembers = group.members.length;
    group.stats.activeMembers = group.members.length;
    group.updatedAt = new Date().toISOString();

    await writeData(`group_${groupId}.json`, group);

    // Sync to Clerk metadata
    await decrementUserStat(userId, 'studyGroups');

    res.json({
      success: true,
      message: 'Left group successfully'
    });

  } catch (error) {
    console.error('Leave group error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to leave group'
    });
  }
});

// Create a group challenge
router.post('/:groupId/challenges', async (req, res) => {
  try {
    const { groupId } = req.params;
    const {
      title,
      description,
      problemIds,
      duration,
      creatorId
    } = req.body;

    const group = await readData(`group_${groupId}.json`);

    if (!group) {
      return res.status(404).json({
        success: false,
        error: 'Group not found'
      });
    }

    const challengeId = crypto.randomBytes(6).toString('hex');
    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + duration * 24 * 60 * 60 * 1000);

    const challenge = {
      id: challengeId,
      title,
      description,
      problemIds: problemIds || [],
      creatorId,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      participants: [],
      leaderboard: [],
      status: 'active',
      createdAt: new Date().toISOString()
    };

    group.challenges.push(challenge);
    group.updatedAt = new Date().toISOString();

    await writeData(`group_${groupId}.json`, group);

    res.json({
      success: true,
      challenge,
      message: 'Challenge created successfully'
    });

  } catch (error) {
    console.error('Create challenge error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create challenge'
    });
  }
});

// Post a message to group chat
router.post('/:groupId/messages', async (req, res) => {
  try {
    const { groupId } = req.params;
    const { userId, userName, message } = req.body;

    if (!message || !userId) {
      return res.status(400).json({
        success: false,
        error: 'Message and user ID are required'
      });
    }

    const group = await readData(`group_${groupId}.json`);

    if (!group) {
      return res.status(404).json({
        success: false,
        error: 'Group not found'
      });
    }

    // Check if user is a member
    if (!group.members.some(m => m.userId === userId)) {
      return res.status(403).json({
        success: false,
        error: 'Only group members can post messages'
      });
    }

    const newMessage = {
      id: crypto.randomBytes(4).toString('hex'),
      userId,
      userName,
      message,
      timestamp: new Date().toISOString(),
      reactions: []
    };

    group.messages.push(newMessage);
    
    // Keep only last 100 messages
    if (group.messages.length > 100) {
      group.messages = group.messages.slice(-100);
    }

    group.updatedAt = new Date().toISOString();

    await writeData(`group_${groupId}.json`, group);

    res.json({
      success: true,
      message: newMessage
    });

  } catch (error) {
    console.error('Post message error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to post message'
    });
  }
});

// Get user's groups
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const files = await fs.readdir(DATA_DIR);
    const groupFiles = files.filter(f => f.startsWith('group_'));
    
    let userGroups = [];
    for (const file of groupFiles) {
      const group = await readData(file);
      if (group && group.members.some(m => m.userId === userId)) {
        userGroups.push(group);
      }
    }

    res.json({
      success: true,
      groups: userGroups,
      total: userGroups.length
    });

  } catch (error) {
    console.error('Get user groups error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get user groups'
    });
  }
});

// Update member progress
router.post('/:groupId/progress', async (req, res) => {
  try {
    const { groupId } = req.params;
    const { userId, problemsSolved } = req.body;

    const group = await readData(`group_${groupId}.json`);

    if (!group) {
      return res.status(404).json({
        success: false,
        error: 'Group not found'
      });
    }

    const member = group.members.find(m => m.userId === userId);
    if (member) {
      member.problemsSolved = problemsSolved;
      member.contributions += 1;
    }

    // Update group stats
    const totalSolved = group.members.reduce((sum, m) => sum + m.problemsSolved, 0);
    group.stats.totalProblems = totalSolved;
    group.stats.averageProgress = Math.round(totalSolved / group.members.length);
    group.updatedAt = new Date().toISOString();

    await writeData(`group_${groupId}.json`, group);

    res.json({
      success: true,
      stats: group.stats
    });

  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update progress'
    });
  }
});

module.exports = router;
