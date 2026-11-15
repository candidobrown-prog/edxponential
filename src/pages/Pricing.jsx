import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Zap, Lock, Star, Users, TrendingUp, Shield, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] } }),
};

const SOCIAL_PROOF = ['Charter School Leaders', 'Founders', 'Superintendents', 'School Networks', 'Education Executives', 'Turnaround Leaders', 'Instructional Coaches'];

const PLANS = [
  {
    id: 'potentials',
    name: 'Potentials',
    price_monthly: 29,
    price_annual: 24,
    trial: '7 Days Free',
    badge: null,
    description: 'For aspiring and emerging education leaders ready to grow faster, lead stronger, and access elite educational strategy.',
    features: [
      'AI-powered educational tools',
      'Community access',
      'Weekly live sessions',
      'Leadership development content',
      'Access to selected courses',
      'Networking opportunities',
      'Education strategy resources',
      'Live office hours',
      'Mobile app access',
      'Early access to events',
      'edNews and insights',
    ],
    cta: 'Start Free Trial',
    highlight: false,
  },
  {
    id: 'principal',
    name: 'Principal Park',
    price_monthly: 49,
    price_annual: 39,
    trial: '7 Days Free',
    badge: null,
    description: 'For principals and instructional leaders leading schools, teams, culture, instruction, and transformation.',
    features: [
      'Everything in Potentials',
      'Principal-only community',
      'School culture systems',
      'Classroom management systems',
      'Observation frameworks',
      'Leadership templates',
      'Turnaround playbooks',
      'Staff coaching systems',
      'Data meeting frameworks',
      'Parent engagement systems',
      'Weekly principal masterminds',
      'AI leadership assistant tools',
      'School operations resources',
    ],
    cta: 'Join Principal Park',
    highlight: false,
  },
  {
    id: 'founders',
    name: 'Founders Sphere',
    price_monthly: 99,
    price_annual: 79,
    trial: '7 Days for $19',
    badge: 'MOST POPULAR',
    description: 'For founders building schools, education companies, nonprofits, networks, and transformational ventures.',
    features: [
      'Everything in Principal Park',
      'Founder-only community',
      'Fundraising guidance',
      'Business scaling frameworks',
      'Hiring systems',
      'Investor access',
      'Marketing and branding resources',
      'AI growth systems',
      'Pitch deck templates',
      'Operations playbooks',
      'Revenue-generation systems',
      'Strategic partnerships',
      'Founder office hours',
      'Priority networking access',
      'Exclusive founder events',
    ],
    cta: 'Enter Founders Sphere',
    highlight: true,
  },
  {
    id: 'executive',
    name: 'Executive Entourage',
    price_monthly: 129,
    price_annual: 99,
    trial: '7 Days Free',
    badge: null,
    description: 'For executives, network leaders, chiefs, superintendents, and system-level decision makers driving large-scale impact.',
    features: [
      'Everything in Founders Sphere',
      'Executive-only masterminds',
      'District transformation strategy',
      'High-level consulting frameworks',
      'Executive coaching',
      'AI executive dashboards',
      'Strategic planning systems',
      'Board governance resources',
      'Leadership retreats',
      'Private executive sessions',
      'Advanced analytics tools',
      'Organizational scaling systems',
      'VIP event access',
      'Premium concierge support',
    ],
    cta: 'Join the Entourage',
    highlight: false,
  },
];

