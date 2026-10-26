import React, { useState, useEffect, useRef } from 'react';
import api from '../api/axios';
import {
  Mic, MicOff, Volume2, ArrowRight, CheckCircle2, Clock,
  AlertCircle, Sparkles, Send, RotateCcw, Brain, Check
} from 'lucide-react';

export default function InterviewSession({ activeInterviewId, setCurrentView, setSelectedInterviewId }) {
  const [interview, setInterview] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [instantFeedback, setInstantFeedback] = useState(null);
  const [timer, setTimer] = useState(120); // 2 minutes per question
  const [isSpeakingQuestion, setIsSpeakingQuestion] = useState(false);
  const [speechError, setSpeechError] = useState('');

  const recognitionRef = useRef(null);

  // Fetch interview session details
  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const res = await api.get(`/interview/${activeInterviewId}`);
        if (res.data.success) {
          const inv = res.data.interview;
          setInterview(inv);
          setCurrentIndex(inv.currentQuestionIndex || 0);

          // If current question already has an answer
          if (inv.questions && inv.questions[inv.currentQuestionIndex || 0]?.userAnswer) {
            setUserAnswer(inv.questions[inv.currentQuestionIndex || 0].userAnswer);
          }
        }
      } catch (err) {
        console.error('Error fetching interview session:', err);
      }
    };

    if (activeInterviewId) {
      fetchInterview();
    }
  }, [activeInterviewId]);

  // Read question aloud with SpeechSynthesis
  const speakQuestion = (text) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onstart = () => setIsSpeakingQuestion(true);
    utterance.onend = () => setIsSpeakingQuestion(false);
    utterance.onerror = () => setIsSpeakingQuestion(false);
    window.speechSynthesis.speak(utterance);
  };

  // Automatically speak question when it changes in Voice mode
  useEffect(() => {
    if (interview && interview.mode === 'Voice' && interview.questions[currentIndex]) {
      speakQuestion(interview.questions[currentIndex].question);
    }
    setTimer(120);
    setUserAnswer('');
    setInstantFeedback(null);
  }, [currentIndex, interview?.mode]);

  // Timer countdown
  useEffect(() => {
    if (instantFeedback) return;
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [instantFeedback]);

  // Initialize Speech Recognition (Web Speech API)
  const toggleSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechError('Speech recognition is not supported in this browser. Please use Chrome or type your answer.');
      return;
    }

    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
    } else {
      setSpeechError('');
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => setIsRecording(true);
        recognition.onresult = (event) => {
          let interimTranscript = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript + ' ';
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }
          setUserAnswer((prev) => {
            const base = finalTranscript ? prev + ' ' + finalTranscript : prev;
            return base.trim();
          });
        };

        recognition.onerror = (e) => {
          console.warn('Speech recognition error:', e.error);
          setIsRecording(false);
          if (e.error === 'not-allowed') {
            setSpeechError('Microphone access was denied. Please allow microphone permissions.');
          }
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
        recognition.start();
      } catch (err) {
        console.error('Error starting recognition:', err);
        setIsRecording(false);
      }
    }
  };

  // Submit Answer to AI for Evaluation
  const handleSubmitAnswer = async () => {
    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }

    if (!userAnswer || userAnswer.trim().length === 0) {
      alert('Please provide an answer (by voice or text) before submitting.');
      return;
    }

    setSubmitting(true);
    try {
      const currentQ = interview.questions[currentIndex];
      const res = await api.post(`/interview/${activeInterviewId}/answer`, {
        questionId: currentQ.id,
        userAnswer: userAnswer.trim()
      });

      if (res.data.success) {
        setInstantFeedback(res.data.feedback);
      }
    } catch (err) {
      console.error('Error submitting answer:', err);
      alert('Failed to evaluate answer. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Proceed to next question or finish interview
  const handleNextOrFinish = async () => {
    const isLast = currentIndex === (interview.questions.length - 1);
    if (isLast) {
      setSubmitting(true);
      try {
        const res = await api.post(`/interview/${activeInterviewId}/finish`);
        if (res.data.success) {
          setSelectedInterviewId(activeInterviewId);
          setCurrentView('report-view');
        }
      } catch (e) {
        console.error('Error finishing interview:', e);
      } finally {
        setSubmitting(false);
      }
    } else {
      setCurrentIndex((prev) => prev + 1);
      setInstantFeedback(null);
      setUserAnswer('');
    }
  };

  if (!interview) {
    return (
      <div className="py-24 text-center text-slate-400">
        <Sparkles className="w-8 h-8 animate-spin mx-auto text-indigo-400 mb-4" />
        <p className="text-base font-semibold text-white">Preparing Your Technical Interview Room...</p>
      </div>
    );
  }

  const currentQ = interview.questions[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / interview.questions.length) * 100);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Session Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#232043] gap-4">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-400">
            {interview.role} Mock Interview • {interview.mode} Mode
          </span>
          <h2 className="text-xl font-bold text-white">
            Question {currentIndex + 1} of {interview.questions.length}
          </h2>
        </div>

        <div className="flex items-center space-x-4">
          {/* Timer Display */}
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#181730] border border-[#2d2a55] text-xs font-mono text-slate-300">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>{Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</span>
          </div>

          {/* Progress Bar */}
          <div className="w-32 bg-[#181730] h-2.5 rounded-full overflow-hidden border border-[#2d2a55]">
            <div
              className="bg-gradient-to-r from-indigo-500 to-purple-600 h-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#121124] border border-[#232043] space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 text-xs font-semibold border border-indigo-500/20">
              {currentQ.category || 'Technical'}
            </span>
            <span className="px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-300 text-xs font-medium">
              {currentQ.difficulty || 'Medium'}
            </span>
          </div>

          <button
            onClick={() => speakQuestion(currentQ.question)}
            className={`p-2 rounded-xl border text-xs flex items-center space-x-1.5 transition ${
              isSpeakingQuestion
                ? 'bg-indigo-600 text-white border-indigo-500 animate-pulse'
                : 'bg-[#181730] border-[#292650] text-slate-400 hover:text-white'
            }`}
            title="Read Question Aloud"
          >
            <Volume2 className="w-4 h-4" />
            <span className="hidden sm:inline">{isSpeakingQuestion ? 'Speaking...' : 'Listen'}</span>
          </button>
        </div>

        <h3 className="text-lg sm:text-2xl font-bold text-white leading-relaxed">
          {currentQ.question}
        </h3>
      </div>

      {/* Answer Input Section */}
      {!instantFeedback ? (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#121124] border border-[#232043] space-y-5">
          
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center space-x-2">
              <Brain className="w-4 h-4 text-purple-400" />
              <span>Your Answer ({interview.mode === 'Voice' ? 'Speech or Text' : 'Text Response'})</span>
            </label>

            {interview.mode === 'Voice' && (
              <button
                type="button"
                onClick={toggleSpeechRecognition}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition ${
                  isRecording
                    ? 'bg-red-600 text-white animate-pulse shadow-lg shadow-red-600/30'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20'
                }`}
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                <span>{isRecording ? 'Stop Recording' : 'Speak Answer'}</span>
              </button>
            )}
          </div>

          {/* Audio Wave Visualizer when recording */}
          {isRecording && (
            <div className="flex items-center justify-center space-x-1.5 py-3 px-4 bg-red-500/10 border border-red-500/20 rounded-xl">
              <span className="text-xs text-red-300 font-medium mr-3">Listening to your speech...</span>
              <div className="w-1.5 bg-red-500 rounded-full animate-wave-1" />
              <div className="w-1.5 bg-red-400 rounded-full animate-wave-2" />
              <div className="w-1.5 bg-red-500 rounded-full animate-wave-3" />
              <div className="w-1.5 bg-red-400 rounded-full animate-wave-4" />
              <div className="w-1.5 bg-red-500 rounded-full animate-wave-5" />
            </div>
          )}

          {speechError && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
              <span>{speechError}</span>
            </div>
          )}

          {/* Text Area */}
          <textarea
            rows={6}
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder={
              interview.mode === 'Voice'
                ? "Click 'Speak Answer' to speak through your microphone, or type your answer here..."
                : "Type your detailed technical explanation, architecture breakdown, or code solution here..."
            }
            className="w-full p-4 bg-[#181730] border border-[#2d2a55] rounded-2xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 transition resize-none leading-relaxed"
          />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <span className="text-xs text-slate-400">
              Word Count: {userAnswer.trim() ? userAnswer.trim().split(/\s+/).length : 0} words
            </span>

            <button
              onClick={handleSubmitAnswer}
              disabled={submitting || !userAnswer.trim()}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm shadow-xl shadow-indigo-600/30 transition disabled:opacity-40 flex items-center justify-center space-x-2"
            >
              <span>{submitting ? 'AI Evaluating Answer...' : 'Submit & Evaluate Answer'}</span>
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>
      ) : (
        /* Instant Feedback Card (Slide 3 & 4 Objective) */
        <div className="p-6 sm:p-8 rounded-3xl bg-[#121124] border border-indigo-500/40 space-y-6 shadow-2xl">
          
          <div className="flex items-center justify-between border-b border-[#232043] pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">Instant AI Answer Evaluation</h4>
                <p className="text-xs text-slate-400">5-Pillar evaluation breakdown</p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-400 block uppercase font-medium">Question Score</span>
              <span className="text-2xl font-extrabold text-indigo-400">{instantFeedback.score || 0}%</span>
            </div>
          </div>

          {/* 4 Metric Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-[#181730] border border-[#2d2a55] text-center">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Relevance</div>
              <div className="text-lg font-bold text-indigo-300">{instantFeedback.relevance || 0}%</div>
            </div>
            <div className="p-3 rounded-xl bg-[#181730] border border-[#2d2a55] text-center">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Accuracy</div>
              <div className="text-lg font-bold text-purple-300">{instantFeedback.accuracy || 0}%</div>
            </div>
            <div className="p-3 rounded-xl bg-[#181730] border border-[#2d2a55] text-center">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Communication</div>
              <div className="text-lg font-bold text-blue-300">{instantFeedback.communication || 0}%</div>
            </div>
            <div className="p-3 rounded-xl bg-[#181730] border border-[#2d2a55] text-center">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Confidence</div>
              <div className="text-lg font-bold text-emerald-300">{instantFeedback.confidence || 0}%</div>
            </div>
          </div>

          {/* Feedback Commentary */}
          <div className="p-4 rounded-2xl bg-[#181730] border border-[#2d2a55] space-y-2">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
              Constructive Review
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              {instantFeedback.comment}
            </p>
          </div>

          {/* Key Terms Found */}
          {instantFeedback.keyTermsFound && instantFeedback.keyTermsFound.length > 0 && (
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Technical Terms Detected:
              </span>
              <div className="flex flex-wrap gap-2">
                {instantFeedback.keyTermsFound.map((term, i) => (
                  <span key={i} className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
                    ✔ {term}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Model Ideal Answer */}
          {instantFeedback.idealAnswer && (
            <div className="p-4 rounded-2xl bg-[#15142b] border border-indigo-500/20 text-xs text-slate-300 space-y-1">
              <span className="text-indigo-400 font-semibold block">Model Answer Guide:</span>
              <p className="leading-relaxed">{instantFeedback.idealAnswer}</p>
            </div>
          )}

          {/* Next Question / Finish Button */}
          <div className="flex justify-end pt-2">
            <button
              onClick={handleNextOrFinish}
              disabled={submitting}
              className="px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-xl shadow-indigo-600/30 flex items-center space-x-2 transition"
            >
              <span>
                {currentIndex === interview.questions.length - 1
                  ? (submitting ? 'Compiling Final Report...' : 'Finish & View Final Report')
                  : 'Proceed to Next Question'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
