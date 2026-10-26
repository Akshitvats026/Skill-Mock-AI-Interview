const PDFDocument = require('pdfkit');

const generateInterviewPDF = (interview, user, dataCallback, endCallback) => {
  const doc = new PDFDocument({ margin: 40, size: 'A4' });

  doc.on('data', dataCallback);
  doc.on('end', endCallback);

  // Header Banner Background
  doc.rect(0, 0, 595.28, 90).fill('#1e1b4b');

  // Title & Branding
  doc.fillColor('#ffffff').fontSize(22).font('Helvetica-Bold').text('SKILL MOCK - AI INTERVIEW REPORT', 40, 25);
  doc.fontSize(10).font('Helvetica').text('IMS Engineering College - Mini Project (BCC351) Presentation', 40, 52);
  doc.text(`Generated on: ${new Date().toLocaleDateString()} | Candidate: ${user?.name || 'Candidate'}`, 40, 66);

  doc.moveDown(3);

  // Candidate & Interview Meta Info
  doc.fillColor('#0f172a').fontSize(14).font('Helvetica-Bold').text('Session Summary', 40, 110);
  
  doc.rect(40, 130, 515, 60).fill('#f8fafc').stroke('#cbd5e1');
  
  doc.fillColor('#334155').fontSize(10).font('Helvetica');
  doc.text(`Candidate Name: ${user?.name || 'Candidate'}`, 55, 142);
  doc.text(`Email: ${user?.email || 'N/A'}`, 55, 158);
  doc.text(`Target Role: ${interview.role || 'Full Stack Developer'}`, 55, 174);

  doc.text(`Interview Mode: ${interview.mode || 'Voice'}`, 320, 142);
  doc.text(`Completed Questions: ${interview.questions?.length || 0}`, 320, 158);
  doc.text(`Status: Completed`, 320, 174);

  // Overall Score & Evaluation Pillar Cards
  doc.fillColor('#0f172a').fontSize(14).font('Helvetica-Bold').text('Performance Evaluation (5 PPT Dimensions)', 40, 210);

  // Score Box
  doc.rect(40, 230, 140, 90).fill('#4f46e5');
  doc.fillColor('#ffffff').fontSize(11).font('Helvetica-Bold').text('OVERALL SCORE', 55, 245);
  doc.fontSize(32).font('Helvetica-Bold').text(`${interview.overallScore || 0}%`, 55, 265);
  doc.fontSize(9).font('Helvetica').text(`Grade: ${interview.certificateBadge?.grade || 'Pass'}`, 55, 302);

  // Breakdown Table / Metrics
  const b = interview.breakdown || {};
  const metrics = [
    { label: 'Technical Knowledge', val: b.technicalKnowledge || 0 },
    { label: 'Communication Clarity', val: b.communication || 0 },
    { label: 'Confidence & Delivery', val: b.confidence || 0 },
    { label: 'Accuracy & Depth', val: b.accuracy || 0 },
    { label: 'Relevance & Key Terms', val: b.relevance || 0 },
  ];

  let startY = 230;
  metrics.forEach((m, idx) => {
    const yPos = startY + idx * 18;
    doc.fillColor('#1e293b').fontSize(10).font('Helvetica').text(m.label, 200, yPos);
    
    // Progress bar background
    doc.rect(360, yPos + 2, 140, 10).fill('#e2e8f0');
    // Progress bar active
    const fillWidth = Math.max(5, (m.val / 100) * 140);
    doc.rect(360, yPos + 2, fillWidth, 10).fill('#6366f1');
    
    doc.fillColor('#0f172a').fontSize(9).font('Helvetica-Bold').text(`${m.val}%`, 510, yPos);
  });

  // Summary Feedback
  doc.moveDown(6);
  doc.fillColor('#0f172a').fontSize(13).font('Helvetica-Bold').text('AI Qualitative Feedback', 40, 345);
  doc.rect(40, 365, 515, 65).fill('#f1f5f9');
  doc.fillColor('#334155').fontSize(9.5).font('Helvetica').text(
    interview.summaryFeedback || 'The candidate demonstrated foundational skills with opportunity for refinement.',
    55, 375, { width: 485, lineGap: 3 }
  );

  // Strengths & Weaknesses side by side
  doc.fillColor('#059669').fontSize(12).font('Helvetica-Bold').text('Key Strengths', 40, 445);
  let strY = 465;
  (interview.strengths || ['Good technical understanding']).forEach(st => {
    doc.fillColor('#10b981').fontSize(9).text('✔', 45, strY);
    doc.fillColor('#334155').fontSize(9).text(st, 60, strY, { width: 200 });
    strY += 22;
  });

  doc.fillColor('#dc2626').fontSize(12).font('Helvetica-Bold').text('Areas for Growth', 300, 445);
  let wY = 465;
  (interview.weaknesses || ['Continue practical implementation']).forEach(wk => {
    doc.fillColor('#ef4444').fontSize(9).text('✖', 305, wY);
    doc.fillColor('#334155').fontSize(9).text(wk, 320, wY, { width: 220 });
    wY += 22;
  });

  // Questions and Detailed Responses Section
  doc.addPage();
  doc.rect(0, 0, 595.28, 40).fill('#1e1b4b');
  doc.fillColor('#ffffff').fontSize(14).font('Helvetica-Bold').text('Detailed Question-by-Question Evaluation', 40, 14);

  let qY = 60;
  (interview.questions || []).forEach((q, index) => {
    if (qY > 700) {
      doc.addPage();
      qY = 40;
    }

    doc.fillColor('#1e1b4b').fontSize(11).font('Helvetica-Bold').text(`Q${index + 1}: ${q.question}`, 40, qY, { width: 515 });
    qY += doc.heightOfString(`Q${index + 1}: ${q.question}`, { width: 515 }) + 6;

    doc.fillColor('#475569').fontSize(9).font('Helvetica-Oblique').text(`Candidate's Answer: "${q.userAnswer || 'No answer provided'}"`, 45, qY, { width: 505 });
    qY += doc.heightOfString(`Candidate's Answer: "${q.userAnswer || 'No answer provided'}"`, { width: 505 }) + 6;

    const f = q.feedback || {};
    doc.fillColor('#0284c7').fontSize(9).font('Helvetica-Bold').text(`AI Analysis (Score: ${f.score || 0}% | Relevance: ${f.relevance || 0}% | Accuracy: ${f.accuracy || 0}%):`, 45, qY);
    qY += 14;

    doc.fillColor('#334155').fontSize(9).font('Helvetica').text(f.comment || 'Feedback pending.', 45, qY, { width: 505 });
    qY += doc.heightOfString(f.comment || 'Feedback pending.', { width: 505 }) + 16;
  });

  // Footer Certificate mention
  doc.rect(40, 750, 515, 45).fill('#e0e7ff');
  doc.fillColor('#3730a3').fontSize(9).font('Helvetica-Bold').text(
    `Official Skill Mock Performance Report • IMS Engineering College Group No - 17 (BCC351)\nBadge Issued: ${interview.certificateBadge?.badgeName || 'Skill Mock Certified'} (${interview.certificateBadge?.grade || 'Pass'})`,
    50, 760, { align: 'center', width: 495 }
  );

  doc.end();
};

module.exports = { generateInterviewPDF };
