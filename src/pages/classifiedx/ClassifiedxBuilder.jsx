import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wand2, Sparkles, Mic, Upload, Link as LinkIcon, FileText,
  ChevronRight, Loader2, BookOpen, Zap, Globe, Video,
  CheckCircle2, Plus, GraduationCap, Building2, Target,
  Users, Award, Layers
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const COURSE_TYPES = [
  { value: 'online_course', label: 'Full Online Course', icon: BookOpen },
  { value: 'video_course', label: 'AI Video Course', icon: Video },
  { value: 'coaching_academy', label: 'Coaching Academy', icon: Users },
  { value: 'certification', label: 'Certification Program', icon: Award },
  { value: 'masterclass', label: 'Masterclass', icon: GraduationCap },
  { value: 'training', label: 'Training Program', icon: Target },
  { value: 'digital_university', label: 'Digital University', icon: Building2 },
  { value: 'workshop', label: 'Workshop / Webinar', icon: Zap },
  { value: 'curriculum', label: 'Curriculum Map', icon: Layers },
  { value: 'syllabus', label: 'Syllabus Only', icon: FileText },
];

const AUDIENCES = [
  'K–12 Students', 'Higher Education', 'Corporate / Enterprise',
  'Educators & Teachers', 'School Leaders', 'EdVisors & Coaches',
  'Parents & Families', 'Professionals', 'General Public',
];

const QUICK_PROMPTS = [
  'Create a 6-week classroom management course for new teachers',
  'Build an executive leadership academy for school principals',
  'Design a middle school math intervention program',
  'Generate a corporate onboarding training system',
  'Create a teacher coaching certification program',
  'Build a digital literacy curriculum for high schoolers',
];

