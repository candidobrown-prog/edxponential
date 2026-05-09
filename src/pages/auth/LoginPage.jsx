import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Linkedin, Mail, ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLinkedInSignIn = async () => {
    try {
      setIsLoading(true);
      setError('');
      const url = await base44.connectors.connectAppUser('linkedin_professional');
      window.location.href = url;
    } catch (err) {
      setError('Failed to initiate LinkedIn sign-in. Please try again.');
      setIsLoading(false);
    }
  };

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError('');
      // This will be handled by Base44 auth
      await base44.auth.redirectToLogin();
    } catch (err) {
      setError('Authentication failed. Please try again.');
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
          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-3xl font-black text-black tracking-tight mb-2">
              Welcome Back
            </h1>
            <p className="text-slate-600 text-sm leading-relaxed">
              The AI-powered operating system for education leadership, innovation, and transformation.
            </p>
          </div>

          {/* LinkedIn Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLinkedInSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 h-12 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 transition-all duration-150 mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-slate-600" />
            ) : (
              <>
                <Linkedin className="w-4 h-4 text-[#0A66C2]" />
                <span className="font-semibold text-sm text-black">Continue with LinkedIn</span>
              </>
            )}
          </motion.button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400 font-medium">OR</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Email Form */}
          <form onSubmit={handleEmailSignIn} className="space-y-4 mb-6">
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium"
              >
                {error}
              </motion.div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Work Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hello@company.com"
                className="w-full h-10 px-4 rounded-lg border border-slate-300 bg-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-10 px-4 rounded-lg border border-slate-300 bg-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                required
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading || !email || !password}
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
          </form>

          {/* Footer Links */}
          <div className="space-y-2 text-center text-xs">
            <p>
              <button className="text-slate-600 hover:text-black transition-colors">
                Forgot password?
              </button>
            </p>
            <p>
              Don't have an account?{' '}
              <Link to="/request-access" className="font-semibold text-black hover:underline">
                Request access
              </Link>
            </p>
            <p>
              <button className="text-slate-600 hover:text-black transition-colors">
                Contact support
              </button>
            </p>
          </div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-12 pt-8 border-t border-slate-200"
          >
            <p className="text-[11px] text-slate-500 font-medium uppercase tracking-widest text-center mb-4">
              Enterprise Security
            </p>
            <div className="flex items-center justify-center gap-6 text-slate-400">
              <span className="text-xs">🔒 OAuth 2.0</span>
              <span className="text-xs">✓ GDPR Compliant</span>
              <span className="text-xs">📋 SOC 2</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}