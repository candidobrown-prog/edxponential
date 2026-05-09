import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Sparkles, Brain, Copy, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

const GOAL_AREAS = [
  'reading_comprehension', 'reading_fluency', 'math_computation', 'problem_solving',
  'writing_organization', 'communication', 'social_skills', 'emotional_regulation',
  'executive_functioning', 'speech_language', 'occupational_therapy', 'behavioral',
];

const DISABILITIES = [
  'specific_learning_disability', 'speech_language_impairment', 'autism',
  'other_health_impairment', 'emotional_disturbance', 'intellectual_disability',
  'developmental_delay', 'multiple_disabilities',
];

export default function SpedAIGenerator() {
  const [mode, setMode] = useState('goal'); // goal | iep | comment | plan
  const [form, setForm] = useState({
    student_name: '', grade: '', disability: '', goal_area: '', baseline: '',
    grade_level_reading: '', services: '', strengths: '', needs: '',
  });
  const [generated, setGenerated] = useState('');
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const MODES = [
    { value: 'goal', label: 'SMART Goal' },
    { value: 'iep', label: 'IEP Present Levels' },
    { value: 'comment', label: 'Progress Comment' },
    { value: 'plan', label: 'Intervention Plan' },
  ];

  const generate = async () => {
    setGenerating(true);
    setGenerated('');

    let prompt = '';
    if (mode === 'goal') {
      prompt = `Write a legally compliant, IDEA-aligned SMART IEP goal for:
Student: ${form.student_name || 'a student'}, Grade: ${form.grade || 'elementary'}
Disability: ${form.disability?.replace(/_/g, ' ') || 'learning disability'}
Goal Area: ${form.goal_area?.replace(/_/g, ' ') || 'reading'}
Baseline: ${form.baseline || 'not specified'}

Include: measurable condition, student name, target skill, criteria (%), timeframe, and measurement method. Write in legal IEP format.`;
    } else if (mode === 'iep') {
      prompt = `Write a comprehensive Present Levels of Academic Achievement and Functional Performance (PLAAFP) statement for:
Student: ${form.student_name || 'a student'}, Grade: ${form.grade}
Disability: ${form.disability?.replace(/_/g, ' ')}
Strengths: ${form.strengths || 'not provided'}
Areas of Need: ${form.needs || 'not provided'}
Current Reading Level: ${form.grade_level_reading || 'not specified'}

Write in professional IEP language covering academic performance, functional performance, how the disability affects general education, and parent input summary. 2-3 paragraphs.`;
    } else if (mode === 'comment') {
      prompt = `Write a professional IEP progress report comment for:
Student: ${form.student_name || 'a student'}, Grade: ${form.grade}
Goal Area: ${form.goal_area?.replace(/_/g, ' ') || 'reading'}
Current Progress: ${form.baseline || 'making progress'}
Services Receiving: ${form.services || 'specialized instruction'}

Write a 2-3 sentence progress comment that is specific, strength-based, data-referenced, and family-friendly. Avoid jargon.`;
    } else {
      prompt = `Create a focused intervention plan for:
Student: ${form.student_name || 'a student'}, Grade: ${form.grade}
Disability: ${form.disability?.replace(/_/g, ' ')}
Target Area: ${form.goal_area?.replace(/_/g, ' ')}
Current Performance: ${form.baseline || 'below grade level'}

Include: goal summary, 3-4 specific intervention strategies, frequency/duration recommendations, progress monitoring method, and family support suggestions. Professional educator format.`;
    }

    const result = await base44.integrations.Core.InvokeLLM({
      model: 'claude_sonnet_4_6',
      prompt,
    });
    setGenerated(result);
    setGenerating(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generated);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-black">AI IEP Generator</h1>
        <p className="text-gray-400 text-sm mt-0.5">Generate IDEA-compliant IEP content using advanced AI</p>
      </div>

      {/* Mode Selector */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {MODES.map(m => (
          <button key={m.value} onClick={() => { setMode(m.value); setGenerated(''); }}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${mode === m.value ? 'bg-black text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-black'}`}>
            {m.label}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Input Form */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <p className="font-black text-sm text-black mb-4">Student Information</p>
          <div className="space-y-3">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Student Name</label>
              <Input value={form.student_name} onChange={e => setForm(p => ({ ...p, student_name: e.target.value }))} placeholder="e.g., Jordan Smith" className="rounded-xl" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Grade</label>
              <Input value={form.grade} onChange={e => setForm(p => ({ ...p, grade: e.target.value }))} placeholder="e.g., 4th" className="rounded-xl" />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Disability Classification</label>
              <Select value={form.disability} onValueChange={v => setForm(p => ({ ...p, disability: v }))}>
                <SelectTrigger className="rounded-xl"><SelectValue placeholder="Select disability" /></SelectTrigger>
                <SelectContent>
                  {DISABILITIES.map(d => <SelectItem key={d} value={d}>{d.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            {(mode === 'goal' || mode === 'comment' || mode === 'plan') && (
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Goal / Target Area</label>
                <Select value={form.goal_area} onValueChange={v => setForm(p => ({ ...p, goal_area: v }))}>
                  <SelectTrigger className="rounded-xl"><SelectValue placeholder="Select area" /></SelectTrigger>
                  <SelectContent>
                    {GOAL_AREAS.map(a => <SelectItem key={a} value={a}>{a.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            )}
            {(mode === 'goal' || mode === 'comment' || mode === 'plan') && (
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">
                  {mode === 'comment' ? 'Current Progress' : 'Baseline Data'}
                </label>
                <textarea value={form.baseline} onChange={e => setForm(p => ({ ...p, baseline: e.target.value }))}
                  placeholder={mode === 'comment' ? 'e.g., student is meeting benchmark on 3 of 5 objectives' : 'e.g., reads 45 WPM, grade level is 90 WPM'}
                  className="w-full border border-input rounded-xl p-3 text-sm min-h-[60px] resize-y focus:outline-none focus:ring-1 focus:ring-ring" />
              </div>
            )}
            {mode === 'iep' && (
              <>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Strengths</label>
                  <textarea value={form.strengths} onChange={e => setForm(p => ({ ...p, strengths: e.target.value }))}
                    placeholder="e.g., strong verbal skills, motivated, works well 1:1"
                    className="w-full border border-input rounded-xl p-3 text-sm min-h-[60px] resize-y focus:outline-none focus:ring-1 focus:ring-ring" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Areas of Need</label>
                  <textarea value={form.needs} onChange={e => setForm(p => ({ ...p, needs: e.target.value }))}
                    placeholder="e.g., decoding, reading fluency, written expression"
                    className="w-full border border-input rounded-xl p-3 text-sm min-h-[60px] resize-y focus:outline-none focus:ring-1 focus:ring-ring" />
                </div>
              </>
            )}
            {mode === 'comment' && (
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1">Services Receiving</label>
                <Input value={form.services} onChange={e => setForm(p => ({ ...p, services: e.target.value }))}
                  placeholder="e.g., 60 min/week specialized reading instruction" className="rounded-xl" />
              </div>
            )}
          </div>
          <Button onClick={generate} disabled={generating} className="w-full bg-black text-white rounded-xl font-black mt-4 gap-2">
            {generating ? <><Loader2 className="w-4 h-4 animate-spin" />Generating...</> : <><Sparkles className="w-4 h-4" />Generate with AI</>}
          </Button>
        </div>

        {/* Output */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <p className="font-black text-sm text-black">Generated Content</p>
            {generated && (
              <Button size="sm" variant="outline" onClick={copyToClipboard} className="rounded-lg text-xs font-bold gap-1">
                {copied ? <><CheckCircle className="w-3 h-3 text-emerald-500" />Copied!</> : <><Copy className="w-3 h-3" />Copy</>}
              </Button>
            )}
          </div>
          {generating ? (
            <div className="flex-1 flex items-center justify-center flex-col gap-3">
              <div className="w-10 h-10 border-4 border-black/10 border-t-black rounded-full animate-spin" />
              <p className="text-gray-400 text-sm font-bold">AI is writing your content...</p>
              <p className="text-gray-300 text-xs">Using Claude for IDEA compliance</p>
            </div>
          ) : generated ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1">
              <div className="bg-gray-50 rounded-xl p-4 h-full min-h-[300px]">
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{generated}</p>
              </div>
            </motion.div>
          ) : (
            <div className="flex-1 flex items-center justify-center flex-col gap-3 text-gray-300">
              <Brain className="w-12 h-12" />
              <p className="text-sm font-bold">Fill in the form and click Generate</p>
              <p className="text-xs text-center max-w-xs">AI will produce IDEA-compliant, professionally formatted special education content</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}