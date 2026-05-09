import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import {
  Flag, FileText, CalendarCheck, Plus, Trash2, CheckCircle2,
  Circle, Clock, AlertCircle, Sparkles, Loader2, ChevronDown, ChevronUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

// ─── Static seed data (local state, no entity needed) ───────────────────────

const INITIAL_MILESTONES = [
  { id: 1, title: 'Submit Letter of Intent', status: 'done', due: '2026-01-15', category: 'Application' },
  { id: 2, title: 'File Articles of Incorporation', status: 'done', due: '2026-02-01', category: 'Legal' },
  { id: 3, title: 'Adopt Initial Board Bylaws', status: 'in_progress', due: '2026-03-10', category: 'Governance' },
  { id: 4, title: 'Submit Charter Application Draft', status: 'in_progress', due: '2026-04-30', category: 'Application' },
  { id: 5, title: 'Board Approval of Academic Plan', status: 'pending', due: '2026-05-15', category: 'Academic' },
  { id: 6, title: 'Authorizer Hearing', status: 'pending', due: '2026-06-10', category: 'Application' },
  { id: 7, title: 'Obtain 501(c)(3) Status', status: 'pending', due: '2026-07-01', category: 'Legal' },
  { id: 8, title: 'Sign Charter Contract', status: 'pending', due: '2026-08-01', category: 'Governance' },
];

const INITIAL_POLICIES = [
  { id: 1, title: 'Board Bylaws', status: 'approved', lastUpdated: '2026-02-10', assignee: 'Legal Counsel' },
  { id: 2, title: 'Conflict of Interest Policy', status: 'review', lastUpdated: '2026-03-05', assignee: 'Governance Committee' },
  { id: 3, title: 'Financial Controls Policy', status: 'draft', lastUpdated: '2026-04-01', assignee: 'Finance Committee' },
  { id: 4, title: 'Student Enrollment Policy', status: 'draft', lastUpdated: '2026-04-15', assignee: 'Academic Team' },
  { id: 5, title: 'Employee Handbook', status: 'draft', lastUpdated: '2026-04-20', assignee: 'HR Lead' },
  { id: 6, title: 'Data Privacy Policy', status: 'review', lastUpdated: '2026-04-25', assignee: 'Technology Lead' },
];

const INITIAL_ACTIONS = [
  { id: 1, title: 'Approve Q1 Budget Report', meeting: '2026-05-15 Board Meeting', assignee: 'Finance Chair', status: 'open', priority: 'high' },
  { id: 2, title: 'Vote on Academic Calendar', meeting: '2026-05-15 Board Meeting', assignee: 'Full Board', status: 'open', priority: 'high' },
  { id: 3, title: 'Review Enrollment Projections', meeting: '2026-05-15 Board Meeting', assignee: 'Founder/CEO', status: 'in_progress', priority: 'medium' },
  { id: 4, title: 'Ratify Staff Hiring Plan', meeting: '2026-06-12 Board Meeting', assignee: 'Governance Chair', status: 'open', priority: 'medium' },
  { id: 5, title: 'Approve Facility Lease Terms', meeting: '2026-06-12 Board Meeting', assignee: 'Operations Lead', status: 'open', priority: 'high' },
  { id: 6, title: 'Present Community Outreach Report', meeting: '2026-04-10 Board Meeting', assignee: 'Founder/CEO', status: 'done', priority: 'low' },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const STATUS_MILESTONE = {
  done: { label: 'Complete', color: 'text-white/70', bg: 'bg-white/10', icon: CheckCircle2 },
  in_progress: { label: 'In Progress', color: 'text-white/60', bg: 'bg-white/6', icon: Clock },
  pending: { label: 'Pending', color: 'text-white/30', bg: 'bg-white/3', icon: Circle },
};

const STATUS_POLICY = {
  approved: { label: 'Approved', color: 'text-green-400/70', bg: 'bg-green-400/10' },
  review: { label: 'In Review', color: 'text-yellow-400/70', bg: 'bg-yellow-400/10' },
  draft: { label: 'Draft', color: 'text-white/40', bg: 'bg-white/5' },
};

const PRIORITY_ACTION = {
  high: { label: 'High', color: 'text-red-400/70', bg: 'bg-red-400/10' },
  medium: { label: 'Medium', color: 'text-yellow-400/70', bg: 'bg-yellow-400/10' },
  low: { label: 'Low', color: 'text-white/30', bg: 'bg-white/5' },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function AddRowForm({ fields, onAdd, onCancel }) {
  const [vals, setVals] = useState(() => Object.fromEntries(fields.map(f => [f.key, f.default || ''])));
  return (
    <div className="border border-white/10 rounded-xl p-4 bg-white/3 mt-2 space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {fields.map(f => (
          <div key={f.key}>
            <label className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1 block">{f.label}</label>
            {f.type === 'select' ? (
              <select value={vals[f.key]} onChange={e => setVals(v => ({ ...v, [f.key]: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30">
                {f.options.map(o => <option key={o.value} value={o.value} className="bg-black">{o.label}</option>)}
              </select>
            ) : (
              <input type={f.type || 'text'} value={vals[f.key]} onChange={e => setVals(v => ({ ...v, [f.key]: e.target.value }))}
                placeholder={f.placeholder}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/30" />
            )}
          </div>
        ))}
      </div>
      <div className="flex gap-2 justify-end">
        <Button onClick={onCancel} variant="ghost" className="text-white/30 hover:text-white text-xs h-7 px-3">Cancel</Button>
        <Button onClick={() => { onAdd(vals); onCancel(); }} className="bg-white text-black text-xs font-black h-7 px-4 hover:bg-white/90 rounded-full">Add</Button>
      </div>
    </div>
  );
}

// ─── Tab: Charter Milestones ──────────────────────────────────────────────────

function MilestonesTab() {
  const [milestones, setMilestones] = useState(INITIAL_MILESTONES);
  const [adding, setAdding] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const toggle = (id) => {
    setMilestones(ms => ms.map(m => m.id === id
      ? { ...m, status: m.status === 'done' ? 'in_progress' : m.status === 'in_progress' ? 'pending' : 'done' }
      : m));
  };

  const remove = (id) => setMilestones(ms => ms.filter(m => m.id !== id));

  const addMilestone = (vals) => {
    setMilestones(ms => [...ms, { id: Date.now(), ...vals, status: 'pending' }]);
  };

  const aiSuggest = async () => {
    setAiLoading(true);
    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a charter school authorization expert. List 5 critical charter school founding milestones that a new founder might be missing. For each, provide a title and category (Application, Legal, Governance, or Academic). Return as JSON array: [{"title": "...", "category": "...", "due": "2026-XX-XX"}]`,
        response_json_schema: {
          type: 'object',
          properties: { milestones: { type: 'array', items: { type: 'object' } } }
        }
      });
      const suggestions = res.milestones || [];
      setMilestones(ms => [...ms, ...suggestions.map((s, i) => ({ id: Date.now() + i, status: 'pending', ...s }))]);
      toast.success(`${suggestions.length} AI milestones added!`);
    } catch { toast.error('AI suggestion failed'); }
    setAiLoading(false);
  };

  const done = milestones.filter(m => m.status === 'done').length;
  const pct = Math.round((done / milestones.length) * 100);

  return (
    <div className="space-y-5">
      {/* Progress bar */}
      <div className="border border-white/8 rounded-xl p-5 bg-white/2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-black text-white/50">Charter Progress</span>
          <span className="text-xl font-black text-white">{pct}%</span>
        </div>
        <div className="h-2 bg-white/8 rounded-full">
          <div className="h-full bg-white rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
        <div className="flex gap-4 mt-3 text-[10px] text-white/30 font-black uppercase tracking-widest">
          <span>{done} Complete</span>
          <span>{milestones.filter(m => m.status === 'in_progress').length} In Progress</span>
          <span>{milestones.filter(m => m.status === 'pending').length} Pending</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-2 justify-end">
        <Button onClick={aiSuggest} disabled={aiLoading} variant="outline"
          className="border-white/10 text-white/60 text-xs h-8 px-3 hover:bg-white/5 rounded-full">
          {aiLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <><Sparkles className="w-3.5 h-3.5" /> AI Suggest</>}
        </Button>
        <Button onClick={() => setAdding(a => !a)} className="bg-white text-black text-xs font-black h-8 px-4 hover:bg-white/90 rounded-full">
          <Plus className="w-3.5 h-3.5" /> Add Milestone
        </Button>
      </div>

      {adding && (
        <AddRowForm
          fields={[
            { key: 'title', label: 'Milestone Title', placeholder: 'e.g. Submit Charter Draft' },
            { key: 'category', label: 'Category', type: 'select', options: [
              { value: 'Application', label: 'Application' }, { value: 'Legal', label: 'Legal' },
              { value: 'Governance', label: 'Governance' }, { value: 'Academic', label: 'Academic' }
            ]},
            { key: 'due', label: 'Due Date', type: 'date' },
          ]}
          onAdd={addMilestone}
          onCancel={() => setAdding(false)}
        />
      )}

      {/* List */}
      <div className="space-y-2">
        {milestones.map(m => {
          const S = STATUS_MILESTONE[m.status];
          const Icon = S.icon;
          return (
            <div key={m.id} className={`flex items-center gap-3 border border-white/6 rounded-xl px-4 py-3 ${S.bg} transition-all`}>
              <button onClick={() => toggle(m.id)} className="flex-shrink-0">
                <Icon className={`w-4 h-4 ${S.color}`} />
              </button>
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-black ${m.status === 'done' ? 'line-through text-white/30' : 'text-white/80'}`}>{m.title}</div>
                <div className="text-[10px] text-white/25 mt-0.5">{m.category} · Due {m.due}</div>
              </div>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${S.bg} ${S.color} border border-white/8`}>{S.label}</span>
              <button onClick={() => remove(m.id)} className="p-1 rounded hover:bg-white/8 transition-all">
                <Trash2 className="w-3.5 h-3.5 text-white/15 hover:text-white/40" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Tab: Policy Drafts ───────────────────────────────────────────────────────

function PoliciesTab() {
  const [policies, setPolicies] = useState(INITIAL_POLICIES);
  const [adding, setAdding] = useState(false);
  const [generating, setGenerating] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [drafts, setDrafts] = useState({});

  const cycleStatus = (id) => {
    const order = ['draft', 'review', 'approved'];
    setPolicies(ps => ps.map(p => p.id === id
      ? { ...p, status: order[(order.indexOf(p.status) + 1) % order.length] }
      : p));
  };

  const remove = (id) => setPolicies(ps => ps.filter(p => p.id !== id));

  const generateDraft = async (p) => {
    setGenerating(p.id);
    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a charter school policy expert. Write a comprehensive, professional "${p.title}" for a charter school. Include purpose, scope, procedures, and responsibilities. 500–700 words.`,
        model: 'claude_sonnet_4_6'
      });
      setDrafts(d => ({ ...d, [p.id]: res }));
      setExpanded(p.id);
      toast.success('Policy draft generated!');
    } catch { toast.error('Generation failed'); }
    setGenerating(null);
  };

  const addPolicy = (vals) => {
    setPolicies(ps => [...ps, { id: Date.now(), ...vals, status: 'draft', lastUpdated: new Date().toISOString().split('T')[0] }]);
  };

  return (
    <div className="space-y-5">
      <div className="flex gap-2 justify-end">
        <Button onClick={() => setAdding(a => !a)} className="bg-white text-black text-xs font-black h-8 px-4 hover:bg-white/90 rounded-full">
          <Plus className="w-3.5 h-3.5" /> Add Policy
        </Button>
      </div>

      {adding && (
        <AddRowForm
          fields={[
            { key: 'title', label: 'Policy Title', placeholder: 'e.g. Attendance Policy' },
            { key: 'assignee', label: 'Assigned To', placeholder: 'e.g. Governance Committee' },
          ]}
          onAdd={addPolicy}
          onCancel={() => setAdding(false)}
        />
      )}

      <div className="space-y-2">
        {policies.map(p => {
          const S = STATUS_POLICY[p.status];
          const isOpen = expanded === p.id;
          return (
            <div key={p.id} className="border border-white/6 rounded-xl overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3 bg-white/2">
                <FileText className="w-4 h-4 text-white/30 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-black text-white/80">{p.title}</div>
                  <div className="text-[10px] text-white/25 mt-0.5">Assigned: {p.assignee} · Updated {p.lastUpdated}</div>
                </div>
                <button onClick={() => cycleStatus(p.id)} className={`text-[10px] font-black px-2 py-0.5 rounded-full border border-white/8 ${S.bg} ${S.color} cursor-pointer`}>{S.label}</button>
                <Button onClick={() => generateDraft(p)} disabled={generating === p.id} variant="outline"
                  className="border-white/10 text-white/50 text-[11px] font-black h-7 px-2.5 hover:bg-white/5 rounded-lg">
                  {generating === p.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <><Sparkles className="w-3 h-3" /> Draft</>}
                </Button>
                {drafts[p.id] && (
                  <button onClick={() => setExpanded(isOpen ? null : p.id)} className="p-1 rounded hover:bg-white/8">
                    {isOpen ? <ChevronUp className="w-3.5 h-3.5 text-white/30" /> : <ChevronDown className="w-3.5 h-3.5 text-white/30" />}
                  </button>
                )}
                <button onClick={() => remove(p.id)} className="p-1 rounded hover:bg-white/8">
                  <Trash2 className="w-3.5 h-3.5 text-white/15 hover:text-white/40" />
                </button>
              </div>
              {isOpen && drafts[p.id] && (
                <div className="px-4 pb-4 pt-3 border-t border-white/5 bg-white/1">
                  <p className="text-xs text-white/40 leading-relaxed whitespace-pre-wrap max-h-56 overflow-y-auto">{drafts[p.id]}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Tab: Board Meeting Action Items ─────────────────────────────────────────

function ActionItemsTab() {
  const [actions, setActions] = useState(INITIAL_ACTIONS);
  const [adding, setAdding] = useState(false);

  const cycleStatus = (id) => {
    const order = ['open', 'in_progress', 'done'];
    setActions(as => as.map(a => a.id === id
      ? { ...a, status: order[(order.indexOf(a.status) + 1) % order.length] }
      : a));
  };

  const remove = (id) => setActions(as => as.filter(a => a.id !== id));

  const addAction = (vals) => setActions(as => [...as, { id: Date.now(), ...vals, status: 'open' }]);

  // Group by meeting
  const grouped = actions.reduce((acc, a) => {
    (acc[a.meeting] = acc[a.meeting] || []).push(a);
    return acc;
  }, {});

  const STATUS_ACTION = {
    open: { label: 'Open', color: 'text-white/40', icon: Circle },
    in_progress: { label: 'In Progress', color: 'text-yellow-400/70', icon: Clock },
    done: { label: 'Done', color: 'text-white/50', icon: CheckCircle2 },
  };

  return (
    <div className="space-y-5">
      <div className="flex gap-2 justify-end">
        <Button onClick={() => setAdding(a => !a)} className="bg-white text-black text-xs font-black h-8 px-4 hover:bg-white/90 rounded-full">
          <Plus className="w-3.5 h-3.5" /> Add Action Item
        </Button>
      </div>

      {adding && (
        <AddRowForm
          fields={[
            { key: 'title', label: 'Action Item', placeholder: 'e.g. Approve Annual Budget' },
            { key: 'meeting', label: 'Board Meeting', placeholder: 'e.g. 2026-06-12 Board Meeting' },
            { key: 'assignee', label: 'Assigned To', placeholder: 'e.g. Finance Chair' },
            { key: 'priority', label: 'Priority', type: 'select', options: [
              { value: 'high', label: 'High' }, { value: 'medium', label: 'Medium' }, { value: 'low', label: 'Low' }
            ]},
          ]}
          onAdd={addAction}
          onCancel={() => setAdding(false)}
        />
      )}

      <div className="space-y-5">
        {Object.entries(grouped).map(([meeting, items]) => (
          <div key={meeting}>
            <div className="flex items-center gap-2 mb-2">
              <CalendarCheck className="w-3.5 h-3.5 text-white/25" />
              <span className="text-[11px] font-black text-white/30 uppercase tracking-widest">{meeting}</span>
              <div className="flex-1 h-px bg-white/5" />
              <span className="text-[10px] text-white/20">{items.filter(i => i.status === 'done').length}/{items.length} done</span>
            </div>
            <div className="space-y-2">
              {items.map(a => {
                const S = STATUS_ACTION[a.status];
                const Icon = S.icon;
                const P = PRIORITY_ACTION[a.priority];
                return (
                  <div key={a.id} className={`flex items-center gap-3 border border-white/6 rounded-xl px-4 py-3 ${a.status === 'done' ? 'bg-white/1 opacity-60' : 'bg-white/2'} transition-all`}>
                    <button onClick={() => cycleStatus(a.id)} className="flex-shrink-0">
                      <Icon className={`w-4 h-4 ${S.color}`} />
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm font-black ${a.status === 'done' ? 'line-through text-white/30' : 'text-white/80'}`}>{a.title}</div>
                      <div className="text-[10px] text-white/25 mt-0.5">Assigned: {a.assignee}</div>
                    </div>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border border-white/8 ${P.bg} ${P.color}`}>{P.label}</span>
                    <span className={`text-[10px] font-black ${S.color}`}>{S.label}</span>
                    <button onClick={() => remove(a.id)} className="p-1 rounded hover:bg-white/8">
                      <Trash2 className="w-3.5 h-3.5 text-white/15 hover:text-white/40" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const TABS = [
  { id: 'milestones', label: 'Charter Milestones', icon: Flag },
  { id: 'policies', label: 'Policy Drafts', icon: FileText },
  { id: 'actions', label: 'Board Action Items', icon: CalendarCheck },
];

export default function FoundaitionxBoardTracker() {
  const [tab, setTab] = useState('milestones');

  return (
    <div className="min-h-screen text-white">
      {/* Header */}
      <div className="border-b border-white/5 px-8 py-5">
        <div className="flex items-center gap-2 mb-1">
          <AlertCircle className="w-4 h-4 text-white/50" />
          <h1 className="font-black text-lg tracking-tight">Governance Board Tracker</h1>
        </div>
        <p className="text-xs text-white/30">Track charter milestones, policy drafts, and board meeting action items in one command view</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-white/5 px-8 flex gap-1">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-black transition-all border-b-2 -mb-px ${
              tab === id ? 'border-white text-white' : 'border-transparent text-white/30 hover:text-white/60'
            }`}>
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="px-8 py-6">
        {tab === 'milestones' && <MilestonesTab />}
        {tab === 'policies' && <PoliciesTab />}
        {tab === 'actions' && <ActionItemsTab />}
      </div>
    </div>
  );
}