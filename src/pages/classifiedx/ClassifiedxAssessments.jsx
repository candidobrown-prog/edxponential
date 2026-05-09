import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import {
  Zap, Sparkles, Loader2, Plus, CheckCircle2, Target,
  Award, BookOpen, BarChart3, ChevronRight, Edit3,
  Layers, Brain, Clock, Download, Shuffle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const ASSESSMENT_TYPES = [
  { value: 'multiple_choice', label: 'Multiple Choice Quiz', icon: CheckCircle2 },
  { value: 'short_answer', label: 'Short Answer', icon: Edit3 },
  { value: 'rubric', label: 'Rubric Assessment', icon: Layers },
  { value: 'project', label: 'Project Brief', icon: Target },
  { value: 'certification', label: 'Certification Exam', icon: Award },
  { value: 'discussion', label: 'Discussion Prompt', icon: Brain },
];

export default function ClassifiedxAssessments() {
  const [topic, setTopic] = useState('');
  const [assessmentType, setAssessmentType] = useState('multiple_choice');
  const [difficulty, setDifficulty] = useState('intermediate');
  const [numQuestions, setNumQuestions] = useState('10');
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(null);

  const handleGenerate = async () => {
    if (!topic.trim()) { toast.error('Enter a topic or course area.'); return; }
    setLoading(true);
    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `You are an expert assessment designer and instructional evaluator. Generate a professional, high-quality assessment.

TOPIC/COURSE AREA: ${topic}
ASSESSMENT TYPE: ${assessmentType}
DIFFICULTY LEVEL: ${difficulty}
NUMBER OF QUESTIONS: ${numQuestions}

Create a comprehensive, pedagogically sound assessment. For multiple choice, include 4 options (A-D) and clearly mark the correct answer. Make questions that truly test understanding, not just recall. Include a mix of cognitive levels (knowledge, application, analysis, synthesis).`,
        response_json_schema: {
          type: 'object',
          properties: {
            assessment_title: { type: 'string' },
            assessment_type: { type: 'string' },
            difficulty: { type: 'string' },
            instructions: { type: 'string' },
            time_estimate: { type: 'string' },
            learning_objectives_tested: { type: 'array', items: { type: 'string' } },
            questions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  number: { type: 'number' },
                  question: { type: 'string' },
                  type: { type: 'string' },
                  options: { type: 'array', items: { type: 'string' } },
                  correct_answer: { type: 'string' },
                  explanation: { type: 'string' },
                  cognitive_level: { type: 'string' },
                  points: { type: 'number' },
                }
              }
            },
            scoring_guide: { type: 'string' },
            rubric_criteria: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  criterion: { type: 'string' },
                  excellent: { type: 'string' },
                  proficient: { type: 'string' },
                  developing: { type: 'string' },
                  beginning: { type: 'string' },
                  points: { type: 'number' },
                }
              }
            },
            ai_notes: { type: 'string' },
          }
        }
      });
      setGenerated(res);
      toast.success('Assessment generated!');
    } catch (e) {
      toast.error('Generation failed.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen text-white">
      <div className="border-b border-white/5 px-8 py-5 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-white/60" />
            <h1 className="font-black text-lg tracking-tight text-white">Assessment Builder</h1>
          </div>
          <p className="text-xs text-white/30">Generate quizzes, rubrics, projects, and certification exams with AI</p>
        </div>
        {generated && (
          <div className="flex gap-2">
            <Button variant="outline" className="border-white/15 text-white text-xs font-black rounded-full hover:bg-white/5">
              <Download className="w-3.5 h-3.5" /> Export
            </Button>
            <Button variant="outline" className="border-white/15 text-white text-xs font-black rounded-full hover:bg-white/5"
              onClick={() => setGenerated(null)}>
              <Plus className="w-3.5 h-3.5" /> New
            </Button>
          </div>
        )}
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {!generated ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Type Selector */}
            <div className="mb-6">
              <label className="text-[11px] font-black text-white/30 uppercase tracking-widest mb-3 block">Assessment Type</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {ASSESSMENT_TYPES.map(({ value, label, icon: Icon }) => (
                  <button key={value} onClick={() => setAssessmentType(value)}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all ${assessmentType === value ? 'border-white bg-white/8 text-white' : 'border-white/8 text-white/40 hover:border-white/20 hover:bg-white/4'}`}>
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="text-xs font-black">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[11px] font-black text-white/30 uppercase tracking-widest mb-2 block">Topic / Course Area</label>
                <Textarea value={topic} onChange={e => setTopic(e.target.value)}
                  placeholder="e.g. Classroom management strategies for urban middle school educators, focusing on restorative practices and proactive prevention..."
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/20 min-h-[100px] resize-none focus:border-white/30 rounded-xl" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-black text-white/30 uppercase tracking-widest mb-2 block">Difficulty Level</label>
                  <Select value={difficulty} onValueChange={setDifficulty}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#111] border-white/10 text-white">
                      {['beginner', 'intermediate', 'advanced', 'expert'].map(d => (
                        <SelectItem key={d} value={d} className="text-xs focus:bg-white/10 focus:text-white capitalize">{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-[11px] font-black text-white/30 uppercase tracking-widest mb-2 block">Number of Questions</label>
                  <Select value={numQuestions} onValueChange={setNumQuestions}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#111] border-white/10 text-white">
                      {['5', '10', '15', '20', '25', '30', '50'].map(n => (
                        <SelectItem key={n} value={n} className="text-xs focus:bg-white/10 focus:text-white">{n} questions</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={handleGenerate} disabled={loading || !topic.trim()}
                className="w-full bg-white text-black font-black h-12 rounded-xl text-sm hover:bg-white/90">
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating Assessment...</> : <><Sparkles className="w-4 h-4" /> Generate Assessment</>}
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            {/* Header */}
            <div className="border border-white/10 rounded-2xl p-5 bg-white/3">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-[11px] font-black text-white/30 uppercase tracking-widest">{generated.assessment_type} · {generated.difficulty}</div>
                  <h2 className="text-xl font-black text-white">{generated.assessment_title}</h2>
                </div>
                <div className="flex gap-2 text-center">
                  <div className="border border-white/8 rounded-xl p-2.5 min-w-[60px]">
                    <div className="font-black text-white text-sm">{generated.questions?.length}</div>
                    <div className="text-[10px] text-white/25">Questions</div>
                  </div>
                  <div className="border border-white/8 rounded-xl p-2.5 min-w-[60px]">
                    <div className="font-black text-white text-sm">{generated.time_estimate}</div>
                    <div className="text-[10px] text-white/25">Time</div>
                  </div>
                </div>
              </div>
              <p className="text-xs text-white/50 mt-2">{generated.instructions}</p>
            </div>

            {/* Questions */}
            <div className="space-y-3">
              {generated.questions?.map((q, i) => (
                <div key={i} className="border border-white/8 rounded-xl p-4 bg-white/2">
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-white/8 flex items-center justify-center text-xs font-black text-white/50 flex-shrink-0">{q.number}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold text-white/70">{q.question}</span>
                        <span className="text-[10px] bg-white/5 border border-white/8 px-1.5 py-0.5 rounded text-white/25">{q.cognitive_level}</span>
                        <span className="text-[10px] text-white/20">{q.points}pt</span>
                      </div>
                      {q.options && (
                        <div className="space-y-1 mt-2">
                          {q.options.map((opt, j) => (
                            <div key={j} className={`text-xs px-3 py-1.5 rounded-lg border ${q.correct_answer && opt.startsWith(q.correct_answer.charAt(0)) ? 'border-white/20 bg-white/8 text-white/70' : 'border-white/5 text-white/35'}`}>
                              {opt}
                            </div>
                          ))}
                        </div>
                      )}
                      {q.explanation && (
                        <div className="mt-2 text-[11px] text-white/30 bg-white/4 rounded-lg px-3 py-2">
                          <span className="font-black">Explanation: </span>{q.explanation}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Rubric */}
            {generated.rubric_criteria?.length > 0 && (
              <div className="border border-white/8 rounded-2xl p-5 bg-white/2">
                <h3 className="font-black text-sm text-white mb-4 flex items-center gap-2"><Layers className="w-4 h-4 text-white/40" /> Grading Rubric</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-white/8">
                        <th className="text-left text-white/30 font-black pb-2 pr-4">Criterion</th>
                        <th className="text-left text-white/30 font-black pb-2 pr-4">Excellent</th>
                        <th className="text-left text-white/30 font-black pb-2 pr-4">Proficient</th>
                        <th className="text-left text-white/30 font-black pb-2">Developing</th>
                      </tr>
                    </thead>
                    <tbody>
                      {generated.rubric_criteria.map((r, i) => (
                        <tr key={i} className="border-b border-white/5">
                          <td className="text-white/70 font-black py-2 pr-4">{r.criterion}</td>
                          <td className="text-white/40 py-2 pr-4">{r.excellent}</td>
                          <td className="text-white/40 py-2 pr-4">{r.proficient}</td>
                          <td className="text-white/40 py-2">{r.developing}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {generated.ai_notes && (
              <div className="border border-white/8 rounded-xl p-4 bg-white/2">
                <p className="text-[11px] font-black text-white/30 uppercase tracking-widest mb-1.5">AI Design Notes</p>
                <p className="text-xs text-white/40">{generated.ai_notes}</p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}