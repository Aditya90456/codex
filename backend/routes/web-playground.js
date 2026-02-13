const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

// File-based storage for playground data
const PLAYGROUND_DIR = path.join(__dirname, '../data/web-playground');

// Ensure playground directory exists
async function ensurePlaygroundDir() {
  try {
    await fs.access(PLAYGROUND_DIR);
  } catch {
    await fs.mkdir(PLAYGROUND_DIR, { recursive: true });
  }
}

// Get user's progress file path
function getUserProgressFile(userId) {
  return path.join(PLAYGROUND_DIR, `${userId}-progress.json`);
}

// Get leaderboard file path
function getLeaderboardFile() {
  return path.join(PLAYGROUND_DIR, 'leaderboard.json');
}

// Load user's progress
async function loadUserProgress(userId) {
  try {
    await ensurePlaygroundDir();
    const filePath = getUserProgressFile(userId);
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return {
      userId,
      completed: [],
      progress: {},
      submissions: [],
      totalPoints: 0,
      lastActivity: new Date().toISOString()
    };
  }
}

// Save user's progress
async function saveUserProgress(userId, data) {
  await ensurePlaygroundDir();
  const filePath = getUserProgressFile(userId);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

// Load leaderboard
async function loadLeaderboard() {
  try {
    await ensurePlaygroundDir();
    const filePath = getLeaderboardFile();
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Save leaderboard
async function saveLeaderboard(data) {
  await ensurePlaygroundDir();
  const filePath = getLeaderboardFile();
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

// Update leaderboard
async function updateLeaderboard(userId, username, totalPoints, completedCount) {
  const leaderboard = await loadLeaderboard();
  
  const existingIndex = leaderboard.findIndex(entry => entry.userId === userId);
  
  const entry = {
    userId,
    username,
    totalPoints,
    completedCount,
    lastUpdated: new Date().toISOString()
  };
  
  if (existingIndex >= 0) {
    leaderboard[existingIndex] = entry;
  } else {
    leaderboard.push(entry);
  }
  
  // Sort by total points descending
  leaderboard.sort((a, b) => b.totalPoints - a.totalPoints);
  
  await saveLeaderboard(leaderboard);
  return leaderboard;
}

// Automated test evaluation
function evaluateSubmission(assignment, code) {
  const results = {
    passed: [],
    failed: [],
    score: 0,
    maxScore: 0,
    feedback: []
  };

  if (!assignment.testCases) {
    return results;
  }

  assignment.testCases.forEach(testCase => {
    results.maxScore += testCase.points;
    
    let passed = false;
    let feedback = '';

    // Automated checks based on test case
    switch (testCase.test) {
      case 'Has semantic HTML5 tags':
        passed = /<(header|nav|main|section|article|aside|footer)/.test(code.html);
        feedback = passed ? 'Good use of semantic HTML' : 'Add semantic HTML5 tags';
        break;
        
      case 'Responsive on all screen sizes':
        passed = /@media/.test(code.css) || /viewport/.test(code.html);
        feedback = passed ? 'Responsive design detected' : 'Add media queries for responsiveness';
        break;
        
      case 'Navigation works correctly':
        passed = /<nav/.test(code.html) && /href/.test(code.html);
        feedback = passed ? 'Navigation structure found' : 'Add proper navigation';
        break;
        
      case 'Form validation implemented':
        passed = /required|validate|checkValidity/.test(code.html + code.js);
        feedback = passed ? 'Form validation detected' : 'Add form validation';
        break;
        
      case 'Clean CSS organization':
        passed = code.css.split('\n').length > 10 && /\/\*/.test(code.css);
        feedback = passed ? 'Well-organized CSS' : 'Improve CSS organization';
        break;
        
      case 'Accessibility features (ARIA)':
        passed = /aria-|role=|alt=/.test(code.html);
        feedback = passed ? 'Accessibility features found' : 'Add ARIA labels and alt text';
        break;
        
      case 'Cross-browser compatibility':
        passed = /-webkit-|-moz-|-ms-/.test(code.css) || /box-sizing/.test(code.css);
        feedback = passed ? 'Browser prefixes detected' : 'Add vendor prefixes';
        break;
        
      case 'CRUD operations work':
        passed = /add|create|delete|remove|update|edit/.test(code.js.toLowerCase());
        feedback = passed ? 'CRUD operations implemented' : 'Implement CRUD operations';
        break;
        
      case 'Data persists in localStorage':
        passed = /localStorage/.test(code.js);
        feedback = passed ? 'LocalStorage used' : 'Add localStorage persistence';
        break;
        
      case 'API integration works':
        passed = /fetch|axios|XMLHttpRequest/.test(code.js);
        feedback = passed ? 'API calls detected' : 'Add API integration';
        break;
        
      case 'Error handling':
        passed = /try|catch|error/.test(code.js.toLowerCase());
        feedback = passed ? 'Error handling found' : 'Add error handling';
        break;
        
      case 'Loading states':
        passed = /loading|spinner|skeleton/.test(code.html + code.js + code.css);
        feedback = passed ? 'Loading states implemented' : 'Add loading indicators';
        break;
        
      case 'Mobile responsive':
        passed = /@media.*max-width/.test(code.css);
        feedback = passed ? 'Mobile breakpoints found' : 'Add mobile breakpoints';
        break;
        
      default:
        // Generic check - assume passed if code is substantial
        passed = (code.html + code.css + code.js).length > 500;
        feedback = passed ? 'Implementation detected' : 'Add more implementation';
    }

    if (passed) {
      results.passed.push(testCase.test);
      results.score += testCase.points;
    } else {
      results.failed.push(testCase.test);
    }
    
    results.feedback.push({
      test: testCase.test,
      passed,
      points: passed ? testCase.points : 0,
      maxPoints: testCase.points,
      feedback
    });
  });

  return results;
}

// Get user progress
router.get('/progress/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const progress = await loadUserProgress(userId);
    
    res.json({
      success: true,
      progress: progress.progress,
      completed: progress.completed,
      totalPoints: progress.totalPoints,
      submissions: progress.submissions
    });
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch progress'
    });
  }
});

