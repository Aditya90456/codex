const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');
const { incrementUserStat, decrementUserStat } = require('../utils/clerk-sync');

const DATA_DIR = path.join(__dirname, '../data/blogs');

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
    return { blogs: [], followers: [], following: [] };
  }
}

async function writeUserData(userId, data) {
  await ensureDataDir();
  await fs.writeFile(
    path.join(DATA_DIR, `${userId}.json`),
    JSON.stringify(data, null, 2)
  );
}

async function readAllBlogs() {
  await ensureDataDir();
  const files = await fs.readdir(DATA_DIR);
  const allBlogs = [];

  for (const file of files) {
    if (file.endsWith('.json')) {
      const data = await fs.readFile(path.join(DATA_DIR, file), 'utf-8');
      const userData = JSON.parse(data);
      if (userData.blogs) {
        allBlogs.push(...userData.blogs);
      }
    }
  }

  return allBlogs;
}

// Create a new blog post
router.post('/create', async (req, res) => {
  try {
    const { userId, userName, userAvatar, title, content, tags, coverImage } = req.body;

    if (!userId || !title || !content) {
      return res.status(400).json({
        success: false,
        error: 'userId, title, and content are required'
      });
    }

    const userData = await readUserData(userId);

    const newBlog = {
      id: `blog_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      userName: userName || 'Anonymous',
      userAvatar: userAvatar || '',
      title,
      content,
      tags: tags || [],
      coverImage: coverImage || '',
      likes: [],
      dislikes: [],
      comments: [],
      views: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    userData.blogs = userData.blogs || [];
    userData.blogs.unshift(newBlog);

    await writeUserData(userId, userData);

    // Sync to Clerk metadata
    await incrementUserStat(userId, 'blogsWritten');

    res.json({
      success: true,
      blog: newBlog
    });
  } catch (error) {
    console.error('Create blog error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get all blogs (with pagination and filters)
router.get('/all', async (req, res) => {
  try {
    const { page = 1, limit = 10, tag, userId, search, sort = 'recent' } = req.query;

    let blogs = await readAllBlogs();

    // Filter by tag
    if (tag) {
      blogs = blogs.filter(blog => blog.tags && blog.tags.includes(tag));
    }

    // Filter by userId
    if (userId) {
      blogs = blogs.filter(blog => blog.userId === userId);
    }

    // Search
    if (search) {
      const searchLower = search.toLowerCase();
      blogs = blogs.filter(blog =>
        blog.title.toLowerCase().includes(searchLower) ||
        blog.content.toLowerCase().includes(searchLower) ||
        (blog.tags && blog.tags.some(tag => tag.toLowerCase().includes(searchLower)))
      );
    }

    // Sort
    if (sort === 'recent') {
      blogs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sort === 'popular') {
      blogs.sort((a, b) => (b.likes.length - b.dislikes.length) - (a.likes.length - a.dislikes.length));
    } else if (sort === 'views') {
      blogs.sort((a, b) => b.views - a.views);
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedBlogs = blogs.slice(startIndex, endIndex);

    res.json({
      success: true,
      blogs: paginatedBlogs,
      total: blogs.length,
      page: parseInt(page),
      totalPages: Math.ceil(blogs.length / limit)
    });
  } catch (error) {
    console.error('Get blogs error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get single blog by ID
router.get('/:blogId', async (req, res) => {
  try {
    const { blogId } = req.params;
    const blogs = await readAllBlogs();
    const blog = blogs.find(b => b.id === blogId);

    if (!blog) {
      return res.status(404).json({
        success: false,
        error: 'Blog not found'
      });
    }

    // Increment views
    const userData = await readUserData(blog.userId);
    const blogIndex = userData.blogs.findIndex(b => b.id === blogId);
    if (blogIndex !== -1) {
      userData.blogs[blogIndex].views++;
      await writeUserData(blog.userId, userData);
      blog.views++;
    }

    res.json({
      success: true,
      blog
    });
  } catch (error) {
    console.error('Get blog error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Update blog
router.put('/:blogId', async (req, res) => {
  try {
    const { blogId } = req.params;
    const { userId, title, content, tags, coverImage } = req.body;

    const userData = await readUserData(userId);
    const blogIndex = userData.blogs.findIndex(b => b.id === blogId);

    if (blogIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Blog not found'
      });
    }

    // Update blog
    userData.blogs[blogIndex] = {
      ...userData.blogs[blogIndex],
      title: title || userData.blogs[blogIndex].title,
      content: content || userData.blogs[blogIndex].content,
      tags: tags || userData.blogs[blogIndex].tags,
      coverImage: coverImage !== undefined ? coverImage : userData.blogs[blogIndex].coverImage,
      updatedAt: new Date().toISOString()
    };

    await writeUserData(userId, userData);

    res.json({
      success: true,
      blog: userData.blogs[blogIndex]
    });
  } catch (error) {
    console.error('Update blog error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Delete blog
router.delete('/:blogId', async (req, res) => {
  try {
    const { blogId } = req.params;
    const { userId } = req.query;

    const userData = await readUserData(userId);
    const blogIndex = userData.blogs.findIndex(b => b.id === blogId);

    if (blogIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Blog not found'
      });
    }

    userData.blogs.splice(blogIndex, 1);
    await writeUserData(userId, userData);

    // Sync to Clerk metadata
    await decrementUserStat(userId, 'blogsWritten');

    res.json({
      success: true,
      message: 'Blog deleted successfully'
    });
  } catch (error) {
    console.error('Delete blog error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Like a blog
router.post('/:blogId/like', async (req, res) => {
  try {
    const { blogId } = req.params;
    const { userId } = req.body;

    const blogs = await readAllBlogs();
    const blog = blogs.find(b => b.id === blogId);

    if (!blog) {
      return res.status(404).json({
        success: false,
        error: 'Blog not found'
      });
    }

    const userData = await readUserData(blog.userId);
    const blogIndex = userData.blogs.findIndex(b => b.id === blogId);

    if (blogIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Blog not found in user data'
      });
    }

    // Remove from dislikes if present
    userData.blogs[blogIndex].dislikes = userData.blogs[blogIndex].dislikes.filter(id => id !== userId);

    // Toggle like
    const likeIndex = userData.blogs[blogIndex].likes.indexOf(userId);
    const wasLiked = likeIndex > -1;
    
    if (wasLiked) {
      userData.blogs[blogIndex].likes.splice(likeIndex, 1);
    } else {
      userData.blogs[blogIndex].likes.push(userId);
    }

    await writeUserData(blog.userId, userData);

    // Sync to Clerk metadata for the user who liked
    if (wasLiked) {
      await decrementUserStat(userId, 'blogsLiked');
    } else {
      await incrementUserStat(userId, 'blogsLiked');
    }

    res.json({
      success: true,
      likes: userData.blogs[blogIndex].likes.length,
      dislikes: userData.blogs[blogIndex].dislikes.length,
      isLiked: !wasLiked
    });
  } catch (error) {
    console.error('Like blog error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Dislike a blog
router.post('/:blogId/dislike', async (req, res) => {
  try {
    const { blogId } = req.params;
    const { userId } = req.body;

    const blogs = await readAllBlogs();
    const blog = blogs.find(b => b.id === blogId);

    if (!blog) {
      return res.status(404).json({
        success: false,
        error: 'Blog not found'
      });
    }

    const userData = await readUserData(blog.userId);
    const blogIndex = userData.blogs.findIndex(b => b.id === blogId);

    if (blogIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Blog not found in user data'
      });
    }

    // Remove from likes if present
    userData.blogs[blogIndex].likes = userData.blogs[blogIndex].likes.filter(id => id !== userId);

    // Toggle dislike
    const dislikeIndex = userData.blogs[blogIndex].dislikes.indexOf(userId);
    if (dislikeIndex > -1) {
      userData.blogs[blogIndex].dislikes.splice(dislikeIndex, 1);
    } else {
      userData.blogs[blogIndex].dislikes.push(userId);
    }

    await writeUserData(blog.userId, userData);

    res.json({
      success: true,
      likes: userData.blogs[blogIndex].likes.length,
      dislikes: userData.blogs[blogIndex].dislikes.length,
      isDisliked: dislikeIndex === -1
    });
  } catch (error) {
    console.error('Dislike blog error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Add comment
router.post('/:blogId/comment', async (req, res) => {
  try {
    const { blogId } = req.params;
    const { userId, userName, userAvatar, content } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        error: 'Comment content is required'
      });
    }

    const blogs = await readAllBlogs();
    const blog = blogs.find(b => b.id === blogId);

    if (!blog) {
      return res.status(404).json({
        success: false,
        error: 'Blog not found'
      });
    }

    const userData = await readUserData(blog.userId);
    const blogIndex = userData.blogs.findIndex(b => b.id === blogId);

    if (blogIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Blog not found in user data'
      });
    }

    const newComment = {
      id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      userName: userName || 'Anonymous',
      userAvatar: userAvatar || '',
      content,
      createdAt: new Date().toISOString()
    };

    userData.blogs[blogIndex].comments = userData.blogs[blogIndex].comments || [];
    userData.blogs[blogIndex].comments.push(newComment);

    await writeUserData(blog.userId, userData);

    res.json({
      success: true,
      comment: newComment,
      totalComments: userData.blogs[blogIndex].comments.length
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Delete comment
router.delete('/:blogId/comment/:commentId', async (req, res) => {
  try {
    const { blogId, commentId } = req.params;
    const { userId } = req.query;

    const blogs = await readAllBlogs();
    const blog = blogs.find(b => b.id === blogId);

    if (!blog) {
      return res.status(404).json({
        success: false,
        error: 'Blog not found'
      });
    }

    const userData = await readUserData(blog.userId);
    const blogIndex = userData.blogs.findIndex(b => b.id === blogId);

    if (blogIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Blog not found in user data'
      });
    }

    const commentIndex = userData.blogs[blogIndex].comments.findIndex(c => c.id === commentId && c.userId === userId);

    if (commentIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Comment not found or unauthorized'
      });
    }

    userData.blogs[blogIndex].comments.splice(commentIndex, 1);
    await writeUserData(blog.userId, userData);

    res.json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Follow a user
router.post('/follow/:targetUserId', async (req, res) => {
  try {
    const { targetUserId } = req.params;
    const { userId } = req.body;

    if (userId === targetUserId) {
      return res.status(400).json({
        success: false,
        error: 'Cannot follow yourself'
      });
    }

    // Update follower's following list
    const followerData = await readUserData(userId);
    followerData.following = followerData.following || [];
    
    const followingIndex = followerData.following.indexOf(targetUserId);
    if (followingIndex > -1) {
      followerData.following.splice(followingIndex, 1);
    } else {
      followerData.following.push(targetUserId);
    }
    
    await writeUserData(userId, followerData);

    // Update target user's followers list
    const targetData = await readUserData(targetUserId);
    targetData.followers = targetData.followers || [];
    
    const followerIndex = targetData.followers.indexOf(userId);
    if (followerIndex > -1) {
      targetData.followers.splice(followerIndex, 1);
    } else {
      targetData.followers.push(userId);
    }
    
    await writeUserData(targetUserId, targetData);

    res.json({
      success: true,
      isFollowing: followingIndex === -1,
      followersCount: targetData.followers.length,
      followingCount: followerData.following.length
    });
  } catch (error) {
    console.error('Follow user error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get user profile
router.get('/user/:userId/profile', async (req, res) => {
  try {
    const { userId } = req.params;
    const userData = await readUserData(userId);

    res.json({
      success: true,
      profile: {
        userId,
        blogsCount: userData.blogs ? userData.blogs.length : 0,
        followersCount: userData.followers ? userData.followers.length : 0,
        followingCount: userData.following ? userData.following.length : 0,
        followers: userData.followers || [],
        following: userData.following || [],
        readBlogs: userData.readBlogs || []
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Mark blog as read
router.post('/:blogId/read', async (req, res) => {
  try {
    const { blogId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'userId is required'
      });
    }

    const userData = await readUserData(userId);
    userData.readBlogs = userData.readBlogs || [];

    // Add to read list if not already there
    const wasAlreadyRead = userData.readBlogs.includes(blogId);
    if (!wasAlreadyRead) {
      userData.readBlogs.push(blogId);
      await writeUserData(userId, userData);
      
      // Sync to Clerk metadata
      await incrementUserStat(userId, 'blogsRead');
    }

    res.json({
      success: true,
      readCount: userData.readBlogs.length
    });
  } catch (error) {
    console.error('Mark blog as read error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get user's read blogs
router.get('/user/:userId/read', async (req, res) => {
  try {
    const { userId } = req.params;
    const userData = await readUserData(userId);
    const readBlogIds = userData.readBlogs || [];

    const allBlogs = await readAllBlogs();
    const readBlogs = allBlogs.filter(blog => readBlogIds.includes(blog.id));

    res.json({
      success: true,
      blogs: readBlogs,
      count: readBlogs.length
    });
  } catch (error) {
    console.error('Get read blogs error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get user's liked blogs
router.get('/user/:userId/liked', async (req, res) => {
  try {
    const { userId } = req.params;
    const allBlogs = await readAllBlogs();
    const likedBlogs = allBlogs.filter(blog => blog.likes && blog.likes.includes(userId));

    res.json({
      success: true,
      blogs: likedBlogs,
      count: likedBlogs.length
    });
  } catch (error) {
    console.error('Get liked blogs error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get feed (blogs from followed users)
router.get('/feed/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const userData = await readUserData(userId);
    const following = userData.following || [];

    const allBlogs = await readAllBlogs();
    const feedBlogs = allBlogs.filter(blog => following.includes(blog.userId));

    // Sort by recent
    feedBlogs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedBlogs = feedBlogs.slice(startIndex, endIndex);

    res.json({
      success: true,
      blogs: paginatedBlogs,
      total: feedBlogs.length,
      page: parseInt(page),
      totalPages: Math.ceil(feedBlogs.length / limit)
    });
  } catch (error) {
    console.error('Get feed error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get trending blogs
router.get('/trending/all', async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const allBlogs = await readAllBlogs();

    // Calculate trending score (likes - dislikes + views/10 + comments*2)
    const blogsWithScore = allBlogs.map(blog => ({
      ...blog,
      trendingScore: 
        (blog.likes.length - blog.dislikes.length) +
        (blog.views / 10) +
        (blog.comments.length * 2)
    }));

    // Sort by trending score
    blogsWithScore.sort((a, b) => b.trendingScore - a.trendingScore);

    // Get top blogs
    const trendingBlogs = blogsWithScore.slice(0, parseInt(limit));

    res.json({
      success: true,
      blogs: trendingBlogs
    });
  } catch (error) {
    console.error('Get trending error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get all tags
router.get('/tags/all', async (req, res) => {
  try {
    const allBlogs = await readAllBlogs();
    const tagsMap = {};

    allBlogs.forEach(blog => {
      if (blog.tags) {
        blog.tags.forEach(tag => {
          tagsMap[tag] = (tagsMap[tag] || 0) + 1;
        });
      }
    });

    const tags = Object.entries(tagsMap)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count);

    res.json({
      success: true,
      tags
    });
  } catch (error) {
    console.error('Get tags error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
