const Interview = require('../models/Interview');
const Resume = require('../models/Resume');
const User = require('../models/User');
const { interviewsStore, resumesStore, usersStore } = require('../services/storage.service');
const { getMongoStatus } = require('../config/db');
const { generateInterviewQuestions, evaluateAnswer, generateFinalReport } = require('../services/ai.service');
const { generateInterviewPDF } = require('../utils/pdfGenerator');

// Helper to find interview
const findInterviewById = async (id) => {
  if (getMongoStatus()) {
    try {
      const interview = await Interview.findById(id);
      if (interview) return interview;
    } catch (e) {}
  }
  return await interviewsStore.findById(id);
};

// Helper to save/update interview
const updateInterview = async (id, updateData) => {
  if (getMongoStatus()) {
    try {
      return await Interview.findByIdAndUpdate(id, updateData, { new: true });
    } catch (e) {}
  }
  return await interviewsStore.findByIdAndUpdate(id, updateData);
};

// @route   POST /api/interview/start
exports.startInterview = async (req, res) => {
  try {
    const { role = 'Full Stack Developer', mode = 'Voice', resumeId = null, questionCount = 5 } = req.body;
    const userId = req.user.id;

    // Fetch resume context if available
    let resumeText = '';
    let skills = [];
    if (resumeId) {
      const r = await resumesStore.findById(resumeId);
      if (r) {
        resumeText = r.parsedText || '';
        skills = r.parsedData?.skills || [];
      }
    } else {
      // Pick latest resume
      const resumes = await resumesStore.find({ userId });
      if (resumes.length > 0) {
        resumeText = resumes[0].parsedText || '';
        skills = resumes[0].parsedData?.skills || [];
      }
    }

    const questions = await generateInterviewQuestions({
      role,
      skills,
      resumeText,
      count: parseInt(questionCount) || 5
    });

    const interviewData = {
      userId,
      title: `${role} Mock Interview`,
      role,
      domain: role,
      mode: mode === 'Text' ? 'Text' : 'Voice',
      resumeId: resumeId || null,
      status: 'in_progress',
      questions: questions.map(q => ({
        id: q.id,
        question: q.question,
        category: q.category || 'Technical',
        difficulty: q.difficulty || 'Medium',
        expectedKeyTerms: q.expectedKeyTerms || [],
        userAnswer: '',
        feedback: null
      })),
      currentQuestionIndex: 0,
      overallScore: 0,
      breakdown: {
        technicalKnowledge: 0,
        communication: 0,
        confidence: 0,
        accuracy: 0,
        relevance: 0
      },
      summaryFeedback: '',
      strengths: [],
      weaknesses: [],
      suggestedTopics: [],
      certificateBadge: {
        issued: false,
        badgeName: 'Candidate',
        grade: 'In Progress'
      }
    };

    let saved = null;
    if (getMongoStatus()) {
      try {
        saved = await Interview.create(interviewData);
      } catch (e) {}
    }
    if (!saved) {
      saved = await interviewsStore.create(interviewData);
    }

    res.status(201).json({
      success: true,
      interview: saved
    });
  } catch (error) {
    console.error('Start interview error:', error);
    res.status(500).json({ success: false, message: 'Failed to start interview session.' });
  }
};

