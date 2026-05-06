import React from 'react';
import { motion } from 'framer-motion';
import { School, Building2, TrendingUp, BookOpen, ArrowRight, ArrowLeft } from 'lucide-react';
import OnboardingShell from './OnboardingShell';

const TYPES = [
  { id: 'principal_leader', icon: School, title: 'Principal / Leader', description: 'I lead a school, team, or educational organization.' },
  { id: 'founder_school_owner', icon: Building2, title: 'Founder / School Owner', description: 'I founded or own an educational institution or edtech venture.' },
  { id: 'investor', icon: TrendingUp, title: 'Investor / Partner', description: 'I invest in or fund educational organizations and initiatives.' },
  { id: 'educator_teacher', icon: BookOpen, title: 'Educator / Tutor', description: 'I teach, tutor, or work directly with students and families.' },
];

export default function OnboardingAccountType({ selected, onSelect, onNext, onBack }) {
  return (
    <OnboardingShell step={2} totalSteps={5} label="Who are you?">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-black text-white mb-3">Let's personalize your experience.</h2>
        <p className="text-white/40 text-sm">We'll tailor your platform based on your role.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        {TYPES.map((t, i) => {
          const Icon = t.icon;
          const isSelected = selected === t.id;
          return (
            <motion.button key={t.id}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              onClick={() => onSelect(t.id)}
              className={`rounded-2xl border-2 p-5 text-left transition-all duration-200 ${
                isSelected
                  ? 'bg-white border-white shadow-2xl shadow-white/10 scale-[1.02]'
                  : 'bg-white/[0.04] border-white/10 hover:bg-white/[0.07] hover:border-white/25'
              }`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${isSelected ? 'bg-[#07080f]' : 'bg-white/10'}`}>
                <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-white/50'}`} />
              </div>
              <h3 className={`font-black text-sm mb-1 ${isSelected ? 'text-[#07080f]' : 'text-white'}`}>{t.title}</h3>
              <p className={`text-xs leading-relaxed ${isSelected ? 'text-gray-500' : 'text-white/35'}`}>{t.description}</p>
            </motion.button>
          );
        })}
      </div>

      <div className="flex gap-3">
        <button onClick={onBack} className="flex items-center gap-2 px-5 py-3.5 rounded-2xl border border-white/10 text-white/50 hover:text-white hover:border-white/25 transition-all text-sm font-bold">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <button onClick={onNext} disabled={!selected}
          className="flex-1 bg-white text-[#07080f] font-black py-3.5 rounded-2xl flex items-center justify-center gap-2 disabled:opacity-25 disabled:cursor-not-allowed hover:bg-gray-100 transition-all">
          Continue <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </OnboardingShell>
  );
}