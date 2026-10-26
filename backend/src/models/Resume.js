const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  originalName: { type: String, required: true },
  filename: { type: String, required: true },
  filePath: { type: String, required: true },
  parsedText: { type: String, default: '' },
  parsedData: {
    name: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    skills: [{ type: String }],
    experience: [{ type: String }],
    projects: [{ type: String }],
    education: [{ type: String }],
    detectedDomain: { type: String, default: 'Full Stack Development' }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Resume || mongoose.model('Resume', ResumeSchema);
