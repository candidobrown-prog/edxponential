import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, Sparkles, Users, Globe, ArrowRight, Star, CheckCircle, Zap, MessageSquare } from 'lucide-react';

const ROLES = ['Teachers', 'Principals', 'Superintendents', 'Coaches', 'Professors', 'Founders', 'Researchers', 'Counselors', 'Designers', 'Mentors'];
const FEATURED = [
  { name: 'Dr. Angela Morris', role: 'Superintendent · Chicago, IL', tag: 'Literacy Leadership', emoji: '🎓', verified: true },
  { name: 'Marcus Johnson', role: 'Principal · Atlanta, GA', tag: 'School Turnaround', emoji: '🏫', verified: true },
  { name: 'Priya Nair', role: 'Curriculum Designer · Austin, TX', tag: 'STEM Innovation', emoji: '📐', verified: false },
  { name: 'Carlos Rivera', role: 'Instructional Coach · LA, CA', tag: 'Classroom Management', emoji: '🤝', verified: true },
  { name: 'Sarah Kim', role: 'Special Ed · NYC, NY', tag: 'IEP Expert', emoji: '💡', verified: false },
  { name: 'James Okafor', role: 'EdTech Founder · Houston, TX', tag: 'AI in Education', emoji: '🚀', verified: true },
];

const STATS = [
  { value: '48K+', label: 'Educators Worldwide' },
  { value: '120+', label: 'Countries Represented' },
  { value: '2,400+', label: 'Communities' },
  { value: '98%', label: 'Match Satisfaction' },
];

const PROMPTS = [
  '"Find me a literacy coach in Texas."',
  '"Find me a principal who turned around a struggling school."',
  '"Find me Montessori educators."',
  '"Find me STEM curriculum designers."',
  '"Find me an instructional coach specializing in math."',
];

