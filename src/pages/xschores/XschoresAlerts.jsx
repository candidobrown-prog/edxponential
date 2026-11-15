import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ShieldAlert, CheckCircle2, Clock, Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';

const RISK_CONFIG = {
  watch: { label: 'Watch', color: 'bg-yellow-100 text-yellow-800', border: 'border-yellow-200', dot: 'bg-yellow-400' },
  concern: { label: 'Concern', color: 'bg-orange-100 text-orange-800', border: 'border-orange-200', dot: 'bg-orange-500' },
  at_risk: { label: 'At Risk', color: 'bg-red-100 text-red-800', border: 'border-red-200', dot: 'bg-red-500' },
  critical: { label: 'Critical', color: 'bg-red-900 text-red-100', border: 'border-red-800', dot: 'bg-red-700' },
};

export default function XschoresAlerts() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('open');
  const [riskFilter, setRiskFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [followUpNotes, setFollowUpNotes] = useState('');
  const queryClient = useQueryClient();

  const { data: alerts = [], isLoading } = useQuery({
    queryKey: ['xschores-alerts-all'],
    queryFn: () => base44.entities.XscoresAlert.list('-created_date', 100),
  });

  const resolveMutation = useMutation({
    mutationFn: ({ id, notes }) => base44.entities.XscoresAlert.update(id, {
      status: 'resolved', reviewed: true, follow_up_notes: notes, reviewed_at: new Date().toISOString()
    }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['xschores-alerts-all'] }); setSelected(null); },
  });

  const filtered = alerts.filter(a => {
    const q = search.toLowerCase();
    const matchSearch = !q || a.student_name?.toLowerCase().includes(q) || a.benchmark_name?.toLowerCase().includes(q);
    const matchStatus = statusFilter === 'all' || a.status === statusFilter;
    const matchRisk = riskFilter === 'all' || a.risk_level === riskFilter;
    return matchSearch && matchStatus && matchRisk;
  });

  const openCount = alerts.filter(a => a.status === 'open').length;
  const criticalCount = alerts.filter(a => a.risk_level === 'critical' && a.status === 'open').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black">Alerts</h1>
          <p className="text-muted-foreground mt-1">Track, review, and resolve student risk alerts</p>
        </div>
        <div className="flex gap-3">
          {openCount > 0 && <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-2 text-center"><p className="text-red-700 font-black text-lg leading-none">{openCount}</p><p className="text-red-500 text-xs">Open</p></div>}
          {criticalCount > 0 && <div className="bg-red-900 rounded-xl px-4 py-2 text-center"><p className="text-white font-black text-lg leading-none">{criticalCount}</p><p className="text-red-300 text-xs">Critical</p></div>}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input className="pl-10 rounded-xl" placeholder="Search by student or alert type..." value={search} onChange={e => setSearch(e.target.value)} />
          {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2"><X className="w-4 h-4 text-muted-foreground" /></button>}
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-36 rounded-xl"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="escalated">Escalated</SelectItem>
          </SelectContent>
        </Select>
        <Select value={riskFilter} onValueChange={setRiskFilter}>
          <SelectTrigger className="w-36 rounded-xl"><SelectValue placeholder="Risk Level" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            {Object.entries(RISK_CONFIG).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Alerts list */}
      {isLoading ? (
        <div className="p-12 text-center text-muted-foreground">Loading alerts...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-border rounded-2xl p-12 text-center">
          <CheckCircle2 className="w-10 h-10 text-green-400 mx-auto mb-3" />
          <p className="font-bold text-muted-foreground">No alerts match your filters.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(alert => {
            const risk = RISK_CONFIG[alert.risk_level] || RISK_CONFIG.concern;
            return (
              <div key={alert.id} className={`bg-white border-2 rounded-2xl p-5 ${risk.border} hover:shadow-md transition-all`}>
                <div className="flex items-start gap-4">
                  <span className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${risk.dot}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div>
                        <p className="font-black text-base">{alert.student_name} <span className="text-muted-foreground font-normal text-sm">— Grade {alert.grade}</span></p>
                        <p className="text-sm font-bold text-foreground/80 mt-0.5">{alert.benchmark_name}</p>
                        <p className="text-sm text-muted-foreground mt-1">{alert.trigger_description}</p>
                        {alert.current_value != null && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Current: <strong>{alert.current_value}</strong> · Threshold: <strong>{alert.threshold_value}</strong>
                          </p>
                        )}
                        {alert.recommended_action && (
                          <p className="text-xs text-foreground/70 mt-1.5 italic bg-muted px-3 py-1.5 rounded-lg inline-block">→ {alert.recommended_action}</p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${risk.color}`}>{risk.label}</span>
                        <span className={`text-xs px-2 py-1 rounded-lg font-medium ${alert.status === 'resolved' ? 'bg-green-100 text-green-700' : alert.status === 'open' ? 'bg-gray-100 text-gray-600' : 'bg-blue-100 text-blue-700'}`}>
                          {alert.status}
                        </span>
                        {alert.created_date && <span className="text-xs text-muted-foreground">{format(new Date(alert.created_date), 'MMM d, h:mm a')}</span>}
                      </div>
                    </div>
                    {alert.status !== 'resolved' && (
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" onClick={() => { setSelected(alert); setFollowUpNotes(''); }} className="rounded-lg bg-foreground text-background hover:bg-foreground/90 h-8 text-xs">
                          <CheckCircle2 className="w-3 h-3 mr-1" /> Resolve
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => base44.entities.XscoresAlert.update(alert.id, { status: 'in_progress' }).then(() => queryClient.invalidateQueries({ queryKey: ['xschores-alerts-all'] }))} className="rounded-lg h-8 text-xs">
                          <Clock className="w-3 h-3 mr-1" /> Mark In Progress
                        </Button>
                      </div>
                    )}
                    {alert.follow_up_notes && <p className="text-xs text-muted-foreground mt-2 italic bg-muted px-3 py-1.5 rounded-lg">Follow-up: {alert.follow_up_notes}</p>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Resolve Dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle className="font-black">Resolve Alert</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-4 mt-2">
              <div className="bg-muted rounded-xl p-4 text-sm">
                <p className="font-bold">{selected.student_name} — {selected.benchmark_name}</p>
                <p className="text-muted-foreground mt-1">{selected.trigger_description}</p>
              </div>
              <div className="space-y-1">
                <Label>Follow-up Notes</Label>
                <Textarea placeholder="Document what action was taken..." value={followUpNotes} onChange={e => setFollowUpNotes(e.target.value)} className="min-h-[80px]" />
              </div>
              <Button className="w-full rounded-xl" onClick={() => resolveMutation.mutate({ id: selected.id, notes: followUpNotes })} disabled={resolveMutation.isPending}>
                {resolveMutation.isPending ? 'Resolving...' : 'Mark Resolved'}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}