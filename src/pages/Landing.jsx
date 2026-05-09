import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PremiumSection, PremiumHeading, PremiumGrid, PremiumContainer } from '@/components/premium/PremiumLayout';
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
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">

      {/* NAV */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-card border-b border-border shadow-sm' : 'bg-background'}`}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <img
            src="https://media.base44.com/images/public/69f64dbf5c37a4db77e0e302/21d29b7f0_64B1F443-0AD3-403D-B726-ABEF11D14419.png"
            alt="edXponential"
            className="h-12 w-auto"
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

      {/* HERO - Apple-style cinematic hero */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Layered premium background */}
        <div className="absolute inset-0 bg-background" />
        
        {/* Cinematic gradient depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background/50" />
        
        {/* Subtle animated particles */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute top-20 left-10 w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/50 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
        
        {/* Mesh gradient effect */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(37,99,235,0.08),transparent)]" />

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          {/* Premium badge with glassmorphism */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/30 bg-white/10 backdrop-blur-md mb-8 text-xs text-black font-medium tracking-widest uppercase shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Private · Invite-Only · Elite Ecosystem
            </div>
          </motion.div>

          {/* Cinematic hero headline with gradient */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
            className="display-1 text-balance mb-8 leading-[1.1]"
          >
            <span>Where the World's Most<br />Ambitious Education<br />Leaders </span>
            <span className="bg-gradient-to-r from-primary via-primary to-primary/80 bg-clip-text text-transparent">Build the Future.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25 }}
            className="subtitle text-muted-foreground max-w-2xl mx-auto mb-12"
          >
            edXponential is the operating system for school founders, executives, principals, investors, and educators. Access. Execution. Capital. Community.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Link to="/onboarding">
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="group h-11 px-8 rounded-lg bg-foreground text-background text-base font-semibold hover:shadow-lg transition-all duration-200 flex items-center gap-2 shadow-md"
              >
                Start Your Journey
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
            <a href="#features">
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="h-11 px-8 rounded-lg border border-border bg-background text-foreground text-base font-semibold hover:bg-muted transition-all duration-200 flex items-center gap-2"
              >
                Explore <ChevronDown className="w-4 h-4" />
              </motion.button>
            </a>
          </motion.div>

          {/* Cinematic floating platform ecosystem cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-24 grid grid-cols-4 md:grid-cols-8 gap-2 max-w-3xl mx-auto"
          >
            {platforms.map((p, i) => (
              <motion.div key={p.name}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + i * 0.05 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="flex flex-col items-center gap-1.5 p-3 rounded-lg border border-white/40 bg-white/10 backdrop-blur-md hover:border-primary/50 hover:bg-primary/15 transition-all duration-200 cursor-pointer group shadow-lg"
              >
                <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center group-hover:bg-primary/40 transition-colors">
                  <span className="text-[8px] font-black text-primary">{p.tag}</span>
                </div>
                <span className="text-[9px] font-bold text-black/70 text-center leading-tight hidden md:block">{p.desc}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Premium scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        >
          <span className="text-[10px] text-black/40 uppercase tracking-widest font-semibold">Scroll to explore</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}>
            <div className="w-6 h-10 border border-black/20 rounded-full flex items-start justify-center pt-2">
              <motion.div className="w-1 h-2 bg-primary rounded-full" />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* IMPACT METRICS - Cinematic Stats Section */}
      <PremiumSection spacing="3xl" className="border-y border-border bg-gradient-to-b from-white to-surface/50 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 opacity-50" />
        <div className="relative z-10">
          <PremiumGrid cols={4}>
            {stats.map((s, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="text-center group"
              >
                <motion.div whileHover={{ scale: 1.05 }} className="relative">
                  <div className="absolute inset-0 bg-primary/10 rounded-xl blur-xl group-hover:bg-primary/20 transition-colors opacity-0 group-hover:opacity-100" />
                  <div className="relative">
                    <div className="display-2 mb-2 bg-gradient-to-r from-black via-black to-black/70 bg-clip-text text-transparent">{s.value}</div>
                    <div className="label text-muted-foreground group-hover:text-black transition-colors">{s.label}</div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </PremiumGrid>
        </div>
      </PremiumSection>

      {/* FEATURES - Cinematic Platform Section */}
      <PremiumSection id="features" spacing="4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 mb-6 text-[10px] text-primary font-bold tracking-widest uppercase">
            <Sparkles className="w-3 h-3" /> The Full Platform
          </div>
          <PremiumHeading
            level={1}
            subtitle="Six integrated pillars that compound on each other — intelligence, capital, community, compliance, commerce, and careers."
          >
            Everything you need<br /><span className="text-muted-foreground">to lead at scale.</span>
          </PremiumHeading>
        </motion.div>

        <PremiumGrid cols={3}>
            {features.map((f, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                whileHover={{ y: -8 }}
                className="group relative rounded-xl border border-border bg-gradient-to-br from-white to-surface/50 p-7 shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 cursor-pointer"
              >
                {/* Hover glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-all shadow-sm">
                      <f.icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="label text-primary border border-primary/20 bg-primary/5 px-2 py-1 rounded-md group-hover:border-primary/40 group-hover:bg-primary/10 transition-colors">{f.tag}</span>
                    </div>
                    <h3 className="title font-semibold mb-2.5 text-black group-hover:text-primary transition-colors">{f.title}</h3>
                    <p className="body-sm text-muted-foreground">{f.desc}</p>
                  <div className="mt-5 flex items-center gap-1.5 text-[11px] font-semibold text-primary group-hover:gap-2 transition-all">
                    Learn more <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            ))}
          </PremiumGrid>
      </PremiumSection>

      {/* PLATFORM ECOSYSTEM - Cinematic Suite Showcase */}
      <PremiumSection spacing="4xl" className="border-y border-border bg-gradient-to-b from-surface/50 to-background relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute top-0 left-1/3 w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-3xl" />
          <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-primary/30 rounded-full mix-blend-multiply filter blur-3xl" />
        </div>
        
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="label text-primary mb-4">The Platform Suite</p>
            <h2 className="heading-1">
              One ecosystem. <span className="text-muted-foreground">Infinite leverage.</span>
            </h2>
          </motion.div>
          <PremiumGrid cols={4}>
            {platforms.map((p, i) => (
              <motion.div key={p.name}
                initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="group relative rounded-xl border border-border bg-white/50 backdrop-blur-sm p-5 shadow-sm hover:shadow-md hover:border-primary/40 transition-all duration-300 cursor-pointer overflow-hidden"
              >
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative z-10">
                  <div className="w-9 h-9 rounded-md bg-primary/15 flex items-center justify-center mb-3 group-hover:bg-primary/25 transition-all shadow-sm">
                    <span className="text-[10px] font-bold text-primary">{p.tag}</span>
                  </div>
                  <p className="font-semibold text-sm mb-0.5 text-black group-hover:text-primary transition-colors">{p.name}</p>
                  <p className="body-xs text-muted-foreground">{p.desc}</p>
                </div>
              </motion.div>
            ))}
          </PremiumGrid>
        </div>
      </PremiumSection>

      {/* TESTIMONIALS - Cinematic Social Proof */}
      <PremiumSection spacing="4xl" className="relative overflow-hidden bg-gradient-to-b from-background via-white/50 to-surface">
        {/* Subtle background glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/3 via-transparent to-primary/3 opacity-40" />
        
        <div className="relative z-10 max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-24"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/10 mb-8 text-[10px] text-primary font-bold tracking-widest uppercase">
              <Users className="w-3 h-3" /> Trusted by Leaders
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-black tracking-[-0.04em] leading-tight mb-5">
              Hear from education leaders<br /><span className="text-muted-foreground">already transforming their schools.</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-lg leading-relaxed">
              Real stories from principals, founders, coaches, and executives using edXponential every day.
            </p>
          </motion.div>

          {/* Featured testimonial - Premium spotlight */}
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -4 }}
            className="mb-20 p-10 rounded-2xl border border-primary/20 bg-gradient-to-br from-white via-primary/3 to-white/50 shadow-lg hover:shadow-xl hover:border-primary/40 transition-all duration-300 relative overflow-hidden"
          >
            {/* Gradient accent line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
            <div className="flex gap-6 flex-col md:flex-row md:items-center relative z-10">
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
          </motion.div>

                  {/* Testimonial grid */}
                  <PremiumGrid cols={2} className="mb-20">
                    {testimonials.slice(1).map((t, i) => (
                      <motion.div key={i}
                        initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }} transition={{ delay: (i + 1) * 0.08 }}
                        className="card-premium p-8 hover-lift"
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
                  </PremiumGrid>

          {/* Impact metrics */}
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="border-t border-border pt-20"
          >
            <h3 className="heading-2 mb-12 text-center">Impact at scale</h3>
            <PremiumGrid cols={4}>
              {impactMetrics.map((m, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  className="text-center"
                >
                  <div className="display-2 mb-2">{m.value}</div>
                  <div className="label text-muted-foreground">{m.label}</div>
                </motion.div>
              ))}
            </PremiumGrid>
          </motion.div>
          </div>
          </PremiumSection>

      {/* CTA - Premium Conversion Experience */}
      <PremiumSection spacing="5xl" className="border-t border-border relative overflow-hidden bg-gradient-to-b from-white to-surface">
        {/* Cinematic background effects */}
        <div className="absolute inset-0 opacity-[0.04]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-3xl" />
        </div>
        
        <div className="relative z-10">
          <PremiumContainer className="max-w-2xl">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/40 bg-primary/15 backdrop-blur-sm mb-8 text-[10px] text-primary font-bold tracking-widest uppercase shadow-sm">
                <Zap className="w-3 h-3" /> Limited Access Open
              </div>
              <h2 className="display-1 leading-tight mb-5 bg-gradient-to-r from-black via-black to-black/60 bg-clip-text text-transparent">
                Ready to lead<br /><span className="text-muted-foreground">exponentially?</span>
              </h2>
              <p className="subtitle text-muted-foreground mb-12">Join 500+ education leaders already shaping the future of schools, systems, and communities.</p>
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
                    className="w-full h-13 py-3.5 rounded-xl bg-gradient-to-r from-primary to-primary/90 text-white text-base font-semibold hover:shadow-lg hover:from-primary/95 hover:to-primary/85 transition-all active:scale-[0.98] disabled:opacity-60 shadow-md relative overflow-hidden group"
                  >
                    {/* Shimmer effect on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
                    <span className="relative">{loading ? 'Joining...' : 'Join edXponential →'}</span>
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
          </PremiumContainer>
          </div>
          </PremiumSection>

      {/* FOOTER - Premium Brand Footer */}
      <footer className="py-12 px-6 bg-gradient-to-t from-surface/80 to-white border-t border-border/50 relative overflow-hidden">
        <PremiumContainer className="flex flex-col md:flex-row items-center justify-between gap-6">
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
          <p className="caption text-muted-foreground">© 2026 edXponential. Built for education leaders.</p>
        </PremiumContainer>
      </footer>
    </div>
  );
}