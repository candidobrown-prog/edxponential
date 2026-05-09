import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, ChevronDown, CheckCircle, Sparkles, Globe, Zap, Shield, Users, BookOpen, TrendingUp, Star, BarChart3, Brain } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

const stats = [
  { value: '500+', label: 'edVisors Worldwide' },
  { value: '$2B+', label: 'Capital in Network' },
  { value: '1,200+', label: 'Schools Impacted' },
  { value: '98%', label: 'Member Retention' },
];

const features = [
  {
    icon: Brain,
    tag: 'AI-Native',
    title: 'Intelligent School Operating System',
    desc: 'Purpose-built AI across every module — from grade analytics and IEP compliance to board recruitment, investment matching, and curriculum design.',
  },
  {
    icon: TrendingUp,
    tag: 'Capital Access',
    title: 'Private Investment Ecosystem',
    desc: 'A curated network connecting education founders with high-conviction investors. Deal rooms. Pitch intelligence. Real capital.',
  },
  {
    icon: Users,
    tag: 'Elite Network',
    title: 'The edVisor Marketplace',
    desc: 'Access vetted operators who have built, scaled, and transformed institutions. Private advisory. Coaching. Community.',
  },
  {
    icon: BarChart3,
    tag: 'Executive Grade',
    title: 'Leadership Intelligence Dashboards',
    desc: 'Bloomberg-level analytics meets Notion-level clarity. Live data. Predictive forecasting. Board-ready reports in seconds.',
  },
  {
    icon: Shield,
    tag: 'Compliance',
    title: 'SPED, Compliance & Governance',
    desc: 'End-to-end IEP tracking, SPED service delivery, charter application support, and board governance — all in one platform.',
  },
  {
    icon: Globe,
    tag: 'Commerce',
    title: 'EduCartx™ Creator Commerce',
    desc: 'Sell courses, coaching, curricula, and resources directly to your community. AI-powered storefront meets Shopify-level infrastructure.',
  },
];

const testimonials = [
  {
    name: 'Dr. Amara Osei',
    title: 'Founder, Horizon Academy Charter',
    quote: 'edXponential gave me the frameworks and mentorship I needed to triple our enrollment in 18 months. Nothing else comes close.',
    avatar: 'AO',
  },
  {
    name: 'Marcus Webb',
    title: 'Superintendent, Eastside USD',
    quote: 'The edVisor sessions were transformative. My advisor pushed me in ways that no consulting firm ever had. This is elite-level support.',
    avatar: 'MW',
  },
  {
    name: 'Priya Nair',
    title: 'CEO, BridgeEd Charter Network',
    quote: 'The community alone is worth it. I found my co-founder in a discussion thread. The platform changed the trajectory of our school.',
    avatar: 'PN',
  },
];

const platforms = [
  { name: 'Graiedx™', desc: 'AI Gradebook', tag: 'GX' },
  { name: 'FoundationX™', desc: 'Charter Builder', tag: 'FX' },
  { name: 'EduCartx™', desc: 'Creator Commerce', tag: 'EC' },
  { name: 'PerSpEdxtives™', desc: 'SPED OS', tag: 'SP' },
  { name: 'Daida Baixed™', desc: 'Intelligence Center', tag: 'DB' },
  { name: 'WonJob™', desc: 'Education Careers', tag: 'WJ' },
  { name: 'TubedX™', desc: 'Video Platform', tag: 'TX' },
  { name: 'Classifiedx™', desc: 'Curriculum AI', tag: 'CX' },
];

const NAV_LINKS = ['Platform', 'Memberships', 'edVisors', 'Community', 'Resources', 'Pricing'];

