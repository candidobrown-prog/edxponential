import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Menu, X, ChevronDown, Star, Users, TrendingUp, Zap,
  CheckCircle, MessageCircle, Brain, Rocket, Target, Code, Briefcase,
  School, BookOpen, BarChart3, Play, Gift, Calendar, MapPin, Clock, FileText, Folder, ShoppingCart
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Solutions', href: '#solutions' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Communities', href: '#communities' },
  { label: 'Marketplace', href: '#marketplace' },
  { label: 'About', href: '#about' },
];

const trustIndicators = [
  { icon: Brain, text: 'AI-Powered' },
  { icon: Users, text: 'Built for Educators' },
  { icon: CheckCircle, text: 'Enterprise Secure' },
  { icon: Rocket, text: 'Premium Community' },
];

const features = [
  {
    title: 'Ask Eddy AI Assistant',
    description: 'Intelligent AI guidance for school operations, curriculum design, and strategic planning.',
    Icon: Brain,
    href: '#ask-eddy',
  },
  {
    title: 'FounderX',
    description: 'Complete school-building OS for founders. Strategic planning, pitching, and scaling.',
    Icon: Target,
    href: '#solutions',
  },
  {
    title: 'OperationX',
    description: 'School operations, HR, finance, facilities, and vendor management in one platform.',
    Icon: Code,
    href: '#solutions',
  },
  {
    title: 'OneJob',
    description: 'Education recruitment and employment marketplace for schools and districts.',
    Icon: Briefcase,
    href: '#marketplace',
  },
  {
    title: 'EduCartX',
    description: 'Education commerce platform for courses, resources, and digital products.',
    Icon: ShoppingCart,
    href: '#marketplace',
  },
  {
    title: 'edVestors',
    description: 'Investment network connecting education innovators with capital and advisors.',
    Icon: TrendingUp,
    href: '#communities',
  },
];

const tiers = [
  {
    name: 'Potentials',
    price: '$29',
    period: '/month',
    description: 'For learners and explorers',
    trial: '7-day free trial',
    features: ['Access to courses', 'Community basics', 'AI guidance', 'Resource library', 'Certificate program'],
    cta: 'Start Free Trial',
    color: 'from-slate-500 to-slate-600',
  },
  {
    name: 'Principal Park',
    price: '$49',
    period: '/month',
    description: 'For school leaders',
    trial: '7-day free trial',
    features: ['School dashboard', 'Team collaboration', 'AI guidance', 'Analytics suite', 'Priority support'],
    cta: 'Start Free Trial',
    highlight: true,
    color: 'from-primary to-primary/80',
  },
  {
    name: 'Founders Sphere',
    price: '$99',
    period: '/month',
    description: 'For founders and entrepreneurs',
    trial: '7 days for $19',
    features: ['School builder tools', 'Pitch optimization', 'Board support', 'Founder network', 'AI planning', 'Investor directory'],
    cta: 'Start Trial',
    color: 'from-crimson-accent-DEFAULT to-crimson-accent-dark',
  },
  {
    name: 'Executive Entourage',
    price: '$129',
    period: '/month',
    description: 'For district leaders and executives',
    trial: '7-day free trial',
    features: ['Full district OS', 'Advanced analytics', 'Team management', 'Executive dashboards', '24/7 support', 'Custom integrations'],
    cta: 'Start Free Trial',
    color: 'from-purple-600 to-purple-700',
  },
  {
    name: 'edVisors',
    price: 'Apply',
    period: '',
    description: 'Elite advisory network for educators',
    trial: '$99 acceptance fee + $249/month',
    features: ['Premium coaching platform', 'Revenue sharing (up to $15K/month)', 'Private community', 'Course hosting', 'Lead generation'],
    cta: 'Apply Now',
    color: 'from-orange-600 to-orange-700',
  },
  {
    name: 'edVestors',
    price: 'Custom',
    period: '',
    description: 'Invitation-based investor platform',
    trial: 'Private pricing',
    features: ['Deal room access', 'Founder network', 'Investment opportunities', 'Due diligence tools', 'Custom dashboard'],
    cta: 'Request Invite',
    color: 'from-emerald-600 to-emerald-700',
  },
];

