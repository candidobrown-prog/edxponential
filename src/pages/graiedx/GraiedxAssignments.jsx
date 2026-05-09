import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { BookOpen, Plus, Search, Calendar, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const CATEGORY_COLORS = {
  homework: 'bg-blue-100 text-blue-700',
  quiz: 'bg-purple-100 text-purple-700',
  test: 'bg-red-100 text-red-700',
  project: 'bg-orange-100 text-orange-700',
  classwork: 'bg-gray-100 text-gray-700',
  essay: 'bg-indigo-100 text-indigo-700',
  final_exam: 'bg-black text-white',
  participation: 'bg-emerald-100 text-emerald-700',
  extra_credit: 'bg-yellow-100 text-yellow-700',
  lab: 'bg-teal-100 text-teal-700',
  presentation: 'bg-pink-100 text-pink-700',
  other: 'bg-gray-100 text-gray-600',
};

const CATEGORIES = Object.keys(CATEGORY_COLORS);

export default function GraiedxAssignments() {
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [filterClass, setFilterClass] = useState('all');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title: '', category: 'homework', points_possible: 100, due_date: '', weight: 1, description: '', instructions: '' });
  const qc = useQueryClient();

  const { data: assignments = [], isLoading } = useQuery({ queryKey: ['gx-assignments-all'], queryFn: () => base44.entities.GraiedxAssignment.list('-created_date', 500) });
  const { data: classes = [] } = useQuery({ queryKey: ['gx-classes'], queryFn: () => base44.entities.GraiedxClass.list() });

  const createMutation = useMutation({
    mutationFn: d => {
      const cls = classes.find(c => c.id === filterClass) || classes[0];
      if (!cls) throw new Error('Select a class first');
      return base44.entities.GraiedxAssignment.create({ ...d, class_id: cls.id, class_name: cls.class_name, teacher_email: cls.teacher_email });
    },
    onSuccess: () => { qc.invalidateQueries(['gx-assignments-all']); setShowAdd(false); setForm({ title: '', category: 'homework', points_possible: 100, due_date: '', weight: 1, description: '', instructions: '' }); },
  });

  const deleteMutation = useMutation({
    mutationFn: id => base44.entities.GraiedxAssignment.delete(id),
    onSuccess: () => qc.invalidateQueries(['gx-assignments-all']),
  });

  const today = new Date().toISOString().split('T')[0];
  const filtered = assignments.filter(a => {
    const searchMatch = !search || a.title?.toLowerCase().includes(search.toLowerCase());
    const catMatch = filterCat === 'all' || a.category === filterCat;
    const classMatch = filterClass === 'all' || a.class_id === filterClass;
    return searchMatch && catMatch && classMatch;
  });

  const overdue = filtered.filter(a => a.due_date && a.due_date < today).length;
  const upcoming = filtered.filter(a => a.due_date && a.due_date >= today).length;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-black">Assignments</h1>
          <p className="text-gray-400 text-sm mt-0.5">{assignments.length} total · {overdue} overdue · {upcoming} upcoming</p>
        </div>
        <Button onClick={() => setShowAdd(true)} className="bg-black text-white rounded-xl font-black gap-2">
          <Plus className="w-4 h-4" /> New Assignment
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search assignments..." className="pl-9 rounded-xl" />
        </div>
        <Select value={filterClass} onValueChange={setFilterClass}>
          <SelectTrigger className="w-44 rounded-xl"><SelectValue placeholder="All Classes" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Classes</SelectItem>
            {classes.map(c => <SelectItem key={c.id} value={c.id}>{c.class_name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterCat} onValueChange={setFilterCat}>
          <SelectTrigger className="w-36 rounded-xl"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c.replace(/_/g,' ').replace(/\b\w/g,ch=>ch.toUpperCase())}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><div className="w-8 h-8 border-4 border-black/10 border-t-black rounded-full animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white border border-gray-100 rounded-2xl">
          <BookOpen className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="font-black text-black text-lg mb-2">No assignments yet</p>
          <p className="text-gray-400 text-sm mb-6">Create assignments to start tracking student grades and completion.</p>
          <Button onClick={() => setShowAdd(true)} className="bg-black text-white rounded-xl font-black gap-2">
            <Plus className="w-4 h-4" /> Create First Assignment
          </Button>
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map(a => {
            const isOverdue = a.due_date && a.due_date < today;
            return (
              <motion.div key={a.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-sm transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase mt-0.5 ${CATEGORY_COLORS[a.category] || CATEGORY_COLORS.other}`}>
                      {a.category?.replace(/_/g,' ')}
                    </div>
                    <div>
                      <p className="font-black text-sm text-black mb-1">{a.title}</p>
                      <p className="text-xs text-gray-500">{a.class_name}</p>
                      {a.description && <p className="text-xs text-gray-400 mt-1 max-w-lg">{a.description}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="text-right">
                      <p className="text-sm font-black text-black">{a.points_possible} pts</p>
                      <p className="text-[10px] text-gray-400">weight: {a.weight || 1}x</p>
                    </div>
                    {a.due_date && (
                      <div className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg ${isOverdue ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-600'}`}>
                        {isOverdue ? <AlertTriangle className="w-3 h-3" /> : <Calendar className="w-3 h-3" />}
                        {a.due_date}
                      </div>
                    )}
                    <div className="text-right">
                      {a.completion_rate != null && (
                        <p className="text-xs font-bold text-gray-500">{a.completion_rate}% done</p>
                      )}
                      {(a.missing_count || 0) > 0 && (
                        <p className="text-[10px] text-red-500 font-bold">{a.missing_count} missing</p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader><DialogTitle className="font-black text-xl">New Assignment</DialogTitle></DialogHeader>
          {classes.length === 0 && (
            <div className="bg-amber-50 rounded-xl p-3 text-xs text-amber-700 font-bold">
              ⚠ Create a class first in the Gradebook to add assignments.
            </div>
          )}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="col-span-2">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Title *</label>
              <Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className="rounded-xl" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Class</label>
              <Select value={filterClass !== 'all' ? filterClass : ''} onValueChange={v => setFilterClass(v)}>
                <SelectTrigger className="rounded-xl"><SelectValue placeholder="Select class" /></SelectTrigger>
                <SelectContent>{classes.map(c => <SelectItem key={c.id} value={c.id}>{c.class_name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Category</label>
              <Select value={form.category} onValueChange={v => setForm(p => ({ ...p, category: v }))}>
                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c.replace(/_/g,' ').replace(/\b\w/g,ch=>ch.toUpperCase())}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Points</label>
              <Input type="number" value={form.points_possible} onChange={e => setForm(p => ({ ...p, points_possible: parseFloat(e.target.value) }))} className="rounded-xl" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Due Date</label>
              <Input type="date" value={form.due_date} onChange={e => setForm(p => ({ ...p, due_date: e.target.value }))} className="rounded-xl" />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setShowAdd(false)} className="rounded-xl">Cancel</Button>
            <Button onClick={() => createMutation.mutate(form)} disabled={!form.title || createMutation.isPending || classes.length === 0}
              className="bg-black text-white rounded-xl font-black">
              {createMutation.isPending ? 'Adding...' : 'Add Assignment'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}