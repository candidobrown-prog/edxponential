import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Sparkles, Loader2, ChevronRight, FileText,
  Download, Share2, Printer, CheckCircle2, Calendar,
  Target, Users, Award, Clock, Layers, Plus, Globe, Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export default function ClassifiedxSyllabus() {
  const [courseTitle, setCourseTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [gradeLevel, setGradeLevel] = useState('');
  const [duration, setDuration] = useState('Semester');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [syllabus, setSyllabus] = useState(null);
  const [activeSection, setActiveSection] = useState('overview');

  const handleGenerate = async () => {
    if (!courseTitle.trim()) { toast.error('Please enter a course title.'); return; }
    setLoading(true);
    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `You are an expert instructional designer and academic curriculum specialist. Generate a comprehensive, professional syllabus for:

COURSE TITLE: ${courseTitle}
SUBJECT AREA: ${subject}
GRADE/LEVEL: ${gradeLevel || 'College/Adult'}
DURATION: ${duration}
ADDITIONAL CONTEXT: ${additionalNotes || 'Standard professional course'}

Create a detailed, publication-ready syllabus. Be thorough and professional.`,
        response_json_schema: {
          type: 'object',
          properties: {
            course_title: { type: 'string' },
            course_code: { type: 'string' },
            credits: { type: 'string' },
            instructor_note: { type: 'string' },
            course_description: { type: 'string' },
            course_overview: { type: 'string' },
            learning_objectives: { type: 'array', items: { type: 'string' } },
            essential_questions: { type: 'array', items: { type: 'string' } },
            required_materials: { type: 'array', items: { type: 'string' } },
            recommended_resources: { type: 'array', items: { type: 'string' } },
            grading_breakdown: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  category: { type: 'string' },
                  percentage: { type: 'number' },
                  description: { type: 'string' },
                }
              }
            },
            policies: {
              type: 'object',
              properties: {
                attendance: { type: 'string' },
                late_work: { type: 'string' },
                academic_integrity: { type: 'string' },
                participation: { type: 'string' },
              }
            },
            weekly_schedule: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  week: { type: 'number' },
                  topic: { type: 'string' },
                  readings: { type: 'array', items: { type: 'string' } },
                  activities: { type: 'array', items: { type: 'string' } },
                  assignments_due: { type: 'string' },
                }
              }
            },
            assessments: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  type: { type: 'string' },
                  due_week: { type: 'number' },
                  description: { type: 'string' },
                  weight: { type: 'string' },
                }
              }
            },
            standards_alignment: { type: 'array', items: { type: 'string' } },
            ai_design_notes: { type: 'string' },
          }
        }
      });
      setSyllabus(res);
      toast.success('Syllabus generated!');
    } catch (e) {
      toast.error('Generation failed. Please try again.');
    }
    setLoading(false);
  };

  const SECTIONS = [
    { id: 'overview', label: 'Overview' },
    { id: 'objectives', label: 'Objectives' },
    { id: 'schedule', label: 'Weekly Schedule' },
    { id: 'grading', label: 'Grading' },
    { id: 'assessments', label: 'Assessments' },
    { id: 'policies', label: 'Policies' },
  ];

  return (
    <div className="min-h-screen text-white">
      <div className="border-b border-white/5 px-8 py-5 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="w-4 h-4 text-white/60" />
            <h1 className="font-black text-lg tracking-tight text-white">AI Syllabus Builder</h1>
          </div>
          <p className="text-xs text-white/30">Generate publication-ready syllabi and curriculum maps with AI</p>
        </div>
        {syllabus && (
          <div className="flex gap-2">
            <Button variant="outline" className="border-white/15 text-white text-xs font-black rounded-full hover:bg-white/5">
              <Printer className="w-3.5 h-3.5" /> Print
            </Button>
            <Button variant="outline" className="border-white/15 text-white text-xs font-black rounded-full hover:bg-white/5">
              <Download className="w-3.5 h-3.5" /> Export PDF
            </Button>
            <Button className="bg-white text-black font-black text-xs rounded-full px-5 hover:bg-white/90">
              <Share2 className="w-3.5 h-3.5" /> Share
            </Button>
          </div>
        )}
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {!syllabus ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <div className="w-14 h-14 rounded-2xl bg-white/8 flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-6 h-6 text-white/60" />
              </div>
              <h2 className="text-2xl font-black text-white mb-2">AI Syllabus Generator</h2>
              <p className="text-white/30 text-sm">Build a professional, complete syllabus in seconds</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[11px] font-black text-white/30 uppercase tracking-widest mb-2 block">Course Title *</label>
                <Input value={courseTitle} onChange={e => setCourseTitle(e.target.value)}
                  placeholder="e.g. Advanced Instructional Leadership for School Principals"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-white/30" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-black text-white/30 uppercase tracking-widest mb-2 block">Subject Area</label>
                  <Input value={subject} onChange={e => setSubject(e.target.value)}
                    placeholder="e.g. Education, Leadership, Science"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-white/30" />
                </div>
                <div>
                  <label className="text-[11px] font-black text-white/30 uppercase tracking-widest mb-2 block">Grade / Level</label>
                  <Input value={gradeLevel} onChange={e => setGradeLevel(e.target.value)}
                    placeholder="e.g. Graduate, High School, Adult"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-white/30" />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-black text-white/30 uppercase tracking-widest mb-2 block">Course Duration</label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#111] border-white/10 text-white">
                    {['4 Weeks', '6 Weeks', '8 Weeks', '10 Weeks', 'Semester', 'Full Year', 'Self-Paced', '1 Day Workshop', '3-Day Intensive'].map(d => (
                      <SelectItem key={d} value={d} className="text-xs focus:bg-white/10 focus:text-white">{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-[11px] font-black text-white/30 uppercase tracking-widest mb-2 block">Additional Context</label>
                <Textarea value={additionalNotes} onChange={e => setAdditionalNotes(e.target.value)}
                  placeholder="Any specific requirements, standards, audience details, certifications, or instructional goals..."
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/20 min-h-[100px] resize-none focus:border-white/30" />
              </div>

              <Button onClick={handleGenerate} disabled={loading || !courseTitle.trim()}
                className="w-full bg-white text-black font-black h-13 rounded-xl text-sm hover:bg-white/90 h-12">
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating Syllabus...</> : <><Sparkles className="w-4 h-4" /> Generate Complete Syllabus</>}
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Syllabus Header */}
            <div className="border border-white/10 rounded-2xl p-6 mb-6 bg-white/3">
              <div className="text-[11px] font-black text-white/30 uppercase tracking-widest mb-1">{syllabus.course_code} · {duration} · {gradeLevel || 'College/Adult'}</div>
              <h2 className="text-2xl font-black text-white mb-1">{syllabus.course_title}</h2>
              <p className="text-sm text-white/40 leading-relaxed">{syllabus.course_description}</p>
              <div className="flex gap-4 mt-4 pt-4 border-t border-white/5 text-center">
                <div><div className="font-black text-white">{syllabus.weekly_schedule?.length || 0}</div><div className="text-[10px] text-white/30">Weeks</div></div>
                <div><div className="font-black text-white">{syllabus.assessments?.length || 0}</div><div className="text-[10px] text-white/30">Assessments</div></div>
                <div><div className="font-black text-white">{syllabus.learning_objectives?.length || 0}</div><div className="text-[10px] text-white/30">Objectives</div></div>
              </div>
            </div>

            {/* Section Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {SECTIONS.map(s => (
                <button key={s.id} onClick={() => setActiveSection(s.id)}
                  className={`px-4 py-2 rounded-full text-xs font-black whitespace-nowrap transition-all ${activeSection === s.id ? 'bg-white text-black' : 'border border-white/15 text-white/40 hover:bg-white/5'}`}>
                  {s.label}
                </button>
              ))}
            </div>

            {/* Section Content */}
            {activeSection === 'overview' && (
              <div className="space-y-4">
                <div className="border border-white/8 rounded-2xl p-5 bg-white/2">
                  <h4 className="font-black text-sm text-white mb-3 flex items-center gap-2"><FileText className="w-4 h-4 text-white/40" /> Course Overview</h4>
                  <p className="text-sm text-white/60 leading-relaxed">{syllabus.course_overview}</p>
                </div>
                {syllabus.required_materials?.length > 0 && (
                  <div className="border border-white/8 rounded-2xl p-5 bg-white/2">
                    <h4 className="font-black text-sm text-white mb-3">Required Materials</h4>
                    {syllabus.required_materials.map((m, i) => <div key={i} className="text-xs text-white/50 flex gap-2 items-start py-0.5"><span className="text-white/20">·</span>{m}</div>)}
                  </div>
                )}
                {syllabus.essential_questions?.length > 0 && (
                  <div className="border border-white/8 rounded-2xl p-5 bg-white/2">
                    <h4 className="font-black text-sm text-white mb-3">Essential Questions</h4>
                    {syllabus.essential_questions.map((q, i) => (
                      <div key={i} className="text-sm text-white/60 flex gap-2 items-start py-1 italic"><ChevronRight className="w-3.5 h-3.5 mt-0.5 text-white/30 flex-shrink-0" />{q}</div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeSection === 'objectives' && (
              <div className="border border-white/8 rounded-2xl p-5 bg-white/2">
                <h4 className="font-black text-sm text-white mb-4 flex items-center gap-2"><Target className="w-4 h-4 text-white/40" /> Learning Objectives</h4>
                <div className="space-y-2">
                  {syllabus.learning_objectives?.map((obj, i) => (
                    <div key={i} className="flex items-start gap-2.5 py-2 border-b border-white/5 last:border-0">
                      <CheckCircle2 className="w-4 h-4 text-white/30 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-white/60">{obj}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'schedule' && (
              <div className="space-y-2">
                {syllabus.weekly_schedule?.map((week, i) => (
                  <div key={i} className="border border-white/8 rounded-xl p-4 bg-white/2">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/8 flex items-center justify-center text-xs font-black text-white/60 flex-shrink-0">{week.week}</div>
                      <div className="flex-1">
                        <div className="font-black text-sm text-white">{week.topic}</div>
                        {week.assignments_due && <div className="text-[11px] text-white/30 mt-0.5 flex items-center gap-1"><Zap className="w-3 h-3" /> Due: {week.assignments_due}</div>}
                        {week.activities?.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {week.activities.map((a, j) => <span key={j} className="text-[10px] bg-white/5 border border-white/8 px-2 py-0.5 rounded-full text-white/30">{a}</span>)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeSection === 'grading' && (
              <div className="border border-white/8 rounded-2xl p-5 bg-white/2">
                <h4 className="font-black text-sm text-white mb-4 flex items-center gap-2"><Award className="w-4 h-4 text-white/40" /> Grading Breakdown</h4>
                <div className="space-y-3">
                  {syllabus.grading_breakdown?.map((g, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-12 text-right">
                        <span className="font-black text-white text-sm">{g.percentage}%</span>
                      </div>
                      <div className="flex-1 h-2 bg-white/8 rounded-full overflow-hidden">
                        <div className="h-full bg-white/50 rounded-full" style={{ width: `${g.percentage}%` }} />
                      </div>
                      <div className="w-40">
                        <div className="text-xs font-black text-white/70">{g.category}</div>
                        <div className="text-[10px] text-white/25">{g.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'assessments' && (
              <div className="space-y-3">
                {syllabus.assessments?.map((a, i) => (
                  <div key={i} className="border border-white/8 rounded-xl p-4 bg-white/2">
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-black text-sm text-white">{a.name}</div>
                      <div className="flex gap-2 items-center">
                        <span className="text-[10px] bg-white/8 border border-white/10 px-2 py-0.5 rounded-full text-white/40">{a.type}</span>
                        <span className="text-xs font-black text-white/60">{a.weight}</span>
                      </div>
                    </div>
                    <p className="text-xs text-white/40">{a.description}</p>
                    {a.due_week && <p className="text-[11px] text-white/25 mt-1 flex items-center gap-1"><Clock className="w-3 h-3" /> Week {a.due_week}</p>}
                  </div>
                ))}
              </div>
            )}

            {activeSection === 'policies' && syllabus.policies && (
              <div className="space-y-3">
                {Object.entries(syllabus.policies).map(([key, value]) => (
                  <div key={key} className="border border-white/8 rounded-xl p-4 bg-white/2">
                    <div className="font-black text-sm text-white mb-1 capitalize">{key.replace(/_/g, ' ')}</div>
                    <p className="text-xs text-white/50 leading-relaxed">{value}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <Button className="bg-white text-black font-black text-xs rounded-full px-6 hover:bg-white/90">
                <FileText className="w-3.5 h-3.5" /> Save Syllabus
              </Button>
              <Button variant="outline" className="border-white/15 text-white text-xs font-black rounded-full px-5 hover:bg-white/5"
                onClick={() => setSyllabus(null)}>
                <Plus className="w-3.5 h-3.5" /> New Syllabus
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}