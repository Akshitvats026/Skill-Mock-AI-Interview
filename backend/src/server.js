const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const { connectDB } = require('./config/db');
const authRoutes = require('./routes/auth.routes');
const resumeRoutes = require('./routes/resume.routes');
const interviewRoutes = require('./routes/interview.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB (with embedded fallback)
connectDB();

// Middleware
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Static uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/interview', interviewRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    project: 'Skill Mock - AI Interview System',
    institution: 'IMS Engineering College (Group 17 - BCC351)',
    timestamp: new Date().toISOString()
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Skill Mock Backend Server running on http://localhost:${PORT}`);
    console.log(`📚 Mini Project BCC351 - IMS Engineering College (Group 17)`);
  });
}

module.exports = app;
