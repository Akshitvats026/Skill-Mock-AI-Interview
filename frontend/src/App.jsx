import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ResumeUpload from './pages/ResumeUpload';
import InterviewSetup from './pages/InterviewSetup';
import InterviewSession from './pages/InterviewSession';
import ReportView from './pages/ReportView';
import History from './pages/History';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState('home');
  const [activeInterviewId, setActiveInterviewId] = useState(null);
  const [selectedInterviewId, setSelectedInterviewId] = useState(null);
  const [selectedResumeId, setSelectedResumeId] = useState(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080711] flex items-center justify-center text-indigo-400">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs uppercase tracking-widest text-slate-400">Loading Skill Mock...</span>
        </div>
      </div>
    );
  }

  // Guard protected routes
  const protectedViews = ['dashboard', 'resume', 'interview-start', 'interview-session', 'report-view', 'history'];
  if (protectedViews.includes(currentView) && !user) {
    return (
      <div className="min-h-screen bg-[#080711] flex flex-col justify-between">
        <Navbar currentView={currentView} setCurrentView={setCurrentView} />
        <Login setCurrentView={setCurrentView} />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080711] flex flex-col justify-between selection:bg-indigo-600 selection:text-white">
      <Navbar currentView={currentView} setCurrentView={setCurrentView} />

      <main className="flex-grow">
        {currentView === 'home' && (
          <Home setCurrentView={setCurrentView} />
        )}

        {currentView === 'login' && (
          <Login setCurrentView={setCurrentView} />
        )}

        {currentView === 'register' && (
          <Register setCurrentView={setCurrentView} />
        )}

        {currentView === 'dashboard' && (
          <Dashboard
            setCurrentView={setCurrentView}
            setSelectedInterviewId={setSelectedInterviewId}
          />
        )}

        {currentView === 'resume' && (
          <ResumeUpload
            setCurrentView={setCurrentView}
            setSelectedResumeId={setSelectedResumeId}
          />
        )}

        {currentView === 'interview-start' && (
          <InterviewSetup
            setCurrentView={setCurrentView}
            setActiveInterviewId={setActiveInterviewId}
            selectedResumeId={selectedResumeId}
          />
        )}

        {currentView === 'interview-session' && (
          <InterviewSession
            activeInterviewId={activeInterviewId}
            setCurrentView={setCurrentView}
            setSelectedInterviewId={setSelectedInterviewId}
          />
        )}

        {currentView === 'report-view' && (
          <ReportView
            interviewId={selectedInterviewId}
            setCurrentView={setCurrentView}
          />
        )}

        {currentView === 'history' && (
          <History
            setCurrentView={setCurrentView}
            setSelectedInterviewId={setSelectedInterviewId}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
