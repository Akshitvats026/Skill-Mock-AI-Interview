import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { Mic, FileText, Sparkles, Volume2, AlignLeft, Check, ArrowRight, Play } from 'lucide-react';

export default function InterviewSetup({ setCurrentView, setActiveInterviewId, selectedResumeId }) {
  const [role, setRole] = useState('Full Stack Developer');
  const [mode, setMode] = useState('Voice');
  const [questionCount, setQuestionCount] = useState(4);
  const [useResume, setUseResume] = useState(true);
  const [latestResume, setLatestResume] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const res = await api.get('/resume/latest');
        if (res.data.success && res.data.resume) {
          setLatestResume(res.data.resume);
          if (res.data.resume.parsedData?.detectedDomain) {
            setRole(res.data.resume.parsedData.detectedDomain);
          }
        }
      } catch (e) {
        console.error('Error fetching resume info:', e);
      }
    };
    fetchResume();
  }, []);

  const roles = [
    'Full Stack Developer',
    'Frontend Web Development',
    'Backend Engineering',
    'Data Science & AI'
  ];

  const handleStart = async () => {
    setLoading(true);
    try {
      const payload = {
        role,
        mode,
        questionCount,
        resumeId: (useResume && (selectedResumeId || latestResume?._id || latestResume?.id)) || null
      };

      const res = await api.post('/interview/start', payload);
      if (res.data.success) {
        setActiveInterviewId(res.data.interview._id || res.data.interview.id);
        setCurrentView('interview-session');
      }
    } catch (err) {
      console.error('Error starting interview session:', err);
      alert('Failed to initialize interview. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Title */}
      <div className="text-center max-w-xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-medium mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Interview Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Configure Your Mock Session</h1>
        <p className="text-sm text-slate-400 mt-2">
          Select your target role, interview mode, and customize your question bank.
        </p>
      </div>

      <div className="p-8 sm:p-10 rounded-3xl bg-[#121124] border border-[#232043] space-y-8 shadow-xl">
        
        {/* 1. Target Role Selection */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">
            1. Select Target Role / Domain
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {roles.map((r) => (
              <div
                key={r}
                onClick={() => setRole(r)}
                className={`p-4 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                  role === r
                    ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-600/10'
                    : 'bg-[#181730] border-[#292650] text-slate-300 hover:border-slate-600'
                }`}
              >
                <span className="text-sm font-semibold">{r}</span>
                {role === r && <Check className="w-4 h-4 text-indigo-400" />}
              </div>
            ))}
          </div>
        </div>

        {/* 2. Interview Mode (Voice vs Text - from Flowchart) */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">
            2. Choose Interview Mode (Multimodal)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Voice Mode */}
            <div
              onClick={() => setMode('Voice')}
              className={`p-5 rounded-2xl border cursor-pointer transition flex items-start space-x-4 ${
                mode === 'Voice'
                  ? 'bg-gradient-to-br from-indigo-900/40 to-[#181730] border-indigo-500 text-white'
                  : 'bg-[#181730] border-[#292650] text-slate-300 hover:border-slate-600'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/20">
                <Mic className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-white">Voice Interview (Recommended)</h4>
                  {mode === 'Voice' && <Check className="w-4 h-4 text-indigo-400" />}
                </div>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  The AI reads questions aloud. Speak your answer into the microphone with live Speech-to-Text transcription.
                </p>
              </div>
            </div>

            {/* Text Mode */}
            <div
              onClick={() => setMode('Text')}
              className={`p-5 rounded-2xl border cursor-pointer transition flex items-start space-x-4 ${
                mode === 'Text'
                  ? 'bg-gradient-to-br from-indigo-900/40 to-[#181730] border-indigo-500 text-white'
                  : 'bg-[#181730] border-[#292650] text-slate-300 hover:border-slate-600'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0 border border-purple-500/20">
                <AlignLeft className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-white">Text Interview</h4>
                  {mode === 'Text' && <Check className="w-4 h-4 text-indigo-400" />}
                </div>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Read questions on-screen and type your technical solutions, code snippets, or explanations.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* 3. Resume Linkage */}
        <div className="p-4 rounded-2xl bg-[#181730] border border-[#2d2a55] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText className="w-5 h-5 text-indigo-400" />
            <div>
              <div className="text-sm font-semibold text-white">
                {latestResume ? `Include parsed resume: ${latestResume.originalName}` : 'No resume uploaded'}
              </div>
              <div className="text-xs text-slate-400">
                {latestResume
                  ? `Injects ${latestResume.parsedData?.skills?.length || 0} skills into question generation`
                  : 'Standard role questions will be asked'}
              </div>
            </div>
          </div>
          {latestResume && (
            <input
              type="checkbox"
              checked={useResume}
              onChange={(e) => setUseResume(e.target.checked)}
              className="w-5 h-5 accent-indigo-600 cursor-pointer rounded"
            />
          )}
        </div>

        {/* Start Button */}
        <button
          onClick={handleStart}
          disabled={loading}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:opacity-95 text-white font-bold text-base shadow-xl shadow-indigo-600/30 transition flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          <Play className="w-5 h-5 fill-white" />
          <span>{loading ? 'Generating AI Questions...' : 'Start Interview Now'}</span>
        </button>

      </div>
    </div>
  );
}
