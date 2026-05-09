import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Star, Zap, Crown, Shield, Users, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const PLANS = [
  {
    id: 'free',
    name: 'Explorer',
    price: 0,
    period: 'Free forever',
    tagline: 'Start your journey.',
    icon: BookOpen,
    color: 'border-white/8',
    features: [
      'Access public resources',
      'Browse edVisor marketplace',
      'Community read access',
      'Platform overview',
      'Basic AI prompts (5/mo)',
    ],
    cta: 'Start Free',
    highlight: false,
  },
  {
    id: 'principal',
    name: 'Principal Park™',
    price: 49,
    period: '/month',
    tagline: 'For school leaders ready to level up.',
    icon: Shield,
    color: 'border-white/8',
    features: [
      'Full Xschores™ access',
      'Daida Baixed™ intelligence',
      'Leadership coaching library',
      'Community full access',
      'AI reports (25/mo)',
      'Progress dashboards',
    ],
    cta: 'Join Principal Park',
    highlight: false,
  },
  {
    id: 'founders',
    name: 'Founders Sphere™',
    price: 149,
    period: '/month',
    tagline: 'For those building the next great school.',
    icon: Zap,
    color: 'border-white/20 bg-white/[0.03]',
    badge: 'Most Popular',
    features: [
      'Everything in Principal Park',
      'FoundationX™ charter builder',
      'Pitch Park investor access',
      'Board recruitment tools',
      'AI charter generation',
      'Deal room access',
      'Founders Sphere community',
      'Monthly mastermind calls',
      'AI reports (unlimited)',
    ],
    cta: 'Join Founders Sphere',
    highlight: true,
  },
  {
    id: 'exec',
    name: 'Executive Entourage™',
    price: 299,
    period: '/month',
    tagline: 'For executives demanding elite access.',
    icon: Crown,
    color: 'border-white/8',
    features: [
      'Everything in Founders Sphere',
      '1:1 edVisor sessions (2/mo)',
      'Executive community access',
      'Priority AI processing',
      'Custom AI personas',
      'Revenue share eligibility',
      'Direct CEO access',
      'Enterprise onboarding',
      'Dedicated account manager',
    ],
    cta: 'Join Exec Entourage',
    highlight: false,
  },
];

const FAQS = [
  { q: 'Can I switch plans?', a: 'Yes, you can upgrade or downgrade at any time. Changes take effect on your next billing cycle.' },
  { q: 'Is there a free trial?', a: 'Our Explorer plan is free forever. Paid plans include a 14-day money-back guarantee.' },
  { q: 'What payment methods do you accept?', a: 'We accept all major credit cards, ACH bank transfers, and educational purchase orders.' },
  { q: 'Can I get a demo?', a: 'Absolutely. Book a personalized walkthrough via our contact page — we love showing the platform in action.' },
  { q: 'Are there discounts for schools or districts?', a: 'Yes. We offer special institutional pricing for multi-seat and district-wide plans. Contact us.' },
];