const stats = [
  { label: 'Schools Supported', value: '500+' },
  { label: 'Leaders Connected', value: '15K+' },
  { label: 'Hours Saved', value: '2M+' },
  { label: 'Revenue Generated', value: '$50M+' },
];

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Principal, Lincoln High',
    quote: 'edXponential transformed how we operate. The AI guidance alone saved us 20 hours a week.',
    avatar: 'SC',
    rating: 5,
  },
  {
    name: 'Marcus Johnson',
    role: 'School Founder & CEO',
    quote: 'I built three schools before. This platform accelerated our growth by 18 months.',
    avatar: 'MJ',
    rating: 5,
  },
  {
    name: 'Dr. Elena Rodriguez',
    role: 'District Superintendent',
    quote: 'Moving faster, leading stronger, driving results. That\'s not marketing—that\'s reality.',
    avatar: 'ER',
    rating: 5,
  },
];

const events = [
  {
    name: 'Annual EdXponential Summit',
    date: 'June 15-17, 2026',
    location: 'San Francisco, CA',
    attendees: '2,000+',
  },
  {
    name: 'Founder Fast Track Cohort',
    date: 'July 1 - September 30, 2026',
    location: 'Virtual + In-person',
    attendees: '50',
  },
  {
    name: 'Principal Leadership Retreat',
    date: 'August 8-10, 2026',
    location: 'Aspen, CO',
    attendees: '100+',
  },
];

import RequestAccessModal from '../components/landing/RequestAccessModal';

