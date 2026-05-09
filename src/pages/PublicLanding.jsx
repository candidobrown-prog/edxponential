import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Menu, X, ChevronDown, Check, Users, Zap,
  BookOpen, BarChart3, Shield, Lightbulb, MessageCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';

export default function PublicLanding() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [requestAccessOpen, setRequestAccessOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    role: '',
    school: '',
    email: '',
    reason: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleRequestAccess = async (e) => {
    e.preventDefault();
    try {
      await base44.entities.EmailCapture.create({
        email: formData.email,
        full_name: formData.fullName,
        role: formData.role,
        source: 'landing_request_access'
      });
      
      // Send confirmation email
      try {
        await base44.integrations.Core.SendEmail({
          to: formData.email,
          subject: 'Welcome to edXponential – Your Invitation is Coming',
          body: `Hi ${formData.fullName},\n\nThank you for requesting access to edXponential! We're excited to have you join our community of educators and leaders.\n\nOur team will review your request and send you an invitation link within 24 hours. Once you receive it, you'll be able to set up your account and start exploring the platform.\n\nIn the meantime, feel free to reach out with any questions.\n\nBest regards,\nThe edXponential Team`
        });
      } catch (emailError) {
        console.warn('Could not send confirmation email:', emailError);
      }
      
      setSubmitted(true);
      setTimeout(() => {
        setRequestAccessOpen(false);
        setSubmitted(false);
        setFormData({ fullName: '', role: '', school: '', email: '', reason: '' });
      }, 3000);
    } catch (error) {
      console.error('Error submitting request:', error);
    }
  };

  const features = [
    {
      icon: BookOpen,
      title: 'Smart Curriculum',
      description: 'AI-powered course building and content generation'
    },
    {
      icon: BarChart3,
      title: 'Real-Time Analytics',
      description: 'Dashboard insights into student progress and outcomes'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Built-in tools for teachers, staff, and administrators'
    },
    {
      icon: Zap,
      title: 'Fast Performance',
      description: 'Lightning-quick load times and seamless navigation'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-level encryption and data protection'
    },
    {
      icon: Lightbulb,
      title: 'AI Assistant',
      description: 'Get help anytime with our built-in Eddy assistant'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Principal, Lincoln High School',
      quote: 'This platform transformed how we track student progress. We\'ve seen a 28% improvement in data-driven decision making.'
    },
    {
      name: 'Marcus Johnson',
      role: 'EdTech Founder',
      quote: 'The AI insights are game-changing. We\'re saving hours every week on curriculum planning.'
    },
    {
      name: 'Dr. Elena Rodriguez',
      role: 'District Superintendent',
      quote: 'Enterprise-grade security with simple, elegant design. This is exactly what education needed.'
    }
  ];

  const pricingTiers = [
    {
      name: 'Starter',
      price: '$99',
      period: '/month',
      description: 'Perfect for small teams',
      features: ['Up to 50 students', 'Basic analytics', 'Team collaboration', 'Email support']
    },
    {
      name: 'Professional',
      price: '$299',
      period: '/month',
      description: 'For growing schools',
      features: ['Up to 500 students', 'Advanced analytics', 'AI curriculum builder', 'Priority support', 'Custom integrations'],
      highlighted: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For districts & large organizations',
      features: ['Unlimited students', 'Full analytics suite', 'Dedicated support', 'Custom SIS integration', 'On-premise options']
    }
  ];

  const faqs = [
    {
      q: 'How do I get started?',
      a: 'Click "Request Access" above, and our team will send you an invitation within 24 hours. Then you\'ll go through our quick onboarding to set up your account.'
    },
    {
      q: 'Is my data secure?',
      a: 'Yes. We use industry-leading encryption, FERPA compliance, and regular security audits. Your data is never sold or shared.'
    },
    {
      q: 'Can I import existing data?',
      a: 'Absolutely. We support CSV, Excel, and direct integration with most major SIS platforms. Our import wizard makes it painless.'
    },
    {
      q: 'What kind of support do you offer?',
      a: 'All tiers include email support and access to our AI assistant. Professional and Enterprise plans get priority support and a dedicated account manager.'
    },
    {
      q: 'Do you offer a free trial?',
      a: 'Yes. Request access and we\'ll set you up with a 30-day trial of the Professional plan.'
    }
  ];

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-black/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center">
              <span className="text-white font-black text-lg">E</span>
            </div>
            <span className="font-black text-xl hidden sm:inline">edXponential</span>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm hover:text-black/70 transition">Features</a>
            <a href="#pricing" className="text-sm hover:text-black/70 transition">Pricing</a>
            <a href="#faq" className="text-sm hover:text-black/70 transition">FAQ</a>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => base44.auth.redirectToLogin('/dashboard')}
              className="text-sm px-4 py-2 hover:bg-black/5 rounded-lg transition"
            >
              Sign In
            </button>
            <button
              onClick={() => setRequestAccessOpen(true)}
              className="text-sm px-4 py-2 bg-black text-white rounded-lg hover:bg-black/90 transition"
            >
              Request Access
            </button>
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
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
                <a href="#features" className="block text-sm hover:text-black/70">Features</a>
                <a href="#pricing" className="block text-sm hover:text-black/70">Pricing</a>
                <a href="#faq" className="block text-sm hover:text-black/70">FAQ</a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/2 to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-black leading-tight mb-6"
          >
            The Future of Education is Here
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl md:text-2xl text-black/60 mb-8 leading-relaxed"
          >
            AI-powered platform for schools and educators. Smart curriculum, real-time insights, and tools that actually work.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <button
              onClick={() => setRequestAccessOpen(true)}
              className="px-8 py-4 bg-black text-white rounded-lg font-semibold hover:bg-black/90 transition flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              Get Started Free <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => base44.auth.redirectToLogin('/dashboard')}
              className="px-8 py-4 border border-black/20 rounded-lg font-semibold hover:bg-black/5 transition w-full sm:w-auto"
            >
              View Demo
            </button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-sm text-black/50 mt-6"
          >
            Free 30-day trial. No credit card required.
          </motion.p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 bg-black/2">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4">Everything You Need</h2>
            <p className="text-xl text-black/60 max-w-2xl mx-auto">
              Built for educators, by educators. Powerful enough for districts, simple enough for single teachers.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="p-8 rounded-xl bg-white border border-black/10 hover:border-black/30 hover:shadow-lg transition"
                >
                  <div className="w-12 h-12 rounded-lg bg-black flex items-center justify-center text-white mb-6">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-black/60">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4">Loved by Educators</h2>
            <p className="text-xl text-black/60">See what schools and leaders are saying</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="p-8 rounded-xl bg-white border border-black/10"
              >
                <p className="text-lg mb-6 italic text-black/80">"{testimonial.quote}"</p>
                <div>
                  <p className="font-bold">{testimonial.name}</p>
                  <p className="text-sm text-black/60">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6 bg-black/2">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-black/60">Choose the plan that fits your needs</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingTiers.map((tier, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className={`p-8 rounded-xl transition ${
                  tier.highlighted
                    ? 'bg-black text-white border-2 border-black transform scale-105'
                    : 'bg-white border border-black/10'
                }`}
              >
                <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                <p className={tier.highlighted ? 'text-white/70' : 'text-black/60'}>{tier.description}</p>
                <div className="my-6">
                  <span className="text-5xl font-black">{tier.price}</span>
                  {tier.period && <span className={tier.highlighted ? 'text-white/70' : 'text-black/60'}>{tier.period}</span>}
                </div>
                <button
                  onClick={() => setRequestAccessOpen(true)}
                  className={`w-full py-3 rounded-lg font-semibold mb-8 transition ${
                    tier.highlighted
                      ? 'bg-white text-black hover:bg-white/90'
                      : 'bg-black text-white hover:bg-black/90'
                  }`}
                >
                  Get Started
                </button>
                <ul className="space-y-3">
                  {tier.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-3">
                      <Check className="w-5 h-5 flex-shrink-0" />
                      <span className={tier.highlighted ? 'text-white/90' : ''}>{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4">Frequently Asked Questions</h2>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                  className="w-full p-6 rounded-xl bg-white border border-black/10 hover:border-black/30 transition text-left flex items-center justify-between group"
                >
                  <span className="font-semibold">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 transition transform group-hover:text-black/70 ${
                      expandedFaq === i ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {expandedFaq === i && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-black/2 border border-t-0 border-black/10 rounded-b-xl"
                    >
                      <p className="p-6 text-black/70">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-black mb-6">Ready to Transform Your School?</h2>
            <p className="text-xl text-white/70 mb-8">
              Join hundreds of educators already using edXponential to improve student outcomes.
            </p>
            <button
              onClick={() => {
                window.scrollTo(0, 0);
                setRequestAccessOpen(true);
              }}
              className="px-8 py-4 bg-white text-black rounded-lg font-semibold hover:bg-white/90 transition inline-flex items-center gap-2"
            >
              Request Access Now <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-black/10 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center text-white text-sm font-black">E</div>
                <span className="font-black">edXponential</span>
              </div>
              <p className="text-black/60 text-sm">The future of education platform.</p>
            </div>
            <div>
              <p className="font-semibold mb-4">Product</p>
              <ul className="space-y-2 text-sm text-black/60">
                <li><a href="#features" className="hover:text-black">Features</a></li>
                <li><a href="#pricing" className="hover:text-black">Pricing</a></li>
                <li><a href="#faq" className="hover:text-black">FAQ</a></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold mb-4">Company</p>
              <ul className="space-y-2 text-sm text-black/60">
                <li><a href="/" className="hover:text-black">About</a></li>
                <li><a href="/" className="hover:text-black">Blog</a></li>
                <li><a href="/" className="hover:text-black">Careers</a></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold mb-4">Legal</p>
              <ul className="space-y-2 text-sm text-black/60">
                <li><a href="/" className="hover:text-black">Privacy</a></li>
                <li><a href="/" className="hover:text-black">Terms</a></li>
                <li><a href="/" className="hover:text-black">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-black/10 pt-8 text-center text-sm text-black/60">
            <p>© 2026 edXponential. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Request Access Modal */}
      <AnimatePresence>
        {requestAccessOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6"
            onClick={() => setRequestAccessOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl max-w-md w-full p-8"
            >
              {!submitted ? (
                <>
                  <h2 className="text-2xl font-black mb-2">Request Access</h2>
                  <p className="text-black/60 mb-6">Join our community. We'll send you an invitation within 24 hours.</p>

                  <form onSubmit={handleRequestAccess} className="space-y-4">
                    <input
                      type="text"
                      placeholder="Full Name"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />
                    <input
                      type="email"
                      placeholder="Work Email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />
                    <select
                      required
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
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
                      value={formData.school}
                      onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />
                    <select
                      required
                      value={formData.reason}
                      onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                      className="w-full px-4 py-3 border border-black/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    >
                      <option value="">Why do you want to join?</option>
                      <option value="curriculum">Improve curriculum</option>
                      <option value="analytics">Better analytics</option>
                      <option value="collaboration">Team collaboration</option>
                      <option value="automation">Automate workflows</option>
                      <option value="explore">Just exploring</option>
                    </select>
                    <button
                      type="submit"
                      className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-black/90 transition"
                    >
                      Request Access
                    </button>
                  </form>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="w-12 h-12 rounded-full bg-black/10 flex items-center justify-center mx-auto mb-4">
                    <Check className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Thank You!</h3>
                  <p className="text-black/60">Check your email for your invitation. We'll be in touch within 24 hours.</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}