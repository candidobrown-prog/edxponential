import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, ChevronRight, GraduationCap, Sparkles, Globe, FileText,
  Users, BarChart3, Shield, Target, BookOpen, Building2,
  Layers, Brain, ArrowRight, CheckCircle2, Star, Play
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const HERO_PHRASES = [
  'Charter Schools.',
  'Independent Schools.',
  'Microschools.',
  'Private Academies.',
  'Hybrid Schools.',
  'Online Schools.',
  'School Systems.',
];

const MODULES = [
  { icon: Brain, label: 'AI School Builder', desc: 'Concept to approval', path: '/foundaitionx/builder', accent: 'from-white/10 to-white/5' },
  { icon: FileText, label: 'Charter Application', desc: 'Full AI-generated apps', path: '/foundaitionx/application', accent: 'from-white/10 to-white/5' },
  { icon: Users, label: 'BoaredX™', desc: 'Board recruitment engine', path: '/foundaitionx/boaredx', accent: 'from-white/10 to-white/5' },
  { icon: BookOpen, label: 'Policies & Handbooks', desc: 'Complete document suite', path: '/foundaitionx/documents', accent: 'from-white/10 to-white/5' },
  { icon: BarChart3, label: 'Financial Systems', desc: 'Budgets & projections', path: '/foundaitionx/finance', accent: 'from-white/10 to-white/5' },
  { icon: Target, label: 'Academic Model', desc: 'Curriculum & assessment', path: '/foundaitionx/academic', accent: 'from-white/10 to-white/5' },
  { icon: Shield, label: 'Compliance Engine', desc: 'Regulatory alignment', path: '/foundaitionx/compliance', accent: 'from-white/10 to-white/5' },
  { icon: Globe, label: 'Strategic Plans', desc: 'Growth & implementation', path: '/foundaitionx/strategy', accent: 'from-white/10 to-white/5' },
  { icon: Building2, label: 'Operations', desc: 'Full operational systems', path: '/foundaitionx/operations', accent: 'from-white/10 to-white/5' },
  { icon: Layers, label: 'Governance', desc: 'Board & accountability', path: '/foundaitionx/governance', accent: 'from-white/10 to-white/5' },
];

const STATS = [
  { value: '10,000+', label: 'Pages Generated' },
  { value: '40+', label: 'School Systems Built' },
  { value: '97%', label: 'AI Accuracy Rate' },
  { value: '200+', label: 'Documents Created' },
];

export default function FoundaitionxHome() {
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setPhraseIndex(i => (i + 1) % HERO_PHRASES.length), 2200);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 border-b border-white/5 bg-black/80 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-white rounded-md flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-black" />
          </div>
          <span className="font-black text-white text-sm tracking-tight">Foundaitionx™</span>
          <span className="text-[10px] font-black text-white/20 border border-white/10 px-1.5 py-0.5 rounded-full">by edXponential</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/foundaitionx/builder">
            <Button className="bg-white text-black font-black text-xs hover:bg-white/90 rounded-full px-5">
              Start Building <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="pt-32 pb-20 px-8 text-center relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-white/3 rounded-full blur-3xl" />
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10">
          <div className="inline-flex items-center gap-2 border border-white/10 rounded-full px-4 py-1.5 mb-8 text-[11px] font-black text-white/40">
            <Zap className="w-3 h-3" />
            World's Most Advanced AI School Creation Platform
          </div>
          <h1 className="text-5xl md:text-7xl font-black leading-none mb-4 tracking-tight">
            Build Your School.<br />
            <span className="text-white/25">The AI Way.</span>
          </h1>
          <div className="h-14 flex items-center justify-center mb-6">
            <AnimatePresence mode="wait">
              <motion.span
                key={phraseIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-2xl md:text-3xl font-black text-white/50"
              >
                {HERO_PHRASES[phraseIndex]}
              </motion.span>
            </AnimatePresence>
          </div>
          <p className="text-base text-white/30 max-w-2xl mx-auto mb-10 leading-relaxed">
            From vision to approved school — Foundaitionx™ is the world's most advanced AI-powered 
            charter school creation, governance, and operational-planning ecosystem.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link to="/foundaitionx/builder">
              <Button className="bg-white text-black font-black text-sm hover:bg-white/90 rounded-full px-8 h-11">
                <Brain className="w-4 h-4" /> Launch AI Builder
              </Button>
            </Link>
            <Link to="/foundaitionx/boaredx">
              <Button variant="outline" className="border-white/20 text-white font-black text-sm hover:bg-white/5 rounded-full px-8 h-11">
                <Users className="w-4 h-4" /> BoaredX™
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px border-t border-b border-white/5 mx-8 mb-20">
        {STATS.map(({ value, label }) => (
          <div key={label} className="py-8 text-center">
            <div className="font-black text-2xl text-white mb-1">{value}</div>
            <div className="text-xs text-white/25">{label}</div>
          </div>
        ))}
      </div>

      {/* Modules Grid */}
      <div className="px-8 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-white mb-3">Complete School Creation Ecosystem</h2>
          <p className="text-white/30 text-sm">Every system your school needs, powered by AI</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 max-w-5xl mx-auto">
          {MODULES.map(({ icon: Icon, label, desc, path }, i) => (
            <motion.div key={label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Link to={path} className="block group">
                <div className="border border-white/8 rounded-2xl p-4 bg-gradient-to-br from-white/3 to-transparent hover:border-white/20 hover:bg-white/5 transition-all h-full">
                  <div className="w-8 h-8 rounded-xl bg-white/8 flex items-center justify-center mb-3 group-hover:bg-white/12 transition-all">
                    <Icon className="w-4 h-4 text-white/50" />
                  </div>
                  <div className="font-black text-xs text-white/80 mb-1">{label}</div>
                  <div className="text-[10px] text-white/25">{desc}</div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* AI Power Section */}
      <div className="px-8 pb-20 max-w-4xl mx-auto">
        <div className="border border-white/8 rounded-3xl p-10 bg-white/2 text-center">
          <Sparkles className="w-8 h-8 text-white/30 mx-auto mb-4" />
          <h3 className="text-2xl font-black text-white mb-3">McKinsey + Harvard GSE + Y Combinator</h3>
          <p className="text-white/30 text-sm max-w-lg mx-auto mb-6">
            Foundaitionx™ combines elite consulting frameworks, graduate-level education strategy, 
            and startup-speed execution — powered entirely by AI.
          </p>
          <div className="grid grid-cols-3 gap-4 text-left">
            {[
              { icon: Star, title: 'Elite Frameworks', desc: 'McKinsey & Bain-grade strategic planning' },
              { icon: Brain, title: 'AI-First', desc: 'Every section generated by advanced AI' },
              { icon: CheckCircle2, title: 'Approval-Optimized', desc: 'Built to pass charter review panels' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-2">
                <Icon className="w-4 h-4 text-white/30 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-xs font-black text-white/70">{title}</div>
                  <div className="text-[10px] text-white/25">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-white/5 px-8 py-6 text-center text-xs text-white/20">
        Foundaitionx™ is part of the edXponential ecosystem
      </div>
    </div>
  );
}