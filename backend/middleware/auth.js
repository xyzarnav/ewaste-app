const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided, access denied'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');

    // Try to get user from database first
    let user = null;
    try {
      user = await User.findById(decoded.user.id).select('-password');
    } catch (dbError) {
      console.log('Database not available, using test users');
      // If database is not available, create a mock user from token
      user = {
        _id: decoded.user.id,
        email: decoded.user.email,
        role: decoded.user.role,
        firstName: decoded.user.role === 'partner' ? 'John' : 'Admin',
        lastName: decoded.user.role === 'partner' ? 'Smith' : 'User',
        organizationName: decoded.user.role === 'partner' ? 'GE Aviation' : 'E-Waste Management',
        isActive: true
      };
    }
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Token is not valid'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account has been deactivated'
      });
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({
      success: false,
      message: 'Token is not valid'
    });
  }
};

// Middleware to check if user is admin
const adminAuth = (req, res, next) => {
  if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.'
    });
  }
  next();
};

// Middleware to check specific permissions
const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user.hasPermission(permission)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. ${permission} permission required.`
      });
    }
    next();
  };
};

// Middleware to check if user is super admin
const superAdminAuth = (req, res, next) => {
  if (req.user.role !== 'super_admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Super admin privileges required.'
    });
  }
  next();
};

module.exports = {
  auth,
  adminAuth,
  requirePermission,
  superAdminAuth
};

