import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';

const ROLES = [
  'Founder',
  'Co-Founder',
  'Executive Director',
  'CEO',
  'Superintendent',
  'Principal',
  'Assistant Principal',
  'Instructional Coach',
  'Teacher',
  'Tutor',
  'Education Consultant',
  'Investor',
  'Other',
];

const GOALS = [
  'Build a new school',
  'Improve operations',
  'Improve instruction',
  'Improve school culture',
  'Coach leaders or teachers',
  'Raise funding',
  'Join professional community',
  'Use AI to work faster',
];

export default function Questionnaire() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    fullName: '',
    role: '',
    goals: [],
    immediateNeed: '',
    biggestGoal: '',
  });

  const steps = [
    {
      title: 'Your basics',
      subtitle: "We'll personalize your dashboard around how you work.",
      fields: [
        { name: 'fullName', label: 'Full name', type: 'text', placeholder: 'Jane Doe' },
        { name: 'role', label: 'Your role', type: 'select', placeholder: 'Select your role', options: ROLES },
      ],
    },
    {
      title: 'What are you trying to do',
      subtitle: 'Select all that apply.',
      fields: [
        { name: 'goals', label: 'Goals', type: 'multi-select', options: GOALS },
      ],
    },
    {
      title: 'Personalize your experience',
      subtitle: 'Help us understand your priorities.',
      fields: [
        { name: 'immediateNeed', label: 'What would make edXponential immediately valuable to you?', type: 'textarea', placeholder: 'Describe your immediate need...' },
        { name: 'biggestGoal', label: 'What is your biggest education goal this year?', type: 'textarea', placeholder: 'Tell us your biggest goal...' },
      ],
    },
  ];

  const step = steps[currentStep];

  const isStepComplete = () => {
    if (currentStep === 0) {
      return formData.fullName.trim() !== '' && formData.role !== '';
    }
    if (currentStep === 1) {
      return formData.goals.length > 0;
    }
    if (currentStep === 2) {
      return formData.immediateNeed.trim() !== '' && formData.biggestGoal.trim() !== '';
    }
    return false;
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate('/packages/select');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-200 px-8 py-6 flex items-center justify-between">
        <div className="text-sm font-semibold text-slate-900">edXponential</div>
        <div className="text-sm text-slate-600">Step {currentStep + 1} of {steps.length}</div>
      </header>

      {/* Progress Indicator */}
      <div className="px-8 py-8 border-b border-slate-200">
        <div className="flex items-center justify-between max-w-2xl">
          {steps.map((_, idx) => (
            <div key={idx} className="flex items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                  idx <= currentStep
                    ? 'bg-black text-white'
                    : 'border-2 border-slate-300 text-slate-600'
                }`}
              >
                {idx + 1}
              </div>
              {idx < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-4 transition-all ${
                    idx < currentStep ? 'bg-black' : 'bg-slate-300'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 flex items-center justify-center px-8 py-12">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-2xl"
        >
          <div className="mb-10">
            <h1 className="text-4xl font-black text-black mb-3 tracking-tight">{step.title}</h1>
            <p className="text-lg text-slate-600">{step.subtitle}</p>
          </div>

          <div className="space-y-6 mb-12">
            {step.fields.map((field) => {
              if (field.type === 'text') {
                return (
                  <div key={field.name}>
                    <label className="block text-sm font-semibold text-black mb-3">
                      {field.label}
                    </label>
                    <input
                      type="text"
                      placeholder={field.placeholder}
                      value={formData[field.name]}
                      onChange={(e) =>
                        setFormData({ ...formData, [field.name]: e.target.value })
                      }
                      className="w-full h-12 px-4 rounded-xl border-2 border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-black focus:ring-0 text-base"
                    />
                  </div>
                );
              }

              if (field.type === 'select') {
                return (
                  <div key={field.name}>
                    <label className="block text-sm font-semibold text-black mb-3">
                      {field.label}
                    </label>
                    <select
                      value={formData[field.name]}
                      onChange={(e) =>
                        setFormData({ ...formData, [field.name]: e.target.value })
                      }
                      className="w-full h-12 px-4 rounded-xl border-2 border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-black focus:ring-0 text-base appearance-none cursor-pointer"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23000' d='M1 1l5 5 5-5'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 1rem center',
                        paddingRight: '2.5rem',
                      }}
                    >
                      <option value="">{field.placeholder}</option>
                      {field.options.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              }

              if (field.type === 'multi-select') {
                return (
                  <div key={field.name}>
                    <label className="block text-sm font-semibold text-black mb-4">
                      {field.label}
                    </label>
                    <div className="space-y-3">
                      {field.options.map((opt) => (
                        <label key={opt} className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.goals.includes(opt)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData({
                                  ...formData,
                                  goals: [...formData.goals, opt],
                                });
                              } else {
                                setFormData({
                                  ...formData,
                                  goals: formData.goals.filter((g) => g !== opt),
                                });
                              }
                            }}
                            className="w-5 h-5 rounded border-2 border-slate-300 cursor-pointer"
                          />
                          <span className="text-base text-slate-900 font-medium">{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                );
              }

              if (field.type === 'textarea') {
                return (
                  <div key={field.name}>
                    <label className="block text-sm font-semibold text-black mb-3">
                      {field.label}
                    </label>
                    <textarea
                      placeholder={field.placeholder}
                      value={formData[field.name]}
                      onChange={(e) =>
                        setFormData({ ...formData, [field.name]: e.target.value })
                      }
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-black focus:ring-0 text-base resize-none"
                    />
                  </div>
                );
              }

              return null;
            })}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className="flex items-center gap-2 text-slate-900 font-semibold text-base hover:text-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
              Back
            </button>

            <button
              onClick={handleNext}
              disabled={!isStepComplete()}
              className="flex items-center gap-2 px-8 py-3 rounded-full bg-slate-700 text-white font-semibold text-base hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}