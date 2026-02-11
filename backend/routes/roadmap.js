const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data/roadmap');

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

// Helper functions
async function readUserData(userId) {
  try {
    const data = await fs.readFile(path.join(DATA_DIR, `${userId}.json`), 'utf-8');
    return JSON.parse(data);
  } catch {
    return {
      streak: { current: 0, longest: 0, total: 0 },
      calendar: {},
      roadmap: [],
      tasks: [],
      stats: {
        totalProblems: 0,
        easy: 0,
        medium: 0,
        hard: 0,
        byCategory: {}
      },
      lastActivity: null
    };
  }
}

async function writeUserData(userId, data) {
  await ensureDataDir();
  await fs.writeFile(
    path.join(DATA_DIR, `${userId}.json`),
    JSON.stringify(data, null, 2)
  );
}

// Calculate streak
function calculateStreak(calendar) {
  const today = new Date();
  const dateKey = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  
  // Check if user has activity today or yesterday
  const hasActivityToday = calendar[dateKey] > 0;
  
  // Calculate current streak
  let checkDate = new Date(today);
  if (!hasActivityToday) {
    checkDate.setDate(checkDate.getDate() - 1);
  }
  
  while (true) {
    const key = `${checkDate.getFullYear()}-${checkDate.getMonth() + 1}-${checkDate.getDate()}`;
    if (calendar[key] > 0) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }
  
  // Calculate longest streak
  const sortedDates = Object.keys(calendar).sort();
  for (const dateKey of sortedDates) {
    if (calendar[dateKey] > 0) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 0;
    }
  }
  
  return { current: currentStreak, longest: Math.max(longestStreak, currentStreak) };
}

// Get user roadmap data
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const userData = await readUserData(userId);
    
    // Calculate streak
    const streak = calculateStreak(userData.calendar);
    userData.streak = {
      ...streak,
      total: userData.stats.totalProblems
    };
    
    res.json({
      success: true,
      streak: userData.streak,
      calendar: userData.calendar,
      roadmap: userData.roadmap,
      tasks: userData.tasks,
      stats: userData.stats
    });
  } catch (error) {
    console.error('Get roadmap data error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Add new task
router.post('/tasks', async (req, res) => {
  try {
    const { userId, title, category, difficulty, deadline } = req.body;
    
    if (!userId || !title) {
      return res.status(400).json({
        success: false,
        error: 'userId and title are required'
      });
    }
    
    const userData = await readUserData(userId);
    
    const newTask = {
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title,
      category: category || 'arrays',
      difficulty: difficulty || 'medium',
      deadline: deadline || null,
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    userData.tasks = userData.tasks || [];
    userData.tasks.push(newTask);
    
    await writeUserData(userId, userData);
    
    res.json({
      success: true,
      task: newTask
    });
  } catch (error) {
    console.error('Add task error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Toggle task completion
router.post('/tasks/:taskId/toggle', async (req, res) => {
  try {
    const { taskId } = req.params;
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'userId is required'
      });
    }
    
    const userData = await readUserData(userId);
    const taskIndex = userData.tasks.findIndex(t => t.id === taskId);
    
    if (taskIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }
    
    // Toggle completion
    userData.tasks[taskIndex].completed = !userData.tasks[taskIndex].completed;
    
    // If completing task, update calendar and stats
    if (userData.tasks[taskIndex].completed) {
      const today = new Date();
      const dateKey = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
      
      userData.calendar[dateKey] = (userData.calendar[dateKey] || 0) + 1;
      userData.stats.totalProblems++;
      
      // Update difficulty stats
      const difficulty = userData.tasks[taskIndex].difficulty;
      userData.stats[difficulty] = (userData.stats[difficulty] || 0) + 1;
      
      // Update category stats
      const category = userData.tasks[taskIndex].category;
      userData.stats.byCategory[category] = (userData.stats.byCategory[category] || 0) + 1;
      
      userData.lastActivity = new Date().toISOString();
    } else {
      // If uncompleting, decrement stats
      const today = new Date();
      const dateKey = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
      
      if (userData.calendar[dateKey] > 0) {
        userData.calendar[dateKey]--;
      }
      
      if (userData.stats.totalProblems > 0) {
        userData.stats.totalProblems--;
      }
      
      const difficulty = userData.tasks[taskIndex].difficulty;
      if (userData.stats[difficulty] > 0) {
        userData.stats[difficulty]--;
      }
      
      const category = userData.tasks[taskIndex].category;
      if (userData.stats.byCategory[category] > 0) {
        userData.stats.byCategory[category]--;
      }
    }
    
    await writeUserData(userId, userData);
    
    res.json({
      success: true,
      task: userData.tasks[taskIndex]
    });
  } catch (error) {
    console.error('Toggle task error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Delete task
router.delete('/tasks/:taskId', async (req, res) => {
  try {
    const { taskId } = req.params;
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'userId is required'
      });
    }
    
    const userData = await readUserData(userId);
    const taskIndex = userData.tasks.findIndex(t => t.id === taskId);
    
    if (taskIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }
    
    userData.tasks.splice(taskIndex, 1);
    await writeUserData(userId, userData);
    
    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Record problem completion (called from LeetCode editor)
router.post('/record-completion', async (req, res) => {
  try {
    const { userId, problemId, difficulty, category } = req.body;
    
    if (!userId || !problemId) {
      return res.status(400).json({
        success: false,
        error: 'userId and problemId are required'
      });
    }
    
    const userData = await readUserData(userId);
    
    // Update calendar
    const today = new Date();
    const dateKey = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    userData.calendar[dateKey] = (userData.calendar[dateKey] || 0) + 1;
    
    // Update stats
    userData.stats.totalProblems++;
    if (difficulty) {
      userData.stats[difficulty.toLowerCase()] = (userData.stats[difficulty.toLowerCase()] || 0) + 1;
    }
    if (category) {
      userData.stats.byCategory[category.toLowerCase()] = (userData.stats.byCategory[category.toLowerCase()] || 0) + 1;
    }
    
    userData.lastActivity = new Date().toISOString();
    
    await writeUserData(userId, userData);
    
    res.json({
      success: true,
      message: 'Completion recorded'
    });
  } catch (error) {
    console.error('Record completion error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
