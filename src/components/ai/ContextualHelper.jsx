import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, X } from 'lucide-react';

export default function ContextualHelper({ trigger, message, action, actionText = 'Learn more' }) {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (trigger && !dismissed) {
      const timer = setTimeout(() => setShow(true), 500);
      return () => clearTimeout(timer);
    }
  }, [trigger, dismissed]);

  return (
    <AnimatePresence>
      {show && !dismissed && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 10 }}
          className="fixed bottom-6 left-6 max-w-sm bg-white rounded-xl border border-border shadow-lg p-4 z-40"
        >
          <div className="flex gap-3">
            <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-black font-medium mb-2">{message}</p>
              {action && (
                <button
                  onClick={() => {
                    action();
                    setShow(false);
                  }}
                  className="text-xs font-semibold text-black hover:opacity-70 transition-opacity"
                >
                  {actionText} →
                </button>
              )}
            </div>
            <button
              onClick={() => setDismissed(true)}
              className="text-muted-foreground hover:text-black transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}