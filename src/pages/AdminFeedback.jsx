import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { MessageSquare, Filter, CheckCircle, Clock, Wrench, XCircle, Loader2, BarChart3, TrendingUp, AlertTriangle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const STATUS_CONFIG = {
  new: { label: 'New', color: 'bg-blue-100 text-blue-700' },
  reviewing: { label: 'Reviewing', color: 'bg-yellow-100 text-yellow-700' },
  assigned: { label: 'Assigned', color: 'bg-purple-100 text-purple-700' },
  in_progress: { label: 'In Progress', color: 'bg-orange-100 text-orange-700' },
  fixed: { label: 'Fixed', color: 'bg-green-100 text-green-700' },
  closed: { label: 'Closed', color: 'bg-gray-100 text-gray-500' },
};

const SEVERITY_COLOR = {
  low: 'bg-gray-100 text-gray-600',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-orange-100 text-orange-700',
  critical: 'bg-red-100 text-red-700',
};

export default function AdminFeedback() {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [adminNotes, setAdminNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [aiSummary, setAiSummary] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    base44.entities.PlatformFeedback.list('-created_date', 100)
      .then(data => { setFeedback(data); setLoading(false); });
  }, []);

  const filtered = feedback.filter(f => {
    if (filterStatus !== 'all' && f.status !== filterStatus) return false;
    if (filterType !== 'all' && f.feedback_type !== filterType) return false;
    return true;
  });

  const stats = {
    total: feedback.length,
    new: feedback.filter(f => f.status === 'new').length,
    bugs: feedback.filter(f => f.feedback_type === 'bug_report').length,
    features: feedback.filter(f => f.feedback_type === 'feature_request').length,
    critical: feedback.filter(f => f.severity === 'critical').length,
  };

  const updateStatus = async (id, status) => {
    await base44.entities.PlatformFeedback.update(id, { status });
    setFeedback(prev => prev.map(f => f.id === id ? { ...f, status } : f));
    if (selected?.id === id) setSelected(prev => ({ ...prev, status }));
  };

  const saveNotes = async () => {
    if (!selected) return;
    setSaving(true);
    await base44.entities.PlatformFeedback.update(selected.id, { admin_notes: adminNotes });
    setFeedback(prev => prev.map(f => f.id === selected.id ? { ...f, admin_notes: adminNotes } : f));
    setSaving(false);
  };

  const generateAISummary = async () => {
    setAiLoading(true);
    try {
      const recentFeedback = feedback.slice(0, 50).map(f =>
        `[${f.feedback_type}] ${f.platform_area}: ${f.description?.slice(0, 100)}`
      ).join('\n');
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze this platform feedback data and generate an executive summary.\n\nFeedback items:\n${recentFeedback}\n\nGenerate a concise summary covering: top issues, most requested features, platform areas needing attention, and overall user sentiment. Format in markdown.`,
        model: 'claude_sonnet_4_6',
      });
      setAiSummary(result);
    } catch (e) {}
    setAiLoading(false);
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-gray-300" /></div>;

  return (
    <div className="min-h-screen bg-[#f8f8f8]" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <div className="bg-[#0a0f1e] px-8 py-10">
        <div className="max-w-7xl mx-auto flex items-start justify-between">
          <div>
            <p className="text-white/40 text-xs font-black uppercase tracking-widest mb-1">Admin · Feedback</p>
            <h1 className="text-3xl font-black text-white">Feedback Dashboard</h1>
            <p className="text-white/50 mt-1 text-sm">Platform-wide user feedback and product improvement tracking.</p>
          </div>
          <Button onClick={generateAISummary} disabled={aiLoading}
            className="bg-white text-[#0a0f1e] hover:bg-gray-100 font-black gap-2 h-11">
            {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            AI Summary
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: 'Total Submissions', value: stats.total, icon: MessageSquare },
            { label: 'New / Unreviewed', value: stats.new, icon: Clock },
            { label: 'Bug Reports', value: stats.bugs, icon: Wrench },
            { label: 'Feature Requests', value: stats.features, icon: TrendingUp },
            { label: 'Critical Issues', value: stats.critical, icon: AlertTriangle },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-100 p-5">
              <Icon className="w-5 h-5 text-gray-400 mb-2" />
              <p className="text-3xl font-black text-[#0a0f1e]">{value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* AI Summary */}
        {aiSummary && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-[#0a0f1e]" />
              <p className="font-black text-[#0a0f1e] text-sm">AI Feedback Analysis</p>
            </div>
            <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{aiSummary}</div>
          </div>
        )}

        <div className="flex gap-6">
          {/* List */}
          <div className="flex-1 bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {/* Filters */}
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
              <Filter className="w-4 h-4 text-gray-400" />
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 outline-none">
                <option value="all">All Status</option>
                {Object.entries(STATUS_CONFIG).map(([v, c]) => <option key={v} value={v}>{c.label}</option>)}
              </select>
              <select value={filterType} onChange={e => setFilterType(e.target.value)}
                className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 outline-none">
                <option value="all">All Types</option>
                <option value="bug_report">Bug Reports</option>
                <option value="feature_request">Feature Requests</option>
                <option value="ux_issue">UX Issues</option>
                <option value="billing_issue">Billing</option>
                <option value="general_feedback">General</option>
              </select>
              <span className="text-xs text-gray-400 ml-auto">{filtered.length} items</span>
            </div>

            <div className="divide-y divide-gray-50 max-h-[560px] overflow-y-auto">
              {filtered.length === 0 ? (
                <p className="text-center text-gray-400 text-sm py-12">No feedback found.</p>
              ) : filtered.map(f => (
                <button key={f.id} onClick={() => { setSelected(f); setAdminNotes(f.admin_notes || ''); }}
                  className={`w-full px-5 py-4 text-left hover:bg-gray-50 transition-all ${selected?.id === f.id ? 'bg-gray-50' : ''}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${STATUS_CONFIG[f.status]?.color || 'bg-gray-100 text-gray-500'}`}>
                          {STATUS_CONFIG[f.status]?.label || f.status}
                        </span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${SEVERITY_COLOR[f.severity] || 'bg-gray-100 text-gray-500'}`}>
                          {f.severity}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-[#0a0f1e] line-clamp-1">{f.description?.slice(0, 80) || 'No description'}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{f.feedback_type?.replace('_', ' ')} · {f.platform_area} · {f.submitter_email || 'anonymous'}</p>
                    </div>
                    <p className="text-xs text-gray-300 flex-shrink-0">{new Date(f.created_date).toLocaleDateString()}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Detail panel */}
          {selected && (
            <div className="w-80 bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-4 self-start">
              <p className="font-black text-[#0a0f1e]">Feedback Detail</p>

              <div className="space-y-2 text-sm">
                <div><span className="text-gray-400 font-bold">From:</span> <span className="text-[#0a0f1e]">{selected.submitter_name || selected.submitter_email || '—'}</span></div>
                <div><span className="text-gray-400 font-bold">Type:</span> <span className="text-[#0a0f1e]">{selected.feedback_type?.replace(/_/g, ' ')}</span></div>
                <div><span className="text-gray-400 font-bold">Area:</span> <span className="text-[#0a0f1e]">{selected.platform_area}</span></div>
                <div><span className="text-gray-400 font-bold">Severity:</span> <span className={`font-bold px-2 py-0.5 rounded-full text-xs ${SEVERITY_COLOR[selected.severity]}`}>{selected.severity}</span></div>
              </div>

              {selected.ai_summary && (
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs font-black text-gray-400 mb-1">AI SUMMARY</p>
                  <p className="text-xs text-gray-700">{selected.ai_summary}</p>
                </div>
              )}

              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs font-black text-gray-400 mb-1">DESCRIPTION</p>
                <p className="text-xs text-gray-700 leading-relaxed">{selected.description}</p>
              </div>

              {selected.suggested_improvement && (
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs font-black text-gray-400 mb-1">SUGGESTION</p>
                  <p className="text-xs text-gray-700">{selected.suggested_improvement}</p>
                </div>
              )}

              <div>
                <p className="text-xs font-black text-gray-400 mb-1">UPDATE STATUS</p>
                <select value={selected.status} onChange={e => updateStatus(selected.id, e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none">
                  {Object.entries(STATUS_CONFIG).map(([v, c]) => <option key={v} value={v}>{c.label}</option>)}
                </select>
              </div>

              <div>
                <p className="text-xs font-black text-gray-400 mb-1">ADMIN NOTES</p>
                <textarea value={adminNotes} onChange={e => setAdminNotes(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none resize-none h-20"
                  placeholder="Internal notes..."
                />
                <Button onClick={saveNotes} disabled={saving} size="sm" className="bg-[#0a0f1e] text-white font-bold mt-2 w-full">
                  {saving ? 'Saving...' : 'Save Notes'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}