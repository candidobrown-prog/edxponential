import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, BookOpen, Star, Users, Briefcase, GraduationCap, FileText, ArrowRight, Search, Loader2, ChevronRight } from 'lucide-react';

function ResultCard({ icon: Icon, label, items, path, renderItem }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.05]">
        <div className="flex items-center gap-2">
          <Icon className="w-3.5 h-3.5 text-white/40" />
          <span className="text-xs font-black text-white/60 uppercase tracking-wider">{label}</span>
        </div>
        {path && <Link to={path} className="text-[10px] font-bold text-white/25 hover:text-white/50 flex items-center gap-1 transition-colors">View all <ChevronRight className="w-3 h-3" /></Link>}
      </div>
      <div className="divide-y divide-white/[0.04]">
        {items.slice(0, 3).map((item, i) => renderItem(item, i))}
      </div>
    </div>
  );
}

export default function XschyResults({ results, loading, onSearch, onAsk }) {
  if (loading) {
    return (
      <div className="mt-8 space-y-4">
        {/* AI answer skeleton */}
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-white/10 rounded-xl animate-pulse" />
            <div className="h-4 w-48 bg-white/10 rounded animate-pulse" />
          </div>
          <div className="space-y-2">
            {[100, 85, 70, 60].map((w, i) => <div key={i} className={`h-3 bg-white/[0.06] rounded animate-pulse`} style={{ width: `${w}%` }} />)}
          </div>
        </div>
        {[1, 2].map(i => (
          <div key={i} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 space-y-3">
            {[3].fill(0).map((_, j) => <div key={j} className="h-12 bg-white/[0.04] rounded-xl animate-pulse" />)}
          </div>
        ))}
      </div>
    );
  }

  if (!results) return null;

  const { ai, courses, coaches, communities, jobs, tutors, content, related_searches } = results;

  return (
    <div className="mt-8 space-y-5">
      {/* AI Answer Card */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-white/[0.07] to-white/[0.03] border border-white/[0.12] rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 shadow-lg shadow-white/10">
            <Sparkles className="w-4 h-4 text-black" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">Xschy Intelligence</span>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span className="text-white/20 text-[10px]">AI-powered · Web-aware</span>
            </div>
            <p className="text-white/80 text-sm leading-relaxed">{ai?.answer}</p>

            {ai?.actions?.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-white/30 text-[10px] font-black uppercase tracking-wider">Recommended Actions</p>
                {ai.actions.map((action, i) => (
                  <button key={i} onClick={() => onAsk(action)}
                    className="w-full text-left flex items-center gap-2.5 px-3 py-2 bg-white/[0.06] rounded-xl hover:bg-white/[0.1] transition-colors group">
                    <div className="w-5 h-5 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0 text-[10px] font-black text-white/60">{i + 1}</div>
                    <span className="text-white/60 text-xs group-hover:text-white/85 transition-colors">{action}</span>
                    <ArrowRight className="w-3 h-3 text-white/20 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ResultCard icon={BookOpen} label="Courses" items={courses} path="/courses"
          renderItem={(c, i) => (
            <Link key={i} to="/courses" className="flex items-center gap-3 px-5 py-3.5 hover:bg-white/[0.03] transition-colors group">
              <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-3.5 h-3.5 text-white/50" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-white/75 text-xs font-bold truncate">{c.title}</p>
                <p className="text-white/30 text-[10px]">{c.subject || c.category || 'Course'}</p>
              </div>
              <ArrowRight className="w-3 h-3 text-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          )}
        />

        <ResultCard icon={Star} label="EdVisors" items={coaches} path="/edvisors"
          renderItem={(c, i) => (
            <Link key={i} to="/coaching" className="flex items-center gap-3 px-5 py-3.5 hover:bg-white/[0.03] transition-colors group">
              <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0 text-white font-black text-sm">
                {(c.coach_name || '?')[0]}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-white/75 text-xs font-bold truncate">{c.coach_name}</p>
                <p className="text-white/30 text-[10px]">{c.coach_title || 'EdVisor'}</p>
              </div>
              {c.rating && <span className="text-white/35 text-[10px] font-bold flex-shrink-0">{c.rating.toFixed(1)}★</span>}
            </Link>
          )}
        />

        <ResultCard icon={GraduationCap} label="Tutors" items={tutors} path="/twotrx/tutors"
          renderItem={(t, i) => (
            <Link key={i} to="/twotrx/tutors" className="flex items-center gap-3 px-5 py-3.5 hover:bg-white/[0.03] transition-colors group">
              <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0 text-white font-black text-sm">
                {(t.full_name || '?')[0]}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-white/75 text-xs font-bold truncate">{t.full_name}</p>
                <p className="text-white/30 text-[10px]">{(t.subjects || []).join(', ').slice(0, 40)}</p>
              </div>
            </Link>
          )}
        />

        <ResultCard icon={Users} label="Communities" items={communities} path="/communities"
          renderItem={(c, i) => (
            <Link key={i} to={`/communities/${c.id}`} className="flex items-center gap-3 px-5 py-3.5 hover:bg-white/[0.03] transition-colors group">
              <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="w-3.5 h-3.5 text-white/50" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-white/75 text-xs font-bold truncate">{c.name}</p>
                <p className="text-white/30 text-[10px]">{c.member_count || 0} members</p>
              </div>
            </Link>
          )}
        />

        <ResultCard icon={Briefcase} label="Jobs" items={jobs} path="/onejob/jobs"
          renderItem={(j, i) => (
            <Link key={i} to="/onejob/jobs" className="flex items-center gap-3 px-5 py-3.5 hover:bg-white/[0.03] transition-colors group">
              <div className="min-w-0 flex-1">
                <p className="text-white/75 text-xs font-bold truncate">{j.job_title}</p>
                <p className="text-white/30 text-[10px]">{j.organization_name} · {j.city || j.location}</p>
              </div>
            </Link>
          )}
        />

        <ResultCard icon={FileText} label="Content & Resources" items={content} path="/edxportante/marketplace"
          renderItem={(c, i) => (
            <Link key={i} to="/edxportante/marketplace" className="flex items-center gap-3 px-5 py-3.5 hover:bg-white/[0.03] transition-colors group">
              <div className="min-w-0 flex-1">
                <p className="text-white/75 text-xs font-bold truncate">{c.title}</p>
                <p className="text-white/30 text-[10px]">{c.content_type?.replace(/_/g, ' ')} · {c.subject}</p>
              </div>
              {c.price === 0 ? <span className="text-green-400/70 text-[10px] font-black flex-shrink-0">Free</span>
                : c.price ? <span className="text-white/40 text-[10px] font-black flex-shrink-0">${c.price}</span> : null}
            </Link>
          )}
        />
      </div>

      {/* Related Searches */}
      {ai?.related_searches?.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-5">
          <p className="text-white/25 text-[10px] font-black uppercase tracking-widest mb-3">Related Searches</p>
          <div className="flex flex-wrap gap-2">
            {ai.related_searches.map((s, i) => (
              <button key={i} onClick={() => onSearch(s)}
                className="flex items-center gap-1.5 text-[11px] font-bold text-white/45 border border-white/[0.08] rounded-full px-3 py-1.5 hover:text-white/70 hover:border-white/15 transition-all">
                <Search className="w-3 h-3" /> {s}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}