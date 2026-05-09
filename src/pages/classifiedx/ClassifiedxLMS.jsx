import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users, Search, CheckCircle2, Clock, Award, BarChart3,
  AlertTriangle, BookOpen, Layers, Mail, Plus, ChevronRight,
  GraduationCap, TrendingUp, ArrowUp, ArrowDown, Star, Zap
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const DEMO_STUDENTS = [
  { id: 1, name: 'Alexis Rivera', email: 'alexis@school.edu', course: 'Classroom Management Masterclass', progress: 83, grade: 'A', completed_lessons: 20, total_lessons: 24, last_active: '2 hours ago', status: 'active', quiz_avg: 91 },
  { id: 2, name: 'Jordan Kim', email: 'jordan@org.com', course: 'Executive Leadership Academy', progress: 62, grade: 'B', completed_lessons: 20, total_lessons: 32, last_active: '1 day ago', status: 'active', quiz_avg: 78 },
  { id: 3, name: 'Marcus Brown', email: 'marcus@school.edu', course: 'Classroom Management Masterclass', progress: 100, grade: 'A+', completed_lessons: 24, total_lessons: 24, last_active: '3 days ago', status: 'completed', quiz_avg: 96 },
  { id: 4, name: 'Taylor Davis', email: 'taylor@corp.com', course: 'Digital Literacy for Educators', progress: 45, grade: 'C', completed_lessons: 9, total_lessons: 20, last_active: '5 days ago', status: 'at_risk', quiz_avg: 61 },
  { id: 5, name: 'Sofia Reyes', email: 'sofia@district.edu', course: 'Executive Leadership Academy', progress: 91, grade: 'A', completed_lessons: 29, total_lessons: 32, last_active: '4 hours ago', status: 'active', quiz_avg: 89 },
  { id: 6, name: 'Devon Lewis', email: 'devon@school.edu', course: 'Classroom Management Masterclass', progress: 17, grade: 'D', completed_lessons: 4, total_lessons: 24, last_active: '12 days ago', status: 'at_risk', quiz_avg: 54 },
];

const STATUS = {
  active: 'text-white/60 bg-white/8 border-white/10',
  completed: 'text-white bg-white/15 border-white/20',
  at_risk: 'text-white/40 bg-white/5 border-white/8',
};

