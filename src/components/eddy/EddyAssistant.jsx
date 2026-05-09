import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import EddyCharacter from './EddyCharacter';

const QUICK_SUGGESTIONS = [
  'Show me my platform overview',
  'What tier is right for me?',
  'Guide me through GraiedX',
  'How can Eddy help?',
  'What should I do next?',
];

export default function EddyAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [unread, setUnread] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  useEffect(() => {
    if (messages.length === 0 && open) {
      const initialMessage = `Hey ${user?.full_name?.split(' ')[0] || 'there'}! 👋 How can I help you succeed on edXponential today?`;
      setMessages([{ role: 'assistant', content: initialMessage, expression: 'friendly' }]);
    }
  }, [open, user]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!open) {
      const timer = setTimeout(() => setUnread(true), 5000);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const sendMessage = async (text) => {
    const userMsg = text || input.trim();
    if (!userMsg) return;

    setInput('');
    setMessages(m => [...m, { role: 'user', content: userMsg }]);
    setLoading(true);

    const prompt = `You are Eddy, the AI mascot and guide for edXponential. You're brilliant, warm, and an executive-level advisor.

User: ${user?.full_name || 'User'}
Role: ${user?.eddy_role || 'Not yet specified'}

User message: "${userMsg}"

Respond warmly and helpfully in 1-2 sentences. Be specific, actionable, and reference platform features when relevant. Sound like a trusted advisor, not a bot.`;

    const result = await base44.integrations.Core.InvokeLLM({ prompt });
    setMessages(m => [...m, { role: 'assistant', content: result, expression: 'friendly' }]);
    setLoading(false);
  };

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => {
              setOpen(true);
              setUnread(false);
            }}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-black text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-black/90 transition-all group border border-white/10"
          >
            <MessageCircle className="w-6 h-6" />
            {unread && <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full" />}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-24px)] bg-gradient-to-br from-[#0a0a0a] to-[#050505] rounded-2xl shadow-2xl border border-white/10 flex flex-col overflow-hidden"
            style={{ height: '600px' }}
          >
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-black to-black/80 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Eddy</p>
                  <p className="text-white/40 text-[10px]">AI Guide</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setVoiceEnabled(!voiceEnabled)}
                  className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors"
                >
                  {voiceEnabled ? (
                    <Volume2 className="w-4 h-4 text-white/60" />
                  ) : (
                    <VolumeX className="w-4 h-4 text-white/40" />
                  )}
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-white/60" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center gap-4">
                  <EddyCharacter size="md" expression="friendly" />
                </div>
              ) : (
                messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start gap-2'}`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="w-7 h-7 rounded-full bg-white/5 flex-shrink-0 flex items-center justify-center">
                        <Sparkles className="w-3.5 h-3.5 text-white/40" />
                      </div>
                    )}
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-white text-black'
                          : 'bg-white/5 border border-white/10 text-white/90'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </motion.div>
                ))
              )}

              {loading && (
                <motion.div className="flex justify-start gap-2">
                  <div className="w-7 h-7 rounded-full bg-white/5 flex-shrink-0 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white/40 animate-pulse" />
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 flex gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/40 animate-pulse" />
                    <div className="w-1.5 h-1.5 rounded-full bg-white/40 animate-pulse" style={{ animationDelay: '0.2s' }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-white/40 animate-pulse" style={{ animationDelay: '0.4s' }} />
                  </div>
                </motion.div>
              )}
              <div ref={scrollRef} />
            </div>

            {/* Quick suggestions */}
            {messages.length <= 1 && (
              <div className="px-4 py-2 flex gap-2 overflow-x-auto border-t border-white/5">
                {QUICK_SUGGESTIONS.slice(0, 2).map(suggestion => (
                  <motion.button
                    key={suggestion}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => sendMessage(suggestion)}
                    className="whitespace-nowrap text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 font-medium transition-all flex-shrink-0"
                  >
                    {suggestion}
                  </motion.button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-white/5 bg-black/50 flex-shrink-0">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                  placeholder="Ask Eddy anything..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-white/20 transition-colors text-sm"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || loading}
                  className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center disabled:opacity-40 hover:bg-white/90 transition-all flex-shrink-0"
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}