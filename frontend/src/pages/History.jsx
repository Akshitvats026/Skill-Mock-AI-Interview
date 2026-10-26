import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { History as HistoryIcon, Award, Calendar, ChevronRight, BarChart2, TrendingUp, BookOpen, Clock } from 'lucide-react';

export default function History({ setCurrentView, setSelectedInterviewId }) {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/interview/history');
        if (res.data.success) {
          setInterviews(res.data.interviews || []);
        }
      } catch (e) {
        console.error('Error fetching score log history:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const openReport = (id) => {
    setSelectedInterviewId(id);
    setCurrentView('report-view');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Title */}
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-medium mb-2">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Performance Analytics & Progression</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Score Log & History</h1>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl">
          Review your historical mock interview performances, identify mastery trends, and discover key topics to focus your preparation.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-slate-500">Loading interview score logs...</div>
      ) : interviews.length === 0 ? (
        <div className="p-12 rounded-3xl bg-[#121124] border border-[#232043] text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-800 mx-auto flex items-center justify-center text-slate-400">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">No Mock Interviews Logged</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            You haven't completed any mock interviews yet. Launch your first session to begin tracking your performance scores over time.
          </p>
          <button
            onClick={() => setCurrentView('interview-start')}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition"
          >
            Start Your First Interview
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Progress Overview Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-[#171530] to-[#121124] border border-[#27244c] grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <div className="text-xs text-slate-400 font-semibold uppercase">Total Sessions</div>
              <div className="text-3xl font-extrabold text-white mt-1">{interviews.length}</div>
            </div>
            <div>
              <div className="text-xs text-slate-400 font-semibold uppercase">Latest Score</div>
              <div className="text-3xl font-extrabold text-indigo-400 mt-1">
                {interviews[0]?.overallScore || 0}%
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-400 font-semibold uppercase">Highest Score</div>
              <div className="text-3xl font-extrabold text-emerald-400 mt-1">
                {Math.max(...interviews.map(i => i.overallScore || 0))}%
              </div>
            </div>
          </div>

          {/* List of Sessions */}
          <div className="p-6 rounded-3xl bg-[#121124] border border-[#232043] space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
              All Interview Attempts
            </h3>

            <div className="space-y-3">
              {interviews.map((item) => (
                <div
                  key={item._id || item.id}
                  onClick={() => openReport(item._id || item.id)}
                  className="p-5 rounded-2xl bg-[#181730] border border-[#27254c] hover:border-indigo-500/40 cursor-pointer transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-white text-base">{item.role}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                        {item.mode} Mode
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 flex items-center space-x-3">
                      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{item.questions?.length || 0} Questions</span>
                      <span>•</span>
                      <span className="text-slate-300">{item.certificateBadge?.grade || 'Completed'}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-5">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">Score</span>
                      <span className={`text-2xl font-extrabold ${
                        item.overallScore >= 75 ? 'text-emerald-400' : item.overallScore >= 60 ? 'text-indigo-400' : 'text-amber-400'
                      }`}>
                        {item.overallScore || 0}%
                      </span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-500" />
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Recommended Practice Topics */}
          <div className="p-6 rounded-3xl bg-[#121124] border border-[#232043] space-y-4">
            <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
              <BookOpen className="w-4 h-4" />
              <span>Recommended Topics for Practice (Objective Log)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {[
                'System Architecture & Scaling',
                'Event Loop & Asynchronous I/O',
                'Database Indexing & ACID Transactions',
                'API Security & JWT Expiration Strategies',
                'Microservice Communication & Queues',
                'STAR Method Answer Structuring'
              ].map((topic, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-[#181730] border border-[#27254c] text-xs text-slate-300 font-medium">
                  {topic}
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
