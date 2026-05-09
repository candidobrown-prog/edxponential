import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, ChevronDown, CheckCircle, Sparkles, Globe, Zap, Shield, Users, BookOpen, TrendingUp, Star, BarChart3, Brain, Play } from 'lucide-react';
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
    name: 'Dr. Maya Thompson',
    title: 'Principal',
    org: 'Washington Leadership Academy',
    quote: 'edXponential completely transformed how I lead my school. The platform feels like having an executive leadership team, instructional coach, and AI strategist all in one place. Within weeks, our systems became clearer, our teachers became more aligned, and our culture improved dramatically.',
    avatar: 'MT',
    rating: 5,
    featured: true,
  },
  {
    name: 'Marcus Ellison',
    title: 'Founder',
    org: 'Rise Academy Network',
    quote: 'As a founder, edXponential helped me move from ideas to execution faster than anything I\'ve ever used. The AI guidance, founder tools, and strategic support are next-level.',
    avatar: 'ME',
    rating: 5,
  },
  {
    name: 'Danielle Brooks',
    title: 'Executive Leadership Coach',
    org: 'Education Leaders Network',
    quote: 'I\'ve used dozens of education platforms, and nothing comes close to the simplicity and power of edXponential. It feels premium, intelligent, and actually designed for how educators work.',
    avatar: 'DB',
    rating: 5,
  },
  {
    name: 'Kevin Richardson',
    title: 'Chief Academic Officer',
    org: 'Metro School District',
    quote: 'The amount of time edXponential saves our organization is unbelievable. The platform has become the operating system for our leadership team.',
    avatar: 'KR',
    rating: 5,
  },
  {
    name: 'Jasmine Carter',
    title: 'Instructional Leader',
    org: 'Central High School',
    quote: 'For the first time in my career, I feel like technology actually understands educators. edXponential feels like the future.',
    avatar: 'JC',
    rating: 5,
  },
];

const impactMetrics = [
  { value: '10,000+', label: 'Educators Supported' },
  { value: '250+', label: 'Schools Impacted' },
  { value: '1M+', label: 'Instructional Minutes Improved' },
  { value: '98%', label: 'Leader Satisfaction' },
];

