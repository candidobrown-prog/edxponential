import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Layers, Plus, Search, Filter, MoreHorizontal, Play,
  BookOpen, Users, BarChart3, Clock, Globe, Lock,
  Video, Award, Zap, Eye, Edit3, Copy, Trash2,
  CheckCircle2, ArrowUpRight, Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';

const DEMO_COURSES = [
  {
    id: 1, title: 'Classroom Management Masterclass', type: 'Masterclass', status: 'published',
    modules: 6, lessons: 24, students: 847, rating: 4.9, duration: '6 weeks',
    completion: 78, revenue: '$12,400', thumbnail_color: 'from-white/8 to-white/3', tags: ['Education', 'Teaching'],
  },
  {
    id: 2, title: 'Executive Leadership Academy', type: 'Certification Program', status: 'published',
    modules: 8, lessons: 32, students: 234, rating: 4.8, duration: '8 weeks',
    completion: 65, revenue: '$8,900', thumbnail_color: 'from-white/6 to-white/2', tags: ['Leadership', 'Admin'],
  },
  {
    id: 3, title: 'Middle School Math Intervention', type: 'Course', status: 'draft',
    modules: 4, lessons: 18, students: 0, rating: null, duration: '4 weeks',
    completion: 0, revenue: '$0', thumbnail_color: 'from-white/5 to-white/2', tags: ['Math', 'Intervention'],
  },
  {
    id: 4, title: 'Digital Literacy for Educators', type: 'Training Program', status: 'published',
    modules: 5, lessons: 20, students: 412, rating: 4.7, duration: 'Self-Paced',
    completion: 82, revenue: '$6,200', thumbnail_color: 'from-white/8 to-white/2', tags: ['Technology', 'PD'],
  },
  {
    id: 5, title: 'Teacher Coaching Certification', type: 'Certification Program', status: 'review',
    modules: 10, lessons: 40, students: 0, rating: null, duration: '12 weeks',
    completion: 0, revenue: '$0', thumbnail_color: 'from-white/6 to-white/3', tags: ['Coaching', 'PD'],
  },
];

const STATUS_COLORS = {
  published: 'text-white bg-white/10 border-white/15',
  draft: 'text-white/30 bg-white/5 border-white/8',
  review: 'text-white/60 bg-white/8 border-white/10',
};

export default function ClassifiedxCourses() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const filtered = DEMO_COURSES.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || c.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="min-h-screen text-white">
      <div className="border-b border-white/5 px-8 py-5 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Layers className="w-4 h-4 text-white/60" />
            <h1 className="font-black text-lg tracking-tight text-white">Course Library</h1>
          </div>
          <p className="text-xs text-white/30">Manage, publish, and track all your educational content</p>
        </div>
        <Link to="/classifiedx/builder">
          <Button className="bg-white text-black font-black text-xs hover:bg-white/90 rounded-full px-5">
            <Plus className="w-3.5 h-3.5" /> New Course
          </Button>
        </Link>
      </div>

      <div className="px-8 py-6">
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Total Courses', value: '5', icon: Layers, sub: '3 published' },
            { label: 'Total Students', value: '1,493', icon: Users, sub: 'Across all courses' },
            { label: 'Avg Completion', value: '75%', icon: CheckCircle2, sub: 'Published courses' },
            { label: 'Total Revenue', value: '$27,500', icon: BarChart3, sub: 'All time' },
          ].map(({ label, value, icon: Icon, sub }) => (
            <div key={label} className="border border-white/8 rounded-2xl p-4 bg-white/2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] text-white/30 font-bold">{label}</span>
                <Icon className="w-3.5 h-3.5 text-white/20" />
              </div>
              <div className="font-black text-xl text-white">{value}</div>
              <div className="text-[10px] text-white/25 mt-0.5">{sub}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20" />
            <Input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search courses..."
              className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/20 text-xs focus:border-white/30" />
          </div>
          {['all', 'published', 'draft', 'review'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-black capitalize transition-all ${filter === f ? 'bg-white text-black' : 'border border-white/15 text-white/40 hover:bg-white/5'}`}>
              {f === 'all' ? 'All' : f}
            </button>
          ))}
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((course, i) => (
            <motion.div key={course.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="border border-white/8 rounded-2xl overflow-hidden bg-white/2 hover:bg-white/3 hover:border-white/15 transition-all group">
              {/* Thumbnail */}
              <div className={`h-36 bg-gradient-to-br ${course.thumbnail_color} flex items-center justify-center relative`}>
                <div className="w-12 h-12 rounded-2xl bg-white/8 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white/40" />
                </div>
                <div className="absolute top-3 right-3 flex gap-1.5">
                  <span className={`text-[10px] font-black border px-2 py-0.5 rounded-full ${STATUS_COLORS[course.status]}`}>
                    {course.status}
                  </span>
                </div>
                {course.status === 'published' && (
                  <div className="absolute bottom-3 left-3 flex gap-1.5">
                    <span className="text-[10px] bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full text-white/60 flex items-center gap-1">
                      <Users className="w-3 h-3" /> {course.students.toLocaleString()}
                    </span>
                    {course.rating && (
                      <span className="text-[10px] bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full text-white/60 flex items-center gap-1">
                        <Star className="w-3 h-3" /> {course.rating}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="text-[10px] text-white/25 font-black uppercase tracking-widest mb-1.5">{course.type}</div>
                <h3 className="font-black text-sm text-white mb-1 line-clamp-2">{course.title}</h3>
                <div className="flex items-center gap-3 text-[11px] text-white/30 mb-3">
                  <span className="flex items-center gap-1"><Layers className="w-3 h-3" />{course.modules} modules</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{course.duration}</span>
                </div>

                {course.status === 'published' && (
                  <div className="mb-3">
                    <div className="flex justify-between text-[10px] text-white/25 mb-1">
                      <span>Completion</span><span>{course.completion}%</span>
                    </div>
                    <div className="h-1 bg-white/8 rounded-full"><div className="h-full bg-white/40 rounded-full" style={{ width: `${course.completion}%` }} /></div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex gap-1.5">
                    {course.tags.map(t => <span key={t} className="text-[10px] bg-white/5 border border-white/8 px-1.5 py-0.5 rounded-md text-white/30">{t}</span>)}
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all">
                      <Eye className="w-3 h-3 text-white/50" />
                    </button>
                    <button className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all">
                      <Edit3 className="w-3 h-3 text-white/50" />
                    </button>
                    <button className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all">
                      <MoreHorizontal className="w-3 h-3 text-white/50" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {/* New Course Card */}
          <Link to="/classifiedx/builder">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              className="border border-dashed border-white/10 rounded-2xl h-full min-h-[280px] flex flex-col items-center justify-center p-6 hover:bg-white/3 hover:border-white/20 transition-all cursor-pointer group">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-3 group-hover:bg-white/10 transition-all">
                <Plus className="w-5 h-5 text-white/30" />
              </div>
              <p className="font-black text-sm text-white/30 group-hover:text-white/50">Create New Course</p>
              <p className="text-[11px] text-white/20 mt-1">AI-powered in seconds</p>
            </motion.div>
          </Link>
        </div>
      </div>
    </div>
  );
}