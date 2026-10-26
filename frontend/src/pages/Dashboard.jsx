import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Mic, FileText, Award, BarChart3, Clock, ArrowRight, Play, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';

export default function Dashboard({ setCurrentView, setSelectedInterviewId }) {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [latestResume, setLatestResume] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [histRes, resRes] = await Promise.all([
          api.get('/interview/history'),
          api.get('/resume/latest')
        ]);
        if (histRes.data.success) {
          setHistory(histRes.data.interviews || []);
        }
        if (resRes.data.success && resRes.data.resume) {
          setLatestResume(resRes.data.resume);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const viewReport = (id) => {
    setSelectedInterviewId(id);
    setCurrentView('report-view');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Welcome Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-indigo-900/60 via-[#16142e] to-[#121124] border border-indigo-500/20 backdrop-blur-md relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Ready for your next mock session</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Welcome back, {user?.name || 'Engineer'}!
          </h1>
          <p className="text-sm text-slate-300 max-w-xl">
            Target Role: <span className="text-indigo-400 font-semibold">{user?.targetRole || 'Full Stack Developer'}</span>. Practice real-time verbal and text technical interviews to boost your confidence.
          </p>
        </div>

        <div className="flex items-center space-x-3 z-10 shrink-0">
          <button
            onClick={() => setCurrentView('interview-start')}
            className="px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-xl shadow-indigo-600/30 flex items-center space-x-2 transition hover:scale-[1.02]"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Start Mock Interview</span>
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-[#121124] border border-[#232043]">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase font-semibold">Total Interviews</span>
            <BarChart3 className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{history.length}</div>
          <div className="text-xs text-slate-500 mt-1">Completed practice sessions</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#121124] border border-[#232043]">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase font-semibold">Average Score</span>
            <Award className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">
            {history.length > 0
              ? Math.round(history.reduce((acc, curr) => acc + (curr.overallScore || 0), 0) / history.length)
              : 0}%
          </div>
          <div className="text-xs text-slate-500 mt-1">5-Pillar evaluation metric</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#121124] border border-[#232043]">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase font-semibold">Resume Status</span>
            <FileText className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-lg font-bold text-white truncate">
            {latestResume ? latestResume.originalName : 'No Resume'}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {latestResume ? `${latestResume.parsedData?.skills?.length || 0} skills extracted` : 'Upload PDF to customize'}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#121124] border border-[#232043]">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs uppercase font-semibold">Certification Badge</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-lg font-bold text-amber-300">
            {history.some(h => h.certificateBadge?.issued) ? 'Verified' : 'In Progress'}
          </div>
          <div className="text-xs text-slate-500 mt-1">Pass score ≥ 60%</div>
        </div>

      </div>

      {/* Quick Launch Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Mock Interview Launch Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-[#15142a] to-[#100f21] border border-[#27244d] hover:border-indigo-500/40 transition">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Interactive Mock Interview</h3>
              <p className="text-xs text-slate-400">Choose Voice mode with Speech-to-Text or Text mode</p>
            </div>
          </div>
          <p className="text-xs text-slate-400 mb-6 leading-relaxed">
            Answer technical questions with live speech recognition, real-time timer, and instant NLP evaluation on technical depth and communication clarity.
          </p>
          <button
            onClick={() => setCurrentView('interview-start')}
            className="w-full py-2.5 px-4 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 text-xs font-semibold flex items-center justify-center space-x-2 transition"
          >
            <span>Configure & Start Session</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Resume Analyzer Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-[#15142a] to-[#100f21] border border-[#27244d] hover:border-purple-500/40 transition">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Resume PDF Parser</h3>
              <p className="text-xs text-slate-400">Extract skills, projects, and domain keywords</p>
            </div>
          </div>
          <p className="text-xs text-slate-400 mb-6 leading-relaxed">
            Upload your latest resume PDF to personalize your mock interview question bank around your real tech stack and past projects.
          </p>
          <button
            onClick={() => setCurrentView('resume')}
            className="w-full py-2.5 px-4 rounded-xl bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/30 text-xs font-semibold flex items-center justify-center space-x-2 transition"
          >
            <span>{latestResume ? 'Manage Resume & Skills' : 'Upload Resume PDF'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Recent Interviews History Table */}
      <div className="p-6 rounded-2xl bg-[#121124] border border-[#232043]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-white">Recent Mock Interviews</h3>
            <p className="text-xs text-slate-400">Your score logs and detailed performance feedback</p>
          </div>
          {history.length > 0 && (
            <button
              onClick={() => setCurrentView('history')}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center space-x-1"
            >
              <span>View all</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {loading ? (
          <div className="py-8 text-center text-xs text-slate-500">Loading your interview logs...</div>
        ) : history.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-800/60 mx-auto flex items-center justify-center text-slate-500">
              <Clock className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-slate-300">No mock interviews completed yet</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Take your first interview to generate your comprehensive performance report and earn your certification badge.
            </p>
            <button
              onClick={() => setCurrentView('interview-start')}
              className="mt-2 px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium"
            >
              Take First Mock Interview
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#181730] text-slate-400 uppercase tracking-wider text-[11px] font-semibold">
                <tr>
                  <th className="py-3 px-4 rounded-l-lg">Session Role</th>
                  <th className="py-3 px-4">Mode</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Overall Score</th>
                  <th className="py-3 px-4">Certification</th>
                  <th className="py-3 px-4 rounded-r-lg text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#201e3b]">
                {history.slice(0, 5).map((item) => (
                  <tr key={item._id || item.id} className="hover:bg-white/[0.02] transition">
                    <td className="py-3.5 px-4 font-semibold text-white">
                      {item.role || 'Full Stack Developer'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                        item.mode === 'Voice' ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20' : 'bg-slate-700/30 text-slate-300'
                      }`}>
                        {item.mode || 'Voice'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`font-bold ${
                        item.overallScore >= 75 ? 'text-emerald-400' : item.overallScore >= 60 ? 'text-indigo-400' : 'text-amber-400'
                      }`}>
                        {item.overallScore || 0}%
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {item.certificateBadge?.issued ? (
                        <span className="inline-flex items-center space-x-1 text-emerald-400 text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{item.certificateBadge?.grade || 'Pass'}</span>
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[11px]">Pending</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => viewReport(item._id || item.id)}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white transition font-medium text-[11px]"
                      >
                        View Report
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
