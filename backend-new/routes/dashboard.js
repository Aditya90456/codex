const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const User = require('../models/User');
const Problem = require('../models/Problem');
const Submission = require('../models/Submission');

// Get dashboard statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user submissions
    const submissions = await Submission.find({ userId });
    const acceptedSubmissions = submissions.filter(s => s.status === 'Accepted');
    
    // Get total problems
    const totalProblems = await Problem.countDocuments();
    
    // Calculate statistics
    const stats = {
      totalSubmissions: submissions.length,
      acceptedSubmissions: acceptedSubmissions.length,
      problemsSolved: [...new Set(acceptedSubmissions.map(s => s.problemId))].length,
      totalProblems,
      acceptanceRate: submissions.length > 0 ? (acceptedSubmissions.length / submissions.length * 100).toFixed(1) : 0,
      recentActivity: submissions.slice(-5).reverse()
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics'
    });
  }
});

// Get recent activity
router.get('/activity', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 10 } = req.query;
    
    const recentSubmissions = await Submission.find({ userId })
      .populate('problemId', 'title difficulty')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: recentSubmissions
    });
  } catch (error) {
    console.error('Recent activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch recent activity'
    });
  }
});

module.exports = router;