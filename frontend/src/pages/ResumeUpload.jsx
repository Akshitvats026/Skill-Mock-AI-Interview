import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Sparkles, ArrowRight, Brain, Briefcase } from 'lucide-react';

export default function ResumeUpload({ setCurrentView, setSelectedResumeId }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [currentResume, setCurrentResume] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await api.get('/resume/latest');
        if (res.data.success && res.data.resume) {
          setCurrentResume(res.data.resume);
          if (setSelectedResumeId) {
            setSelectedResumeId(res.data.resume._id || res.data.resume.id);
          }
        }
      } catch (err) {
        console.error('Error fetching resume:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLatest();
  }, [setSelectedResumeId]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError('');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a PDF resume file.');
      return;
    }

    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const res = await api.post('/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        setCurrentResume(res.data.resume);
        if (setSelectedResumeId) {
          setSelectedResumeId(res.data.resume._id || res.data.resume.id);
        }
        setFile(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to upload and parse resume.');
    } finally {
      setUploading(false);
    }
  };

  const startInterviewWithResume = () => {
    if (currentResume && setSelectedResumeId) {
      setSelectedResumeId(currentResume._id || currentResume.id);
    }
    setCurrentView('interview-start');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-medium mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Multimodal Resume Intelligence</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Resume Parsing & Skill Extraction</h1>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl">
          Upload your resume in PDF format. Our NLP parser automatically extracts technical skills, past projects, and domain experience to personalize your interview simulation.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center space-x-2.5">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Upload Box */}
      <div className="p-8 rounded-3xl bg-[#121124] border-2 border-dashed border-[#2f2b5c] hover:border-indigo-500/60 transition text-center">
        <input
          type="file"
          id="resume-file"
          accept=".pdf,.docx,.txt"
          onChange={handleFileChange}
          className="hidden"
        />
        <label
          htmlFor="resume-file"
          className="cursor-pointer flex flex-col items-center justify-center space-y-4"
        >
          <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <UploadCloud className="w-8 h-8" />
          </div>
          <div>
            <p className="text-base font-semibold text-white">
              {file ? file.name : 'Click to select or drag and drop your resume'}
            </p>
            <p className="text-xs text-slate-400 mt-1">PDF, DOCX or TXT (up to 10MB)</p>
          </div>
        </label>

        {file && (
          <div className="mt-6 flex items-center justify-center space-x-3">
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition disabled:opacity-50 flex items-center space-x-2"
            >
              <span>{uploading ? 'Analyzing Resume...' : 'Parse Resume Now'}</span>
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Extracted Details & Insights */}
      {currentResume && (
        <div className="p-8 rounded-3xl bg-[#121124] border border-[#232043] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#232043] gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{currentResume.originalName}</h3>
                <p className="text-xs text-slate-400">
                  Uploaded on {new Date(currentResume.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <button
              onClick={startInterviewWithResume}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 flex items-center space-x-2 transition"
            >
              <span>Practice Questions for this Resume</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Detected Domain */}
            <div className="p-5 rounded-2xl bg-[#181730] border border-[#2d2a55]">
              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                <Briefcase className="w-4 h-4 text-indigo-400" />
                <span>Detected Domain</span>
              </div>
              <div className="text-lg font-bold text-indigo-300">
                {currentResume.parsedData?.detectedDomain || 'Full Stack Development'}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Interview questions will be calibrated to this specialization.
              </p>
            </div>

            {/* Extracted Skills */}
            <div className="p-5 rounded-2xl bg-[#181730] border border-[#2d2a55]">
              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                <Brain className="w-4 h-4 text-purple-400" />
                <span>Extracted Technical Skills</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {(currentResume.parsedData?.skills || ['JavaScript', 'React', 'Node.js', 'SQL']).map((sk, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-medium"
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Highlighted Projects */}
          <div className="p-5 rounded-2xl bg-[#181730] border border-[#2d2a55]">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Extracted Projects & Highlights
            </h4>
            <div className="space-y-2">
              {(currentResume.parsedData?.projects || ['Full-stack Web Application']).map((p, idx) => (
                <div key={idx} className="flex items-start space-x-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{p}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
