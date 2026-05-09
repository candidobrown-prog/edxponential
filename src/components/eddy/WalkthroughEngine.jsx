import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, X, Volume2, SkipForward } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const WALKTHROUGHS = {
  platform_basics: {
    title: 'Platform Basics',
    steps: [
      {
        id: 'dashboard',
        title: 'Your Dashboard',
        content: 'Your central hub for school intelligence, coaching, and community access.',
        action: 'Go to Dashboard',
        path: '/dashboard',
      },
      {
        id: 'xschetails',
        title: 'School Intelligence Profile',
        content: 'Create your Xschetails profile to get AI-powered school insights and recommendations.',
        action: 'Create Profile',
        path: '/xschetails',
      },
      {
        id: 'edvisors',
        title: 'edVisors Network',
        content: 'Connect with vetted education leaders for coaching and mentorship.',
        action: 'Explore edVisors',
        path: '/edvisors',
      },
      {
        id: 'communities',
        title: 'Communities',
        content: 'Join peer groups, share wins, and collaborate with fellow leaders.',
        action: 'Explore Communities',
        path: '/communities',
      },
    ],
  },
  my_role: {
    title: 'Your Role Guide',
    steps: [
      {
        id: 'role_overview',
        title: 'Role Overview',
        content: 'Get an AI-personalized guide based on your specific role and goals.',
        action: 'Next',
      },
      {
        id: 'role_tools',
        title: 'Your Essential Tools',
        content: 'Discover the platform features most relevant to your role.',
        action: 'Show Tools',
      },
      {
        id: 'role_success',
        title: 'Success Metrics',
        content: 'Learn what success looks like in your role and how to track progress.',
        action: 'View Metrics',
      },
    ],
  },
  quick_wins: {
    title: 'Quick Wins',
    steps: [
      {
        id: 'win_1',
        title: '⚡ Tip 1: Smart Search',
        content: 'Use platform search to instantly find resources, people, and opportunities.',
        action: 'Got it',
      },
      {
        id: 'win_2',
        title: '⚡ Tip 2: AI Assistant',
        content: 'Click the Eddy icon anytime to ask questions or get guidance on any feature.',
        action: 'Got it',
      },
      {
        id: 'win_3',
        title: '⚡ Tip 3: Saved Items',
        content: 'Bookmark resources, jobs, courses, and coaching sessions for later.',
        action: 'Got it',
      },
      {
        id: 'win_4',
        title: '⚡ Tip 4: Notifications',
        content: 'Customize your notification preferences to stay informed without overwhelm.',
        action: 'Got it',
      },
    ],
  },
  deep_dive: {
    title: 'Deep Dive Training',
    steps: [
      {
        id: 'dd_1',
        title: 'Module 1: School Intelligence',
        content: 'Master Xschetails, analytics, and AI-powered school insights.',
        action: 'Start Module',
        path: '/xschetails/dashboard',
      },
      {
        id: 'dd_2',
        title: 'Module 2: Capital & Investors',
        content: 'Navigate deal room, investor matching, and pitch preparation.',
        action: 'Start Module',
        path: '/deal-room',
      },
      {
        id: 'dd_3',
        title: 'Module 3: Coaching & Mentorship',
        content: 'Book sessions, access resources, and build your leadership network.',
        action: 'Start Module',
        path: '/coaching',
      },
      {
        id: 'dd_4',
        title: 'Module 4: Community & Collaboration',
        content: 'Engage with peer groups, share best practices, and collaborate.',
        action: 'Start Module',
        path: '/communities',
      },
    ],
  },
};

export default function WalkthroughEngine({ walkthrough, onClose, user }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  const config = WALKTHROUGHS[walkthrough];
  const step = config.steps[currentStep];
  const progress = Math.round(((currentStep + 1) / config.steps.length) * 100);

  const handleNext = () => {
    if (currentStep < config.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setCompleted(true);
      // Track completion
      base44.analytics.track({
        eventName: 'walkthrough_completed',
        properties: { walkthrough, steps: config.steps.length },
      });
    }
  };

  const handleNavigate = (path) => {
    if (path) {
      window.location.href = path;
    }
    handleNext();
  };

  const handleSpeak = () => {
    setSpeaking(!speaking);
    if ('speechSynthesis' in window) {
      if (speaking) {
        speechSynthesis.cancel();
      } else {
        const utterance = new SpeechSynthesisUtterance(step.content);
        utterance.rate = 1;
        speechSynthesis.speak(utterance);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-lg bg-gradient-to-br from-[#0a0a0a] to-[#050505] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="font-black text-lg text-white">{config.title}</h2>
            <p className="text-blue-100 text-xs mt-0.5">Step {currentStep + 1} of {config.steps.length}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-white/20 flex items-center justify-center transition-all"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-white/10">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-blue-500"
            transition={{ type: 'spring', stiffness: 100 }}
          />
        </div>

        <AnimatePresence mode="wait">
          {!completed ? (
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-6 space-y-6"
            >
              {/* Step content */}
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-white">{step.title}</h3>
                <p className="text-white/70 leading-relaxed">{step.content}</p>
              </div>

              {/* Audio button */}
              <button
                onClick={handleSpeak}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                  speaking
                    ? 'border-blue-500/50 bg-blue-500/10 text-blue-400'
                    : 'border-white/10 hover:border-white/20 text-white/60 hover:text-white/80'
                }`}
              >
                <Volume2 className={`w-4 h-4 ${speaking ? 'animate-pulse' : ''}`} />
                <span className="text-xs font-semibold">{speaking ? 'Playing audio...' : 'Listen'}</span>
              </button>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-white/10 text-white/60 hover:text-white/80 font-semibold text-sm transition-all"
                >
                  Skip
                </button>
                {step.path ? (
                  <button
                    onClick={() => handleNavigate(step.path)}
                    className="flex-1 px-4 py-2.5 rounded-lg bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                  >
                    {step.action}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="flex-1 px-4 py-2.5 rounded-lg bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                  >
                    {step.action}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 text-center space-y-4"
            >
              <div className="w-16 h-16 mx-auto bg-blue-500/20 rounded-full flex items-center justify-center">
                <span className="text-3xl">🎉</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">You're all set!</h3>
                <p className="text-white/60 text-sm">You've completed the {config.title} walkthrough.</p>
              </div>
              <button
                onClick={onClose}
                className="w-full px-4 py-2.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all"
              >
                Done
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}