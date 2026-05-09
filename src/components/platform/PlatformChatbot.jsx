import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, RefreshCw, Sparkles } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const PUBLIC_PATHS = ['/', '/welcome', '/pricing', '/onboarding'];

const QUICK_PROMPTS = [
  'Help me complete my Xschetails',
  'Analyze my Xschetails profile',
  'Recommend edVisors from my Xschetails data',
  'How do I improve my Xschetails readiness score?',
  'Use my Xschetails data to recommend tutoring supports',
  'Generate an improvement plan from my Xschetails',
  'What courses should I take?',
  'How do I connect with investors?',
];

export default function PlatformChatbot() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Welcome to the edXponential AI Assistant. I can help you complete your Xschetails, get recommendations, analyze your school profile, or guide you through any part of the platform. What would you like to do?',
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [xschetails, setXschetails] = useState(null);
  const endRef = useRef(null);

  useEffect(() => {
    if (open && !xschetails) {
      base44.auth.me().then(async u => {
        const records = await base44.entities.Xschetails.filter({ user_email: u.email }, '-created_date', 1);
        if (records.length > 0) setXschetails(records[0]);
      }).catch(() => {});
    }
  }, [open]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const userMsg = text || input.trim();
    if (!userMsg) return;
    setInput('');
    setMessages(m => [...m, { role: 'user', content: userMsg }]);
    setLoading(true);

    const context = xschetails
      ? `The user's Xschetails school profile: School: ${xschetails.school_name}, Type: ${xschetails.school_type}, Grades: ${xschetails.grades_served}, Enrollment: ${xschetails.enrollment}, Reading: ${xschetails.reading_proficiency}%, Math: ${xschetails.math_proficiency}%, Goals: ${xschetails.top_goals}, Challenge: ${xschetails.biggest_challenge}, Coaching needs: ${xschetails.coaching_needs}, Vacancies: ${xschetails.vacancies}. `
      : 'The user has not yet completed their Xschetails profile. ';

    const history = messages.slice(-6).map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n');

    const prompt = `You are the edXponential AI Assistant — a world-class education strategy advisor and platform guide. You are intelligent, executive-level, warm, and highly specific. You help education leaders build extraordinary schools, careers, and organizations.

Platform context: edXponential is a premium platform for education founders, executives, principals, tutors, coaches, and investors. Key products include: Xschetails (school intelligence profiles), edVisors (coaching network), TwotrX (tutoring marketplace), OneJob (education hiring), edXportante (content marketplace), Deal Room (capital matching), and edVestors (investor network).

${context}

Conversation so far:
${history}

User: ${userMsg}

Respond in 2-4 short paragraphs. Be specific, actionable, and reference the user's Xschetails data when available. Use a confident, executive tone. If relevant, recommend specific platform features or next steps.`;

    const result = await base44.integrations.Core.InvokeLLM({ prompt });
    setMessages(m => [...m, { role: 'assistant', content: result }]);
    setLoading(false);
  };

  // Hide on public pages
  if (PUBLIC_PATHS.includes(location.pathname)) {
    return null;
  }

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!open && (
          <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#0a0f1e] text-white rounded-2xl shadow-2xl flex items-center justify-center hover:bg-[#1a2033] transition-all group">
            <MessageCircle className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-24px)] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
            style={{ height: '540px', fontFamily: 'Arial, sans-serif' }}>

            {/* Header */}
            <div className="bg-[#0a0f1e] px-5 py-4 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-white font-black text-sm">edX Assistant</p>
                  <p className="text-white/40 text-[10px]">Powered by edXponential AI</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="w-7 h-7 flex items-center justify-center rounded-xl hover:bg-white/10 transition-all">
                <X className="w-4 h-4 text-white/50" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed
                    ${msg.role === 'user' ? 'bg-[#0a0f1e] text-white' : 'bg-gray-50 text-gray-700 border border-gray-100'}`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 flex items-center gap-2">
                    <RefreshCw className="w-3.5 h-3.5 text-gray-400 animate-spin" />
                    <span className="text-gray-400 text-xs">Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* Quick Prompts */}
            {messages.length === 1 && (
              <div className="px-4 pb-2 flex gap-2 overflow-x-auto flex-shrink-0">
                {QUICK_PROMPTS.slice(0, 3).map(p => (
                  <button key={p} onClick={() => sendMessage(p)}
                    className="whitespace-nowrap text-xs px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-gray-600 font-semibold hover:bg-gray-100 transition-all flex-shrink-0">
                    {p}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-gray-100 flex-shrink-0">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                  placeholder="Ask anything about your school..."
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a0f1e]/20 focus:border-[#0a0f1e]"
                />
                <button onClick={() => sendMessage()} disabled={!input.trim() || loading}
                  className="w-10 h-10 bg-[#0a0f1e] rounded-xl flex items-center justify-center disabled:opacity-40 hover:bg-[#1a2033] transition-all">
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}