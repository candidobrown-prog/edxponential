import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, User, Volume2, Copy, ThumbsUp, Paperclip, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';

function Message({ msg }) {
  const isUser = msg.role === 'user';
  const [speaking, setSpeaking] = useState(false);

  const speak = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(msg.content);
      utterance.rate = 0.95;
      utterance.pitch = 1;
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(v => v.lang === 'en-US' && v.name.toLowerCase().includes('google')) || voices.find(v => v.lang === 'en-US');
      if (preferred) utterance.voice = preferred;
      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => setSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(msg.content);
    toast.success('Copied to clipboard');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
      className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
          <Sparkles className="w-4 h-4 text-black" />
        </div>
      )}
      <div className={`max-w-[80%] ${isUser ? 'items-end flex flex-col' : ''}`}>
        {msg.fileUrl && (
          <div className="flex items-center gap-2 mb-2 bg-white/10 rounded-xl px-3 py-2">
            <Paperclip className="w-3.5 h-3.5 text-white/50" />
            <span className="text-white/60 text-xs">File attached</span>
          </div>
        )}
        <div className={`rounded-2xl px-4 py-3 ${isUser
          ? 'bg-white text-black'
          : 'bg-white/[0.06] border border-white/[0.08] text-white/80'
        }`}>
          {isUser ? (
            <p className="text-sm font-medium">{msg.content}</p>
          ) : (
            <ReactMarkdown
              className="text-sm leading-relaxed prose prose-sm max-w-none prose-invert [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 [&_p]:text-white/80 [&_strong]:text-white [&_li]:text-white/70 [&_h1]:text-white [&_h2]:text-white [&_h3]:text-white [&_code]:bg-white/10 [&_code]:text-white/70 [&_code]:px-1 [&_code]:rounded"
              components={{
                p: ({ children }) => <p className="my-1 leading-relaxed">{children}</p>,
                ul: ({ children }) => <ul className="my-2 ml-4 list-disc space-y-1">{children}</ul>,
                ol: ({ children }) => <ol className="my-2 ml-4 list-decimal space-y-1">{children}</ol>,
                h1: ({ children }) => <h1 className="text-base font-black text-white my-2">{children}</h1>,
                h2: ({ children }) => <h2 className="text-sm font-black text-white my-2">{children}</h2>,
                h3: ({ children }) => <h3 className="text-sm font-bold text-white my-1.5">{children}</h3>,
              }}
            >
              {msg.content}
            </ReactMarkdown>
          )}
        </div>

        {!isUser && (
          <div className="flex items-center gap-2 mt-1.5 px-1">
            <span className="text-white/20 text-[10px]">{msg.timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            <button onClick={copy} className="text-white/20 hover:text-white/50 transition-colors" title="Copy">
              <Copy className="w-3 h-3" />
            </button>
            <button onClick={speak} className={`transition-colors ${speaking ? 'text-white/70' : 'text-white/20 hover:text-white/50'}`} title="Listen">
              <Volume2 className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
      {isUser && (
        <div className="w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
          <User className="w-4 h-4 text-white/60" />
        </div>
      )}
    </motion.div>
  );
}

const FOLLOW_UPS = [
  'Create a full action plan for this',
  'Generate a template I can use',
  'What resources exist on the platform?',
  'Explain this in simpler terms',
  'What should I do first?',
];

export default function XschyConversation({ conversation, onAsk, uploadedFile, onFileUpload }) {
  const bottomRef = useRef(null);
  const isTyping = conversation.length > 0 && conversation[conversation.length - 1].role === 'user';
  const fileRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  return (
    <div className="mt-6">
      {/* Messages */}
      <div className="space-y-5 min-h-[200px] max-h-[60vh] overflow-y-auto pr-2">
        {conversation.map((msg, i) => (
          <Message key={i} msg={msg} />
        ))}

        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
            <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-black" />
            </div>
            <div className="bg-white/[0.06] border border-white/[0.08] rounded-2xl px-4 py-3 flex items-center gap-2">
              {[0, 0.15, 0.3].map((d, i) => (
                <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-white/50"
                  animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, delay: d, repeat: Infinity }} />
              ))}
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Follow-up suggestions */}
      {conversation.length > 0 && !isTyping && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-5">
          <p className="text-white/20 text-[10px] font-black uppercase tracking-widest mb-2">Continue the conversation</p>
          <div className="flex flex-wrap gap-2">
            {FOLLOW_UPS.map((f, i) => (
              <button key={i} onClick={() => onAsk(f)}
                className="text-[11px] font-bold text-white/40 border border-white/[0.07] rounded-full px-3 py-1.5 hover:text-white/65 hover:border-white/15 transition-all">
                {f}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}