export default function Landing() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleCapture = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    await base44.entities.EmailCapture.create({ email, full_name: name, source: 'landing_page' });
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#080808] font-body text-white overflow-x-hidden">

      {/* NAV */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'glass-dark' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <img
            src="https://media.base44.com/images/public/69f64dbf5c37a4db77e0e302/21d29b7f0_64B1F443-0AD3-403D-B726-ABEF11D14419.png"
            alt="edXponential"
            className="h-8 w-auto brightness-0 invert"
          />
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(l => (
              <a key={l} href="#features" className="text-sm text-white/50 hover:text-white transition-colors duration-200 tracking-wide">{l}</a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" className="text-sm text-white/50 hover:text-white transition-colors">Sign In</Link>
            <Link to="/">
              <button className="h-9 px-5 rounded-lg bg-white text-black text-sm font-semibold hover:bg-white/90 transition-all duration-200 active:scale-95">
                Join Now
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Atmospheric background */}
        <div className="absolute inset-0 bg-[#080808]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(255,255,255,0.06),transparent)]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-white/[0.015] blur-[120px] pointer-events-none" />

        {/* Grid lines */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 mb-8 text-xs text-white/50 font-medium tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-pulse" />
              Private · Invite-Only · Elite Ecosystem
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
            className="text-[clamp(2.8rem,8vw,7rem)] font-black tracking-[-0.04em] leading-[0.92] mb-8 text-balance"
          >
            <span className="text-white">Where the World's Most</span><br />
            <span className="text-white/25">Ambitious Education</span><br />
            <span className="text-white">Leaders Build the Future.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25 }}
            className="text-white/40 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-12 tracking-[-0.01em]"
          >
            edXponential is the operating system for school founders, executives, principals, investors, and educators. Access. Execution. Capital. Community.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Link to="/">
              <button className="group h-13 px-8 py-3.5 rounded-xl bg-white text-black text-base font-semibold hover:bg-white/90 transition-all duration-200 flex items-center gap-2 active:scale-95">
                Start Your Journey
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <a href="#features">
              <button className="h-13 px-8 py-3.5 rounded-xl border border-white/12 text-white/70 text-base hover:border-white/25 hover:text-white transition-all duration-200 flex items-center gap-2">
                Explore Platform <ChevronDown className="w-4 h-4" />
              </button>
            </a>
          </motion.div>

          {/* Floating platform cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-20 grid grid-cols-4 md:grid-cols-8 gap-2 max-w-3xl mx-auto"
          >
            {platforms.map((p, i) => (
              <motion.div key={p.name}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + i * 0.05 }}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-white/6 bg-white/3 hover:border-white/15 hover:bg-white/6 transition-all duration-200 cursor-pointer group"
              >
                <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white/15 transition-colors">
                  <span className="text-[8px] font-black text-white/70">{p.tag}</span>
                </div>
                <span className="text-[9px] font-bold text-white/30 text-center leading-tight hidden md:block">{p.desc}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] text-white/20 uppercase tracking-widest">Scroll</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
            <ChevronDown className="w-4 h-4 text-white/20" />
          </motion.div>
        </motion.div>
      </section>

      {/* STATS */}
      <section className="py-20 px-6 border-y border-white/6 bg-[#0a0a0a]">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-black text-white tracking-[-0.04em] mb-2">{s.value}</div>
              <div className="text-xs text-white/30 tracking-widest uppercase">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-32 px-6 bg-[#080808]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/8 bg-white/4 mb-6 text-[10px] text-white/40 font-bold tracking-widest uppercase">
              <Sparkles className="w-3 h-3" /> The Full Platform
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-white tracking-[-0.04em] leading-tight mb-5">
              Everything you need<br /><span className="text-white/25">to lead at scale.</span>
            </h2>
            <p className="text-white/35 max-w-xl mx-auto text-lg leading-relaxed">
              Six integrated pillars that compound on each other — intelligence, capital, community, compliance, commerce, and careers.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="group relative p-7 rounded-2xl border border-white/6 bg-white/[0.025] hover:border-white/12 hover:bg-white/[0.04] transition-all duration-300 card-hover cursor-pointer"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-10 h-10 rounded-xl bg-white/8 flex items-center justify-center group-hover:bg-white/12 transition-colors">
                      <f.icon className="w-5 h-5 text-white/60" />
                    </div>
                    <span className="text-[9px] font-black text-white/25 uppercase tracking-widest border border-white/8 px-2 py-1 rounded-full">{f.tag}</span>
                  </div>
                  <h3 className="text-base font-bold text-white mb-2.5 leading-snug tracking-[-0.02em]">{f.title}</h3>
                  <p className="text-sm text-white/35 leading-relaxed">{f.desc}</p>
                  <div className="mt-5 flex items-center gap-1.5 text-[11px] font-semibold text-white/25 group-hover:text-white/50 transition-colors">
                    Learn more <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PLATFORM ECOSYSTEM STRIP */}
      <section className="py-20 px-6 bg-[#0a0a0a] border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-xs text-white/25 uppercase tracking-widest mb-4 font-bold">The Platform Suite</p>
            <h2 className="text-4xl font-black text-white tracking-[-0.04em]">
              One ecosystem. <span className="text-white/25">Infinite leverage.</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {platforms.map((p, i) => (
              <motion.div key={p.name}
                initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="group p-5 rounded-2xl border border-white/6 bg-white/[0.02] hover:border-white/12 hover:bg-white/[0.04] transition-all duration-200 cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-white/8 flex items-center justify-center mb-3 group-hover:bg-white/12 transition-colors">
                  <span className="text-[10px] font-black text-white/60">{p.tag}</span>
                </div>
                <p className="font-bold text-sm text-white mb-0.5 tracking-[-0.02em]">{p.name}</p>
                <p className="text-[11px] text-white/30">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-32 px-6 bg-[#080808]">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="flex justify-center gap-0.5 mb-6">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-white text-white opacity-80" />)}
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-[-0.04em]">
              What leaders say.
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="p-7 rounded-2xl border border-white/6 bg-white/[0.025] hover:border-white/10 transition-all"
              >
                <div className="flex gap-0.5 mb-5">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-3 h-3 fill-white/60 text-white/60" />)}
                </div>
                <p className="text-white/55 text-sm leading-relaxed mb-6">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-[11px] font-black text-white/60">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-white/80 tracking-[-0.01em]">{t.name}</div>
                    <div className="text-[11px] text-white/30">{t.title}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA / EMAIL CAPTURE */}
      <section className="py-32 px-6 bg-[#0a0a0a] border-t border-white/6">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/8 bg-white/4 mb-8 text-[10px] text-white/40 font-bold tracking-widest uppercase">
              <Zap className="w-3 h-3" /> Limited Access Open
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-white tracking-[-0.04em] leading-tight mb-5">
              Ready to lead<br /><span className="text-white/25">exponentially?</span>
            </h2>
            <p className="text-white/35 mb-12 text-lg leading-relaxed">Join 500+ education leaders already shaping the future of schools, systems, and communities.</p>
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div key="done"
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center gap-4"
                >
                  <div className="w-14 h-14 rounded-full bg-white/8 flex items-center justify-center">
                    <CheckCircle className="w-7 h-7 text-white/70" />
                  </div>
                  <p className="text-white/60 text-lg">You're on the list.</p>
                  <p className="text-white/30 text-sm">We'll be in touch soon.</p>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={handleCapture} className="space-y-3">
                  <input
                    type="text"
                    placeholder="Your full name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full h-13 px-5 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/25 text-sm focus:outline-none focus:border-white/25 transition-colors"
                  />
                  <input
                    type="email"
                    placeholder="Your email address"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="w-full h-13 px-5 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/25 text-sm focus:outline-none focus:border-white/25 transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-13 py-3.5 rounded-xl bg-white text-black text-base font-semibold hover:bg-white/90 transition-all active:scale-[0.99] disabled:opacity-60"
                  >
                    {loading ? 'Joining...' : 'Join edXponential →'}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-14 px-6 bg-[#080808] border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src="https://media.base44.com/images/public/69f64dbf5c37a4db77e0e302/21d29b7f0_64B1F443-0AD3-403D-B726-ABEF11D14419.png"
              alt="edXponential"
              className="h-6 w-auto brightness-0 invert opacity-40"
            />
          </div>
          <div className="flex items-center gap-8">
            {['Privacy', 'Terms', 'Contact', 'Press'].map(l => (
              <a key={l} href="#" className="text-xs text-white/20 hover:text-white/50 transition-colors">{l}</a>
            ))}
          </div>
          <p className="text-xs text-white/15">© 2026 edXponential. Built for education leaders.</p>
        </div>
      </footer>
    </div>
  );
}