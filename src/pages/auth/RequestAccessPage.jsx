import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Linkedin, Mail, ArrowRight, Loader2, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RequestAccessPage() {
  const [step, setStep] = useState('method'); // method, linkedin, manual, confirmation
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    workEmail: '',
    organization: '',
    title: '',
    industry: '',
    linkedinProfile: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [linkedinData, setLinkedinData] = useState(null);

  const handleLinkedInImport = async () => {
    try {
      setIsLoading(true);
      setError('');
      const url = await base44.connectors.connectAppUser('linkedin_professional');
      window.location.href = url;
    } catch (err) {
      setError('Failed to connect LinkedIn. Please try again.');
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError('');

      // Validate work email domain
      const emailDomain = formData.workEmail.split('@')[1];
      const personalDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'icloud.com'];
      if (personalDomains.includes(emailDomain)) {
        setError('Please use your work email address to request access.');
        setIsLoading(false);
        return;
      }

      // Create access request
      await base44.entities.AccessRequest.create({
        first_name: formData.firstName,
        last_name: formData.lastName,
        work_email: formData.workEmail,
        organization: formData.organization,
        title: formData.title,
        industry: formData.industry,
        linkedin_profile: formData.linkedinProfile || linkedinData?.profileUrl,
        source: linkedinData ? 'linkedin' : 'manual',
        status: 'pending',
      });

      setStep('confirmation');
      setIsLoading(false);
    } catch (err) {
      setError('Failed to submit request. Please try again.');
      setIsLoading(false);
    }
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

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {step === 'method' && (
            <>
              <div className="mb-8">
                <h1 className="text-3xl font-black text-black tracking-tight mb-2">
                  Request Access
                </h1>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Join the elite circle of educators, founders, and leaders transforming education.
                </p>
              </div>

              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setStep('linkedin');
                    handleLinkedInImport();
                  }}
                  className="w-full flex items-center justify-center gap-3 h-12 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 transition-all duration-150"
                >
                  <Linkedin className="w-4 h-4 text-[#0A66C2]" />
                  <span className="font-semibold text-sm text-black">
                    Import from LinkedIn
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-400 ml-auto" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setStep('manual')}
                  className="w-full flex items-center justify-center gap-3 h-12 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 transition-all duration-150"
                >
                  <Mail className="w-4 h-4 text-slate-600" />
                  <span className="font-semibold text-sm text-black">
                    Request Manually
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-400 ml-auto" />
                </motion.button>
              </div>

              <p className="text-center text-xs text-slate-600 mt-6">
                Already have an account?{' '}
                <Link to="/login" className="font-semibold text-black hover:underline">
                  Sign in
                </Link>
              </p>
            </>
          )}

          {step === 'manual' && (
            <>
              <div className="mb-8">
                <button
                  onClick={() => setStep('method')}
                  className="text-sm text-slate-600 hover:text-black mb-4 flex items-center gap-1"
                >
                  ← Back
                </button>
                <h1 className="text-3xl font-black text-black tracking-tight mb-2">
                  Tell Us About Yourself
                </h1>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Help us understand your role and match you with the right tools.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium"
                  >
                    {error}
                  </motion.div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="h-10 px-4 rounded-lg border border-slate-300 bg-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="h-10 px-4 rounded-lg border border-slate-300 bg-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    required
                  />
                </div>

                <input
                  type="email"
                  placeholder="Work Email"
                  value={formData.workEmail}
                  onChange={(e) => setFormData({ ...formData, workEmail: e.target.value })}
                  className="w-full h-10 px-4 rounded-lg border border-slate-300 bg-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  required
                />

                <input
                  type="text"
                  placeholder="Organization / School"
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  className="w-full h-10 px-4 rounded-lg border border-slate-300 bg-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  required
                />

                <input
                  type="text"
                  placeholder="Title / Role"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full h-10 px-4 rounded-lg border border-slate-300 bg-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  required
                />

                <select
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full h-10 px-4 rounded-lg border border-slate-300 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  required
                >
                  <option value="">Select Industry</option>
                  <option value="k12">K-12 Education</option>
                  <option value="higher_ed">Higher Education</option>
                  <option value="edtech">EdTech</option>
                  <option value="nonprofit">Nonprofit</option>
                  <option value="corporate">Corporate Training</option>
                  <option value="government">Government</option>
                  <option value="other">Other</option>
                </select>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-10 rounded-lg bg-black text-white text-sm font-semibold hover:bg-slate-900 transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      Submit Request
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              </form>
            </>
          )}

          {step === 'confirmation' && (
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
                  Access Request Submitted
                </h1>
                <p className="text-slate-600 text-sm mb-8 leading-relaxed">
                  Thank you for your interest in edXponential. Our team will review your application and send you an invitation email within 24 hours.
                </p>

                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 mb-8">
                  <p className="text-xs text-slate-600 mb-3">
                    <span className="font-semibold text-black">Submitted Email:</span>
                  </p>
                  <p className="font-semibold text-slate-900">{formData.workEmail}</p>
                </div>

                <Link
                  to="/login"
                  className="inline-block h-10 px-6 rounded-lg bg-black text-white text-sm font-semibold hover:bg-slate-900 transition-all"
                >
                  Back to Login
                </Link>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}