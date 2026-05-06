import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, ArrowLeft, CheckCircle, Building2, User, BookOpen, Users, Calendar, Zap, BarChart3, MessageCircle, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const BASE_STEPS = [
  { id: 'profile', icon: User, title: 'Build Your Profile', desc: 'Set up your edXponential identity so the platform can personalize your experience.', link: '/profile', cta: 'Go to Profile' },
  { id: 'xschetails', icon: Building2, title: 'Create Your Xschetails', desc: 'Complete your school\'s comprehensive intelligence profile to unlock AI matching, course recommendations, and strategic insights.', link: '/xschetails', cta: 'Build Xschetails' },
  { id: 'edvisor', icon: Star, title: 'Select an edVisor', desc: 'Connect with a world-class education advisor aligned to your goals and leadership stage.', link: '/edvisors', cta: 'Browse edVisors' },
  { id: 'courses', icon: BookOpen, title: 'Select Tutorials & Courses', desc: 'Enroll in elite courses tailored to your role, challenges, and ambitions.', link: '/courses', cta: 'Explore Courses' },
  { id: 'communities', icon: Users, title: 'Join Relevant Communities', desc: 'Find your people — principals, founders, executives, coaches — in private, curated communities.', link: '/communities', cta: 'Join Communities' },
  { id: 'calendar', icon: Calendar, title: 'Sync Your Calendar', desc: 'Connect your calendar to schedule sessions, events, and masterminds without friction.', link: '/profile', cta: 'Sync Calendar' },
  { id: 'integrations', icon: Zap, title: 'Connect Integrations', desc: 'Link your data systems, tools, and platforms for a unified intelligence experience.', link: '/profile', cta: 'View Integrations' },
  { id: 'dashboards', icon: BarChart3, title: 'Explore Dashboards', desc: 'Unlock your Xschetails Dashboard, performance charts, investor readiness, and AI insights.', link: '/xschetails', cta: 'Open Dashboard' },
  { id: 'assistant', icon: MessageCircle, title: 'Meet the edX Assistant', desc: 'Your AI-powered advisor is ready. Ask anything about your Xschetails, get recommendations, and build your plan.', link: null, cta: 'Open Assistant' },
];

const ROLE_OVERRIDES = {
  edvestor: { step: 1, title: 'Build Your Investment Profile', desc: 'Complete your investor thesis so we can match you with the right founders and deals.', link: '/investor-profile', cta: 'Build Investor Profile' },
  tutor: { step: 1, title: 'Complete Your Tutor Application', desc: 'Apply to join the TwotrX tutoring network and start matching with students.', link: '/twotrx/apply', cta: 'Apply Now' },
  parent: { step: 1, title: 'Add Your Student Profile', desc: 'Tell us about your student so we can find the perfect tutor match.', link: '/twotrx/parent', cta: 'Add Student' },
  employer: { step: 1, title: 'Create Your Organization Profile', desc: 'Set up your organization so you can post jobs and find top education talent.', link: '/onejob/employer', cta: 'Create Org Profile' },
};

const STORAGE_KEY = 'edx_onboarding_dismissed';
const COMPLETED_KEY = 'edx_onboarding_completed';

export default function OnboardingTutorial({ userRole, onClose }) {
  const [step, setStep] = useState(0);

  const steps = BASE_STEPS.map((s, i) => {
    const override = ROLE_OVERRIDES[userRole];
    if (override && i === override.step) {
      return { ...s, title: override.title, desc: override.desc, link: override.link, cta: override.cta };
    }
    return s;
  });

  const current = steps[step];
  const Icon = current.icon;
  const isLast = step === steps.length - 1;

  const handleComplete = () => {
    localStorage.setItem(COMPLETED_KEY, 'true');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a0f1e]/80 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden" style={{ fontFamily: 'Arial, sans-serif' }}>

        {/* Header */}
        <div className="bg-[#0a0f1e] px-7 py-5 flex items-center justify-between">
          <div>
            <p className="text-white/30 text-[10px] font-black uppercase tracking-widest">Getting Started</p>
            <p className="text-white font-black text-lg">Welcome to edXponential</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-white/10 transition-all">
            <X className="w-4 h-4 text-white/50" />
          </button>
        </div>

        {/* Progress dots */}
        <div className="px-7 pt-5 flex gap-1.5">
          {steps.map((_, i) => (
            <div key={i} onClick={() => setStep(i)} className={`h-1 flex-1 rounded-full cursor-pointer transition-all
              ${i < step ? 'bg-green-500' : i === step ? 'bg-[#0a0f1e]' : 'bg-gray-100'}`} />
          ))}
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div key={step}
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
            className="px-7 py-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-[#0a0f1e] rounded-2xl flex items-center justify-center flex-shrink-0">
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Step {step + 1} of {steps.length}</p>
                <h3 className="text-xl font-black text-[#0a0f1e] leading-tight">{current.title}</h3>
                <p className="text-sm text-gray-500 mt-2 leading-relaxed">{current.desc}</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button onClick={() => step > 0 && setStep(s => s - 1)}
                className={`flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-black text-gray-500 hover:bg-gray-50 transition-all ${step === 0 ? 'opacity-0 pointer-events-none' : ''}`}>
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>

              <div className="flex gap-2">
                {current.link ? (
                  <Link to={current.link} onClick={() => { if (!isLast) setStep(s => s + 1); else handleComplete(); }}>
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-[#0a0f1e] text-white rounded-xl text-sm font-black hover:bg-[#1a2033] transition-all">
                      {current.cta} <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                ) : (
                  <button onClick={isLast ? handleComplete : () => setStep(s => s + 1)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#0a0f1e] text-white rounded-xl text-sm font-black hover:bg-[#1a2033] transition-all">
                    {isLast ? <><CheckCircle className="w-4 h-4" />Finish Setup</> : <>{current.cta} <ArrowRight className="w-4 h-4" /></>}
                  </button>
                )}
                {!isLast && (
                  <button onClick={() => setStep(s => s + 1)} className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-black text-gray-400 hover:bg-gray-50 transition-all">
                    Skip
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}