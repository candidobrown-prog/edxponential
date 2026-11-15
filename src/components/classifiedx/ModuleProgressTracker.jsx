import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2, Clock, Edit3, Layers, ChevronDown, ChevronUp,
  Circle, AlertCircle, Sparkles, BarChart3
} from 'lucide-react';

const MODULE_PHASE = {
  finalized: { label: 'Finalized', icon: CheckCircle2, color: 'text-white', bg: 'bg-white/12 border-white/20', dot: 'bg-white' },
  review: { label: 'In Review', icon: AlertCircle, color: 'text-white/60', bg: 'bg-white/6 border-white/12', dot: 'bg-white/50' },
  design: { label: 'Design Phase', icon: Edit3, color: 'text-white/40', bg: 'bg-white/3 border-white/8', dot: 'bg-white/25' },
  draft: { label: 'Draft', icon: Circle, color: 'text-white/20', bg: 'bg-white/1 border-white/5', dot: 'bg-white/12' },
};

// Demo module breakdown per course
const COURSE_MODULES = {
  1: [
    { name: 'Foundations of Classroom Management', phase: 'finalized' },
    { name: 'Building Routines & Procedures', phase: 'finalized' },
    { name: 'Positive Behavior Systems', phase: 'finalized' },
    { name: 'Managing Disruptions', phase: 'finalized' },
    { name: 'Restorative Practices', phase: 'review' },
    { name: 'Family Communication Strategies', phase: 'design' },
  ],
  2: [
    { name: 'Leadership Identity', phase: 'finalized' },
    { name: 'Organizational Strategy', phase: 'finalized' },
    { name: 'Team Building & Culture', phase: 'finalized' },
    { name: 'Data-Driven Decision Making', phase: 'review' },
    { name: 'Change Management', phase: 'design' },
    { name: 'Communication & Influence', phase: 'design' },
    { name: 'Executive Presence', phase: 'draft' },
    { name: 'Capstone Project', phase: 'draft' },
  ],
  3: [
    { name: 'Diagnostic Assessment', phase: 'finalized' },
    { name: 'Number Sense Interventions', phase: 'review' },
    { name: 'Fraction Mastery', phase: 'design' },
    { name: 'Problem Solving Strategies', phase: 'draft' },
  ],
  4: [
    { name: 'Digital Citizenship', phase: 'finalized' },
    { name: 'Productivity Tools', phase: 'finalized' },
    { name: 'Online Safety & Privacy', phase: 'finalized' },
    { name: 'AI for Educators', phase: 'finalized' },
    { name: 'Digital Assessment Tools', phase: 'review' },
  ],
  5: [
    { name: 'Foundations of Coaching', phase: 'finalized' },
    { name: 'Observation & Feedback', phase: 'finalized' },
    { name: 'Instructional Coaching Cycles', phase: 'review' },
    { name: 'Data Conversations', phase: 'design' },
    { name: 'Coaching Resistant Teachers', phase: 'design' },
    { name: 'Co-Teaching Models', phase: 'design' },
    { name: 'Building Trust & Relationships', phase: 'draft' },
    { name: 'Coaching for Equity', phase: 'draft' },
    { name: 'Leadership Coaching', phase: 'draft' },
    { name: 'Capstone Portfolio', phase: 'draft' },
  ],
};

