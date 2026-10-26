const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload.middleware');
const { protect } = require('../middleware/auth.middleware');
const { uploadResume, getLatestResume } = require('../controllers/resume.controller');

router.post('/upload', protect, upload.single('resume'), uploadResume);
router.get('/latest', protect, getLatestResume);

module.exports = router;
