import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, GraduationCap, Users, Zap, TrendingUp, Video, Briefcase, DollarSign } from 'lucide-react';

const WALKTHROUGHS = [
  {
    id: 'course-creation',
    title: 'Create a Course',
    description: 'Step-by-step guide to building your first course',
    icon: BookOpen,
    prompt: 'Walk me through creating a course on edXportante step-by-step.',
    category: 'learning',
  },
  {
    id: 'coaching-setup',
    title: 'Set Up Coaching',
    description: 'Launch your coaching or edVisor profile',
    icon: Users,
    prompt: 'Help me set up my edVisor coaching profile and start getting matched with schools.',
    category: 'coaching',
  },
  {
    id: 'xscool-completion',
    title: 'Complete Xschool Profile',
    description: 'Build your school intelligence profile',
    icon: Zap,
    prompt: 'Guide me through completing my Xschool profile completely.',
    category: 'school',
  },
  {
    id: 'pitch-park',
    title: 'Launch Capital Raise',
    description: 'Get your pitch ready for investors',
    icon: TrendingUp,
    prompt: 'Walk me through launching a capital raise in Pitch Park and preparing my pitch deck.',
    category: 'capital',
  },
  {
    id: 'tutoring-launch',
    title: 'Start Tutoring',
    description: 'Become a tutor or hire tutors',
    icon: GraduationCap,
    prompt: 'Help me understand TwotrX and how to get started with tutoring.',
    category: 'tutoring',
  },
  {
    id: 'job-posting',
    title: 'Post a Job',
    description: 'Hire staff through WonJob',
    icon: Briefcase,
    prompt: 'Guide me through posting a job on WonJob and finding great candidates.',
    category: 'hiring',
  },
  {
    id: 'webinar-creation',
    title: 'Create a Webinar',
    description: 'Host live events on TubedX',
    icon: Video,
    prompt: 'How do I create and host a webinar using TubedX?',
    category: 'content',
  },
  {
    id: 'investor-matching',
    title: 'Find Investors',
    description: 'Connect with education investors',
    icon: DollarSign,
    prompt: 'Help me find and connect with investors for my education venture.',
    category: 'capital',
  },
];

export default function EddyWalkthroughs({ onSelectWalkthrough, isOpen, onClose }) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'school', label: 'School' },
    { id: 'coaching', label: 'Coaching' },
    { id: 'capital', label: 'Capital' },
    { id: 'tutoring', label: 'Tutoring' },
    { id: 'hiring', label: 'Hiring' },
    { id: 'content', label: 'Content' },
    { id: 'learning', label: 'Learning' },
  ];

  const filteredWalkthroughs = selectedCategory === 'all'
    ? WALKTHROUGHS
    : WALKTHROUGHS.filter(w => w.category === selectedCategory);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 z-[10000] flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#0a0f1e] to-[#1a2033] px-6 py-5 flex items-center justify-between flex-shrink-0">
              <div>
                <h2 className="text-white font-black text-xl">Platform Walkthroughs</h2>
                <p className="text-white/50 text-xs mt-1">Launch guided tours of edXponential features</p>
              </div>
              <button
                onClick={onClose}
                className="text-white/60 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category Filter */}
            <div className="px-6 py-4 border-b border-gray-100 flex-shrink-0 overflow-x-auto">
              <div className="flex gap-2">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                      selectedCategory === cat.id
                        ? 'bg-[#0a0f1e] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Walkthroughs Grid */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredWalkthroughs.map((walkthrough, i) => {
                  const Icon = walkthrough.icon;
                  return (
                    <motion.button
                      key={walkthrough.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => {
                        onSelectWalkthrough(walkthrough.prompt);
                        onClose();
                      }}
                      className="group text-left p-4 rounded-xl border border-gray-200 hover:border-[#0a0f1e] hover:bg-blue-50 transition-all duration-200"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 group-hover:bg-[#0a0f1e] group-hover:text-white transition-all flex items-center justify-center flex-shrink-0 text-gray-600">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-[#0a0f1e] group-hover:text-[#0a0f1e] text-sm leading-tight">
                            {walkthrough.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-1 leading-tight">
                            {walkthrough.description}
                          </p>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
              {filteredWalkthroughs.length === 0 && (
                <div className="flex items-center justify-center h-40">
                  <p className="text-gray-400 text-sm">No walkthroughs in this category.</p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}