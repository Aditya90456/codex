const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user still exists and is active
    const user = await User.findById(decoded.userId);
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. User not found or inactive.'
      });
    }

    req.user = decoded;
    req.userDoc = user; // Full user document if needed
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.'
      });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired.'
      });
    }
    
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during authentication.'
    });
  }
};

// Optional auth - doesn't fail if no token provided
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
      
      if (user && user.isActive) {
        req.user = decoded;
        req.userDoc = user;
      }
    }
    
    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

// Admin only middleware
const adminAuth = async (req, res, next) => {
  try {
    await auth(req, res, () => {});
    
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }
    
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required.'
    });
  }
};

// Moderator or admin middleware
const moderatorAuth = async (req, res, next) => {
  try {
    await auth(req, res, () => {});
    
    if (!['admin', 'moderator'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Moderator privileges required.'
      });
    }
    
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required.'
    });
  }
};

module.exports = {
  auth,
  optionalAuth,
  adminAuth,
  moderatorAuth
};