export default function PublicLanding() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [activeFeature, setActiveFeature] = useState(0);
  const [showAccessModal, setShowAccessModal] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    role: '',
    organization: '',
    email: '',
    reason: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRequestAccess = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await base44.entities.EmailCapture.create({
        email: formData.email,
        full_name: formData.fullName,
        role: formData.role,
        source: 'landing_request_access',
      });

      try {
        await base44.integrations.Core.SendEmail({
          to: formData.email,
          subject: 'Welcome to edXponential – Your Journey Begins',
          body: `Hi ${formData.fullName},\n\nThank you for requesting access to edXponential. We're thrilled to have you join our community.\n\nOur team will review your request and send you an invitation within 24 hours. Once you receive it, you'll gain immediate access to the full platform.\n\nIn the meantime, feel free to explore our resources and reach out with any questions.\n\nBest regards,\nThe edXponential Team`,
        });
      } catch (emailError) {
        console.warn('Email send error:', emailError);
      }

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ fullName: '', role: '', organization: '', email: '', reason: '' });
      }, 3000);
    } catch (error) {
      console.error('Error submitting request:', error);
    } finally {
      setLoading(false);
    }
  };

  // Scroll to element
  const scrollToElement = (elementId) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black overflow-x-hidden">
      {/* ============ TOP INFO BAR ============ */}
      <div className="border-b border-black/8 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid md:grid-cols-4 gap-12 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm font-black text-black">edXponential</span>
              </div>
              <p className="text-xs text-black/60">
                The world's first human- and AI-powered all-inclusive platform for education leaders.
              </p>
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-wider text-black/50 mb-3">Platform</p>
              <ul className="space-y-2 text-xs">
                <li><button className="text-black/70 hover:text-black transition">Features</button></li>
                <li><button className="text-black/70 hover:text-black transition">Solutions</button></li>
                <li><button className="text-black/70 hover:text-black transition">Pricing</button></li>
              </ul>
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-wider text-black/50 mb-3">Resources</p>
              <ul className="space-y-2 text-xs">
                <li><button className="text-black/70 hover:text-black transition">Documentation</button></li>
                <li><button className="text-black/70 hover:text-black transition">Blog</button></li>
                <li><button className="text-black/70 hover:text-black transition">Support</button></li>
              </ul>
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-wider text-black/50 mb-3">Legal</p>
              <ul className="space-y-2 text-xs">
                <li><button className="text-black/70 hover:text-black transition">Privacy</button></li>
                <li><button className="text-black/70 hover:text-black transition">Terms</button></li>
                <li><button className="text-black/70 hover:text-black transition">Contact</button></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-black/8 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[11px] text-black/40">© 2026 edXponential. The future of education, built today.</p>
            <div className="flex gap-6">
              <button className="text-xs text-black/50 hover:text-black transition">Twitter</button>
              <button className="text-xs text-black/50 hover:text-black transition">LinkedIn</button>
              <button className="text-xs text-black/50 hover:text-black transition">GitHub</button>
            </div>
          </div>
        </div>
      </div>

      {/* ============ NAVIGATION ============ */}
      <motion.nav
       initial={{ y: -100 }}
       animate={{ y: 0 }}
       className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-white/95 border-b border-black/8"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 group cursor-pointer"
            onClick={() => navigate('/')}
          >
            <span className="text-lg font-black text-black">edXponential</span>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <motion.a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToElement(link.href.slice(1));
                }}
                whileHover={{ scale: 1.05 }}
                className="text-sm font-medium text-black/70 hover:text-black transition cursor-pointer"
              >
                {link.label}
              </motion.a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate('/dashboard')}
              className="hidden sm:block text-sm px-4 py-2 text-black/60 hover:text-black transition"
            >
              Sign In
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setShowAccessModal(true)}
              className="text-sm px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition"
            >
              Request Access
            </motion.button>
            <motion.button
              className="md:hidden text-black"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              whileHover={{ scale: 1.1 }}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden border-t border-black/8 bg-white"
            >
              <div className="px-6 py-4 space-y-3">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToElement(link.href.slice(1));
                    }}
                    className="block w-full text-left text-sm font-medium text-black/70 hover:text-black py-2 cursor-pointer"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* ============ HERO SECTION ============ */}
      <section className="pt-40 pb-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/2 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-black/10 bg-black/4 mb-8"
            >
              <Rocket className="w-4 h-4 text-black/70" />
              <span className="text-xs font-semibold uppercase tracking-wider text-black/70">The Future of Education</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="display-1 mb-8 leading-[1.1] text-black"
            >
              The Operating System<br />for the Future of Education.
            </motion.h1>



            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 mb-16"
            >
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowAccessModal(true)}
                className="px-8 py-4 bg-primary text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 text-lg hover:bg-primary/90"
              >
                Request Access <ArrowRight className="w-5 h-5" />
              </motion.button>
            </motion.div>

            {/* Trust Indicators */}
            <div className="space-y-3">
              {trustIndicators.map((indicator, i) => {
                const Icon = indicator.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.05 }}
                    className="flex items-center gap-3 text-sm text-black/70"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{indicator.text}</span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Right Side - Interactive Preview */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative hidden md:block"
          >
            <div className="relative h-96">
              {/* Floating dashboard cards */}
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ repeat: Infinity, duration: 4 }}
                className="absolute top-0 right-0 w-48 h-40 bg-white border border-black/10 rounded-2xl p-6 shadow-md"
              >
                <div className="text-xs font-semibold text-black/60 mb-4">AI Dashboard</div>
                <div className="space-y-2">
                  <div className="h-2 bg-black/8 rounded w-24" />
                  <div className="h-2 bg-black/8 rounded w-32" />
                  <div className="h-2 bg-black/8 rounded w-20" />
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 20, 0] }}
                transition={{ repeat: Infinity, duration: 5, delay: 1 }}
                className="absolute top-40 left-0 w-48 h-40 bg-white border border-black/10 rounded-2xl p-6 shadow-md"
              >
                <div className="text-xs font-semibold text-black/60 mb-4">Communities</div>
                <div className="flex gap-2">
                  <div className="w-8 h-8 bg-primary/15 rounded-full" />
                  <div className="w-8 h-8 bg-primary/15 rounded-full" />
                  <div className="w-8 h-8 bg-primary/15 rounded-full" />
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ repeat: Infinity, duration: 4.5, delay: 0.5 }}
                className="absolute bottom-0 right-12 w-48 h-40 bg-white border border-black/10 rounded-2xl p-6 shadow-md"
              >
                <div className="text-xs font-semibold text-black/60 mb-4">Analytics</div>
                <div className="h-16 bg-black/4 rounded" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ SOCIAL PROOF ============ */}
      <section className="py-20 px-6 bg-black/2">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="display-2 text-black mb-2">{stat.value}</div>
                <p className="text-sm text-black/60">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============ FEATURES SECTION ============ */}
      <section id="features" className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-24"
          >
            <h2 className="heading-1 mb-6 text-black">Powerful Features Built for You</h2>
            <p className="text-xl text-black/60 max-w-2xl mx-auto font-medium">
              From AI-powered guidance to school operations, we've built everything you need to thrive.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-16">
            {features.map((feature, i) => {
              const Icon = feature.Icon;
              return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                className="group cursor-pointer"
              >
                <div className="w-14 h-14 rounded-xl bg-black/8 flex items-center justify-center mb-6 group-hover:bg-black/12 transition-colors">
                  <Icon className="w-7 h-7 text-black" />
                </div>
                <h3 className="heading-2 mb-4 text-black group-hover:text-primary transition">{feature.title}</h3>
                <p className="text-black/60 mb-6 leading-relaxed">{feature.description}</p>
                <motion.button
                  whileHover={{ x: 4 }}
                   className="text-sm font-semibold text-primary flex items-center gap-2 hover:gap-3 transition-all"
                >
                  Learn More <ArrowRight className="w-4 h-4" />
                </motion.button>
              </motion.div>
            );
            })}
          </div>
        </div>
      </section>

      {/* ============ ASK EDDY SHOWCASE ============ */}
      <section id="ask-eddy" className="py-32 px-6 bg-black/3 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-black/12 bg-black/6 mb-6">
              <Brain className="w-4 h-4 text-black/70" />
              <span className="text-xs font-semibold uppercase tracking-wider text-black/70">AI Assistant</span>
            </div>
            <h2 className="display-2 mb-6 text-black">Meet Ask Eddy</h2>
            <p className="text-xl text-black/60 max-w-2xl mx-auto font-medium">
              Your personal AI education advisor. Get real-time guidance on school operations, curriculum design, leadership challenges, and strategic planning.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden border border-black/10 shadow-lg"
          >
            <div className="bg-white border border-black/8 p-8 md:p-12">
              <div className="space-y-6">
                {/* Chat simulation */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/15 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="h-4 bg-black/10 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-black/10 rounded w-full" />
                  </div>
                </div>
                <div className="flex gap-4 justify-end">
                  <div className="flex-1 text-right">
                    <div className="h-4 bg-primary/30 rounded w-3/4 ml-auto mb-2" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="grid md:grid-cols-3 gap-6 mt-16"
          >
            {[
              { title: 'Real-time Guidance', desc: 'Get instant advice on school operations' },
              { title: 'Curriculum Design', desc: 'AI-powered curriculum generation' },
              { title: 'Strategic Planning', desc: 'Plan school growth and improvement' },
            ].map((item, i) => (
              <div key={i} className="p-6 rounded-xl border border-black/10 bg-white">
                <h4 className="font-semibold mb-2 text-black">{item.title}</h4>
                <p className="text-sm text-black/60">{item.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============ PRICING SECTION ============ */}
      <section id="pricing" className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-24"
          >
            <h2 className="heading-1 mb-6 text-black">Membership for Every Path</h2>
            <p className="text-xl text-black/60 max-w-2xl mx-auto font-medium">
              Choose your membership. All tiers include world-class support and platform access.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {tiers.map((tier, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -8 }}
                className={`rounded-2xl p-8 transition-all border flex flex-col ${
                  tier.highlight
                    ? 'border-black bg-white text-black shadow-xl md:col-span-3 md:max-w-md md:mx-auto'
                    : 'border-black/12 bg-white hover:shadow-md hover:border-black/16'
                }`}
              >
                {tier.highlight && (
                  <div className={`text-xs font-black uppercase tracking-wider text-black/50 mb-4`}>
                    Most Popular
                  </div>
                )}

                <h3 className="heading-2 mb-2 text-black">{tier.name}</h3>
                <p className={`text-sm mb-6 ${tier.highlight ? 'text-black/70' : 'text-black/60'}`}>
                  {tier.description}
                </p>

                <div className="mb-2">
                  <span className="display-2 text-black">{tier.price}</span>
                  {tier.period && (
                    <span className={tier.highlight ? 'text-black/70' : 'text-black/60'}>
                      {tier.period}
                    </span>
                  )}
                </div>
                
                {tier.trial && (
                  <p className={`text-xs mb-8 font-medium text-black/60`}>
                    {tier.trial}
                  </p>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  className={`w-full py-3 rounded-lg font-semibold mb-8 transition-all ${
                    tier.highlight
                      ? 'bg-primary text-white hover:bg-primary/90'
                      : 'border border-black/12 text-black hover:bg-black/4'
                  }`}
                >
                  {tier.cta}
                </motion.button>

                <ul className="space-y-3 flex-1">
                  {tier.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-3 text-sm text-black/70">
                      <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ COMMUNITIES SECTION ============ */}
      <section id="communities" className="py-32 px-6 bg-black/2">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-24"
          >
            <h2 className="heading-1 mb-6 text-black">Join Global Communities</h2>
            <p className="text-xl text-black/60 max-w-2xl mx-auto font-medium">
              Connect with educators, founders, investors, and innovators. Share ideas, get support, scale impact.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              { name: 'Founder Circle', members: '2,000+', Icon: Rocket },
              { name: 'Principal Network', members: '5,000+', Icon: Briefcase },
              { name: 'Investor Group', members: '500+', Icon: TrendingUp },
              { name: 'Coach Alliance', members: '1,000+', Icon: BookOpen },
            ].map((community, i) => {
              const Icon = community.Icon;
              return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="p-8 rounded-2xl bg-white border border-black/10 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="heading-2 mb-2 text-black">{community.name}</h3>
                <p className="text-sm text-black/60 mb-4">{community.members} members</p>
                <motion.button
                  whileHover={{ x: 4 }}
                  className="text-sm font-semibold text-primary flex items-center gap-2 hover:gap-3 transition-all"
                >
                  Join Now <ArrowRight className="w-4 h-4" />
                </motion.button>
              </motion.div>
            );
            })}
          </div>
        </div>
      </section>

      {/* ============ EVENTS SECTION ============ */}
      <section className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-24"
          >
            <h2 className="heading-1 mb-6 text-black">Upcoming Events</h2>
            <p className="text-xl text-black/60 max-w-2xl mx-auto font-medium">
              Network, learn, and grow with education leaders from around the world.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {events.map((event, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="p-8 rounded-2xl bg-white border border-black/10 hover:shadow-md transition-all"
              >
                <h3 className="heading-2 mb-6 text-black">{event.name}</h3>
                <div className="space-y-4 text-sm text-black/60">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5" />
                    <span>{event.attendees} expected</span>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="mt-6 w-full py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition"
                >
                  Learn More
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ MARKETPLACE SECTION ============ */}
      <section id="marketplace" className="py-32 px-6 bg-black/2">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-24"
          >
            <h2 className="heading-1 mb-6 text-black">EduCartX Marketplace</h2>
            <p className="text-xl text-black/60 max-w-2xl mx-auto font-medium">
              Discover thousands of resources, courses, and tools built by educators for educators.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { name: 'Courses', count: '2,000+', Icon: BookOpen },
              { name: 'Templates', count: '5,000+', Icon: FileText },
              { name: 'Tools', count: '500+', Icon: Zap },
              { name: 'Resources', count: '10,000+', Icon: Folder },
            ].map((category, i) => {
              const Icon = category.Icon;
              return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="p-8 rounded-2xl bg-white border border-black/10 hover:shadow-md transition-all text-center cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 mx-auto group-hover:bg-primary/15 transition-colors">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="heading-3 mb-2 text-black">{category.name}</h3>
                <p className="text-lg font-black text-black/60">{category.count}</p>
              </motion.div>
            );
            })}
          </div>
        </div>
      </section>

      {/* ============ TESTIMONIALS SECTION ============ */}
      <section className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-24"
          >
            <h2 className="heading-1 mb-6 text-black">Stories of Transformation</h2>
            <p className="text-xl text-black/60 max-w-2xl mx-auto font-medium">
              Real leaders, real results, real impact.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-2xl bg-white border border-black/10 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0 text-xs font-bold text-primary">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold text-black">{testimonial.name}</h4>
                     <p className="text-sm text-black/60">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary" />
                  ))}
                </div>
                <p className="text-black/70 italic">"{testimonial.quote}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ REQUEST ACCESS SECTION ============ */}
      <section id="request-access" className="py-32 px-6 bg-black/5 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary rounded-full blur-3xl" />
        </div>

        <div className="max-w-2xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="display-2 mb-6 text-black">Join edXponential Today</h2>
            <p className="text-xl text-black/60 font-medium">
              Be part of the movement transforming education. Request access and join thousands of leaders building the future.
            </p>
          </motion.div>

          {!submitted ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowAccessModal(true)}
                className="w-full py-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-primary/90 transition"
              >
                Start Your Application
              </motion.button>
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              onSubmit={handleRequestAccess}
              className="space-y-4"
            >
              <input
                type="text"
                placeholder="Full Name"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-6 py-4 rounded-xl bg-white border border-black/10 text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
              />
              <input
                type="email"
                placeholder="Work Email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-6 py-4 rounded-xl bg-white border border-black/10 text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
              />
              <select
                required
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-6 py-4 rounded-xl bg-white border border-black/10 text-black focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
              >
                <option value="">Select Your Role</option>
                <option value="principal">Principal/Administrator</option>
                <option value="teacher">Teacher/Educator</option>
                <option value="founder">School Founder</option>
                <option value="investor">Investor</option>
                <option value="other">Other</option>
              </select>
              <input
                type="text"
                placeholder="School or Organization"
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                className="w-full px-6 py-4 rounded-xl bg-white border border-black/10 text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
              />
              <select
                required
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                className="w-full px-6 py-4 rounded-xl bg-white border border-black/10 text-black focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
              >
                <option value="">Why do you want to join?</option>
                <option value="operations">Improve school operations</option>
                <option value="growth">Scale growth</option>
                <option value="community">Join the community</option>
                <option value="explore">Just exploring</option>
              </select>
              <motion.button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-primary/90 disabled:opacity-50 transition"
              >
                {loading ? 'Submitting...' : 'Submit Application'}
              </motion.button>
            </motion.form>
          )}
        </div>
      </section>


    </div>
  );
}