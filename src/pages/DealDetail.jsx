import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft, MapPin, Lock, Bookmark, Plus, TrendingUp,
  FileText, Star, Users, Calendar, DollarSign, CheckCircle
} from 'lucide-react';
import RequestIntroModal from '../components/dealroom/RequestIntroModal';
import { formatAmount } from '../components/dealroom/DealCard';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadialBarChart, RadialBar, Cell
} from 'recharts';

const STAGE_LABELS = {
  idea: 'Idea', seed: 'Seed', early: 'Early Stage',
  growth: 'Growth', turnaround: 'Turnaround', acquisition: 'Acquisition',
};

const ORG_COLORS = [
  '#0a0a0a', '#1e293b', '#1c1917', '#134e4a', '#1e1b4b', '#450a0a',
];
function getColor(str) {
  if (!str) return ORG_COLORS[0];
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) % ORG_COLORS.length;
  return ORG_COLORS[h];
}

function SectionLabel({ children }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-muted-foreground">{children}</span>
      <div className="h-px flex-1 bg-border/50" />
    </div>
  );
}

function MetricBar({ label, value, color = '#0a0a0a' }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="font-heading font-bold text-sm">{value}%</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

export default function DealDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [introOpen, setIntroOpen] = useState(false);
  const [docsUnlocked, setDocsUnlocked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [user, setUser] = useState(null);
  const [addedToPipeline, setAddedToPipeline] = useState(false);

  useEffect(() => { base44.auth.me().then(setUser).catch(() => {}); }, []);

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

  const orgName = deal.organization || deal.title || '?';
  const initials = orgName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const bgColor = getColor(orgName);
  const committed = deal.committed_capital || 0;
  const seeking = deal.amount_seeking || 0;
  const pct = seeking > 0 ? Math.min(100, Math.round((committed / seeking) * 100)) : 0;

  const performanceMetrics = [
    deal.reading_proficiency && { label: 'Reading Proficiency', value: deal.reading_proficiency, color: '#0a0a0a' },
    deal.math_proficiency && { label: 'Math Proficiency', value: deal.math_proficiency, color: '#374151' },
    deal.attendance_rate && { label: 'Attendance Rate', value: deal.attendance_rate, color: '#6b7280' },
    deal.teacher_retention && { label: 'Teacher Retention', value: deal.teacher_retention, color: '#9ca3af' },
  ].filter(Boolean);

  const chartData = performanceMetrics.map(m => ({ name: m.label.split(' ')[0], value: m.value }));

  const ENDORSEMENTS = [
    { name: 'Dr. Angela M.', role: 'Former State Superintendent', quote: 'One of the most mission-aligned operators I\'ve encountered in 20 years of education reform.' },
    { name: 'Marcus T.', role: 'Partner, Apex Education Capital', quote: 'The performance data speaks for itself. Rare execution at this stage.' },
  ];

  return (
    <div className="max-w-6xl mx-auto -mt-2">
      {/* Back */}
      <button
        onClick={() => navigate('/deal-room')}
        className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Deal Room
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* ── MAIN CONTENT ── */}
        <div className="lg:col-span-2 space-y-6">

          {/* ── HERO: School Name + Founder ── */}
          <div className="rounded-2xl overflow-hidden border border-border/60">
            {/* Image / Logo zone */}
            <div
              className="relative h-52 flex items-center justify-center"
              style={{ backgroundColor: bgColor }}
            >
              {deal.founder_photo && (
                <img src={deal.founder_photo} alt={orgName} className="absolute inset-0 w-full h-full object-cover opacity-30" />
              )}
              <div className="relative z-10 text-center">
                <div className="font-heading font-bold text-white/90 text-6xl tracking-tight select-none mb-2">
                  {initials}
                </div>
                {deal.featured && (
                  <Badge className="bg-white/20 text-white border-white/20 text-[9px] uppercase tracking-widest">
                    Featured
                  </Badge>
                )}
              </div>
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <Badge className="bg-black/50 backdrop-blur-sm text-white border-white/10 text-[9px] uppercase tracking-widest">
                  {STAGE_LABELS[deal.stage] || deal.stage}
                </Badge>
                {deal.status === 'active' && (
                  <span className="flex items-center gap-1.5 text-[9px] text-white/80 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> Active Raise
                  </span>
                )}
              </div>
            </div>

            {/* School name + founder info */}
            <div className="bg-card px-7 py-5 border-t border-border/60">
              <h1 className="font-heading text-2xl font-bold leading-tight">{deal.title}</h1>
              {deal.organization && (
                <p className="text-sm text-muted-foreground mt-0.5">{deal.organization}</p>
              )}
              <div className="flex flex-wrap gap-4 mt-3 text-xs text-muted-foreground">
                <span>Founded by <span className="text-foreground font-medium">{deal.founder_name}</span></span>
                {deal.location && (
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{deal.location}</span>
                )}
                {deal.geography && (
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{deal.geography}</span>
                )}
                {deal.enrollment && (
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" />{deal.enrollment.toLocaleString()} students</span>
                )}
              </div>
              {deal.thesis && (
                <div className="mt-4 pt-4 border-t border-border/50">
                  <p className="text-sm italic text-muted-foreground leading-relaxed">"{deal.thesis}"</p>
                </div>
              )}
            </div>
          </div>

          {/* ── THE OPPORTUNITY ── */}
          <div className="bg-card border border-border/60 rounded-2xl p-7 space-y-6">
            <SectionLabel>The Opportunity</SectionLabel>
            {deal.problem && (
              <div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2 font-medium">The Problem</div>
                <p className="text-sm leading-relaxed text-foreground/80">{deal.problem}</p>
              </div>
            )}
            {deal.solution && (
              <div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2 font-medium">The Solution</div>
                <p className="text-sm leading-relaxed text-foreground/80">{deal.solution}</p>
              </div>
            )}
            {deal.vision && (
              <div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2 font-medium">Why Now</div>
                <p className="text-sm leading-relaxed text-foreground/80">{deal.vision}</p>
              </div>
            )}
            {!deal.problem && !deal.solution && deal.description && (
              <p className="text-sm leading-relaxed text-foreground/80">{deal.description}</p>
            )}
          </div>

          {/* ── PERFORMANCE DATA ── */}
          {performanceMetrics.length > 0 && (
            <div className="bg-card border border-border/60 rounded-2xl p-7">
              <SectionLabel>Performance Data</SectionLabel>
              <p className="text-xs text-muted-foreground mb-6">Verified institutional metrics</p>

              {/* Stat tiles */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {performanceMetrics.map(m => (
                  <div key={m.label} className="bg-muted rounded-xl p-4 text-center">
                    <div className="font-heading text-3xl font-bold">{m.value}%</div>
                    <div className="text-[9px] uppercase tracking-widest text-muted-foreground mt-1">{m.label.split(' ')[0]}</div>
                  </div>
                ))}
                {deal.enrollment && (
                  <div className="bg-muted rounded-xl p-4 text-center">
                    <div className="font-heading text-3xl font-bold">{deal.enrollment.toLocaleString()}</div>
                    <div className="text-[9px] uppercase tracking-widest text-muted-foreground mt-1">Students</div>
                  </div>
                )}
              </div>

              {/* Bar charts */}
              {chartData.length >= 2 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Reading */}
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3">Reading</div>
                    <div className="h-32">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[{ name: 'Proficiency', value: deal.reading_proficiency || 0 }, { name: 'Growth', value: deal.reading_growth || 0 }]} barSize={28}>
                          <XAxis dataKey="name" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                          <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} axisLine={false} tickLine={false} unit="%" width={28} />
                          <Tooltip formatter={(v) => `${v}%`} contentStyle={{ borderRadius: 8, border: 'none', background: '#111', color: '#fff', fontSize: 11 }} />
                          <Bar dataKey="value" radius={[4, 4, 0, 0]} fill="#0a0a0a" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  {/* Math */}
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3">Math</div>
                    <div className="h-32">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[{ name: 'Proficiency', value: deal.math_proficiency || 0 }, { name: 'Growth', value: deal.math_growth || 0 }]} barSize={28}>
                          <XAxis dataKey="name" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                          <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} axisLine={false} tickLine={false} unit="%" width={28} />
                          <Tooltip formatter={(v) => `${v}%`} contentStyle={{ borderRadius: 8, border: 'none', background: '#111', color: '#fff', fontSize: 11 }} />
                          <Bar dataKey="value" radius={[4, 4, 0, 0]} fill="#374151" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  {/* Attendance bar */}
                  {deal.attendance_rate && (
                    <div className="sm:col-span-2">
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3">Attendance</div>
                      <MetricBar label="Attendance Rate" value={deal.attendance_rate} color="#6b7280" />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ── FOUNDER PROFILE ── */}
          <div className="bg-card border border-border/60 rounded-2xl p-7">
            <SectionLabel>Founder Profile</SectionLabel>
            <div className="flex items-start gap-5">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 text-white font-heading font-bold text-xl"
                style={{ backgroundColor: bgColor }}
              >
                {deal.founder_name?.[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-heading font-bold text-base">{deal.founder_name}</div>
                {deal.organization && <div className="text-sm text-muted-foreground mt-0.5">{deal.organization}</div>}
                {deal.founder_background ? (
                  <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{deal.founder_background}</p>
                ) : (
                  <p className="text-sm text-muted-foreground mt-3 leading-relaxed italic">
                    Experienced education operator with a proven track record in school growth and student outcomes.
                  </p>
                )}
                <div className="flex flex-wrap gap-2 mt-3">
                  {['Operator', 'Education Leader', 'Verified Founder'].map(tag => (
                    <Badge key={tag} variant="outline" className="text-[9px] uppercase tracking-widest py-0.5">{tag}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── INVESTMENT DETAILS ── */}
          <div className="bg-card border border-border/60 rounded-2xl p-7">
            <SectionLabel>Investment Details</SectionLabel>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
              {[
                { label: 'Total Raise', value: formatAmount(deal.amount_seeking), icon: DollarSign },
                { label: 'Minimum', value: formatAmount(deal.minimum_investment), icon: DollarSign },
                { label: 'Committed', value: formatAmount(committed), icon: TrendingUp },
                { label: 'Remaining', value: formatAmount(Math.max(0, seeking - committed)), icon: TrendingUp },
                { label: 'Timeline', value: deal.timeline || '—', icon: Calendar },
                { label: 'Geography', value: deal.geography || '—', icon: MapPin },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="bg-muted rounded-xl p-4">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Icon className="w-3 h-3 text-muted-foreground" />
                    <span className="text-[9px] uppercase tracking-widest text-muted-foreground">{label}</span>
                  </div>
                  <div className="font-heading font-semibold text-sm">{value}</div>
                </div>
              ))}
            </div>

            {seeking > 0 && (
              <div className="mb-5">
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
              <div className="pt-5 border-t border-border/50">
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Use of Funds</div>
                <p className="text-sm leading-relaxed text-foreground/80">{deal.use_of_funds}</p>
              </div>
            )}
          </div>

          {/* ── DOCUMENT VAULT ── */}
          <div className="bg-card border border-border/60 rounded-2xl p-7">
            <SectionLabel>Document Vault</SectionLabel>
            <p className="text-xs text-muted-foreground mb-5">Private materials. Request an introduction to unlock full access.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { name: 'Pitch Deck', desc: '24 slides · PDF', icon: '📊' },
                { name: 'Financial Projections', desc: '3-year model · Excel', icon: '📈' },
                { name: 'School Growth Plan', desc: 'Strategic roadmap · PDF', icon: '📋' },
                { name: 'Student Outcome Data', desc: 'Assessment results · PDF', icon: '🎓' },
              ].map(doc => (
                <div key={doc.name} className="flex items-center justify-between p-4 border border-border/60 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{doc.icon}</span>
                    <div>
                      <div className="text-sm font-medium">{doc.name}</div>
                      <div className="text-[10px] text-muted-foreground">{doc.desc}</div>
                    </div>
                  </div>
                  {docsUnlocked ? (
                    <Button size="sm" variant="outline" className="rounded-lg text-xs shrink-0">View</Button>
                  ) : (
                    <Lock className="w-4 h-4 text-muted-foreground shrink-0" />
                  )}
                </div>
              ))}
            </div>

            {!docsUnlocked && (
              <Button
                className="w-full mt-5 rounded-xl bg-foreground text-background hover:bg-foreground/85 gap-2"
                onClick={() => { setIntroOpen(true); setDocsUnlocked(true); }}
              >
                <Lock className="w-4 h-4" /> Unlock Full Vault
              </Button>
            )}
          </div>

          {/* ── ENDORSEMENTS ── */}
          <div className="bg-card border border-border/60 rounded-2xl p-7">
            <SectionLabel>Endorsements</SectionLabel>
            <div className="space-y-4">
              {ENDORSEMENTS.map(e => (
                <div key={e.name} className="flex items-start gap-4 p-4 bg-muted/50 rounded-xl">
                  <div className="w-9 h-9 rounded-full bg-foreground flex items-center justify-center flex-shrink-0">
                    <span className="text-background font-heading font-bold text-xs">{e.name[0]}</span>
                  </div>
                  <div>
                    <p className="text-sm italic text-foreground/80 leading-relaxed mb-2">"{e.quote}"</p>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-foreground text-foreground" />
                      <span className="text-[10px] font-medium">{e.name}</span>
                      <span className="text-[10px] text-muted-foreground">· {e.role}</span>
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
                <CheckCircle className="w-3.5 h-3.5 text-foreground" />
                Trusted by 200+ education investors and operators in the edXponential network
              </div>
            </div>
          </div>
        </div>

        {/* ── STICKY SIDEBAR ── */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-4">
            {/* Action card */}
            <div className="bg-card border border-border/60 rounded-2xl overflow-hidden">
              {/* Founder photo strip */}
              <div
                className="h-20 flex items-center justify-center relative"
                style={{ backgroundColor: bgColor }}
              >
                <span className="font-heading font-bold text-white/70 text-3xl select-none">{initials}</span>
              </div>

              <div className="p-5 space-y-4">
                {/* Ask + Min */}
                <div className="grid grid-cols-2 gap-3 pb-4 border-b border-border/50">
                  <div className="text-center">
                    <div className="font-heading text-xl font-bold">{formatAmount(seeking)}</div>
                    <div className="text-[9px] uppercase tracking-widest text-muted-foreground mt-0.5">Ask</div>
                  </div>
                  <div className="text-center">
                    <div className="font-heading text-xl font-bold">{formatAmount(deal.minimum_investment) || '—'}</div>
                    <div className="text-[9px] uppercase tracking-widest text-muted-foreground mt-0.5">Minimum</div>
                  </div>
                </div>

                {/* Progress */}
                {seeking > 0 && (
                  <div>
                    <div className="flex justify-between text-[10px] text-muted-foreground mb-1.5">
                      <span>{formatAmount(committed)} raised</span>
                      <span>{pct}%</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-foreground rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )}

                {/* CTAs */}
                <Button
                  className="w-full rounded-xl bg-foreground text-background hover:bg-foreground/85 gap-2"
                  onClick={() => setIntroOpen(true)}
                >
                  Request Intro
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
                  {addedToPipeline ? 'Added to Pipeline' : 'Add to Pipeline'}
                </Button>
              </div>
            </div>

            {/* Deal Signals */}
            <div className="bg-card border border-border/60 rounded-2xl p-5 space-y-3">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">Deal Signals</div>
              {[
                deal.saves_count > 0 && `${deal.saves_count} investor${deal.saves_count > 1 ? 's' : ''} saved this`,
                deal.intros_count > 0 && `${deal.intros_count} intro request${deal.intros_count > 1 ? 's' : ''} sent`,
                deal.featured && 'Curated by edXponential',
                'Vetted & approved opportunity',
              ].filter(Boolean).map((signal, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CheckCircle className="w-3 h-3 text-foreground flex-shrink-0" />
                  <span>{signal}</span>
                </div>
              ))}
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