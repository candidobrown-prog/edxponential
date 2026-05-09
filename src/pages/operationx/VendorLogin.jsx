import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, AlertCircle, Building2, ArrowRight } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function VendorLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('email'); // email -> password -> verify

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const vendors = await base44.entities.OpxVendor.filter(
        { contact_email: email.toLowerCase() },
        '-created_date',
        1
      );

      if (vendors.length === 0) {
        setError('No vendor account found with this email. Please contact the school administrator.');
        setLoading(false);
        return;
      }

      // Check if vendor is active
      if (vendors[0].status !== 'active') {
        setError('Your vendor account is not active. Please contact the administrator.');
        setLoading(false);
        return;
      }

      setStep('password');
      setLoading(false);
    } catch (err) {
      setError('Error checking vendor status. Please try again.');
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Please enter your password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // This would normally authenticate the user
      // For now, we redirect to login flow
      await base44.auth.redirectToLogin(`/operationx/vendor?email=${encodeURIComponent(email)}`);
    } catch (err) {
      setError('Authentication failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#080808] via-[#0a0a0a] to-[#050505] flex items-center justify-center px-6 py-12">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/[0.03] blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
              <Building2 className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-black text-white tracking-[-0.04em] mb-2">
            Vendor Portal
          </h1>
          <p className="text-white/40 text-sm">Sign in to manage invoices and compliance</p>
        </motion.div>

        {/* Form */}
        <motion.form
          key={step}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-4 mb-8"
        >
          {step === 'email' && (
            <div className="space-y-3">
              <label className="text-white/70 text-sm font-semibold block">
                Vendor Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="email"
                  value={email}
                  onChange={e => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  placeholder="contact@vendor.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-white/20 transition-colors"
                  disabled={loading}
                />
              </div>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </motion.div>
              )}
            </div>
          )}

          {step === 'password' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-1">
                <label className="text-white/70 text-sm font-semibold">Password</label>
                <button
                  type="button"
                  onClick={() => setStep('email')}
                  className="text-white/40 hover:text-white/60 text-xs transition-colors"
                >
                  Change email
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="password"
                  value={password}
                  onChange={e => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-white/20 transition-colors"
                  disabled={loading}
                  autoFocus
                />
              </div>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </motion.div>
              )}
            </div>
          )}

          <button
            onClick={step === 'email' ? handleEmailSubmit : handlePasswordSubmit}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-white text-black font-semibold hover:bg-white/90 disabled:opacity-50 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            {loading ? 'Checking...' : step === 'email' ? 'Continue' : 'Sign In'}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </motion.form>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="p-4 rounded-xl bg-white/5 border border-white/10"
        >
          <p className="text-white/50 text-xs leading-relaxed">
            <span className="font-semibold text-white/70">First time?</span><br />
            Contact your school administrator for vendor account setup. You'll receive a welcome email with login instructions.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}