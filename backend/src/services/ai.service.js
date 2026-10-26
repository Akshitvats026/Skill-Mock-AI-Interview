const https = require('https');

// Question Banks for various engineering & tech roles
const QUESTION_BANK = {
  'Full Stack Developer': [
    {
      id: 1,
      question: "Can you explain how the Virtual DOM works in React and how it optimizes UI updates compared to traditional DOM manipulation?",
      category: "Frontend Architecture",
      difficulty: "Medium",
      expectedKeyTerms: ["reconciliation", "diffing algorithm", "state", "props", "real DOM", "batching", "fiber"]
    },
    {
      id: 2,
      question: "How does the Node.js event loop handle asynchronous I/O operations without blocking the single execution thread?",
      category: "Backend Architecture",
      difficulty: "Hard",
      expectedKeyTerms: ["libuv", "call stack", "callback queue", "microtasks", "macrotasks", "non-blocking", "thread pool"]
    },
    {
      id: 3,
      question: "What are the core differences between SQL and NoSQL databases, and when would you choose MongoDB over PostgreSQL in a project?",
      category: "Database Design",
      difficulty: "Medium",
      expectedKeyTerms: ["schema", "relational", "ACID", "horizontal scaling", "document store", "JOINs", "indexing"]
    },
    {
      id: 4,
      question: "Explain the purpose of JWT (JSON Web Tokens). How do you securely handle user authentication, token expiration, and refresh tokens?",
      category: "Security & Auth",
      difficulty: "Medium",
      expectedKeyTerms: ["header", "payload", "signature", "secret key", "httpOnly cookie", "refresh token", "stateless"]
    },
    {
      id: 5,
      question: "Describe a complex bug or performance bottleneck you encountered in one of your projects and how you diagnosed and resolved it.",
      category: "Problem Solving & Behavioral",
      difficulty: "Medium",
      expectedKeyTerms: ["profiling", "debugging", "root cause", "solution", "testing", "monitoring"]
    }
  ],
  'Frontend Web Development': [
    {
      id: 1,
      question: "Explain the difference between useEffect, useMemo, and useCallback hooks in React. Give an example where using useCallback prevents unnecessary re-renders.",
      category: "React Fundamentals",
      difficulty: "Medium",
      expectedKeyTerms: ["memoization", "dependency array", "re-render", "referential equality", "performance"]
    },
    {
      id: 2,
      question: "How do modern CSS features like CSS Grid, Flexbox, and Tailwind CSS differ, and how do you ensure responsive mobile-first web design?",
      category: "UI Styling & Layout",
      difficulty: "Easy",
      expectedKeyTerms: ["media queries", "breakpoints", "flex direction", "grid template", "mobile-first"]
    },
    {
      id: 3,
      question: "What are Web Vitals (LCP, FID, CLS) and what techniques do you use to optimize client-side web application performance?",
      category: "Performance Optimization",
      difficulty: "Hard",
      expectedKeyTerms: ["lazy loading", "code splitting", "bundling", "CDN", "caching", "critical rendering path"]
    },
    {
      id: 4,
      question: "What is the Browser Object Model vs Document Object Model, and how does event bubbling and event capturing work in JavaScript?",
      category: "JavaScript Core",
      difficulty: "Medium",
      expectedKeyTerms: ["event propagation", "stopPropagation", "target", "currentTarget", "DOM tree"]
    }
  ],
  'Backend Engineering': [
    {
      id: 1,
      question: "Explain RESTful API design principles. What are idempotent HTTP methods and how do you handle API versioning and rate limiting?",
      category: "API Design",
      difficulty: "Medium",
      expectedKeyTerms: ["GET", "POST", "PUT", "DELETE", "idempotent", "headers", "status codes", "rate limiter"]
    },
    {
      id: 2,
      question: "How do you handle database transactions and ensure ACID compliance when updating multiple related collections or tables?",
      category: "Databases & Transactions",
      difficulty: "Hard",
      expectedKeyTerms: ["atomicity", "consistency", "isolation", "durability", "rollback", "commit", "sessions"]
    },
    {
      id: 3,
      question: "What is caching, how does Redis work in-memory, and what cache invalidation strategies (e.g. Write-Through, Cache-Aside) do you use?",
      category: "Distributed Systems & Caching",
      difficulty: "Hard",
      expectedKeyTerms: ["TTL", "cache aside", "write through", "in-memory", "latency", "key-value store"]
    },
    {
      id: 4,
      question: "How would you design a scalable microservice architecture to handle high throughput traffic with message queues like RabbitMQ or Kafka?",
      category: "System Design",
      difficulty: "Hard",
      expectedKeyTerms: ["producer", "consumer", "decoupling", "asynchronous", "horizontal scaling", "load balancing"]
    }
  ],
  'Data Science & AI': [
    {
      id: 1,
      question: "What is the difference between supervised, unsupervised, and reinforcement learning? Provide practical use cases for each.",
      category: "Machine Learning Core",
      difficulty: "Easy",
      expectedKeyTerms: ["labeled data", "clustering", "reward function", "regression", "classification"]
    },
    {
      id: 2,
      question: "Explain the bias-variance tradeoff. How do techniques like regularization (L1/L2), cross-validation, and dropout prevent overfitting?",
      category: "Model Optimization",
      difficulty: "Medium",
      expectedKeyTerms: ["overfitting", "underfitting", "generalization", "L1 Lasso", "L2 Ridge", "k-fold"]
    },
    {
      id: 3,
      question: "How does the Transformer architecture and Self-Attention mechanism differ from traditional RNNs and LSTMs for NLP tasks?",
      category: "Deep Learning & NLP",
      difficulty: "Hard",
      expectedKeyTerms: ["attention weights", "query key value", "parallel processing", "vanishing gradient", "embeddings"]
    },
    {
      id: 4,
      question: "Describe your end-to-end data pipeline for cleaning, feature engineering, and model evaluation using metrics like Precision, Recall, and ROC-AUC.",
      category: "Data Pipeline & Evaluation",
      difficulty: "Medium",
      expectedKeyTerms: ["imputation", "normalization", "F1 score", "confusion matrix", "false positives"]
    }
  ]
};