function CourseModuleRow({ course }) {
  const [expanded, setExpanded] = useState(false);
  const modules = COURSE_MODULES[course.id] || [];

  const counts = {
    finalized: modules.filter(m => m.phase === 'finalized').length,
    review: modules.filter(m => m.phase === 'review').length,
    design: modules.filter(m => m.phase === 'design').length,
    draft: modules.filter(m => m.phase === 'draft').length,
  };
  const total = modules.length;
  const pctFinalized = total > 0 ? Math.round((counts.finalized / total) * 100) : 0;

  return (
    <div className="border border-white/8 rounded-xl overflow-hidden">
      <button onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center gap-4 px-5 py-4 hover:bg-white/3 transition-all text-left">
        {/* Course name */}
        <div className="flex-1 min-w-0">
          <div className="font-black text-sm text-white/80 truncate">{course.title}</div>
          <div className="text-[10px] text-white/25 mt-0.5">{total} modules total</div>
        </div>

        {/* Phase badges */}
        <div className="hidden md:flex items-center gap-2 flex-shrink-0">
          {Object.entries(counts).map(([phase, count]) => count > 0 && (
            <span key={phase} className={`flex items-center gap-1 text-[10px] font-black border px-2 py-0.5 rounded-full ${MODULE_PHASE[phase].bg} ${MODULE_PHASE[phase].color}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${MODULE_PHASE[phase].dot}`} />
              {count} {MODULE_PHASE[phase].label}
            </span>
          ))}
        </div>

        {/* Progress bar + pct */}
        <div className="flex-shrink-0 w-32">
          <div className="flex justify-between text-[10px] text-white/25 mb-1">
            <span>Finalized</span><span className="font-black text-white/50">{pctFinalized}%</span>
          </div>
          <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
            <div className="h-full flex">
              <div className="bg-white/70 transition-all" style={{ width: `${(counts.finalized / total) * 100}%` }} />
              <div className="bg-white/30 transition-all" style={{ width: `${(counts.review / total) * 100}%` }} />
              <div className="bg-white/12 transition-all" style={{ width: `${(counts.design / total) * 100}%` }} />
            </div>
          </div>
        </div>

        <div className="flex-shrink-0 text-white/20">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Expanded Module List */}
      {expanded && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
          className="border-t border-white/5 bg-white/1 px-5 py-3 grid grid-cols-1 md:grid-cols-2 gap-1.5">
          {modules.map((mod, i) => {
            const phase = MODULE_PHASE[mod.phase];
            const PhaseIcon = phase.icon;
            return (
              <div key={i} className="flex items-center gap-2.5 py-1.5 px-2 rounded-lg hover:bg-white/3 transition-all">
                <PhaseIcon className={`w-3.5 h-3.5 flex-shrink-0 ${phase.color}`} />
                <span className="text-xs text-white/50 flex-1 truncate">{mod.name}</span>
                <span className={`text-[9px] font-black border px-1.5 py-0.5 rounded-full ${phase.bg} ${phase.color}`}>
                  {phase.label}
                </span>
              </div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}

export default function ModuleProgressTracker({ courses }) {
  const allModules = Object.values(COURSE_MODULES).flat();
  const totalFinalized = allModules.filter(m => m.phase === 'finalized').length;
  const totalReview = allModules.filter(m => m.phase === 'review').length;
  const totalDesign = allModules.filter(m => m.phase === 'design').length;
  const totalDraft = allModules.filter(m => m.phase === 'draft').length;
  const total = allModules.length;

  return (
    <div className="border border-white/8 rounded-2xl bg-white/2 overflow-hidden mb-6">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-white/40" />
          <span className="font-black text-sm text-white">Module Progress Tracker</span>
        </div>
        <div className="text-[11px] text-white/25">{total} total modules across {courses.length} courses</div>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-4 divide-x divide-white/5 border-b border-white/5">
        {[
          { label: 'Finalized', count: totalFinalized, phase: 'finalized' },
          { label: 'In Review', count: totalReview, phase: 'review' },
          { label: 'Design Phase', count: totalDesign, phase: 'design' },
          { label: 'Draft', count: totalDraft, phase: 'draft' },
        ].map(({ label, count, phase }) => {
          const cfg = MODULE_PHASE[phase];
          const PhaseIcon = cfg.icon;
          return (
            <div key={label} className="px-5 py-4">
              <div className="flex items-center gap-1.5 mb-1">
                <PhaseIcon className={`w-3.5 h-3.5 ${cfg.color}`} />
                <span className={`text-[11px] font-black ${cfg.color}`}>{label}</span>
              </div>
              <div className="font-black text-2xl text-white">{count}</div>
              <div className="text-[10px] text-white/20 mt-0.5">{total > 0 ? Math.round((count / total) * 100) : 0}% of total</div>
              <div className="h-0.5 bg-white/5 rounded-full mt-2">
                <div className={`h-full rounded-full ${cfg.dot}`} style={{ width: `${total > 0 ? (count / total) * 100 : 0}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Per-course breakdown */}
      <div className="p-4 space-y-2">
        {courses.map(course => (
          <CourseModuleRow key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}