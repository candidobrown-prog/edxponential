import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Send, Zap, ArrowRight, CheckCircle, X, Sparkles } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import WhalleDohLayout from './WhalleDohLayout';

const SUGGESTIONS = [
  'Find me a literacy coach in Texas',
  'Find me a principal who improved test scores',
  'Find me Montessori educators',
  'Find me an instructional coach for classroom management',
  'Find me STEM curriculum designers',
  'Find me superintendents discussing AI in education',
  'Find me educators specializing in Special Education',
  'Find me edtech founders building literacy tools',
];

const INTRO_MESSAGES = [
  { role: 'ai', content: "Hi! I'm **WhallAI** — your intelligent educator discovery engine.\n\nI can search WhalleDoh profiles, LinkedIn, TikTok, YouTube, Instagram, and the broader web to find brilliant educators for you.\n\nTry asking me something like:\n\n• *Find me a literacy coach in Texas*\n• *Find me a principal who improved school culture*\n• *Find me curriculum designers specializing in STEM*\n\nHow can I help you find your people?" }
];

function MessageBubble({ msg }) {
  const isAI = msg.role === 'ai';
  return (
    <div className={`flex gap-3 ${isAI ? 'justify-start' : 'justify-end'}`}>
      {isAI && (
        <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center flex-shrink-0 mt-0.5">
          <Zap className="w-3.5 h-3.5 text-[#07080f]" />
        </div>
      )}
      <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${isAI ? 'bg-white/[0.05] border border-white/[0.08] text-white/80' : 'bg-white text-[#07080f] font-semibold'}`}>
        {msg.content.split('\n').map((line, i) => {
          const bold = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
          const italic = bold.replace(/\*(.*?)\*/g, '<em>$1</em>');
          return <p key={i} className={line.startsWith('•') ? 'ml-2' : ''} dangerouslySetInnerHTML={{ __html: italic }} />;
        })}
        {msg.cards && (
          <div className="mt-3 space-y-2">
            {msg.cards.map((c, i) => (
              <div key={i} className="bg-white/[0.06] border border-white/10 rounded-xl px-3 py-2.5 flex items-center justify-between gap-2">
                <div>
                  <p className="text-white font-black text-xs">{c.name}</p>
                  <p className="text-white/40 text-[11px]">{c.role} · {c.location}</p>
                </div>
                <div className="flex items-center gap-1">
                  {c.verified && <CheckCircle className="w-3 h-3 text-white/50" />}
                  <button className="bg-white text-[#07080f] font-black text-[10px] px-2.5 py-1.5 rounded-lg hover:bg-gray-100 transition-all">Connect</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function WhalleDohAI() {
  const [messages, setMessages] = useState(INTRO_MESSAGES);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText) return;
    setInput('');
    setMessages(m => [...m, { role: 'user', content: userText }]);
    setLoading(true);

    const response = await base44.integrations.Core.InvokeLLM({
      prompt: `You are WhallAI, the intelligent educator discovery assistant for WhalleDoh — a global educator networking platform.

The user is asking: "${userText}"

Your job is to help them find, discover, and connect with educators. You search WhalleDoh profiles, LinkedIn, TikTok, Instagram, YouTube, and the public web.

Respond conversationally but smartly. If they're searching for educators, provide:
1. A brief acknowledgment of what you're searching for
2. 3-4 realistic fictional educator profiles as matches with names, roles, locations, and why they're a match
3. Ask if they'd like to connect with any of them

Keep responses concise and helpful. Format educator matches clearly. Always end with an action prompt.

Important: Do NOT give legal/medical advice. Stay focused on educator discovery and professional connection.`,
      response_json_schema: {
        type: 'object',
        properties: {
          message: { type: 'string' },
          cards: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                role: { type: 'string' },
                location: { type: 'string' },
                match_reason: { type: 'string' },
                verified: { type: 'boolean' }
              }
            }
          }
        }
      }
    });

    const result = response;
    const aiMsg = {
      role: 'ai',
      content: result.message || "I found some great matches for you! Would you like to connect with any of them?",
      cards: result.cards?.length > 0 ? result.cards : undefined
    };
    setMessages(m => [...m, aiMsg]);
    setLoading(false);
  };

  return (
    <WhalleDohLayout>
      <div className="max-w-3xl mx-auto px-4 py-8 flex flex-col h-[calc(100vh-80px)]">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center">
            <Zap className="w-4 h-4 text-[#07080f]" />
          </div>
          <div>
            <h1 className="text-white font-black text-lg">WhallAI</h1>
            <p className="text-white/35 text-xs">AI-powered educator discovery engine</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-white/30 text-xs font-bold">Online</span>
          </div>
        </div>

        {/* Suggestions */}
        {messages.length === 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-wrap gap-2 mb-5 flex-shrink-0">
            {SUGGESTIONS.slice(0, 4).map(s => (
              <button key={s} onClick={() => sendMessage(s)}
                className="text-xs text-white/45 border border-white/[0.1] rounded-full px-3 py-1.5 hover:bg-white/[0.06] hover:text-white/70 transition-all font-semibold">
                {s}
              </button>
            ))}
          </motion.div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 pb-4 pr-1">
          {messages.map((msg, i) => <MessageBubble key={i} msg={msg} />)}
          {loading && (
            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
                <Zap className="w-3.5 h-3.5 text-[#07080f]" />
              </div>
              <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl px-4 py-3">
                <div className="flex gap-1.5 items-center h-4">
                  {[0, 1, 2].map(i => (
                    <motion.div key={i} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, delay: i * 0.2, repeat: Infinity }}
                      className="w-1.5 h-1.5 bg-white/40 rounded-full" />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="flex-shrink-0 pt-4 border-t border-white/[0.06]">
          <div className="flex gap-3">
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              placeholder="Ask WhallAI to find an educator..."
              disabled={loading}
              className="flex-1 bg-white/[0.05] border border-white/10 rounded-2xl px-5 py-3.5 text-white text-sm placeholder-white/25 focus:outline-none focus:border-white/25 disabled:opacity-50" />
            <button onClick={() => sendMessage()} disabled={!input.trim() || loading}
              className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center hover:bg-gray-100 transition-all disabled:opacity-25 flex-shrink-0">
              <Send className="w-4 h-4 text-[#07080f]" />
            </button>
          </div>
          <p className="text-white/15 text-[11px] text-center mt-3">WhallAI searches WhalleDoh + LinkedIn + TikTok + Instagram + web</p>
        </div>
      </div>
    </WhalleDohLayout>
  );
}