// Generic fallback if custom role specified
const DEFAULT_QUESTIONS = QUESTION_BANK['Full Stack Developer'];

/**
 * Call Gemini REST API if GEMINI_API_KEY is present
 */
async function callGeminiAPI(prompt, apiKey) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      }
    });

    const options = {
      hostname: 'generativelanguage.googleapis.com',
      port: 443,
      path: `/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.candidates && json.candidates[0]?.content?.parts[0]?.text) {
            resolve(json.candidates[0].content.parts[0].text);
          } else {
            reject(new Error('Invalid response from Gemini API'));
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', (e) => reject(e));
    req.setTimeout(8000, () => {
      req.destroy();
      reject(new Error('Gemini API timeout'));
    });
    req.write(postData);
    req.end();
  });
}

/**
 * Generate interview questions based on role, skills, and resume
 */
const generateInterviewQuestions = async ({ role = 'Full Stack Developer', skills = [], resumeText = '', count = 5 }) => {
  const geminiKey = process.env.GEMINI_API_KEY;

  if (geminiKey) {
    try {
      const prompt = `You are a Senior Technical Interviewer conducting a mock interview for the role of "${role}".
Candidate's skills: ${skills.join(', ')}.
Candidate's resume context: ${resumeText ? resumeText.substring(0, 500) : 'None provided'}.

Generate exactly ${count} technical interview questions tailored to their background.
Return ONLY valid JSON matching this schema:
[
  {
    "id": 1,
    "question": "Question text here",
    "category": "Topic/Area",
    "difficulty": "Easy"|"Medium"|"Hard",
    "expectedKeyTerms": ["term1", "term2", "term3"]
  }
]`;
      const responseText = await callGeminiAPI(prompt, geminiKey);
      const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.slice(0, count);
      }
    } catch (err) {
      console.warn('Gemini question generation fallback to built-in bank:', err.message);
    }
  }

  // Built-in Question Selector tailored by role & candidate skills
  const matchedBank = QUESTION_BANK[role] || DEFAULT_QUESTIONS;
  let questions = [...matchedBank];

  // If specific candidate skills exist, inject a skill-customized question
  if (skills && skills.length > 0) {
    const topSkill = skills[0];
    questions.push({
      id: questions.length + 1,
      question: `In your resume, you highlighted proficiency in ${topSkill}. Can you describe an architectural decision or challenge you solved using ${topSkill}?`,
      category: `${topSkill} In Practice`,
      difficulty: 'Medium',
      expectedKeyTerms: [topSkill.toLowerCase(), 'architecture', 'scalability', 'performance', 'debugging', 'solution']
    });
  }

  return questions.slice(0, count).map((q, idx) => ({ ...q, id: idx + 1 }));
};

/**
 * Intelligent Evaluation of Single Answer
 */
const evaluateAnswer = async ({ question, userAnswer, expectedKeyTerms = [], role = 'Full Stack Developer' }) => {
  if (!userAnswer || userAnswer.trim().length === 0) {
    return {
      score: 10,
      relevance: 10,
      accuracy: 10,
      communication: 20,
      confidence: 15,
      keyTermsFound: [],
      comment: "No response was recorded for this question. Practice verbalizing even partial thoughts to demonstrate problem-solving approach.",
      idealAnswer: `A strong answer should outline key concepts: ${expectedKeyTerms.join(', ')}.`
    };
  }

  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey) {
    try {
      const prompt = `You are evaluating a candidate's answer in a technical mock interview.
Role: ${role}
Question: "${question}"
Candidate's Answer: "${userAnswer}"
Expected key concepts: ${expectedKeyTerms.join(', ')}

Evaluate rigorously across 5 dimensions (0-100 each):
1. technicalKnowledge
2. communication
3. confidence
4. accuracy
5. relevance

Return ONLY valid JSON matching this schema:
{
  "score": 85,
  "relevance": 85,
  "accuracy": 80,
  "communication": 90,
  "confidence": 85,
  "keyTermsFound": ["term1"],
  "comment": "Constructive feedback analyzing strengths and areas for improvement.",
  "idealAnswer": "Brief model answer demonstrating best practices."
}`;
      const responseText = await callGeminiAPI(prompt, geminiKey);
      const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      if (parsed.score !== undefined) {
        return parsed;
      }
    } catch (err) {
      console.warn('Gemini evaluation fallback to intelligent built-in evaluator:', err.message);
    }
  }

  // Built-in Intelligent NLP Evaluator
  const textLower = userAnswer.toLowerCase();
  const wordCount = userAnswer.trim().split(/\s+/).length;

  // 1. Relevance & Key Terms
  const foundTerms = [];
  expectedKeyTerms.forEach(term => {
    if (textLower.includes(term.toLowerCase())) {
      foundTerms.push(term);
    }
  });

  const termRatio = expectedKeyTerms.length > 0 ? (foundTerms.length / expectedKeyTerms.length) : 0.6;
  const relevance = Math.min(95, Math.max(35, Math.round(40 + termRatio * 50 + (wordCount > 30 ? 10 : 0))));

  // 2. Accuracy
  const accuracy = Math.min(95, Math.max(30, Math.round(35 + termRatio * 45 + (wordCount > 40 ? 15 : 5))));

  // 3. Communication & Structure
  let commScore = 60;
  if (wordCount >= 25 && wordCount <= 160) commScore = 85;
  else if (wordCount > 160) commScore = 78;
  else if (wordCount < 15) commScore = 45;

  // Check for clear transitional phrases (STAR method markers)
  const transitions = ['because', 'for example', 'such as', 'in order to', 'firstly', 'therefore', 'result', 'approach'];
  const hasTransitions = transitions.filter(t => textLower.includes(t)).length;
  commScore = Math.min(95, commScore + hasTransitions * 4);

  // 4. Confidence
  const fillerWords = ['um', 'uh', 'maybe', 'probably', 'i guess', 'not sure', 'kind of', 'sort of'];
  const fillerCount = fillerWords.filter(f => textLower.includes(f)).length;
  let confidence = Math.min(95, Math.max(40, 85 - (fillerCount * 8)));
  if (wordCount < 15) confidence = Math.max(35, confidence - 20);

  // 5. Technical Knowledge
  const technicalKnowledge = Math.round((accuracy * 0.6) + (relevance * 0.4));

  // Overall Score
  const score = Math.round((technicalKnowledge + communicationScore() + confidence + accuracy + relevance) / 5);

  function communicationScore() { return commScore; }

  // Constructive feedback comment
  let feedbackComment = "";
  if (score >= 80) {
    feedbackComment = `Excellent response! You clearly addressed the core concept and accurately integrated key terminology like ${foundTerms.join(', ') || 'essential architectural terms'}. Your articulation was confident and structured.`;
  } else if (score >= 60) {
    feedbackComment = `Good effort. You demonstrated foundational understanding, but your explanation could benefit from more specific technical depth (e.g. discussing ${expectedKeyTerms.slice(0, 2).join(' and ')}). Try structuring with direct real-world examples.`;
  } else {
    feedbackComment = `Basic answer provided. To elevate your score, dive deeper into technical mechanics rather than general statements. Ensure you cover critical concepts: ${expectedKeyTerms.join(', ')}.`;
  }

  const idealAnswer = `A senior response outlines: "${question.substring(0, 60)}..." by explicitly addressing how core mechanics operate, citing trade-offs, and emphasizing best engineering practices with terms like ${expectedKeyTerms.slice(0, 3).join(', ')}.`;

  return {
    score,
    relevance,
    accuracy,
    communication: commScore,
    confidence,
    keyTermsFound: foundTerms,
    comment: feedbackComment,
    idealAnswer
  };
};

/**
 * Generate Comprehensive Final Performance Report
 */
const generateFinalReport = (interview) => {
  const qList = interview.questions || [];
  const answered = qList.filter(q => q.userAnswer && q.userAnswer.trim().length > 0);

  if (answered.length === 0) {
    return {
      overallScore: 20,
      breakdown: {
        technicalKnowledge: 20,
        communication: 25,
        confidence: 20,
        accuracy: 20,
        relevance: 20
      },
      summaryFeedback: "Interview session concluded without submitted answers. We strongly recommend retaking the interview to evaluate your readiness.",
      strengths: ["Willingness to begin practice"],
      weaknesses: ["No answers submitted across interview questions"],
      suggestedTopics: ["Fundamentals of " + interview.role, "Mock interview rehearsal"],
      certificateBadge: {
        issued: false,
        badgeName: 'Participant',
        grade: 'Needs Practice',
        issuedAt: new Date()
      }
    };
  }

  // Calculate averages across 5 PPT pillars
  let sumTech = 0, sumComm = 0, sumConf = 0, sumAcc = 0, sumRel = 0;
  answered.forEach(q => {
    const f = q.feedback || {};
    sumTech += (f.accuracy * 0.5 + f.relevance * 0.5) || 50;
    sumComm += f.communication || 60;
    sumConf += f.confidence || 60;
    sumAcc += f.accuracy || 55;
    sumRel += f.relevance || 60;
  });

  const count = answered.length;
  const breakdown = {
    technicalKnowledge: Math.round(sumTech / count),
    communication: Math.round(sumComm / count),
    confidence: Math.round(sumConf / count),
    accuracy: Math.round(sumAcc / count),
    relevance: Math.round(sumRel / count)
  };

  const overallScore = Math.round(
    (breakdown.technicalKnowledge * 0.3) +
    (breakdown.accuracy * 0.25) +
    (breakdown.communication * 0.2) +
    (breakdown.relevance * 0.15) +
    (breakdown.confidence * 0.1)
  );

  const strengths = [];
  const weaknesses = [];
  const suggestedTopics = [];

  if (breakdown.communication >= 75) strengths.push("Clear, structured articulation and logical flow of explanations");
  else weaknesses.push("Work on structuring answers using the STAR method (Situation, Task, Action, Result)");

  if (breakdown.technicalKnowledge >= 75) strengths.push(`Strong command of core ${interview.role} engineering concepts`);
  else weaknesses.push(`Deepen domain knowledge and implementation details in ${interview.role}`);

  if (breakdown.accuracy >= 75) strengths.push("High precision and correct technical terminology in responses");
  else weaknesses.push("Review technical fundamentals to avoid vague or approximate descriptions");

  if (breakdown.confidence >= 75) strengths.push("Decisive delivery with minimal hesitation and clear conviction");
  else weaknesses.push("Reduce filler phrases and practice steady pacing during verbal answers");

  if (strengths.length === 0) strengths.push("Good effort in tackling challenging technical questions");
  if (weaknesses.length === 0) weaknesses.push("Continue practicing edge case scenarios and system scaling questions");

  suggestedTopics.push(`${interview.role} System Architecture`);
  suggestedTopics.push("Algorithm Complexity & Optimization");
  suggestedTopics.push("Production Debugging & Root Cause Analysis");

  let summaryFeedback = "";
  let badgeGrade = "Proficient";
  let badgeName = "SkillMock Certified";

  if (overallScore >= 85) {
    badgeGrade = "Distinction";
    badgeName = "SkillMock Elite Master";
    summaryFeedback = `Outstanding performance! You displayed exceptional technical clarity, comprehensive knowledge of ${interview.role}, and crisp communication throughout the interview session. You are well-prepared for real-world industry interviews.`;
  } else if (overallScore >= 70) {
    badgeGrade = "Merit";
    badgeName = "SkillMock Proficient Practitioner";
    summaryFeedback = `Solid performance! You demonstrated good foundational knowledge and answered most questions competently. Focusing on the targeted weaknesses outlined above will help push you to the top quartile of candidates.`;
  } else {
    badgeGrade = "Needs Practice";
    badgeName = "SkillMock Apprentice";
    summaryFeedback = `Fair attempt. While you understand high-level concepts, real-world interviews require greater technical depth, precision, and concrete examples. Review the suggested topics and retake the mock session.`;
  }

  return {
    overallScore,
    breakdown,
    summaryFeedback,
    strengths,
    weaknesses,
    suggestedTopics,
    certificateBadge: {
      issued: overallScore >= 60,
      badgeName,
      grade: badgeGrade,
      issuedAt: new Date()
    }
  };
};

module.exports = {
  generateInterviewQuestions,
  evaluateAnswer,
  generateFinalReport
};
