import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FileText, Plus, Search, Sparkles, Brain, Upload, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const STATUS_COLORS = {
  draft: 'bg-gray-100 text-gray-600',
  active: 'bg-emerald-100 text-emerald-700',
  expired: 'bg-red-100 text-red-700',
  pending_review: 'bg-amber-100 text-amber-700',
  archived: 'bg-gray-100 text-gray-500',
};

export default function SpedIEPManager() {
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [reviewTarget, setReviewTarget] = useState(null);
  const [aiReview, setAiReview] = useState('');
  const [reviewing, setReviewing] = useState(false);
  const [form, setForm] = useState({ student_name: '', grade: '', iep_type: 'annual', iep_start_date: '', iep_end_date: '', case_manager: '', disability_classification: '', placement: '' });
  const qc = useQueryClient();

  const { data: ieps = [], isLoading } = useQuery({
    queryKey: ['sped-ieps'],
    queryFn: () => base44.entities.SpedIEP.list('-created_date', 200),
  });

  const createMutation = useMutation({
    mutationFn: data => base44.entities.SpedIEP.create({ ...data, student_id: 'manual', status: 'draft' }),
    onSuccess: () => { qc.invalidateQueries(['sped-ieps']); setShowAdd(false); },
  });

  const reviewIEP = async (iep) => {
    setReviewTarget(iep);
    setReviewing(true);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Review this IEP for IDEA compliance and provide feedback:
Student: ${iep.student_name}, Grade: ${iep.grade}
Type: ${iep.iep_type}, Status: ${iep.status}
Case Manager: ${iep.case_manager}
Start: ${iep.iep_start_date}, End: ${iep.iep_end_date}
Disability: ${iep.disability_classification}
Placement: ${iep.placement}
Admin Notes: ${iep.admin_notes || 'None'}

Provide: compliance check (3-4 items), strengths (1-2), and areas to strengthen (2-3). Keep under 150 words.`,
    });
    setAiReview(result);
    setReviewing(false);
  };

  const filtered = ieps.filter(i => !search || i.student_name?.toLowerCase().includes(search.toLowerCase()));
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-black">IEP Manager</h1>
          <p className="text-gray-400 text-sm mt-0.5">{ieps.length} IEPs tracked</p>
        </div>
        <Button onClick={() => setShowAdd(true)} className="bg-black text-white rounded-xl font-black gap-2">
          <Plus className="w-4 h-4" /> New IEP
        </Button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by student name..." className="pl-9 rounded-xl" />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><div className="w-8 h-8 border-4 border-black/10 border-t-black rounded-full animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <FileText className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 font-bold">No IEPs found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(iep => {
            const isExpired = iep.iep_end_date && iep.iep_end_date < today;
            return (
              <motion.div key={iep.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-sm transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-black/5 rounded-xl flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4 text-black" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-black text-sm text-black">{iep.student_name}</h3>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase ${STATUS_COLORS[iep.status] || 'bg-gray-100'}`}>{iep.status}</span>
                        {isExpired && <span className="text-[9px] px-2 py-0.5 rounded-full font-black uppercase bg-red-100 text-red-700 flex items-center gap-1"><AlertCircle className="w-2.5 h-2.5" />Expired</span>}
                      </div>
                      <p className="text-xs text-gray-500">{iep.iep_type?.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} · Grade {iep.grade} · {iep.case_manager || 'No case manager'}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{iep.iep_start_date} → {iep.iep_end_date}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => reviewIEP(iep)} className="rounded-lg text-xs font-bold gap-1 flex-shrink-0">
                    <Sparkles className="w-3 h-3" /> AI Review
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Add IEP Dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="max-w-lg rounded-2xl">
          <DialogHeader><DialogTitle className="font-black text-xl">Create IEP Record</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {[
              { label: 'Student Name *', k: 'student_name' }, { label: 'Grade', k: 'grade' },
              { label: 'Case Manager', k: 'case_manager' }, { label: 'Placement', k: 'placement' },
              { label: 'IEP Start Date', k: 'iep_start_date', type: 'date' }, { label: 'IEP End Date', k: 'iep_end_date', type: 'date' },
            ].map(({ label, k, type = 'text' }) => (
              <div key={k}>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-1">{label}</label>
                <Input type={type} value={form[k]} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))} className="rounded-xl" />
              </div>
            ))}
            <div className="col-span-2">
              <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-1">IEP Type</label>
              <Select value={form.iep_type} onValueChange={v => setForm(p => ({ ...p, iep_type: v }))}>
                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['initial', 'annual', 'amendment', 'reevaluation', 'transition'].map(t => (
                    <SelectItem key={t} value={t}>{t.replace(/\b\w/g, c => c.toUpperCase())}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setShowAdd(false)} className="rounded-xl">Cancel</Button>
            <Button onClick={() => createMutation.mutate(form)} disabled={!form.student_name || createMutation.isPending}
              className="bg-black text-white rounded-xl font-black">
              {createMutation.isPending ? 'Creating...' : 'Create IEP'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* AI Review Dialog */}
      <Dialog open={!!reviewTarget} onOpenChange={() => { setReviewTarget(null); setAiReview(''); }}>
        <DialogContent className="max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-black text-xl flex items-center gap-2">
              <Sparkles className="w-5 h-5" /> AI IEP Review
            </DialogTitle>
          </DialogHeader>
          <div className="bg-gray-50 rounded-xl p-3 my-3 text-sm">
            <span className="font-black">{reviewTarget?.student_name}</span> · {reviewTarget?.iep_type} IEP
          </div>
          {reviewing ? (
            <div className="flex items-center gap-3 py-6 justify-center">
              <div className="w-5 h-5 border-4 border-black/10 border-t-black rounded-full animate-spin" />
              <p className="text-gray-500 text-sm font-bold">Reviewing for IDEA compliance...</p>
            </div>
          ) : aiReview ? (
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{aiReview}</p>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}