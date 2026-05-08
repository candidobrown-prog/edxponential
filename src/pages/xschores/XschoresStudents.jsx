import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Plus, Search, X, Users, Upload } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import ExcelImportWizard from '@/components/import/ExcelImportWizard';
import { STUDENT_FIELDS } from '@/components/import/importFieldDefs';

const RISK_CONFIG = {
  on_track: { label: 'On Track', color: 'bg-green-100 text-green-800', dot: 'bg-green-500' },
  watch: { label: 'Watch', color: 'bg-yellow-100 text-yellow-800', dot: 'bg-yellow-400' },
  concern: { label: 'Concern', color: 'bg-orange-100 text-orange-800', dot: 'bg-orange-500' },
  at_risk: { label: 'At Risk', color: 'bg-red-100 text-red-800', dot: 'bg-red-500' },
  critical: { label: 'Critical', color: 'bg-red-900 text-red-100', dot: 'bg-red-700' },
};

const GRADES = ['K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

export default function XschoresStudents() {
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');
  const [gradeFilter, setGradeFilter] = useState('all');
  const [showAdd, setShowAdd] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [form, setForm] = useState({ student_name: '', grade: '', homeroom_teacher: '', attendance_pct: 100, tardies_this_week: 0, absences_this_month: 0, risk_level: 'on_track', parent_name: '', parent_email: '', parent_phone: '' });
  const queryClient = useQueryClient();

  const { data: students = [], isLoading } = useQuery({
    queryKey: ['xschores-students'],
    queryFn: () => base44.entities.XscoresStudent.list('-updated_date', 200),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.XscoresStudent.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['xschores-students'] }); setShowAdd(false); setForm({ student_name: '', grade: '', homeroom_teacher: '', attendance_pct: 100, tardies_this_week: 0, absences_this_month: 0, risk_level: 'on_track', parent_name: '', parent_email: '', parent_phone: '' }); },
  });

  const filtered = students.filter(s => {
    const q = search.toLowerCase();
    const matchSearch = !q || s.student_name?.toLowerCase().includes(q) || s.homeroom_teacher?.toLowerCase().includes(q);
    const matchRisk = riskFilter === 'all' || s.risk_level === riskFilter;
    const matchGrade = gradeFilter === 'all' || s.grade === gradeFilter;
    return matchSearch && matchRisk && matchGrade;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black">Students</h1>
          <p className="text-muted-foreground mt-1">Monitor and manage individual student risk profiles</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowImport(true)} className="rounded-xl gap-2"><Upload className="w-4 h-4" /> Import from Excel</Button>
          <Button onClick={() => setShowAdd(true)} className="rounded-xl gap-2"><Plus className="w-4 h-4" /> Add Student</Button>
        </div>
      </div>
      <ExcelImportWizard
        open={showImport}
        onOpenChange={setShowImport}
        fieldDefs={STUDENT_FIELDS}
        entityName="XscoresStudent"
        templateName="Student Roster"
        onImportComplete={() => queryClient.invalidateQueries({ queryKey: ['xschores-students'] })}
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input className="pl-10 rounded-xl" placeholder="Search students or teachers..." value={search} onChange={e => setSearch(e.target.value)} />
          {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2"><X className="w-4 h-4 text-muted-foreground" /></button>}
        </div>
        <Select value={riskFilter} onValueChange={setRiskFilter}>
          <SelectTrigger className="w-40 rounded-xl"><SelectValue placeholder="Risk Level" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Risk Levels</SelectItem>
            {Object.entries(RISK_CONFIG).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={gradeFilter} onValueChange={setGradeFilter}>
          <SelectTrigger className="w-32 rounded-xl"><SelectValue placeholder="Grade" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Grades</SelectItem>
            {GRADES.map(g => <SelectItem key={g} value={g}>Grade {g}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-white border border-border rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-muted-foreground">Loading students...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-10 h-10 text-muted-foreground/20 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">No students found. Add your first student to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  {['Student', 'Grade', 'Teacher', 'Attend %', 'Tardies/Wk', 'Absences/Mo', 'Alerts', 'Risk'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map(s => {
                  const risk = RISK_CONFIG[s.risk_level] || RISK_CONFIG.on_track;
                  return (
                    <tr key={s.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3">
                        <Link to={`/xschores/students/${s.id}`} className="font-bold hover:underline">{s.student_name}</Link>
                        {s.intervention_active && <span className="ml-2 bg-blue-100 text-blue-700 text-[10px] font-bold px-1.5 py-0.5 rounded">IEP</span>}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{s.grade}</td>
                      <td className="px-4 py-3 text-muted-foreground">{s.homeroom_teacher || '—'}</td>
                      <td className="px-4 py-3"><span className={s.attendance_pct < 90 ? 'text-red-600 font-bold' : ''}>{s.attendance_pct != null ? `${s.attendance_pct}%` : '—'}</span></td>
                      <td className="px-4 py-3"><span className={s.tardies_this_week >= 2 ? 'text-orange-600 font-bold' : ''}>{s.tardies_this_week || 0}</span></td>
                      <td className="px-4 py-3"><span className={s.absences_this_month >= 3 ? 'text-red-600 font-bold' : ''}>{s.absences_this_month || 0}</span></td>
                      <td className="px-4 py-3">
                        {s.active_alerts_count > 0
                          ? <span className="bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded text-xs">{s.active_alerts_count}</span>
                          : <span className="text-muted-foreground">—</span>}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${risk.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${risk.dot}`} /> {risk.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Student Dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle className="font-black text-xl">Add Student</DialogTitle></DialogHeader>
          <form onSubmit={e => { e.preventDefault(); createMutation.mutate(form); }} className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 space-y-1"><Label>Student Name *</Label><Input value={form.student_name} onChange={e => setForm({ ...form, student_name: e.target.value })} required /></div>
              <div className="space-y-1"><Label>Grade *</Label>
                <Select value={form.grade} onValueChange={v => setForm({ ...form, grade: v })}>
                  <SelectTrigger><SelectValue placeholder="Grade" /></SelectTrigger>
                  <SelectContent>{GRADES.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1"><Label>Homeroom Teacher</Label><Input value={form.homeroom_teacher} onChange={e => setForm({ ...form, homeroom_teacher: e.target.value })} /></div>
              <div className="space-y-1"><Label>Attendance %</Label><Input type="number" min={0} max={100} value={form.attendance_pct} onChange={e => setForm({ ...form, attendance_pct: Number(e.target.value) })} /></div>
              <div className="space-y-1"><Label>Risk Level</Label>
                <Select value={form.risk_level} onValueChange={v => setForm({ ...form, risk_level: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{Object.entries(RISK_CONFIG).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1"><Label>Parent Name</Label><Input value={form.parent_name} onChange={e => setForm({ ...form, parent_name: e.target.value })} /></div>
              <div className="space-y-1"><Label>Parent Email</Label><Input type="email" value={form.parent_email} onChange={e => setForm({ ...form, parent_email: e.target.value })} /></div>
            </div>
            <Button type="submit" className="w-full rounded-xl" disabled={createMutation.isPending}>{createMutation.isPending ? 'Saving...' : 'Add Student'}</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}