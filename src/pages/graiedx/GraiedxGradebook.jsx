import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, ChevronDown, ChevronRight, Save, Download, Upload,
  AlertTriangle, CheckCircle, Clock, X, Sparkles, Filter, MoreHorizontal, Pencil, Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const LETTER = (p) => { if (p >= 90) return 'A'; if (p >= 80) return 'B'; if (p >= 70) return 'C'; if (p >= 60) return 'D'; return 'F'; };
const GRADE_COLOR = (p) => { if (p >= 90) return 'text-emerald-600'; if (p >= 70) return 'text-black'; if (p >= 60) return 'text-amber-600'; return 'text-red-600'; };

const CATEGORIES = ['homework','quiz','test','project','classwork','lab','essay','presentation','final_exam','participation','extra_credit','other'];
const SUBJECTS = ['Math','English','Science','Social Studies','Reading','Writing','Art','Music','PE','History','Biology','Chemistry','Physics','Algebra','Geometry','Literature','Other'];

export default function GraiedxGradebook() {
  const [selectedClass, setSelectedClass] = useState(null);
  const [showAddClass, setShowAddClass] = useState(false);
  const [showAddAssignment, setShowAddAssignment] = useState(false);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [editingGrade, setEditingGrade] = useState(null); // { studentId, assignmentId, value }
  const [classForm, setClassForm] = useState({ class_name: '', subject: '', grade_level: '', section: '', room: '', schedule_time: '', grading_scale: 'percentage' });
  const [assignForm, setAssignForm] = useState({ title: '', category: 'homework', points_possible: 100, due_date: '', weight: 1, description: '' });
  const [studentForm, setStudentForm] = useState({ student_name: '', student_id_number: '', parent_email: '', parent_name: '', parent_phone: '' });
  const qc = useQueryClient();

  const { data: classes = [] } = useQuery({ queryKey: ['gx-classes'], queryFn: () => base44.entities.GraiedxClass.list('-created_date', 100) });
  const { data: students = [] } = useQuery({ queryKey: ['gx-students-all'], queryFn: () => base44.entities.GraiedxStudent.list('-created_date', 500) });
  const { data: assignments = [] } = useQuery({ queryKey: ['gx-assignments-all'], queryFn: () => base44.entities.GraiedxAssignment.list('-created_date', 500) });
  const { data: grades = [] } = useQuery({ queryKey: ['gx-grades-all'], queryFn: () => base44.entities.GraiedxGrade.list('-created_date', 2000) });

  const classStudents = selectedClass ? students.filter(s => s.class_id === selectedClass.id) : [];
  const classAssignments = selectedClass ? assignments.filter(a => a.class_id === selectedClass.id).sort((a, b) => new Date(a.due_date || 0) - new Date(b.due_date || 0)) : [];

  const getGrade = (studentId, assignmentId) => grades.find(g => g.student_id === studentId && g.assignment_id === assignmentId);

  const createClassMutation = useMutation({
    mutationFn: d => base44.entities.GraiedxClass.create({ ...d, teacher_email: 'teacher@school.edu' }),
    onSuccess: (created) => { qc.invalidateQueries(['gx-classes']); setShowAddClass(false); setSelectedClass(created); },
  });

  const createAssignMutation = useMutation({
    mutationFn: d => base44.entities.GraiedxAssignment.create({ ...d, class_id: selectedClass.id, class_name: selectedClass.class_name, teacher_email: selectedClass.teacher_email }),
    onSuccess: () => { qc.invalidateQueries(['gx-assignments-all']); setShowAddAssignment(false); setAssignForm({ title: '', category: 'homework', points_possible: 100, due_date: '', weight: 1, description: '' }); },
  });

  const createStudentMutation = useMutation({
    mutationFn: d => base44.entities.GraiedxStudent.create({ ...d, class_id: selectedClass.id, class_name: selectedClass.class_name, teacher_email: selectedClass.teacher_email }),
    onSuccess: () => { qc.invalidateQueries(['gx-students-all']); setShowAddStudent(false); setStudentForm({ student_name: '', student_id_number: '', parent_email: '', parent_name: '', parent_phone: '' }); },
  });

  const saveGrade = useMutation({
    mutationFn: async ({ studentId, studentName, assignmentId, assignmentTitle, points, pointsPossible, status }) => {
      const pct = pointsPossible > 0 ? Math.round((points / pointsPossible) * 100) : 0;
      const existing = grades.find(g => g.student_id === studentId && g.assignment_id === assignmentId);
      const data = {
        student_id: studentId, student_name: studentName, assignment_id: assignmentId,
        assignment_title: assignmentTitle, class_id: selectedClass.id, teacher_email: selectedClass.teacher_email,
        points_earned: parseFloat(points), points_possible: pointsPossible, percentage: pct,
        letter_grade: LETTER(pct), status: status || 'graded', graded_date: new Date().toISOString().split('T')[0],
        is_missing: status === 'missing', is_late: status === 'late',
      };
      if (existing) return base44.entities.GraiedxGrade.update(existing.id, data);
      return base44.entities.GraiedxGrade.create(data);
    },
    onSuccess: () => { qc.invalidateQueries(['gx-grades-all']); setEditingGrade(null); },
  });

  const [inlineEdit, setInlineEdit] = useState({});
  const handleCellClick = (studentId, assignmentId) => {
    const g = getGrade(studentId, assignmentId);
    setInlineEdit({ studentId, assignmentId, value: g?.points_earned ?? '', status: g?.status || 'graded' });
  };
  const handleCellSave = (student, assignment) => {
    if (inlineEdit.value === '' && inlineEdit.status !== 'missing' && inlineEdit.status !== 'excused') return setInlineEdit({});
    saveGrade.mutate({
      studentId: student.id, studentName: student.student_name,
      assignmentId: assignment.id, assignmentTitle: assignment.title,
      points: inlineEdit.value || 0, pointsPossible: assignment.points_possible,
      status: inlineEdit.value === '' ? inlineEdit.status : 'graded',
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-4 sticky top-0 z-10">
        <h2 className="font-black text-base text-black">Gradebook</h2>
        <div className="flex-1 flex items-center gap-3 max-w-lg">
          <Select value={selectedClass?.id || ''} onValueChange={id => setSelectedClass(classes.find(c => c.id === id) || null)}>
            <SelectTrigger className="rounded-xl text-sm"><SelectValue placeholder="Select a class..." /></SelectTrigger>
            <SelectContent>
              {classes.map(c => <SelectItem key={c.id} value={c.id}>{c.class_name} · {c.subject}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <Button variant="outline" size="sm" onClick={() => setShowAddClass(true)} className="rounded-lg text-xs font-bold gap-1">
            <Plus className="w-3 h-3" /> New Class
          </Button>
          {selectedClass && (
            <>
              <Button variant="outline" size="sm" onClick={() => setShowAddStudent(true)} className="rounded-lg text-xs font-bold gap-1">
                <Plus className="w-3 h-3" /> Student
              </Button>
              <Button size="sm" onClick={() => setShowAddAssignment(true)} className="bg-black text-white rounded-lg text-xs font-bold gap-1">
                <Plus className="w-3 h-3" /> Assignment
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Gradebook Table */}
      {!selectedClass ? (
        <div className="flex-1 flex items-center justify-center flex-col gap-4 text-gray-400">
          <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center">
            <ChevronRight className="w-6 h-6 text-gray-300" />
          </div>
          <p className="font-black text-sm">Select a class or create one to open the gradebook</p>
          <Button onClick={() => setShowAddClass(true)} className="bg-black text-white rounded-xl font-black gap-2">
            <Plus className="w-4 h-4" /> Create First Class
          </Button>
        </div>
      ) : (
        <div className="flex-1 overflow-auto">
          {classStudents.length === 0 || classAssignments.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <p className="font-bold mb-2">{classStudents.length === 0 ? 'Add students to get started' : 'Add assignments to start grading'}</p>
              <p className="text-sm text-gray-300">Use the buttons above to add {classStudents.length === 0 ? 'students' : 'assignments'}</p>
            </div>
          ) : (
            <table className="min-w-full border-collapse">
              <thead className="sticky top-0 bg-white border-b-2 border-gray-100 z-10">
                <tr>
                  <th className="sticky left-0 bg-white z-20 px-4 py-3 text-left min-w-[160px]">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Student</span>
                  </th>
                  <th className="px-3 py-3 text-center bg-[#020205] min-w-[70px]">
                    <span className="text-[10px] font-black text-white/50 uppercase tracking-wider">Avg</span>
                  </th>
                  {classAssignments.map(a => (
                    <th key={a.id} className="px-3 py-2 text-center min-w-[90px] border-l border-gray-50">
                      <div className="text-[10px] font-black text-black truncate max-w-[80px]">{a.title}</div>
                      <div className="text-[9px] text-gray-400">{a.category} · /{a.points_possible}</div>
                      <div className="text-[9px] text-gray-300">{a.due_date}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {classStudents.map((student, si) => {
                  const studentGrades = classAssignments.map(a => getGrade(student.id, a.id)).filter(Boolean);
                  const validGrades = studentGrades.filter(g => g.status === 'graded' && g.percentage != null);
                  const avg = validGrades.length ? Math.round(validGrades.reduce((s, g) => s + g.percentage, 0) / validGrades.length) : null;
                  return (
                    <tr key={student.id} className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${si % 2 === 1 ? 'bg-gray-50/30' : ''}`}>
                      <td className="sticky left-0 bg-white px-4 py-2 border-r border-gray-100 z-10">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-[8px] font-black">{student.student_name[0]}</span>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-black">{student.student_name}</p>
                            {student.missing_assignments > 0 && (
                              <p className="text-[9px] text-red-500 font-bold">{student.missing_assignments} missing</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-2 text-center bg-[#020205]">
                        {avg != null ? (
                          <div>
                            <span className={`text-sm font-black text-white`}>{avg}%</span>
                            <div className="text-[9px] text-white/40">{LETTER(avg)}</div>
                          </div>
                        ) : <span className="text-white/20 text-xs">—</span>}
                      </td>
                      {classAssignments.map(a => {
                        const g = getGrade(student.id, a.id);
                        const isEditing = inlineEdit.studentId === student.id && inlineEdit.assignmentId === a.id;
                        return (
                          <td key={a.id} className="px-1 py-1 text-center border-l border-gray-50 cursor-pointer"
                            onClick={() => !isEditing && handleCellClick(student.id, a.id)}>
                            {isEditing ? (
                              <div className="flex flex-col gap-1 items-center p-1">
                                <Input
                                  type="number" value={inlineEdit.value} min={0} max={a.points_possible}
                                  onChange={e => setInlineEdit(p => ({ ...p, value: e.target.value }))}
                                  onKeyDown={e => e.key === 'Enter' && handleCellSave(student, a)}
                                  className="w-16 h-7 text-center text-xs rounded-lg p-1 border-black"
                                  autoFocus
                                />
                                <div className="flex gap-1">
                                  <button onClick={() => setInlineEdit(p => ({ ...p, status: 'missing' }))} className={`text-[8px] px-1 rounded font-bold ${inlineEdit.status === 'missing' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500'}`}>M</button>
                                  <button onClick={() => setInlineEdit(p => ({ ...p, status: 'late' }))} className={`text-[8px] px-1 rounded font-bold ${inlineEdit.status === 'late' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'}`}>L</button>
                                  <button onClick={() => setInlineEdit(p => ({ ...p, status: 'excused' }))} className={`text-[8px] px-1 rounded font-bold ${inlineEdit.status === 'excused' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>E</button>
                                </div>
                                <div className="flex gap-1">
                                  <button onClick={() => handleCellSave(student, a)} className="text-[8px] bg-black text-white px-2 py-0.5 rounded font-bold">✓</button>
                                  <button onClick={() => setInlineEdit({})} className="text-[8px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded font-bold">✕</button>
                                </div>
                              </div>
                            ) : g ? (
                              <div className={`py-1.5 px-1 rounded-lg ${g.is_missing ? 'bg-red-50' : g.is_late ? 'bg-amber-50' : g.is_excused ? 'bg-blue-50' : ''}`}>
                                {g.is_missing ? <span className="text-[10px] font-black text-red-500">MIS</span>
                                  : g.is_excused ? <span className="text-[10px] font-black text-blue-500">EXC</span>
                                  : (
                                    <>
                                      <div className={`text-xs font-black ${GRADE_COLOR(g.percentage || 0)}`}>{g.points_earned}/{a.points_possible}</div>
                                      <div className={`text-[9px] font-black ${GRADE_COLOR(g.percentage || 0)}`}>{g.percentage}%</div>
                                      {g.is_late && <div className="text-[8px] text-amber-500 font-bold">LATE</div>}
                                    </>
                                  )}
                              </div>
                            ) : (
                              <span className="text-gray-200 text-xs">—</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Add Class Dialog */}
      <Dialog open={showAddClass} onOpenChange={setShowAddClass}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader><DialogTitle className="font-black text-xl">Create Class</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-3 mt-4">
            {[{ label: 'Class Name *', k: 'class_name' }, { label: 'Grade Level', k: 'grade_level' }, { label: 'Section', k: 'section' }, { label: 'Room', k: 'room' }, { label: 'Schedule/Period', k: 'schedule_time' }].map(({ label, k }) => (
              <div key={k} className={k === 'class_name' ? 'col-span-2' : ''}>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">{label}</label>
                <Input value={classForm[k]} onChange={e => setClassForm(p => ({ ...p, [k]: e.target.value }))} className="rounded-xl" />
              </div>
            ))}
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Subject</label>
              <Select value={classForm.subject} onValueChange={v => setClassForm(p => ({ ...p, subject: v }))}>
                <SelectTrigger className="rounded-xl"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>{SUBJECTS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Grading Scale</label>
              <Select value={classForm.grading_scale} onValueChange={v => setClassForm(p => ({ ...p, grading_scale: v }))}>
                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['percentage','points','standards','mastery'].map(s => <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setShowAddClass(false)} className="rounded-xl">Cancel</Button>
            <Button onClick={() => createClassMutation.mutate(classForm)} disabled={!classForm.class_name || createClassMutation.isPending}
              className="bg-black text-white rounded-xl font-black">
              {createClassMutation.isPending ? 'Creating...' : 'Create Class'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Assignment Dialog */}
      <Dialog open={showAddAssignment} onOpenChange={setShowAddAssignment}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader><DialogTitle className="font-black text-xl">Add Assignment</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="col-span-2">
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Title *</label>
              <Input value={assignForm.title} onChange={e => setAssignForm(p => ({ ...p, title: e.target.value }))} className="rounded-xl" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Category</label>
              <Select value={assignForm.category} onValueChange={v => setAssignForm(p => ({ ...p, category: v }))}>
                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c.replace(/_/g,' ')}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Points Possible</label>
              <Input type="number" value={assignForm.points_possible} onChange={e => setAssignForm(p => ({ ...p, points_possible: parseFloat(e.target.value) }))} className="rounded-xl" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Due Date</label>
              <Input type="date" value={assignForm.due_date} onChange={e => setAssignForm(p => ({ ...p, due_date: e.target.value }))} className="rounded-xl" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Weight</label>
              <Input type="number" step="0.1" value={assignForm.weight} onChange={e => setAssignForm(p => ({ ...p, weight: parseFloat(e.target.value) }))} className="rounded-xl" />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setShowAddAssignment(false)} className="rounded-xl">Cancel</Button>
            <Button onClick={() => createAssignMutation.mutate(assignForm)} disabled={!assignForm.title || createAssignMutation.isPending}
              className="bg-black text-white rounded-xl font-black">
              {createAssignMutation.isPending ? 'Adding...' : 'Add Assignment'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Student Dialog */}
      <Dialog open={showAddStudent} onOpenChange={setShowAddStudent}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader><DialogTitle className="font-black text-xl">Add Student</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-3 mt-4">
            {[
              { label: 'Student Name *', k: 'student_name', span: 2 },
              { label: 'Student ID', k: 'student_id_number' },
              { label: 'Parent/Guardian Name', k: 'parent_name' },
              { label: 'Parent Email', k: 'parent_email' },
              { label: 'Parent Phone', k: 'parent_phone' },
            ].map(({ label, k, span }) => (
              <div key={k} className={span === 2 ? 'col-span-2' : ''}>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">{label}</label>
                <Input value={studentForm[k]} onChange={e => setStudentForm(p => ({ ...p, [k]: e.target.value }))} className="rounded-xl" />
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setShowAddStudent(false)} className="rounded-xl">Cancel</Button>
            <Button onClick={() => createStudentMutation.mutate(studentForm)} disabled={!studentForm.student_name || createStudentMutation.isPending}
              className="bg-black text-white rounded-xl font-black">
              {createStudentMutation.isPending ? 'Adding...' : 'Add Student'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}