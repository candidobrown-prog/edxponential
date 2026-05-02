import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatAmount } from '../components/dealroom/DealCard';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, FileText, ChevronRight } from 'lucide-react';

const STAGES = [
  { key: 'saved', label: 'Saved', color: 'bg-muted text-muted-foreground' },
  { key: 'intro_requested', label: 'Intro Requested', color: 'bg-blue-100 text-blue-800' },
  { key: 'in_conversation', label: 'In Conversation', color: 'bg-yellow-100 text-yellow-800' },
  { key: 'due_diligence', label: 'Due Diligence', color: 'bg-orange-100 text-orange-800' },
  { key: 'invested', label: 'Invested', color: 'bg-green-100 text-green-800' },
  { key: 'passed', label: 'Passed', color: 'bg-red-50 text-red-500' },
];

export default function Pipeline() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [editNotes, setEditNotes] = useState({});
  const [activeStage, setActiveStage] = useState('all');

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: pipeline = [], isLoading } = useQuery({
    queryKey: ['pipeline', user?.email],
    queryFn: () => base44.entities.Pipeline.filter({ investor_email: user?.email }),
    enabled: !!user?.email,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Pipeline.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pipeline'] }),
  });

  const filtered = activeStage === 'all' ? pipeline : pipeline.filter(p => p.stage === activeStage);

  const stageCount = (key) => pipeline.filter(p => p.stage === key).length;

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs uppercase tracking-widest text-muted-foreground font-medium">Investor Dashboard</span>
        </div>
        <h1 className="font-heading text-3xl font-bold">My Pipeline</h1>
        <p className="text-muted-foreground mt-1">Track and manage your deal flow across every stage.</p>
      </div>

      {/* Stage Filter Bar */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveStage('all')}
          className={`px-4 py-2 rounded-xl text-xs font-medium transition-all border ${activeStage === 'all' ? 'bg-foreground text-background border-foreground' : 'bg-card border-border/60 text-muted-foreground hover:border-foreground/30'}`}
        >
          All · {pipeline.length}
        </button>
        {STAGES.map(s => (
          <button
            key={s.key}
            onClick={() => setActiveStage(s.key)}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-all border ${activeStage === s.key ? 'bg-foreground text-background border-foreground' : 'bg-card border-border/60 text-muted-foreground hover:border-foreground/30'}`}
          >
            {s.label} · {stageCount(s.key)}
          </button>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Deals', value: pipeline.length },
          { label: 'Intro Requested', value: stageCount('intro_requested') },
          { label: 'In Conversation', value: stageCount('in_conversation') + stageCount('due_diligence') },
          { label: 'Invested', value: stageCount('invested') },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border/60 rounded-xl p-4 text-center">
            <div className="font-heading text-3xl font-bold">{s.value}</div>
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-32 bg-muted rounded-2xl animate-pulse" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-border rounded-2xl">
          <TrendingUp className="w-10 h-10 text-muted-foreground/20 mx-auto mb-4" />
          <h3 className="font-heading text-lg font-semibold text-muted-foreground">No deals here yet</h3>
          <p className="text-sm text-muted-foreground mt-1 mb-4">Save or request intros in the Deal Room to build your pipeline.</p>
          <Button variant="outline" onClick={() => navigate('/deal-room')} className="rounded-xl gap-2">
            Browse Deal Room <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(item => {
            const stage = STAGES.find(s => s.key === item.stage);
            return (
              <div key={item.id} className="bg-card border border-border/60 rounded-2xl p-5 hover:border-foreground/20 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Badge className={`${stage?.color} text-[9px] uppercase tracking-wider border-0`}>
                        {stage?.label}
                      </Badge>
                      {item.last_activity && (
                        <span className="text-[10px] text-muted-foreground">Last activity {item.last_activity}</span>
                      )}
                    </div>
                    <h3
                      className="font-heading font-semibold text-base cursor-pointer hover:underline"
                      onClick={() => navigate(`/deal-room/${item.deal_id}`)}
                    >
                      {item.deal_title}
                    </h3>
                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mt-1">
                      <span>By <strong className="text-foreground">{item.founder_name}</strong></span>
                      {item.amount_seeking && <span>{formatAmount(item.amount_seeking)} ask</span>}
                      {item.investment_interest_range && <span>Your interest: {item.investment_interest_range.replace(/_/g, ' ').replace('k', 'K').replace('m', 'M')}</span>}
                    </div>

                    {/* Notes */}
                    <div className="mt-3">
                      {editNotes[item.id] ? (
                        <div className="space-y-2">
                          <Textarea
                            className="rounded-xl text-xs min-h-[60px]"
                            placeholder="Private notes..."
                            defaultValue={item.private_notes}
                            onBlur={async (e) => {
                              await updateMutation.mutateAsync({ id: item.id, data: { private_notes: e.target.value } });
                              setEditNotes(p => ({...p, [item.id]: false}));
                            }}
                            autoFocus
                          />
                        </div>
                      ) : (
                        <button
                          onClick={() => setEditNotes(p => ({...p, [item.id]: true}))}
                          className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <FileText className="w-3 h-3" />
                          {item.private_notes ? item.private_notes.slice(0, 80) + (item.private_notes.length > 80 ? '...' : '') : 'Add private notes'}
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Select
                      value={item.stage}
                      onValueChange={(v) => updateMutation.mutate({ id: item.id, data: { stage: v, last_activity: new Date().toISOString().split('T')[0] } })}
                    >
                      <SelectTrigger className="w-44 rounded-xl text-xs h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STAGES.map(s => <SelectItem key={s.key} value={s.key}>{s.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-xl text-xs gap-1"
                      onClick={() => navigate(`/deal-room/${item.deal_id}`)}
                    >
                      View <ChevronRight className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}