const SPECIALTY = [
  {
    id: 'edvisor',
    name: 'edVisors™',
    badge: 'APPLICATION ONLY',
    price: 'Free to Apply',
    sub: 'One-Time $99 Application Fee · $249/month if accepted',
    description: 'The elite coaching and advisory network of edXponential. edVisors are world-class founders, executives, principals, consultants, and education experts who monetize their expertise.',
    roi: 'Many edVisors earn between $5,000–$15,000/month through coaching alone. Others build six and seven-figure education brands through courses, masterminds, and consulting.',
    features: ['Monetize coaching', 'Build paid communities', 'Sell courses', 'Offer group coaching', 'AI business growth tools', 'Revenue dashboards', 'Scheduling systems', 'Client management CRM', 'Marketing systems', 'Personal brand amplification', 'Premium profile placement', 'Lead generation', 'Event & webinar hosting', 'Course creation tools', 'Affiliate opportunities', 'Private edVisor network'],
    cta: 'Apply to Become an edVisor',
    dark: true,
  },
  {
    id: 'tutors',
    name: 'Tutors',
    badge: 'APPLICATION ONLY',
    price: 'Application Only',
    sub: 'One-Time $99 Application Fee · $49/month if accepted',
    description: 'For elite tutors and academic coaches supporting students and families virtually and in person through the TwotrX network.',
    roi: null,
    features: ['Tutor profile', 'Student matching', 'Parent booking tools', 'Scheduling', 'Video sessions', 'AI lesson support', 'Resource marketplace', 'Session analytics', 'Payment processing', 'Tutor community', 'Marketing support', 'Rating system', 'Mobile app tools'],
    cta: 'Apply to Tutor',
    dark: false,
  },
  {
    id: 'edvestor',
    name: 'edVestors™',
    badge: 'PRIVATE NETWORK',
    price: 'Application Only',
    sub: 'Curated investor and strategic partner network',
    description: 'A private investor and strategic partner network supporting the future of education innovation through deal flow, introductions, and intelligence.',
    roi: null,
    features: ['Founder deal flow', 'Investment opportunities', 'Private investor rooms', 'Founder introductions', 'Pitch events', 'Education market intelligence', 'Investor community', 'Exclusive summits', 'Strategic partnerships', 'AI opportunity matching', 'Private networking experiences'],
    cta: 'Apply as an edVestor',
    dark: false,
  },
];

const COMPARE_FEATURES = [
  'AI Tools',
  'Community Access',
  'Courses',
  'Live Coaching',
  'Networking',
  'Masterminds',
  'Revenue Generation',
  'Course Creation',
  'Community Monetization',
  'Investor Access',
  'Analytics',
  'Leadership Frameworks',
  'CRM Tools',
  'Marketing Systems',
  'Event Hosting',
  'Video Hosting',
  'Concierge Support',
  'Private Network Access',
  'Premium Visibility',
  'Funding Opportunities',
  'Mobile Access',
  'Live Events',
  'Certification Opportunities',
  'Strategic Partnerships',
];

const COMPARE_MATRIX = {
  'AI Tools':                   [true,  true,  true,  true,  true,  true,  false],
  'Community Access':           [true,  true,  true,  true,  true,  true,  true ],
  'Courses':                    [true,  true,  true,  true,  true,  false, false],
  'Live Coaching':              [false, true,  true,  true,  true,  true,  false],
  'Networking':                 [true,  true,  true,  true,  true,  true,  true ],
  'Masterminds':                [false, true,  true,  true,  true,  false, false],
  'Revenue Generation':         [false, false, true,  true,  true,  true,  false],
  'Course Creation':            [false, false, false, false, true,  false, false],
  'Community Monetization':     [false, false, false, false, true,  false, false],
  'Investor Access':            [false, false, true,  true,  false, false, true ],
  'Analytics':                  [false, true,  true,  true,  true,  true,  true ],
  'Leadership Frameworks':      [true,  true,  true,  true,  false, false, false],
  'CRM Tools':                  [false, false, false, false, true,  true,  false],
  'Marketing Systems':          [false, false, true,  true,  true,  false, false],
  'Event Hosting':              [false, false, false, false, true,  false, false],
  'Video Hosting':              [false, false, false, true,  true,  true,  false],
  'Concierge Support':          [false, false, false, true,  false, false, true ],
  'Private Network Access':     [false, false, false, true,  true,  false, true ],
  'Premium Visibility':         [false, false, false, false, true,  true,  false],
  'Funding Opportunities':      [false, false, true,  true,  false, false, true ],
  'Mobile Access':              [true,  true,  true,  true,  true,  true,  false],
  'Live Events':                [true,  true,  true,  true,  true,  false, true ],
  'Certification Opportunities':[false, true,  true,  true,  false, false, false],
  'Strategic Partnerships':     [false, false, true,  true,  true,  false, true ],
};

const COL_HEADERS = ['Potentials', 'Principal Park', 'Founders Sphere', 'Executive Entourage', 'edVisors™', 'Tutors', 'edVestors™'];

function CheckMark({ val }) {
  return val ? (
    <div className="flex items-center justify-center">
      <div className="w-5 h-5 rounded-full bg-[#0a0f1e] flex items-center justify-center">
        <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center">
      <div className="w-1.5 h-1.5 rounded-full bg-gray-200" />
    </div>
  );
}

