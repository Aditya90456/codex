const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/User');
const Submission = require('../models/Submission');
const { auth, optionalAuth } = require('../middleware/auth');
const router = express.Router();

// Helper function to check if database is connected
const isDatabaseConnected = () => {
  return mongoose.connection.readyState === 1;
};

// Get users leaderboard
router.get('/', optionalAuth, async (req, res) => {
  try {
    // Check if database is connected
    if (!isDatabaseConnected()) {
      return res.status(503).json({
        success: false,
        message: 'Database not available. Leaderboard requires database connection.'
      });
    }

    const { 
      page = 1, 
      limit = 20, 
      sortBy = 'points',
      order = 'desc',
      search 
    } = req.query;

    const sortOrder = order === 'asc' ? 1 : -1;
    const sortOptions = {};
    
    // Define allowed sort fields
    const allowedSortFields = {
      'points': 'points',
      'problems': 'stats.problemsSolved',
      'streak': 'streak.current',
      'joined': 'createdAt'
    };

    sortOptions[allowedSortFields[sortBy] || 'points'] = sortOrder;

    let query = { isActive: true };
    
    // Search functionality
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('username firstName lastName avatar points level stats streak createdAt')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const totalUsers = await User.countDocuments(query);

    // Add rank to each user
    const usersWithRank = users.map((user, index) => ({
      ...user,
      rank: (page - 1) * limit + index + 1,
      fullName: `${user.firstName} ${user.lastName}`,
      acceptanceRate: user.stats.totalSubmissions > 0 
        ? Math.round((user.stats.acceptedSubmissions / user.stats.totalSubmissions) * 100)
        : 0
    }));

    res.json({
      success: true,
      users: usersWithRank,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalUsers / limit),
        totalUsers,
        hasNext: page * limit < totalUsers,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
});

// Get user profile by ID or username
router.get('/:identifier', optionalAuth, async (req, res) => {
  try {
    // Check if database is connected
    if (!isDatabaseConnected()) {
      return res.status(503).json({
        success: false,
        message: 'Database not available. User profiles require database connection.'
      });
    }

    const { identifier } = req.params;
    
    // Check if identifier is ObjectId or username
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(identifier);
    const query = isObjectId 
      ? { _id: identifier, isActive: true }
      : { username: identifier, isActive: true };

    const user = await User.findOne(query);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user's recent submissions
    const recentSubmissions = await Submission.find({ user: user._id })
      .populate('problem', 'title difficulty slug')
      .sort({ createdAt: -1 })
      .limit(10)
      .select('status runtime memory language createdAt pointsEarned');

    // Get user's solved problems by difficulty
    const solvedProblems = await Submission.aggregate([
      {
        $match: {
          user: user._id,
          status: 'Accepted'
        }
      },
      {
        $lookup: {
          from: 'problems',
          localField: 'problem',
          foreignField: '_id',
          as: 'problemInfo'
        }
      },
      {
        $unwind: '$problemInfo'
      },
      {
        $group: {
          _id: '$problemInfo.difficulty',
          count: { $sum: 1 },
          problems: {
            $push: {
              id: '$problemInfo._id',
              title: '$problemInfo.title',
              slug: '$problemInfo.slug',
              solvedAt: '$createdAt'
            }
          }
        }
      }
    ]);

    // Get language statistics
    const languageStats = await Submission.aggregate([
      {
        $match: { user: user._id }
      },
      {
        $group: {
          _id: '$language',
          count: { $sum: 1 },
          accepted: {
            $sum: { $cond: [{ $eq: ['$status', 'Accepted'] }, 1, 0] }
          }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    const profile = {
      ...user.getPublicProfile(),
      recentSubmissions,
      solvedProblems: solvedProblems.reduce((acc, item) => {
        acc[item._id.toLowerCase()] = {
          count: item.count,
          problems: item.problems.sort((a, b) => new Date(b.solvedAt) - new Date(a.solvedAt))
        };
        return acc;
      }, {}),
      languageStats,
      isOwnProfile: req.user && req.user.userId === user._id.toString()
    };

    res.json({
      success: true,
      user: profile
    });

  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user profile'
    });
  }
});

// Get user statistics
router.get('/:identifier/stats', optionalAuth, async (req, res) => {
  try {
    // Check if database is connected
    if (!isDatabaseConnected()) {
      return res.status(503).json({
        success: false,
        message: 'Database not available. User statistics require database connection.'
      });
    }

    const { identifier } = req.params;
    
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(identifier);
    const query = isObjectId 
      ? { _id: identifier, isActive: true }
      : { username: identifier, isActive: true };

    const user = await User.findOne(query);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get detailed submission statistics
    const submissionStats = await Submission.aggregate([
      {
        $match: { user: user._id }
      },
      {
        $group: {
          _id: null,
          totalSubmissions: { $sum: 1 },
          acceptedSubmissions: {
            $sum: { $cond: [{ $eq: ['$status', 'Accepted'] }, 1, 0] }
          },
          averageRuntime: { $avg: '$runtime' },
          totalPointsEarned: { $sum: '$pointsEarned' },
          languageBreakdown: {
            $push: '$language'
          },
          statusBreakdown: {
            $push: '$status'
          },
          monthlyActivity: {
            $push: {
              month: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
              status: '$status'
            }
          }
        }
      }
    ]);

    // Get problem difficulty breakdown
    const difficultyStats = await Submission.aggregate([
      {
        $match: {
          user: user._id,
          status: 'Accepted'
        }
      },
      {
        $lookup: {
          from: 'problems',
          localField: 'problem',
          foreignField: '_id',
          as: 'problemInfo'
        }
      },
      {
        $unwind: '$problemInfo'
      },
      {
        $group: {
          _id: '$problemInfo.difficulty',
          solved: { $addToSet: '$problem' }
        }
      },
      {
        $project: {
          difficulty: '$_id',
          count: { $size: '$solved' }
        }
      }
    ]);

    // Calculate monthly activity
    const monthlyActivity = {};
    if (submissionStats[0]?.monthlyActivity) {
      submissionStats[0].monthlyActivity.forEach(activity => {
        if (!monthlyActivity[activity.month]) {
          monthlyActivity[activity.month] = { total: 0, accepted: 0 };
        }
        monthlyActivity[activity.month].total++;
        if (activity.status === 'Accepted') {
          monthlyActivity[activity.month].accepted++;
        }
      });
    }

    const stats = {
      user: {
        username: user.username,
        level: user.level,
        points: user.points,
        joinedAt: user.createdAt
      },
      submissions: submissionStats[0] || {
        totalSubmissions: 0,
        acceptedSubmissions: 0,
        averageRuntime: 0,
        totalPointsEarned: 0
      },
      problems: {
        total: user.stats.problemsSolved,
        byDifficulty: difficultyStats.reduce((acc, item) => {
          acc[item.difficulty.toLowerCase()] = item.count;
          return acc;
        }, { easy: 0, medium: 0, hard: 0 })
      },
      streak: user.streak,
      monthlyActivity,
      rank: await getUserRank(user._id),
      achievements: user.achievements
    };

    res.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user statistics'
    });
  }
});

// Follow/Unfollow user (future feature)
router.post('/:id/follow', auth, async (req, res) => {
  try {
    // This would implement following functionality
    // For now, return not implemented
    res.status(501).json({
      success: false,
      message: 'Follow feature not implemented yet'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
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