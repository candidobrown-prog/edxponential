import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, ChevronRight } from 'lucide-react';
import OnboardingShell from './OnboardingShell';

const SLIDES = [
  {
    id: 'vision',
    tag: 'The Platform',
    headline: 'One ecosystem.\nEvery tool you need.',
    body: 'edXponential combines AI coaching, school intelligence, investor networks, elite courses, private communities, and world-class expertise — all in one place.',
    visual: '🌐',
    highlights: ['AI-Powered Tools', 'All-in-One Platform', 'Education-First'],
  },
  {
    id: 'myxschool',
    tag: 'My Xschool™',
    headline: 'Your school command center.',
    body: 'Manage your entire school operation in one intelligent dashboard. AI generates your school grade, 90-day improvement plan, staff insights, and strategic roadmap.',
    visual: '🏫',
    highlights: ['AI School Report', '90-Day Plan', 'Staff Intelligence'],
  },
  {
    id: 'xschores',
    tag: 'Xschores™',
    headline: 'Early warning\nintelligence.',
    body: 'Know before it\'s too late. Xschores™ monitors attendance, behavior, academics, and culture in real-time — triggering smart alerts before students fall through the cracks.',
    visual: '📊',
    highlights: ['Risk Alerts', 'Student Tracking', 'Benchmark Monitoring'],
  },
  {
    id: 'edvisors',
    tag: 'edVisors™',
    headline: 'World-class coaches\non demand.',
    body: 'Book coaching sessions with elite founders, executives, principals, and education experts who\'ve built and scaled what you\'re building.',
    visual: '🎓',
    highlights: ['1-on-1 Coaching', 'Group Masterminds', 'Expert Network'],
  },
  {
    id: 'dealroom',
    tag: 'Deal Room',
    headline: 'Connect capital\nto impact.',
    body: 'Founders present their schools, networks, and edtech ventures. edVestors™ discover, evaluate, and fund the future of education — all on one platform.',
    visual: '💼',
    highlights: ['Pitch Your Vision', 'Investor Matching', 'AI Readiness Score'],
  },
  {
    id: 'communities',
    tag: 'Communities',
    headline: 'Private networks\nbuilt for leaders.',
    body: 'Join principal circles, founder networks, investor rooms, and educator hubs. Real conversations. Real relationships. Real results.',
    visual: '🤝',
    highlights: ['Private Groups', 'Live Events', 'Peer Learning'],
  },
  {
    id: 'ai',
    tag: 'Eddy AI',
    headline: 'Your always-on\nstrategic partner.',
    body: 'Eddy is your AI executive assistant trained on the edXponential ecosystem. Get instant answers, strategic frameworks, and intelligent recommendations — 24/7.',
    visual: '🧠',
    highlights: ['Always Available', 'Contextual Intelligence', 'Platform-Wide'],
  },
];

function TourSlide({ slide }) {
  return (
    <motion.div
      key={slide.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-6"
    >
      {/* Visual card */}
      <div className="bg-white/[0.03] border border-white/[0.07] rounded-3xl p-10 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
        <div className="text-6xl mb-4">{slide.visual}</div>
        <div className="inline-flex items-center gap-2 border border-white/10 bg-white/[0.04] rounded-full px-3 py-1 mb-4">
          <span className="text-white/40 text-[10px] tracking-widest uppercase font-black">{slide.tag}</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-white leading-tight whitespace-pre-line mb-3">{slide.headline}</h2>
        <p className="text-white/40 text-sm leading-relaxed max-w-sm mx-auto">{slide.body}</p>
      </div>

      {/* Highlights */}
      <div className="flex justify-center gap-2 flex-wrap">
        {slide.highlights.map(h => (
          <span key={h} className="flex items-center gap-1.5 text-xs text-white/50 bg-white/[0.05] border border-white/[0.08] rounded-full px-3 py-1.5 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-white/40" /> {h}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

export default function OnboardingTour({ onNext, onSkip }) {
  const [slideIndex, setSlideIndex] = useState(0);
  const slide = SLIDES[slideIndex];
  const isLast = slideIndex === SLIDES.length - 1;

  const goNext = () => {
    if (isLast) onNext();
    else setSlideIndex(i => i + 1);
  };

  const goPrev = () => setSlideIndex(i => Math.max(0, i - 1));

  return (
    <OnboardingShell step={4} totalSteps={5} label="Platform Tour">
      <div className="space-y-6">
        {/* Slide counter */}
        <div className="flex items-center justify-between">
          <span className="text-white/25 text-xs font-bold">{slideIndex + 1} / {SLIDES.length}</span>
          <button onClick={onSkip} className="text-white/30 text-xs font-bold hover:text-white/60 transition-colors flex items-center gap-1">
            Skip Tour <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* Slide dot indicators */}
        <div className="flex gap-1.5 justify-center">
          {SLIDES.map((_, i) => (
            <button key={i} onClick={() => setSlideIndex(i)}
              className={`h-1 rounded-full transition-all duration-300 ${i === slideIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/20'}`} />
          ))}
        </div>

        {/* Slide content */}
        <AnimatePresence mode="wait">
          <TourSlide key={slide.id} slide={slide} />
        </AnimatePresence>

        {/* Nav */}
        <div className="flex gap-3 pt-2">
          {slideIndex > 0 && (
            <button onClick={goPrev}
              className="flex items-center gap-2 px-5 py-3.5 rounded-2xl border border-white/10 text-white/50 hover:text-white hover:border-white/25 transition-all font-bold">
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <button onClick={goNext}
            className="flex-1 bg-white text-[#07080f] font-black py-3.5 rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-100 transition-all">
            {isLast ? 'Choose Your Membership' : 'Next'} <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* No billing reassurance */}
        <p className="text-center text-white/20 text-xs">No billing information required at this step</p>
      </div>
    </OnboardingShell>
  );
}