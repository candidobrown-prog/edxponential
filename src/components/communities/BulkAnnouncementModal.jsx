import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { X, Mail, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export default function BulkAnnouncementModal({ community, members, onClose }) {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);

  const handleSend = async () => {
    if (!subject.trim() || !message.trim()) {
      setError('Subject and message are required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get member emails
      const memberEmails = members.map(m => m.user_email).filter(Boolean);
      
      if (memberEmails.length === 0) {
        setError('No members to send to');
        setLoading(false);
        return;
      }

      // Send emails via backend function
      const response = await base44.functions.invoke('sendBulkAnnouncement', {
        community_id: community.id,
        community_name: community.name,
        subject,
        message,
        member_emails: memberEmails,
      });

      setSent(true);
      setTimeout(() => onClose(), 2000);
    } catch (err) {
      setError(err.message || 'Failed to send announcement');
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
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={e => e.stopPropagation()}
          className="bg-white rounded-2xl max-w-lg w-full shadow-xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-black" />
              <h2 className="text-lg font-bold text-black">Send Announcement</h2>
            </div>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {!sent ? (
            <div className="p-6 space-y-4">
              {/* Info */}
              <p className="text-sm text-muted-foreground">
                Send an announcement to {members.length} {members.length === 1 ? 'member' : 'members'} in <strong>{community.name}</strong>
              </p>

              {/* Subject */}
              <div>
                <label className="text-sm font-medium block mb-2">Subject</label>
                <Input
                  placeholder="Announcement subject..."
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  className="rounded-lg"
                  disabled={loading}
                />
              </div>

              {/* Message */}
              <div>
                <label className="text-sm font-medium block mb-2">Message</label>
                <Textarea
                  placeholder="Write your announcement here..."
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  className="rounded-lg min-h-[140px]"
                  disabled={loading}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {message.length} characters
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 flex gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1 rounded-lg"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSend}
                  disabled={loading || !subject.trim() || !message.trim()}
                  className="flex-1 bg-black text-white hover:bg-black/85 rounded-lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4 mr-2" />
                      Send to {members.length}
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-bold text-black mb-1">Announcement sent!</h3>
                <p className="text-sm text-muted-foreground">
                  {members.length} {members.length === 1 ? 'member' : 'members'} received your announcement.
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}