const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'Candidate' },
  targetRole: { type: String, default: 'Full Stack Developer' },
  avatar: { type: String, default: '' },
  resumes: [{ type: String }],
  completedInterviews: { type: Number, default: 0 },
  averageScore: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
