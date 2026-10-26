import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Brain, Mail, Lock, Eye, EyeOff, AlertCircle, Sparkles } from 'lucide-react';

export default function Login({ setCurrentView }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      setCurrentView('dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-5xl rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 bg-[#121124] border border-[#232043] shadow-2xl">
        
        {/* Left Side: Gradient Promo Panel (Matching Slide 8) */}
        <div className="relative p-8 sm:p-12 bg-gradient-to-br from-indigo-700 via-indigo-900 to-[#121124] flex flex-col justify-between overflow-hidden">
          {/* Subtle glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl -z-0" />
          
          <div className="relative z-10">
            {/* Logo */}
            <div className="flex items-center space-x-3 mb-10">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                <Brain className="w-5 h-5 text-indigo-200" />
              </div>
              <span className="font-bold text-xl text-white tracking-wider">Skill Mock</span>
            </div>

            {/* Headline */}
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight mb-4">
              Ace your next <br />interview with AI
            </h2>

            <p className="text-sm text-indigo-100/80 leading-relaxed max-w-sm">
              Upload your resume, input the job description, and get personalized interview questions powered by advanced AI.
            </p>
          </div>

          {/* Stats Bar (Slide 8) */}
          <div className="relative z-10 pt-12 mt-8 border-t border-indigo-400/20 grid grid-cols-3 gap-2">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white">50K+</div>
              <div className="text-[11px] text-indigo-200/80 uppercase font-medium">Questions Generated</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white">12K+</div>
              <div className="text-[11px] text-indigo-200/80 uppercase font-medium">Mock Interviews</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white">87%</div>
              <div className="text-[11px] text-indigo-200/80 uppercase font-medium">Success Rate</div>
            </div>
          </div>
        </div>

        {/* Right Side: Sign In Form (Matching Slide 8) */}
        <div className="p-8 sm:p-12 flex flex-col justify-center bg-[#0e0d1d]">
          <div className="max-w-md w-full mx-auto">
            
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">Welcome back</h3>
            <p className="text-sm text-slate-400 mb-8">Sign in to continue your interview prep</p>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center space-x-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 bg-[#181730] border border-[#2d2a55] rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 bg-[#181730] border border-[#2d2a55] rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-[0.99] text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <span>{loading ? 'Signing in...' : 'Sign In'}</span>
                {!loading && <Sparkles className="w-4 h-4" />}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-xs text-slate-400">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setCurrentView('register')}
                  className="font-medium text-indigo-400 hover:text-indigo-300 transition underline underline-offset-4"
                >
                  Create one free
                </button>
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
