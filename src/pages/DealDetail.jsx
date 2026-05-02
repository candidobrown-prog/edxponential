import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MapPin, Lock, Bookmark, Plus, TrendingUp } from 'lucide-react';
import RequestIntroModal from '../components/dealroom/RequestIntroModal';
import { formatAmount } from '../components/dealroom/DealCard';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const STAGE_LABELS = {
  idea: 'Idea', seed: 'Seed', early: 'Early Stage',
  growth: 'Growth', turnaround: 'Turnaround', acquisition: 'Acquisition',
};

export default function DealDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [introOpen, setIntroOpen] = useState(false);
  const [docsUnlocked, setDocsUnlocked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [user, setUser] = useState(null);
  const [addedToPipeline, setAddedToPipeline] = useState(false);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: deal, isLoading } = useQuery({
    queryKey: ['deal', id],
    queryFn: () => base44.entities.DealRoom.filter({ id }),
    select: (data) => data?.[0],
  });

  const handleSave = async () => {
    setSaved(true);
    await base44.entities.DealRoom.update(id, { saves_count: (deal?.saves_count || 0) + 1 });
    queryClient.invalidateQueries({ queryKey: ['deal', id] });
  };

  const handleAddToPipeline = async () => {
    await base44.entities.Pipeline.create({
      investor_email: user?.email,
      deal_id: id,
      deal_title: deal?.title,
      founder_name: deal?.founder_name,
      amount_seeking: deal?.amount_seeking,
      stage: 'saved',
      last_activity: new Date().toISOString().split('T')[0],
    });
    queryClient.invalidateQueries({ queryKey: ['pipeline'] });
    setAddedToPipeline(true);
  };

  if (isLoading) return (
    <div className="flex items-center justify-center py-32">
      <div className="w-8 h-8 border-4 border-muted border-t-foreground rounded-full animate-spin" />
    </div>
  );

  if (!deal) return (
    <div className="text-center py-32">
      <p className="text-muted-foreground">Deal not found.</p>
      <Button variant="outline" onClick={() => navigate('/deal-room')} className="mt-4 rounded-xl">Back to Deal Room</Button>
    </div>
  );

  const committed = deal.committed_capital || 0;
  const seeking = deal.amount_seeking || 0;
  const pct = seeking > 0 ? Math.min(100, Math.round((committed / seeking) * 100)) : 0;

  const metricsData = [
    deal.reading_proficiency && { name: 'Reading', value: deal.reading_proficiency },
    deal.math_proficiency && { name: 'Math', value: deal.math_proficiency },
    deal.attendance_rate && { name: 'Attendance', value: deal.attendance_rate },
    deal.teacher_retention && { name: 'Teacher Ret.', value: deal.teacher_retention },
  ].filter(Boolean);

  return (
    <div className="max-w-6xl mx-auto space-y-0">
      {/* Back */}
      <button
        onClick={() => navigate('/deal-room')}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Deal Room
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Card */}
          <div className="bg-foreground text-background rounded-2xl p-8">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center flex-shrink-0">
                <span className="font-heading font-bold text-2xl">{(deal.organization || deal.founder_name)[0]}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap gap-2 mb-2">
                  <Badge className="bg-white/15 text-white border-white/20 text-[9px] uppercase tracking-widest">
                    {STAGE_LABELS[deal.stage] || deal.stage}
                  </Badge>
                  {deal.status === 'active' && (
                    <Badge className="bg-white/10 text-white/80 border-white/10 text-[9px] uppercase tracking-widest">Active</Badge>
                  )}
                </div>
                <h1 className="font-heading text-2xl font-bold leading-tight">{deal.title}</h1>
                {deal.organization && <p className="text-white/60 text-sm mt-0.5">{deal.organization}</p>}
                <div className="flex flex-wrap gap-3 mt-2 text-white/50 text-xs">
                  <span>Founded by <span className="text-white font-medium">{deal.founder_name}</span></span>
                  {deal.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{deal.location}</span>}
                </div>
              </div>
            </div>
            {deal.thesis && (
              <div className="mt-5 pt-5 border-t border-white/10">
                <p className="text-white/80 text-sm italic font-light leading-relaxed">"{deal.thesis}"</p>
              </div>
            )}
          </div>

          {/* The Opportunity */}
          <div className="bg-card border border-border/60 rounded-2xl p-7 space-y-5">
            <h2 className="font-heading text-lg font-semibold">The Opportunity</h2>
            {deal.problem && (
              <div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5 font-medium">The Problem</div>
                <p className="text-sm leading-relaxed">{deal.problem}</p>
              </div>
            )}
            {deal.solution && (
              <div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5 font-medium">The Solution</div>
                <p className="text-sm leading-relaxed">{deal.solution}</p>
              </div>
            )}
            {deal.vision && (
              <div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5 font-medium">The Vision</div>
                <p className="text-sm leading-relaxed">{deal.vision}</p>
              </div>
            )}
            {!deal.problem && !deal.solution && deal.description && (
              <p className="text-sm leading-relaxed">{deal.description}</p>
            )}
          </div>

          {/* Performance Data */}
          {metricsData.length > 0 && (
            <div className="bg-card border border-border/60 rounded-2xl p-7">
              <h2 className="font-heading text-lg font-semibold mb-1">Performance Data</h2>
              <p className="text-xs text-muted-foreground mb-5">Key institutional metrics</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                {metricsData.map(m => (
                  <div key={m.name} className="text-center bg-muted rounded-xl p-4">
                    <div className="font-heading text-3xl font-bold">{m.value}%</div>
                    <div className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wide">{m.name}</div>
                  </div>
                ))}
                {deal.enrollment && (
                  <div className="text-center bg-muted rounded-xl p-4">
                    <div className="font-heading text-3xl font-bold">{deal.enrollment.toLocaleString()}</div>
                    <div className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wide">Students</div>
                  </div>
                )}
              </div>
              {metricsData.length >= 2 && (
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={metricsData} barSize={32}>
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} axisLine={false} tickLine={false} unit="%" width={30} />
                      <Tooltip formatter={(v) => `${v}%`} contentStyle={{ borderRadius: 8, border: 'none', background: '#111', color: '#fff', fontSize: 11 }} />
                      <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                        {metricsData.map((_, i) => <Cell key={i} fill={i === 0 ? '#0a0a0a' : '#d1d5db'} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          )}

          {/* Founder Profile */}
          <div className="bg-card border border-border/60 rounded-2xl p-7">
            <h2 className="font-heading text-lg font-semibold mb-4">Founder Profile</h2>
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-foreground flex items-center justify-center flex-shrink-0">
                <span className="text-background font-heading font-bold text-xl">{deal.founder_name?.[0]}</span>
              </div>
              <div>
                <div className="font-heading font-semibold text-base">{deal.founder_name}</div>
                {deal.organization && <div className="text-sm text-muted-foreground">{deal.organization}</div>}
                {deal.founder_background && (
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{deal.founder_background}</p>
                )}
              </div>
            </div>
          </div>

          {/* Investment Details */}
          <div className="bg-card border border-border/60 rounded-2xl p-7">
            <h2 className="font-heading text-lg font-semibold mb-4">Investment Details</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { label: 'Total Raise', value: formatAmount(deal.amount_seeking) },
                { label: 'Minimum Investment', value: formatAmount(deal.minimum_investment) },
                { label: 'Committed', value: formatAmount(committed) },
                { label: 'Remaining', value: formatAmount(Math.max(0, seeking - committed)) },
                { label: 'Timeline', value: deal.timeline || '—' },
                { label: 'Geography', value: deal.geography || '—' },
              ].map(({ label, value }) => (
                <div key={label} className="bg-muted rounded-xl p-4">
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">{label}</div>
                  <div className="font-heading font-semibold text-sm">{value}</div>
                </div>
              ))}
            </div>
            {seeking > 0 && (
              <div className="mt-4">
                <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                  <span>{pct}% committed</span>
                  <span>{formatAmount(seeking - committed)} remaining</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-foreground rounded-full transition-all" style={{ width: `${pct}%` }} />
                </div>
              </div>
            )}
            {deal.use_of_funds && (
              <div className="mt-4 pt-4 border-t border-border/50">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1.5">Use of Funds</div>
                <p className="text-sm leading-relaxed">{deal.use_of_funds}</p>
              </div>
            )}
          </div>

          {/* Document Vault */}
          <div className="bg-card border border-border/60 rounded-2xl p-7">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-heading text-lg font-semibold">Document Vault</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Private documents · Gated access</p>
              </div>
              <Lock className="w-4 h-4 text-muted-foreground" />
            </div>
            {docsUnlocked ? (
              <div className="space-y-2">
                {['Pitch Deck', 'Financial Projections', 'Growth Plan', 'School Model'].map(doc => (
                  <div key={doc} className="flex items-center justify-between p-3 bg-muted rounded-xl">
                    <span className="text-sm font-medium">{doc}</span>
                    <Button size="sm" variant="outline" className="rounded-lg text-xs" disabled>
                      View PDF
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 border border-dashed border-border rounded-xl">
                <Lock className="w-8 h-8 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm font-medium mb-1">Documents are private</p>
                <p className="text-xs text-muted-foreground mb-4">Request an introduction to unlock the full document vault.</p>
                <Button
                  size="sm"
                  className="rounded-xl bg-foreground text-background hover:bg-foreground/85"
                  onClick={() => { setIntroOpen(true); setDocsUnlocked(true); }}
                >
                  Unlock Documents
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Sticky Action Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-4">
            <div className="bg-card border border-border/60 rounded-2xl p-6 space-y-3">
              <div className="text-center pb-3 border-b border-border/50">
                <div className="font-heading text-2xl font-bold">{formatAmount(deal.amount_seeking)}</div>
                <div className="text-xs text-muted-foreground mt-0.5">Funding Ask</div>
                {deal.minimum_investment && (
                  <div className="text-xs text-muted-foreground mt-1">Min: {formatAmount(deal.minimum_investment)}</div>
                )}
              </div>

              <Button
                className="w-full rounded-xl bg-foreground text-background hover:bg-foreground/85"
                onClick={() => setIntroOpen(true)}
              >
                Request Introduction
              </Button>
              <Button
                variant="outline"
                className="w-full rounded-xl gap-2"
                onClick={handleSave}
                disabled={saved}
              >
                <Bookmark className="w-4 h-4" fill={saved ? 'currentColor' : 'none'} />
                {saved ? 'Saved' : 'Save Opportunity'}
              </Button>
              <Button
                variant="outline"
                className="w-full rounded-xl gap-2"
                onClick={handleAddToPipeline}
                disabled={addedToPipeline}
              >
                <Plus className="w-4 h-4" />
                {addedToPipeline ? 'In Pipeline' : 'Add to Pipeline'}
              </Button>
            </div>

            {/* Deal signals */}
            <div className="bg-card border border-border/60 rounded-2xl p-5 space-y-3">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Deal Signals</div>
              <div className="space-y-2 text-xs">
                {deal.saves_count > 0 && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <TrendingUp className="w-3 h-3" />
                    <span>{deal.saves_count} investor{deal.saves_count > 1 ? 's' : ''} saved this</span>
                  </div>
                )}
                {deal.intros_count > 0 && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <TrendingUp className="w-3 h-3" />
                    <span>{deal.intros_count} intro request{deal.intros_count > 1 ? 's' : ''} sent</span>
                  </div>
                )}
                {deal.featured && (
                  <div className="flex items-center gap-2 text-foreground font-medium">
                    <TrendingUp className="w-3 h-3" />
                    <span>Curated by edXponential</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Lock className="w-3 h-3" />
                  <span>Vetted opportunity</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <RequestIntroModal
        deal={deal}
        open={introOpen}
        onClose={() => setIntroOpen(false)}
        userEmail={user?.email}
      />
    </div>
  );
}