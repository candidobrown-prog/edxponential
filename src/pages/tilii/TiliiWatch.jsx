import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, Maximize, BookOpen, Zap, ChevronRight, Clock, ThumbsUp, Share2, Bookmark, Download, Users } from 'lucide-react';

const VIDEO = {
  title: 'The Future of AI in Education',
  creator: 'Dr. Marcus Webb',
  subtitle: 'Superintendent · Literacy Leadership Expert',
  duration: '48:22',
  views: '142,890',
  likes: '8,400',
  description: 'In this masterclass, Dr. Webb explores how artificial intelligence is reshaping classrooms, curricula, and the future of teaching. From personalized learning engines to AI coaching systems, this session is essential for every educator who wants to lead in the next decade.',
  chapters: [
    { time: '00:00', title: 'Introduction — The AI Moment in Education' },
    { time: '06:14', title: 'What AI Can and Cannot Do in the Classroom' },
    { time: '18:30', title: 'Personalized Learning at Scale' },
    { time: '28:45', title: 'The Future Principal: AI as Your Co-Leader' },
    { time: '38:10', title: 'Practical Tools You Can Use Today' },
    { time: '44:00', title: 'Final Thoughts & Call to Action' },
  ],
  related: [
    { title: 'Building a Culture of Excellence', creator: 'edXponential Studio', duration: '42 min', thumb: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=300&q=80&auto=format' },
    { title: 'The Founder\'s Blueprint', creator: 'James Okafor', duration: '3h 20min', thumb: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=300&q=80&auto=format' },
    { title: 'Mindful Leadership', creator: 'Priya Nair', duration: '8 Ep.', thumb: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=300&q=80&auto=format' },
    { title: 'Literacy Revolution', creator: 'Dr. Amara Nwosu', duration: '22 min', thumb: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=300&q=80&auto=format' },
  ],
};

const AI_SUMMARY = "Dr. Webb argues that AI is not replacing educators — it's elevating them. The key insight: schools that integrate AI thoughtfully see 34% higher student engagement and 28% faster learning outcomes. The session concludes with a practical 90-day AI integration roadmap any school can adopt.";

export default function TiliiWatch() {
  const [playing, setPlaying] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [activeTab, setActiveTab] = useState('chapters');

  return (
    <div className="min-h-screen bg-[#080808] text-white" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Main column */}
          <div className="lg:col-span-2 space-y-5">
            {/* Video player */}
            <div className="relative bg-zinc-950 rounded-3xl overflow-hidden aspect-video group">
              <img src="https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1200&q=80&auto=format"
                alt="" className="w-full h-full object-cover opacity-70" />
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.button
                  whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
                  onClick={() => setPlaying(!playing)}
                  className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-2xl">
                  {playing ? <Pause className="w-6 h-6 text-black fill-black" /> : <Play className="w-6 h-6 text-black fill-black ml-1" />}
                </motion.button>
              </div>
              {/* Controls bar */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-5 pb-4 pt-12 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="h-0.5 bg-white/20 rounded-full mb-3 cursor-pointer">
                  <div className="h-full w-1/3 bg-white rounded-full" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setPlaying(!playing)}>
                      {playing ? <Pause className="w-4 h-4 text-white fill-white" /> : <Play className="w-4 h-4 text-white fill-white ml-0.5" />}
                    </button>
                    <Volume2 className="w-4 h-4 text-white/60" />
                    <span className="text-white/50 text-xs font-semibold">16:08 / {VIDEO.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white/40 text-[11px] font-black bg-white/10 px-2 py-0.5 rounded cursor-pointer hover:bg-white/20">1×</span>
                    <Maximize className="w-4 h-4 text-white/60 cursor-pointer hover:text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Title + actions */}
            <div>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h1 className="text-xl font-black text-white mb-1">{VIDEO.title}</h1>
                  <p className="text-white/40 text-sm">{VIDEO.views} views · {VIDEO.likes} inspired</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {[
                    { icon: ThumbsUp, label: 'Like' },
                    { icon: Bookmark, label: 'Save' },
                    { icon: Share2, label: 'Share' },
                    { icon: Download, label: 'Save Offline' },
                  ].map(({ icon: Icon, label }) => (
                    <button key={label} title={label}
                      className="flex items-center gap-1 text-white/35 hover:text-white text-[11px] font-semibold bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-xl px-3 py-2 transition-all">
                      <Icon className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Creator */}
              <div className="flex items-center gap-3 p-4 bg-white/[0.03] border border-white/[0.07] rounded-2xl mb-4">
                <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-black text-sm">MW</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-black text-sm">{VIDEO.creator}</p>
                  <p className="text-white/35 text-xs">{VIDEO.subtitle}</p>
                </div>
                <button className="bg-white text-black font-black text-xs px-4 py-2 rounded-xl hover:bg-zinc-100 transition-all flex-shrink-0">Follow</button>
              </div>

              {/* AI Summary */}
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl overflow-hidden mb-4">
                <button onClick={() => setShowSummary(!showSummary)}
                  className="w-full flex items-center gap-2 p-4 text-left hover:bg-white/[0.03] transition-all">
                  <Zap className="w-4 h-4 text-white/40" />
                  <span className="text-white/60 text-sm font-black">AI Summary</span>
                  <ChevronRight className={`w-4 h-4 text-white/25 ml-auto transition-transform ${showSummary ? 'rotate-90' : ''}`} />
                </button>
                {showSummary && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="px-4 pb-4">
                    <p className="text-white/50 text-sm leading-relaxed">{AI_SUMMARY}</p>
                  </motion.div>
                )}
              </div>

              {/* Tabs */}
              <div className="flex gap-1 mb-4 bg-white/[0.03] border border-white/[0.07] rounded-xl p-1">
                {['chapters', 'description', 'resources'].map(t => (
                  <button key={t} onClick={() => setActiveTab(t)}
                    className={`flex-1 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-all ${activeTab === t ? 'bg-white text-black' : 'text-white/35 hover:text-white'}`}>
                    {t}
                  </button>
                ))}
              </div>

              {activeTab === 'chapters' && (
                <div className="space-y-1">
                  {VIDEO.chapters.map((c, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.04] cursor-pointer transition-all group">
                      <span className="text-white/25 text-[11px] font-black w-10 flex-shrink-0">{c.time}</span>
                      <div className="w-0.5 h-4 bg-white/10 flex-shrink-0" />
                      <span className="text-white/55 text-xs font-semibold group-hover:text-white transition-colors">{c.title}</span>
                      <Play className="w-3 h-3 text-white/20 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
                </div>
              )}
              {activeTab === 'description' && (
                <p className="text-white/45 text-sm leading-relaxed">{VIDEO.description}</p>
              )}
              {activeTab === 'resources' && (
                <div className="space-y-2">
                  {['Slide Deck — The AI Classroom.pdf', 'AI Integration Roadmap.pdf', 'Recommended Tools List.pdf'].map(r => (
                    <div key={r} className="flex items-center gap-3 p-3 bg-white/[0.03] border border-white/[0.07] rounded-xl hover:bg-white/[0.05] cursor-pointer transition-all">
                      <BookOpen className="w-3.5 h-3.5 text-white/30 flex-shrink-0" />
                      <span className="text-white/50 text-xs font-semibold">{r}</span>
                      <Download className="w-3.5 h-3.5 text-white/20 ml-auto hover:text-white/50 transition-colors" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-white/25">Up Next</p>
            {VIDEO.related.map((v, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                className="flex gap-3 cursor-pointer group">
                <div className="w-28 flex-shrink-0 aspect-video rounded-xl overflow-hidden bg-zinc-900 relative">
                  <img src={v.thumb} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-7 h-7 rounded-full bg-white/80 flex items-center justify-center">
                      <Play className="w-3 h-3 text-black fill-black ml-0.5" />
                    </div>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white/80 text-xs font-black leading-snug line-clamp-2 mb-1 group-hover:text-white transition-colors">{v.title}</p>
                  <p className="text-white/30 text-[11px]">{v.creator}</p>
                  <p className="text-white/20 text-[10px] flex items-center gap-1 mt-0.5"><Clock className="w-2.5 h-2.5" /> {v.duration}</p>
                </div>
              </motion.div>
            ))}

            {/* Live indicator */}
            <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-4 mt-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-white/50 text-xs font-black uppercase tracking-wider">Live Now</span>
              </div>
              <p className="text-white font-black text-sm mb-1">School Culture Summit 2026</p>
              <p className="text-white/35 text-xs mb-3">edXponential · 1,240 watching</p>
              <button className="w-full bg-white text-black font-black text-xs py-2.5 rounded-xl hover:bg-zinc-100 transition-all flex items-center justify-center gap-1.5">
                <Users className="w-3.5 h-3.5" /> Join Live
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}