import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Rocket, Heart, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ComingSoon({ 
  feature = 'This Feature',
  description = 'We\'re building something amazing',
  icon: Icon = Rocket
}) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground dark flex items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md text-center"
      >
        {/* Icon */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="mb-8"
        >
          <div className="w-20 h-20 rounded-full bg-primary/25 flex items-center justify-center mx-auto">
            <Icon className="w-12 h-12 text-primary" />
          </div>
        </motion.div>

        {/* Content */}
        <h1 className="heading-1 mb-4 text-white">{feature}</h1>
        <p className="text-text-secondary mb-8 leading-relaxed">
          {description}. We're working hard to bring this to you soon. Thank you for your patience and interest!
        </p>

        {/* Features Coming */}
        <div className="bg-card border border-border rounded-xl p-6 mb-8">
          <p className="text-xs font-semibold text-text-secondary uppercase tracking-widest mb-4">Expected Soon</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-white">
              <Heart className="w-4 h-4 text-primary" />
              <span>Full Feature Release</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-white">
              <Heart className="w-4 h-4 text-primary" />
              <span>Early Access Program</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-white">
              <Heart className="w-4 h-4 text-primary" />
              <span>Documentation & Guides</span>
            </div>
          </div>
        </div>

        {/* Waitlist */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          className="w-full py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition glow-crimson-sm mb-3"
        >
          Join Waitlist
        </motion.button>

        {/* Back Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          onClick={() => navigate(-1)}
          className="w-full py-3 border border-border text-white rounded-lg font-semibold hover:bg-surface/50 transition flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </motion.button>

        {/* Footer Note */}
        <p className="text-xs text-text-tertiary mt-8 flex items-center justify-center gap-2">
          <AlertCircle className="w-4 h-4" />
          You can still use other features in the meantime
        </p>
      </motion.div>
    </div>
  );
}