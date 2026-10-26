const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const {
  startInterview,
  submitAnswer,
  finishInterview,
  getUserInterviews,
  getInterviewById,
  downloadPDFReport
} = require('../controllers/interview.controller');

router.post('/start', protect, startInterview);
router.post('/:id/answer', protect, submitAnswer);
router.post('/:id/finish', protect, finishInterview);
router.get('/history', protect, getUserInterviews);
router.get('/:id', protect, getInterviewById);
router.get('/:id/pdf-report', protect, downloadPDFReport);

module.exports = router;
