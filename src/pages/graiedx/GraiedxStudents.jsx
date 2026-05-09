import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Users, Search, TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle, Sparkles, Brain, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const RISK_CONFIG = {
  on_track: { color: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  watch: { color: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-500' },
  concern: { color: 'bg-orange-100 text-orange-700', dot: 'bg-orange-500' },
  at_risk: { color: 'bg-red-100 text-red-700', dot: 'bg-red-500' },
  failing: { color: 'bg-red-200 text-red-900', dot: 'bg-red-900' },
};

const TREND_ICONS = {
  improving: <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />,
  stable: <Minus className="w-3.5 h-3.5 text-gray-400" />,
  declining: <TrendingDown className="w-3.5 h-3.5 text-red-500" />,
};

export default function GraiedxStudents() {
  const [search, setSearch] = useState('');
  const [filterRisk, setFilterRisk] = useState('all');
  const [filterClass, setFilterClass] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [aiProfile, setAiProfile] = useState('');
  const [generating, setGenerating] = useState(false);
  const qc = useQueryClient();

  const { data: students = [], isLoading } = useQuery({ queryKey: ['gx-students-all'], queryFn: () => base44.entities.GraiedxStudent.list('-created_date', 500) });
  const { data: classes = [] } = useQuery({ queryKey: ['gx-classes'], queryFn: () => base44.entities.GraiedxClass.list() });
  const { data: grades = [] } = useQuery({ queryKey: ['gx-grades-all'], queryFn: () => base44.entities.GraiedxGrade.list('-created_date', 2000) });

  const updateStudent = useMutation({
    mutationFn: ({ id, data }) => base44.entities.GraiedxStudent.update(id, data),
    onSuccess: () => qc.invalidateQueries(['gx-students-all']),
  });

  const generateProfile = async (student) => {
    setGenerating(true);
    const studentGrades = grades.filter(g => g.student_id === student.id);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Generate a student academic profile analysis:
Student: ${student.student_name}
Class: ${student.class_name}
Average: ${student.current_average || 'N/A'}%
Missing: ${student.missing_assignments || 0} assignments
Completion: ${student.completion_rate || 100}%
Trend: ${student.trend || 'stable'}
Risk Level: ${student.risk_level || 'on_track'}
Total Grades Recorded: ${studentGrades.length}

Generate a 3-4 sentence student profile including academic standing, strengths inferred from grades, areas needing support, and 1-2 specific teacher recommendations. Be professional and specific.`,
    });
    setAiProfile(result);
    setGenerating(false);
  };

  const filtered = students.filter(s => {
    const searchMatch = !search || s.student_name?.toLowerCase().includes(search.toLowerCase());
    const riskMatch = filterRisk === 'all' || s.risk_level === filterRisk;
    const classMatch = filterClass === 'all' || s.class_id === filterClass;
    return searchMatch && riskMatch && classMatch;
  });

  const avgGrade = students.length ? Math.round(students.reduce((a, s) => a + (s.current_average || 0), 0) / students.length) : 0;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-black">Student Performance</h1>
          <p className="text-gray-400 text-sm mt-0.5">{students.length} students · {avgGrade}% school average</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        {[
          { label: 'Total', value: students.length },
          { label: 'On Track', value: students.filter(s => s.risk_level === 'on_track').length, color: 'text-emerald-600' },
          { label: 'At Risk', value: students.filter(s => s.risk_level === 'at_risk' || s.risk_level === 'concern').length, color: 'text-orange-600' },
          { label: 'Failing', value: students.filter(s => s.risk_level === 'failing').length, color: 'text-red-600' },
          { label: 'Improving', value: students.filter(s => s.trend === 'improving').length, color: 'text-emerald-600' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white border border-gray-100 rounded-2xl p-4">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">{label}</p>
            <p className={`text-2xl font-black ${color || 'text-black'}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search students..." className="pl-9 rounded-xl" />
        </div>
        <Select value={filterClass} onValueChange={setFilterClass}>
          <SelectTrigger className="w-44 rounded-xl"><SelectValue placeholder="All Classes" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Classes</SelectItem>
            {classes.map(c => <SelectItem key={c.id} value={c.id}>{c.class_name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterRisk} onValueChange={setFilterRisk}>
          <SelectTrigger className="w-40 rounded-xl"><SelectValue placeholder="Risk Level" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Risk Levels</SelectItem>
            {['on_track','watch','concern','at_risk','failing'].map(r => (
              <SelectItem key={r} value={r}>{r.replace(/_/g,' ').replace(/\b\w/g,c=>c.toUpperCase())}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><div className="w-8 h-8 border-4 border-black/10 border-t-black rounded-full animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <Users className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="font-black text-gray-400">No students found</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-50">
                {['Student', 'Class', 'Average', 'Missing', 'Completion', 'Trend', 'Risk', 'Actions'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-[10px] font-black text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => {
                const risk = RISK_CONFIG[s.risk_level] || RISK_CONFIG.on_track;
                const avg = s.current_average || 0;
                return (
                  <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer" onClick={() => { setSelectedStudent(s); setAiProfile(''); }}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-[9px] font-black">{s.student_name[0]}</span>
                        </div>
                        <div>
                          <p className="font-bold text-sm text-black">{s.student_name}</p>
                          <p className="text-[9px] text-gray-400">{s.student_id_number}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-xs text-gray-600">{s.class_name}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-1.5 bg-gray-100 rounded-full">
                          <div className="h-1.5 rounded-full" style={{ width: `${avg}%`, background: avg >= 70 ? '#059669' : avg >= 60 ? '#d97706' : '#dc2626' }} />
                        </div>
                        <span className={`text-xs font-black ${avg >= 70 ? 'text-black' : avg >= 60 ? 'text-amber-600' : 'text-red-600'}`}>{avg}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      {(s.missing_assignments || 0) > 0 ? (
                        <span className="text-xs font-black text-red-600">{s.missing_assignments}</span>
                      ) : <span className="text-xs text-gray-400">0</span>}
                    </td>
                    <td className="px-5 py-3 text-xs text-gray-600">{s.completion_rate || 100}%</td>
                    <td className="px-5 py-3">{TREND_ICONS[s.trend || 'stable']}</td>
                    <td className="px-5 py-3">
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase ${risk.color}`}>
                        {s.risk_level?.replace(/_/g,' ')}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <Button size="sm" variant="outline" onClick={e => { e.stopPropagation(); setSelectedStudent(s); setAiProfile(''); }}
                        className="rounded-lg text-xs font-bold gap-1">
                        <Sparkles className="w-3 h-3" /> Profile
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Student Profile Dialog */}
      <Dialog open={!!selectedStudent} onOpenChange={() => { setSelectedStudent(null); setAiProfile(''); }}>
        <DialogContent className="max-w-lg rounded-2xl">
          {selectedStudent && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center">
                    <span className="text-white font-black text-lg">{selectedStudent.student_name[0]}</span>
                  </div>
                  <div>
                    <DialogTitle className="font-black text-xl">{selectedStudent.student_name}</DialogTitle>
                    <p className="text-sm text-gray-400">{selectedStudent.class_name}</p>
                  </div>
                </div>
              </DialogHeader>
              <div className="grid grid-cols-3 gap-3 my-4">
                <div className="bg-black text-white rounded-xl p-3 text-center">
                  <p className="text-2xl font-black">{selectedStudent.current_average || 0}%</p>
                  <p className="text-[9px] text-white/40 uppercase tracking-wider font-black">Average</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className={`text-2xl font-black ${(selectedStudent.missing_assignments || 0) > 0 ? 'text-red-600' : 'text-black'}`}>{selectedStudent.missing_assignments || 0}</p>
                  <p className="text-[9px] text-gray-400 uppercase tracking-wider font-black">Missing</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-2xl font-black">{selectedStudent.completion_rate || 100}%</p>
                  <p className="text-[9px] text-gray-400 uppercase tracking-wider font-black">Completion</p>
                </div>
              </div>

              {selectedStudent.parent_email && (
                <div className="bg-gray-50 rounded-xl p-3 mb-4 text-xs">
                  <p className="font-black text-gray-500 uppercase tracking-wider text-[9px] mb-1">Family Contact</p>
                  <p className="font-bold text-black">{selectedStudent.parent_name || 'Parent/Guardian'}</p>
                  <p className="text-gray-500">{selectedStudent.parent_email}</p>
                </div>
              )}

              <Button onClick={() => generateProfile(selectedStudent)} disabled={generating} className="w-full bg-black text-white rounded-xl font-black gap-2">
                {generating ? <><Loader2 className="w-4 h-4 animate-spin" />Generating...</> : <><Sparkles className="w-4 h-4" />Generate AI Profile</>}
              </Button>

              {aiProfile && (
                <div className="bg-gray-50 rounded-xl p-4 mt-3">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider mb-2">AI Academic Profile</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{aiProfile}</p>
                </div>
              )}

              {selectedStudent.notes && (
                <div className="mt-3">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider mb-1">Teacher Notes</p>
                  <p className="text-sm text-gray-600">{selectedStudent.notes}</p>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}