const videoTestimonials = [
  { name: 'Dr. Sarah Chen', title: 'Superintendent', org: 'Pacific Education Collective', thumb: 'SC' },
  { name: 'James Martinez', title: 'School Founder', org: 'Transform Academy', thumb: 'JM' },
  { name: 'Lisa Wong', title: 'Charter Director', org: 'Innovation School Network', thumb: 'LW' },
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
    <div className="min-h-screen bg-white font-body text-black overflow-x-hidden">

      {/* NAV */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-white border-b border-border/50 shadow-soft' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <img
            src="https://media.base44.com/images/public/69f64dbf5c37a4db77e0e302/21d29b7f0_64B1F443-0AD3-403D-B726-ABEF11D14419.png"
            alt="edXponential"
            className="h-8 w-auto"
          />
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(l => (
              l === 'Pricing'
                ? <Link key={l} to="/pricing" className="text-sm text-muted-foreground hover:text-black transition-colors duration-200 tracking-wide">{l}</Link>
                : <a key={l} href="#features" className="text-sm text-muted-foreground hover:text-black transition-colors duration-200 tracking-wide">{l}</a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" className="text-sm text-muted-foreground hover:text-black transition-colors">Sign In</Link>
            <Link to="/pricing" className="text-sm text-muted-foreground hover:text-black transition-colors hidden md:block">Pricing</Link>
            <Link to="/onboarding">
              <button className="h-9 px-5 rounded-lg bg-black text-white text-sm font-semibold hover:bg-black/85 transition-all duration-200 active:scale-95">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Clean white background */}
        <div className="absolute inset-0 bg-white" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(0,0,0,0.02),transparent)]" />

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-muted mb-8 text-xs text-muted-foreground font-medium tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-black/40 animate-pulse" />
              Private · Invite-Only · Elite Ecosystem
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
            className="text-[clamp(2.8rem,8vw,7rem)] font-black tracking-[-0.04em] leading-[0.92] mb-8 text-balance text-black"
          >
            <span>Where the World's Most</span><br />
            <span className="text-muted-foreground">Ambitious Education</span><br />
            <span>Leaders Build the Future.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25 }}
            className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-12 tracking-[-0.01em]"
          >
            edXponential is the operating system for school founders, executives, principals, investors, and educators. Access. Execution. Capital. Community.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Link to="/onboarding">
              <button className="group h-13 px-8 py-3.5 rounded-xl bg-blue-pure text-white text-base font-semibold hover:bg-blue-light transition-all duration-200 flex items-center gap-2 active:scale-95 shadow-md-soft">
                Start Your Journey
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <a href="#features">
              <button className="h-13 px-8 py-3.5 rounded-xl border border-border text-foreground text-base hover:border-foreground/50 hover:bg-muted transition-all duration-200 flex items-center gap-2">
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
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-border bg-muted hover:border-foreground/30 hover:bg-muted/80 transition-all duration-200 cursor-pointer group shadow-soft"
              >
                <div className="w-7 h-7 rounded-lg bg-black/8 flex items-center justify-center group-hover:bg-black/12 transition-colors">
                  <span className="text-[8px] font-black text-black/60">{p.tag}</span>
                </div>
                <span className="text-[9px] font-bold text-muted-foreground text-center leading-tight hidden md:block">{p.desc}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] text-muted-foreground/60 uppercase tracking-widest">Scroll</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
            <ChevronDown className="w-4 h-4 text-muted-foreground/40" />
          </motion.div>
        </motion.div>
      </section>

      {/* STATS */}
      <section className="py-20 px-6 border-y border-border bg-secondary">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-black text-black tracking-[-0.04em] mb-2">{s.value}</div>
              <div className="text-xs text-muted-foreground tracking-widest uppercase">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-32 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-white mb-6 text-[10px] text-muted-foreground font-bold tracking-widest uppercase">
              <Sparkles className="w-3 h-3 text-blue-pure" /> The Full Platform
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-black tracking-[-0.04em] leading-tight mb-5">
              Everything you need<br /><span className="text-muted-foreground">to lead at scale.</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-lg leading-relaxed">
              Six integrated pillars that compound on each other — intelligence, capital, community, compliance, commerce, and careers.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="group relative p-7 rounded-2xl border border-border bg-white hover:border-foreground/20 hover:shadow-soft transition-all duration-300 card-hover cursor-pointer"
              >
                <div className="relative">
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center group-hover:bg-blue-glow transition-colors">
                      <f.icon className="w-5 h-5 text-blue-pure" />
                    </div>
                    <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest border border-border px-2 py-1 rounded-full">{f.tag}</span>
                  </div>
                  <h3 className="text-base font-bold text-black mb-2.5 leading-snug tracking-[-0.02em]">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                  <div className="mt-5 flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground group-hover:text-black transition-colors">
                    Learn more <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PLATFORM ECOSYSTEM STRIP */}
      <section className="py-20 px-6 bg-secondary border-y border-border">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-4 font-bold">The Platform Suite</p>
            <h2 className="text-4xl font-black text-black tracking-[-0.04em]">
              One ecosystem. <span className="text-muted-foreground">Infinite leverage.</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {platforms.map((p, i) => (
              <motion.div key={p.name}
                initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="group p-5 rounded-2xl border border-border bg-white hover:border-foreground/20 hover:shadow-soft transition-all duration-200 cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center mb-3 group-hover:bg-black/8 transition-colors">
                  <span className="text-[10px] font-black text-black/60">{p.tag}</span>
                </div>
                <p className="font-bold text-sm text-black mb-0.5 tracking-[-0.02em]">{p.name}</p>
                <p className="text-[11px] text-muted-foreground">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PREMIUM TESTIMONIALS */}
      <section className="py-32 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-24"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-pure/30 bg-blue-glow mb-8 text-[10px] text-blue-pure font-bold tracking-widest uppercase">
              <Users className="w-3 h-3" /> Trusted by Leaders
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-black tracking-[-0.04em] leading-tight mb-5">
              Hear from education leaders<br /><span className="text-muted-foreground">already transforming their schools.</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-lg leading-relaxed">
              Real stories from principals, founders, coaches, and executives using edXponential every day.
            </p>
          </motion.div>

          {/* Featured testimonial */}
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20 p-10 rounded-2xl border border-border bg-secondary hover:border-blue-pure/30 transition-all"
          >
            <div className="flex gap-6 flex-col md:flex-row md:items-center">
              <div className="flex-1">
                <div className="flex gap-0.5 mb-6">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-black text-black" />)}
                </div>
                <p className="text-2xl md:text-3xl font-black text-black tracking-[-0.03em] leading-tight mb-6">
                  "{testimonials[0].quote}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-pure flex items-center justify-center text-white font-black text-sm">
                    {testimonials[0].avatar}
                  </div>
                  <div>
                    <div className="font-bold text-black text-lg">{testimonials[0].name}</div>
                    <div className="text-muted-foreground text-sm">{testimonials[0].title} · {testimonials[0].org}</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Testimonial grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
            {testimonials.slice(1).map((t, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: (i + 1) * 0.08 }}
                className="p-8 rounded-2xl border border-border bg-white hover:border-foreground/20 hover:shadow-soft transition-all card-hover"
              >
                <div className="flex gap-0.5 mb-5">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-3.5 h-3.5 fill-black text-black" />)}
                </div>
                <p className="text-muted-foreground text-base leading-relaxed mb-6">"{t.quote}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-border">
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-[11px] font-black text-blue-pure">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-black">{t.name}</div>
                    <div className="text-[11px] text-muted-foreground">{t.title} · {t.org}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Video testimonials */}
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <h3 className="text-3xl font-black text-black tracking-[-0.04em] mb-8">Watch real leaders</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {videoTestimonials.map((v, i) => (
                <motion.button key={i}
                  initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="group relative aspect-video rounded-2xl overflow-hidden bg-secondary border border-border hover:border-blue-pure/30 transition-all"
                >
                  {/* Placeholder gradient */}
                  <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent" />
                  
                  {/* Play button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="w-16 h-16 rounded-full bg-white flex items-center justify-center group-hover:bg-white/90 transition-colors"
                    >
                      <Play className="w-7 h-7 text-black fill-black" />
                    </motion.div>
                  </div>

                  {/* Label */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                    <div className="font-bold text-white text-sm">{v.name}</div>
                    <div className="text-white/70 text-xs">{v.title}</div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Impact metrics */}
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="border-t border-border pt-20"
          >
            <h3 className="text-2xl font-black text-black tracking-[-0.04em] mb-12 text-center">
              Impact at scale
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {impactMetrics.map((m, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  className="text-center"
                >
                  <div className="text-4xl md:text-5xl font-black text-black tracking-[-0.04em] mb-2">{m.value}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-widest font-bold">{m.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA / EMAIL CAPTURE */}
      <section className="py-32 px-6 bg-white border-t border-border">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-pure/30 bg-blue-glow mb-8 text-[10px] text-blue-pure font-bold tracking-widest uppercase">
              <Zap className="w-3 h-3" /> Limited Access Open
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-black tracking-[-0.04em] leading-tight mb-5">
              Ready to lead<br /><span className="text-muted-foreground">exponentially?</span>
            </h2>
            <p className="text-muted-foreground mb-12 text-lg leading-relaxed">Join 500+ education leaders already shaping the future of schools, systems, and communities.</p>
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div key="done"
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center gap-4"
                >
                  <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
                    <CheckCircle className="w-7 h-7 text-black/60" />
                  </div>
                  <p className="text-black/60 text-lg">You're on the list.</p>
                  <p className="text-muted-foreground text-sm">We'll be in touch soon.</p>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={handleCapture} className="space-y-3">
                  <input
                    type="text"
                    placeholder="Your full name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full h-13 px-5 py-3.5 rounded-xl bg-white border border-border text-black placeholder:text-muted-foreground text-sm focus:outline-none focus:border-foreground/50 transition-colors shadow-soft"
                  />
                  <input
                    type="email"
                    placeholder="Your email address"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="w-full h-13 px-5 py-3.5 rounded-xl bg-white border border-border text-black placeholder:text-muted-foreground text-sm focus:outline-none focus:border-foreground/50 transition-colors shadow-soft"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-13 py-3.5 rounded-xl bg-blue-pure text-white text-base font-semibold hover:bg-blue-light transition-all active:scale-[0.99] disabled:opacity-60 shadow-md-soft"
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
      <footer className="py-14 px-6 bg-secondary border-t border-border">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src="https://media.base44.com/images/public/69f64dbf5c37a4db77e0e302/21d29b7f0_64B1F443-0AD3-403D-B726-ABEF11D14419.png"
              alt="edXponential"
              className="h-6 w-auto opacity-60"
            />
          </div>
          <div className="flex items-center gap-8">
            {['Privacy', 'Terms', 'Contact', 'Press'].map(l => (
              <a key={l} href="#" className="text-xs text-muted-foreground hover:text-black transition-colors">{l}</a>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">© 2026 edXponential. Built for education leaders.</p>
        </div>
      </footer>
    </div>
  );
}