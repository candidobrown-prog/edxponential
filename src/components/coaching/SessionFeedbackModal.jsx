import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Send, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export default function SessionFeedbackModal({ session, onClose = () => {} }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      return;
    }

    setLoading(true);
    try {
      const user = await base44.auth.me();

      await base44.entities.CoachingSessionFeedback?.create?.({
        session_id: session.id,
        executive_email: user.email,
        coach_email: session.coach_email,
        session_title: session.title,
        rating,
        comment: comment || null,
        submitted_at: new Date().toISOString(),
      });

      setSubmitted(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl"
        >
          {!submitted ? (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                How was your session?
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Help us improve by rating your experience with {session.coach_name || 'your coach'}
              </p>

              {/* Star Rating */}
              <div className="flex justify-center gap-3 mb-8">
                {[1, 2, 3, 4, 5].map(star => (
                  <motion.button
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="transition-all"
                  >
                    <Star
                      className={`w-10 h-10 transition-all ${
                        star <= (hoverRating || rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </motion.button>
                ))}
              </div>

              {/* Rating Label */}
              {rating > 0 && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center text-sm font-semibold text-gray-900 mb-6"
                >
                  {rating === 1 && 'Needs improvement'}
                  {rating === 2 && 'Below expectations'}
                  {rating === 3 && 'Good session'}
                  {rating === 4 && 'Great session'}
                  {rating === 5 && 'Excellent session'}
                </motion.p>
              )}

              {/* Comment */}
              <Textarea
                placeholder="Share any additional feedback (optional)"
                value={comment}
                onChange={e => setComment(e.target.value)}
                className="mb-6 min-h-[100px] text-sm"
              />

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1"
                >
                  Skip
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={rating === 0 || loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit
                    </>
                  )}
                </Button>
              </div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Thank you!
              </h3>
              <p className="text-sm text-gray-600">
                Your feedback helps us improve coaching quality.
              </p>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}