const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Problem = require('../models/Problem');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get all problems with pagination and filtering
router.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('difficulty').optional().isIn(['Easy', 'Medium', 'Hard']),
  query('category').optional().isString(),
  query('search').optional().isString()
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

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = { isActive: true };
    
    if (req.query.difficulty) {
      filter.difficulty = req.query.difficulty;
    }
    
    if (req.query.category) {
      filter.category = new RegExp(req.query.category, 'i');
    }
    
    if (req.query.search) {
      filter.$or = [
        { title: new RegExp(req.query.search, 'i') },
        { description: new RegExp(req.query.search, 'i') },
        { tags: { $in: [new RegExp(req.query.search, 'i')] } }
      ];
    }

    // Get problems with pagination
    const problems = await Problem.find(filter)
      .select('title slug difficulty category tags stats createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('createdBy', 'username');

    const total = await Problem.countDocuments(filter);

    res.json({
      success: true,
      data: {
        problems,
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
    console.error('Get problems error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch problems'
    });
  }
});

// Get random problem
router.get('/random', async (req, res) => {
  try {
    const { difficulty } = req.query;
    const filter = { isActive: true };
    
    if (difficulty) {
      filter.difficulty = difficulty;
    }

    const count = await Problem.countDocuments(filter);
    if (count === 0) {
      return res.status(404).json({
        success: false,
        message: 'No problems found'
      });
    }

    const random = Math.floor(Math.random() * count);
    const problem = await Problem.findOne(filter)
      .skip(random)
      .populate('createdBy', 'username');

    res.json({
      success: true,
      data: problem
    });

  } catch (error) {
    console.error('Get random problem error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch random problem'
    });
  }
});

// Get specific problem by ID or slug
router.get('/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    
    // Try to find by ID first, then by slug
    let problem;
    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      problem = await Problem.findById(identifier);
    } else {
      problem = await Problem.findOne({ slug: identifier });
    }

    if (!problem || !problem.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found'
      });
    }

    // Don't send solution and hidden test cases to regular users
    const problemData = problem.toObject();
    delete problemData.solution;
    problemData.testCases = problemData.testCases.filter(tc => !tc.isHidden);

    res.json({
      success: true,
      data: problemData
    });

  } catch (error) {
    console.error('Get problem error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch problem'
    });
  }
});

// Create new problem (admin only)
router.post('/', adminAuth, [
  body('title').isLength({ min: 1, max: 200 }).trim(),
  body('description').isLength({ min: 1 }),
  body('difficulty').isIn(['Easy', 'Medium', 'Hard']),
  body('category').isLength({ min: 1 }).trim(),
  body('testCases').isArray({ min: 1 }),
  body('starterCode').optional().isObject()
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

    const problemData = {
      ...req.body,
      createdBy: req.user._id
    };

    const problem = new Problem(problemData);
    await problem.save();

    res.status(201).json({
      success: true,
      message: 'Problem created successfully',
      data: problem
    });

  } catch (error) {
    console.error('Create problem error:', error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Problem with this title already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to create problem'
    });
  }
});

// Update problem (admin only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const problem = await Problem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found'
      });
    }

    res.json({
      success: true,
      message: 'Problem updated successfully',
      data: problem
    });

  } catch (error) {
    console.error('Update problem error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update problem'
    });
  }
});

// Delete problem (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const problem = await Problem.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!problem) {
      return res.status(404).json({
        success: false,
        message: 'Problem not found'
      });
    }

    res.json({
      success: true,
      message: 'Problem deleted successfully'
    });

  } catch (error) {
    console.error('Delete problem error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete problem'
    });
  }
});

// Get problem categories
router.get('/meta/categories', async (req, res) => {
  try {
    const categories = await Problem.distinct('category', { isActive: true });
    
    res.json({
      success: true,
      data: categories.sort()
    });

  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories'
    });
  }
});

// Get problem tags
router.get('/meta/tags', async (req, res) => {
  try {
    const tags = await Problem.distinct('tags', { isActive: true });
    
    res.json({
      success: true,
      data: tags.sort()
    });

  } catch (error) {
    console.error('Get tags error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tags'
    });
  }
});

module.exports = router;