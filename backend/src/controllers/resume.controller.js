const path = require('path');
const { parseResumeFile } = require('../services/pdf.service');
const Resume = require('../models/Resume');
const { resumesStore } = require('../services/storage.service');
const { getMongoStatus } = require('../config/db');

// @route   POST /api/resume/upload
exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a PDF resume file.' });
    }

    const filePath = req.file.path;
    const parsed = await parseResumeFile(filePath);

    const resumeRecord = {
      userId: req.user.id,
      originalName: req.file.originalname,
      filename: req.file.filename,
      filePath: filePath,
      parsedText: parsed.text,
      parsedData: {
        skills: parsed.skills,
        experience: parsed.experience,
        projects: parsed.projects,
        detectedDomain: parsed.detectedDomain,
        email: parsed.email,
        phone: parsed.phone
      }
    };

    let saved = null;
    if (getMongoStatus()) {
      try {
        saved = await Resume.create(resumeRecord);
      } catch (e) {}
    }
    if (!saved) {
      saved = await resumesStore.create(resumeRecord);
    }

    res.status(201).json({
      success: true,
      message: 'Resume parsed and uploaded successfully',
      resume: saved
    });
  } catch (error) {
    console.error('Resume upload error:', error);
    res.status(500).json({ success: false, message: 'Error processing resume file.' });
  }
};

// @route   GET /api/resume/latest
exports.getLatestResume = async (req, res) => {
  try {
    let latest = null;
    if (getMongoStatus()) {
      try {
        latest = await Resume.findOne({ userId: req.user.id }).sort({ createdAt: -1 });
      } catch (e) {}
    }
    if (!latest) {
      const userResumes = await resumesStore.find({ userId: req.user.id });
      latest = userResumes.length > 0 ? userResumes[0] : null;
    }

    res.json({
      success: true,
      resume: latest
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching latest resume.' });
  }
};
