import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Brain, BarChart3, Shield, Zap, Globe, ArrowRight, Database,
  TrendingUp, AlertTriangle, Users, FileText, Sparkles, Eye,
  Lock, Activity, Target, ChevronRight
} from 'lucide-react';

const FEATURES = [
  { icon: Brain, title: 'AI Executive Intelligence', desc: 'Real-time AI analysis of all school data with executive-grade insights and forecasting.' },
  { icon: Database, title: 'Centralized Data Warehouse', desc: 'Every platform system syncs automatically into one unified intelligence layer.' },
  { icon: BarChart3, title: 'Visual Analytics Engine', desc: 'Beautiful charts, heat maps, trend graphs, and interactive drill-down dashboards.' },
  { icon: AlertTriangle, title: 'Predictive Alerts', desc: 'AI flags risks before they become problems — attendance, compliance, goals, services.' },
  { icon: FileText, title: 'Report Generation', desc: 'One-click executive, board, academic, SPED, and compliance reports with AI narratives.' },
  { icon: Shield, title: 'FERPA-Compliant Security', desc: 'Role-based access, audit logs, encrypted data, and enterprise-grade compliance.' },
  { icon: TrendingUp, title: 'Predictive Forecasting', desc: 'AI models project student outcomes, attendance trends, and compliance risks weeks ahead.' },
  { icon: Globe, title: 'Cross-Platform Sync', desc: 'All edXponential systems — Goaled Xschool™, PerSpEdxtives™, Xschores™ — unified here.' },
];

const SYSTEMS = [
  'Goaled Xschool™', 'PerSpEdxtives™', 'Xschores™', 'Master Xschedule',
  'Xschmart Goalx', 'Performintx™', 'Master Calendar', 'TwotrX',
  'edXportante', 'TubedX™', 'OneJob', 'Deal Room',
];

const STATS = [
  { label: 'Platform Systems', value: '12+' },
  { label: 'Data Points Tracked', value: '500+' },
  { label: 'AI Insights/Day', value: '∞' },
  { label: 'Compliance Areas', value: '50+' },
];

export default function DaidaBaixedHome() {
  const [tick, setTick] = useState(0);
  useEffect(() => { const t = setInterval(() => setTick(x => x + 1), 2000); return () => clearInterval(t); }, []);

  return (
    <div className="min-h-screen bg-[#020205] text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#020205]/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center">
              <Brain className="w-4 h-4 text-black" />
            </div>
            <div>
              <span className="font-black text-white text-sm tracking-tight">Daida Baixed™</span>
              <div className="text-[9px] text-white/30 font-bold uppercase tracking-widest leading-none">by edXponential</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-white/40 hover:text-white text-xs font-bold transition-colors">Platform</Link>
            <Link to="/daida-baixed"
              className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-xl text-xs font-black hover:bg-white/90 transition-all">
              Enter Dashboard <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 mb-8">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-xs font-bold text-white/60 uppercase tracking-widest">AI-Powered Education Intelligence</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tight leading-none mb-6">
              Daida<br /><span className="text-white/20">Baixed™</span>
            </h1>
            <p className="text-xl text-white/40 max-w-2xl mx-auto leading-relaxed mb-10">
              The centralized AI-powered data intelligence warehouse, analytics ecosystem, and executive command center for the entire edXponential platform.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/daida-baixed"
                className="flex items-center gap-3 bg-white text-black px-8 py-4 rounded-2xl font-black text-sm hover:bg-white/90 transition-all group">
                Open Intelligence Center
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="flex items-center gap-2 text-white/40 hover:text-white px-6 py-4 rounded-2xl text-sm font-bold transition-colors border border-white/10 hover:border-white/20">
                <Eye className="w-4 h-4" /> Watch Overview
              </button>
            </div>
          </motion.div>

          {/* Stats Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 max-w-3xl mx-auto">
            {STATS.map(({ label, value }) => (
              <div key={label} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <div className="text-3xl font-black text-white">{value}</div>
                <div className="text-xs text-white/30 font-bold uppercase tracking-wider mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Sync Strip */}
      <section className="py-8 border-y border-white/5 overflow-hidden">
        <div className="flex items-center gap-3 mb-3 px-6">
          <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="text-xs font-black text-white/30 uppercase tracking-widest">Live System Sync</span>
        </div>
        <div className="flex gap-3 px-6 flex-wrap">
          {SYSTEMS.map((s, i) => (
            <motion.div key={s} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
              className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1.5">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" style={{ animationDelay: `${i * 200}ms` }} />
              <span className="text-xs text-white/50 font-bold">{s}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-black text-white/30 uppercase tracking-widest mb-4">Platform Capabilities</p>
            <h2 className="text-4xl font-black text-white">The Brain of the Platform</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map(({ icon: Icon, title, desc }, i) => (
              <motion.div key={title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/8 hover:border-white/20 transition-all group">
                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-white/15 transition-all">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-black text-sm text-white mb-2">{title}</h3>
                <p className="text-xs text-white/40 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-12">
            <Brain className="w-12 h-12 text-white/20 mx-auto mb-6" />
            <h2 className="text-4xl font-black text-white mb-4">Your School's Intelligence Center Awaits</h2>
            <p className="text-white/40 mb-8">Open Daida Baixed™ and see your entire school ecosystem from one unified command center.</p>
            <Link to="/daida-baixed"
              className="inline-flex items-center gap-3 bg-white text-black px-10 py-4 rounded-2xl font-black hover:bg-white/90 transition-all">
              Launch Daida Baixed™ <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}