export default function Pricing() {
  const [billing, setBilling] = useState('monthly');

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>

      {/* ─── HERO ─── */}
      <div className="bg-[#0a0f1e] text-white">
        <div className="max-w-5xl mx-auto px-6 pt-24 pb-20 text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}
            className="inline-flex items-center gap-2 border border-white/10 bg-white/5 rounded-full px-4 py-1.5 mb-8">
            <Lock className="w-3 h-3 text-white/40" />
            <span className="text-white/50 text-xs tracking-widest uppercase font-bold">Members Only Platform</span>
          </motion.div>

          <motion.h1 initial="hidden" animate="visible" variants={fadeUp} custom={1}
            className="text-5xl md:text-7xl font-black tracking-tight leading-none mb-6">
            Become edXponential.
          </motion.h1>

          <motion.p initial="hidden" animate="visible" variants={fadeUp} custom={2}
            className="text-lg md:text-xl text-white/50 max-w-3xl mx-auto leading-relaxed mb-4">
            The world's first human- and AI-powered all-inclusive platform built exclusively for education founders, executives, principals, tutors, and transformational leaders.
          </motion.p>
          <motion.p initial="hidden" animate="visible" variants={fadeUp} custom={3}
            className="text-sm text-white/35 max-w-2xl mx-auto leading-relaxed mb-10">
            Access elite courses, private communities, AI tools, coaching, edVising, funding opportunities, and world-class educational expertise — all on demand.
          </motion.p>

          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={4}
            className="flex flex-col sm:flex-row gap-3 justify-center mb-16">
            <button className="px-8 py-3.5 bg-white text-[#0a0f1e] font-black text-sm rounded-xl hover:bg-gray-100 transition-all flex items-center gap-2 justify-center">
              Apply Today <ArrowRight className="w-4 h-4" />
            </button>
            <button className="px-8 py-3.5 border border-white/20 text-white font-black text-sm rounded-xl hover:bg-white/5 transition-all">
              Explore Memberships
            </button>
          </motion.div>

          {/* Social Proof Strip */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={5}>
            <p className="text-white/25 text-xs uppercase tracking-widest font-bold mb-4">Trusted by</p>
            <div className="flex flex-wrap justify-center gap-3">
              {SOCIAL_PROOF.map((s, i) => (
                <span key={s} className="text-xs text-white/40 border border-white/10 rounded-full px-4 py-1.5 font-semibold">{s}</span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ─── BILLING TOGGLE + SECTION HEADER ─── */}
      <div className="bg-[#f8f8f8] border-b border-gray-100 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs font-black uppercase tracking-widest text-gray-400">Membership Plans</p>
          <div className="inline-flex items-center bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
            {['monthly', 'annually'].map(b => (
              <button key={b} onClick={() => setBilling(b)}
                className={`px-5 py-2 rounded-lg text-xs font-black capitalize transition-all ${billing === b ? 'bg-[#0a0f1e] text-white shadow-sm' : 'text-gray-400 hover:text-[#0a0f1e]'}`}>
                {b === 'annually' ? 'Annual — Save 20%' : 'Monthly'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── SECTION INTRO ─── */}
      <div className="max-w-4xl mx-auto px-6 pt-20 pb-12 text-center">
        <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          className="text-4xl md:text-5xl font-black text-[#0a0f1e] leading-tight mb-5">
          Memberships Designed for<br />Exponential Growth
        </motion.h2>
        <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
          className="text-gray-500 text-base leading-relaxed max-w-2xl mx-auto">
          Whether you're building a school, scaling a network, coaching educators, investing in education innovation, or transforming student outcomes — there's an edXponential membership designed for you.
        </motion.p>
      </div>

      {/* ─── MAIN PRICING CARDS ─── */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {PLANS.map((plan, i) => (
            <motion.div key={plan.id}
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i * 0.5}
              className={`relative flex flex-col rounded-2xl border-2 transition-all duration-300 group
                ${plan.highlight
                  ? 'bg-[#0a0f1e] border-[#0a0f1e] shadow-2xl shadow-[#0a0f1e]/20 scale-[1.02]'
                  : 'bg-white border-gray-100 hover:border-[#0a0f1e] hover:shadow-xl hover:shadow-gray-100'
                }`}>

              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <span className="px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-white text-[#0a0f1e] border border-gray-200 shadow-sm">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="p-7 flex-1 flex flex-col">
                <div className="mb-6">
                  <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${plan.highlight ? 'text-white/40' : 'text-gray-400'}`}>
                    {plan.name}
                  </p>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className={`text-4xl font-black ${plan.highlight ? 'text-white' : 'text-[#0a0f1e]'}`}>
                      ${billing === 'monthly' ? plan.price_monthly : plan.price_annual}
                    </span>
                    <span className={`text-sm ${plan.highlight ? 'text-white/40' : 'text-gray-400'}`}>/mo</span>
                  </div>
                  {billing === 'annually' && (
                    <p className={`text-xs font-bold mb-2 ${plan.highlight ? 'text-green-400' : 'text-green-600'}`}>
                      Save ${(plan.price_monthly - plan.price_annual) * 12}/yr
                    </p>
                  )}
                  <p className={`text-xs font-semibold mb-3 ${plan.highlight ? 'text-white/50' : 'text-gray-400'}`}>
                    {plan.trial}
                  </p>
                  <p className={`text-sm leading-relaxed ${plan.highlight ? 'text-white/60' : 'text-gray-500'}`}>
                    {plan.description}
                  </p>
                </div>

                <ul className="space-y-2.5 flex-1 mb-7">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2.5">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5
                        ${plan.highlight ? 'bg-white/20' : 'bg-gray-100'}`}>
                        <Check className={`w-2.5 h-2.5 ${plan.highlight ? 'text-white' : 'text-[#0a0f1e]'}`} strokeWidth={3} />
                      </div>
                      <span className={`text-xs leading-relaxed ${plan.highlight ? 'text-white/70' : 'text-gray-600'}`}>{f}</span>
                    </li>
                  ))}
                </ul>

                <button className={`w-full py-3.5 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2
                  ${plan.highlight
                    ? 'bg-white text-[#0a0f1e] hover:bg-gray-100'
                    : 'bg-[#0a0f1e] text-white hover:bg-[#1a2033]'
                  }`}>
                  {plan.cta} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ─── SPECIALTY / APPLICATION CARDS ─── */}
      <div className="bg-[#f8f8f8] border-t border-b border-gray-100 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center mb-12">
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Application-Based Memberships</motion.p>
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
            className="text-3xl md:text-4xl font-black text-[#0a0f1e]">Curated. Vetted. Exclusive.</motion.h2>
        </div>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-5">
          {SPECIALTY.map((sp, i) => (
            <motion.div key={sp.id}
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i * 0.5}
              className={`rounded-2xl border-2 p-7 flex flex-col transition-all duration-300 hover:shadow-xl
                ${sp.dark ? 'bg-[#0a0f1e] border-[#0a0f1e]' : 'bg-white border-gray-100 hover:border-[#0a0f1e]'}`}>

              <div className="mb-2">
                <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border
                  ${sp.dark ? 'bg-white/10 text-white/60 border-white/10' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                  {sp.badge}
                </span>
              </div>

              <div className="mt-4 mb-5">
                <p className={`text-xs font-black uppercase tracking-widest mb-2 ${sp.dark ? 'text-white/40' : 'text-gray-400'}`}>{sp.name}</p>
                <p className={`text-2xl font-black ${sp.dark ? 'text-white' : 'text-[#0a0f1e]'}`}>{sp.price}</p>
                <p className={`text-xs mt-1 font-semibold ${sp.dark ? 'text-white/40' : 'text-gray-400'}`}>{sp.sub}</p>
                <p className={`text-sm leading-relaxed mt-3 ${sp.dark ? 'text-white/60' : 'text-gray-500'}`}>{sp.description}</p>
                {sp.roi && (
                  <div className={`mt-4 p-4 rounded-xl border ${sp.dark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                    <p className={`text-xs leading-relaxed font-semibold italic ${sp.dark ? 'text-white/60' : 'text-gray-500'}`}>{sp.roi}</p>
                  </div>
                )}
              </div>

              <ul className="space-y-2 flex-1 mb-7">
                {sp.features.map(f => (
                  <li key={f} className="flex items-center gap-2">
                    <Check className={`w-3.5 h-3.5 flex-shrink-0 ${sp.dark ? 'text-white/50' : 'text-[#0a0f1e]'}`} strokeWidth={3} />
                    <span className={`text-xs ${sp.dark ? 'text-white/60' : 'text-gray-500'}`}>{f}</span>
                  </li>
                ))}
              </ul>

              <button className={`w-full py-3.5 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2
                ${sp.dark ? 'bg-white text-[#0a0f1e] hover:bg-gray-100' : 'bg-[#0a0f1e] text-white hover:bg-[#1a2033]'}`}>
                {sp.cta} <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ─── COMPARISON TABLE ─── */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Full Breakdown</motion.p>
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
            className="text-3xl md:text-4xl font-black text-[#0a0f1e] mb-3">Compare Memberships</motion.h2>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2}
            className="text-gray-400 text-sm max-w-xl mx-auto">
            Find the membership designed for your level of leadership, impact, and ambition.
          </motion.p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
          <table className="w-full min-w-[900px]" style={{ fontFamily: 'Arial, sans-serif' }}>
            <thead>
              <tr className="bg-[#0a0f1e]">
                <th className="text-left px-6 py-4 text-white/50 text-xs font-black uppercase tracking-widest w-52">Feature</th>
                {COL_HEADERS.map(h => (
                  <th key={h} className="px-4 py-4 text-center text-white text-xs font-black">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARE_FEATURES.map((feat, fi) => (
                <tr key={feat} className={`border-b border-gray-50 transition-colors hover:bg-gray-50 ${fi % 2 === 0 ? 'bg-white' : 'bg-[#fafafa]'}`}>
                  <td className="px-6 py-3.5 text-sm font-bold text-[#0a0f1e] sticky left-0 bg-inherit">{feat}</td>
                  {COMPARE_MATRIX[feat].map((val, ci) => (
                    <td key={ci} className="px-4 py-3.5 text-center">
                      <CheckMark val={val} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── EDVISOR ROI SECTION ─── */}
      <div className="bg-[#0a0f1e] py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-white/30 text-xs font-black uppercase tracking-widest mb-4">For Expert Educators</motion.p>
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
            className="text-4xl md:text-5xl font-black text-white leading-tight mb-8">
            Your Expertise Is Worth More.
          </motion.h2>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2}
            className="text-white/50 text-base leading-loose max-w-2xl mx-auto space-y-3 mb-10">
            <p>The average educator was never taught how to monetize their expertise.</p>
            <p>edXponential changes that.</p>
            <p>Our edVisors are building coaching businesses, educational brands, paid communities, courses, and consulting practices that generate meaningful income and long-term freedom.</p>
            <p className="text-white/70 font-bold">Some edVisors earn an extra $5,000–$15,000/month coaching alone.</p>
            <p>Others are building million-dollar education brands.</p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={3}
            className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-10">
            {[['Coach', 'when you want'], ['Teach', 'when you want'], ['Lead', 'from anywhere']].map(([v, s]) => (
              <div key={v} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <p className="text-white font-black text-xl">{v}</p>
                <p className="text-white/40 text-xs mt-1">{s}</p>
              </div>
            ))}
          </motion.div>

          <motion.button initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={4}
            className="px-8 py-3.5 bg-white text-[#0a0f1e] font-black text-sm rounded-xl hover:bg-gray-100 transition-all inline-flex items-center gap-2">
            Apply to Become an edVisor <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* ─── STATS STRIP ─── */}
      <div className="bg-[#f8f8f8] border-t border-b border-gray-100 py-12 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            ['$2B+', 'Capital in Network'],
            ['500+', 'Vetted Members'],
            ['7+', 'Platform Products'],
            ['98%', 'Member Renewal Rate'],
          ].map(([val, label]) => (
            <div key={label}>
              <p className="text-3xl font-black text-[#0a0f1e]">{val}</p>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── FINAL CTA ─── */}
      <div className="bg-[#0a0f1e] py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-white/25 text-xs font-black uppercase tracking-widest mb-5">The Platform</motion.p>
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
            className="text-4xl md:text-6xl font-black text-white leading-tight mb-8">
            The Future of Educational<br />Leadership Lives Here.
          </motion.h2>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2}
            className="text-white/40 text-base leading-loose mb-12 space-y-2">
            <p>This is more than a platform. This is an ecosystem for transformational education leaders.</p>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {['Build.', 'Lead.', 'Coach.', 'Scale.', 'Invest.', 'Become edXponential.'].map(w => (
                <span key={w} className="text-white/70 font-black text-lg">{w}</span>
              ))}
            </div>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={3}
            className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-10 py-4 bg-white text-[#0a0f1e] font-black text-sm rounded-xl hover:bg-gray-100 transition-all flex items-center gap-2 justify-center">
              Apply Today <ArrowRight className="w-4 h-4" />
            </button>
            <Link to="/communities">
              <button className="px-10 py-4 border border-white/20 text-white font-black text-sm rounded-xl hover:bg-white/5 transition-all w-full sm:w-auto">
                Join the Community
              </button>
            </Link>
          </motion.div>
        </div>
      </div>

    </div>
  );
}