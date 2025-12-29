const express = require('express');
const User = require('../models/User');
const Problem = require('../models/Problem');
const Submission = require('../models/Submission');
const { auth, optionalAuth } = require('../middleware/auth');
const router = express.Router();

// Get dashboard statistics
router.get('/stats', optionalAuth, async (req, res) => {
  try {
    // Get overall platform statistics
    const [
      totalUsers,
      totalProblems,
      totalSubmissions,
      acceptedSubmissions,
      activeUsers,
      problemsByDifficulty,
      recentActivity
    ] = await Promise.all([
      User.countDocuments({ isActive: true }),
      Problem.countDocuments({ isActive: true }),
      Submission.countDocuments(),
      Submission.countDocuments({ status: 'Accepted' }),
      User.countDocuments({ 
        isActive: true, 
        lastLoginAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } 
      }),
      Problem.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$difficulty', count: { $sum: 1 } } }
      ]),
      Submission.find()
        .populate('user', 'username avatar')
        .populate('problem', 'title difficulty')
        .sort({ createdAt: -1 })
        .limit(10)
        .select('status runtime language createdAt')
    ]);

    // Get user-specific stats if authenticated
    let userStats = null;
    if (req.user) {
      const user = await User.findById(req.user.userId);
      if (user) {
        const userSubmissions = await Submission.countDocuments({ user: user._id });
        const userAccepted = await Submission.countDocuments({ 
          user: user._id, 
          status: 'Accepted' 
        });
        
        userStats = {
          points: user.points,
          level: user.level,
          problemsSolved: user.stats.problemsSolved,
          totalSubmissions: userSubmissions,
          acceptanceRate: userSubmissions > 0 ? Math.round((userAccepted / userSubmissions) * 100) : 0,
          streak: user.streak.current,
          rank: await getUserRank(user._id)
        };
      }
    }

    const stats = {
      platform: {
        totalUsers,
        totalProblems,
        totalSubmissions,
        acceptedSubmissions,
        activeUsers,
        acceptanceRate: totalSubmissions > 0 ? Math.round((acceptedSubmissions / totalSubmissions) * 100) : 0,
        problemsByDifficulty: problemsByDifficulty.reduce((acc, item) => {
          acc[item._id.toLowerCase()] = item.count;
          return acc;
        }, { easy: 0, medium: 0, hard: 0 })
      },
      user: userStats,
      recentActivity: recentActivity.map(activity => ({
        id: activity._id,
        user: activity.user,
        problem: activity.problem,
        status: activity.status,
        runtime: activity.runtime,
        language: activity.language,
        submittedAt: activity.createdAt
      }))
    };

    res.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics'
    });
  }
});

// Get user activity feed
router.get('/activity', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    
    // Get user's recent submissions and achievements
    const [submissions, user] = await Promise.all([
      Submission.find({ user: req.user.userId })
        .populate('problem', 'title difficulty slug')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .select('status runtime memory language createdAt pointsEarned'),
      User.findById(req.user.userId).select('achievements')
    ]);

    // Combine submissions and achievements into activity feed
    const activities = [];

    // Add submissions
    submissions.forEach(submission => {
      activities.push({
        type: 'submission',
        id: submission._id,
        timestamp: submission.createdAt,
        data: {
          problem: submission.problem,
          status: submission.status,
          runtime: submission.runtime,
          memory: submission.memory,
          language: submission.language,
          pointsEarned: submission.pointsEarned
        }
      });
    });

    // Add recent achievements (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    if (user && user.achievements) {
      user.achievements
        .filter(achievement => achievement.unlockedAt >= thirtyDaysAgo)
        .forEach(achievement => {
          activities.push({
            type: 'achievement',
            id: achievement.id,
            timestamp: achievement.unlockedAt,
            data: {
              name: achievement.name,
              description: achievement.description,
              icon: achievement.icon
            }
          });
        });
    }

    // Sort by timestamp (newest first)
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.json({
      success: true,
      activities: activities.slice(0, limit),
      pagination: {
        currentPage: parseInt(page),
        hasNext: activities.length > limit,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Get activity error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch activity feed'
    });
  }
});

