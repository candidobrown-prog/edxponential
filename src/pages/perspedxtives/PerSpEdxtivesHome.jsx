import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, Shield, Target, Clock, Calendar, FileText, Sparkles, ArrowRight, Users, CheckCircle } from 'lucide-react';

const FEATURES = [
  { icon: Users, label: 'Student Profiles', desc: 'Full IEP caseload management with disability classification, services, and compliance tracking.' },
  { icon: FileText, label: 'IEP Manager', desc: 'Upload, review, and AI-analyze IEP documents with compliance scoring.' },
  { icon: Target, label: 'Goal Monitoring', desc: 'SMART goal tracking with progress data, benchmarks, and AI goal generation.' },
  { icon: Clock, label: 'Service Delivery', desc: 'Track required vs. delivered service minutes with provider scheduling.' },
  { icon: Calendar, label: 'Meeting Management', desc: 'Schedule IEP meetings with AI-generated IDEA-compliant agendas.' },
  { icon: Shield, label: 'Compliance Engine', desc: 'Real-time IDEA compliance monitoring with automated alerts and reports.' },
  { icon: Sparkles, label: 'AI IEP Generator', desc: 'Generate full, legally-compliant IEPs using advanced AI in minutes.' },
  { icon: Brain, label: 'Intelligence Dashboard', desc: 'Real-time compliance scores, service analytics, and executive insights.' },
];

export default function PerSpEdxtivesHome() {
  return (
    <div className="min-h-screen bg-[#020205] text-white">
      {/* Nav */}
      <nav className="border-b border-white/5 px-8 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center">
            <Brain className="w-3.5 h-3.5 text-black" />
          </div>
          <span className="font-black text-sm">PerSpEdxtives™</span>
        </div>
        <Link to="/perspedxtives"
          className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-xl text-xs font-black hover:bg-white/90 transition-all">
          Open Dashboard <ArrowRight className="w-3 h-3" />
        </Link>
      </nav>

      {/* Hero */}
      <section className="px-8 pt-20 pb-16 max-w-5xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-8">
            <Shield className="w-3.5 h-3.5 text-white/50" />
            <span className="text-xs font-bold text-white/50 uppercase tracking-widest">AI-Powered Special Education OS</span>
          </div>
          <h1 className="text-6xl font-black text-white mb-4 tracking-tight">
            PerSpEdxtives™
          </h1>
          <p className="text-xl text-white/40 max-w-2xl mx-auto leading-relaxed mb-10">
            The complete AI-powered Special Education operating system. Manage IEPs, track services, monitor compliance, and generate goals — all in one place.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/perspedxtives"
              className="flex items-center gap-2 bg-white text-black px-8 py-3.5 rounded-xl font-black text-sm hover:bg-white/90 transition-all">
              Enter PerSpEdxtives™ <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="px-8 pb-20 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map(({ icon: Icon, label, desc }, i) => (
            <motion.div key={label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/8 transition-all">
              <Icon className="w-5 h-5 text-white/40 mb-3" />
              <p className="font-black text-sm text-white mb-1">{label}</p>
              <p className="text-xs text-white/30 leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}