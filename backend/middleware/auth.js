const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
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
    
    // Check if MongoDB is connected before querying
    if (mongoose.connection.readyState !== 1) {
      console.warn('MongoDB not connected, using token-only authentication');
      req.user = decoded;
      return next();
    }

    try {
      // Check if user still exists and is active with timeout
      const user = await User.findById(decoded.userId).maxTimeMS(5000);
      if (!user || !user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Invalid token. User not found or inactive.'
        });
      }

      req.user = decoded;
      req.userDoc = user; // Full user document if needed
      next();
    } catch (dbError) {
      // If database query fails, fall back to token-only auth
      console.warn('Database query failed, using token-only authentication:', dbError.message);
      req.user = decoded;
      next();
    }
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
      
      // Check if MongoDB is connected before querying
      if (mongoose.connection.readyState === 1) {
        try {
          const user = await User.findById(decoded.userId).maxTimeMS(5000);
          
          if (user && user.isActive) {
            req.user = decoded;
            req.userDoc = user;
          }
        } catch (dbError) {
          // If database query fails, use token-only auth
          console.warn('Database query failed in optionalAuth:', dbError.message);
          req.user = decoded;
        }
      } else {
        // No database connection, use token-only auth
        req.user = decoded;
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