import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, X, ClipboardList, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ExcelImportWizard from '@/components/import/ExcelImportWizard';
import { CULTURE_FIELDS } from '@/components/import/importFieldDefs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { format } from 'date-fns';

const CATEGORIES = [
  'attendance', 'tardy', 'early_dismissal', 'absence_excused', 'absence_unexcused',
  'uniform_violation', 'infraction_minor', 'infraction_major', 'suspension',
  'expulsion', 'office_referral', 'counselor_referral', 'bullying', 'safety_incident',
  'classroom_disruption', 'non_compliance', 'parent_contact', 'teacher_call', 'positive_recognition'
];

const SEVERITY_COLORS = {
  low: 'bg-blue-100 text-blue-700',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-orange-100 text-orange-700',
  critical: 'bg-red-100 text-red-700',
};

const defaultForm = { student_name: '', grade: '', teacher: '', entry_date: new Date().toISOString().split('T')[0], category: 'tardy', severity: 'low', description: '', location: '', action_taken: '', parent_contacted: false, follow_up_required: false, resolution_status: 'open', notes: '' };

export default function XschoresCultureLog() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const queryClient = useQueryClient();

  const { data: entries = [], isLoading } = useQuery({
    queryKey: ['xschores-culture'],
    queryFn: () => base44.entities.XscoresCultureEntry.list('-entry_date', 100),
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const user = await base44.auth.me();
      return base44.entities.XscoresCultureEntry.create({ ...data, submitted_by_email: user.email });
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['xschores-culture'] }); setShowForm(false); setForm(defaultForm); },
  });

  const filtered = entries.filter(e => {
    const q = search.toLowerCase();
    const matchSearch = !q || e.student_name?.toLowerCase().includes(q) || e.teacher?.toLowerCase().includes(q);
    const matchCat = categoryFilter === 'all' || e.category === categoryFilter;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black">Culture Log</h1>
          <p className="text-muted-foreground mt-1">Record and track student culture, behavior, and attendance events</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowImport(true)} className="rounded-xl gap-2"><Upload className="w-4 h-4" /> Import from Excel</Button>
          <Button onClick={() => setShowForm(true)} className="rounded-xl gap-2"><Plus className="w-4 h-4" /> New Entry</Button>
        </div>
      </div>
      <ExcelImportWizard
        open={showImport}
        onOpenChange={setShowImport}
        fieldDefs={CULTURE_FIELDS}
        entityName="XscoresCultureEntry"
        templateName="Culture Log"
        onImportComplete={() => queryClient.invalidateQueries({ queryKey: ['xschores-culture'] })}
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input className="pl-10 rounded-xl" placeholder="Search by student or teacher..." value={search} onChange={e => setSearch(e.target.value)} />
          {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2"><X className="w-4 h-4 text-muted-foreground" /></button>}
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-52 rounded-xl"><SelectValue placeholder="All Categories" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {CATEGORIES.map(c => <SelectItem key={c} value={c} className="capitalize">{c.replace(/_/g, ' ')}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Entries */}
      {isLoading ? (
        <div className="p-12 text-center text-muted-foreground">Loading entries...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-border rounded-2xl p-12 text-center">
          <ClipboardList className="w-10 h-10 text-muted-foreground/20 mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">No culture entries found. Start logging student events.</p>
        </div>
      ) : (
        <div className="bg-white border border-border rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  {['Date', 'Student', 'Grade', 'Category', 'Severity', 'Teacher', 'Follow-up', 'Status'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map(e => (
                  <tr key={e.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{e.entry_date ? format(new Date(e.entry_date), 'MMM d') : '—'}</td>
                    <td className="px-4 py-3 font-bold">{e.student_name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{e.grade}</td>
                    <td className="px-4 py-3"><span className="capitalize text-xs font-medium bg-muted px-2 py-0.5 rounded">{e.category?.replace(/_/g, ' ')}</span></td>
                    <td className="px-4 py-3"><span className={`text-xs font-bold px-2 py-0.5 rounded capitalize ${SEVERITY_COLORS[e.severity] || ''}`}>{e.severity}</span></td>
                    <td className="px-4 py-3 text-muted-foreground">{e.teacher || '—'}</td>
                    <td className="px-4 py-3">{e.follow_up_required ? <span className="text-orange-600 font-bold text-xs">Required</span> : <span className="text-muted-foreground text-xs">No</span>}</td>
                    <td className="px-4 py-3"><span className={`text-xs font-medium capitalize px-2 py-0.5 rounded ${e.resolution_status === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-muted text-muted-foreground'}`}>{e.resolution_status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Entry Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle className="font-black text-xl">New Culture Entry</DialogTitle></DialogHeader>
          <form onSubmit={e => { e.preventDefault(); createMutation.mutate(form); }} className="space-y-3 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 space-y-1"><Label>Student Name *</Label><Input value={form.student_name} onChange={e => setForm({ ...form, student_name: e.target.value })} required /></div>
              <div className="space-y-1"><Label>Grade</Label><Input value={form.grade} onChange={e => setForm({ ...form, grade: e.target.value })} /></div>
              <div className="space-y-1"><Label>Date *</Label><Input type="date" value={form.entry_date} onChange={e => setForm({ ...form, entry_date: e.target.value })} required /></div>
              <div className="space-y-1"><Label>Category *</Label>
                <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c} className="capitalize">{c.replace(/_/g, ' ')}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1"><Label>Severity</Label>
                <Select value={form.severity} onValueChange={v => setForm({ ...form, severity: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{['low', 'medium', 'high', 'critical'].map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1"><Label>Teacher</Label><Input value={form.teacher} onChange={e => setForm({ ...form, teacher: e.target.value })} /></div>
              <div className="space-y-1"><Label>Location</Label><Input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} /></div>
            </div>
            <div className="space-y-1"><Label>Description</Label><Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="min-h-[60px]" /></div>
            <div className="space-y-1"><Label>Action Taken</Label><Textarea value={form.action_taken} onChange={e => setForm({ ...form, action_taken: e.target.value })} className="min-h-[50px]" /></div>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" checked={form.parent_contacted} onChange={e => setForm({ ...form, parent_contacted: e.target.checked })} className="rounded" /> Parent Contacted</label>
              <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" checked={form.follow_up_required} onChange={e => setForm({ ...form, follow_up_required: e.target.checked })} className="rounded" /> Follow-up Required</label>
            </div>
            <Button type="submit" className="w-full rounded-xl" disabled={createMutation.isPending}>{createMutation.isPending ? 'Saving...' : 'Save Entry'}</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}