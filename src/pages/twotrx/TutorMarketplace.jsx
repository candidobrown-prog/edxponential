import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Search, Star, MapPin, CheckCircle, Filter, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TutorCard from '@/components/twotrx/TutorCard';

const SUBJECTS = ['All', 'Reading', 'Math', 'Writing', 'Science', 'ELA', 'Algebra', 'SAT/ACT Prep'];
const SESSION_TYPES = ['All', 'virtual', 'in_person', 'hybrid'];

export default function TutorMarketplace() {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [subject, setSubject] = useState('All');
  const [sessionType, setSessionType] = useState('All');
  const [minRating, setMinRating] = useState(0);

  useEffect(() => {
    base44.entities.TutorProfile.filter({ status: 'approved' }).then(setTutors).finally(() => setLoading(false));
  }, []);

  const filtered = tutors.filter(t => {
    const matchSearch = !search || t.full_name?.toLowerCase().includes(search.toLowerCase()) || t.bio?.toLowerCase().includes(search.toLowerCase()) || t.subjects?.some(s => s.toLowerCase().includes(search.toLowerCase()));
    const matchSubject = subject === 'All' || t.subjects?.includes(subject);
    const matchType = sessionType === 'All' || t.session_types?.includes(sessionType);
    const matchRating = !minRating || (t.rating || 0) >= minRating;
    return matchSearch && matchSubject && matchType && matchRating;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Tutor Match</h1>
        <p className="text-slate-500 mt-1">Browse verified, qualified teacher-tutors ready to support your students.</p>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/30 focus:border-[#4f46e5]"
              placeholder="Search by name, subject, or specialty..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <Filter className="w-4 h-4" />
            <span>{filtered.length} tutors</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <div>
            <p className="text-xs text-slate-500 mb-1.5 font-medium">Subject</p>
            <div className="flex flex-wrap gap-1.5">
              {SUBJECTS.map(s => (
                <button key={s} onClick={() => setSubject(s)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${subject === s ? 'bg-[#4f46e5] border-[#4f46e5] text-white' : 'border-slate-200 text-slate-600 hover:border-[#4f46e5]'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1.5 font-medium">Session Type</p>
            <div className="flex gap-1.5">
              {SESSION_TYPES.map(t => (
                <button key={t} onClick={() => setSessionType(t)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border capitalize transition-all ${sessionType === t ? 'bg-[#4f46e5] border-[#4f46e5] text-white' : 'border-slate-200 text-slate-600 hover:border-[#4f46e5]'}`}>
                  {t.replace('_', '-')}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tutor Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-4 border-[#4f46e5]/30 border-t-[#4f46e5] rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 py-16 text-center">
          <GraduationCap className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">No tutors match your filters.</p>
          <p className="text-slate-400 text-sm mt-1">Try adjusting your search or filters above.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(tutor => <TutorCard key={tutor.id} tutor={tutor} />)}
        </div>
      )}
    </div>
  );
}