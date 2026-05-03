import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Zap, Copy, Download, CheckCircle, BookOpen, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const GRADES = ['Kindergarten', '1st Grade', '2nd Grade', '3rd Grade', '4th Grade', '5th Grade', '6th Grade', '7th Grade', '8th Grade', '9th Grade', '10th Grade', '11th Grade', '12th Grade'];
const SUBJECTS = ['ELA / Reading', 'Math', 'Writing', 'Science', 'Social Studies', 'Social-Emotional Learning', 'Special Education', 'ESL / ELL', 'AP English', 'AP Math', 'AP Science', 'Other'];
const CONTENT_TYPES = [
  { key: 'lesson_plan', label: 'Lesson Plan', icon: '📚' },
  { key: 'assessment', label: 'Assessment', icon: '✏️' },
  { key: 'worksheet', label: 'Worksheet', icon: '📄' },
  { key: 'intervention_plan', label: 'Intervention Plan', icon: '🎯' },
  { key: 'student_activity', label: 'Student Activity', icon: '🎲' },
  { key: 'teacher_script', label: 'Teacher Script', icon: '🎭' },
];

export default function ContentGenerator() {
  const [form, setForm] = useState({
    grade_level: '5th Grade',
    subject: 'Math',
    content_type: 'lesson_plan',
    standard: '',
    standard_framework: 'common_core',
    topic: '',
    learning_objective: '',
    student_level: 'on_grade',
  });
  const [generated, setGenerated] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const sel = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a0f1e]/20 focus:border-[#0a0f1e] bg-white";
  const inp = sel;
  const lbl = "block text-xs font-black text-gray-500 mb-1.5 uppercase tracking-widest";

  const handleGenerate = async () => {
    setLoading(true);
    setGenerated(null);
    setSaved(false);
    const typeLabel = CONTENT_TYPES.find(t => t.key === form.content_type)?.label || form.content_type;
    const prompt = `You are an expert instructional designer and veteran classroom teacher. Generate a complete, detailed, and classroom-ready ${typeLabel} with the following specifications:

Grade Level: ${form.grade_level}
Subject: ${form.subject}
Standard Framework: ${form.standard_framework.replace('_', ' ').toUpperCase()}
Standard: ${form.standard || 'Aligned to grade-level standards'}
Topic: ${form.topic || 'General grade-level content'}
Learning Objective: ${form.learning_objective || 'Students will demonstrate mastery of key grade-level skills'}
Student Level: ${form.student_level.replace('_', ' ')}

Requirements:
- Be highly specific and practical — this should be usable immediately in a classroom
- Include timing for each section
- Include differentiation strategies for below, on, and above grade level students
- Include checks for understanding throughout
- Include an exit ticket or assessment component
- If it's a lesson plan, include: Objective, Standards, Materials, Hook/Opening (5-7 min), Direct Instruction, Guided Practice, Independent Practice, Closing/Exit Ticket
- Write in a clear, professional tone that respects teachers as experts
- Format with clear headers and bullet points
- Be comprehensive — this should be at least 500 words

Generate the complete ${typeLabel} now:`;

    try {
      const result = await base44.integrations.Core.InvokeLLM({ prompt, model: 'claude_sonnet_4_6' });
      setGenerated(result);
    } catch (e) {
      setGenerated('Error generating content. Please try again.');
    }
    setLoading(false);
  };

  const handleSave = async () => {
    const user = await base44.auth.me();
    await base44.entities.ContentItem.create({
      ...form,
      title: `${form.content_type.replace('_', ' ')} — ${form.subject} ${form.grade_level}${form.topic ? ': ' + form.topic : ''}`,
      content_body: generated,
      source: 'ai_generated',
      creator_email: user.email,
      creator_name: user.full_name,
      status: 'published',
    });
    setSaved(true);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generated || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#f8f8f8]" style={{ fontFamily: 'Arial, sans-serif' }}>
      <div className="bg-[#0a0f1e] px-8 py-10">
        <div className="max-w-6xl mx-auto">
          <p className="text-white/40 text-xs font-black uppercase tracking-widest mb-1">edXportante</p>
          <h1 className="text-3xl font-black text-white">AI Content Generator</h1>
          <p className="text-white/50 mt-1">Generate standards-aligned instructional materials instantly.</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="grid md:grid-cols-5 gap-6">
          {/* Form */}
          <div className="md:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
              <h2 className="font-black text-[#0a0f1e]">Content Parameters</h2>

              <div>
                <label className={lbl}>Content Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {CONTENT_TYPES.map(({ key, label, icon }) => (
                    <button key={key} onClick={() => set('content_type', key)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${form.content_type === key ? 'bg-[#0a0f1e] border-[#0a0f1e] text-white' : 'border-gray-200 hover:border-gray-400'}`}>
                      <span className="text-base">{icon}</span>
                      <p className={`text-xs font-bold mt-0.5 ${form.content_type === key ? 'text-white' : 'text-gray-700'}`}>{label}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className={lbl}>Grade Level</label>
                <select className={sel} value={form.grade_level} onChange={e => set('grade_level', e.target.value)}>
                  {GRADES.map(g => <option key={g}>{g}</option>)}
                </select>
              </div>

              <div>
                <label className={lbl}>Subject</label>
                <select className={sel} value={form.subject} onChange={e => set('subject', e.target.value)}>
                  {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className={lbl}>Student Level</label>
                <div className="flex gap-2">
                  {[['below_grade', 'Below'], ['on_grade', 'On Grade'], ['above_grade', 'Above']].map(([k, l]) => (
                    <button key={k} onClick={() => set('student_level', k)}
                      className={`flex-1 py-2 rounded-xl border text-xs font-black transition-all ${form.student_level === k ? 'bg-[#0a0f1e] border-[#0a0f1e] text-white' : 'border-gray-200 text-gray-600 hover:border-gray-400'}`}>{l}</button>
                  ))}
                </div>
              </div>

              <div>
                <label className={lbl}>Standard Framework</label>
                <select className={sel} value={form.standard_framework} onChange={e => set('standard_framework', e.target.value)}>
                  <option value="common_core">Common Core</option>
                  <option value="state">State Standards</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              <div>
                <label className={lbl}>Specific Standard (optional)</label>
                <input className={inp} value={form.standard} onChange={e => set('standard', e.target.value)} placeholder="e.g. CCSS.ELA-LITERACY.RL.5.1" />
              </div>

              <div>
                <label className={lbl}>Topic</label>
                <input className={inp} value={form.topic} onChange={e => set('topic', e.target.value)} placeholder="e.g. Fractions, Figurative Language..." />
              </div>

              <div>
                <label className={lbl}>Learning Objective</label>
                <textarea className={inp + " min-h-[70px] resize-none"} value={form.learning_objective} onChange={e => set('learning_objective', e.target.value)} placeholder="Students will be able to..." />
              </div>

              <Button onClick={handleGenerate} disabled={loading} className="w-full bg-[#0a0f1e] text-white font-black h-11 gap-2">
                {loading ? <><RefreshCw className="w-4 h-4 animate-spin" />Generating...</> : <><Zap className="w-4 h-4" />Generate Content</>}
              </Button>
            </div>
          </div>

          {/* Output */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-2xl border border-gray-100 min-h-[600px] flex flex-col">
              {!generated && !loading && (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
                  <div className="w-16 h-16 bg-[#f8f8f8] rounded-2xl flex items-center justify-center mb-4">
                    <BookOpen className="w-8 h-8 text-gray-300" />
                  </div>
                  <p className="font-black text-gray-400 text-lg">Ready to generate</p>
                  <p className="text-gray-300 text-sm mt-1">Configure your parameters and click Generate.</p>
                </div>
              )}
              {loading && (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
                  <div className="w-16 h-16 bg-[#0a0f1e] rounded-2xl flex items-center justify-center mb-4 animate-pulse">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <p className="font-black text-[#0a0f1e] text-lg">Generating your content...</p>
                  <p className="text-gray-400 text-sm mt-1">This takes 10–30 seconds for high-quality output.</p>
                </div>
              )}
              {generated && !loading && (
                <>
                  <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <p className="font-black text-[#0a0f1e] text-sm">Generated Content</p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={handleCopy} className="h-8 text-xs font-bold gap-1">
                        {copied ? <><CheckCircle className="w-3 h-3 text-green-500" />Copied</> : <><Copy className="w-3 h-3" />Copy</>}
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleGenerate} className="h-8 text-xs font-bold gap-1">
                        <RefreshCw className="w-3 h-3" />Regenerate
                      </Button>
                      {!saved ? (
                        <Button size="sm" className="bg-[#0a0f1e] text-white font-bold h-8 text-xs gap-1" onClick={handleSave}>
                          <Download className="w-3 h-3" />Save
                        </Button>
                      ) : (
                        <Button size="sm" className="bg-green-600 text-white font-bold h-8 text-xs gap-1" disabled>
                          <CheckCircle className="w-3 h-3" />Saved
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="flex-1 p-6 overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans leading-relaxed">{generated}</pre>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}