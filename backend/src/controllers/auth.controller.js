const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { usersStore } = require('../services/storage.service');
const { getMongoStatus } = require('../config/db');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'skillmock_secret', {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// @route   POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password, targetRole } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password.' });
    }

    // Check existing
    let existingUser = null;
    if (getMongoStatus()) {
      try {
        existingUser = await User.findOne({ email });
      } catch (e) {}
    }
    if (!existingUser) {
      existingUser = await usersStore.findOne({ email });
    }

    if (existingUser) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let newUser = null;
    const userData = {
      name,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      targetRole: targetRole || 'Full Stack Developer',
      completedInterviews: 0,
      averageScore: 0
    };

    if (getMongoStatus()) {
      try {
        newUser = await User.create(userData);
      } catch (e) {}
    }
    if (!newUser) {
      newUser = await usersStore.create(userData);
    }

    const userObj = newUser.toObject ? newUser.toObject() : { ...newUser };
    delete userObj.password;

    const token = generateToken(userObj._id || userObj.id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: userObj._id || userObj.id,
        name: userObj.name,
        email: userObj.email,
        targetRole: userObj.targetRole,
        completedInterviews: userObj.completedInterviews || 0,
        averageScore: userObj.averageScore || 0
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
};

// @route   POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password.' });
    }

    let user = null;
    if (getMongoStatus()) {
      try {
        user = await User.findOne({ email: email.toLowerCase().trim() });
      } catch (e) {}
    }
    if (!user) {
      user = await usersStore.findOne({ email: email.toLowerCase().trim() });
    }

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = generateToken(user._id || user.id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        targetRole: user.targetRole,
        completedInterviews: user.completedInterviews || 0,
        averageScore: user.averageScore || 0
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login.' });
  }
};

// @route   GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    const user = req.user;
    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving profile.' });
  }
};
