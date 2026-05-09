import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronRight, ArrowLeft, Sparkles } from 'lucide-react';

const QUESTIONS = [
  {
    id: 'role',
    title: "What's your role?",
    subtitle: 'This helps me personalize your experience.',
    options: [
      { label: 'School Founder', value: 'founder', desc: 'Building or launching a school' },
      { label: 'Principal / Leader', value: 'principal', desc: 'Leading an existing school' },
      { label: 'Executive / Superintendent', value: 'executive', desc: 'Managing a district/network' },
      { label: 'Teacher / Coach', value: 'coach', desc: 'Supporting students/educators' },
      { label: 'Investor / Advisor', value: 'investor', desc: 'Funding education' },
    ],
  },
  {
    id: 'goal',
    title: 'What do you want to accomplish?',
    subtitle: 'Select what matters most to you right now.',
    options: [
      { label: 'Launch my school', value: 'launch', desc: 'Build and open a new school' },
      { label: 'Improve academics', value: 'academics', desc: 'Boost student outcomes' },
      { label: 'Build my team', value: 'team', desc: 'Hire and develop talent' },
      { label: 'Find capital', value: 'capital', desc: 'Secure funding or investors' },
      { label: 'Network & grow', value: 'network', desc: 'Connect with peers and opportunities' },
    ],
  },
  {
    id: 'challenge',
    title: "What's your biggest challenge?",
    subtitle: 'Help me understand what to prioritize.',
    options: [
      { label: 'Time & resources', value: 'resources', desc: 'Limited time or budget' },
      { label: 'Finding expertise', value: 'expertise', desc: 'Need guidance from experts' },
      { label: 'Data & insights', value: 'data', desc: 'Need better information' },
      { label: 'Building infrastructure', value: 'infrastructure', desc: 'Systems and processes' },
      { label: "I'm not sure yet", value: 'unsure', desc: 'Still exploring' },
    ],
  },
];

export default function OnboardingQuestions({ responses, onComplete, onBack }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [tempResponses, setTempResponses] = useState(responses);
  const currentQuestion = QUESTIONS[currentStep];

  const handleSelect = (value) => {
    const updated = { ...tempResponses, [currentQuestion.id]: value };
    setTempResponses(updated);

    if (currentStep === QUESTIONS.length - 1) {
      onComplete(updated);
    } else {
      setTimeout(() => setCurrentStep(currentStep + 1), 300);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#080808] via-[#0a0a0a] to-[#080808] flex flex-col items-center justify-center px-4 py-12">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(255,255,255,0.02),transparent)]" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative z-10 max-w-2xl w-full"
      >
        {/* Progress bar */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            {QUESTIONS.map((q, i) => (
              <div key={q.id} className={`h-1 flex-1 rounded-full transition-all ${
                i < currentStep ? 'bg-white' : i === currentStep ? 'bg-white/50' : 'bg-white/10'
              }`} />
            ))}
          </div>
          <p className="text-xs text-white/30 uppercase tracking-widest font-bold">
            Step {currentStep + 1} of {QUESTIONS.length}
          </p>
        </div>

        {/* Eddy + Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="text-center mb-12"
          >
            <div className="flex justify-center mb-8">
               <Sparkles className="w-16 h-16 text-white/30" />
             </div>
            <h2 className="text-4xl font-black text-white tracking-[-0.03em] mb-3">
              {currentQuestion.title}
            </h2>
            <p className="text-white/40 text-lg">
              {currentQuestion.subtitle}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Options Grid */}
        <motion.div
          key={`options-${currentStep}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="space-y-3 mb-8"
        >
          {currentQuestion.options.map((option, i) => (
            <motion.button
              key={option.value}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => handleSelect(option.value)}
              className="w-full p-5 rounded-2xl border border-white/8 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05] transition-all group text-left"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white text-lg mb-1">
                    {option.label}
                  </p>
                  <p className="text-sm text-white/40">
                    {option.desc}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-white/70 transition-colors flex-shrink-0 ml-4" />
              </div>
            </motion.button>
          ))}
        </motion.div>

        {/* Back button */}
        {currentStep > 0 && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setCurrentStep(currentStep - 1)}
            className="flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </motion.button>
        )}
      </motion.div>
    </div>
  );
}