import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

// Tier-specific dashboard configs
const DASHBOARD_CONFIGS = {
  'Founders Sphere': {
    greeting: 'Ready to build your school?',
    focus: [
      { title: 'Complete Your Charter', desc: 'Start with AI-guided charter builder', link: '/foundaitionx', icon: '🏗️' },
      { title: 'Connect with Investors', desc: 'Access your investor network', link: '/deal-room', icon: '💰' },
      { title: 'Join Founder Cohort', desc: 'Learn from 28 other founders', link: '/communities', icon: '👥' },
    ],
  },
  'Executive Entourage': {
    greeting: 'Your executive dashboard.',
    focus: [
      { title: 'View Key Metrics', desc: 'Real-time school performance data', link: '/admin/executive', icon: '📊' },
      { title: 'Schedule Coaching', desc: 'Book time with an experienced advisor', link: '/coaching', icon: '🎯' },
      { title: 'Explore Resources', desc: 'Curated content for executives', link: '/courses', icon: '📚' },
    ],
  },
  'Principal Park': {
    greeting: 'Welcome back, Principal.',
    focus: [
      { title: 'Check School Health', desc: 'Grades, culture, and compliance', link: '/graiedx', icon: '🏫' },
      { title: 'Book Coaching', desc: 'One-on-one guidance from edVisors', link: '/coaching', icon: '🎯' },
      { title: 'Explore Community', desc: 'Connect with 85+ school leaders', link: '/communities', icon: '🌍' },
    ],
  },
  'edVisors': {
    greeting: 'Welcome, Coach.',
    focus: [
      { title: 'Your Coaching Clients', desc: 'Manage sessions and availability', link: '/ceo-command', icon: '👥' },
      { title: 'Build Your Course', desc: 'Create content to sell on marketplace', link: '/educartx', icon: '📚' },
      { title: 'Check Your Earnings', desc: 'Payment tracking and payouts', link: '/admin/payments', icon: '💸' },
    ],
  },
};

export default function PersonalizedDashboard({ tier = 'Principal Park', userName = 'User' }) {
  const config = DASHBOARD_CONFIGS[tier];
  if (!config) return null;

  return (
    <div className="space-y-12 pb-16">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div>
          <p className="text-sm text-white/40 uppercase tracking-widest font-bold mb-2">
            Welcome back, {userName}
          </p>
          <h1 className="text-4xl font-black text-white tracking-[-0.03em]">
            {config.greeting}
          </h1>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-3"
      >
        {config.focus.map((action, i) => (
          <Link key={action.link} to={action.link}>
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="w-full p-6 rounded-2xl border border-white/8 bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.05] transition-all group text-left"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{action.icon}</span>
                    <h3 className="text-lg font-semibold text-white">
                      {action.title}
                    </h3>
                  </div>
                  <p className="text-sm text-white/40">
                    {action.desc}
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-white/30 group-hover:text-white/70 group-hover:translate-x-1 transition-all flex-shrink-0 ml-4 mt-1" />
              </div>
            </motion.button>
          </Link>
        ))}
      </motion.div>

      {/* Eddy Guidance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-6 rounded-2xl border border-white/8 bg-white/[0.02]"
      >
        <div className="flex gap-4">
          <div className="text-3xl flex-shrink-0">✨</div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-white mb-1">
              Tips from Eddy
            </p>
            <p className="text-sm text-white/40">
              Complete your profile to unlock personalized recommendations and AI-guided features.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}