import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Play, Zap, Globe, Users, BarChart3, Award,
  BookOpen, Mic, Video, ChevronRight, ArrowRight, Star,
  Layers, Brain, Wand2, GraduationCap, Building2, Target,
  Infinity, Shield, Cpu
} from 'lucide-react';

const HERO_PHRASES = [
  'Course Creation',
  'Video Generation',
  'Syllabus Building',
  'Curriculum Design',
  'AI Instructional Design',
  'Certification Systems',
  'Learning Ecosystems',
  'Digital Universities',
];

const MODULES = [
  { icon: Brain, label: 'AI Course Builder', desc: 'Generate full courses from a prompt', path: '/classifiedx/builder', color: 'from-white/10 to-white/5' },
  { icon: Video, label: 'Video Studio', desc: 'Avatar-led cinematic video generation', path: '/classifiedx/studio', color: 'from-white/10 to-white/5' },
  { icon: BookOpen, label: 'Syllabus Builder', desc: 'AI-powered syllabus & curriculum', path: '/classifiedx/syllabus', color: 'from-white/10 to-white/5' },
  { icon: Layers, label: 'Course Library', desc: 'Manage & publish your courses', path: '/classifiedx/courses', color: 'from-white/10 to-white/5' },
  { icon: Zap, label: 'Assessments', desc: 'Quizzes, rubrics & certifications', path: '/classifiedx/assessments', color: 'from-white/10 to-white/5' },
  { icon: BarChart3, label: 'Analytics', desc: 'Learning intelligence & insights', path: '/classifiedx/analytics', color: 'from-white/10 to-white/5' },
  { icon: Users, label: 'Students & LMS', desc: 'Enrollments, progress & cohorts', path: '/classifiedx/lms', color: 'from-white/10 to-white/5' },
  { icon: Globe, label: 'Publish & Monetize', desc: 'Sell, subscribe & certify', path: '/classifiedx/publish', color: 'from-white/10 to-white/5' },
];

const CAPABILITIES = [
  { icon: Wand2, label: 'Prompt-to-Course in seconds' },
  { icon: Video, label: 'AI Avatar video generation' },
  { icon: Brain, label: 'Intelligent instructional design' },
  { icon: Mic, label: 'Voice-first creation' },
  { icon: Globe, label: '200+ language translation' },
  { icon: Target, label: 'Adaptive learning pathways' },
  { icon: Award, label: 'Certification systems' },
  { icon: Infinity, label: 'Limitless content types' },
  { icon: Building2, label: 'Enterprise LMS integration' },
  { icon: Cpu, label: 'AI tutor & coaching engine' },
  { icon: Shield, label: 'Enterprise-grade security' },
  { icon: GraduationCap, label: 'Digital university builder' },
];

export default function ClassifiedxHome() {
  const [phraseIdx, setPhraseIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setPhraseIdx(i => (i + 1) % HERO_PHRASES.length), 2600);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 border-b border-white/5 bg-black/80 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-white" />
          <span className="font-black text-lg tracking-tight">Classifiedx™</span>
          <span className="text-[10px] text-white/30 font-black uppercase tracking-widest ml-1 hidden md:block">by edXponential</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/" className="text-xs text-white/40 hover:text-white transition-colors font-bold">← Platform</Link>
          <Link to="/classifiedx/builder" className="flex items-center gap-2 bg-white text-black text-xs font-black px-4 py-2 rounded-full hover:bg-white/90 transition-all">
            <Sparkles className="w-3.5 h-3.5" /> Start Creating
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-24 pb-16 relative">
        {/* Grid bg */}
        <div className="absolute inset-0 opacity-5" style={{backgroundImage:'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)', backgroundSize:'60px 60px'}} />
        {/* Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/3 blur-[120px] pointer-events-none" />

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 border border-white/10 rounded-full px-4 py-1.5 text-[11px] font-black uppercase tracking-widest text-white/50 mb-8">
          <Sparkles className="w-3 h-3" /> The Future of Educational Creation
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
          className="text-6xl md:text-8xl font-black tracking-tighter mb-4 leading-none">
          Classifiedx™
        </motion.h1>

        <div className="h-14 flex items-center justify-center mb-6 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p key={phraseIdx}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="text-2xl md:text-3xl font-black text-white/30 tracking-tight">
              AI-Powered {HERO_PHRASES[phraseIdx]}
            </motion.p>
          </AnimatePresence>
        </div>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="text-base text-white/40 max-w-xl mb-10 leading-relaxed">
          The world's most advanced AI-powered course creation, instructional design, video generation, and educational publishing ecosystem. Build anything. Teach everyone.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-3">
          <Link to="/classifiedx/builder" className="flex items-center gap-2 bg-white text-black font-black px-8 py-4 rounded-full text-sm hover:bg-white/90 transition-all hover:scale-105">
            <Wand2 className="w-4 h-4" /> Start Building with AI
          </Link>
          <Link to="/classifiedx/studio" className="flex items-center gap-2 border border-white/20 text-white font-black px-8 py-4 rounded-full text-sm hover:bg-white/5 transition-all">
            <Play className="w-4 h-4" /> Video Studio
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
          className="flex flex-wrap justify-center gap-8 mt-16 text-center">
          {[['200+', 'Languages'], ['∞', 'Course Types'], ['AI-First', 'Design'], ['Enterprise', 'Grade']].map(([val, label]) => (
            <div key={label}>
              <div className="text-2xl font-black text-white">{val}</div>
              <div className="text-xs text-white/30 font-bold mt-0.5">{label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Modules Grid */}
      <section className="px-6 pb-20 max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-12">
          <h2 className="text-4xl font-black tracking-tight mb-3">The Complete Ecosystem</h2>
          <p className="text-white/30 text-sm">Every tool you need to build, publish, and scale educational excellence.</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {MODULES.map(({ icon: Icon, label, desc, path }, i) => (
            <motion.div key={path} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
              <Link to={path} className="group flex flex-col gap-3 p-5 rounded-2xl border border-white/8 bg-white/3 hover:bg-white/6 hover:border-white/15 transition-all">
                <div className="w-9 h-9 rounded-xl bg-white/8 flex items-center justify-center group-hover:bg-white/15 transition-all">
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="font-black text-sm text-white">{label}</div>
                  <div className="text-[11px] text-white/30 mt-0.5 leading-snug">{desc}</div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-white/20 group-hover:text-white/50 group-hover:translate-x-1 transition-all mt-auto" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Capabilities */}
      <section className="px-6 pb-20 max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="border border-white/8 rounded-3xl p-8 md:p-12 bg-white/2">
          <div className="flex items-center gap-3 mb-8">
            <Cpu className="w-5 h-5 text-white" />
            <h3 className="text-2xl font-black tracking-tight">Built Different</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {CAPABILITIES.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2.5 py-2.5 px-3 rounded-xl bg-white/4 border border-white/5">
                <Icon className="w-3.5 h-3.5 text-white/60 flex-shrink-0" />
                <span className="text-xs font-bold text-white/70">{label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-32 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-white/30 mb-6">
            <Star className="w-3 h-3" /> The Future of Learning Starts Here
          </div>
          <h2 className="text-5xl font-black tracking-tight mb-6">Create something <br /><span className="text-white/30">extraordinary.</span></h2>
          <Link to="/classifiedx/builder" className="inline-flex items-center gap-2 bg-white text-black font-black px-10 py-4 rounded-full text-sm hover:bg-white/90 transition-all hover:scale-105">
            <Sparkles className="w-4 h-4" /> Launch AI Course Builder <ChevronRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </section>
    </div>
  );
}