const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  question: { type: String, required: true },
  category: { type: String, default: 'Technical' },
  difficulty: { type: String, default: 'Medium' },
  expectedKeyTerms: [{ type: String }],
  userAnswer: { type: String, default: '' },
  audioUrl: { type: String, default: '' },
  feedback: {
    score: { type: Number, default: 0 },
    relevance: { type: Number, default: 0 },
    accuracy: { type: Number, default: 0 },
    communication: { type: Number, default: 0 },
    confidence: { type: Number, default: 0 },
    keyTermsFound: [{ type: String }],
    comment: { type: String, default: '' },
    idealAnswer: { type: String, default: '' }
  }
});

const InterviewSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, default: 'Technical Mock Interview' },
  role: { type: String, required: true },
  domain: { type: String, default: 'Computer Science & Engineering' },
  mode: { type: String, enum: ['Voice', 'Text'], default: 'Voice' },
  resumeId: { type: String, default: null },
  resumeFilename: { type: String, default: '' },
  status: { type: String, enum: ['in_progress', 'completed', 'abandoned'], default: 'in_progress' },
  questions: [QuestionSchema],
  currentQuestionIndex: { type: Number, default: 0 },
  overallScore: { type: Number, default: 0 },
  breakdown: {
    technicalKnowledge: { type: Number, default: 0 },
    communication: { type: Number, default: 0 },
    confidence: { type: Number, default: 0 },
    accuracy: { type: Number, default: 0 },
    relevance: { type: Number, default: 0 }
  },
  summaryFeedback: { type: String, default: '' },
  strengths: [{ type: String }],
  weaknesses: [{ type: String }],
  suggestedTopics: [{ type: String }],
  durationMinutes: { type: Number, default: 15 },
  certificateBadge: {
    issued: { type: Boolean, default: false },
    badgeName: { type: String, default: 'SkillMock Interview Certified' },
    grade: { type: String, default: 'Pass' },
    issuedAt: { type: Date }
  },
  createdAt: { type: Date, default: Date.now },
  completedAt: { type: Date }
});

module.exports = mongoose.models.Interview || mongoose.model('Interview', InterviewSchema);