// @route   POST /api/interview/:id/answer
exports.submitAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const { questionId, userAnswer } = req.body;

    const interview = await findInterviewById(id);
    if (!interview) {
      return res.status(404).json({ success: false, message: 'Interview session not found.' });
    }

    const qIndex = interview.questions.findIndex(q => q.id === parseInt(questionId));
    if (qIndex === -1) {
      return res.status(404).json({ success: false, message: 'Question not found in this session.' });
    }

    const currentQ = interview.questions[qIndex];
    
    // Evaluate answer with AI / NLP
    const feedback = await evaluateAnswer({
      question: currentQ.question,
      userAnswer: userAnswer || '',
      expectedKeyTerms: currentQ.expectedKeyTerms || [],
      role: interview.role
    });

    currentQ.userAnswer = userAnswer || '';
    currentQ.feedback = feedback;

    // Update questions array
    const updatedQuestions = [...interview.questions];
    updatedQuestions[qIndex] = currentQ;

    const nextIndex = Math.min(qIndex + 1, updatedQuestions.length - 1);

    const updated = await updateInterview(id, {
      questions: updatedQuestions,
      currentQuestionIndex: nextIndex
    });

    res.json({
      success: true,
      feedback,
      currentQuestionIndex: nextIndex,
      isLastQuestion: qIndex === updatedQuestions.length - 1
    });
  } catch (error) {
    console.error('Submit answer error:', error);
    res.status(500).json({ success: false, message: 'Error evaluating answer.' });
  }
};

// @route   POST /api/interview/:id/finish
exports.finishInterview = async (req, res) => {
  try {
    const { id } = req.params;
    const interview = await findInterviewById(id);
    if (!interview) {
      return res.status(404).json({ success: false, message: 'Interview session not found.' });
    }

    const finalReport = generateFinalReport(interview);

    const updated = await updateInterview(id, {
      status: 'completed',
      overallScore: finalReport.overallScore,
      breakdown: finalReport.breakdown,
      summaryFeedback: finalReport.summaryFeedback,
      strengths: finalReport.strengths,
      weaknesses: finalReport.weaknesses,
      suggestedTopics: finalReport.suggestedTopics,
      certificateBadge: finalReport.certificateBadge,
      completedAt: new Date()
    });

    // Update user stats
    try {
      const user = await usersStore.findById(interview.userId);
      if (user) {
        const completed = (user.completedInterviews || 0) + 1;
        const prevAvg = user.averageScore || 0;
        const newAvg = Math.round(((prevAvg * (completed - 1)) + finalReport.overallScore) / completed);
        await usersStore.findByIdAndUpdate(user._id || user.id, {
          completedInterviews: completed,
          averageScore: newAvg
        });
      }
    } catch (e) {
      console.warn('Could not update user summary stats:', e.message);
    }

    res.json({
      success: true,
      report: updated
    });
  } catch (error) {
    console.error('Finish interview error:', error);
    res.status(500).json({ success: false, message: 'Error finalizing interview report.' });
  }
};

// @route   GET /api/interview/history
exports.getUserInterviews = async (req, res) => {
  try {
    const userId = req.user.id;
    let list = [];
    if (getMongoStatus()) {
      try {
        list = await Interview.find({ userId }).sort({ createdAt: -1 });
      } catch (e) {}
    }
    if (list.length === 0) {
      list = await interviewsStore.find({ userId });
      // Sort newest first
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    res.json({
      success: true,
      interviews: list
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching interview history.' });
  }
};

// @route   GET /api/interview/:id
exports.getInterviewById = async (req, res) => {
  try {
    const { id } = req.params;
    const interview = await findInterviewById(id);
    if (!interview) {
      return res.status(404).json({ success: false, message: 'Interview not found.' });
    }
    res.json({
      success: true,
      interview
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving interview.' });
  }
};

// @route   GET /api/interview/:id/report.pdf
exports.downloadPDFReport = async (req, res) => {
  try {
    const { id } = req.params;
    const interview = await findInterviewById(id);
    if (!interview) {
      return res.status(404).json({ success: false, message: 'Interview not found.' });
    }

    let user = req.user;
    if (!user) {
      user = await usersStore.findById(interview.userId);
    }

    const filename = `SkillMock-Report-${interview.role.replace(/\s+/g, '_')}-${Date.now()}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    generateInterviewPDF(
      interview,
      user,
      (chunk) => res.write(chunk),
      () => res.end()
    );
  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ success: false, message: 'Failed to generate PDF report.' });
  }
};
