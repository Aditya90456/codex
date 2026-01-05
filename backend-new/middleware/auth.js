const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token, authorization denied'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    
    // Try to find user in database if connected
    if (decoded.userId) {
      try {
        const user = await User.findById(decoded.userId).select('-password');
        if (user) {
          req.user = user;
        } else {
          // User not found in DB, use token data
          req.user = { 
            _id: decoded.userId, 
            email: decoded.email,
            username: decoded.username 
          };
        }
      } catch (dbError) {
        // Database not connected, use token data
        req.user = { 
          _id: decoded.userId, 
          email: decoded.email,
          username: decoded.username 
        };
      }
    } else {
      req.user = decoded;
    }
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({
      success: false,
      message: 'Token is not valid'
    });
  }
};

const adminAuth = async (req, res, next) => {
  try {
    await auth(req, res, () => {
      if (req.user && (req.user.role === 'admin' || req.user.isAdmin)) {
        next();
      } else {
        res.status(403).json({
          success: false,
          message: 'Admin access required'
        });
      }
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Authorization failed'
    });
  }
};

module.exports = { auth, adminAuth };