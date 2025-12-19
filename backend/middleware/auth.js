const jwt = require('jsonwebtoken');
const User = require('../models/User');
const APIClient = require('../models/APIClient');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No token provided, authorization denied'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key_here_change_in_production');
    
    // Check if it's a user token or API client token
    if (decoded.type === 'api_client') {
      const apiClient = await APIClient.findById(decoded.id);
      if (!apiClient || !apiClient.isActive) {
        return res.status(401).json({
          success: false,
          error: 'Invalid or inactive API client'
        });
      }
      req.apiClient = apiClient;
      req.userType = 'api_client';
    } else {
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'User not found'
        });
      }
      req.user = user;
      req.userType = 'user';
    }
    
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Invalid token'
    });
  }
};

module.exports = auth;

