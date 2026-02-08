const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

// File-based storage for bookmarks
const BOOKMARKS_FILE = path.join(__dirname, '../data/bookmarks.json');

// Ensure data directory exists
async function ensureDataDir() {
  const dataDir = path.join(__dirname, '../data');
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

// Load bookmarks from file
async function loadBookmarks() {
  try {
    await ensureDataDir();
    const data = await fs.readFile(BOOKMARKS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, return empty object
    return {};
  }
}

// Save bookmarks to file
async function saveBookmarks(bookmarks) {
  await ensureDataDir();
  await fs.writeFile(BOOKMARKS_FILE, JSON.stringify(bookmarks, null, 2));
}

// Get user's bookmarks
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const bookmarks = await loadBookmarks();
    const userBookmarks = bookmarks[userId] || [];
    
    res.json({
      success: true,
      bookmarks: userBookmarks,
      count: userBookmarks.length
    });
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch bookmarks'
    });
  }
});

// Add bookmark
router.post('/add', async (req, res) => {
  try {
    const { userId, articleId, articleData } = req.body;
    
    if (!userId || !articleId || !articleData) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }
    
    const bookmarks = await loadBookmarks();
    
    if (!bookmarks[userId]) {
      bookmarks[userId] = [];
    }
    
    // Check if already bookmarked
    const existingIndex = bookmarks[userId].findIndex(b => b.articleId === articleId);
    
    if (existingIndex !== -1) {
      return res.json({
        success: true,
        message: 'Article already bookmarked',
        bookmarks: bookmarks[userId]
      });
    }
    
    // Add new bookmark
    const newBookmark = {
      articleId,
      ...articleData,
      bookmarkedAt: new Date().toISOString()
    };
    
    bookmarks[userId].push(newBookmark);
    await saveBookmarks(bookmarks);
    
    res.json({
      success: true,
      message: 'Article bookmarked successfully',
      bookmarks: bookmarks[userId]
    });
  } catch (error) {
    console.error('Error adding bookmark:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add bookmark'
    });
  }
});

// Remove bookmark
router.delete('/remove', async (req, res) => {
  try {
    const { userId, articleId } = req.body;
    
    if (!userId || !articleId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }
    
    const bookmarks = await loadBookmarks();
    
    if (!bookmarks[userId]) {
      return res.json({
        success: true,
        message: 'No bookmarks found',
        bookmarks: []
      });
    }
    
    // Remove bookmark
    bookmarks[userId] = bookmarks[userId].filter(b => b.articleId !== articleId);
    await saveBookmarks(bookmarks);
    
    res.json({
      success: true,
      message: 'Bookmark removed successfully',
      bookmarks: bookmarks[userId]
    });
  } catch (error) {
    console.error('Error removing bookmark:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to remove bookmark'
    });
  }
});

// Check if article is bookmarked
router.get('/check/:userId/:articleId', async (req, res) => {
  try {
    const { userId, articleId } = req.params;
    const bookmarks = await loadBookmarks();
    const userBookmarks = bookmarks[userId] || [];
    const isBookmarked = userBookmarks.some(b => b.articleId === articleId);
    
    res.json({
      success: true,
      isBookmarked
    });
  } catch (error) {
    console.error('Error checking bookmark:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check bookmark'
    });
  }
});

// Get bookmark statistics
router.get('/stats/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const bookmarks = await loadBookmarks();
    const userBookmarks = bookmarks[userId] || [];
    
    // Calculate stats
    const stats = {
      total: userBookmarks.length,
      byCategory: {},
      byDifficulty: {},
      recentBookmarks: userBookmarks.slice(-5).reverse()
    };
    
    userBookmarks.forEach(bookmark => {
      // Count by category
      const category = bookmark.category || 'Other';
      stats.byCategory[category] = (stats.byCategory[category] || 0) + 1;
      
      // Count by difficulty
      const difficulty = bookmark.difficulty || 'Unknown';
      stats.byDifficulty[difficulty] = (stats.byDifficulty[difficulty] || 0) + 1;
    });
    
    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Error fetching bookmark stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch bookmark stats'
    });
  }
});

module.exports = router;
