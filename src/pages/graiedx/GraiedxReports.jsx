import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FileText, Plus, Sparkles, CheckCircle, Download, Send, Brain, Loader2, Edit3, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const STATUS_COLORS = {
  draft: 'bg-gray-100 text-gray-600',
  ai_generated: 'bg-blue-100 text-blue-700',
  teacher_reviewed: 'bg-amber-100 text-amber-700',
  approved: 'bg-emerald-100 text-emerald-700',
  published: 'bg-black text-white',
};

export default function GraiedxReports() {
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showGenerate, setShowGenerate] = useState(false);
  const [viewReport, setViewReport] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [bulkGenerating, setBulkGenerating] = useState(false);
  const [genConfig, setGenConfig] = useState({ report_type: 'progress_report', grading_period: 'Quarter 1', class_id: '' });
  const qc = useQueryClient();

  const { data: reports = [], isLoading } = useQuery({ queryKey: ['gx-reports'], queryFn: () => base44.entities.GraiedxReport.list('-created_date', 200) });
  const { data: classes = [] } = useQuery({ queryKey: ['gx-classes'], queryFn: () => base44.entities.GraiedxClass.list() });
  const { data: students = [] } = useQuery({ queryKey: ['gx-students-all'], queryFn: () => base44.entities.GraiedxStudent.list('-created_date', 500) });

  const updateReport = useMutation({
    mutationFn: ({ id, data }) => base44.entities.GraiedxReport.update(id, data),
    onSuccess: () => qc.invalidateQueries(['gx-reports']),
  });

  const generateReport = async (student, reportType, gradingPeriod) => {
    const result = await base44.integrations.Core.InvokeLLM({
      model: 'claude_sonnet_4_6',
      prompt: `Generate a professional teacher progress report comment for:
Student: ${student.student_name}
Class: ${student.class_name}
Current Average: ${student.current_average || 'N/A'}%
Letter Grade: ${student.letter_grade || 'N/A'}
Missing Assignments: ${student.missing_assignments || 0}
Completion Rate: ${student.completion_rate || 100}%
Trend: ${student.trend || 'stable'}
Risk Level: ${student.risk_level || 'on_track'}
Grading Period: ${gradingPeriod}

Generate:
1. A 2-3 sentence teacher comment (professional, specific, growth-focused)
2. Academic strengths (1-2 sentences)
3. Areas for growth (1-2 sentences)

Return as JSON with keys: teacher_comment, strengths, growth_areas`,
      response_json_schema: {
        type: "object",
        properties: {
          teacher_comment: { type: "string" },
          strengths: { type: "string" },
          growth_areas: { type: "string" }
        }
      }
    });
    return result;
  };

  const handleBulkGenerate = async () => {
    setBulkGenerating(true);
    const targetStudents = genConfig.class_id
      ? students.filter(s => s.class_id === genConfig.class_id)
      : students;

    for (const student of targetStudents.slice(0, 30)) {
      const aiData = await generateReport(student, genConfig.report_type, genConfig.grading_period);
      const letterGrade = student.current_average >= 90 ? 'A' : student.current_average >= 80 ? 'B' : student.current_average >= 70 ? 'C' : student.current_average >= 60 ? 'D' : 'F';
      await base44.entities.GraiedxReport.create({
        student_id: student.id, student_name: student.student_name,
        class_id: student.class_id, teacher_email: student.teacher_email,
        report_type: genConfig.report_type, grading_period: genConfig.grading_period,
        current_average: student.current_average, letter_grade: letterGrade,
        missing_assignments: student.missing_assignments,
        completion_rate: student.completion_rate,
        ai_comment: aiData.teacher_comment, teacher_comment: aiData.teacher_comment,
        strengths: aiData.strengths, growth_areas: aiData.growth_areas,
        status: 'ai_generated',
      });
    }
    qc.invalidateQueries(['gx-reports']);
    setBulkGenerating(false);
    setShowGenerate(false);
  };

  const filtered = reports.filter(r => {
    const typeMatch = filterType === 'all' || r.report_type === filterType;
    const statusMatch = filterStatus === 'all' || r.status === filterStatus;
    return typeMatch && statusMatch;
  });

  const stats = {
    total: reports.length,
    published: reports.filter(r => r.status === 'published').length,
    ai_generated: reports.filter(r => r.status === 'ai_generated').length,
    draft: reports.filter(r => r.status === 'draft').length,
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-black">Reports Engine</h1>
          <p className="text-gray-400 text-sm mt-0.5">AI-generated progress reports & report cards</p>
        </div>
        <Button onClick={() => setShowGenerate(true)} className="bg-black text-white rounded-xl font-black gap-2">
          <Sparkles className="w-4 h-4" /> Generate Reports
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total', value: stats.total },
          { label: 'AI Generated', value: stats.ai_generated, color: 'text-blue-700' },
          { label: 'Published', value: stats.published, color: 'text-emerald-700' },
          { label: 'Draft', value: stats.draft, color: 'text-gray-500' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white border border-gray-100 rounded-2xl p-4">
            <p className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">{label}</p>
            <p className={`text-2xl font-black ${color || 'text-black'}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-44 rounded-xl"><SelectValue placeholder="Report Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {['progress_report','report_card','transcript','academic_summary','honor_roll','intervention_report'].map(t => (
              <SelectItem key={t} value={t}>{t.replace(/_/g,' ').replace(/\b\w/g,c=>c.toUpperCase())}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-40 rounded-xl"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {['draft','ai_generated','teacher_reviewed','approved','published'].map(s => (
              <SelectItem key={s} value={s}>{s.replace(/_/g,' ').replace(/\b\w/g,c=>c.toUpperCase())}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><div className="w-8 h-8 border-4 border-black/10 border-t-black rounded-full animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white border border-gray-100 rounded-2xl">
          <FileText className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="font-black text-black text-lg mb-2">No reports yet</p>
          <p className="text-gray-400 text-sm mb-6">Generate AI progress reports for all your students in seconds.</p>
          <Button onClick={() => setShowGenerate(true)} className="bg-black text-white rounded-xl font-black gap-2">
            <Sparkles className="w-4 h-4" /> Generate AI Reports
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(report => (
            <motion.div key={report.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-sm transition-all">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 bg-black/5 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 text-black/40" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-black text-sm text-black">{report.student_name}</p>
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase ${STATUS_COLORS[report.status]}`}>
                        {report.status?.replace(/_/g,' ')}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{report.report_type?.replace(/_/g,' ')} · {report.grading_period}</p>
                    {report.current_average != null && (
                      <p className="text-xs font-black text-gray-700 mt-0.5">{report.current_average}% · {report.letter_grade}</p>
                    )}
                    {report.ai_comment && (
                      <p className="text-xs text-gray-400 mt-1 max-w-lg truncate">"{report.ai_comment}"</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" onClick={() => setViewReport(report)} className="rounded-lg text-xs font-bold gap-1">
                    <Eye className="w-3 h-3" /> View
                  </Button>
                  {report.status !== 'published' && (
                    <Button size="sm" onClick={() => updateReport.mutate({ id: report.id, data: { status: 'published', published: true, published_date: new Date().toISOString().split('T')[0] } })}
                      className="bg-black text-white rounded-lg text-xs font-bold gap-1">
                      <CheckCircle className="w-3 h-3" /> Publish
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Generate Dialog */}
      <Dialog open={showGenerate} onOpenChange={setShowGenerate}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader><DialogTitle className="font-black text-xl flex items-center gap-2"><Sparkles className="w-5 h-5" />Generate AI Reports</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Report Type</label>
              <Select value={genConfig.report_type} onValueChange={v => setGenConfig(p => ({ ...p, report_type: v }))}>
                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['progress_report','report_card','academic_summary','intervention_report'].map(t => (
                    <SelectItem key={t} value={t}>{t.replace(/_/g,' ').replace(/\b\w/g,c=>c.toUpperCase())}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Grading Period</label>
              <Select value={genConfig.grading_period} onValueChange={v => setGenConfig(p => ({ ...p, grading_period: v }))}>
                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['Quarter 1','Quarter 2','Quarter 3','Quarter 4','Semester 1','Semester 2','Trimester 1','Trimester 2','Trimester 3'].map(p => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">Class (optional)</label>
              <Select value={genConfig.class_id} onValueChange={v => setGenConfig(p => ({ ...p, class_id: v }))}>
                <SelectTrigger className="rounded-xl"><SelectValue placeholder="All classes" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value={null}>All Classes</SelectItem>
                  {classes.map(c => <SelectItem key={c.id} value={c.id}>{c.class_name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="bg-blue-50 rounded-xl p-3 text-xs text-blue-700">
              <Brain className="w-4 h-4 inline mr-1" />
              AI will analyze each student's grades, trends, and completion rate to generate professional teacher comments, strengths, and growth areas.
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setShowGenerate(false)} className="rounded-xl">Cancel</Button>
            <Button onClick={handleBulkGenerate} disabled={bulkGenerating} className="bg-black text-white rounded-xl font-black gap-2">
              {bulkGenerating ? <><Loader2 className="w-4 h-4 animate-spin" />Generating...</> : <><Sparkles className="w-4 h-4" />Generate All</>}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Report Dialog */}
      <Dialog open={!!viewReport} onOpenChange={() => setViewReport(null)}>
        <DialogContent className="max-w-2xl rounded-2xl max-h-[90vh] overflow-y-auto">
          {viewReport && (
            <>
              <DialogHeader>
                <DialogTitle className="font-black text-xl">{viewReport.student_name}</DialogTitle>
                <p className="text-sm text-gray-400">{viewReport.report_type?.replace(/_/g,' ')} · {viewReport.grading_period}</p>
              </DialogHeader>
              <div className="grid grid-cols-3 gap-3 my-4">
                <div className="bg-black text-white rounded-xl p-3 text-center">
                  <p className="text-2xl font-black">{viewReport.current_average || '—'}%</p>
                  <p className="text-[9px] text-white/40 uppercase tracking-wider font-black">Average</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-2xl font-black">{viewReport.letter_grade || '—'}</p>
                  <p className="text-[9px] text-gray-400 uppercase tracking-wider font-black">Grade</p>
                </div>
                <div className={`rounded-xl p-3 text-center ${(viewReport.missing_assignments || 0) > 0 ? 'bg-red-50' : 'bg-emerald-50'}`}>
                  <p className={`text-2xl font-black ${(viewReport.missing_assignments || 0) > 0 ? 'text-red-700' : 'text-emerald-700'}`}>{viewReport.missing_assignments || 0}</p>
                  <p className="text-[9px] text-gray-400 uppercase tracking-wider font-black">Missing</p>
                </div>
              </div>
              {viewReport.teacher_comment && (
                <div className="mb-4">
                  <p className="text-xs font-black text-gray-400 uppercase tracking-wider mb-1">Teacher Comment</p>
                  <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-xl p-3">{viewReport.teacher_comment}</p>
                </div>
              )}
              {viewReport.strengths && (
                <div className="mb-4">
                  <p className="text-xs font-black text-gray-400 uppercase tracking-wider mb-1">Strengths</p>
                  <p className="text-sm text-gray-700 leading-relaxed bg-emerald-50 rounded-xl p-3">{viewReport.strengths}</p>
                </div>
              )}
              {viewReport.growth_areas && (
                <div className="mb-4">
                  <p className="text-xs font-black text-gray-400 uppercase tracking-wider mb-1">Areas for Growth</p>
                  <p className="text-sm text-gray-700 leading-relaxed bg-amber-50 rounded-xl p-3">{viewReport.growth_areas}</p>
                </div>
              )}
              <div className="flex gap-3">
                <Button onClick={() => updateReport.mutate({ id: viewReport.id, data: { status: 'approved', approved: true } })}
                  className="bg-black text-white rounded-xl font-black gap-2 flex-1">
                  <CheckCircle className="w-4 h-4" /> Approve Report
                </Button>
                <Button variant="outline" onClick={() => updateReport.mutate({ id: viewReport.id, data: { status: 'published', published: true } })}
                  className="rounded-xl font-black gap-2">
                  <Send className="w-4 h-4" /> Publish to Family
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}