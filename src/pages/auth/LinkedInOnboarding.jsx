import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { generatePersonalizedDashboard } from '@/lib/personalizationEngine';

export default function LinkedInOnboarding() {
  const navigate = useNavigate();
  const [linkedInData, setLinkedInData] = useState(null);
  const [formData, setFormData] = useState({
    role: '',
    organization: '',
    goals: [],
    interests: [],
  });
  const [step, setStep] = useState('confirm'); // confirm, preferences, dashboard
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Fetch LinkedIn data from connector
    const fetchLinkedInData = async () => {
      try {
        const user = await base44.auth.me();
        // LinkedIn data would be stored in user profile from connector
        if (user?.linkedin_data) {
          setLinkedInData(user.linkedin_data);
          setFormData({
            ...formData,
            organization: user.linkedin_data.company || '',
          });
        }
      } catch (err) {
        console.error('Failed to fetch LinkedIn data:', err);
      }
    };
    fetchLinkedInData();
  }, []);

  const handleContinue = async () => {
    try {
      setIsLoading(true);
      setStep('preferences');
    } catch (err) {
      console.error('Error:', err);
      setIsLoading(false);
    }
  };

  const handleSubmitPreferences = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      const user = await base44.auth.me();

      // Determine role from LinkedIn data and form input
      const detectedRole = formData.role || detectRoleFromLinkedIn(linkedInData);

      // Generate personalized dashboard
      const aiRecommendation = {
        role: detectedRole,
        organization: formData.organization,
        goals: formData.goals,
        interests: formData.interests,
        linkedinData,
      };

      await generatePersonalizedDashboard(
        {
          role: detectedRole,
          organization: formData.organization,
          teamSize: 'medium',
          priorities: formData.goals,
          timeline: 'immediate',
        },
        aiRecommendation
      );

      setStep('dashboard');
      setTimeout(() => {
        navigate(getDashboardRoute(detectedRole));
      }, 2000);
    } catch (err) {
      console.error('Error:', err);
      setIsLoading(false);
    }
  };

  const detectRoleFromLinkedIn = (data) => {
    if (!data?.headline) return 'professional';
    const headline = data.headline.toLowerCase();
    if (headline.includes('founder')) return 'founder';
    if (headline.includes('principal') || headline.includes('headmaster')) return 'principal';
    if (headline.includes('executive') || headline.includes('ceo')) return 'executive';
    if (headline.includes('teacher')) return 'teacher';
    if (headline.includes('tutor')) return 'tutor';
    return 'professional';
  };

  const getDashboardRoute = (role) => {
    const routes = {
      founder: '/founders-sphere/dashboard',
      principal: '/principal-park/dashboard',
      executive: '/executive-entourage/dashboard',
      teacher: '/graiedx',
      tutor: '/twotrx/tutor',
      professional: '/',
    };
    return routes[role] || '/';
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="border-b border-slate-200 px-6 py-4">
        <img
          src="https://media.base44.com/images/public/69f64dbf5c37a4db77e0e302/21d29b7f0_64B1F443-0AD3-403D-B726-ABEF11D14419.png"
          alt="edXponential"
          className="h-6 w-auto"
        />
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {step === 'confirm' && linkedinData && (
            <>
              <div className="mb-8">
                <h1 className="text-3xl font-black text-black tracking-tight mb-2">
                  Welcome, {linkedInData.firstName}
                </h1>
                <p className="text-slate-600 text-sm leading-relaxed">
                  We've imported your professional information from LinkedIn.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 mb-8 space-y-4">
                {linkedInData.profilePhoto && (
                  <img
                    src={linkedInData.profilePhoto}
                    alt={linkedInData.firstName}
                    className="w-16 h-16 rounded-lg"
                  />
                )}
                <div>
                  <p className="text-sm font-semibold text-black mb-1">
                    {linkedInData.firstName} {linkedInData.lastName}
                  </p>
                  <p className="text-xs text-slate-600 mb-2">{linkedInData.headline}</p>
                  <p className="text-xs text-slate-600">{linkedInData.company}</p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleContinue}
                disabled={isLoading}
                className="w-full h-10 rounded-lg bg-black text-white text-sm font-semibold hover:bg-slate-900 transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </>
          )}

          {step === 'preferences' && (
            <>
              <div className="mb-8">
                <h1 className="text-3xl font-black text-black tracking-tight mb-2">
                  Your Preferences
                </h1>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Help us personalize your experience.
                </p>
              </div>

              <form onSubmit={handleSubmitPreferences} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    What best describes your role?
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full h-10 px-4 rounded-lg border border-slate-300 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  >
                    <option value="">Select your role</option>
                    <option value="founder">Founder / Entrepreneur</option>
                    <option value="principal">Principal / Headmaster</option>
                    <option value="executive">Executive / Director</option>
                    <option value="teacher">Teacher / Educator</option>
                    <option value="tutor">Tutor / Coach</option>
                    <option value="investor">Investor / Advisor</option>
                    <option value="consultant">Consultant / Specialist</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    What are your primary goals?
                  </label>
                  <div className="space-y-2">
                    {['Learn', 'Teach', 'Raise Capital', 'Build Network', 'Improve Operations'].map(
                      (goal) => (
                        <label key={goal} className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={formData.goals.includes(goal)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData({
                                  ...formData,
                                  goals: [...formData.goals, goal],
                                });
                              } else {
                                setFormData({
                                  ...formData,
                                  goals: formData.goals.filter((g) => g !== goal),
                                });
                              }
                            }}
                            className="w-4 h-4 rounded border-slate-300"
                          />
                          <span className="text-sm text-slate-700">{goal}</span>
                        </label>
                      )
                    )}
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-10 rounded-lg bg-black text-white text-sm font-semibold hover:bg-slate-900 transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      Complete Setup
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              </form>
            </>
          )}

          {step === 'dashboard' && (
            <>
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="flex justify-center mb-6"
                >
                  <CheckCircle className="w-16 h-16 text-green-500" />
                </motion.div>

                <h1 className="text-3xl font-black text-black tracking-tight mb-2">
                  All Set!
                </h1>
                <p className="text-slate-600 text-sm mb-8">
                  Redirecting to your personalized dashboard...
                </p>

                <div className="flex justify-center">
                  <Loader2 className="w-6 h-6 animate-spin text-black" />
                </div>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}