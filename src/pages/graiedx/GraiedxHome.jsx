import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, BarChart3, Mic, FileText, Bell, Users, BookOpen, ClipboardList, Star, MessageSquare, ArrowRight, Zap, Shield, Brain } from 'lucide-react';

const FEATURES = [
  { icon: ClipboardList, label: 'AI Gradebook', desc: 'Spreadsheet-style digital gradebook with auto-calculation, weighted categories, and bulk grade entry.', color: 'bg-black' },
  { icon: Mic, label: 'Voice Grading', desc: 'Speak to grade — "John scored 85 on the quiz" and it auto-enters instantly.', color: 'bg-black' },
  { icon: FileText, label: 'Report Engine', desc: 'AI-generated progress reports, report cards, and academic summaries in seconds.', color: 'bg-black' },
  { icon: Bell, label: 'Smart Alerts', desc: 'Automatic alerts for failing students, missing work, and performance drops.', color: 'bg-black' },
  { icon: BarChart3, label: 'AI Analytics', desc: 'Predictive forecasting, standards mastery tracking, and growth trend analysis.', color: 'bg-black' },
  { icon: MessageSquare, label: 'Family Portal', desc: 'Secure parent access to grades, reports, alerts, and teacher communication.', color: 'bg-black' },
  { icon: Star, label: 'Standards Mastery', desc: 'Align grades to standards, track mastery, and identify learning gaps by student.', color: 'bg-black' },
  { icon: Users, label: 'Class Management', desc: 'Multi-class, multi-section, multi-period management with school-wide visibility.', color: 'bg-black' },
];

const STATS = [
  { value: '∞', label: 'Students Supported' },
  { value: 'AI', label: 'Powered Insights' },
  { value: '0s', label: 'Report Generation' },
  { value: '100%', label: 'FERPA Aware' },
];

export default function GraiedxHome() {
  return (
    <div className="min-h-screen bg-[#020205] text-white">
      {/* Nav */}
      <nav className="border-b border-white/5 px-8 h-14 flex items-center justify-between sticky top-0 bg-[#020205]/95 backdrop-blur z-10">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center">
            <GraduationCap className="w-3.5 h-3.5 text-black" />
          </div>
          <div>
            <span className="font-black text-sm text-white">Graiedx™</span>
            <span className="ml-2 text-[9px] font-black text-white/20 uppercase tracking-widest">AI Gradebook OS</span>
          </div>
        </div>
        <Link to="/graiedx" className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-xl text-xs font-black hover:bg-white/90 transition-all">
          Enter Dashboard <ArrowRight className="w-3 h-3" />
        </Link>
      </nav>

      {/* Hero */}
      <section className="px-8 pt-24 pb-20 max-w-6xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-8">
            <Zap className="w-3.5 h-3.5 text-white/40" />
            <span className="text-xs font-black text-white/40 uppercase tracking-widest">Next-Generation Academic Intelligence</span>
          </div>
          <h1 className="text-7xl font-black text-white mb-4 tracking-tighter leading-none">Graiedx™</h1>
          <p className="text-2xl font-black text-white/20 mb-6 tracking-tight">The AI-Powered Grading & Academic<br />Performance Operating System</p>
          <p className="text-base text-white/40 max-w-2xl mx-auto leading-relaxed mb-12">
            One intelligent platform for grading, reporting, standards mastery, family communication, 
            AI analytics, and academic performance management — built for schools that demand excellence.
          </p>

          <div className="flex items-center justify-center gap-4 mb-16">
            <Link to="/graiedx" className="flex items-center gap-2 bg-white text-black px-8 py-4 rounded-xl font-black text-sm hover:bg-white/90 transition-all">
              Open Graiedx™ <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
            {STATS.map(({ value, label }) => (
              <div key={label} className="bg-white/5 border border-white/5 rounded-2xl p-4">
                <p className="text-2xl font-black text-white">{value}</p>
                <p className="text-[10px] font-black text-white/30 uppercase tracking-wider mt-1">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="px-8 pb-24 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs font-black text-white/20 uppercase tracking-widest mb-2">What's Inside</p>
          <h2 className="text-3xl font-black text-white">Everything Your School Needs</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map(({ icon: Icon, label, desc }, i) => (
            <motion.div key={label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-white/5 border border-white/8 rounded-2xl p-5 hover:bg-white/8 transition-all group">
              <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center mb-3 group-hover:bg-white/15 transition-all">
                <Icon className="w-4 h-4 text-white/70" />
              </div>
              <p className="font-black text-sm text-white mb-1.5">{label}</p>
              <p className="text-xs text-white/30 leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}