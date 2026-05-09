import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
  ArrowRight, Sparkles, Play, Check, Users, TrendingUp, Zap, 
  ChevronDown, Star, Lock, Unlock, MessageCircle, Code, 
  Briefcase, School, BookOpen, BarChart3, Brain, Rocket
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
  const { scrollYProgress } = useScroll();

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
    { name: 'Xschy Xschraiper', icon: Brain, color: 'from-blue-600 to-blue-400', desc: 'AI school data intelligence' },
    { name: 'Goaled Xschool', icon: School, color: 'from-purple-600 to-purple-400', desc: 'School operating system' },
    { name: 'Daida Baixed', icon: BarChart3, color: 'from-emerald-600 to-emerald-400', desc: 'Academic command center' },
    { name: 'Graiedx', icon: BookOpen, color: 'from-orange-600 to-orange-400', desc: 'Teacher grading platform' },
    { name: 'PerSpEdxtives', icon: Users, color: 'from-pink-600 to-pink-400', desc: 'Special education suite' },
    { name: 'EduCartx', icon: Zap, color: 'from-cyan-600 to-cyan-400', desc: 'Education marketplace' },
    { name: 'Classifiedx', icon: Code, color: 'from-indigo-600 to-indigo-400', desc: 'Curriculum platform' },
    { name: 'Foundaitionx', icon: Briefcase, color: 'from-red-600 to-red-400', desc: 'School governance suite' },
  ];

  const pricingTiers = [
    {
      name: 'Potentials',
      description: 'For students & learners',
      price: 'Free',
      features: ['Access to courses', 'Community', 'Basic analytics'],
      cta: 'Get Started'
    },
    {
      name: 'Principal Park',
      description: 'For school leaders',
      price: '$499',
      period: '/month',
      features: ['Full school OS', 'AI dashboards', 'Team collaboration', 'Analytics suite'],
      cta: 'Start Building',
      highlight: true
    },
    {
      name: 'Founders Sphere',
      description: 'For entrepreneurs',
      price: '$299',
      period: '/month',
      features: ['School builder', 'AI planning', 'Board support', 'Founder network'],
      cta: 'Apply'
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* STICKY NAV */}
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/50"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
              <Rocket className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-black text-black">edXponential</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#ecosystem" className="text-sm text-muted-foreground hover:text-black transition">Ecosystem</a>
            <a href="#ai" className="text-sm text-muted-foreground hover:text-black transition">AI</a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-black transition">Pricing</a>
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

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white/50 to-surface" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-sm mb-8">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">AI-Powered Ecosystem</span>
            </div>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="display-1 mb-8 leading-[1.1] max-w-5xl mx-auto"
          >
            The AI Operating System for
            <br />
            <span className="bg-gradient-to-r from-primary via-primary to-primary/80 bg-clip-text text-transparent">
              Education, Leadership, and Human Potential
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="subtitle text-muted-foreground max-w-2xl mx-auto mb-12"
          >
            Where educators, founders, and AI collaborate to build schools, systems, and transformational futures. The platform for visionary leaders who refuse to accept the status quo.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
          >
            <SafeLink
              to={ECOSYSTEM_ROUTES.ONBOARDING}
              className="px-8 py-4 rounded-xl bg-black text-white font-semibold hover:bg-black/80 transition-all hover:shadow-xl flex items-center gap-2 group"
            >
              Start Building
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </SafeLink>
            <SafeLink
              href={ECOSYSTEM_ROUTES.WEBSITE}
              external
              className="px-8 py-4 rounded-xl border border-border bg-white hover:bg-surface transition-all flex items-center gap-2 group"
            >
              <Play className="w-4 h-4" />
              Watch Demo
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

      {/* ECOSYSTEM SECTION */}
      <section id="ecosystem" className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">Platform Ecosystem</p>
            <h2 className="heading-1 mb-6">Nine Integrated Intelligence Systems</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From AI-powered school operations to marketplace commerce, every system is designed to compound your impact.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ecosystemItems.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  onMouseEnter={() => setHoveredCard(i)}
                  onMouseLeave={() => setHoveredCard(null)}
                  whileHover={{ y: -8 }}
                  className="group relative rounded-2xl border border-border bg-gradient-to-br from-white to-surface/50 p-8 overflow-hidden cursor-pointer"
                >
                  {/* Hover glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-primary/10 transition-all duration-300" />

                  <div className="relative z-10">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} text-white flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-all`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      {item.desc}
                    </p>
                    <div className="flex items-center gap-2 text-primary font-semibold text-sm group-hover:gap-3 transition-all">
                      Explore <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* AI POWER SECTION */}
      <section id="ai" className="py-24 px-6 bg-gradient-to-b from-surface/50 to-white relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 mb-6">
              <Brain className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold text-primary uppercase">AI Intelligence</span>
            </div>
            <h2 className="heading-1 mb-6">Powered by Advanced AI</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From curriculum generation to predictive analytics, AI powers every decision and action on the platform.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'AI Course Creation', desc: 'Generate world-class curricula in minutes' },
              { title: 'Predictive Analytics', desc: 'Forecast student outcomes and interventions' },
              { title: 'Smart Scheduling', desc: 'Optimize timetables and resource allocation' },
              { title: 'Intelligent Grading', desc: 'AI-powered assessment and feedback' },
              { title: 'Voice Coaching', desc: 'Natural language AI coaching at scale' },
              { title: 'IEP Generation', desc: 'Compliant special education plans instantly' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl border border-border bg-white p-8 hover:shadow-lg transition-all group"
              >
                <Zap className="w-6 h-6 text-primary mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="heading-1 mb-6">Trusted by Visionary Leaders</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Educators, founders, and school leaders are transforming education with edXponential.
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
                className="text-center"
              >
                <div className="display-2 text-primary mb-2">{stat.value}</div>
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
            <h2 className="heading-1 mb-6">Membership Tiers for Every Leader</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From free access to premium ecosystems, choose your level of transformation.
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
                className={`rounded-2xl p-8 transition-all ${
                  tier.highlight
                    ? 'border border-primary bg-gradient-to-br from-primary/5 to-white shadow-xl scale-105'
                    : 'border border-border bg-white hover:shadow-lg'
                }`}
              >
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
                  to={ECOSYSTEM_ROUTES.ONBOARDING}
                  className={`w-full py-3 rounded-lg font-semibold transition-all block text-center ${
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

      {/* CTA SECTION */}
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
              The future of education is being built right now. Will you be part of it?
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-6 py-4 rounded-xl border border-border bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 flex-1 sm:flex-none sm:w-64"
              />
              <button
                onClick={handleEmailCapture}
                disabled={loading}
                className="px-8 py-4 rounded-xl bg-black text-white font-semibold hover:bg-black/80 transition-all disabled:opacity-60"
              >
                {loading ? 'Joining...' : 'Get Started Free'}
              </button>
            </div>

            {submitted && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-primary text-sm mt-4"
              >
                ✓ Check your email to get started!
              </motion.p>
            )}
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-6 border-t border-border bg-gradient-to-b from-white to-surface/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Rocket className="w-5 h-5 text-primary" />
                <span className="font-bold">edXponential</span>
              </div>
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
          <div className="border-t border-border pt-8 flex items-center justify-between">
            <p className="text-xs text-muted-foreground">© 2026 edXponential. Built for visionary leaders.</p>
            <div className="flex items-center gap-6">
              {['Twitter', 'LinkedIn', 'GitHub'].map(platform => (
                <SafeLink
                  key={platform}
                  href={`https://${platform.toLowerCase()}.com/edxponential`}
                  external
                  newTab
                  className="text-xs text-muted-foreground hover:text-black transition"
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