// Submit assignment
router.post('/submit', async (req, res) => {
  try {
    const { userId, assignmentId, code, timestamp, username } = req.body;
    
    if (!userId || !assignmentId || !code) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }
    
    const progress = await loadUserProgress(userId);
    
    // Load assignment data (you'll need to import this)
    const { webAssignments } = require('../data/webAssignments');
    const allAssignments = [
      ...webAssignments.beginner,
      ...webAssignments.intermediate,
      ...webAssignments.advanced,
      ...webAssignments.expert
    ];
    
    const assignment = allAssignments.find(a => a.id === assignmentId);
    
    if (!assignment) {
      return res.status(404).json({
        success: false,
        error: 'Assignment not found'
      });
    }
    
    // Evaluate submission
    const evaluation = evaluateSubmission(assignment, code);
    
    // Calculate final score
    const scorePercentage = evaluation.maxScore > 0 
      ? Math.round((evaluation.score / evaluation.maxScore) * 100)
      : 0;
    
    // Save submission
    const submission = {
      assignmentId,
      timestamp: timestamp || new Date().toISOString(),
      code,
      evaluation,
      score: scorePercentage,
      points: evaluation.score
    };
    
    progress.submissions.push(submission);
    
    // Update completion status
    if (scorePercentage >= 70 && !progress.completed.includes(assignmentId)) {
      progress.completed.push(assignmentId);
      progress.totalPoints += evaluation.score;
    }
    
    // Update progress percentage
    progress.progress[assignmentId] = scorePercentage;
    progress.lastActivity = new Date().toISOString();
    
    await saveUserProgress(userId, progress);
    
    // Update leaderboard
    await updateLeaderboard(
      userId,
      username || 'Anonymous',
      progress.totalPoints,
      progress.completed.length
    );
    
    res.json({
      success: true,
      score: scorePercentage,
      points: evaluation.score,
      maxPoints: evaluation.maxScore,
      evaluation,
      completed: scorePercentage >= 70,
      message: scorePercentage >= 70 
        ? 'Congratulations! Assignment completed!' 
        : 'Keep working! You need 70% to complete.'
    });
  } catch (error) {
    console.error('Error submitting assignment:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit assignment'
    });
  }
});

// Get leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const leaderboard = await loadLeaderboard();
    
    res.json({
      success: true,
      leaderboard: leaderboard.slice(0, 100) // Top 100
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch leaderboard'
    });
  }
});

// Get assignment details
router.get('/assignment/:assignmentId', async (req, res) => {
  try {
    const { assignmentId } = req.params;
    
    const { webAssignments } = require('../data/webAssignments');
    const allAssignments = [
      ...webAssignments.beginner,
      ...webAssignments.intermediate,
      ...webAssignments.advanced,
      ...webAssignments.expert
    ];
    
    const assignment = allAssignments.find(a => a.id === assignmentId);
    
    if (!assignment) {
      return res.status(404).json({
        success: false,
        error: 'Assignment not found'
      });
    }
    
    res.json({
      success: true,
      assignment
    });
  } catch (error) {
    console.error('Error fetching assignment:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch assignment'
    });
  }
});

// Get user statistics
router.get('/stats/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const progress = await loadUserProgress(userId);
    const leaderboard = await loadLeaderboard();
    
    const rank = leaderboard.findIndex(entry => entry.userId === userId) + 1;
    
    const stats = {
      totalCompleted: progress.completed.length,
      totalPoints: progress.totalPoints,
      totalSubmissions: progress.submissions.length,
      rank: rank || null,
      lastActivity: progress.lastActivity,
      averageScore: progress.submissions.length > 0
        ? Math.round(progress.submissions.reduce((sum, s) => sum + s.score, 0) / progress.submissions.length)
        : 0
    };
    
    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch stats'
    });
  }
});

module.exports = router;