export default function ClassifiedxBuilder() {
  const [prompt, setPrompt] = useState('');
  const [courseType, setCourseType] = useState('online_course');
  const [audience, setAudience] = useState('');
  const [duration, setDuration] = useState('6 weeks');
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(null);
  const [expandedModule, setExpandedModule] = useState(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) { toast.error('Please describe your course.'); return; }
    setLoading(true);
    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `You are Classifiedx™, the world's most advanced AI course creation engine. Generate a comprehensive, professional course plan based on this request:

COURSE REQUEST: ${prompt}
COURSE TYPE: ${courseType}
TARGET AUDIENCE: ${audience || 'General learners'}
DURATION: ${duration}

Generate a detailed, production-ready course structure. Be specific, thorough, and professional.`,
        response_json_schema: {
          type: 'object',
          properties: {
            course_title: { type: 'string' },
            tagline: { type: 'string' },
            description: { type: 'string' },
            level: { type: 'string' },
            duration: { type: 'string' },
            total_lessons: { type: 'number' },
            learning_objectives: { type: 'array', items: { type: 'string' } },
            essential_questions: { type: 'array', items: { type: 'string' } },
            prerequisites: { type: 'array', items: { type: 'string' } },
            modules: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  module_number: { type: 'number' },
                  title: { type: 'string' },
                  overview: { type: 'string' },
                  duration: { type: 'string' },
                  lessons: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        lesson_number: { type: 'number' },
                        title: { type: 'string' },
                        type: { type: 'string' },
                        duration_minutes: { type: 'number' },
                        key_concepts: { type: 'array', items: { type: 'string' } },
                        activities: { type: 'array', items: { type: 'string' } },
                      }
                    }
                  },
                  assessments: { type: 'array', items: { type: 'string' } },
                }
              }
            },
            assessments: {
              type: 'object',
              properties: {
                formative: { type: 'array', items: { type: 'string' } },
                summative: { type: 'array', items: { type: 'string' } },
                certification_project: { type: 'string' },
              }
            },
            certification: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                requirements: { type: 'array', items: { type: 'string' } },
              }
            },
            ai_instructional_notes: { type: 'string' },
            suggested_resources: { type: 'array', items: { type: 'string' } },
          }
        }
      });
      setGenerated(res);
      toast.success('Course generated! Review and customize below.');
    } catch (e) {
      toast.error('Generation failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen text-white">
      {/* Header */}
      <div className="border-b border-white/5 px-8 py-5 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Wand2 className="w-4 h-4 text-white/60" />
            <h1 className="font-black text-lg tracking-tight text-white">AI Course Builder</h1>
          </div>
          <p className="text-xs text-white/30">Describe your course. AI generates everything.</p>
        </div>
        {generated && (
          <Button className="bg-white text-black font-black text-xs hover:bg-white/90 rounded-full px-5">
            <Sparkles className="w-3.5 h-3.5" /> Save Course
          </Button>
        )}
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {!generated ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Prompt */}
            <div className="mb-6">
              <label className="text-xs font-black text-white/50 uppercase tracking-widest mb-3 block">Describe Your Course</label>
              <Textarea
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder="e.g. Create a 6-week classroom management certification course for first-year teachers in urban schools. Include videos, quizzes, and a final project..."
                className="bg-white/5 border-white/10 text-white placeholder:text-white/20 min-h-[140px] text-sm resize-none focus:border-white/30 rounded-xl"
              />
            </div>

            {/* Quick Prompts */}
            <div className="mb-8">
              <p className="text-[11px] text-white/25 font-black uppercase tracking-widest mb-3">Quick Start</p>
              <div className="flex flex-wrap gap-2">
                {QUICK_PROMPTS.map(qp => (
                  <button key={qp} onClick={() => setPrompt(qp)}
                    className="text-[11px] border border-white/10 text-white/40 hover:text-white hover:border-white/30 px-3 py-1.5 rounded-full transition-all font-bold">
                    {qp}
                  </button>
                ))}
              </div>
            </div>

            {/* Config Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div>
                <label className="text-[11px] font-black text-white/30 uppercase tracking-widest mb-2 block">Course Type</label>
                <Select value={courseType} onValueChange={setCourseType}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#111] border-white/10 text-white">
                    {COURSE_TYPES.map(ct => (
                      <SelectItem key={ct.value} value={ct.value} className="text-xs focus:bg-white/10 focus:text-white">{ct.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-[11px] font-black text-white/30 uppercase tracking-widest mb-2 block">Target Audience</label>
                <Select value={audience} onValueChange={setAudience}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white text-xs">
                    <SelectValue placeholder="Select audience" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#111] border-white/10 text-white">
                    {AUDIENCES.map(a => (
                      <SelectItem key={a} value={a} className="text-xs focus:bg-white/10 focus:text-white">{a}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-[11px] font-black text-white/30 uppercase tracking-widest mb-2 block">Duration</label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#111] border-white/10 text-white">
                    {['1 week', '2 weeks', '4 weeks', '6 weeks', '8 weeks', '12 weeks', '16 weeks', 'Self-paced', 'Custom'].map(d => (
                      <SelectItem key={d} value={d} className="text-xs focus:bg-white/10 focus:text-white">{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Input Methods */}
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-8">
              {[
                { icon: FileText, label: 'Upload PDF' },
                { icon: LinkIcon, label: 'Website URL' },
                { icon: Video, label: 'Upload Video' },
                { icon: Mic, label: 'Voice Input' },
                { icon: Globe, label: 'YouTube Link' },
                { icon: Upload, label: 'PowerPoint' },
              ].map(({ icon: Icon, label }) => (
                <button key={label} className="flex flex-col items-center gap-1.5 p-3 border border-white/8 rounded-xl hover:bg-white/5 hover:border-white/15 transition-all group">
                  <Icon className="w-4 h-4 text-white/30 group-hover:text-white/60 transition-colors" />
                  <span className="text-[10px] text-white/25 font-bold group-hover:text-white/50">{label}</span>
                </button>
              ))}
            </div>

            <Button onClick={handleGenerate} disabled={loading || !prompt.trim()}
              className="w-full bg-white text-black font-black h-14 rounded-2xl text-sm hover:bg-white/90 transition-all">
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Generating Your Course...</>
              ) : (
                <><Sparkles className="w-4 h-4" /> Generate Complete Course with AI <ChevronRight className="w-4 h-4" /></>
              )}
            </Button>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Course Header */}
            <div className="border border-white/10 rounded-2xl p-6 mb-6 bg-white/3">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="text-[11px] font-black text-white/30 uppercase tracking-widest mb-2">
                    {COURSE_TYPES.find(c => c.value === courseType)?.label} · {generated.duration} · {generated.level}
                  </div>
                  <h2 className="text-2xl font-black text-white mb-1">{generated.course_title}</h2>
                  <p className="text-white/40 text-sm italic mb-3">{generated.tagline}</p>
                  <p className="text-white/60 text-sm leading-relaxed">{generated.description}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-white/5">
                <div className="text-center"><div className="font-black text-white">{generated.total_lessons}</div><div className="text-[10px] text-white/30">Lessons</div></div>
                <div className="text-center"><div className="font-black text-white">{generated.modules?.length}</div><div className="text-[10px] text-white/30">Modules</div></div>
                <div className="text-center"><div className="font-black text-white">{generated.learning_objectives?.length}</div><div className="text-[10px] text-white/30">Objectives</div></div>
              </div>
            </div>

            {/* Learning Objectives */}
            <div className="border border-white/8 rounded-2xl p-5 mb-4 bg-white/2">
              <h3 className="font-black text-sm text-white mb-3 flex items-center gap-2"><Target className="w-4 h-4 text-white/40" /> Learning Objectives</h3>
              <div className="space-y-2">
                {generated.learning_objectives?.map((obj, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-white/30 mt-0.5 flex-shrink-0" />
                    <span className="text-xs text-white/60">{obj}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Modules */}
            <div className="mb-4">
              <h3 className="font-black text-sm text-white mb-3 flex items-center gap-2"><Layers className="w-4 h-4 text-white/40" /> Course Modules ({generated.modules?.length})</h3>
              <div className="space-y-2">
                {generated.modules?.map((mod, i) => (
                  <div key={i} className="border border-white/8 rounded-xl overflow-hidden">
                    <button onClick={() => setExpandedModule(expandedModule === i ? null : i)}
                      className="w-full flex items-center justify-between p-4 hover:bg-white/3 transition-all text-left">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-white/8 flex items-center justify-center text-xs font-black text-white/60">{mod.module_number}</div>
                        <div>
                          <div className="font-black text-sm text-white">{mod.title}</div>
                          <div className="text-[11px] text-white/30">{mod.duration} · {mod.lessons?.length} lessons</div>
                        </div>
                      </div>
                      <ChevronRight className={`w-4 h-4 text-white/30 transition-transform ${expandedModule === i ? 'rotate-90' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {expandedModule === i && (
                        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                          <div className="px-4 pb-4 border-t border-white/5">
                            <p className="text-xs text-white/40 my-3">{mod.overview}</p>
                            <div className="space-y-1.5">
                              {mod.lessons?.map((lesson, j) => (
                                <div key={j} className="flex items-center gap-2.5 py-1.5 px-3 rounded-lg bg-white/3">
                                  <div className="text-[10px] text-white/30 w-5 font-black">{lesson.lesson_number}</div>
                                  <div className="flex-1">
                                    <div className="text-xs font-bold text-white/70">{lesson.title}</div>
                                    <div className="text-[10px] text-white/25">{lesson.type} · {lesson.duration_minutes} min</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                            {mod.assessments?.length > 0 && (
                              <div className="mt-3 pt-3 border-t border-white/5">
                                <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1.5">Module Assessments</p>
                                {mod.assessments.map((a, k) => (
                                  <div key={k} className="text-[11px] text-white/40 flex items-center gap-1.5"><Zap className="w-3 h-3" />{a}</div>
                                ))}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>

            {/* Certification */}
            {generated.certification && (
              <div className="border border-white/8 rounded-2xl p-5 mb-4 bg-white/2">
                <h3 className="font-black text-sm text-white mb-2 flex items-center gap-2"><Award className="w-4 h-4 text-white/40" /> Certification: {generated.certification.name}</h3>
                {generated.certification.requirements?.map((r, i) => (
                  <div key={i} className="text-xs text-white/50 flex items-center gap-2 mt-1"><CheckCircle2 className="w-3 h-3" />{r}</div>
                ))}
              </div>
            )}

            {/* AI Notes */}
            {generated.ai_instructional_notes && (
              <div className="border border-white/8 rounded-2xl p-5 mb-6 bg-white/2">
                <h3 className="font-black text-sm text-white mb-2 flex items-center gap-2"><Sparkles className="w-4 h-4 text-white/40" /> AI Instructional Design Notes</h3>
                <p className="text-xs text-white/50 leading-relaxed">{generated.ai_instructional_notes}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              <Button className="bg-white text-black font-black text-xs rounded-full px-6 hover:bg-white/90">
                <Sparkles className="w-3.5 h-3.5" /> Save to Library
              </Button>
              <Button variant="outline" className="border-white/15 text-white text-xs font-black rounded-full px-5 hover:bg-white/5"
                onClick={() => setGenerated(null)}>
                <Plus className="w-3.5 h-3.5" /> Create Another
              </Button>
              <Button variant="outline" className="border-white/15 text-white text-xs font-black rounded-full px-5 hover:bg-white/5">
                <Video className="w-3.5 h-3.5" /> Generate Videos
              </Button>
              <Button variant="outline" className="border-white/15 text-white text-xs font-black rounded-full px-5 hover:bg-white/5">
                <FileText className="w-3.5 h-3.5" /> Export Syllabus
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}