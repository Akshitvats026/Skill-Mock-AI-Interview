import React from 'react';
import { Brain, Award, Users, BookOpen } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#06050d] border-t border-[#1e1c3a] text-slate-400 py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand Col */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-white text-lg tracking-wider">SKILL MOCK</span>
          </div>
          <p className="text-sm text-slate-400 max-w-md leading-relaxed">
            AI-powered adaptive mock interview platform providing real-time voice and text simulations, dynamic question generation, multi-dimensional NLP evaluation, and instant performance reports.
          </p>
          <div className="text-xs text-indigo-400/80 font-mono">
            Department of Computer Science & Engineering<br />
            IMS Engineering College, Ghaziabad (AKTU Lucknow)
          </div>
        </div>

        {/* Project Details */}
        <div>
          <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-3 flex items-center space-x-1.5">
            <BookOpen className="w-4 h-4 text-indigo-400" />
            <span>Academic Mini Project</span>
          </h4>
          <ul className="text-xs space-y-2 text-slate-400">
            <li><span className="text-slate-300 font-medium">Subject Code:</span> BCC351</li>
            <li><span className="text-slate-300 font-medium">Academic Year:</span> 2025-26</li>
            <li><span className="text-slate-300 font-medium">Supervisor:</span> Ms. Meenu Sharma (Asst. Prof, CSE)</li>
            <li><span className="text-slate-300 font-medium">Evaluation Pillars:</span> 5 Dimensions (NLP)</li>
          </ul>
        </div>

        {/* Team Members */}
        <div>
          <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-3 flex items-center space-x-1.5">
            <Users className="w-4 h-4 text-purple-400" />
            <span>Group No - 17</span>
          </h4>
          <ul className="text-xs space-y-1.5 text-slate-400 font-mono">
            <li>Kamal Dube (2401430100169)</li>
            <li>Prakhar Tyagi (2401430100150)</li>
            <li>Aditya Kumar Singh (2401430100022)</li>
            <li>Nikhil Kumar (2401430100154)</li>
            <li>Anurag Kumar Yadav (2401430100056)</li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-[#1a1832] flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
        <p>© 2025-2026 Skill Mock - All Rights Reserved.</p>
        <p className="mt-2 sm:mt-0">Built with React, Node.js, Express, MongoDB & Gemini AI</p>
      </div>
    </footer>
  );
}
