import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Target, Plus, Search, Sparkles, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const PROGRESS_COLORS = {
  mastered: 'bg-emerald-100 text-emerald-700',
  on_track: 'bg-black/10 text-black',
  some_progress: 'bg-gray-100 text-gray-700',
  minimal_progress: 'bg-amber-100 text-amber-700',
  not_started: 'bg-red-100 text-red-700',
};

const GOAL_AREAS = [
  'reading_comprehension', 'reading_fluency', 'decoding', 'writing_organization', 'writing_mechanics',
  'math_computation', 'problem_solving', 'executive_functioning', 'communication', 'social_skills',
  'emotional_regulation', 'occupational_therapy', 'speech_language', 'counseling', 'behavioral', 'transition', 'other',
];

export default function SpedGoals() {
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [showGenerate, setShowGenerate] = useState(false);
  const [genPrompt, setGenPrompt] = useState('');
  const [generatedGoal, setGeneratedGoal] = useState('');
  const [generating, setGenerating] = useState(false);
  const [form, setForm] = useState({ student_name: '', goal_area: '', goal_title: '', goal_text: '', baseline_data: '', target_outcome: '', monitoring_frequency: 'weekly', responsible_provider: '' });
  const qc = useQueryClient();

  const { data: goals = [], isLoading } = useQuery({
    queryKey: ['sped-goals'],
    queryFn: () => base44.entities.SpedGoal.list('-created_date', 200),
  });

  const createMutation = useMutation({
    mutationFn: data => base44.entities.SpedGoal.create({ ...data, student_id: 'manual', status: 'active', current_progress_pct: 0, progress_status: 'not_started' }),
    onSuccess: () => { qc.invalidateQueries(['sped-goals']); setShowAdd(false); setForm({ student_name: '', goal_area: '', goal_title: '', goal_text: '', baseline_data: '', target_outcome: '', monitoring_frequency: 'weekly', responsible_provider: '' }); },
  });

  const generateGoal = async () => {
    setGenerating(true);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Write a SMART IEP goal for the following situation:
${genPrompt}
Include: condition, student name placeholder, skill, criteria, time frame, and measurement method. Format as a single goal statement.`,
    });
    setGeneratedGoal(result);
    setGenerating(false);
  };

  const filtered = goals.filter(g => !search || g.student_name?.toLowerCase().includes(search.toLowerCase()) || g.goal_area?.includes(search.toLowerCase()));

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-black">Goals & Progress</h1>
          <p className="text-gray-400 text-sm mt-0.5">{goals.length} IEP goals tracked</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => setShowGenerate(true)} variant="outline" className="rounded-xl font-black gap-2 text-xs">
            <Sparkles className="w-3.5 h-3.5" /> AI Goal Writer
          </Button>
          <Button onClick={() => setShowAdd(true)} className="bg-black text-white rounded-xl font-black gap-2">
            <Plus className="w-4 h-4" /> Add Goal
          </Button>
        </div>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search goals..." className="pl-9 rounded-xl" />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><div className="w-8 h-8 border-4 border-black/10 border-t-black rounded-full animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <Target className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 font-bold">No goals found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(g => (
            <motion.div key={g.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="bg-white border border-gray-100 rounded-2xl p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-black text-sm text-black">{g.student_name}</p>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase ${PROGRESS_COLORS[g.progress_status] || 'bg-gray-100 text-gray-600'}`}>
                      {g.progress_status?.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{g.goal_area?.replace(/_/g, ' ')} · {g.responsible_provider}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-xl font-black text-black">{g.current_progress_pct || 0}%</p>
                    <p className="text-[10px] text-gray-400">progress</p>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed mb-3">{g.goal_text}</p>
              <div className="w-full h-2 bg-gray-100 rounded-full">
                <div className="h-2 rounded-full bg-black transition-all" style={{ width: `${g.current_progress_pct || 0}%` }} />
              </div>
              {g.baseline_data && (
                <p className="text-[10px] text-gray-400 mt-2">Baseline: {g.baseline_data}</p>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Goal Dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
          <DialogHeader><DialogTitle className="font-black text-xl">Add IEP Goal</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-1">Student Name *</label>
              <Input value={form.student_name} onChange={e => setForm(p => ({ ...p, student_name: e.target.value }))} className="rounded-xl" />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-1">Goal Area *</label>
              <Select value={form.goal_area} onValueChange={v => setForm(p => ({ ...p, goal_area: v }))}>
                <SelectTrigger className="rounded-xl"><SelectValue placeholder="Select area" /></SelectTrigger>
                <SelectContent>
                  {GOAL_AREAS.map(a => <SelectItem key={a} value={a}>{a.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-1">Goal Title</label>
              <Input value={form.goal_title} onChange={e => setForm(p => ({ ...p, goal_title: e.target.value }))} className="rounded-xl" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-1">Goal Statement *</label>
              <textarea value={form.goal_text} onChange={e => setForm(p => ({ ...p, goal_text: e.target.value }))}
                className="w-full border border-input rounded-xl p-3 text-sm min-h-[80px] resize-y focus:outline-none focus:ring-1 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-1">Baseline Data</label>
              <Input value={form.baseline_data} onChange={e => setForm(p => ({ ...p, baseline_data: e.target.value }))} className="rounded-xl" />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-1">Provider</label>
              <Input value={form.responsible_provider} onChange={e => setForm(p => ({ ...p, responsible_provider: e.target.value }))} className="rounded-xl" />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setShowAdd(false)} className="rounded-xl">Cancel</Button>
            <Button onClick={() => createMutation.mutate(form)} disabled={!form.student_name || !form.goal_area || createMutation.isPending}
              className="bg-black text-white rounded-xl font-black">
              {createMutation.isPending ? 'Saving...' : 'Add Goal'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* AI Goal Generator */}
      <Dialog open={showGenerate} onOpenChange={setShowGenerate}>
        <DialogContent className="max-w-lg rounded-2xl">
          <DialogHeader><DialogTitle className="font-black text-xl flex items-center gap-2"><Sparkles className="w-5 h-5" />AI Goal Writer</DialogTitle></DialogHeader>
          <p className="text-xs text-gray-500 mt-1">Describe the student's need and the AI will write a SMART IEP goal.</p>
          <textarea value={genPrompt} onChange={e => setGenPrompt(e.target.value)}
            placeholder="e.g., 4th grade student with dyslexia reading at 2nd grade level, needs goal for oral reading fluency..."
            className="w-full border border-input rounded-xl p-3 text-sm min-h-[100px] resize-y mt-3 focus:outline-none focus:ring-1 focus:ring-ring" />
          <Button onClick={generateGoal} disabled={!genPrompt || generating} className="w-full bg-black text-white rounded-xl font-black mt-3 gap-2">
            {generating ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Generating...</> : <><Sparkles className="w-4 h-4" />Generate SMART Goal</>}
          </Button>
          {generatedGoal && (
            <div className="bg-gray-50 rounded-xl p-4 mt-3">
              <p className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Generated Goal</p>
              <p className="text-sm text-gray-700 leading-relaxed">{generatedGoal}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}