import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';

export default function EddyAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: "Hi! I'm Eddy, your AI guide. I'm here to help you navigate edXponential and answer questions about your school. What would you like to know?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
    };
    fetchUser();
  }, []);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    const prompt = `You are Eddy, an intelligent AI assistant for edXponential, an education management platform. 
The user is: ${user?.role_type || 'a user'} at a ${user?.organization_type || 'school'} with a team of ${user?.team_size || 'a few'} people.

User message: "${input}"

Respond warmly, helpfully, and concisely (2-3 sentences). If they ask about features, explain how edXponential can help them.`;

    try {
      const response = await base44.integrations.Core.InvokeLLM({ prompt });

      const assistantMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Eddy error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Chat Bubble */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-orange-500 text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center z-40 group"
          >
            <MessageCircle className="w-6 h-6" />
            <span className="absolute bottom-16 right-0 text-xs text-white bg-gray-900 px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
              Ask Eddy
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 w-96 h-[500px] rounded-2xl bg-white shadow-2xl border-2 border-gray-200 flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-orange-500 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                <h3 className="font-bold">Eddy AI Guide</h3>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, idx) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-2xl ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-gray-100 text-gray-900 rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                  </div>
                </motion.div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 px-4 py-2 rounded-2xl rounded-bl-none">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" />
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-100" />
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-200" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask me anything…"
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-600"
                disabled={loading}
              />
              <button
                onClick={handleSendMessage}
                disabled={loading || !input.trim()}
                className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 transition-all"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}