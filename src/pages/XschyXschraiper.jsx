import React, { useState, useEffect, useRef, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Upload, X, Sparkles, Search, Mic, MicOff, Volume2, VolumeX, ChevronDown, BookOpen, Users, Star, Briefcase, GraduationCap, Building2, DollarSign, FileText, Video, MessageSquare } from 'lucide-react';
import XschySearchBar from '@/components/xschy/XschySearchBar';
import XschyResults from '@/components/xschy/XschyResults';
import XschyConversation from '@/components/xschy/XschyConversation';

const SUGGESTED_QUERIES = [
  'Find me a school turnaround consultant',
  'Best classroom management courses',
  'Grants for charter schools',
  'Create a 5th grade science lesson plan',
  'Recommend a math tutor',
  'Montessori leadership resources',
  'Improve reading proficiency strategies',
  'Find investors for education startups',
  'Build a school improvement plan',
  'Top-selling EduCart products',
];

const TRENDING = [
  'AI in education', 'School turnaround', 'Reading intervention', 'Math coaching',
  'Charter school grants', 'EdVisor sessions', 'Lesson plan templates',
];

const QUICK_ACTIONS = [
  { icon: BookOpen, label: 'Find a Course', query: 'Show me top education leadership courses' },
  { icon: Star, label: 'Book Coaching', query: 'Book a coaching session with an EdVisor' },
  { icon: GraduationCap, label: 'Find a Tutor', query: 'Find a certified math tutor near me' },
  { icon: FileText, label: 'Build a Lesson', query: 'Create a detailed lesson plan for grade 5 science' },
  { icon: DollarSign, label: 'Find Grants', query: 'Find grants for charter school educators' },
  { icon: Briefcase, label: 'Raise Capital', query: 'Find investors for my education organization' },
  { icon: Users, label: 'Join a Community', query: 'Recommend the best principal leadership community' },
  { icon: Building2, label: 'School Analysis', query: 'Analyze my school performance and suggest improvements' },
];

