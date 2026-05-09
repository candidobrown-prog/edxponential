import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Mic, Volume2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import EddyCharacter from './EddyCharacter';

export default function EddyFloatingAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hey there! I\'m Eddy, your AI concierge. How can I help you today?',
      mood: 'happy',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [user, setUser] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (text) => {
    const message = text || input;
    if (!message.trim()) return;

    setInput('');
    setMessages(m => [...m, { role: 'user', content: message }]);
    setLoading(true);
    setSpeaking(true);

    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are Eddy, the AI concierge of edXponential. You are warm, helpful, encouraging, intelligent, and confident. You never feel childish. You guide ambitious educators into the future.

User: ${message}

Respond in 1-2 sentences naturally, as if you're having a conversation. Be personable and helpful.`,
      });

      setMessages(m => [
        ...m,
        { role: 'assistant', content: response, mood: 'neutral' },
      ]);
    } catch (err) {
      console.error('Error:', err);
    }

    setLoading(false);
    setTimeout(() => setSpeaking(false), 2000);
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            layoutId="eddy-fab"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-40 w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-2xl flex items-center justify-center group hover:shadow-blue-500/50 transition-all"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-full h-full rounded-full flex items-center justify-center"
            >
              <svg
                viewBox="0 0 100 100"
                width="40"
                height="40"
                className="drop-shadow-lg"
              >
                {/* Simple Eddy icon */}
                <circle cx="50" cy="40" r="18" fill="white" opacity="0.9" />
                <circle cx="40" cy="35" r="5" fill="#0066ff" />
                <circle cx="60" cy="35" r="5" fill="#0066ff" />
                <path d="M 45 50 Q 50 55 55 50" stroke="white" strokeWidth="2" fill="none" />
              </svg>
            </motion.div>

            {/* Pulse ring */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-blue-400"
              animate={{ scale: [1, 1.3], opacity: [1, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            layoutId="eddy-fab"
            initial={{ opacity: 0, scale: 0.8, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 100 }}
            className="fixed bottom-6 right-6 z-40 w-96 max-w-[calc(100vw-24px)] bg-gradient-to-br from-[#0a0a0a] to-[#050505] border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
            style={{ height: '640px' }}
          >
            {/* Header with Eddy */}
            <div className="relative p-6 border-b border-white/5 bg-gradient-to-b from-white/5 to-transparent">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-white font-black text-lg">Eddy</h3>
                  <p className="text-white/40 text-xs mt-0.5">Your AI Concierge</p>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="w-8 h-8 rounded-xl hover:bg-white/10 flex items-center justify-center transition-all"
                >
                  <X className="w-4 h-4 text-white/60" />
                </button>
              </div>

              {/* Mini Eddy character */}
              <div className="absolute -right-6 top-1/2 -translate-y-1/2">
                <EddyCharacter
                  size="sm"
                  mood={speaking ? 'happy' : 'neutral'}
                  speaking={speaking}
                />
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white/5 border border-white/10 text-white/80'
                    }`}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}

              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-2"
                >
                  <div className="w-2 h-2 rounded-full bg-white/40 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <div className="w-2 h-2 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '0.4s' }} />
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="p-4 border-t border-white/5 space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask Eddy anything..."
                  className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-blue-500/50 transition-colors text-sm"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSendMessage()}
                  disabled={!input.trim() || loading}
                  className="w-10 h-10 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center transition-all"
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              </div>

              {/* Voice button */}
              <button
                className="w-full px-3 py-2 rounded-lg border border-white/10 text-white/60 hover:text-white/80 text-xs font-medium flex items-center justify-center gap-2 transition-all"
                disabled
              >
                <Mic className="w-3.5 h-3.5" />
                Voice Input (Coming Soon)
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}