import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Mic, MicOff, Send, Paperclip, X, Sparkles, Loader2 } from 'lucide-react';

export default function XschySearchBar({ query, onQueryChange, onSearch, onAsk, onFileUpload, uploadedFile, onClearFile, compact, loading }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [voiceSupported, setVoiceSupported] = useState(false);
  const [focused, setFocused] = useState(false);
  const [mode, setMode] = useState('search'); // search | ask
  const recognitionRef = useRef(null);
  const inputRef = useRef(null);
  const fileRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    setVoiceSupported(!!SpeechRecognition);
  }, []);

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const t = Array.from(event.results).map(r => r[0].transcript).join('');
      setTranscript(t);
      onQueryChange(t);
    };
    recognition.onend = () => {
      setIsListening(false);
      if (transcript) {
        mode === 'ask' ? onAsk(transcript) : onSearch(transcript);
        setTranscript('');
      }
    };
    recognition.onerror = () => setIsListening(false);
    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!query.trim()) return;
    mode === 'ask' ? onAsk(query) : onSearch(query);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); }
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) onFileUpload(file);
  };

  return (
    <div className={`${compact ? 'mb-6' : 'mb-2'}`}>
      {!compact && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-2xl shadow-white/20">
              <span className="text-black font-black text-xl">X²</span>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-none mb-3">
            Xschy Xschraiper<span className="text-white/30">™</span>
          </h1>
          <p className="text-white/30 text-sm max-w-lg mx-auto">
            AI Intelligence Engine · Search · Voice · Create · Analyze · Discover
          </p>
        </motion.div>
      )}

      {/* Mode toggle */}
      <div className="flex items-center gap-1 mb-3 justify-center">
        {[
          { id: 'search', label: 'Search' },
          { id: 'ask', label: 'Ask AI' },
        ].map(m => (
          <button key={m.id} onClick={() => setMode(m.id)}
            className={`px-4 py-1.5 rounded-full text-xs font-black transition-all ${mode === m.id ? 'bg-white text-black' : 'text-white/35 hover:text-white/60'}`}>
            {m.label}
          </button>
        ))}
      </div>

      {/* Search bar */}
      <form onSubmit={handleSubmit}>
        <motion.div
          animate={{ boxShadow: focused ? '0 0 0 2px rgba(255,255,255,0.15), 0 20px 60px rgba(0,0,0,0.5)' : '0 8px 32px rgba(0,0,0,0.4)' }}
          transition={{ duration: 0.2 }}
          className="relative bg-white/[0.06] border border-white/[0.12] rounded-2xl overflow-hidden"
        >
          {/* Listening glow */}
          <AnimatePresence>
            {isListening && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.06) 0%, transparent 70%)' }} />
            )}
          </AnimatePresence>

          <div className="flex items-center gap-3 px-5 py-4">
            {loading ? (
              <Loader2 className="w-5 h-5 text-white/40 flex-shrink-0 animate-spin" />
            ) : (
              <Search className="w-5 h-5 text-white/30 flex-shrink-0" />
            )}

            <input
              ref={inputRef}
              value={query}
              onChange={e => onQueryChange(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onKeyDown={handleKeyDown}
              placeholder={mode === 'ask' ? 'Ask anything about education, leadership, learning, or your platform…' : 'Search Anything Across edXponential and Beyond…'}
              className="flex-1 bg-transparent text-white placeholder-white/25 text-sm font-medium outline-none min-w-0"
              style={{ caretColor: 'rgba(255,255,255,0.7)' }}
            />

            {/* Live voice animation */}
            <AnimatePresence>
              {isListening && (
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-1">
                  {[0.3, 0.6, 1, 0.7, 0.4].map((h, i) => (
                    <motion.div key={i} className="w-0.5 bg-white/70 rounded-full"
                      animate={{ height: [`${h * 16}px`, `${h * 28}px`, `${h * 16}px`] }}
                      transition={{ duration: 0.6, delay: i * 0.1, repeat: Infinity }} />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action buttons */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {uploadedFile && (
                <div className="flex items-center gap-1.5 bg-white/10 rounded-lg px-2.5 py-1">
                  <span className="text-[10px] text-white/60 font-bold max-w-[80px] truncate">{uploadedFile.name}</span>
                  <button type="button" onClick={onClearFile}><X className="w-3 h-3 text-white/40 hover:text-white/70" /></button>
                </div>
              )}

              <button type="button" onClick={() => fileRef.current?.click()}
                className="w-8 h-8 flex items-center justify-center rounded-xl text-white/30 hover:text-white/60 hover:bg-white/10 transition-all"
                title="Upload file">
                <Paperclip className="w-4 h-4" />
              </button>
              <input ref={fileRef} type="file" className="hidden" onChange={handleFile}
                accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.csv,.png,.jpg,.jpeg,.mp4,.mp3" />

              {voiceSupported && (
                <button type="button"
                  onClick={isListening ? stopListening : startListening}
                  className={`w-8 h-8 flex items-center justify-center rounded-xl transition-all ${isListening ? 'bg-white text-black' : 'text-white/30 hover:text-white/60 hover:bg-white/10'}`}>
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
              )}

              <button type="submit" disabled={!query.trim() || loading}
                className="w-9 h-9 bg-white rounded-xl flex items-center justify-center disabled:opacity-30 hover:bg-white/90 transition-all flex-shrink-0">
                {mode === 'ask' ? <Sparkles className="w-4 h-4 text-black" /> : <Send className="w-4 h-4 text-black" />}
              </button>
            </div>
          </div>
        </motion.div>
      </form>

      {/* Voice status */}
      <AnimatePresence>
        {isListening && (
          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
            className="flex items-center justify-center gap-2 mt-3">
            <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span className="text-white/40 text-xs font-bold">Listening… speak naturally</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}