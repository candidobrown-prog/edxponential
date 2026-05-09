import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const ROLES = [
  'Founder', 'Co-Founder', 'Education Entrepreneur', 'Executive Director', 'CEO',
  'CAO', 'CISO', 'COO', 'CFO', 'Superintendent', 'Assistant Superintendent',
  'Managing Director', 'Principal', 'Assistant Principal', 'Dean',
  'Instructional Coach', 'High-Performing Teacher', 'Teacher Leader', 'Classroom Teacher',
  'Tutor', 'Education Consultant', 'EdVisor', 'Investor', 'Board Member', 'Other'
];

const REASONS = [
  'Build a new school', 'Launch a charter school', 'Run school more effectively',
  'Improve operations', 'Improve instruction', 'Improve school culture',
  'Coach leaders/teachers', 'Sell education products', 'Raise funding',
  'Join professional community', 'Use AI tools', 'Explore platform'
];

const US_STATES = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'];

export default function ApplyPage() {
  const [step, setStep] = useState('form'); // form, submitted
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    role: '',
    workEmail: '',
    organization: '',
    phone: '',
    city: '',
    state: '',
    zipCode: '',
    reasons: [],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError('');

      // Validate work email
      const emailDomain = formData.workEmail.split('@')[1];
      const personalDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com', 'aol.com', 'protonmail.com'];
      if (personalDomains.includes(emailDomain)) {
        setError('Please use your work email. Personal email addresses are not accepted.');
        setIsLoading(false);
        return;
      }

      // Create application
      await base44.entities.ApplicationRequest.create({
        first_name: formData.firstName,
        last_name: formData.lastName,
        role: formData.role,
        work_email: formData.workEmail,
        organization: formData.organization,
        phone: formData.phone || null,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zipCode,
        reasons: formData.reasons,
        status: 'submitted',
      });

      setStep('submitted');
    } catch (err) {
      setError('Failed to submit application. Please try again.');
      setIsLoading(false);
    }
  };

  if (step === 'submitted') {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <div className="border-b border-slate-200 px-6 py-4">
          <img
            src="https://media.base44.com/images/public/69f64dbf5c37a4db77e0e302/21d29b7f0_64B1F443-0AD3-403D-B726-ABEF11D14419.png"
            alt="edXponential"
            className="h-6 w-auto"
          />
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }} className="flex justify-center mb-6">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </motion.div>

            <h1 className="text-3xl font-black text-black tracking-tight mb-2">Application Received</h1>
            <p className="text-slate-600 text-sm mb-8 leading-relaxed">
              Thank you for your interest in edXponential. Our team will review your application and send you an invitation within 24-48 hours if approved.
            </p>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 mb-8">
              <p className="text-xs text-slate-600 mb-2">Submitted Email</p>
              <p className="font-semibold text-slate-900">{formData.workEmail}</p>
            </div>

            <p className="text-xs text-slate-500 mb-8">Check this email for your invitation link.</p>

            <Link to="/" className="inline-block h-10 px-6 rounded-lg bg-black text-white text-sm font-semibold hover:bg-slate-900 transition-all">
              Return Home
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="border-b border-slate-200 px-6 py-4">
        <img
          src="https://media.base44.com/images/public/69f64dbf5c37a4db77e0e302/21d29b7f0_64B1F443-0AD3-403D-B726-ABEF11D14419.png"
          alt="edXponential"
          className="h-6 w-auto"
        />
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-black tracking-tight mb-2">Apply for Access to edXponential</h1>
            <p className="text-slate-600 text-sm leading-relaxed">
              edXponential is an application-and-invite-only AI platform for education founders, executives, school leaders, and innovators.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                {error}
              </motion.div>
            )}

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">First Name *</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full h-10 px-4 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Last Name *</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full h-10 px-4 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Role */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Role *</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full h-10 px-4 rounded-lg border border-slate-300 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                required
              >
                <option value="">Select your role</option>
                {ROLES.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            {/* Work Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Work Email *</label>
              <input
                type="email"
                value={formData.workEmail}
                onChange={(e) => setFormData({ ...formData, workEmail: e.target.value })}
                placeholder="your.name@company.com"
                className="w-full h-10 px-4 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                required
              />
            </div>

            {/* Organization */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">School, District, or Organization *</label>
              <input
                type="text"
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                className="w-full h-10 px-4 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Phone (Optional)</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full h-10 px-4 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>

            {/* Location */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">City *</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full h-10 px-4 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">State *</label>
                <select
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full h-10 px-4 rounded-lg border border-slate-300 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  required
                >
                  <option value="">Select</option>
                  {US_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Zip Code *</label>
                <input
                  type="text"
                  value={formData.zipCode}
                  onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                  className="w-full h-10 px-4 rounded-lg border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Reasons */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-3">What brings you to edXponential? (Select all that apply) *</label>
              <div className="grid grid-cols-2 gap-3">
                {REASONS.map((reason) => (
                  <label key={reason} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.reasons.includes(reason)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({ ...formData, reasons: [...formData.reasons, reason] });
                        } else {
                          setFormData({ ...formData, reasons: formData.reasons.filter((r) => r !== reason) });
                        }
                      }}
                      className="w-4 h-4 rounded border-slate-300"
                    />
                    <span className="text-sm text-slate-700">{reason}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading || formData.reasons.length === 0}
              className="w-full h-10 rounded-lg bg-black text-white text-sm font-semibold hover:bg-slate-900 transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                <>
                  Submit Application
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>

            <p className="text-center text-xs text-slate-600">
              Already approved? <Link to="/signin" className="font-semibold text-black hover:underline">Sign in</Link>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
}