export default function ClassifiedxLMS() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [tab, setTab] = useState('students');

  const filtered = DEMO_STUDENTS.filter(s => {
    const q = search.toLowerCase();
    const matchSearch = s.name.toLowerCase().includes(q) || s.course.toLowerCase().includes(q);
    const matchFilter = filter === 'all' || s.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="min-h-screen text-white">
      <div className="border-b border-white/5 px-8 py-5 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-white/60" />
            <h1 className="font-black text-lg tracking-tight text-white">Students & LMS</h1>
          </div>
          <p className="text-xs text-white/30">Enrollment management, progress tracking, and learning intelligence</p>
        </div>
        <Button className="bg-white text-black font-black text-xs hover:bg-white/90 rounded-full px-5">
          <Plus className="w-3.5 h-3.5" /> Enroll Student
        </Button>
      </div>

      <div className="px-8 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Total Enrolled', value: '1,493', sub: 'Across all courses', icon: Users },
            { label: 'Active Learners', value: '987', sub: 'Last 7 days', icon: CheckCircle2 },
            { label: 'At Risk', value: '48', sub: 'Need attention', icon: AlertTriangle },
            { label: 'Completed', value: '312', sub: 'Earned certificate', icon: Award },
          ].map(({ label, value, sub, icon: Icon }) => (
            <div key={label} className="border border-white/8 rounded-2xl p-4 bg-white/2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] text-white/30 font-bold">{label}</span>
                <Icon className="w-3.5 h-3.5 text-white/15" />
              </div>
              <div className="font-black text-xl text-white">{value}</div>
              <div className="text-[10px] text-white/25 mt-0.5">{sub}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-5">
          {['students', 'cohorts', 'certificates'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-full text-xs font-black capitalize transition-all ${tab === t ? 'bg-white text-black' : 'border border-white/15 text-white/40 hover:bg-white/5'}`}>
              {t}
            </button>
          ))}
        </div>

        {tab === 'students' && (
          <>
            {/* Filters */}
            <div className="flex items-center gap-3 mb-4">
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20" />
                <Input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search students..."
                  className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/20 text-xs focus:border-white/30" />
              </div>
              {['all', 'active', 'at_risk', 'completed'].map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-full text-xs font-black transition-all ${filter === f ? 'bg-white text-black' : 'border border-white/15 text-white/40 hover:bg-white/5'}`}>
                  {f === 'all' ? 'All' : f === 'at_risk' ? 'At Risk' : f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            {/* Table */}
            <div className="space-y-2">
              {filtered.map((student, i) => (
                <motion.div key={student.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                  className="border border-white/8 rounded-xl p-4 bg-white/2 hover:bg-white/3 hover:border-white/12 transition-all">
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="w-9 h-9 rounded-full bg-white/8 flex items-center justify-center text-xs font-black text-white/50 flex-shrink-0">
                      {student.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-white">{student.name}</span>
                        <span className={`text-[10px] font-black border px-1.5 py-0.5 rounded-full capitalize ${STATUS[student.status]}`}>
                          {student.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="text-[11px] text-white/25 truncate">{student.course}</div>
                    </div>
                    {/* Progress */}
                    <div className="hidden md:flex items-center gap-4 flex-shrink-0">
                      <div className="w-32">
                        <div className="flex justify-between text-[10px] text-white/25 mb-1">
                          <span>Progress</span><span>{student.progress}%</span>
                        </div>
                        <div className="h-1.5 bg-white/8 rounded-full">
                          <div className="h-full bg-white/40 rounded-full" style={{ width: `${student.progress}%` }} />
                        </div>
                      </div>
                      <div className="text-center w-12">
                        <div className="font-black text-white text-sm">{student.grade}</div>
                        <div className="text-[10px] text-white/25">Grade</div>
                      </div>
                      <div className="text-center w-14">
                        <div className="font-black text-white text-sm">{student.quiz_avg}%</div>
                        <div className="text-[10px] text-white/25">Quiz Avg</div>
                      </div>
                      <div className="text-[11px] text-white/25 w-20 text-right">{student.last_active}</div>
                    </div>
                    {/* Actions */}
                    <button className="p-1.5 rounded-lg hover:bg-white/8 transition-all flex-shrink-0">
                      <ChevronRight className="w-3.5 h-3.5 text-white/20" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {tab === 'cohorts' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['Spring 2026 Cohort', 'Corporate Training Q2', 'Leadership Academy Fall'].map((name, i) => (
              <div key={i} className="border border-white/8 rounded-2xl p-5 bg-white/2">
                <div className="w-10 h-10 rounded-xl bg-white/8 flex items-center justify-center mb-3">
                  <GraduationCap className="w-5 h-5 text-white/40" />
                </div>
                <h3 className="font-black text-sm text-white mb-1">{name}</h3>
                <p className="text-xs text-white/30 mb-3">Active cohort · {[24, 18, 31][i]} students</p>
                <div className="h-1.5 bg-white/8 rounded-full mb-3">
                  <div className="h-full bg-white/40 rounded-full" style={{ width: `${[65, 48, 82][i]}%` }} />
                </div>
                <div className="text-[11px] text-white/25">{[65, 48, 82][i]}% average progress</div>
              </div>
            ))}
            <button className="border border-dashed border-white/10 rounded-2xl p-5 flex flex-col items-center justify-center hover:bg-white/3 hover:border-white/20 transition-all group">
              <Plus className="w-5 h-5 text-white/20 mb-2 group-hover:text-white/40" />
              <span className="text-xs font-black text-white/25 group-hover:text-white/40">New Cohort</span>
            </button>
          </div>
        )}

        {tab === 'certificates' && (
          <div className="space-y-3">
            {DEMO_STUDENTS.filter(s => s.status === 'completed' || s.progress > 80).map((s, i) => (
              <div key={i} className="border border-white/8 rounded-xl p-4 bg-white/2 flex items-center gap-4">
                <Award className="w-8 h-8 text-white/30 flex-shrink-0" />
                <div className="flex-1">
                  <div className="font-black text-sm text-white">{s.name}</div>
                  <div className="text-[11px] text-white/30">{s.course}</div>
                </div>
                <div className="text-center">
                  <div className="font-black text-white text-sm">{s.grade}</div>
                  <div className="text-[10px] text-white/25">Final Grade</div>
                </div>
                <Button variant="outline" className="border-white/15 text-white text-xs font-black rounded-full hover:bg-white/5 h-8 px-3">
                  Issue Certificate
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}