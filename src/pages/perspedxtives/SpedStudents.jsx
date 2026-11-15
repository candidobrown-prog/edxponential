import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Users, Plus, Search, AlertCircle, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const DISABILITIES = [
  'specific_learning_disability', 'speech_language_impairment', 'other_health_impairment',
  'autism', 'emotional_disturbance', 'intellectual_disability', 'developmental_delay',
  'multiple_disabilities', 'hearing_impairment', 'visual_impairment',
  'orthopedic_impairment', 'traumatic_brain_injury', 'deaf_blindness',
];

const RISK_COLORS = {
  low: 'bg-emerald-100 text-emerald-700',
  medium: 'bg-amber-100 text-amber-700',
  high: 'bg-orange-100 text-orange-700',
  critical: 'bg-red-100 text-red-700',
};

const DEFAULT_FORM = {
  student_name: '', grade: '', disability_classification: '', case_manager: '',
  school_name: '', iep_start_date: '', iep_end_date: '', reevaluation_date: '',
  parent_guardian_name: '', parent_email: '', parent_phone: '',
  service_delivery_model: '', notes: '',
};

export default function SpedStudents() {
  const [search, setSearch] = useState('');
  const [filterRisk, setFilterRisk] = useState('all');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(DEFAULT_FORM);
  const qc = useQueryClient();

  const { data: students = [], isLoading } = useQuery({
    queryKey: ['sped-students'],
    queryFn: () => base44.entities.SpedStudent.list('-created_date', 200),
  });

  const createMutation = useMutation({
    mutationFn: data => base44.entities.SpedStudent.create({ ...data, status: 'active', iep_status: 'active' }),
    onSuccess: () => { qc.invalidateQueries(['sped-students']); setShowAdd(false); setForm(DEFAULT_FORM); },
  });

  const today = new Date().toISOString().split('T')[0];
  const thirtyDays = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];

  const filtered = students.filter(s => {
    const matchSearch = !search || s.student_name?.toLowerCase().includes(search.toLowerCase());
    const matchRisk = filterRisk === 'all' || s.risk_level === filterRisk;
    return matchSearch && matchRisk;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-black">SPED Student Roster</h1>
          <p className="text-gray-400 text-sm mt-0.5">{students.length} students with active IEPs</p>
        </div>
        <Button onClick={() => setShowAdd(true)} className="bg-black text-white rounded-xl font-black gap-2">
          <Plus className="w-4 h-4" /> Add Student
        </Button>
      </div>

      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search students..." className="pl-9 rounded-xl" />
        </div>
        <Select value={filterRisk} onValueChange={setFilterRisk}>
          <SelectTrigger className="w-36 rounded-xl"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Risk Levels</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><div className="w-8 h-8 border-4 border-black/10 border-t-black rounded-full animate-spin" /></div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <Users className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 font-bold">No students found</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-50">
                  {['Student', 'Grade', 'Disability', 'Case Manager', 'IEP End Date', 'Compliance', 'Risk', 'Status'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-[10px] font-black text-gray-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(s => {
                  const isExpired = s.iep_end_date && s.iep_end_date < today;
                  const isExpiring = s.iep_end_date && s.iep_end_date <= thirtyDays && !isExpired;
                  return (
                    <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-3">
                        <p className="font-bold text-sm text-black">{s.student_name}</p>
                        <p className="text-[10px] text-gray-400">{s.school_name}</p>
                      </td>
                      <td className="px-5 py-3 text-xs text-gray-600">{s.grade}</td>
                      <td className="px-5 py-3 text-xs text-gray-600 max-w-[120px] truncate">{s.disability_classification?.replace(/_/g, ' ')}</td>
                      <td className="px-5 py-3 text-xs text-gray-600">{s.case_manager || '—'}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1">
                          {isExpired ? <AlertCircle className="w-3 h-3 text-red-500" /> : isExpiring ? <AlertTriangle className="w-3 h-3 text-amber-500" /> : <CheckCircle className="w-3 h-3 text-emerald-500" />}
                          <span className={`text-xs font-bold ${isExpired ? 'text-red-600' : isExpiring ? 'text-amber-600' : 'text-gray-600'}`}>{s.iep_end_date || '—'}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-12 h-1.5 bg-gray-100 rounded-full">
                            <div className="h-1.5 rounded-full" style={{ width: `${s.compliance_pct || 0}%`, background: (s.compliance_pct || 0) >= 90 ? '#059669' : '#d97706' }} />
                          </div>
                          <span className="text-xs font-black">{s.compliance_pct || 0}%</span>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase ${RISK_COLORS[s.risk_level] || 'bg-gray-100 text-gray-500'}`}>
                          {s.risk_level || 'low'}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase ${isExpired ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                          {isExpired ? 'Expired' : s.iep_status || 'Active'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
          <DialogHeader><DialogTitle className="font-black text-xl">Add SPED Student</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {[
              { label: 'Student Name *', k: 'student_name' }, { label: 'Grade *', k: 'grade' },
              { label: 'School Name', k: 'school_name' }, { label: 'Case Manager', k: 'case_manager' },
              { label: 'IEP Start Date', k: 'iep_start_date', type: 'date' }, { label: 'IEP End Date', k: 'iep_end_date', type: 'date' },
              { label: 'Reevaluation Date', k: 'reevaluation_date', type: 'date' },
              { label: 'Parent/Guardian Name', k: 'parent_guardian_name' },
              { label: 'Parent Email', k: 'parent_email' }, { label: 'Parent Phone', k: 'parent_phone' },
            ].map(({ label, k, type = 'text' }) => (
              <div key={k}>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-1">{label}</label>
                <Input type={type} value={form[k]} onChange={e => setForm(p => ({ ...p, [k]: e.target.value }))} className="rounded-xl" />
              </div>
            ))}
            <div className="col-span-2">
              <label className="block text-xs font-black text-gray-500 uppercase tracking-wider mb-1">Disability Classification</label>
              <Select value={form.disability_classification} onValueChange={v => setForm(p => ({ ...p, disability_classification: v }))}>
                <SelectTrigger className="rounded-xl"><SelectValue placeholder="Select..." /></SelectTrigger>
                <SelectContent>
                  {DISABILITIES.map(d => <SelectItem key={d} value={d}>{d.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setShowAdd(false)} className="rounded-xl">Cancel</Button>
            <Button onClick={() => createMutation.mutate(form)} disabled={!form.student_name || createMutation.isPending}
              className="bg-black text-white rounded-xl font-black">
              {createMutation.isPending ? 'Saving...' : 'Add Student'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}