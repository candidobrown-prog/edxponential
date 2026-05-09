import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { AlertTriangle, AlertCircle, CheckCircle, Clock, Search, Filter, Brain, Sparkles, ArrowRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const RISK_CONFIG = {
  critical: { color: 'bg-red-50 border-red-200', dot: 'bg-red-500', badge: 'bg-red-100 text-red-700', label: 'Critical' },
  at_risk: { color: 'bg-orange-50 border-orange-200', dot: 'bg-orange-500', badge: 'bg-orange-100 text-orange-700', label: 'At Risk' },
  concern: { color: 'bg-amber-50 border-amber-100', dot: 'bg-amber-400', badge: 'bg-amber-100 text-amber-700', label: 'Concern' },
  watch: { color: 'bg-yellow-50 border-yellow-100', dot: 'bg-yellow-400', badge: 'bg-yellow-100 text-yellow-700', label: 'Watch' },
};

export default function DaidaAlerts() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [aiActions, setAiActions] = useState({});
  const [generating, setGenerating] = useState(null);
  const qc = useQueryClient();

  const { data: alerts = [], isLoading } = useQuery({
    queryKey: ['xscores-alerts'],
    queryFn: () => base44.entities.XscoresAlert.list('-created_date', 100),
  });
  const { data: spedStudents = [] } = useQuery({ queryKey: ['sped-students'], queryFn: () => base44.entities.SpedStudent.list('-created_date', 200) });

  const resolveMutation = useMutation({
    mutationFn: (id) => base44.entities.XscoresAlert.update(id, { status: 'resolved', reviewed: true }),
    onSuccess: () => qc.invalidateQueries(['xscores-alerts']),
  });

  const generateAction = async (alert) => {
    setGenerating(alert.id);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `A school alert has been flagged. Provide 3 specific, actionable recommendations for a school leader (2 sentences total max):
Student: ${alert.student_name}, Grade: ${alert.grade}
Alert: ${alert.trigger_description}
Risk Level: ${alert.risk_level}
Category: ${alert.category}`,
    });
    setAiActions(p => ({ ...p, [alert.id]: result }));
    setGenerating(null);
  };

  const filtered = alerts.filter(a => {
    const matchSearch = !search || a.student_name?.toLowerCase().includes(search.toLowerCase()) || a.trigger_description?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || a.risk_level === filter || a.status === filter;
    return matchSearch && matchFilter;
  });

  const openAlerts = alerts.filter(a => a.status === 'open').length;
  const criticalAlerts = alerts.filter(a => a.risk_level === 'critical').length;

  // SPED alerts
  const today = new Date().toISOString().split('T')[0];
  const spedAlerts = [
    ...spedStudents.filter(s => s.iep_end_date && s.iep_end_date < today).map(s => ({
      id: `sped_exp_${s.id}`, type: 'sped', risk_level: 'critical',
      student_name: s.student_name, trigger_description: `IEP expired on ${s.iep_end_date}`, category: 'compliance',
    })),
    ...spedStudents.filter(s => s.compliance_pct && s.compliance_pct < 80).map(s => ({
      id: `sped_cmp_${s.id}`, type: 'sped', risk_level: 'concern',
      student_name: s.student_name, trigger_description: `Service compliance at ${s.compliance_pct}%`, category: 'services',
    })),
  ];

  const allAlerts = [...filtered, ...spedAlerts.filter(sa => !search || sa.student_name?.toLowerCase().includes(search.toLowerCase()))];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-black">Alerts & Action Center</h1>
          <p className="text-gray-400 text-sm mt-0.5">Cross-platform alerts requiring leadership attention</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-xs font-black text-red-700">{openAlerts + spedAlerts.length} Open</span>
          </div>
        </div>
      </div>

      {/* Alert Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Open', value: openAlerts + spedAlerts.length, color: 'bg-[#020205] text-white' },
          { label: 'Critical', value: criticalAlerts + spedAlerts.filter(s => s.risk_level === 'critical').length, color: 'bg-red-50 border border-red-100' },
          { label: 'SPED Alerts', value: spedAlerts.length, color: 'bg-amber-50 border border-amber-100' },
          { label: 'Resolved Today', value: alerts.filter(a => a.status === 'resolved').length, color: 'bg-emerald-50 border border-emerald-100' },
        ].map(({ label, value, color }) => (
          <div key={label} className={`${color} rounded-2xl p-5`}>
            <div className={`text-2xl font-black ${color.includes('text-white') ? 'text-white' : 'text-black'}`}>{value}</div>
            <div className={`text-xs font-bold uppercase tracking-wider mt-1 ${color.includes('text-white') ? 'text-white/50' : 'text-gray-400'}`}>{label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search alerts..." className="pl-9 rounded-xl" />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-40 rounded-xl"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Alerts</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="at_risk">At Risk</SelectItem>
            <SelectItem value="concern">Concern</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Alert List */}
      <div className="space-y-3">
        {/* SPED Alerts first */}
        {spedAlerts.map(a => (
          <motion.div key={a.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className={`border rounded-2xl p-4 ${RISK_CONFIG[a.risk_level]?.color || 'bg-white border-gray-100'}`}>
            <div className="flex items-start gap-4">
              <div className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${RISK_CONFIG[a.risk_level]?.dot}`} />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-black text-sm text-black">{a.student_name}</p>
                  <span className="text-[9px] px-2 py-0.5 rounded-full font-black uppercase bg-purple-100 text-purple-700">SPED</span>
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase ${RISK_CONFIG[a.risk_level]?.badge}`}>
                    {RISK_CONFIG[a.risk_level]?.label}
                  </span>
                </div>
                <p className="text-xs text-gray-600">{a.trigger_description}</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => window.open('/perspedxtives/compliance', '_self')}
                className="text-xs font-bold rounded-lg gap-1 flex-shrink-0">
                View <ArrowRight className="w-3 h-3" />
              </Button>
            </div>
          </motion.div>
        ))}

        {allAlerts.filter(a => !a.type).map(a => {
          const cfg = RISK_CONFIG[a.risk_level] || RISK_CONFIG.watch;
          return (
            <motion.div key={a.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className={`border rounded-2xl p-4 ${cfg.color}`}>
              <div className="flex items-start gap-4">
                <div className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${cfg.dot}`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="font-black text-sm text-black">{a.student_name}</p>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase ${cfg.badge}`}>{cfg.label}</span>
                    {a.category && <span className="text-[9px] px-2 py-0.5 rounded-full font-black uppercase bg-gray-100 text-gray-500">{a.category}</span>}
                    {a.status !== 'open' && <span className="text-[9px] px-2 py-0.5 rounded-full font-black uppercase bg-emerald-100 text-emerald-700">{a.status}</span>}
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{a.trigger_description}</p>
                  {aiActions[a.id] && (
                    <div className="bg-black/5 rounded-xl p-3 mt-2 flex gap-2">
                      <Brain className="w-3.5 h-3.5 text-black/50 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-gray-700">{aiActions[a.id]}</p>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2 flex-shrink-0">
                  {a.status === 'open' && (
                    <>
                      <Button size="sm" onClick={() => generateAction(a)} disabled={generating === a.id} variant="outline"
                        className="text-xs font-bold rounded-lg gap-1">
                        {generating === a.id ? <div className="w-3 h-3 border-2 border-black/20 border-t-black rounded-full animate-spin" /> : <Sparkles className="w-3 h-3" />}
                        AI Action
                      </Button>
                      <Button size="sm" onClick={() => resolveMutation.mutate(a.id)}
                        className="bg-black text-white text-xs font-bold rounded-lg gap-1">
                        <CheckCircle className="w-3 h-3" /> Resolve
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}

        {allAlerts.length === 0 && (
          <div className="text-center py-16">
            <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <p className="font-black text-black">All clear — no active alerts</p>
            <p className="text-gray-400 text-sm mt-1">The platform will automatically flag concerns as they arise</p>
          </div>
        )}
      </div>
    </div>
  );
}