import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Mail } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function RequestAccessConfirmation() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || 'your email';
  const tier = searchParams.get('tier') || 'your selected tier';

  return (
    <div className="min-h-screen bg-background text-foreground dark flex items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md text-center"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="mb-8"
        >
          <div className="w-20 h-20 rounded-full bg-primary/25 flex items-center justify-center mx-auto">
            <CheckCircle className="w-12 h-12 text-primary" />
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="heading-1 mb-4 text-white">Application Received</h1>
          <p className="text-text-secondary mb-2">Thank you for requesting access to edXponential!</p>
          <p className="text-text-secondary mb-8">
            We've sent a confirmation email to <span className="text-white font-semibold">{email}</span>
          </p>

          {/* What's Next */}
          <div className="bg-card border border-border rounded-xl p-6 mb-8 text-left">
            <h3 className="font-semibold text-white mb-4">What's Next?</h3>
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/25 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-primary">1</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Check your email</p>
                  <p className="text-xs text-text-secondary">Verify your email address</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/25 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-primary">2</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">We review your profile</p>
                  <p className="text-xs text-text-secondary">Usually within 24 hours</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/25 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-primary">3</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Get approved access</p>
                  <p className="text-xs text-text-secondary">Sign in to your dashboard</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tier Info */}
          {tier !== 'your selected tier' && (
            <div className="bg-surface border border-border rounded-lg p-4 mb-8">
              <p className="text-xs text-text-secondary mb-1">Recommended Tier</p>
              <p className="text-lg font-semibold text-white">{tier}</p>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3 mb-8">
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={() => navigate('/')}
              className="w-full py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition glow-crimson-sm flex items-center justify-center gap-2"
            >
              Return to Home <ArrowRight className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={() => navigate('/pricing')}
              className="w-full py-3 border border-border text-white rounded-lg font-semibold hover:bg-surface/50 transition"
            >
              View Membership Tiers
            </motion.button>
          </div>

          {/* Email Resend */}
          <p className="text-xs text-text-tertiary">
            Didn't receive an email?{' '}
            <button className="text-primary hover:text-primary-light transition">
              Resend confirmation
            </button>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}