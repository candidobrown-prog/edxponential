import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { X, CheckCircle, Loader2, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PLATFORM_AREAS = [
  { value: 'my_xschool', label: 'My Xschool' },
  { value: 'xschetails', label: 'Xschetails' },
  { value: 'xscores', label: 'Xscores' },
  { value: 'pitch_park', label: 'Pitch Park' },
  { value: 'edvisors', label: 'edVisors' },
  { value: 'edvestors', label: 'edVestors' },
  { value: 'twotrx', label: 'TwotrX' },
  { value: 'onejob', label: 'WonJob' },
  { value: 'edxportante', label: 'edXportante' },
  { value: 'tubedx', label: 'TubedX' },
  { value: 'communities', label: 'Communities' },
  { value: 'billing', label: 'Billing' },
  { value: 'enterprise', label: 'Enterprise' },
  { value: 'ai_assistant', label: 'Ask Eddy' },
  { value: 'general', label: 'General' },
];

const FEEDBACK_TYPES = [
  { value: 'bug_report', label: '🐛 Bug Report' },
  { value: 'feature_request', label: '💡 Feature Request' },
  { value: 'ux_issue', label: '🎨 UX Issue' },
  { value: 'platform_suggestion', label: '🚀 Platform Suggestion' },
  { value: 'ai_quality', label: '🤖 AI Quality' },
  { value: 'coaching_feedback', label: '⭐ Coaching Feedback' },
  { value: 'webinar_feedback', label: '📹 Webinar Feedback' },
  { value: 'billing_issue', label: '💳 Billing Issue' },
  { value: 'general_feedback', label: '💬 General Feedback' },
];

export default function FeedbackModal({ user, onClose, platformArea = '' }) {
  const [form, setForm] = useState({
    platform_area: platformArea,
    feedback_type: 'general_feedback',
    severity: 'medium',
    description: '',
    suggested_improvement: '',
    steps_to_reproduce: '',
    browser_device: navigator.userAgent.slice(0, 100),
    priority: 'medium',
  });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const submit = async () => {
    if (!form.description.trim()) return;
    setLoading(true);
    try {
      // AI-categorize
      let ai_summary = '';
      try {
        const res = await base44.integrations.Core.InvokeLLM({
          prompt: `Analyze this platform feedback and return a 1-sentence summary and category.\nType: ${form.feedback_type}\nArea: ${form.platform_area}\nDescription: ${form.description}\n\nReturn JSON: { "summary": "...", "category": "..." }`,
          response_json_schema: { type: 'object', properties: { summary: { type: 'string' }, category: { type: 'string' } } }
        });
        ai_summary = res?.summary || '';
      } catch (e) {}

      await base44.entities.PlatformFeedback.create({
        ...form,
        submitter_email: user?.email || '',
        submitter_name: user?.full_name || '',
        ai_summary,
        status: 'new',
      });
      setDone(true);
    } catch (e) {}
    setLoading(false);
  };

  return (
    <div className="absolute inset-0 bg-white z-20 flex flex-col" style={{ fontFamily: 'Arial, sans-serif' }}>
      <div className="bg-[#0a0f1e] px-5 py-4 flex items-center justify-between flex-shrink-0">
        <p className="text-white font-black text-sm">Share Feedback</p>
        <button onClick={onClose} className="text-white/40 hover:text-white p-1"><X className="w-4 h-4" /></button>
      </div>

      {done ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center">
          <CheckCircle className="w-14 h-14 text-green-500" />
          <p className="font-black text-[#0a0f1e] text-lg">Thank you!</p>
          <p className="text-gray-500 text-sm">Your feedback has been submitted. Our team reviews all submissions to improve the platform.</p>
          <Button onClick={onClose} className="bg-[#0a0f1e] text-white font-bold mt-2">Close</Button>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-black text-gray-500 uppercase tracking-wider block mb-1">Area</label>
              <select value={form.platform_area} onChange={e => set('platform_area', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#0a0f1e]">
                <option value="">Select area</option>
                {PLATFORM_AREAS.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-black text-gray-500 uppercase tracking-wider block mb-1">Type</label>
              <select value={form.feedback_type} onChange={e => set('feedback_type', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#0a0f1e]">
                {FEEDBACK_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-black text-gray-500 uppercase tracking-wider block mb-1">Severity</label>
              <select value={form.severity} onChange={e => set('severity', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#0a0f1e]">
                {['low','medium','high','critical'].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-black text-gray-500 uppercase tracking-wider block mb-1">Priority</label>
              <select value={form.priority} onChange={e => set('priority', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#0a0f1e]">
                {['low','medium','high','urgent'].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-gray-500 uppercase tracking-wider block mb-1">Description *</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)}
              placeholder="Describe your feedback in detail..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#0a0f1e] resize-none h-24"
            />
          </div>

          <div>
            <label className="text-xs font-black text-gray-500 uppercase tracking-wider block mb-1">Suggested Improvement</label>
            <textarea value={form.suggested_improvement} onChange={e => set('suggested_improvement', e.target.value)}
              placeholder="What would make this better?"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#0a0f1e] resize-none h-16"
            />
          </div>

          {form.feedback_type === 'bug_report' && (
            <div>
              <label className="text-xs font-black text-gray-500 uppercase tracking-wider block mb-1">Steps to Reproduce</label>
              <textarea value={form.steps_to_reproduce} onChange={e => set('steps_to_reproduce', e.target.value)}
                placeholder="1. Go to... 2. Click... 3. See error..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#0a0f1e] resize-none h-16"
              />
            </div>
          )}

          <Button onClick={submit} disabled={!form.description.trim() || loading}
            className="w-full bg-[#0a0f1e] text-white font-black h-11 gap-2">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</> : 'Submit Feedback'}
          </Button>
        </div>
      )}
    </div>
  );
}