// Get global leaderboard
router.get('/leaderboard', optionalAuth, async (req, res) => {
  try {
    const { type = 'points', period = 'all', limit = 50 } = req.query;
    
    let matchStage = { isActive: true };
    let sortStage = {};

    // Define time periods
    if (period !== 'all') {
      const now = new Date();
      let startDate;
      
      switch (period) {
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case 'year':
          startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = null;
      }
      
      if (startDate) {
        matchStage.createdAt = { $gte: startDate };
      }
    }

    // Define sort criteria
    switch (type) {
      case 'points':
        sortStage = { points: -1, 'stats.problemsSolved': -1 };
        break;
      case 'problems':
        sortStage = { 'stats.problemsSolved': -1, points: -1 };
        break;
      case 'streak':
        sortStage = { 'streak.current': -1, points: -1 };
        break;
      case 'acceptance':
        sortStage = { acceptanceRate: -1, points: -1 };
        break;
      default:
        sortStage = { points: -1 };
    }

    const leaderboard = await User.aggregate([
      { $match: matchStage },
      {
        $addFields: {
          acceptanceRate: {
            $cond: [
              { $eq: ['$stats.totalSubmissions', 0] },
              0,
              {
                $multiply: [
                  { $divide: ['$stats.acceptedSubmissions', '$stats.totalSubmissions'] },
                  100
                ]
              }
            ]
          }
        }
      },
      { $sort: sortStage },
      { $limit: parseInt(limit) },
      {
        $project: {
          username: 1,
          firstName: 1,
          lastName: 1,
          avatar: 1,
          points: 1,
          level: 1,
          'stats.problemsSolved': 1,
          'stats.totalSubmissions': 1,
          'stats.acceptedSubmissions': 1,
          'streak.current': 1,
          acceptanceRate: { $round: ['$acceptanceRate', 1] },
          createdAt: 1
        }
      }
    ]);

    // Add rank to each user
    const leaderboardWithRank = leaderboard.map((user, index) => ({
      ...user,
      rank: index + 1,
      fullName: `${user.firstName} ${user.lastName}`,
      isCurrentUser: req.user && req.user.userId === user._id.toString()
    }));

    // Get current user's rank if authenticated
    let currentUserRank = null;
    if (req.user) {
      currentUserRank = await getUserRank(req.user.userId);
    }

    res.json({
      success: true,
      leaderboard: leaderboardWithRank,
      currentUserRank,
      filters: {
        type,
        period,
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch leaderboard'
    });
  }
});

// Get trending problems
router.get('/trending', optionalAuth, async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    // Get problems with most submissions in the last 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    const trendingProblems = await Submission.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: '$problem',
          submissionCount: { $sum: 1 },
          acceptedCount: {
            $sum: { $cond: [{ $eq: ['$status', 'Accepted'] }, 1, 0] }
          },
          uniqueUsers: { $addToSet: '$user' }
        }
      },
      {
        $lookup: {
          from: 'problems',
          localField: '_id',
          foreignField: '_id',
          as: 'problemInfo'
        }
      },
      {
        $unwind: '$problemInfo'
      },
      {
        $match: {
          'problemInfo.isActive': true
        }
      },
      {
        $project: {
          problem: '$problemInfo',
          submissionCount: 1,
          acceptedCount: 1,
          uniqueUserCount: { $size: '$uniqueUsers' },
          trendingScore: {
            $add: [
              { $multiply: ['$submissionCount', 0.6] },
              { $multiply: [{ $size: '$uniqueUsers' }, 0.4] }
            ]
          }
        }
      },
      {
        $sort: { trendingScore: -1 }
      },
      {
        $limit: parseInt(limit)
      }
    ]);

    res.json({
      success: true,
      problems: trendingProblems.map(item => ({
        ...item.problem,
        trendingStats: {
          submissionCount: item.submissionCount,
          acceptedCount: item.acceptedCount,
          uniqueUserCount: item.uniqueUserCount,
          acceptanceRate: item.submissionCount > 0 
            ? Math.round((item.acceptedCount / item.submissionCount) * 100)
            : 0
        }
      }))
    });

  } catch (error) {
    console.error('Get trending problems error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch trending problems'
    });
  }
});

// Get user progress analytics
router.get('/analytics', auth, async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    
    let startDate;
    const now = new Date();
    
    switch (period) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const analytics = await Submission.aggregate([
      {
        $match: {
          user: req.user.userId,
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            status: '$status'
          },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: '$_id.date',
          submissions: {
            $push: {
              status: '$_id.status',
              count: '$count'
            }
          },
          totalSubmissions: { $sum: '$count' }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Process analytics data
    const dailyStats = analytics.map(day => {
      const stats = { date: day._id, total: day.totalSubmissions, accepted: 0, failed: 0 };
      
      day.submissions.forEach(submission => {
        if (submission.status === 'Accepted') {
          stats.accepted = submission.count;
        } else {
          stats.failed += submission.count;
        }
      });
      
      return stats;
    });

    res.json({
      success: true,
      analytics: {
        period,
        dailyStats,
        summary: {
          totalDays: dailyStats.length,
          totalSubmissions: dailyStats.reduce((sum, day) => sum + day.total, 0),
          totalAccepted: dailyStats.reduce((sum, day) => sum + day.accepted, 0),
          averagePerDay: dailyStats.length > 0 
            ? Math.round(dailyStats.reduce((sum, day) => sum + day.total, 0) / dailyStats.length)
            : 0
        }
      }
    });

  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics'
    });
  }
});

// Helper function to get user rank
async function getUserRank(userId) {
  try {
    const user = await User.findById(userId);
    if (!user) return null;

    const rank = await User.countDocuments({
      points: { $gt: user.points },
      isActive: true
    });

    return rank + 1;
  } catch (error) {
    console.error('Get user rank error:', error);
    return null;
  }
}

module.exports = router;