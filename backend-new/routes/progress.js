const express = require('express');
const router = express.Router();
const UserProgress = require('../models/UserProgress');
const Problem = require('../models/Problem');
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get user's progress for all problems
router.get('/', auth, async (req, res) => {
  try {
    const progress = await UserProgress.find({ userId: req.user.id })
      .populate('problemId', 'title slug difficulty category')
      .sort({ lastAttemptAt: -1 });

    res.json({
      success: true,
      data: progress
    });
  } catch (error) {
    console.error('Error fetching user progress:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get user's progress for a specific problem
router.get('/problem/:problemId', auth, async (req, res) => {
  try {
    const progress = await UserProgress.findOne({
      userId: req.user.id,
      problemId: req.params.problemId
    }).populate('problemId', 'title slug difficulty category');

    if (!progress) {
      return res.json({
        success: true,
        data: null
      });
    }

    res.json({
      success: true,
      data: progress
    });
  } catch (error) {
    console.error('Error fetching problem progress:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Update problem progress
router.post('/problem/:problemId', auth, async (req, res) => {
  try {
    const { status, timeSpent, notes, rating, solution } = req.body;
    const problemId = req.params.problemId;

    // Verify problem exists
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found'
      });
    }

    // Find or create progress record
    let progress = await UserProgress.findOne({
      userId: req.user.id,
      problemId: problemId
    });

    if (!progress) {
      progress = new UserProgress({
        userId: req.user.id,
        problemId: problemId,
        difficulty: problem.difficulty,
        category: problem.category
      });
    }

    // Update progress
    if (status) {
      progress.status = status;
      if (status === 'solved' && !progress.firstSolvedAt) {
        progress.firstSolvedAt = new Date();
      }
    }

    if (timeSpent !== undefined) {
      progress.timeSpent += timeSpent;
    }

    if (notes !== undefined) {
      progress.notes = notes;
    }

    if (rating !== undefined) {
      progress.rating = rating;
    }

    if (solution) {
      progress.solutions.push({
        language: solution.language,
        code: solution.code,
        runtime: solution.runtime,
        memory: solution.memory
      });
    }

    progress.attempts += 1;
    progress.lastAttemptAt = new Date();

    await progress.save();

    res.json({
      success: true,
      data: progress
    });
  } catch (error) {
    console.error('Error updating progress:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get user statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Get detailed progress statistics
    const progressStats = await UserProgress.aggregate([
      { $match: { userId: req.user.id } },
      {
        $group: {
          _id: null,
          totalProblems: { $sum: 1 },
          solvedProblems: {
            $sum: { $cond: [{ $eq: ['$status', 'solved'] }, 1, 0] }
          },
          attemptedProblems: {
            $sum: { $cond: [{ $ne: ['$status', 'not_started'] }, 1, 0] }
          },
          easySolved: {
            $sum: { 
              $cond: [
                { $and: [{ $eq: ['$status', 'solved'] }, { $eq: ['$difficulty', 'Easy'] }] }, 
                1, 0
              ]
            }
          },
          mediumSolved: {
            $sum: { 
              $cond: [
                { $and: [{ $eq: ['$status', 'solved'] }, { $eq: ['$difficulty', 'Medium'] }] }, 
                1, 0
              ]
            }
          },
          hardSolved: {
            $sum: { 
              $cond: [
                { $and: [{ $eq: ['$status', 'solved'] }, { $eq: ['$difficulty', 'Hard'] }] }, 
                1, 0
              ]
            }
          },
          totalTimeSpent: { $sum: '$timeSpent' },
          averageRating: { $avg: '$rating' }
        }
      }
    ]);

    // Get category-wise progress
    const categoryStats = await UserProgress.aggregate([
      { $match: { userId: req.user.id } },
      {
        $group: {
          _id: '$category',
          total: { $sum: 1 },
          solved: {
            $sum: { $cond: [{ $eq: ['$status', 'solved'] }, 1, 0] }
          }
        }
      },
      {
        $project: {
          category: '$_id',
          total: 1,
          solved: 1,
          percentage: {
            $multiply: [
              { $divide: ['$solved', '$total'] },
              100
            ]
          }
        }
      }
    ]);

    // Get recent activity
    const recentActivity = await UserProgress.find({
      userId: req.user.id,
      status: { $ne: 'not_started' }
    })
    .populate('problemId', 'title slug difficulty')
    .sort({ lastAttemptAt: -1 })
    .limit(10);

    // Calculate global rank (simplified)
    const userRank = await User.countDocuments({
      'stats.problemsSolved': { $gt: user.stats.problemsSolved }
    }) + 1;

    const stats = progressStats[0] || {
      totalProblems: 0,
      solvedProblems: 0,
      attemptedProblems: 0,
      easySolved: 0,
      mediumSolved: 0,
      hardSolved: 0,
      totalTimeSpent: 0,
      averageRating: 0
    };

    res.json({
      success: true,
      data: {
        user: {
          username: user.username,
          avatar: user.avatar,
          streak: user.stats.streak,
          rank: userRank,
          points: user.stats.problemsSolved * 10 + user.stats.streak * 5
        },
        progress: {
          ...stats,
          percentage: stats.totalProblems > 0 ? Math.round((stats.solvedProblems / stats.totalProblems) * 100) : 0
        },
        categories: categoryStats,
        recentActivity: recentActivity
      }
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const { limit = 50, category } = req.query;

    let matchStage = {};
    if (category && category !== 'all') {
      matchStage.category = category;
    }

    const leaderboard = await UserProgress.aggregate([
      { $match: { status: 'solved', ...matchStage } },
      {
        $group: {
          _id: '$userId',
          solvedCount: { $sum: 1 },
          totalTimeSpent: { $sum: '$timeSpent' },
          averageRating: { $avg: '$rating' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          username: '$user.username',
          avatar: '$user.avatar',
          solvedCount: 1,
          totalTimeSpent: 1,
          averageRating: 1,
          streak: '$user.stats.streak',
          points: {
            $add: [
              { $multiply: ['$solvedCount', 10] },
              { $multiply: ['$user.stats.streak', 5] }
            ]
          }
        }
      },
      { $sort: { points: -1, solvedCount: -1 } },
      { $limit: parseInt(limit) }
    ]);

    res.json({
      success: true,
      data: leaderboard
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get daily challenge progress
router.get('/daily-challenge', auth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayProgress = await UserProgress.find({
      userId: req.user.id,
      lastAttemptAt: {
        $gte: today,
        $lt: tomorrow
      }
    }).populate('problemId', 'title difficulty');

    const weeklyGoal = 5; // Default weekly goal
    const thisWeek = new Date();
    thisWeek.setDate(thisWeek.getDate() - thisWeek.getDay());
    thisWeek.setHours(0, 0, 0, 0);

    const weeklyProgress = await UserProgress.countDocuments({
      userId: req.user.id,
      status: 'solved',
      firstSolvedAt: { $gte: thisWeek }
    });

    res.json({
      success: true,
      data: {
        today: {
          attempted: todayProgress.length,
          solved: todayProgress.filter(p => p.status === 'solved').length,
          problems: todayProgress
        },
        weekly: {
          goal: weeklyGoal,
          progress: weeklyProgress,
          percentage: Math.round((weeklyProgress / weeklyGoal) * 100)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching daily challenge:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;