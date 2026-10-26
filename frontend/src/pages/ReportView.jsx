import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import confetti from 'canvas-confetti';
import {
  Award, Download, ArrowLeft, CheckCircle2, XCircle, Brain,
  Sparkles, FileText, ChevronDown, ChevronUp, Printer, Share2
} from 'lucide-react';

export default function ReportView({ interviewId, setCurrentView }) {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCertificate, setShowCertificate] = useState(false);
  const [expandedQ, setExpandedQ] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await api.get(`/interview/${interviewId}`);
        if (res.data.success) {
          setReport(res.data.interview);
          if (res.data.interview.overallScore >= 60) {
            triggerConfetti();
          }
        }
      } catch (err) {
        console.error('Error fetching interview report:', err);
      } finally {
        setLoading(false);
      }
    };

    if (interviewId) {
      fetchReport();
    }
  }, [interviewId]);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {}
  };

  const handleDownloadPDF = () => {
    const token = localStorage.getItem('skillmock_token');
    const apiBase = import.meta.env.VITE_API_URL
      ? `${import.meta.env.VITE_API_URL.replace(/\/+$/, '')}/api`
      : '/api';
    const url = `${apiBase}/interview/${interviewId}/pdf-report?token=${token}`;
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-slate-400">
        <Sparkles className="w-8 h-8 animate-spin mx-auto text-indigo-400 mb-4" />
        <p className="text-base font-semibold text-white">Generating Performance Analytics...</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="py-24 text-center text-slate-400">
        <p>Report not found.</p>
        <button
          onClick={() => setCurrentView('dashboard')}
          className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const b = report.breakdown || {};
  const metrics = [
    { label: 'Technical Knowledge', value: b.technicalKnowledge || 0, color: 'from-blue-500 to-indigo-600' },
    { label: 'Communication Clarity', value: b.communication || 0, color: 'from-indigo-500 to-purple-600' },
    { label: 'Confidence & Delivery', value: b.confidence || 0, color: 'from-purple-500 to-pink-600' },
    { label: 'Accuracy & Depth', value: b.accuracy || 0, color: 'from-emerald-500 to-teal-600' },
    { label: 'Relevance & Key Terms', value: b.relevance || 0, color: 'from-amber-500 to-orange-600' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#232043] gap-4">
        <div>
          <button
            onClick={() => setCurrentView('dashboard')}
            className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white mb-2 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-3xl font-extrabold text-white">Interview Performance Report</h1>
          <p className="text-xs text-slate-400 mt-1">
            Role: <span className="text-indigo-400 font-semibold">{report.role}</span> • Mode: {report.mode} • Date: {new Date(report.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleDownloadPDF}
            className="px-5 py-2.5 rounded-xl bg-[#181730] hover:bg-[#201f3e] border border-indigo-500/30 text-indigo-300 hover:text-white font-semibold text-xs flex items-center space-x-2 transition shadow-lg shadow-indigo-600/10"
          >
            <Download className="w-4 h-4" />
            <span>Download Report (PDF)</span>
          </button>

          {report.overallScore >= 60 && (
            <button
              onClick={() => setShowCertificate(true)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs flex items-center space-x-2 shadow-lg shadow-indigo-600/30 transition"
            >
              <Award className="w-4 h-4" />
              <span>View Certificate</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Score & Metrics Hero Card */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-[#16142e] to-[#100f21] border border-indigo-500/30 grid grid-cols-1 md:grid-cols-3 gap-8 items-center shadow-xl">
        
        {/* Overall Score Circle */}
        <div className="flex flex-col items-center justify-center text-center p-6 bg-[#181730]/60 rounded-2xl border border-[#2d2a55]">
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke="#252347"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke="url(#scoreGrad)"
                strokeWidth="10"
                fill="transparent"
                strokeDasharray="264"
                strokeDashoffset={264 - (264 * (report.overallScore || 0)) / 100}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
              <defs>
                <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#4f46e5" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-4xl font-extrabold text-white">{report.overallScore || 0}%</span>
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Overall</span>
            </div>
          </div>

          <div className="mt-4">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {report.certificateBadge?.grade || 'Proficient'}
            </span>
          </div>
        </div>

        {/* 5 Dimensions Progress Bars */}
        <div className="md:col-span-2 space-y-3.5">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            5-Pillar Evaluation Breakdown (from Methodology Flowchart)
          </h3>
          {metrics.map((m, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-slate-300">{m.label}</span>
                <span className="font-bold text-white">{m.value}%</span>
              </div>
              <div className="h-2.5 w-full bg-[#1e1c39] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${m.color} transition-all duration-700`}
                  style={{ width: `${m.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Summary Feedback */}
      <div className="p-6 rounded-2xl bg-[#121124] border border-[#232043]">
        <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4" />
          <span>Qualitative AI Assessment</span>
        </div>
        <p className="text-sm text-slate-200 leading-relaxed">
          {report.summaryFeedback}
        </p>
      </div>

      {/* Strengths & Weaknesses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Strengths */}
        <div className="p-6 rounded-2xl bg-[#121124] border border-emerald-500/20">
          <h4 className="text-sm font-bold text-emerald-400 flex items-center space-x-2 mb-4">
            <CheckCircle2 className="w-4 h-4" />
            <span>Demonstrated Strengths</span>
          </h4>
          <div className="space-y-2.5">
            {(report.strengths || []).map((s, idx) => (
              <div key={idx} className="flex items-start space-x-2.5 text-xs text-slate-300">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                <span>{s}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Weaknesses */}
        <div className="p-6 rounded-2xl bg-[#121124] border border-amber-500/20">
          <h4 className="text-sm font-bold text-amber-400 flex items-center space-x-2 mb-4">
            <XCircle className="w-4 h-4" />
            <span>Targeted Areas for Improvement</span>
          </h4>
          <div className="space-y-2.5">
            {(report.weaknesses || []).map((w, idx) => (
              <div key={idx} className="flex items-start space-x-2.5 text-xs text-slate-300">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                <span>{w}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Per Question Detailed Breakdown */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#121124] border border-[#232043] space-y-4">
        <h3 className="text-lg font-bold text-white mb-4">Question-by-Question Deep Dive</h3>
        
        <div className="space-y-3">
          {(report.questions || []).map((q, index) => {
            const isExpanded = expandedQ === index;
            const f = q.feedback || {};

            return (
              <div
                key={index}
                className="rounded-2xl bg-[#181730] border border-[#2a284e] overflow-hidden transition"
              >
                <div
                  onClick={() => setExpandedQ(isExpanded ? null : index)}
                  className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-white/[0.02]"
                >
                  <div className="flex items-center space-x-3 flex-1 pr-4">
                    <span className="w-7 h-7 rounded-lg bg-indigo-600/20 text-indigo-300 text-xs font-bold flex items-center justify-center shrink-0">
                      {index + 1}
                    </span>
                    <p className="text-sm font-semibold text-white leading-snug">
                      {q.question}
                    </p>
                  </div>

                  <div className="flex items-center space-x-4 shrink-0">
                    <span className="text-xs font-bold text-indigo-400">{f.score || 0}%</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-[#232043] space-y-3 text-xs">
                    <div>
                      <span className="text-slate-400 uppercase font-semibold text-[10px] block mb-1">
                        Candidate Answer:
                      </span>
                      <p className="p-3 rounded-xl bg-[#100f21] text-slate-200 italic leading-relaxed">
                        "{q.userAnswer || 'No answer recorded'}"
                      </p>
                    </div>

                    <div>
                      <span className="text-indigo-400 uppercase font-semibold text-[10px] block mb-1">
                        AI Detailed Feedback:
                      </span>
                      <p className="text-slate-300 leading-relaxed">
                        {f.comment || 'Feedback pending.'}
                      </p>
                    </div>

                    {f.idealAnswer && (
                      <div>
                        <span className="text-purple-400 uppercase font-semibold text-[10px] block mb-1">
                          Model Answer Reference:
                        </span>
                        <p className="text-slate-300 leading-relaxed">
                          {f.idealAnswer}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Certificate Modal */}
      {showCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-[#0e0d1d] border-2 border-amber-400/40 rounded-3xl p-8 sm:p-10 shadow-2xl text-center space-y-6">
            
            <button
              onClick={() => setShowCertificate(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              ✕
            </button>

            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 to-amber-600 mx-auto flex items-center justify-center text-black font-extrabold shadow-lg shadow-amber-500/30">
              <Award className="w-8 h-8" />
            </div>

            <div>
              <div className="text-xs uppercase font-bold tracking-widest text-amber-400">Certificate of Completion</div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">SkillMock Interview Certified</h2>
              <p className="text-xs text-slate-400 mt-1">
                Department of Computer Science & Engineering • IMS Engineering College
              </p>
            </div>

            <div className="py-4 border-y border-[#292650] text-sm text-slate-300 space-y-2">
              <p>This certifies that the candidate has successfully completed the rigorous AI-evaluated technical interview simulation in</p>
              <p className="text-lg font-bold text-indigo-400">{report.role}</p>
              <p className="text-xs text-slate-400">
                Achieving an Overall Score of <span className="font-bold text-white">{report.overallScore}%</span> ({report.certificateBadge?.grade})
              </p>
            </div>

            <div className="text-[11px] text-slate-400 font-mono">
              Mini Project (BCC351) Presentation • Group No - 17<br />
              Supervisor: Ms. Meenu Sharma (Assistant Professor)
            </div>

            <div className="flex justify-center space-x-3 pt-2">
              <button
                onClick={() => window.print()}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center space-x-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print Certificate</span>
              </button>
              <button
                onClick={() => setShowCertificate(false)}
                className="px-6 py-2.5 rounded-xl bg-[#181730] text-slate-300 hover:text-white text-xs font-semibold"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
