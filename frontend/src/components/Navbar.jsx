import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Brain, LogOut, User, FileText, History as HistoryIcon, Home, Mic } from 'lucide-react';

export default function Navbar({ currentView, setCurrentView }) {
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 bg-[#090812]/90 backdrop-blur-md border-b border-[#232043]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => setCurrentView('home')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#121124] rounded-[10px] flex items-center justify-center">
                <Brain className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-wider text-white">SKILL MOCK</span>
                <span className="text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 px-1.5 py-0.5 rounded-full">
                  BCC351
                </span>
              </div>
              <p className="text-[10px] text-slate-400 tracking-wider">AI INTERVIEW PLATFORM</p>
            </div>
          </div>

          {/* Navigation links if logged in */}
          {user ? (
            <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
                  currentView === 'dashboard'
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Home className="w-4 h-4" />
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => setCurrentView('resume')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
                  currentView === 'resume'
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Resume Analyzer</span>
              </button>

              <button
                onClick={() => setCurrentView('interview-start')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
                  currentView === 'interview-start' || currentView === 'interview-session'
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Mic className="w-4 h-4 text-emerald-400" />
                <span>Mock Interview</span>
              </button>

              <button
                onClick={() => setCurrentView('history')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
                  currentView === 'history'
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <HistoryIcon className="w-4 h-4" />
                <span>Score Log</span>
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-6 text-sm text-slate-300">
              <button onClick={() => setCurrentView('home')} className="hover:text-white">Home</button>
              <a href="#features" className="hover:text-white">Methodology</a>
              <a href="#about" className="hover:text-white">Team & Project</a>
            </div>
          )}

          {/* Right Action buttons */}
          <div className="flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-semibold text-white">{user.name}</span>
                  <span className="text-[11px] text-slate-400">{user.targetRole || 'Candidate'}</span>
                </div>
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-sm text-white border border-indigo-400/40 shadow-inner">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <button
                  onClick={() => {
                    logout();
                    setCurrentView('home');
                  }}
                  title="Sign Out"
                  className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setCurrentView('login')}
                  className="text-sm font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/5 transition"
                >
                  Sign In
                </button>
                <button
                  onClick={() => setCurrentView('register')}
                  className="text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg shadow-lg shadow-indigo-600/25 transition flex items-center space-x-1.5"
                >
                  <span>Get Started Free</span>
                  <Sparkles className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}
