const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Submission = require('../models/Submission');
const Problem = require('../models/Problem');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Submit solution
router.post('/', auth, [
  body('problemId').isMongoId(),
  body('code').isLength({ min: 1 }),
  body('language').isIn(['javascript', 'python', 'java', 'cpp'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { problemId, code, language } = req.body;

    // Check if problem exists
    const problem = await Problem.findById(problemId);
    if (!problem || !problem.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found'
      });
    }

    // Create submission
    const submission = new Submission({
      userId: req.user._id,
      problemId,
      code,
      language,
      status: 'Pending', // Will be updated by execution service
      testResults: []
    });

    await submission.save();

    // Update problem stats
    await Problem.findByIdAndUpdate(problemId, {
      $inc: { 'stats.totalSubmissions': 1 }
    });

    res.status(201).json({
      success: true,
      message: 'Submission created successfully',
      data: {
        submissionId: submission._id,
        status: submission.status
      }
    });

  } catch (error) {
    console.error('Submit solution error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit solution'
    });
  }
});

// Get submission by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate('problemId', 'title slug difficulty')
      .populate('userId', 'username');

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    // Check if user owns this submission or is admin
    if (submission.userId._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: submission
    });

  } catch (error) {
    console.error('Get submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch submission'
    });
  }
});

// Get user submissions
router.get('/user/:userId', auth, [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('status').optional().isString(),
  query('language').optional().isIn(['javascript', 'python', 'java', 'cpp'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { userId } = req.params;
    
    // Check if user can access these submissions
    if (userId !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Build filter
    const filter = { userId };
    if (req.query.status) {
      filter.status = req.query.status;
    }
    if (req.query.language) {
      filter.language = req.query.language;
    }

    const submissions = await Submission.find(filter)
      .populate('problemId', 'title slug difficulty')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Submission.countDocuments(filter);

    res.json({
      success: true,
      data: {
        submissions,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Get user submissions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch submissions'
    });
  }
});

// Get problem submissions (for leaderboard)
router.get('/problem/:problemId', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { problemId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Get accepted submissions only, sorted by runtime
    const submissions = await Submission.find({
      problemId,
      status: 'Accepted'
    })
      .populate('userId', 'username')
      .select('userId language runtime memory createdAt')
      .sort({ runtime: 1, createdAt: 1 })
      .skip(skip)
      .limit(limit);

    const total = await Submission.countDocuments({
      problemId,
      status: 'Accepted'
    });

    res.json({
      success: true,
      data: {
        submissions,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Get problem submissions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch problem submissions'
    });
  }
});

// Update submission status (internal use by execution service)
router.put('/:id/status', [
  body('status').isIn(['Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Runtime Error', 'Compilation Error']),
  body('testResults').optional().isArray(),
  body('runtime').optional().isNumeric(),
  body('memory').optional().isNumeric()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { status, testResults, runtime, memory } = req.body;
    
    const submission = await Submission.findByIdAndUpdate(
      req.params.id,
      {
        status,
        ...(testResults && { testResults }),
        ...(runtime && { runtime }),
        ...(memory && { memory })
      },
      { new: true }
    );

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: 'Submission not found'
      });
    }

    // Update problem and user stats if accepted
    if (status === 'Accepted') {
      await Problem.findByIdAndUpdate(submission.problemId, {
        $inc: { 'stats.acceptedSubmissions': 1 }
      });

      // Update user stats
      const user = await User.findById(submission.userId);
      if (user) {
        // Check if this is the first accepted submission for this problem
        const previousAccepted = await Submission.findOne({
          userId: submission.userId,
          problemId: submission.problemId,
          status: 'Accepted',
          _id: { $ne: submission._id }
        });

        if (!previousAccepted) {
          user.stats.problemsSolved += 1;
          user.stats.lastSolvedDate = new Date();
        }
        
        user.stats.acceptedSubmissions += 1;
        await user.save();
      }
    }

    res.json({
      success: true,
      message: 'Submission updated successfully',
      data: submission
    });

  } catch (error) {
    console.error('Update submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update submission'
    });
  }
});

// Get submission statistics
router.get('/stats/overview', auth, async (req, res) => {
  try {
    const userId = req.user._id;

    const stats = await Submission.aggregate([
      { $match: { userId: userId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const languageStats = await Submission.aggregate([
      { $match: { userId: userId } },
      {
        $group: {
          _id: '$language',
          count: { $sum: 1 },
          accepted: {
            $sum: { $cond: [{ $eq: ['$status', 'Accepted'] }, 1, 0] }
          }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        statusStats: stats,
        languageStats
      }
    });

  } catch (error) {
    console.error('Get submission stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch submission statistics'
    });
  }
});

module.exports = router;