export default function PublicPricing() {
  const [faqOpen, setFaqOpen] = useState(null);

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#080808]/95 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-15 flex items-center justify-between">
          <Link to="/welcome">
            <img src="https://media.base44.com/images/public/69f64dbf5c37a4db77e0e302/21d29b7f0_64B1F443-0AD3-403D-B726-ABEF11D14419.png"
              alt="edXponential" className="h-7 w-auto brightness-0 invert" />
          </Link>
          <div className="hidden md:flex items-center gap-8">
            {[['Features', '/welcome#features'], ['Pricing', '/pricing'], ['About', '/welcome']].map(([l, h]) => (
              <Link key={l} to={h} className="text-sm text-white/40 hover:text-white transition-colors">{l}</Link>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" className="text-sm text-white/40 hover:text-white transition-colors">Sign In</Link>
            <Link to="/onboarding">
              <button className="h-9 px-5 rounded-lg bg-white text-black text-sm font-semibold hover:bg-white/90 transition-all">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="pt-28 pb-32 px-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/8 bg-white/4 mb-6 text-[10px] text-white/40 font-bold tracking-widest uppercase">
            <Star className="w-3 h-3" /> Transparent Pricing
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-[-0.04em] leading-[0.92] mb-6">
            Choose your<br /><span className="text-white/25">membership.</span>
          </h1>
          <p className="text-white/35 text-lg max-w-xl mx-auto leading-relaxed mb-8">
            Every tier is built to compound your impact. No fluff. No paywalls on progress.
          </p>
          <Link to="/onboarding">
            <button className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors border border-white/10 px-4 py-2 rounded-lg hover:border-white/20">
              <Zap className="w-3.5 h-3.5" /> Not sure which plan? Get AI-powered recommendation
            </button>
          </Link>
        </motion.div>

        {/* Plans */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-24">
          {PLANS.map((plan, i) => (
            <motion.div key={plan.id}
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`relative rounded-2xl border p-7 flex flex-col ${plan.color} ${plan.highlight ? 'ring-1 ring-white/15' : ''}`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-white text-black text-[10px] font-black uppercase tracking-widest">
                  {plan.badge}
                </div>
              )}
              <div className="mb-6">
                <div className="w-9 h-9 rounded-xl bg-white/8 flex items-center justify-center mb-4">
                  <plan.icon className="w-4.5 h-4.5 text-white/60" />
                </div>
                <p className="text-xs text-white/30 uppercase tracking-widest font-bold mb-1">{plan.name}</p>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-black text-white">${plan.price}</span>
                  <span className="text-sm text-white/30">{plan.period}</span>
                </div>
                <p className="text-xs text-white/35 leading-relaxed">{plan.tagline}</p>
              </div>
              <ul className="space-y-2.5 flex-1 mb-8">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-2.5 text-xs text-white/50">
                    <CheckCircle className="w-3.5 h-3.5 text-white/30 flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/onboarding">
                <button className={`w-full h-10 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 group ${
                  plan.highlight ? 'bg-white text-black hover:bg-white/90' : 'border border-white/12 text-white/60 hover:border-white/25 hover:text-white'
                }`}>
                  {plan.cta} <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Enterprise */}
        <div className="max-w-4xl mx-auto mb-24">
          <div className="rounded-2xl border border-white/6 bg-white/[0.02] p-10 text-center">
            <div className="w-12 h-12 rounded-2xl bg-white/8 flex items-center justify-center mx-auto mb-5">
              <Users className="w-6 h-6 text-white/50" />
            </div>
            <h3 className="text-2xl font-black text-white mb-3">Enterprise & Districts</h3>
            <p className="text-white/35 max-w-lg mx-auto mb-7 leading-relaxed">
              Multi-seat licensing for schools, networks, and districts. Custom integrations. Dedicated CSM. Onboarding for your entire team.
            </p>
            <Link to="/">
              <button className="h-11 px-8 rounded-xl bg-white text-black text-sm font-semibold hover:bg-white/90 transition-all">
                Talk to Sales
              </button>
            </Link>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h3 className="text-2xl font-black text-white text-center mb-10">Frequently asked questions.</h3>
          <div className="space-y-2">
            {FAQS.map((faq, i) => (
              <div key={i} className="border border-white/6 rounded-xl overflow-hidden">
                <button onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left">
                  <span className="text-sm font-semibold text-white/70">{faq.q}</span>
                  <span className="text-white/25 text-lg">{faqOpen === i ? '−' : '+'}</span>
                </button>
                {faqOpen === i && (
                  <div className="px-6 pb-4">
                    <p className="text-sm text-white/40 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Link to="/welcome">
            <img src="https://media.base44.com/images/public/69f64dbf5c37a4db77e0e302/21d29b7f0_64B1F443-0AD3-403D-B726-ABEF11D14419.png"
              alt="edXponential" className="h-5 w-auto brightness-0 invert opacity-30" />
          </Link>
          <p className="text-xs text-white/15">© 2026 edXponential. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}