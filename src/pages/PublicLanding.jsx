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

export default function PublicLanding() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [activeFeature, setActiveFeature] = useState(0);
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
      {/* ============ NAVIGATION ============ */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/80 border-b border-black/10"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 group cursor-pointer"
            onClick={() => navigate('/')}
          >
            <img 
              src="https://media.base44.com/images/public/69f64dbf5c37a4db77e0e302/21d29b7f0_64B1F443-0AD3-403D-B726-ABEF11D14419.png" 
              alt="edXponential" 
              className="h-7 w-auto"
            />
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <motion.button
                key={link.label}
                onClick={() => scrollToElement(link.href.slice(1))}
                whileHover={{ scale: 1.05 }}
                className="text-sm font-medium hover:text-black/70 transition"
              >
                {link.label}
              </motion.button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate('/dashboard')}
              className="hidden sm:block text-sm px-4 py-2 hover:bg-black/5 rounded-lg transition"
            >
              Sign In
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => scrollToElement('request-access')}
              className="text-sm px-6 py-2 bg-black text-white rounded-lg font-semibold hover:bg-black/80 transition"
            >
              Request Access
            </motion.button>
            <motion.button
              className="md:hidden"
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
              className="md:hidden border-t border-black/10 bg-white"
            >
              <div className="px-6 py-4 space-y-3">
                {navLinks.map((link) => (
                  <button
                    key={link.label}
                    onClick={() => scrollToElement(link.href.slice(1))}
                    className="block w-full text-left text-sm font-medium hover:text-black/70 py-2"
                  >
                    {link.label}
                  </button>
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
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-black/10 bg-black/2 mb-8"
            >
              <Rocket className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">The Future of Education</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="display-1 mb-8 leading-[1.1]"
            >
              The Future of Education Starts Here
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="subtitle text-black/70 max-w-md mb-12"
            >
              edXponential is the all-in-one AI-powered ecosystem helping educators, founders, principals, and innovators build better schools, stronger systems, thriving communities, and transformational outcomes.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 mb-16"
            >
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => scrollToElement('request-access')}
                className="px-8 py-4 bg-black text-white rounded-lg font-semibold hover:shadow-xl transition-all flex items-center justify-center gap-2 text-lg"
              >
                Request Access <ArrowRight className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                className="px-8 py-4 border-2 border-black rounded-lg font-semibold hover:bg-black/2 transition flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4" /> Watch Demo
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
                    className="flex items-center gap-3 text-sm"
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
                className="absolute top-0 right-0 w-48 h-40 bg-white border border-black/10 rounded-2xl p-6 shadow-lg"
              >
                <div className="text-xs font-semibold text-black/60 mb-4">AI Dashboard</div>
                <div className="space-y-2">
                  <div className="h-2 bg-black/10 rounded w-24" />
                  <div className="h-2 bg-black/10 rounded w-32" />
                  <div className="h-2 bg-black/10 rounded w-20" />
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 20, 0] }}
                transition={{ repeat: Infinity, duration: 5, delay: 1 }}
                className="absolute top-40 left-0 w-48 h-40 bg-white border border-black/10 rounded-2xl p-6 shadow-lg"
              >
                <div className="text-xs font-semibold text-black/60 mb-4">Communities</div>
                <div className="flex gap-2">
                  <div className="w-8 h-8 bg-black/10 rounded-full" />
                  <div className="w-8 h-8 bg-black/10 rounded-full" />
                  <div className="w-8 h-8 bg-black/10 rounded-full" />
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ repeat: Infinity, duration: 4.5, delay: 0.5 }}
                className="absolute bottom-0 right-12 w-48 h-40 bg-white border border-black/10 rounded-2xl p-6 shadow-lg"
              >
                <div className="text-xs font-semibold text-black/60 mb-4">Analytics</div>
                <div className="h-16 bg-black/5 rounded" />
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
            <h2 className="heading-1 mb-6">Powerful Features Built for You</h2>
            <p className="text-xl text-black/70 max-w-2xl mx-auto font-medium">
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
                <div className="w-14 h-14 rounded-xl bg-black/5 flex items-center justify-center mb-6 group-hover:bg-black/10 transition-colors">
                  <Icon className="w-7 h-7 text-black" />
                </div>
                <h3 className="heading-2 mb-4 group-hover:text-black transition">{feature.title}</h3>
                <p className="text-black/70 mb-6 leading-relaxed">{feature.description}</p>
                <motion.button
                  whileHover={{ x: 4 }}
                  className="text-sm font-semibold text-black flex items-center gap-2 hover:gap-3 transition-all"
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
      <section id="ask-eddy" className="py-32 px-6 bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/10 mb-6">
              <Brain className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">AI Assistant</span>
            </div>
            <h2 className="display-2 mb-6">Meet Ask Eddy</h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto font-medium">
              Your personal AI education advisor. Get real-time guidance on school operations, curriculum design, leadership challenges, and strategic planning.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden border border-white/20 shadow-2xl"
          >
            <div className="bg-white/5 backdrop-blur p-8 md:p-12">
              <div className="space-y-6">
                {/* Chat simulation */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="h-4 bg-white/20 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-white/20 rounded w-full" />
                  </div>
                </div>
                <div className="flex gap-4 justify-end">
                  <div className="flex-1 text-right">
                    <div className="h-4 bg-white/30 rounded w-3/4 ml-auto mb-2" />
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
              <div key={i} className="p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur">
                <h4 className="font-semibold mb-2">{item.title}</h4>
                <p className="text-sm text-white/70">{item.desc}</p>
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
            <h2 className="heading-1 mb-6">Membership for Every Path</h2>
            <p className="text-xl text-black/70 max-w-2xl mx-auto font-medium">
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
                    ? 'border-black bg-black text-white shadow-2xl md:col-span-3 md:max-w-md md:mx-auto'
                    : 'border-black/10 bg-white hover:shadow-xl hover:border-black/20'
                }`}
              >
                {tier.highlight && (
                  <div className="text-xs font-black uppercase tracking-wider text-white/60 mb-4">
                    Most Popular
                  </div>
                )}

                <h3 className="heading-2 mb-2">{tier.name}</h3>
                <p className={`text-sm mb-6 ${tier.highlight ? 'text-white/70' : 'text-black/70'}`}>
                  {tier.description}
                </p>

                <div className="mb-2">
                  <span className="display-2">{tier.price}</span>
                  {tier.period && (
                    <span className={tier.highlight ? 'text-white/70' : 'text-black/70'}>
                      {tier.period}
                    </span>
                  )}
                </div>
                
                {tier.trial && (
                  <p className={`text-xs mb-8 font-medium ${tier.highlight ? 'text-white/60' : 'text-black/60'}`}>
                    {tier.trial}
                  </p>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  className={`w-full py-3 rounded-lg font-semibold mb-8 transition-all ${
                    tier.highlight
                      ? 'bg-white text-black hover:bg-white/90'
                      : 'bg-black text-white hover:bg-black/80'
                  }`}
                >
                  {tier.cta}
                </motion.button>

                <ul className="space-y-3 flex-1">
                  {tier.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-3 text-sm">
                      <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
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
            <h2 className="heading-1 mb-6">Join Global Communities</h2>
            <p className="text-xl text-black/70 max-w-2xl mx-auto font-medium">
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
                className="p-8 rounded-2xl bg-white border border-black/10 hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-xl bg-black/5 flex items-center justify-center mb-4 group-hover:bg-black/10 transition-colors">
                  <Icon className="w-6 h-6 text-black" />
                </div>
                <h3 className="heading-2 mb-2">{community.name}</h3>
                <p className="text-sm text-black/70 mb-4">{community.members} members</p>
                <motion.button
                  whileHover={{ x: 4 }}
                  className="text-sm font-semibold flex items-center gap-2 hover:gap-3 transition-all"
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
            <h2 className="heading-1 mb-6">Upcoming Events</h2>
            <p className="text-xl text-black/70 max-w-2xl mx-auto font-medium">
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
                className="p-8 rounded-2xl bg-white border border-black/10 hover:shadow-lg transition-all"
              >
                <h3 className="heading-2 mb-6">{event.name}</h3>
                <div className="space-y-4 text-sm text-black/70">
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
                  className="mt-6 w-full py-3 bg-black text-white rounded-lg font-semibold hover:bg-black/80 transition"
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
            <h2 className="heading-1 mb-6">EduCartX Marketplace</h2>
            <p className="text-xl text-black/70 max-w-2xl mx-auto font-medium">
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
                className="p-8 rounded-2xl bg-white border border-black/10 hover:shadow-lg transition-all text-center cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-black/5 flex items-center justify-center mb-4 mx-auto group-hover:bg-black/10 transition-colors">
                  <Icon className="w-6 h-6 text-black" />
                </div>
                <h3 className="heading-3 mb-2">{category.name}</h3>
                <p className="text-lg font-black text-black/70">{category.count}</p>
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
            <h2 className="heading-1 mb-6">Stories of Transformation</h2>
            <p className="text-xl text-black/70 max-w-2xl mx-auto font-medium">
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
                className="p-8 rounded-2xl bg-white border border-black/10 hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-black/10 flex items-center justify-center flex-shrink-0 text-xs font-bold text-black/60">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-black/70">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-black" />
                  ))}
                </div>
                <p className="text-black/80 italic">"{testimonial.quote}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ REQUEST ACCESS SECTION ============ */}
      <section id="request-access" className="py-32 px-6 bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>

        <div className="max-w-2xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="display-2 mb-6">Join edXponential Today</h2>
            <p className="text-xl text-white/80 font-medium">
              Be part of the movement transforming education. Request access and join thousands of leaders building the future.
            </p>
          </motion.div>

          {!submitted ? (
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
                className="w-full px-6 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition"
              />
              <input
                type="email"
                placeholder="Work Email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-6 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition"
              />
              <select
                required
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-6 py-4 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-white/50 transition"
              >
                <option value="" className="text-black">Select Your Role</option>
                <option value="principal" className="text-black">Principal/Administrator</option>
                <option value="teacher" className="text-black">Teacher/Educator</option>
                <option value="founder" className="text-black">School Founder</option>
                <option value="investor" className="text-black">Investor</option>
                <option value="other" className="text-black">Other</option>
              </select>
              <input
                type="text"
                placeholder="School or Organization"
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                className="w-full px-6 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition"
              />
              <select
                required
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                className="w-full px-6 py-4 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-white/50 transition"
              >
                <option value="" className="text-black">Why do you want to join?</option>
                <option value="operations" className="text-black">Improve school operations</option>
                <option value="growth" className="text-black">Scale growth</option>
                <option value="community" className="text-black">Join the community</option>
                <option value="explore" className="text-black">Just exploring</option>
              </select>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-white text-black rounded-xl font-bold text-lg hover:bg-white/90 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Request Access'}
              </motion.button>
            </motion.form>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="display-3 mb-4">Thank You!</h3>
              <p className="text-xl text-white/80">Check your email for next steps. We'll send your invitation within 24 hours.</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="border-t border-black/10 py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <img 
                  src="https://media.base44.com/images/public/69f64dbf5c37a4db77e0e302/21d29b7f0_64B1F443-0AD3-403D-B726-ABEF11D14419.png" 
                  alt="edXponential" 
                  className="h-7 w-auto"
                />
              </div>
              <p className="text-sm text-black/70">
                The AI-powered operating system for education leaders and innovators.
              </p>
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-wider text-black/70 mb-4">Platform</p>
              <ul className="space-y-3 text-sm">
                <li><button className="hover:text-black/70 transition">Features</button></li>
                <li><button className="hover:text-black/70 transition">Solutions</button></li>
                <li><button className="hover:text-black/70 transition">Pricing</button></li>
              </ul>
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-wider text-black/70 mb-4">Resources</p>
              <ul className="space-y-3 text-sm">
                <li><button className="hover:text-black/70 transition">Documentation</button></li>
                <li><button className="hover:text-black/70 transition">Blog</button></li>
                <li><button className="hover:text-black/70 transition">Support</button></li>
              </ul>
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-wider text-black/70 mb-4">Legal</p>
              <ul className="space-y-3 text-sm">
                <li><button className="hover:text-black/70 transition">Privacy</button></li>
                <li><button className="hover:text-black/70 transition">Terms</button></li>
                <li><button className="hover:text-black/70 transition">Contact</button></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-black/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-black/60">© 2026 edXponential. The future of education, built today.</p>
            <div className="flex gap-6">
              <button className="text-xs text-black/70 hover:text-black transition">Twitter</button>
              <button className="text-xs text-black/70 hover:text-black transition">LinkedIn</button>
              <button className="text-xs text-black/70 hover:text-black transition">GitHub</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}