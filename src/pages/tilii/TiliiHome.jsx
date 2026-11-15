import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Play, Zap, Users, Globe, ArrowRight, Star, CheckCircle, Sparkles, Radio, BookOpen, Mic } from 'lucide-react';
import EdxTooltip from '@/components/platform/EdxTooltip';
import { TOOLTIP } from '@/lib/tooltipData';

const NAV_TOOLTIPS = {
  discover: TOOLTIP.tiliiDiscover,
  channels: TOOLTIP.tiliiChannels,
  live: TOOLTIP.tiliiLive,
  masterclasses: TOOLTIP.tiliiMasterclasses,
  studio: TOOLTIP.tiliiStudio,
};

const HERO_TITLES = ['Watch What\'s Next.', 'Learn Without Limits.', 'Watch Your Future Unfold.'];
const CATEGORIES = ['Education', 'Leadership', 'Wellness', 'Entrepreneurship', 'AI & Tech', 'Storytelling', 'Coaching', 'Culture'];

const FEATURED = [
  { title: 'The Future of AI in Education', creator: 'Dr. Marcus Webb', type: 'Masterclass', duration: '48 min', thumb: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&q=80&auto=format', locked: true },
  { title: 'Leading Schools Through Crisis', creator: 'Principal K. Adeyemi', type: 'Documentary', duration: '1h 12min', thumb: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80&auto=format', locked: true },
  { title: 'Building a Culture of Excellence', creator: 'edXponential Studio', type: 'Series', duration: '6 Episodes', thumb: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&q=80&auto=format', locked: false },
  { title: 'Literacy Revolution', creator: 'Dr. Amara Nwosu', type: 'Talk', duration: '22 min', thumb: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80&auto=format', locked: true },
  { title: 'The Founder\'s Blueprint', creator: 'James Okafor', type: 'Masterclass', duration: '3h 20min', thumb: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&q=80&auto=format', locked: true },
  { title: 'Mindful Leadership', creator: 'Priya Nair', type: 'Series', duration: '8 Episodes', thumb: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&q=80&auto=format', locked: true },
];

const STATS = [
  { value: '120K+', label: 'Creators' },
  { value: '3.2M+', label: 'Videos' },
  { value: '190+', label: 'Countries' },
  { value: '99%', label: 'Satisfaction' },
];

const FEATURES = [
  { icon: Zap, label: 'AI Discovery', desc: 'Personalized content that learns what drives you' },
  { icon: BookOpen, label: 'Masterclasses', desc: 'World-class educators. World-class content.' },
  { icon: Radio, label: 'Live Streaming', desc: 'Real-time learning from the best in education' },
  { icon: Mic, label: 'Creator Studio', desc: 'Build your channel, audience, and revenue' },
  { icon: Users, label: 'Communities', desc: 'Learn alongside the world\'s greatest educators' },
  { icon: Globe, label: 'AI Dubbing', desc: 'Every video in your language, instantly' },
];

export default function TiliiHome() {
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setHeroIndex(i => (i + 1) % HERO_TITLES.length), 3800);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen bg-[#080808] text-white" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#080808]/90 backdrop-blur-xl border-b border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/tilii" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <Play className="w-4 h-4 text-[#080808] fill-[#080808]" />
            </div>
            <span className="font-black text-white text-lg tracking-tight">TiliiVisxion</span>
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm text-white/40 font-semibold">
            {['Discover', 'Channels', 'Live', 'Masterclasses', 'Studio'].map(l => (
              <EdxTooltip key={l} data={NAV_TOOLTIPS[l.toLowerCase()]} delay={400}>
                <Link to={`/tilii/${l.toLowerCase()}`} className="hover:text-white transition-colors">{l}</Link>
              </EdxTooltip>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Link to="/tilii/watch" className="text-sm text-white/40 font-bold hover:text-white transition-colors hidden sm:block">Sign In</Link>
            <Link to="/tilii/watch" className="bg-white text-[#080808] font-black text-sm px-4 py-2 rounded-xl hover:bg-zinc-100 transition-all">
              Start Free Trial
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1800&q=80&auto=format"
            alt="" className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#080808]/60 via-[#080808]/40 to-[#080808]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080808]/80 via-transparent to-[#080808]/80" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto pt-20">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 border border-white/10 bg-white/[0.04] rounded-full px-4 py-1.5 mb-10">
            <Sparkles className="w-3 h-3 text-white/40" />
            <span className="text-white/40 text-[11px] tracking-widest uppercase font-black">Part of the edXponential Ecosystem</span>
          </motion.div>

          <div className="h-20 md:h-28 flex items-center justify-center mb-4 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.h1 key={heroIndex}
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="text-5xl md:text-7xl lg:text-8xl font-black leading-none tracking-tight text-center absolute">
                {HERO_TITLES[heroIndex]}
              </motion.h1>
            </AnimatePresence>
          </div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="text-white/45 text-base md:text-xl max-w-2xl mx-auto mb-3 mt-6">
            The world's first human and AI-powered video platform for learning, leadership, storytelling, innovation, and human potential.
          </motion.p>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            className="text-white/25 text-sm font-black uppercase tracking-widest mb-12">
            This isn't content. It's transformation.
          </motion.p>

          {/* CTA */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
            className="flex flex-wrap gap-3 justify-center mb-16">
            <Link to="/tilii/watch" className="flex items-center gap-2 bg-white text-[#080808] font-black px-7 py-4 rounded-2xl hover:bg-zinc-100 transition-all shadow-2xl shadow-white/10 text-sm">
              <Play className="w-4 h-4 fill-current" /> Start Watching
            </Link>
            <Link to="/tilii/discover" className="flex items-center gap-2 border border-white/15 text-white font-bold px-7 py-4 rounded-2xl hover:bg-white/5 transition-all text-sm">
              <Sparkles className="w-4 h-4" /> Explore Channels
            </Link>
            <Link to="/tilii/watch" className="flex items-center gap-2 border border-white/10 text-white/50 font-bold px-6 py-4 rounded-2xl hover:bg-white/5 hover:text-white transition-all text-sm">
              Start Free Trial
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85 }}
            className="grid grid-cols-4 gap-4 max-w-xl mx-auto">
            {STATS.map(s => (
              <div key={s.label} className="text-center">
                <div className="text-2xl font-black text-white">{s.value}</div>
                <div className="text-white/30 text-[11px] font-semibold">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll cue */}
        <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 6, 0] }} transition={{ duration: 1.8, repeat: Infinity }}>
          <div className="w-5 h-8 border border-white/15 rounded-full flex items-start justify-center pt-1.5">
            <div className="w-1 h-2 bg-white/30 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Category strip */}
      <section className="border-t border-white/[0.05] py-6 px-6 overflow-x-auto">
        <div className="flex gap-2 max-w-7xl mx-auto">
          {CATEGORIES.map(c => (
            <Link key={c} to="/tilii/discover"
              className="flex-shrink-0 text-[11px] font-black uppercase tracking-wider text-white/35 border border-white/[0.08] rounded-full px-4 py-1.5 hover:text-white hover:border-white/20 transition-all">
              {c}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured content */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-white/25 text-[10px] font-black uppercase tracking-widest mb-1">Featured</p>
              <h2 className="text-2xl font-black text-white">Handpicked for you.</h2>
            </div>
            <Link to="/tilii/discover" className="text-white/35 text-xs font-black flex items-center gap-1 hover:text-white transition-colors">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {FEATURED.map((v, i) => (
              <Link key={i} to="/tilii/watch">
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                  className="group relative cursor-pointer">
                  {/* Thumbnail */}
                  <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-900 mb-3 relative">
                    <img src={v.thumb} alt={v.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    {/* Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                    {/* Lock overlay */}
                    {v.locked && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-black/60 border border-white/20 flex items-center justify-center backdrop-blur-sm">
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <rect x="2" y="5.5" width="8" height="5.5" rx="1.5" stroke="white" strokeWidth="1.2"/>
                            <path d="M4 5.5V4a2 2 0 0 1 4 0v1.5" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
                          </svg>
                        </div>
                      </div>
                    )}
                    {/* Play hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center">
                        <Play className="w-4 h-4 text-black fill-black ml-0.5" />
                      </div>
                    </div>
                    {/* Type badge */}
                    <div className="absolute top-2 left-2">
                      <span className="text-[9px] font-black uppercase tracking-wider text-white/60 bg-black/50 backdrop-blur-sm rounded-md px-1.5 py-0.5 border border-white/[0.08]">{v.type}</span>
                    </div>
                  </div>
                  <p className="text-white/85 text-xs font-black leading-snug line-clamp-2 mb-1">{v.title}</p>
                  <p className="text-white/30 text-[11px] font-semibold">{v.creator}</p>
                  <p className="text-white/20 text-[10px] mt-0.5">{v.duration}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* AI Features */}
      <section className="py-20 px-6 border-t border-white/[0.05]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 border border-white/10 bg-white/[0.04] rounded-full px-3 py-1 mb-5">
              <Zap className="w-3 h-3 text-white/40" />
              <span className="text-white/40 text-[10px] tracking-widest uppercase font-black">AI-Powered Everything</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white">Intelligence built in.</h2>
            <p className="text-white/35 text-base mt-3 max-w-xl mx-auto">Every video, every recommendation, every experience — powered by the most advanced AI in education.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {FEATURES.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 hover:bg-white/[0.06] hover:border-white/15 transition-all">
                <div className="w-9 h-9 rounded-xl bg-white/[0.07] flex items-center justify-center mb-3">
                  <Icon className="w-4 h-4 text-white/70" />
                </div>
                <p className="text-white font-black text-xs mb-1">{label}</p>
                <p className="text-white/35 text-[11px] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-6 border-t border-white/[0.05]">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-white/25 text-[10px] font-black uppercase tracking-widest mb-3">Pricing</p>
          <h2 className="text-4xl font-black text-white mb-4">Free for 7 Days.</h2>
          <p className="text-white/40 text-base mb-10">Then only $7/month. Cancel anytime.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-lg mx-auto mb-10">
            {[
              'Unlimited video streaming', 'AI-curated content', 'Exclusive creator channels',
              'Live sessions & events', 'Premium documentaries', 'AI learning recommendations',
              'Community access', 'Ad-free viewing',
            ].map(f => (
              <div key={f} className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-white/40 flex-shrink-0" />
                <span className="text-white/55 text-xs font-semibold">{f}</span>
              </div>
            ))}
          </div>
          <Link to="/tilii/watch"
            className="inline-flex items-center gap-2 bg-white text-[#080808] font-black px-10 py-4 rounded-2xl hover:bg-zinc-100 transition-all shadow-2xl shadow-white/10 text-sm">
            <Play className="w-4 h-4 fill-current" /> Start Watching Free
          </Link>
          <p className="text-white/20 text-xs mt-4">$7/month after trial · Cancel anytime · No questions asked</p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24 px-6 border-t border-white/[0.05] text-center">
        <div className="max-w-3xl mx-auto">
          <p className="text-white/20 text-sm font-black uppercase tracking-widest mb-6">Our Purpose</p>
          <h2 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6">
            Don't just watch content.<br />Watch your future unfold.
          </h2>
          <p className="text-white/35 text-base leading-relaxed">
            TiliiVisxion exists for the world's most ambitious learners, educators, and creators. Every video is a window into possibility.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] px-6 py-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
              <Play className="w-3 h-3 text-[#080808] fill-[#080808]" />
            </div>
            <span className="text-white/50 text-sm font-black">TiliiVisxion</span>
            <span className="text-white/20 text-xs ml-2">Part of edXponential</span>
          </div>
          <p className="text-white/20 text-xs">"Don't just watch content. Watch your future unfold."</p>
          <p className="text-white/15 text-xs">© 2026 edXponential · All rights reserved</p>
        </div>
      </footer>
    </div>
  );
}