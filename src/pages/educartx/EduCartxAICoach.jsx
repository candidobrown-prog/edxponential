import React, { useState } from 'react';
import { Sparkles, Loader2, Send, MessageSquare, TrendingUp, DollarSign, Target, Megaphone, Package, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import ReactMarkdown from 'react-markdown';

const QUICK_PROMPTS = [
  { icon: DollarSign, label: 'Pricing Strategy', prompt: 'How should I price my digital curriculum bundles to maximize revenue while staying competitive on EduCartx?' },
  { icon: TrendingUp, label: 'Grow My Sales', prompt: 'What are the top 5 strategies to grow my sales on EduCartx this month?' },
  { icon: Megaphone, label: 'Marketing Campaign', prompt: 'Create a 7-day product launch campaign for my new teacher coaching program.' },
  { icon: Package, label: 'Product Bundle', prompt: 'Help me create a high-value product bundle from my existing lesson plans and templates.' },
  { icon: Target, label: 'SEO Optimization', prompt: 'How do I optimize my product listings for better search visibility on EduCartx?' },
  { icon: Zap, label: 'Revenue Forecast', prompt: 'Based on typical EduCartx creator growth patterns, what revenue can I realistically target in 90 days?' },
];

export default function EduCartxAICoach() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `**Welcome to your EduCartx™ AI Commerce Coach** 👋

I'm your personal AI business strategist, built specifically for educational creators and sellers.

I can help you:
- **Grow your sales** and optimize conversions
- **Price your products** strategically
- **Build marketing campaigns** that actually convert
- **Create product bundles** that maximize revenue
- **Improve your storefront** for higher engagement
- **Forecast revenue** and plan your growth

What would you like to work on today?`
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput('');
    setMessages(m => [...m, { role: 'user', content: msg }]);
    setLoading(true);

    try {
      const history = messages.slice(-6).map(m => `${m.role === 'user' ? 'Creator' : 'Coach'}: ${m.content}`).join('\n');
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `You are an elite AI commerce coach for EduCartx™, an AI-powered educational marketplace combining Amazon, Shopify, Kajabi, and Teachers Pay Teachers.

You specialize in helping educational creators, teachers, founders, coaches, and organizations grow their businesses by selling digital products, courses, curriculum, coaching, memberships, and merchandise.

You think like a top ecommerce strategist with deep knowledge of education markets. Give specific, actionable, data-driven advice. Be direct, confident, and executive-level in your tone.

Conversation so far:
${history}

Creator asks: ${msg}

Respond with specific, actionable advice. Use markdown for structure. Be confident and direct.`,
        model: 'claude_sonnet_4_6'
      });
      setMessages(m => [...m, { role: 'assistant', content: res }]);
    } catch {
      setMessages(m => [...m, { role: 'assistant', content: 'I encountered an error. Please try again.' }]);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen text-white flex flex-col" style={{ height: '100vh' }}>
      <div className="border-b border-white/5 px-8 py-5 flex-shrink-0">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-white/50" />
          <h1 className="font-black text-lg tracking-tight">AI Commerce Coach</h1>
        </div>
        <p className="text-xs text-white/30">Your personal AI business strategist — pricing, marketing, growth, and more</p>
      </div>

      {/* Quick Prompts */}
      <div className="px-6 pt-4 flex-shrink-0">
        <div className="flex gap-2 flex-wrap">
          {QUICK_PROMPTS.map((p, i) => (
            <button key={i} onClick={() => sendMessage(p.prompt)}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-white/8 rounded-full text-xs font-black text-white/40 hover:text-white/70 hover:bg-white/5 hover:border-white/15 transition-all">
              <p.icon className="w-3 h-3" />{p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 min-h-0">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.role === 'assistant' && (
              <div className="w-7 h-7 bg-white/10 rounded-lg flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                <Sparkles className="w-3.5 h-3.5 text-white/50" />
              </div>
            )}
            <div className={`max-w-[80%] rounded-2xl px-5 py-3.5 ${m.role === 'user' ? 'bg-white/8 text-white/80 text-sm' : 'bg-white/3 border border-white/6'}`}>
              {m.role === 'assistant' ? (
                <ReactMarkdown className="text-sm text-white/60 leading-relaxed prose-invert prose-sm max-w-none [&>p]:mb-2 [&>ul]:mb-2 [&>ul]:ml-4 [&>ul>li]:mb-1 [&>h2]:text-white/70 [&>h2]:font-black [&>h2]:text-sm [&>strong]:text-white/70">
                  {m.content}
                </ReactMarkdown>
              ) : (
                <p>{m.content}</p>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="w-7 h-7 bg-white/10 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-white/50" />
            </div>
            <div className="bg-white/3 border border-white/6 rounded-2xl px-5 py-4">
              <Loader2 className="w-4 h-4 text-white/30 animate-spin" />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="px-6 pb-6 pt-3 flex-shrink-0 border-t border-white/5">
        <div className="flex gap-3">
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            placeholder="Ask your AI Commerce Coach anything..."
            className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/25" />
          <Button onClick={() => sendMessage()} disabled={loading || !input.trim()}
            className="bg-white text-black font-black h-11 w-11 rounded-2xl hover:bg-white/90 flex-shrink-0 p-0">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}