export default function WhalleDohHome() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [promptIndex, setPromptIndex] = useState(0);
  const [searchVal, setSearchVal] = useState('');

  useEffect(() => {
    const t1 = setInterval(() => setRoleIndex(i => (i + 1) % ROLES.length), 1800);
    const t2 = setInterval(() => setPromptIndex(i => (i + 1) % PROMPTS.length), 3000);
    return () => { clearInterval(t1); clearInterval(t2); };
  }, []);

  return (
    <div className="min-h-screen bg-[#07080f] text-white" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#07080f]/90 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/whalledoh" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-[#07080f] font-black text-sm">W</span>
            </div>
            <span className="font-black text-white text-lg tracking-tight">WhalleDoh</span>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm text-white/50 font-semibold">
            <Link to="/whalledoh/discover" className="hover:text-white transition-colors">Discover</Link>
            <Link to="/whalledoh/ai" className="hover:text-white transition-colors">WhallAI</Link>
            <Link to="/whalledoh/communities" className="hover:text-white transition-colors">Communities</Link>
            <Link to="/whalledoh/profiles" className="hover:text-white transition-colors">Explore</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/whalledoh/discover" className="text-sm text-white/50 font-bold hover:text-white transition-colors hidden sm:block">Sign In</Link>
            <Link to="/whalledoh/discover" className="bg-white text-[#07080f] font-black text-sm px-4 py-2 rounded-xl hover:bg-gray-100 transition-all">
              Join Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-white/[0.015] rounded-full blur-3xl" />
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 border border-white/10 bg-white/[0.04] rounded-full px-4 py-1.5 mb-8">
          <Sparkles className="w-3 h-3 text-white/40" />
          <span className="text-white/40 text-[11px] tracking-widest uppercase font-black">Part of the edXponential Ecosystem</span>
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-5xl md:text-7xl lg:text-8xl font-black leading-none tracking-tight mb-4">
          Where all<br />educators go.
        </motion.h1>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="text-white/40 text-lg md:text-xl mb-4 flex items-center justify-center gap-2 flex-wrap">
          Find your people. Connect with
          <span className="inline-flex overflow-hidden h-7 relative w-32 items-center">
            <AnimatePresence mode="wait">
              <motion.span key={roleIndex}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35 }}
                className="absolute text-white font-black">
                {ROLES[roleIndex]}
              </motion.span>
            </AnimatePresence>
          </span>
        </motion.div>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          className="text-white/30 text-base max-w-2xl mx-auto mb-10">
          The world's first human and AI-powered educator discovery and collaboration platform. 48,000+ educators. 120+ countries. One ecosystem.
        </motion.p>

        {/* Search bar */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
          className="max-w-2xl mx-auto mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
            <input
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              placeholder='Search educators, roles, expertise...'
              className="w-full bg-white/[0.06] border border-white/10 rounded-2xl pl-12 pr-32 py-4 text-white placeholder-white/25 text-sm focus:outline-none focus:border-white/25 focus:bg-white/[0.08] transition-all"
            />
            <Link to={`/whalledoh/discover${searchVal ? `?q=${encodeURIComponent(searchVal)}` : ''}`}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white text-[#07080f] font-black text-xs px-4 py-2.5 rounded-xl hover:bg-gray-100 transition-all">
              Search
            </Link>
          </div>
        </motion.div>

        {/* CTA buttons */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
          className="flex flex-wrap gap-3 justify-center mb-16">
          <Link to="/whalledoh/ai" className="flex items-center gap-2 bg-white/[0.06] border border-white/10 text-white font-bold text-sm px-5 py-3 rounded-xl hover:bg-white/10 transition-all">
            <Zap className="w-4 h-4" /> Ask WhallAI
          </Link>
          <Link to="/whalledoh/communities" className="flex items-center gap-2 bg-white/[0.06] border border-white/10 text-white font-bold text-sm px-5 py-3 rounded-xl hover:bg-white/10 transition-all">
            <Users className="w-4 h-4" /> Explore Communities
          </Link>
          <Link to="/whalledoh/discover" className="flex items-center gap-2 bg-white/[0.06] border border-white/10 text-white font-bold text-sm px-5 py-3 rounded-xl hover:bg-white/10 transition-all">
            <Globe className="w-4 h-4" /> Find Educators
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {STATS.map(s => (
            <div key={s.label} className="bg-white/[0.03] border border-white/[0.07] rounded-2xl py-4 px-3 text-center">
              <div className="text-2xl font-black text-white mb-1">{s.value}</div>
              <div className="text-white/35 text-xs font-semibold">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* WhallAI preview */}
      <section className="py-20 px-6 border-t border-white/[0.05]">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 border border-white/10 bg-white/[0.04] rounded-full px-3 py-1 mb-5">
                <Zap className="w-3 h-3 text-white/40" />
                <span className="text-white/40 text-[10px] tracking-widest uppercase font-black">WhallAI — Your Discovery Engine</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-4">Find any educator.<br />Anywhere.</h2>
              <p className="text-white/40 text-base leading-relaxed mb-8">WhallAI searches across WhalleDoh profiles, LinkedIn, Instagram, TikTok, YouTube, and more — then drafts a personalized introduction for you.</p>
              <Link to="/whalledoh/ai" className="inline-flex items-center gap-2 bg-white text-[#07080f] font-black px-6 py-3.5 rounded-2xl hover:bg-gray-100 transition-all text-sm">
                Try WhallAI Free <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            {/* Chat preview */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-3xl p-6 space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                  <Zap className="w-3 h-3 text-[#07080f]" />
                </div>
                <span className="text-white/50 text-xs font-black uppercase tracking-wider">WhallAI</span>
              </div>
              {/* Cycling prompt display */}
              <div className="bg-[#07080f] border border-white/[0.06] rounded-2xl px-4 py-3">
                <AnimatePresence mode="wait">
                  <motion.p key={promptIndex}
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.4 }}
                    className="text-white/60 text-sm italic">{PROMPTS[promptIndex]}</motion.p>
                </AnimatePresence>
              </div>
              <div className="bg-white/[0.05] rounded-2xl px-4 py-3 space-y-2">
                <p className="text-white/70 text-sm">Found <span className="text-white font-black">12 matches</span> — here are the top results:</p>
                {['Dr. Angela Morris · Literacy Coach', 'James Carter · Reading Specialist', 'Tanya Powell · Curriculum Director'].map(n => (
                  <div key={n} className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-white/40 flex-shrink-0" />
                    <span className="text-white/50 text-xs font-semibold">{n}</span>
                  </div>
                ))}
              </div>
              <div className="bg-white/[0.04] rounded-2xl px-4 py-3">
                <p className="text-white/50 text-xs"><span className="text-white font-bold">WhallAI:</span> Would you like me to draft an introduction message for Dr. Morris?</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured educators */}
      <section className="py-20 px-6 border-t border-white/[0.05]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-3">Meet brilliant educators.</h2>
            <p className="text-white/35 text-base">A glimpse of who's waiting for you inside WhalleDoh.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURED.map((e, i) => (
              <motion.div key={e.name}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                className="group bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 hover:bg-white/[0.06] hover:border-white/15 transition-all cursor-pointer">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center text-xl flex-shrink-0">{e.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-white font-black text-sm truncate">{e.name}</span>
                      {e.verified && <CheckCircle className="w-3.5 h-3.5 text-white/60 flex-shrink-0" />}
                    </div>
                    <p className="text-white/35 text-xs truncate">{e.role}</p>
                  </div>
                </div>
                <span className="inline-block text-[10px] font-bold text-white/50 border border-white/[0.1] rounded-full px-2.5 py-1">{e.tag}</span>
                <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link to="/whalledoh/discover" className="text-xs font-black text-white/60 hover:text-white flex items-center gap-1">
                    View Profile <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/whalledoh/discover" className="inline-flex items-center gap-2 border border-white/15 text-white/60 font-bold text-sm px-6 py-3 rounded-2xl hover:bg-white/5 hover:text-white transition-all">
              Explore All Educators <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Mission section */}
      <section className="py-24 px-6 border-t border-white/[0.05] text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-white/25 text-sm font-black uppercase tracking-widest mb-6">Our Mission</p>
          <h2 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6">
            The right educator<br />can change everything.
          </h2>
          <p className="text-white/40 text-lg leading-relaxed mb-10">
            No educator should have to grow alone. WhalleDoh exists to break professional isolation, accelerate collaboration, and connect educators across schools, districts, and countries.
          </p>
          <Link to="/whalledoh/discover" className="inline-flex items-center gap-2 bg-white text-[#07080f] font-black px-8 py-4 rounded-2xl hover:bg-gray-100 transition-all shadow-2xl shadow-white/10 text-sm">
            Find Your People <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-white/20 text-xs mt-6">Free to join · No credit card required</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] px-6 py-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
              <span className="text-[#07080f] font-black text-xs">W</span>
            </div>
            <span className="text-white/50 text-sm font-black">WhalleDoh</span>
            <span className="text-white/20 text-xs ml-2">Part of edXponential</span>
          </div>
          <p className="text-white/20 text-xs">"Find your people. Change the world together."</p>
          <p className="text-white/15 text-xs">© 2026 edXponential · All rights reserved</p>
        </div>
      </footer>
    </div>
  );
}