export default function XschyXschraiper() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('home'); // home | results | conversation
  const [conversation, setConversation] = useState([]);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
    // Handle ?q= param from widget
    const params = new URLSearchParams(window.location.search);
    const qParam = params.get('q');
    if (qParam) {
      setQuery(qParam);
      setTimeout(() => handleSearch(qParam), 100);
    }
  }, []);

  const handleSearch = useCallback(async (searchQuery, fileContext) => {
    if (!searchQuery.trim()) return;
    setQuery(searchQuery);
    setLoading(true);
    setMode('results');

    try {
      const [courses, coaches, communities, deals, jobs, tutors, content] = await Promise.all([
        base44.entities.Course.list('-created_date', 50),
        base44.entities.CoachingSession.list('-created_date', 20),
        base44.entities.Community.list('-created_date', 20),
        base44.entities.DealRoom.filter({ status: 'active' }, '-created_date', 10),
        base44.entities.JobPost.filter({ status: 'active' }, '-created_date', 10),
        base44.entities.TutorProfile.filter({ status: 'approved' }, '-created_date', 10),
        base44.entities.ContentItem.filter({ status: 'published' }, '-created_date', 20),
      ]);

      const q = searchQuery.toLowerCase();
      const filterRelevant = (items, fields) => items.filter(item =>
        fields.some(f => (item[f] || '').toLowerCase().includes(q))
      ).slice(0, 4);

      const matchedCourses = filterRelevant(courses, ['title', 'description', 'subject', 'topic']);
      const matchedCoaches = filterRelevant(coaches, ['coach_name', 'bio', 'coach_title', 'specializations']);
      const matchedCommunities = filterRelevant(communities, ['name', 'description', 'category']);
      const matchedJobs = filterRelevant(jobs, ['job_title', 'description', 'organization_name']);
      const matchedTutors = filterRelevant(tutors, ['full_name', 'subjects', 'bio', 'specializations']);
      const matchedContent = filterRelevant(content, ['title', 'description', 'topic', 'subject']);

      const aiPrompt = `You are Xschy Xschraiper™, the AI intelligence engine of edXponential — the world's most advanced education platform.

User query: "${searchQuery}"
${fileContext ? `File context: ${fileContext}` : ''}
User role: ${user?.role || 'educator'}

Platform data found:
- Courses: ${matchedCourses.map(c => c.title).join(', ') || 'none matching'}
- EdVisors: ${matchedCoaches.map(c => c.coach_name).join(', ') || 'none matching'}
- Communities: ${matchedCommunities.map(c => c.name).join(', ') || 'none matching'}
- Jobs: ${matchedJobs.map(j => j.job_title).join(', ') || 'none matching'}
- Tutors: ${matchedTutors.map(t => t.full_name).join(', ') || 'none matching'}
- Content: ${matchedContent.map(c => c.title).join(', ') || 'none matching'}

Provide:
1. A powerful, expert AI answer (3–5 sentences) that directly addresses the query with education-specific intelligence.
2. 3 concrete recommended actions the user should take on the platform.
3. 3 related search suggestions to explore next.

Be authoritative, warm, and strategic. Sound like a world-class education executive + AI system combined.`;

      const aiResponse = await base44.integrations.Core.InvokeLLM({
        prompt: aiPrompt,
        add_context_from_internet: true,
        response_json_schema: {
          type: 'object',
          properties: {
            answer: { type: 'string' },
            actions: { type: 'array', items: { type: 'string' } },
            related_searches: { type: 'array', items: { type: 'string' } },
          },
        },
      });

      setResults({
        query: searchQuery,
        ai: aiResponse,
        courses: matchedCourses,
        coaches: matchedCoaches,
        communities: matchedCommunities,
        jobs: matchedJobs,
        tutors: matchedTutors,
        content: matchedContent,
        allCourses: courses.slice(0, 6),
      });
    } catch (err) {
      setResults({ query: searchQuery, ai: { answer: 'Intelligence is processing your query. Explore the platform sections below.', actions: [], related_searches: [] }, courses: [], coaches: [], communities: [], jobs: [], tutors: [], content: [] });
    } finally {
      setLoading(false);
    }
  }, [user]);

  const handleAsk = useCallback(async (message, fileUrl) => {
    const userMsg = { role: 'user', content: message, timestamp: new Date(), fileUrl };
    setConversation(prev => [...prev, userMsg]);
    setMode('conversation');

    let fileContext = '';
    if (fileUrl) {
      try {
        const extracted = await base44.integrations.Core.ExtractDataFromUploadedFile({
          file_url: fileUrl,
          json_schema: { type: 'object', properties: { summary: { type: 'string' }, key_points: { type: 'array', items: { type: 'string' } } } },
        });
        fileContext = `Uploaded file content: ${JSON.stringify(extracted?.output || {})}`;
      } catch {}
    }

    try {
      const history = conversation.slice(-6).map(m => `${m.role === 'user' ? 'User' : 'Xschy'}: ${m.content}`).join('\n');

      const prompt = `You are Xschy Xschraiper™ — the AI intelligence engine, search system, and conversational assistant for edXponential.
You combine the intelligence of Google, ChatGPT, Perplexity, LinkedIn, and Notion AI, focused entirely on education, leadership, school transformation, and professional development.

Conversation history:
${history}

Current message: "${message}"
${fileContext}

Respond as the world's most intelligent education AI assistant. Be:
- Deeply knowledgeable about education, pedagogy, school leadership, curriculum, and edtech
- Actionable and specific — give real strategies, not vague advice
- Warm but authoritative — like a brilliant education executive + AI system
- Concise yet comprehensive (aim for 150–250 words)
- Always suggest 2-3 next steps the user can take on the edXponential platform

If the user asks to create something (lesson plan, assessment, curriculum, etc.) — actually CREATE it in full detail.`;

      const aiResponse = await base44.integrations.Core.InvokeLLM({ prompt });
      setConversation(prev => [...prev, { role: 'assistant', content: aiResponse, timestamp: new Date() }]);
    } catch {
      setConversation(prev => [...prev, { role: 'assistant', content: 'Intelligence engine is active. Please try your question again.', timestamp: new Date() }]);
    }
  }, [conversation]);

  const handleFileUpload = async (file) => {
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setUploadedFile({ name: file.name, url: file_url });
    } catch {}
  };

  return (
    <div className="min-h-screen bg-[#080808]" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
      {/* Top bar */}
      <div className="border-b border-white/[0.06] px-6 lg:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center">
            <span className="text-black font-black text-sm">X²</span>
          </div>
          <div>
            <span className="text-white font-black tracking-tight text-base">Xschy Xschraiper</span>
            <span className="text-white/20 font-black text-[10px] ml-1">™</span>
          </div>
          <span className="bg-white/10 border border-white/10 text-[9px] font-black uppercase tracking-widest text-white/40 px-2 py-0.5 rounded-full">AI Intelligence Engine</span>
        </div>
        <div className="flex items-center gap-4">
          {mode !== 'home' && (
            <button onClick={() => { setMode('home'); setResults(null); setConversation([]); setQuery(''); }}
              className="text-white/30 hover:text-white/70 text-xs font-bold transition-colors flex items-center gap-1.5">
              <X className="w-3.5 h-3.5" /> Clear
            </button>
          )}
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400 text-[10px] font-bold">Live Intelligence</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Search Bar — always visible */}
        <XschySearchBar
          query={query}
          onQueryChange={setQuery}
          onSearch={handleSearch}
          onAsk={handleAsk}
          onFileUpload={handleFileUpload}
          uploadedFile={uploadedFile}
          onClearFile={() => setUploadedFile(null)}
          compact={mode !== 'home'}
          loading={loading}
        />

        {/* Home State */}
        <AnimatePresence mode="wait">
          {mode === 'home' && (
            <motion.div key="home" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
              {/* Quick Actions */}
              <div className="mt-10">
                <p className="text-white/25 text-[10px] font-black uppercase tracking-widest mb-4">Quick Actions</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {QUICK_ACTIONS.map(({ icon: Icon, label, query: q }) => (
                    <button key={label} onClick={() => handleSearch(q)}
                      className="group flex items-center gap-3 bg-white/[0.04] border border-white/[0.07] rounded-xl px-4 py-3 hover:bg-white/[0.08] hover:border-white/15 transition-all text-left">
                      <div className="w-7 h-7 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-3.5 h-3.5 text-white/60" />
                      </div>
                      <span className="text-white/60 text-xs font-bold group-hover:text-white/85 transition-colors">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Suggested Queries */}
              <div className="mt-10">
                <p className="text-white/25 text-[10px] font-black uppercase tracking-widest mb-4">Try Asking…</p>
                <div className="space-y-2">
                  {SUGGESTED_QUERIES.slice(0, 5).map((q, i) => (
                    <motion.button key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                      onClick={() => handleAsk(q)}
                      className="w-full text-left flex items-center gap-3 px-4 py-3 bg-white/[0.03] border border-white/[0.05] rounded-xl hover:bg-white/[0.06] hover:border-white/10 transition-all group">
                      <Sparkles className="w-3.5 h-3.5 text-white/25 flex-shrink-0 group-hover:text-white/50 transition-colors" />
                      <span className="text-white/50 text-sm group-hover:text-white/75 transition-colors">{q}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-white/20 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Trending */}
              <div className="mt-10">
                <p className="text-white/25 text-[10px] font-black uppercase tracking-widest mb-3">Trending on edXponential</p>
                <div className="flex flex-wrap gap-2">
                  {TRENDING.map((t, i) => (
                    <button key={i} onClick={() => handleSearch(t)}
                      className="text-[11px] font-bold text-white/40 border border-white/[0.08] rounded-full px-3 py-1.5 hover:text-white/70 hover:border-white/20 transition-all">
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Search Results */}
          {mode === 'results' && (
            <motion.div key="results" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
              <XschyResults results={results} loading={loading} onSearch={handleSearch} onAsk={handleAsk} />
            </motion.div>
          )}

          {/* Conversation */}
          {mode === 'conversation' && (
            <motion.div key="convo" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
              <XschyConversation conversation={conversation} onAsk={handleAsk} uploadedFile={uploadedFile} onFileUpload={handleFileUpload} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}