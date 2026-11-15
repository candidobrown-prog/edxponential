import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import {
  School, FileText, Calendar, Target, BarChart3, Users,
  TrendingUp, ArrowRight, Sparkles, CheckCircle, Clock, AlertCircle,
  BookOpen, Zap
} from 'lucide-react';

const SECTIONS = [
  {
    path: '/goaled/my-xschool',
    icon: School,
    label: 'My Xschool',
    tag: 'EXECUTIVE PROFILE',
    desc: "Your school's command center — mission, vision, leadership, enrollment, goals.",
    color: 'bg-[#0a0f1e]',
    textColor: 'text-white',
    tagColor: 'text-white/30',
    descColor: 'text-white/50',
  },
  {
    path: '/goaled/xschinfo',
    icon: FileText,
    label: 'Xschinfo',
    tag: 'INTELLIGENCE HUB',
    desc: 'Centralized AI-powered document management, policy library, and school intelligence.',
    color: 'bg-white border border-gray-100',
    textColor: 'text-[#0a0f1e]',
    tagColor: 'text-gray-400',
    descColor: 'text-gray-400',
  },
  {
    path: '/goaled/master-xschedule',
    icon: Calendar,
    label: 'Master Xschedule',
    tag: 'AI SCHEDULING ENGINE',
    desc: 'Build, generate, and optimize your school-wide master schedule with AI.',
    color: 'bg-white border border-gray-100',
    textColor: 'text-[#0a0f1e]',
    tagColor: 'text-gray-400',
    descColor: 'text-gray-400',
  },
  {
    path: '/goaled/xschmart-goalx',
    icon: Target,
    label: 'Xschmart Goalx',
    tag: 'GOAL ACCOUNTABILITY',
    desc: 'AI-powered SMART goal setting, ownership tracking, and performance accountability.',
    color: 'bg-white border border-gray-100',
    textColor: 'text-[#0a0f1e]',
    tagColor: 'text-gray-400',
    descColor: 'text-gray-400',
  },
  {
    path: '/goaled/master-calendar',
    icon: Calendar,
    label: 'Master Calendar',
    tag: 'CALENDAR COMMAND',
    desc: 'AI-powered school calendar — upload, generate, sync, and export.',
    color: 'bg-white border border-gray-100',
    textColor: 'text-[#0a0f1e]',
    tagColor: 'text-gray-400',
    descColor: 'text-gray-400',
  },
  {
    path: '/goaled/scores',
    icon: BarChart3,
    label: 'Scores',
    tag: 'ACADEMIC INTELLIGENCE',
    desc: 'Upload, analyze, and act on assessment data across grades, teachers, and subgroups.',
    color: 'bg-white border border-gray-100',
    textColor: 'text-[#0a0f1e]',
    tagColor: 'text-gray-400',
    descColor: 'text-gray-400',
  },
  {
    path: '/goaled/performintx',
    icon: Users,
    label: 'Performintx™',
    tag: 'PEOPLE PERFORMANCE',
    desc: 'Every staff member, every goal, every deadline — one intelligent dashboard.',
    color: 'bg-white border border-gray-100',
    textColor: 'text-[#0a0f1e]',
    tagColor: 'text-gray-400',
    descColor: 'text-gray-400',
  },
];

export default function GoaledXschoolHome() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-[#f8f8f8]" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Hero */}
      <div className="bg-[#0a0f1e] px-8 py-14">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em] mb-3">edXponential — School Intelligence</p>
            <h1 className="text-4xl md:text-5xl font-black text-white leading-none tracking-tight">
              Goaled Xschool™
            </h1>
            <p className="text-white/40 mt-3 text-base max-w-xl">
              The AI-powered executive operating system for school founders, principals, and leadership teams.
            </p>
            <div className="flex items-center gap-6 mt-6">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-white/30" />
                <span className="text-white/30 text-xs font-black uppercase tracking-widest">AI-First</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-white/30" />
                <span className="text-white/30 text-xs font-black uppercase tracking-widest">Executive-Grade</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-white/30" />
                <span className="text-white/30 text-xs font-black uppercase tracking-widest">Operational Intelligence</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Sections Grid */}
      <div className="max-w-6xl mx-auto px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SECTIONS.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.path}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
              >
                <Link to={s.path}
                  className={`block rounded-2xl p-6 hover:shadow-xl hover:scale-[1.01] transition-all duration-200 group ${s.color}`}>
                  <div className={`flex items-center justify-between mb-4`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color.includes('0a0f1e') ? 'bg-white/10' : 'bg-gray-100'}`}>
                      <Icon className={`w-5 h-5 ${s.textColor}`} />
                    </div>
                    <ArrowRight className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity ${s.textColor}`} />
                  </div>
                  <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${s.tagColor}`}>{s.tag}</p>
                  <h3 className={`text-lg font-black ${s.textColor}`}>{s.label}</h3>
                  <p className={`text-xs mt-1.5 leading-relaxed ${s.descColor}`}>{s.desc}</p>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* XIP Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="mt-6 bg-gradient-to-r from-[#0a0f1e] to-[#1a2540] rounded-2xl p-8 flex items-center justify-between flex-wrap gap-4"
        >
          <div>
            <p className="text-white/30 text-[10px] font-black uppercase tracking-widest mb-1">AI AutoGenerate</p>
            <h3 className="text-xl font-black text-white">Xschool Improvement Plan (XIP)</h3>
            <p className="text-white/40 text-sm mt-1">Complete Xschmart Goalx + Performintx™ to unlock AI-generated XIP.</p>
          </div>
          <Link to="/goaled/xschmart-goalx"
            className="flex items-center gap-2 px-6 py-3 bg-white text-[#0a0f1e] rounded-xl font-black text-sm hover:bg-gray-100 transition-all whitespace-nowrap">
            <Sparkles className="w-4 h-4" /> Start with Xschmart Goalx
          </Link>
        </motion.div>
      </div>
    </div>
  );
}