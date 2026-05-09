import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { X, Send, Loader2, MessageCircle, History, Plus, ChevronRight, Flag, Minimize2, BookMarked } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import EddyMessage from './EddyMessage';
import EddyCharacter from './EddyCharacter';
import EddyWalkthroughs from './EddyWalkthroughs';
import FeedbackModal from './FeedbackModal';
import { cn } from '@/lib/utils';

const QUICK_ACTIONS = [
  { label: 'Complete My Xschool', prompt: 'Help me complete my Xschool profile.' },
  { label: 'Explain Xscores', prompt: 'Explain my Xscores and what they mean.' },
  { label: 'Find an edVisor', prompt: 'Help me find an edVisor that matches my needs.' },
  { label: 'Explore TwotrX', prompt: 'Tell me about TwotrX and how tutoring works.' },
  { label: 'Post a Job', prompt: 'Help me post a job on WonJob.' },
  { label: 'Create a Webinar', prompt: 'How do I create a webinar in TubedX?' },
  { label: 'Pitch Park', prompt: 'How do I launch a capital raise in Pitch Park?' },
  { label: 'Browse edXportante', prompt: 'What content is available in edXportante?' },
];

const WELCOME_MESSAGE = {
  role: 'assistant',
  content: `Hi, I'm **Eddy** — your AI-powered edXponential assistant. 👋\n\nI can help you navigate the platform, build your school profile, connect with edVisors, explore Xscores, launch Pitch Park opportunities, manage tutoring, staffing, video systems, and much more.\n\nWhat would you like to do today?`,
  timestamp: new Date().toISOString(),
};

