import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, ArrowLeft, Sparkles, RefreshCw, Save, Printer, Download,
  Upload, Plus, AlertCircle, CheckCircle, Clock, Users, BookOpen
} from 'lucide-react';

const inp = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a0f1e]/20 bg-white";
const lbl = "block text-xs font-black text-gray-500 mb-1.5 uppercase tracking-widest";

const SCHEDULE_QUESTIONS = [
  { section: 'School Day Structure', fields: [
    { key: 'start_time', label: 'School Start Time', type: 'time' },
    { key: 'end_time', label: 'School End Time', type: 'time' },
    { key: 'class_duration', label: 'Class Duration (minutes)', type: 'number', placeholder: '45' },
    { key: 'transition_time', label: 'Transition / Passing Time (minutes)', type: 'number', placeholder: '5' },
    { key: 'lunch_duration', label: 'Lunch Duration (minutes)', type: 'number', placeholder: '30' },
    { key: 'recess_duration', label: 'Recess Duration (minutes)', type: 'number', placeholder: '20' },
    { key: 'intervention_block', label: 'Intervention Block (minutes)', type: 'number', placeholder: '45' },
    { key: 'advisory_block', label: 'Advisory / Homeroom (minutes)', type: 'number', placeholder: '20' },
  ]},
  { section: 'Grade & Staffing Info', fields: [
    { key: 'num_grade_levels', label: 'Number of Grade Levels', type: 'number', placeholder: '5' },
    { key: 'num_classrooms', label: 'Number of Classrooms', type: 'number', placeholder: '20' },
    { key: 'num_teachers', label: 'Number of Teachers', type: 'number', placeholder: '20' },
    { key: 'num_specials_teachers', label: 'Number of Specials Teachers', type: 'number', placeholder: '4' },
    { key: 'num_interventionists', label: 'Number of Interventionists', type: 'number', placeholder: '2' },
    { key: 'students_per_class', label: 'Average Students per Class', type: 'number', placeholder: '25' },
  ]},
  { section: 'Instructional Minutes', fields: [
    { key: 'ela_minutes', label: 'ELA Minutes per Day', type: 'number', placeholder: '90' },
    { key: 'math_minutes', label: 'Math Minutes per Day', type: 'number', placeholder: '60' },
    { key: 'science_minutes', label: 'Science Minutes per Day', type: 'number', placeholder: '45' },
    { key: 'writing_minutes', label: 'Writing Minutes per Day', type: 'number', placeholder: '30' },
    { key: 'intervention_minutes', label: 'Intervention Minutes per Day', type: 'number', placeholder: '45' },
    { key: 'specials_minutes', label: 'Specials Minutes per Day', type: 'number', placeholder: '45' },
  ]},
];

