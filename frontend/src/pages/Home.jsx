import React from 'react';
import { Sparkles, ArrowRight, CheckCircle2, Mic, FileText, BarChart3, Award, Brain, Zap, ShieldCheck, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Home({ setCurrentView }) {
  const { user } = useAuth();

  const handleStart = () => {
    if (user) {
      setCurrentView('dashboard');
    } else {
      setCurrentView('register');
    }
  };

  return (
    <div className="relative overflow-hidden">
      
      {/* Background Decorative Gradient Orbs */}
      <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[650px] h-[350px] bg-gradient-to-tr from-indigo-600/25 to-purple-600/20 blur-[130px] -z-10 pointer-events-none rounded-full" />
      
      {/* Hero Section (Matching Slide 7) */}
      <section className="pt-20 pb-24 px-4 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto">
        
        {/* Powered by AI badge */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs sm:text-sm font-medium mb-8 backdrop-blur-md animate-pulse">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>Powered by Gemini AI & Llama-3</span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.15]">
          Ace Every Interview <br />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-indigo-200 bg-clip-text text-transparent">
            with AI Practice
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          Upload your resume, paste a job description — and let AI generate <span className="text-white font-medium">personalized interview questions</span> with instant feedback.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
          <button
            onClick={handleStart}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold text-base shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-[1.02] transition-all flex items-center justify-center space-x-2"
          >
            <span>Start Practicing Free</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          
          {!user && (
            <button
              onClick={() => setCurrentView('login')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#181730] hover:bg-[#201f3e] border border-slate-700/80 text-slate-200 font-semibold text-base transition-all"
            >
              Sign In
            </button>
          )}
        </div>

        {/* Micro-copy from Slide 7 */}
        <p className="text-xs text-slate-400 flex items-center justify-center space-x-2">
          <span>No credit card</span>
          <span>•</span>
          <span>Free to use</span>
          <span>•</span>
          <span>Powered by open-source LLM & Gemini</span>
        </p>

        {/* Stats Preview Card (Matching Slide 8 stats) */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
          <div className="p-6 rounded-2xl bg-[#121124]/80 border border-[#232043] backdrop-blur-md">
            <div className="text-3xl font-bold text-white mb-1">50K+</div>
            <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Questions Generated</div>
          </div>
          <div className="p-6 rounded-2xl bg-[#121124]/80 border border-[#232043] backdrop-blur-md">
            <div className="text-3xl font-bold text-indigo-400 mb-1">12K+</div>
            <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Mock Interviews</div>
          </div>
          <div className="p-6 rounded-2xl bg-[#121124]/80 border border-[#232043] backdrop-blur-md">
            <div className="text-3xl font-bold text-purple-400 mb-1">87%</div>
            <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">Success Rate</div>
          </div>
        </div>
      </section>

      {/* Methodology & Flowchart Showcase (Slide 5 Flowchart) */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#1d1b38]">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs uppercase font-bold tracking-widest text-indigo-400 mb-2">Architectural Workflow</h2>
          <h3 className="text-3xl sm:text-4xl font-bold text-white">How Skill Mock Powers Your Interview Prep</h3>
          <p className="text-slate-400 text-sm sm:text-base mt-3">
            Built strictly according to the BCC351 Mini Project design pipeline with multimodal input and deep NLP scoring.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="p-6 rounded-2xl bg-[#121124] border border-[#232043] hover:border-indigo-500/50 transition">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-5 border border-indigo-500/20">
              <FileText className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">1. Resume Parsing</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Upload your PDF resume. Our PDF extraction engine scans your technical skills, projects, and domain to craft customized interview questions.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#121124] border border-[#232043] hover:border-indigo-500/50 transition">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-5 border border-purple-500/20">
              <Mic className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">2. Voice & Text Modes</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Experience realistic verbal interviews with real-time Speech-to-Text (STT) and voice prompts, or switch flexibly to text responses.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#121124] border border-[#232043] hover:border-indigo-500/50 transition">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-5 border border-blue-500/20">
              <Brain className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">3. 5-Pillar Evaluation</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Instant analysis across Technical Knowledge, Communication Clarity, Confidence, Accuracy, and Relevance with model answers.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#121124] border border-[#232043] hover:border-indigo-500/50 transition">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-5 border border-emerald-500/20">
              <Award className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">4. PDF Report & Badge</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Download your official performance report as a PDF (via PDFKit) and earn achievement certificates to track progress over time.
            </p>
          </div>

        </div>
      </section>

      {/* College Project Credit Banner */}
      <section id="about" className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="p-8 rounded-3xl bg-gradient-to-r from-[#181730] to-[#121124] border border-indigo-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs uppercase font-bold tracking-widest text-indigo-400">IMS Engineering College, Ghaziabad</span>
            <h3 className="text-2xl font-bold text-white">Department of Computer Science & Engineering</h3>
            <p className="text-xs text-slate-400">
              Mini Project (BCC351) Presentation • Group No - 17 • Supervisor: Ms. Meenu Sharma (Asst. Prof)
            </p>
          </div>
          <button
            onClick={handleStart}
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 flex items-center space-x-2 shrink-0"
          >
            <span>Launch Mock Test</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

    </div>
  );
}
