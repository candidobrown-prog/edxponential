import React from 'react';
import { BookOpen, Sparkles, HelpCircle, Zap } from 'lucide-react';

const ONBOARDING_OPTIONS = [
  {
    id: 'platform_basics',
    label: 'Platform Basics',
    icon: Sparkles,
    description: 'Learn core features',
    trigger: 'Show me the basics',
  },
  {
    id: 'my_role',
    label: 'My Role Guide',
    icon: HelpCircle,
    description: 'Role-specific walkthrough',
    trigger: 'I need role guidance',
  },
  {
    id: 'quick_wins',
    label: 'Quick Wins',
    icon: Zap,
    description: '5-minute productivity tips',
    trigger: 'Show me quick wins',
  },
  {
    id: 'deep_dive',
    label: 'Deep Dive',
    icon: BookOpen,
    description: 'Comprehensive training',
    trigger: 'I want a deep dive',
  },
];

export default function EddyOnboardingTrigger({ onSelect, user }) {
  const getUserRole = () => {
    if (!user) return 'general';
    return user.role || 'user';
  };

  const getPersonalizedMessage = () => {
    const role = getUserRole();
    const messages = {
      admin: `Hey ${user?.full_name?.split(' ')[0] || 'there'}! As an admin, you might want to check out these guided tours tailored to your role.`,
      founder: `Welcome, founder! Here are some personalized learning paths to help you build your school faster.`,
      educator: `Great to see you, educator! These walkthroughs will help you master teaching tools.`,
      user: `Hi! Let me show you how to get the most out of edXponential.`,
      general: 'Which onboarding walkthrough interests you?',
    };
    return messages[role] || messages.general;
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-white/70">{getPersonalizedMessage()}</p>
      <div className="grid grid-cols-2 gap-2">
        {ONBOARDING_OPTIONS.map(option => {
          const Icon = option.icon;
          return (
            <button
              key={option.id}
              onClick={() => onSelect(option)}
              className="group text-left p-3 rounded-lg border border-white/10 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all"
            >
              <Icon className="w-4 h-4 text-white/60 group-hover:text-blue-400 mb-1.5 transition-colors" />
              <p className="font-semibold text-xs text-white/80 group-hover:text-white">{option.label}</p>
              <p className="text-[10px] text-white/40 mt-0.5">{option.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}