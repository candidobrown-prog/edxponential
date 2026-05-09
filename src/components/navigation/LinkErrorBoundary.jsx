import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Home, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * LinkErrorBoundary
 * Graceful error handling for broken links and failed pages
 * Shows beautiful fallback UI instead of generic 404
 */
export default function LinkErrorBoundary({ 
  error, 
  resetErrorBoundary,
  attemptedRoute 
}) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-surface/50 to-white flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        {/* Error Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1 }}
          className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-8"
        >
          <AlertCircle className="w-10 h-10 text-destructive" />
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="heading-1 mb-4"
        >
          Page Not Found
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-muted-foreground mb-4"
        >
          {attemptedRoute ? (
            <>
              We couldn't find <span className="font-mono text-destructive">{attemptedRoute}</span>. 
              This might be a broken link or the page has moved.
            </>
          ) : (
            'The page you\'re looking for doesn\'t exist or there was an error loading it.'
          )}
        </motion.p>

        {/* Error Details (Dev Only) */}
        {error && import.meta.env.DEV && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-surface rounded-lg p-4 mb-8 text-left text-xs font-mono text-muted-foreground max-h-32 overflow-y-auto"
          >
            <p className="font-semibold mb-2 text-foreground">Error Details:</p>
            {error.message}
          </motion.div>
        )}

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-border bg-white hover:bg-surface transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-black text-white hover:bg-black/80 transition-all"
          >
            <Home className="w-4 h-4" />
            Return Home
          </button>
        </motion.div>

        {/* Support Option */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-xs text-muted-foreground mt-8"
        >
          Still having trouble? <a href="https://support.edxponential.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Contact support</a>
        </motion.p>
      </motion.div>
    </div>
  );
}