export default function EddyChatWindow({ user, onClose }) {
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showWalkthroughs, setShowWalkthroughs] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [activeConvId, setActiveConvId] = useState(null);
  const [showEddyWelcome, setShowEddyWelcome] = useState(true);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Hide Eddy welcome after message appears
  useEffect(() => {
    if (messages.length > 1) {
      setTimeout(() => setShowEddyWelcome(false), 2000);
    }
  }, [messages]);

  useEffect(() => {
    if (user?.email) {
      base44.entities.EddyConversation.filter({ user_email: user.email }, '-last_message_at', 20)
        .then(setConversations).catch(() => {});
    }
  }, [user]);

  const sendMessage = async (text) => {
    const userMsg = { role: 'user', content: text, timestamp: new Date().toISOString() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const systemContext = buildSystemContext(user);
      const history = newMessages.slice(-10).map(m => `${m.role === 'user' ? 'User' : 'Eddy'}: ${m.content}`).join('\n');

      const reply = await base44.integrations.Core.InvokeLLM({
        prompt: `${systemContext}\n\nConversation so far:\n${history}\n\nUser: ${text}\n\nEddy:`,
        model: 'claude_sonnet_4_6',
      });

      const assistantMsg = { role: 'assistant', content: reply, timestamp: new Date().toISOString() };
      const finalMessages = [...newMessages, assistantMsg];
      setMessages(finalMessages);

      // Save/update conversation
      await saveConversation(finalMessages);
    } catch (e) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm having trouble connecting right now. Please try again or contact support.",
        timestamp: new Date().toISOString(),
      }]);
    }
    setLoading(false);
  };

  const saveConversation = async (msgs) => {
    if (!user?.email) return;
    const title = msgs.find(m => m.role === 'user')?.content?.slice(0, 60) || 'New Conversation';
    try {
      if (activeConvId) {
        await base44.entities.EddyConversation.update(activeConvId, { messages: msgs, last_message_at: new Date().toISOString() });
      } else {
        const conv = await base44.entities.EddyConversation.create({
          user_email: user.email,
          title,
          messages: msgs,
          last_message_at: new Date().toISOString(),
        });
        setActiveConvId(conv.id);
        setConversations(prev => [conv, ...prev]);
      }
    } catch (e) {}
  };

  const loadConversation = (conv) => {
    setMessages(conv.messages || [WELCOME_MESSAGE]);
    setActiveConvId(conv.id);
    setShowHistory(false);
  };

  const newChat = () => {
    setMessages([WELCOME_MESSAGE]);
    setActiveConvId(null);
    setShowHistory(false);
  };

  return (
    <div
      className="fixed bottom-6 right-6 z-[9999] flex flex-col bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
      style={{ width: 420, height: 620, fontFamily: 'Arial, sans-serif' }}
    >
      {/* Header */}
      <div className="bg-[#0a0f1e] px-5 py-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-black text-sm">Ask Eddy</p>
            <p className="text-white/40 text-xs">edXponential AI Assistant</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowWalkthroughs(true)} className="text-white/40 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-all" title="Platform Walkthroughs">
            <BookMarked className="w-4 h-4" />
          </button>
          <button onClick={() => setShowHistory(!showHistory)} className="text-white/40 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-all" title="Chat History">
            <History className="w-4 h-4" />
          </button>
          <button onClick={newChat} className="text-white/40 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-all" title="New Chat">
            <Plus className="w-4 h-4" />
          </button>
          <button onClick={() => setShowFeedback(true)} className="text-white/40 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-all" title="Send Feedback">
            <Flag className="w-4 h-4" />
          </button>
          <button onClick={onClose} className="text-white/40 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* History panel */}
      {showHistory && (
        <div className="absolute inset-0 top-[68px] bg-white z-10 overflow-y-auto">
          <div className="px-4 py-4 border-b border-gray-100">
            <p className="font-black text-[#0a0f1e] text-sm">Chat History</p>
          </div>
          {conversations.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-8">No previous conversations.</p>
          ) : (
            conversations.map(conv => (
              <button key={conv.id} onClick={() => loadConversation(conv)}
                className="w-full px-4 py-3 border-b border-gray-50 hover:bg-gray-50 text-left flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-[#0a0f1e] line-clamp-1">{conv.title || 'Conversation'}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{new Date(conv.last_message_at || conv.created_date).toLocaleDateString()}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300" />
              </button>
            ))
          )}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 flex flex-col">
        <AnimatePresence mode="wait">
          {showEddyWelcome && messages.length === 1 ? (
            <motion.div
              key="eddy-welcome"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
              className="flex-1 flex items-center justify-center mb-4"
            >
              <div className="text-center">
                <EddyCharacter size="md" mood="happy" isEntering={true} />
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                  className="text-sm text-gray-600 font-semibold mt-4"
                >
                  Hey there! I'm Eddy 👋
                </motion.p>
              </div>
            </motion.div>
          ) : (
            <div key="messages" className="space-y-3">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <EddyMessage message={msg} />
                </motion.div>
              ))}
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2 text-gray-400"
                >
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Eddy is thinking...</span>
                </motion.div>
              )}
            </div>
          )}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Quick actions (only on welcome) */}
      {messages.length === 1 && (
        <div className="px-4 pb-2 flex flex-wrap gap-1.5 flex-shrink-0">
          {QUICK_ACTIONS.slice(0, 4).map(a => (
            <button key={a.label} onClick={() => sendMessage(a.prompt)}
              className="text-xs bg-gray-100 hover:bg-gray-200 text-[#0a0f1e] font-bold px-3 py-1.5 rounded-full transition-all">
              {a.label}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="px-4 py-3 border-t border-gray-100 flex gap-2 flex-shrink-0">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && input.trim() && sendMessage(input.trim())}
          placeholder="Ask Eddy anything..."
          className="flex-1 text-sm border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-[#0a0f1e] transition-all"
          style={{ fontFamily: 'Arial, sans-serif' }}
          disabled={loading}
        />
        <button
          onClick={() => input.trim() && sendMessage(input.trim())}
          disabled={!input.trim() || loading}
          className="bg-[#0a0f1e] text-white p-2.5 rounded-xl hover:bg-black transition-all disabled:opacity-40"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

      {showFeedback && <FeedbackModal user={user} onClose={() => setShowFeedback(false)} />}
      <EddyWalkthroughs
        isOpen={showWalkthroughs}
        onClose={() => setShowWalkthroughs(false)}
        onSelectWalkthrough={sendMessage}
      />
    </div>
  );
}

function buildSystemContext(user) {
  const role = user?.role || 'user';
  const name = user?.full_name || 'there';
  return `You are Eddy, the official AI assistant for the edXponential platform — an enterprise education leadership operating system. You are intelligent, fast, warm, executive-level, and helpful.

The user's name is ${name} and their role is ${role}.

The edXponential platform includes:
- My Xschool: School command center and profile builder
- Xschetails: Deep school data intake and assessment
- Xscores: AI-powered school performance grading system (A-F)
- Pitch Park (Deal Room): Capital raising for education founders
- edVisors: Expert coaching and advisory marketplace
- edVestors: Education investor network
- TwotrX: AI-powered tutoring marketplace connecting schools, parents, and tutors
- WonJob (OneJob): Education job board and hiring platform
- edXportante: AI curriculum and content generation marketplace
- TubedX: Video hosting, livestreaming, webinars, and OTT platform
- Communities: Peer learning and networking groups
- AI Matching: Intelligent matching of founders to investors, schools to tutors, etc.

You help users:
1. Navigate platform features
2. Complete onboarding tasks
3. Understand their Xscores and school data
4. Connect with the right resources
5. Automate workflows
6. Troubleshoot issues
7. Make strategic decisions

Be concise, actionable, and proactive. Use markdown formatting for clarity. When recommending platform actions, mention the specific section they should visit. If users have complex issues or billing/enterprise problems, recommend contacting support at support@edxponential.com or scheduling an enterprise call.`;
}