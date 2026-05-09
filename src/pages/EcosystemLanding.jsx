import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import { 
  ArrowRight, Sparkles, Play, Check, Users, TrendingUp, Zap, 
  ChevronDown, Star, Lock, Unlock, MessageCircle, Code, 
  Briefcase, School, BookOpen, BarChart3, Brain, Rocket, Globe,
  Lightbulb, Target, Infinity, Wand2, Compass
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import SafeLink from '@/components/navigation/SafeLink';
import { ECOSYSTEM_ROUTES } from '@/lib/linkValidator';

export default function EcosystemLanding() {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);
  const { scrollY } = useScroll();
  const scrollYSpring = useSpring(scrollY, { stiffness: 100, damping: 30 });

  const handleEmailCapture = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await base44.entities.EmailCapture.create({
        email,
        source: 'ecosystem_landing'
      });
      setSubmitted(true);
      setTimeout(() => {
        setEmail('');
        setSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error('Signup error:', error);
    } finally {
      setLoading(false);
    }
  };

  const ecosystemItems = [
    { name: 'Xschy Xschraiper', icon: Brain, color: 'from-blue-600 to-blue-400', desc: 'AI school data intelligence', route: ECOSYSTEM_ROUTES.XSCHETAILS },
    { name: 'Goaled Xschool', icon: Target, color: 'from-purple-600 to-purple-400', desc: 'School operating system', route: ECOSYSTEM_ROUTES.GOALED },
    { name: 'Daida Baixed', icon: BarChart3, color: 'from-emerald-600 to-emerald-400', desc: 'Academic command center', route: ECOSYSTEM_ROUTES.DAIDA },
    { name: 'Graiedx', icon: BookOpen, color: 'from-orange-600 to-orange-400', desc: 'Teacher grading platform', route: ECOSYSTEM_ROUTES.GRAIEDX },
    { name: 'PerSpEdxtives', icon: Users, color: 'from-pink-600 to-pink-400', desc: 'Special education suite', route: ECOSYSTEM_ROUTES.PERSPEDXTIVES },
    { name: 'EduCartx', icon: Zap, color: 'from-cyan-600 to-cyan-400', desc: 'Education marketplace', route: ECOSYSTEM_ROUTES.EDUCARTX },
    { name: 'Classifiedx', icon: Code, color: 'from-indigo-600 to-indigo-400', desc: 'Curriculum platform', route: ECOSYSTEM_ROUTES.CLASSIFIEDX },
    { name: 'Foundaitionx', icon: Briefcase, color: 'from-red-600 to-red-400', desc: 'School governance suite', route: ECOSYSTEM_ROUTES.FOUNDAITIONX },
  ];

  const pricingTiers = [
    {
      name: 'Potentials',
      description: 'For students & learners',
      price: 'Free',
      features: ['Access to courses', 'Community', 'Basic analytics'],
      cta: 'Get Started',
      route: ECOSYSTEM_ROUTES.ONBOARDING
    },
    {
      name: 'Principal Park',
      description: 'For school leaders',
      price: '$499',
      period: '/month',
      features: ['Full school OS', 'AI dashboards', 'Team collaboration', 'Analytics suite'],
      cta: 'Start Building',
      highlight: true,
      route: ECOSYSTEM_ROUTES.ONBOARDING
    },
    {
      name: 'Founders Sphere',
      description: 'For entrepreneurs',
      price: '$299',
      period: '/month',
      features: ['School builder', 'AI planning', 'Board support', 'Founder network'],
      cta: 'Apply',
      route: ECOSYSTEM_ROUTES.FOUNDER_DASHBOARD
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* STICKY NAV */}
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/50"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <SafeLink to={ECOSYSTEM_ROUTES.ECOSYSTEM} className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center group-hover:shadow-lg transition-shadow">
              <Rocket className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-black text-black group-hover:text-primary transition-colors">edXponential</span>
          </SafeLink>
          
          <div className="hidden md:flex items-center gap-8">
            <motion.a href="#ecosystem" className="text-sm text-muted-foreground hover:text-black transition" whileHover={{ scale: 1.05 }}>Ecosystem</motion.a>
            <motion.a href="#ai" className="text-sm text-muted-foreground hover:text-black transition" whileHover={{ scale: 1.05 }}>AI</motion.a>
            <motion.a href="#pricing" className="text-sm text-muted-foreground hover:text-black transition" whileHover={{ scale: 1.05 }}>Pricing</motion.a>
            <SafeLink to={ECOSYSTEM_ROUTES.DASHBOARD} className="text-sm text-muted-foreground hover:text-black transition">Enter</SafeLink>
          </div>
          
          <div className="flex items-center gap-3">
            <SafeLink
              to={ECOSYSTEM_ROUTES.SIGNIN}
              className="px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/5 rounded-lg transition"
            >
              Sign In
            </SafeLink>
            <SafeLink
              to={ECOSYSTEM_ROUTES.ONBOARDING}
              className="px-4 py-2 text-sm font-semibold text-white bg-black hover:bg-black/80 rounded-lg transition"
            >
              Start Free
            </SafeLink>
          </div>
        </div>
      </motion.nav>

      {/* HERO SECTION - CINEMATIC */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-white via-white/50 to-surface" />
          
          {/* Floating orbs */}
          <motion.div
            animate={{ y: [0, -30, 0], x: [0, 15, 0] }}
            transition={{ repeat: Infinity, duration: 8 }}
            className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ y: [0, 30, 0], x: [0, -20, 0] }}
            transition={{ repeat: Infinity, duration: 10, delay: 1 }}
            className="absolute bottom-20 right-10 w-80 h-80 bg-primary/5 rounded-full blur-3xl"
          />
          
          {/* Animated grid */}
          <div className="absolute inset-0 opacity-[0.02]">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-sm mb-8">
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }}>
                <Sparkles className="w-4 h-4 text-primary" />
              </motion.div>
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">The Future of Education</span>
            </div>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="display-1 mb-8 leading-[1.1] max-w-5xl mx-auto"
          >
            Where Human Potential
            <br />
            <span className="bg-gradient-to-r from-primary via-primary to-primary/80 bg-clip-text text-transparent">
              Meets AI Intelligence
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="subtitle text-muted-foreground max-w-2xl mx-auto mb-12"
          >
            The AI-powered operating system for educators, founders, and leaders. Build schools. Scale systems. Transform futures. No compromises.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
          >
            <SafeLink
              to={ECOSYSTEM_ROUTES.ONBOARDING}
              className="px-8 py-4 rounded-xl bg-black text-white font-semibold hover:bg-black/80 transition-all hover:shadow-2xl flex items-center gap-2 group"
            >
              <Wand2 className="w-4 h-4" />
              Start Building
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </SafeLink>
            
            <SafeLink
              href={ECOSYSTEM_ROUTES.WEBSITE}
              external
              newTab
              className="px-8 py-4 rounded-xl border border-border bg-white hover:bg-surface transition-all flex items-center gap-2 group"
            >
              <Play className="w-4 h-4" />
              Watch Vision
            </SafeLink>
            
            <SafeLink
              to={ECOSYSTEM_ROUTES.EDVESTORS}
              className="px-8 py-4 rounded-xl border border-primary/30 bg-primary/10 text-primary font-semibold hover:bg-primary/20 transition-all"
            >
              Apply as EdVisor
            </SafeLink>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2.5 }}
            className="flex justify-center"
          >
            <div className="w-6 h-10 border border-black/20 rounded-full flex items-start justify-center pt-2">
              <motion.div className="w-1 h-2 bg-primary rounded-full" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ECOSYSTEM SECTION - INTERACTIVE CARDS */}
      <section id="ecosystem" className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">Eight Integrated Systems</p>
            <h2 className="heading-1 mb-6">The Complete Ecosystem</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From AI-powered school operations to creator commerce, every system compounds your impact and transforms education.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ecosystemItems.map((item, i) => {
              const Icon = item.icon;
              return (
                <SafeLink
                  key={i}
                  to={item.route}
                  className="no-underline"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    onMouseEnter={() => setHoveredCard(i)}
                    onMouseLeave={() => setHoveredCard(null)}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="group relative rounded-2xl border border-border bg-gradient-to-br from-white to-surface/50 p-8 overflow-hidden cursor-pointer h-full transition-all"
                  >
                    {/* Hover glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/10 group-hover:to-primary/5 transition-all duration-500" />
                    
                    {/* Gradient border on hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{
                      background: `linear-gradient(135deg, rgba(var(--primary-rgb), 0.1), transparent)`,
                    }} />

                    <div className="relative z-10 h-full flex flex-col">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} text-white flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-all transform group-hover:scale-110`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-6 flex-1">
                        {item.desc}
                      </p>
                      <div className="flex items-center gap-2 text-primary font-semibold text-sm group-hover:gap-3 transition-all">
                        Explore <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  </motion.div>
                </SafeLink>
              );
            })}
          </div>
        </div>
      </section>

      {/* AI POWER SECTION - FUTURISTIC */}
      <section id="ai" className="py-24 px-6 bg-gradient-to-b from-surface/50 to-white relative overflow-hidden">
        {/* Background animation */}
        <div className="absolute inset-0 opacity-30">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-primary/20 rounded-full"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-primary/10 rounded-full"
          />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 mb-6">
              <Brain className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold text-primary uppercase">Powered by AI</span>
            </div>
            <h2 className="heading-1 mb-6">Intelligence at Every Level</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Advanced AI powers every decision. From curriculum generation to predictive analytics, intelligence is woven into the DNA of edXponential.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'AI Course Creation', desc: 'Generate world-class curricula in minutes', icon: Lightbulb },
              { title: 'Predictive Analytics', desc: 'Forecast outcomes and prescribe interventions', icon: TrendingUp },
              { title: 'Smart Scheduling', desc: 'Optimize timetables and resources intelligently', icon: Compass },
              { title: 'Voice Coaching', desc: 'Natural language AI coaching at scale', icon: MessageCircle },
              { title: 'IEP Generation', desc: 'Compliant special education plans instantly', icon: Target },
              { title: 'Market Intelligence', desc: 'Real-time insights on education trends', icon: Globe },
            ].map((item, i) => {
              const ItemIcon = item.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -8 }}
                  className="rounded-xl border border-border bg-white/80 backdrop-blur p-8 hover:shadow-xl hover:border-primary/30 transition-all group"
                >
                  <ItemIcon className="w-8 h-8 text-primary mb-4 group-hover:scale-125 group-hover:rotate-12 transition-all" />
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF - STATS */}
      <section className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="heading-1 mb-6">Impact at Scale</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Thousands of educators, founders, and school leaders are already transforming education.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { label: 'Schools Transformed', value: '500+' },
              { label: 'Courses Created', value: '5,000+' },
              { label: 'Students Impacted', value: '250K+' },
              { label: 'Revenue Generated', value: '$50M+' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center group"
              >
                <div className="display-2 text-primary mb-2 group-hover:scale-110 transition-transform">
                  {stat.value}
                </div>
                <p className="text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className="py-24 px-6 bg-surface/50 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="heading-1 mb-6">Membership for Every Journey</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From free exploration to premium transformation, choose your path.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {pricingTiers.map((tier, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`rounded-2xl p-8 transition-all relative group ${
                  tier.highlight
                    ? 'border border-primary bg-gradient-to-br from-primary/5 to-white shadow-2xl scale-105'
                    : 'border border-border bg-white hover:shadow-lg hover:border-primary/20'
                }`}
              >
                {tier.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-white text-xs font-bold rounded-full">
                    Most Popular
                  </div>
                )}

                <h3 className="heading-2 mb-2">{tier.name}</h3>
                <p className="text-muted-foreground text-sm mb-6">{tier.description}</p>
                <div className="mb-8">
                  <span className="display-2">{tier.price}</span>
                  {tier.period && <span className="text-muted-foreground ml-2">{tier.period}</span>}
                </div>
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm">
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <SafeLink
                  to={tier.route}
                  className={`w-full py-3 rounded-lg font-semibold transition-all block text-center group-hover:shadow-lg ${
                    tier.highlight
                      ? 'bg-black text-white hover:bg-black/80'
                      : 'border border-border hover:bg-surface'
                  }`}
                >
                  {tier.cta}
                </SafeLink>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION - FINAL PUSH */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/5" />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="heading-1 mb-6">Join the Revolution</h2>
            <p className="text-muted-foreground mb-12 max-w-xl mx-auto">
              The future of education isn't being planned—it's being built right now. Will you lead it?
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleEmailCapture(e)}
                className="px-6 py-4 rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 flex-1 sm:flex-none sm:w-64 text-foreground"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleEmailCapture}
                disabled={loading}
                className="px-8 py-4 rounded-xl bg-black text-white font-semibold hover:bg-black/80 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Joining...' : 'Get Started Free'}
              </motion.button>
            </div>

            <AnimatePresence>
              {submitted && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-primary text-sm mt-4 font-semibold"
                >
                  ✓ Check your email to get started!
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* FOOTER - PREMIUM */}
      <footer className="py-12 px-6 border-t border-border bg-gradient-to-b from-white to-surface/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <SafeLink to={ECOSYSTEM_ROUTES.ECOSYSTEM} className="flex items-center gap-2 mb-4 group">
                <Rocket className="w-5 h-5 text-primary group-hover:rotate-12 transition-transform" />
                <span className="font-bold group-hover:text-primary transition-colors">edXponential</span>
              </SafeLink>
              <p className="text-xs text-muted-foreground">
                The AI operating system for education, leadership, and human potential.
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-4 text-muted-foreground">Platform</p>
              <ul className="space-y-2 text-sm">
                <li><SafeLink to={ECOSYSTEM_ROUTES.ECOSYSTEM} className="text-muted-foreground hover:text-black transition">Ecosystem</SafeLink></li>
                <li><SafeLink to={ECOSYSTEM_ROUTES.EDUCARTX} className="text-muted-foreground hover:text-black transition">Marketplace</SafeLink></li>
                <li><SafeLink to={ECOSYSTEM_ROUTES.DEAL_ROOM} className="text-muted-foreground hover:text-black transition">Founders</SafeLink></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-4 text-muted-foreground">Resources</p>
              <ul className="space-y-2 text-sm">
                <li><SafeLink href={ECOSYSTEM_ROUTES.WEBSITE} external newTab className="text-muted-foreground hover:text-black transition">Documentation</SafeLink></li>
                <li><SafeLink href={ECOSYSTEM_ROUTES.SUPPORT} external newTab className="text-muted-foreground hover:text-black transition">Support</SafeLink></li>
                <li><SafeLink href={ECOSYSTEM_ROUTES.BLOG} external newTab className="text-muted-foreground hover:text-black transition">Blog</SafeLink></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-4 text-muted-foreground">Legal</p>
              <ul className="space-y-2 text-sm">
                <li><SafeLink href={ECOSYSTEM_ROUTES.WEBSITE} external newTab className="text-muted-foreground hover:text-black transition">Privacy</SafeLink></li>
                <li><SafeLink href={ECOSYSTEM_ROUTES.WEBSITE} external newTab className="text-muted-foreground hover:text-black transition">Terms</SafeLink></li>
                <li><SafeLink to={ECOSYSTEM_ROUTES.DASHBOARD} className="text-muted-foreground hover:text-black transition">Contact</SafeLink></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">© 2026 edXponential. Engineered for the future.</p>
            <div className="flex items-center gap-6">
              {['Twitter', 'LinkedIn', 'GitHub'].map(platform => (
                <SafeLink
                  key={platform}
                  href={`https://${platform.toLowerCase()}.com/edxponential`}
                  external
                  newTab
                  className="text-xs text-muted-foreground hover:text-black transition hover:scale-110 transform"
                >
                  {platform}
                </SafeLink>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}