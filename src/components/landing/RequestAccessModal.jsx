import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Sparkles, CheckCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const ROLES = [
  { value: 'founder', label: 'School Founder' },
  { value: 'superintendent', label: 'Superintendent' },
  { value: 'principal', label: 'Principal' },
  { value: 'teacher', label: 'Teacher' },
  { value: 'coach', label: 'Coach/Mentor' },
  { value: 'investor', label: 'Investor' },
  { value: 'consultant', label: 'Consultant' },
  { value: 'parent', label: 'Parent' },
  { value: 'student', label: 'Student' },
  { value: 'other', label: 'Other' },
];

const INTERESTS = [
  'Building a school',
  'Improving operations',
  'AI-powered tools',
  'Teacher coaching',
  'Leadership development',
  'Fundraising',
  'Investment opportunities',
  'Community access',
  'Recruiting talent',
  'Data & analytics',
];

export default function RequestAccessModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [recommendation, setRecommendation] = useState(null);
  const [formData, setFormData] = useState({
    full_name: '',
    work_email: '',
    role: '',
    organization: '',
    primary_interest: '',
  });

  const validateEmail = (email) => {
    const genericDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com'];
    const domain = email.split('@')[1];
    return !genericDomains.includes(domain);
  };

  const handleSubmit = async () => {
    if (!validateEmail(formData.work_email)) {
      alert('Please use a work email address (not Gmail, Yahoo, etc.)');
      return;
    }

    setLoading(true);

    try {
      // Save application
      const appRecord = await base44.entities.AccessApplication.create({
        full_name: formData.full_name,
        work_email: formData.work_email,
        role: formData.role,
        organization: formData.organization,
        primary_interest: formData.primary_interest,
        submitted_date: new Date().toISOString(),
      });

      // Get AI recommendation
      const prompt = `Based on this education professional's profile, recommend the best membership tier for edXponential.

Profile:
- Name: ${formData.full_name}
- Role: ${formData.role}
- Organization: ${formData.organization}
- Primary Interest: ${formData.primary_interest}

Available tiers:
1. Potentials ($29/mo) - For learners and explorers
2. Principal Park ($49/mo) - For school leaders
3. Founders Sphere ($149/mo) - For founders and entrepreneurs
4. Executive Entourage ($299/mo) - For district leaders
5. EdVisors (custom) - For elite coaches
6. EdVestors (custom) - For investors

Return JSON with tier name and 2-3 sentence reason why.`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: 'object',
          properties: {
            tier: { type: 'string' },
            reason: { type: 'string' },
          },
        },
      });

      // Update application with recommendation
      await base44.entities.AccessApplication.update(appRecord.id, {
        ai_recommendation: result.tier,
        recommendation_reason: result.reason,
      });

      setRecommendation(result);
      setSubmitted(true);

      // Send confirmation email
      try {
        await base44.integrations.Core.SendEmail({
          to: formData.work_email,
          subject: 'Welcome to edXponential – Application Received',
          body: `Hi ${formData.full_name},\n\nThank you for applying to edXponential. We've received your application and our AI has reviewed your profile.\n\nRecommended Tier: ${result.tier}\n\nWhy: ${result.reason}\n\nNext steps: Check your email for more information about accessing your recommended tier.\n\nBest regards,\nThe edXponential Team`,
        });
      } catch (emailError) {
        console.warn('Email send error:', emailError);
      }
    } catch (error) {
      console.error('Application error:', error);
      alert('Error submitting application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isStep1Valid = formData.full_name && formData.work_email && validateEmail(formData.work_email);
  const isStep2Valid = formData.role && formData.organization && formData.primary_interest;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-border flex items-center justify-between p-6 z-10">
              <div>
                <h2 className="heading-2 text-black">Request Access</h2>
                <p className="caption text-muted-foreground mt-1">Join edXponential — take 2 minutes</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-muted rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-8">
              <AnimatePresence mode="wait">
                {!submitted ? (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    {/* Progress */}
                    <div className="mb-8">
                      <div className="flex gap-2 mb-4">
                        {[1, 2].map((s) => (
                          <div
                            key={s}
                            className={`h-1 rounded-full transition-all ${
                              s <= step ? 'bg-primary w-16' : 'bg-muted w-8'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">Step {step} of 2</p>
                    </div>

                    {/* Step 1 */}
                    {step === 1 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-5"
                      >
                        <div>
                          <label className="label block mb-2">Full Name</label>
                          <input
                            type="text"
                            placeholder="Your full name"
                            value={formData.full_name}
                            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                            className="input-base"
                          />
                        </div>

                        <div>
                          <label className="label block mb-2">Work Email</label>
                          <input
                            type="email"
                            placeholder="your.email@school.org"
                            value={formData.work_email}
                            onChange={(e) => setFormData({ ...formData, work_email: e.target.value })}
                            className="input-base"
                          />
                          {formData.work_email && !validateEmail(formData.work_email) && (
                            <p className="text-xs text-destructive mt-2">Please use a work email address</p>
                          )}
                        </div>

                        <div className="flex gap-3 pt-4">
                          <button
                            onClick={onClose}
                            className="flex-1 px-4 py-3 border border-border rounded-lg font-semibold hover:bg-muted transition"
                          >
                            Cancel
                          </button>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setStep(2)}
                            disabled={!isStep1Valid}
                            className="flex-1 px-4 py-3 bg-primary text-white rounded-lg font-semibold disabled:opacity-50 hover:bg-primary/90 transition flex items-center justify-center gap-2"
                          >
                            Continue <ArrowRight className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </motion.div>
                    )}

                    {/* Step 2 */}
                    {step === 2 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-5"
                      >
                        <div>
                          <label className="label block mb-2">Your Role</label>
                          <select
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            className="input-base"
                          >
                            <option value="">Select your role</option>
                            {ROLES.map((r) => (
                              <option key={r.value} value={r.value}>
                                {r.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="label block mb-2">Organization/School</label>
                          <input
                            type="text"
                            placeholder="School or organization name"
                            value={formData.organization}
                            onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                            className="input-base"
                          />
                        </div>

                        <div>
                          <label className="label block mb-2">Primary Interest</label>
                          <select
                            value={formData.primary_interest}
                            onChange={(e) => setFormData({ ...formData, primary_interest: e.target.value })}
                            className="input-base"
                          >
                            <option value="">What interests you most?</option>
                            {INTERESTS.map((interest) => (
                              <option key={interest} value={interest}>
                                {interest}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="flex gap-3 pt-4">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            onClick={() => setStep(1)}
                            className="flex-1 px-4 py-3 border border-border rounded-lg font-semibold hover:bg-muted transition"
                          >
                            Back
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleSubmit}
                            disabled={!isStep2Valid || loading}
                            className="flex-1 px-4 py-3 bg-primary text-white rounded-lg font-semibold disabled:opacity-50 hover:bg-primary/90 transition"
                          >
                            {loading ? 'Analyzing...' : 'Submit & Get Recommendation'}
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="confirmation"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-8 h-8 text-primary" />
                    </div>

                    <h3 className="heading-1 mb-3">Application Received</h3>
                    <p className="body text-muted-foreground mb-8">
                      We've analyzed your profile and generated a personalized recommendation.
                    </p>

                    {recommendation && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-primary/5 border border-primary/20 rounded-xl p-6 text-left mb-8"
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <Sparkles className="w-5 h-5 text-primary" />
                          <p className="font-semibold text-black">Recommended for you</p>
                        </div>
                        <p className="display-2 text-primary mb-3">{recommendation.tier}</p>
                        <p className="body-sm text-foreground">{recommendation.reason}</p>
                      </motion.div>
                    )}

                    <div className="flex flex-col gap-3">
                      <button
                        onClick={() => {
                          onClose();
                          setStep(1);
                          setSubmitted(false);
                          setFormData({
                            full_name: '',
                            work_email: '',
                            role: '',
                            organization: '',
                            primary_interest: '',
                          });
                        }}
                        className="w-full px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition"
                      >
                        Explore Your Tier
                      </button>
                      <button
                        onClick={onClose}
                        className="w-full px-6 py-3 border border-border rounded-lg font-semibold hover:bg-muted transition"
                      >
                        Close
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}