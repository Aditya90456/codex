const express = require('express');
const router = express.Router();
const crypto = require('crypto');

// In-memory storage for shared code (use database in production)
const sharedCode = new Map();

// Share code endpoint
router.post('/share', async (req, res) => {
  try {
    const { 
      code, 
      language, 
      problemId, 
      problemTitle, 
      userId, 
      userName,
      description,
      isPublic = true 
    } = req.body;

    if (!code || !language) {
      return res.status(400).json({
        success: false,
        error: 'Code and language are required'
      });
    }

    // Generate unique share ID
    const shareId = crypto.randomBytes(8).toString('hex');
    
    // Store shared code
    const shareData = {
      id: shareId,
      code,
      language,
      problemId: problemId || null,
      problemTitle: problemTitle || 'Untitled',
      userId: userId || 'anonymous',
      userName: userName || 'Anonymous',
      description: description || '',
      isPublic,
      createdAt: new Date().toISOString(),
      views: 0,
      likes: 0,
      comments: []
    };

    sharedCode.set(shareId, shareData);

    // Generate shareable URL
    const shareUrl = `${req.protocol}://${req.get('host')}/share/${shareId}`;

    res.json({
      success: true,
      shareId,
      shareUrl,
      message: 'Code shared successfully'
    });

  } catch (error) {
    console.error('Code sharing error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to share code'
    });
  }
});

// Get shared code endpoint
router.get('/share/:shareId', async (req, res) => {
  try {
    const { shareId } = req.params;
    
    const shareData = sharedCode.get(shareId);
    
    if (!shareData) {
      return res.status(404).json({
        success: false,
        error: 'Shared code not found'
      });
    }

    // Increment view count
    shareData.views += 1;
    sharedCode.set(shareId, shareData);

    res.json({
      success: true,
      data: shareData
    });

  } catch (error) {
    console.error('Get shared code error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve shared code'
    });
  }
});

// Like shared code
router.post('/share/:shareId/like', async (req, res) => {
  try {
    const { shareId } = req.params;
    
    const shareData = sharedCode.get(shareId);
    
    if (!shareData) {
      return res.status(404).json({
        success: false,
        error: 'Shared code not found'
      });
    }

    shareData.likes += 1;
    sharedCode.set(shareId, shareData);

    res.json({
      success: true,
      likes: shareData.likes
    });

  } catch (error) {
    console.error('Like code error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to like code'
    });
  }
});

// Add comment to shared code
router.post('/share/:shareId/comment', async (req, res) => {
  try {
    const { shareId } = req.params;
    const { comment, userName } = req.body;
    
    if (!comment) {
      return res.status(400).json({
        success: false,
        error: 'Comment is required'
      });
    }

    const shareData = sharedCode.get(shareId);
    
    if (!shareData) {
      return res.status(404).json({
        success: false,
        error: 'Shared code not found'
      });
    }

    const newComment = {
      id: crypto.randomBytes(4).toString('hex'),
      comment,
      userName: userName || 'Anonymous',
      createdAt: new Date().toISOString()
    };

    shareData.comments.push(newComment);
    sharedCode.set(shareId, shareData);

    res.json({
      success: true,
      comment: newComment,
      totalComments: shareData.comments.length
    });

  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add comment'
    });
  }
});

// Get recent shared codes (public feed)
router.get('/recent', async (req, res) => {
  try {
    const { limit = 20, language } = req.query;
    
    let codes = Array.from(sharedCode.values())
      .filter(code => code.isPublic)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Filter by language if specified
    if (language) {
      codes = codes.filter(code => code.language === language);
    }

    // Limit results
    codes = codes.slice(0, parseInt(limit));

    // Remove sensitive data
    const publicCodes = codes.map(code => ({
      id: code.id,
      language: code.language,
      problemTitle: code.problemTitle,
      userName: code.userName,
      description: code.description,
      createdAt: code.createdAt,
      views: code.views,
      likes: code.likes,
      commentCount: code.comments.length
    }));

    res.json({
      success: true,
      codes: publicCodes,
      total: publicCodes.length
    });

  } catch (error) {
    console.error('Get recent codes error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get recent codes'
    });
  }
});

module.exports = router;