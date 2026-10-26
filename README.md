# Skill Mock - AI Powered Mock Interview Platform

[![Project](https://img.shields.io/badge/Course-BCC351%20Mini%20Project-indigo.svg)](https://imsec.ac.in)
[![College](https://img.shields.io/badge/IMS%20Engineering%20College-Ghaziabad-purple.svg)](https://imsec.ac.in)
[![University](https://img.shields.io/badge/Affiliated%20to-AKTU%20Lucknow-blue.svg)](https://aktu.ac.in)
[![Session](https://img.shields.io/badge/Academic%20Year-2025--26-emerald.svg)]()

> **Mini Project (BCC351) Presentation on Skill Mock**  
> **Department of Computer Science & Engineering**  
> **IMS Engineering College, Ghaziabad**  
> **Dr. A.P.J. Abdul Kalam Technical University, Lucknow**

---

## 👥 Project Team & Supervisor

**Supervisor:**
* **Ms. Meenu Sharma** (Assistant Professor, Department of CSE)

**Submitted By: Group No - 17**
* **Kamal Dube** (2401430100169)
* **Prakhar Tyagi** (2401430100150)
* **Aditya Kumar Singh** (2401430100022)
* **Nikhil Kumar** (2401430100154)
* **Anurag Kumar Yadav** (2401430100056)

---

## 📌 Problem Statement & Objectives

Students and fresh graduates struggle to access affordable, dynamic mock interviews with personalized, constructive feedback. Traditional resources offer only static question lists and generic tips instead of adaptive, performance-based evaluation.

### Core Objectives:
1. **Dynamic Questioning:** Build an AI mock interview tool that asks job-specific and resume-specific technical questions.
2. **Multimodal Evaluation:** Record and analyze user answers via **Voice (Speech-to-Text)** or **Text** using NLP across 5 key dimensions.
3. **Instant Constructive Feedback:** Provide immediate feedback on each answer, highlighting strengths, areas to improve, and model answers.
4. **Historical Score Log & Analytics:** Maintain a persistent score log so candidates can visualize progress, earn completion badges, and target growth areas.
5. **PDF Report & Certification:** Export an official, formatted performance report as a PDF using `PDFKit` and generate an academic certificate.

---

## 🏗️ System Architecture & Workflow

```
[START]
   │
   ▼
[User Registration / Login (JWT Authentication)]
   │
   ▼
[User Dashboard]
   │
   ▼
[Upload Resume (PDF - Multer & PDF-Parse)]
   │
   ▼
[Resume Parsing & Skill Extraction (Skills, Projects, Experience, Domain)]
   │
   ▼
[Generate Interview Questions (Tailored by Domain & Resume)]
   │
   ├───────────────┬───────────────┐
   ▼                               ▼
[Voice Interview]             [Text Interview]
   │                               │
[Speech-to-Text (STT)]        [Text Response]
   └───────────────┬───────────────┘
                   │
                   ▼
     [Gemini AI / NLP Evaluation]
     (1. Technical Knowledge)
     (2. Communication Clarity)
     (3. Confidence & Tone)
     (4. Technical Accuracy)
     (5. Relevance & Key Terms)
                   │
                   ▼
     [Performance Report Generation]
     (Score, Feedback, Strengths, Weaknesses)
                   │
                   ▼
     [Certificate & Badge Generation]
                   │
                   ▼
     [Download Report as PDF (PDFKit)]
                   │
                   ▼
                [END]
```

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide Icons, Canvas Confetti, Web Speech API (STT & TTS) |
| **Backend** | Node.js, Express.js, JWT Authentication, Multer, PDF-Parse, PDFKit |
| **Database** | MongoDB (with automatic persistent JSON storage fallback for zero setup dependencies) |
| **AI / NLP** | Google Gemini API / Groq Llama-3 / Built-in Intelligent 5-Pillar NLP Evaluator |

---

## 🚀 Getting Started

### Prerequisites:
* **Node.js** v18+ (tested on Node v24)
* **npm** v9+

### 1-Click Startup (Runs Both Backend & Frontend):
```bash
# In the root folder "AI Interview Project":
npm start
```

### Alternatively, run separately:
```bash
# Terminal 1 - Backend (Port 5000):
npm run backend

# Terminal 2 - Frontend (Port 5173):
npm run frontend
```

Open your browser at **[http://localhost:5173](http://localhost:5173)**.

---

## 🔑 Environment Configuration

The backend is configured in `backend/.env`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/skill_mock_db
JWT_SECRET=skillmock_super_secret_jwt_key_2026_ims_btech
JWT_EXPIRE=7d

# Optional AI API keys:
# If left blank, the built-in 5-pillar NLP evaluator functions automatically
GEMINI_API_KEY=
GROQ_API_KEY=
CLIENT_URL=http://localhost:5173
```

---

## 📡 REST API Reference

### Auth Endpoints (`/api/auth`)
* `POST /api/auth/register` - Create candidate account
* `POST /api/auth/login` - Authenticate user & receive JWT token
* `GET /api/auth/me` - Get current authenticated user profile

### Resume Endpoints (`/api/resume`)
* `POST /api/resume/upload` - Upload PDF resume, extract skills & experience
* `GET /api/resume/latest` - Fetch user's latest parsed resume

### Interview Endpoints (`/api/interview`)
* `POST /api/interview/start` - Initialize new interview session
* `POST /api/interview/:id/answer` - Submit answer & receive instant 5-pillar evaluation
* `POST /api/interview/:id/finish` - Finalize session, calculate score & award certificate badge
* `GET /api/interview/history` - Retrieve candidate score log
* `GET /api/interview/:id` - Fetch full interview report
* `GET /api/interview/:id/pdf-report` - Download official PDF performance report
