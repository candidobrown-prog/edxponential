/**
 * XschyDashboardWidget — Compact Xschy Xschraiper™ entry point for the Dashboard top.
 * Links to the full experience page.
 */
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Mic, MicOff, Sparkles, ArrowRight } from 'lucide-react';

const PLACEHOLDERS = [
  'Search Anything Across edXponential and Beyond…',
  'Ask AI: "Find me a school turnaround consultant"',
  'Ask AI: "Create a 5th grade science lesson plan"',
  'Ask AI: "Find grants for charter schools"',
  'Ask AI: "Recommend a math tutor"',
  'Search courses, EdVisors, communities, investors…',
];

const QUICK = [
  'Find a Course', 'Book Coaching', 'Find a Tutor', 'Build a Lesson',
  'Find Grants', 'Raise Capital',
];

export default function XschyDashboardWidget() {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [focused, setFocused] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    setVoiceSupported(!!SpeechRecognition);
    const t = setInterval(() => setPlaceholderIndex(i => (i + 1) % PLACEHOLDERS.length), 3500);
    return () => clearInterval(t);
  }, []);

  const goToXschy = (q) => {
    if (q) {
      navigate('/xschy?q=' + encodeURIComponent(q));
    } else {
      navigate('/xschy');
    }
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    goToXschy(inputValue);
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const r = new SpeechRecognition();
    r.continuous = false;
    r.interimResults = false;
    r.lang = 'en-US';
    r.onstart = () => setIsListening(true);
    r.onresult = (e) => {
      const t = e.results[0][0].transcript;
      setInputValue(t);
      goToXschy(t);
    };
    r.onend = () => setIsListening(false);
    r.onerror = () => setIsListening(false);
    recognitionRef.current = r;
    r.start();
  };

  return (
    <div className="w-full">
      {/* Branding */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-black rounded-lg flex items-center justify-center">
            <span className="text-white font-black text-xs">X²</span>
          </div>
          <span className="font-black text-sm tracking-tight text-foreground">Xschy Xschraiper</span>
          <span className="text-muted-foreground font-black text-[9px]">™</span>
          <span className="bg-muted border border-border text-[9px] font-black uppercase tracking-widest text-muted-foreground px-2 py-0.5 rounded-full hidden sm:inline">AI Intelligence Engine</span>
        </div>
        <button onClick={() => goToXschy('')}
          className="text-muted-foreground text-xs font-bold hover:text-foreground flex items-center gap-1 transition-colors">
          Open Full Experience <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSubmit}>
        <motion.div
          animate={{ boxShadow: focused ? '0 0 0 2px rgba(0,0,0,0.1), 0 8px 24px rgba(0,0,0,0.08)' : '0 2px 12px rgba(0,0,0,0.06)' }}
          className="relative bg-card border border-border rounded-2xl overflow-hidden transition-colors"
          style={{ borderColor: focused ? 'rgba(0,0,0,0.25)' : undefined }}
        >
          <div className="flex items-center gap-3 px-5 py-4">
            <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />

            <div className="flex-1 relative min-w-0">
              <input
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                className="w-full bg-transparent text-foreground text-sm font-medium outline-none placeholder-transparent"
                placeholder=" "
              />
              <AnimatePresence mode="wait">
                {!inputValue && !focused && (
                  <motion.span key={placeholderIndex} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 pointer-events-none text-muted-foreground text-sm truncate">
                    {PLACEHOLDERS[placeholderIndex]}
                  </motion.span>
                )}
                {!inputValue && focused && (
                  <motion.span key="focused" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="absolute inset-0 pointer-events-none text-muted-foreground/50 text-sm">
                    Search Anything Across edXponential and Beyond…
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              {voiceSupported && (
                <button type="button" onClick={isListening ? () => recognitionRef.current?.stop() : startListening}
                  className={`w-8 h-8 flex items-center justify-center rounded-xl transition-all ${isListening ? 'bg-black text-white' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
              )}
              <button type="submit"
                className="flex items-center gap-1.5 bg-black text-white text-xs font-black px-4 py-2 rounded-xl hover:bg-black/85 transition-all">
                <Sparkles className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Ask AI</span>
              </button>
            </div>
          </div>

          {/* Animated listening bar */}
          <AnimatePresence>
            {isListening && (
              <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} exit={{ scaleX: 0 }}
                className="h-0.5 bg-black origin-left" />
            )}
          </AnimatePresence>
        </motion.div>
      </form>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-2 mt-3">
        {QUICK.map((q, i) => (
          <button key={i} onClick={() => goToXschy(`${q} on edXponential`)}
            className="text-[11px] font-bold text-muted-foreground border border-border rounded-full px-3 py-1.5 hover:text-foreground hover:border-foreground/25 transition-all">
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}