import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

const QUESTIONS = {
  role: {
    type: 'role',
    question: "What best describes your role?",
    options: [
      { id: 'principal', label: 'School Principal / Leader', icon: '👔' },
      { id: 'teacher', label: 'Classroom Teacher', icon: '📚' },
      { id: 'founder', label: 'School Founder / Entrepreneur', icon: '🚀' },
      { id: 'tutor', label: 'Tutor / Educational Consultant', icon: '✏️' },
      { id: 'admin', label: 'District Administrator', icon: '📊' },
      { id: 'investor', label: 'Investor / Philanthropist', icon: '💰' },
    ],
  },
  organization: {
    type: 'organization',
    question: "What type of organization do you work in?",
    options: [
      { id: 'public', label: 'Public School District', icon: '🏛️' },
      { id: 'charter', label: 'Charter School', icon: '⚡' },
      { id: 'private', label: 'Private School', icon: '✨' },
      { id: 'nonprofit', label: 'Education Nonprofit', icon: '🤝' },
      { id: 'edtech', label: 'EdTech Company', icon: '💻' },
      { id: 'startup', label: 'School / Program Startup', icon: '🌱' },
    ],
  },
  priorities: {
    type: 'priorities',
    question: "What are your biggest priorities? (Select up to 3)",
    options: [
      { id: 'student_outcomes', label: 'Improving Student Outcomes', icon: '📈' },
      { id: 'operations', label: 'Streamlining Operations', icon: '⚙️' },
      { id: 'hiring', label: 'Building & Retaining Staff', icon: '👥' },
      { id: 'funding', label: 'Funding & Finance', icon: '💵' },
      { id: 'curriculum', label: 'Curriculum & Instruction', icon: '🎓' },
      { id: 'culture', label: 'Building Culture & Community', icon: '🌟' },
    ],
    multiSelect: true,
  },
  teamSize: {
    type: 'team_size',
    question: "How large is your organization?",
    options: [
      { id: 'solo', label: 'Just me', icon: '1️⃣' },
      { id: 'small', label: '2-10 people', icon: '2️⃣' },
      { id: 'medium', label: '11-50 people', icon: '3️⃣' },
      { id: 'large', label: '51-200 people', icon: '4️⃣' },
      { id: 'enterprise', label: '200+ people', icon: '5️⃣' },
    ],
  },
  timeline: {
    type: 'timeline',
    question: "What's your timeline for impact?",
    options: [
      { id: 'immediate', label: 'Immediate (next 30 days)', icon: '⚡' },
      { id: 'short', label: 'Short-term (next quarter)', icon: '📅' },
      { id: 'medium', label: 'Medium-term (this school year)', icon: '🎯' },
      { id: 'long', label: 'Long-term (strategic multi-year)', icon: '🗺️' },
    ],
  },
};

export default function EddyOnboarding({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const questionKeys = Object.keys(QUESTIONS);
  const currentQuestion = QUESTIONS[questionKeys[currentStep]];

  const handleSelect = (optionId) => {
    const key = questionKeys[currentStep];
    if (currentQuestion.multiSelect) {
      const current = responses[key] || [];
      setResponses({
        ...responses,
        [key]: current.includes(optionId)
          ? current.filter(id => id !== optionId)
          : current.length < 3 ? [...current, optionId] : current,
      });
    } else {
      setResponses({ ...responses, [key]: optionId });
    }
  };

  const handleNext = async () => {
    if (currentStep < questionKeys.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Generate AI recommendations
      setIsGenerating(true);
      const prompt = `Based on the following user profile, recommend:
1. Ideal membership tier (free/pro/enterprise)
2. Top 3-5 featured tools/modules to show first
3. Dashboard layout preference
4. 2 personalized next steps

User Profile:
- Role: ${responses.role}
- Organization: ${responses.organization}
- Team Size: ${responses.teamSize}
- Priorities: ${responses.priorities?.join(', ')}
- Timeline: ${responses.timeline}

Respond in JSON format with: { tier, features[], dashboardType, nextSteps[] }`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: 'object',
          properties: {
            tier: { type: 'string' },
            features: { type: 'array', items: { type: 'string' } },
            dashboardType: { type: 'string' },
            nextSteps: { type: 'array', items: { type: 'string' } },
          },
        },
      });

      setIsGenerating(false);
      onComplete(result);
    }
  };

  const isCurrentAnswered = () => {
    const key = questionKeys[currentStep];
    return responses[key] !== undefined && (
      currentQuestion.multiSelect ? responses[key]?.length > 0 : true
    );
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-orange-50" />

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-2xl"
          >
            {/* Progress */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-500 font-semibold">
                  {currentStep + 1} of {questionKeys.length}
                </span>
                <span className="text-xs text-gray-400">Getting to know you</span>
              </div>
              <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-600 to-orange-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentStep + 1) / questionKeys.length) * 100}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />
              </div>
            </div>

            {/* Question */}
            <div className="mb-12">
              <h2 className="text-4xl font-bold text-gray-900 leading-tight mb-2">
                {currentQuestion.question}
              </h2>
              {currentQuestion.multiSelect && (
                <p className="text-sm text-gray-500">Select up to 3</p>
              )}
            </div>

            {/* Options Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
              {currentQuestion.options.map(option => {
                const isSelected = currentQuestion.multiSelect
                  ? (responses[questionKeys[currentStep]] || []).includes(option.id)
                  : responses[questionKeys[currentStep]] === option.id;

                return (
                  <motion.button
                    key={option.id}
                    onClick={() => handleSelect(option.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-5 rounded-2xl border-2 transition-all text-left ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{option.icon}</span>
                      <span className="font-semibold text-gray-900">{option.label}</span>
                      {isSelected && (
                        <div className="ml-auto w-5 h-5 bg-blue-600 rounded-full" />
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                className="text-gray-600 hover:text-gray-900 disabled:opacity-30"
              >
                Back
              </button>
              <Button
                onClick={handleNext}
                disabled={!isCurrentAnswered() || isGenerating}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8"
              >
                {isGenerating ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Analyzing...
                  </span>
                ) : currentStep === questionKeys.length - 1 ? (
                  <span className="flex items-center gap-2">
                    Get Started <ChevronRight className="w-4 h-4" />
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Next <ChevronRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}