export default function MasterXschedulePage() {
  const [form, setForm] = useState({});
  const [generating, setGenerating] = useState(false);
  const [schedule, setSchedule] = useState(null);
  const [conflicts, setConflicts] = useState([]);
  const [mode, setMode] = useState('setup'); // setup | generated

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleGenerate = async () => {
    setGenerating(true);
    const prompt = `You are an expert school scheduling consultant. Generate a comprehensive master schedule based on these parameters:

School Day: ${form.start_time} - ${form.end_time}
Class Duration: ${form.class_duration} min | Transition: ${form.transition_time} min
Lunch: ${form.lunch_duration} min | Recess: ${form.recess_duration} min
Intervention Block: ${form.intervention_block} min
Grade Levels: ${form.num_grade_levels} | Classrooms: ${form.num_classrooms}
Teachers: ${form.num_teachers} | Specials Teachers: ${form.num_specials_teachers}
Interventionists: ${form.num_interventionists}
Students per class: ${form.students_per_class}

Daily Minutes Required:
ELA: ${form.ela_minutes} min | Math: ${form.math_minutes} min | Science: ${form.science_minutes} min
Writing: ${form.writing_minutes} min | Intervention: ${form.intervention_minutes} min | Specials: ${form.specials_minutes} min

Generate:
1. A master schedule overview (time blocks for each grade)
2. Teacher schedule template
3. Specials rotation schedule
4. Intervention schedule
5. List of any detected conflicts or issues
6. Compliance notes (are instructional minute requirements met?)

Format clearly with time blocks. Flag any conflicts with [CONFLICT] and missing minutes with [WARNING].`;

    const result = await base44.integrations.Core.InvokeLLM({ prompt, model: 'claude_sonnet_4_6' });
    setSchedule(result);

    // Extract conflicts
    const conflictLines = result.split('\n').filter(l => l.includes('[CONFLICT]') || l.includes('[WARNING]'));
    setConflicts(conflictLines);
    setMode('generated');
    setGenerating(false);
  };

  return (
    <div className="min-h-screen bg-[#f8f8f8]" style={{ fontFamily: 'Arial, sans-serif' }}>
      <div className="bg-[#0a0f1e] px-8 py-10">
        <div className="max-w-6xl mx-auto">
          <Link to="/goaled" className="flex items-center gap-1 text-white/30 text-xs font-black uppercase tracking-widest mb-2 hover:text-white/60 transition-colors">
            <ArrowLeft className="w-3 h-3" /> Goaled Xschool™
          </Link>
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-black text-white">Master Xschedule</h1>
              <p className="text-white/40 mt-1 text-sm">AI-powered master scheduling engine for your school.</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setMode('setup')}
                className={`px-4 py-2 rounded-xl text-sm font-black transition-all ${mode === 'setup' ? 'bg-white text-[#0a0f1e]' : 'text-white/50 hover:text-white hover:bg-white/10'}`}>
                Setup
              </button>
              <button onClick={() => mode === 'generated' && setMode('generated')}
                className={`px-4 py-2 rounded-xl text-sm font-black transition-all ${mode === 'generated' ? 'bg-white text-[#0a0f1e]' : 'text-white/30'}`}>
                Generated Schedule
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-8">
        {mode === 'setup' && (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              {SCHEDULE_QUESTIONS.map(section => (
                <div key={section.section} className="bg-white rounded-2xl border border-gray-100 p-6">
                  <p className="font-black text-[#0a0f1e] mb-4">{section.section}</p>
                  <div className="grid grid-cols-2 gap-4">
                    {section.fields.map(f => (
                      <div key={f.key}>
                        <label className={lbl}>{f.label}</label>
                        <input
                          type={f.type || 'text'}
                          className={inp}
                          placeholder={f.placeholder || ''}
                          value={form[f.key] || ''}
                          onChange={e => set(f.key, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <p className="font-black text-[#0a0f1e] mb-2">Additional Notes</p>
                <p className="text-xs text-gray-400 mb-3">Special scheduling considerations, school model requirements, etc.</p>
                <textarea className={inp + " min-h-[80px] resize-none"} placeholder="e.g. Montessori work cycle, co-teaching periods, bilingual program blocks..."
                  value={form.notes || ''} onChange={e => set('notes', e.target.value)} />
              </div>

              <div className="flex items-center gap-3">
                <button onClick={handleGenerate} disabled={generating}
                  className="flex items-center gap-2 px-8 py-3.5 bg-[#0a0f1e] text-white rounded-xl font-black text-sm hover:bg-[#1a2033] transition-all">
                  {generating ? <><RefreshCw className="w-4 h-4 animate-spin" />Generating Schedule...</> : <><Sparkles className="w-4 h-4" />Generate Master Schedule</>}
                </button>
                <button className="flex items-center gap-2 px-5 py-3.5 border border-gray-200 text-gray-600 rounded-xl font-black text-sm hover:bg-gray-50 transition-all">
                  <Save className="w-4 h-4" /> Save
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-[#0a0f1e] rounded-2xl p-5">
                <p className="text-white/40 text-xs font-black uppercase tracking-widest mb-3">AI Schedule Generator</p>
                <p className="text-white/60 text-xs leading-relaxed">Fill out the scheduling parameters and the AI will generate a complete master schedule including teacher schedules, specials rotations, and intervention blocks.</p>
                <div className="mt-4 space-y-2">
                  {['School-wide master schedule', 'Teacher schedule templates', 'Specials rotation', 'Intervention blocks', 'Conflict detection', 'Compliance check'].map(item => (
                    <div key={item} className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-white/30" />
                      <span className="text-white/40 text-xs">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <label className="flex items-center gap-2 p-4 bg-white border border-dashed border-gray-200 rounded-2xl cursor-pointer hover:border-[#0a0f1e] transition-all">
                <Upload className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm font-black text-[#0a0f1e]">Upload Existing Schedule</p>
                  <p className="text-xs text-gray-400">PDF, Excel, Word, CSV</p>
                </div>
                <input type="file" className="hidden" />
              </label>
            </div>
          </div>
        )}

        {mode === 'generated' && schedule && (
          <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h2 className="text-xl font-black text-[#0a0f1e]">Generated Master Schedule</h2>
                <p className="text-gray-400 text-sm">AI-generated based on your school parameters.</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setMode('setup')} className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-600 rounded-xl font-black text-sm hover:bg-gray-50 transition-all">
                  Edit Parameters
                </button>
                <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-600 rounded-xl font-black text-sm hover:bg-gray-50 transition-all">
                  <Printer className="w-4 h-4" /> Print
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-[#0a0f1e] text-white rounded-xl font-black text-sm hover:bg-[#1a2033] transition-all">
                  <Download className="w-4 h-4" /> Export
                </button>
              </div>
            </div>

            {conflicts.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <p className="font-black text-amber-800 text-sm">Conflicts & Warnings Detected</p>
                </div>
                {conflicts.map((c, i) => <p key={i} className="text-amber-700 text-xs mt-1">{c}</p>)}
              </div>
            )}

            <div className="bg-white rounded-2xl border border-gray-100 p-8">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed font-sans">{schedule}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}