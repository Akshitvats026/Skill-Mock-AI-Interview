const jwt = require('jsonwebtoken');
const { usersStore } = require('../services/storage.service');
const { getMongoStatus } = require('../config/db');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'skillmock_secret');

      let user = null;
      if (getMongoStatus()) {
        try {
          user = await User.findById(decoded.id).select('-password');
        } catch (e) {
          // fallback to storage
        }
      }

      if (!user) {
        user = await usersStore.findById(decoded.id);
      }

      if (!user) {
        return res.status(401).json({ success: false, message: 'User not found' });
      }

      const userObj = user.toObject ? user.toObject() : { ...user };
      delete userObj.password;
      req.user = userObj;
      req.user.id = userObj._id || userObj.id;
      return next();
    } catch (err) {
      console.error('Auth verification error:', err.message);
      return res.status(401).json({ success: false, message: 'Token invalid or expired' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }
};

module.exports = { protect };
