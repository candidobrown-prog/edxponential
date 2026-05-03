import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, Sparkles, User, DollarSign, Target, Globe, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const STAGES = ['idea','launch','early_traction','growth','turnaround','acquisition'];
const STAGE_LABELS = { idea:'Idea', launch:'Launch', early_traction:'Early Traction', growth:'Growth', turnaround:'Turnaround', acquisition:'Acquisition' };
const INVEST_TYPES = ['donation','grant','equity','revenue_share','loan','philanthropic','strategic_partnership'];
const INVEST_TYPE_LABELS = { donation:'Donation', grant:'Grant', equity:'Equity', revenue_share:'Revenue-Share', loan:'Loan', philanthropic:'Philanthropic Capital', strategic_partnership:'Strategic Partnership' };
const EDU_FOCUS = ['literacy','math','turnaround','charter','private','edtech','workforce','special_ed','leadership'];
const EDU_FOCUS_LABELS = { literacy:'Literacy', math:'Math', turnaround:'School Turnaround', charter:'Charter Schools', private:'Private Schools', edtech:'EdTech', workforce:'Workforce', special_ed:'Special Education', leadership:'Leadership Development' };
const IMPACT_OPTS = ['reading_proficiency','math_proficiency','enrollment_growth','attendance','college_readiness','underserved','founder_diversity','innovation'];
const IMPACT_LABELS = { reading_proficiency:'Reading Proficiency', math_proficiency:'Math Proficiency', enrollment_growth:'Enrollment Growth', attendance:'Attendance', college_readiness:'College Readiness', underserved:'Underserved Communities', founder_diversity:'Founder Diversity', innovation:'Innovation' };
const INVOLVEMENT = ['passive_capital','advisory','board','strategic_partner','hands_on'];
const INVOLVEMENT_LABELS = { passive_capital:'Passive Capital', advisory:'Advisory Role', board:'Board Role', strategic_partner:'Strategic Partner', hands_on:'Hands-On Operator Support' };

const STEPS = [
  { id: 'identity', label: 'Identity', icon: User },
  { id: 'capital', label: 'Capital', icon: DollarSign },
  { id: 'focus', label: 'Focus', icon: Target },
  { id: 'impact', label: 'Impact', icon: Zap },
  { id: 'review', label: 'Review', icon: CheckCircle },
];

function MultiSelectPills({ options, labels, selected, onChange }) {
  const toggle = (val) => onChange(selected.includes(val) ? selected.filter(v => v !== val) : [...selected, val]);
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => (
        <button
          key={opt}
          type="button"
          onClick={() => toggle(opt)}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
            selected.includes(opt)
              ? 'bg-foreground text-background border-foreground'
              : 'bg-transparent text-foreground border-border hover:border-foreground/40'
          }`}
        >
          {labels[opt] || opt}
        </button>
      ))}
    </div>
  );
}

export default function InvestorProfile() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [generatingThesis, setGeneratingThesis] = useState(false);
  const [done, setDone] = useState(false);

  const [form, setForm] = useState({
    full_name: '', title: '', avatar_url: '', bio: '',
    min_check_size: '', max_check_size: '', annual_deployment_target: '',
    preferred_stage: [], preferred_investment_type: [], preferred_education_focus: [],
    preferred_geography: '', risk_appetite: '',
    impact_priorities: [], desired_involvement: [],
    visibility: 'verified_only', contact_preference: 'intro_required',
    thesis_statement: '', portfolio: []
  });

  useEffect(() => {
    base44.auth.me().then(u => {
      setUser(u);
      setForm(f => ({ ...f, full_name: u.full_name || '', user_email: u.email }));
    });
  }, []);

  const { data: existing } = useQuery({
    queryKey: ['my_investor_profile', user?.email],
    queryFn: () => base44.entities.EdVestor.filter({ user_email: user.email }),
    enabled: !!user?.email,
  });

  // Populate form when existing profile loads
  useEffect(() => {
    if (existing?.[0]) setForm(f => ({ ...f, ...existing[0] }));
  }, [existing]);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const generateThesis = async () => {
    setGeneratingThesis(true);
    const res = await base44.functions.invoke('generateThesis', { type: 'investor', data: form });
    if (res.data?.thesis) set('thesis_statement', res.data.thesis);
    setGeneratingThesis(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      ...form,
      user_email: user?.email,
      profile_complete: true,
      status: 'active',
      min_check_size: Number(form.min_check_size) || null,
      max_check_size: Number(form.max_check_size) || null,
      annual_deployment_target: Number(form.annual_deployment_target) || null,
    };
    const existingProfile = existing?.[0];
    if (existingProfile) {
      await base44.entities.EdVestor.update(existingProfile.id, payload);
    } else {
      await base44.entities.EdVestor.create(payload);
    }
    // Trigger match computation
    await base44.functions.invoke('computeMatchScores', { edvestor_email: user?.email });
    queryClient.invalidateQueries({ queryKey: ['my_investor_profile'] });
    setSaving(false);
    setDone(true);
  };

  if (done) return (
    <div className="max-w-lg mx-auto py-20 text-center space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-foreground flex items-center justify-center mx-auto">
        <CheckCircle className="w-8 h-8 text-background" />
      </div>
      <h2 className="font-heading text-2xl font-bold">Profile Complete</h2>
      <p className="text-muted-foreground text-sm">Your investor thesis has been created and matched deals are being curated.</p>
      {form.thesis_statement && (
        <div className="bg-muted rounded-2xl p-4 text-sm italic text-muted-foreground text-left">"{form.thesis_statement}"</div>
      )}
      <Button className="rounded-xl bg-foreground text-background hover:bg-foreground/85 w-full" onClick={() => navigate('/matched-opportunities')}>
        View Matched Opportunities
      </Button>
    </div>
  );

  const currentStep = STEPS[step];

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold">edVestor Investment Profile</h1>
        <p className="text-muted-foreground text-sm mt-1">Complete your profile to receive curated, high-alignment deal matches.</p>
      </div>

      {/* Step nav */}
      <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-1">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={s.id} className="flex items-center gap-1">
              <button
                onClick={() => i < step + 1 && setStep(i)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                  i === step ? 'bg-foreground text-background' :
                  i < step ? 'bg-muted text-foreground hover:bg-muted/80' :
                  'bg-transparent text-muted-foreground border border-border'
                }`}
              >
                <Icon className="w-3 h-3" />
                {s.label}
              </button>
              {i < STEPS.length - 1 && <div className="w-4 h-px bg-border shrink-0" />}
            </div>
          );
        })}
      </div>

      {/* Step content */}
      <div className="bg-card border border-border/60 rounded-2xl p-6 space-y-5">

        {step === 0 && (
          <>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-4">Identity & Background</div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-xs uppercase tracking-widest text-muted-foreground">Full Name</Label>
                <Input value={form.full_name} onChange={e => set('full_name', e.target.value)} className="rounded-xl" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs uppercase tracking-widest text-muted-foreground">Title / Firm</Label>
                <Input placeholder="e.g. Managing Partner, Apex Capital" value={form.title} onChange={e => set('title', e.target.value)} className="rounded-xl" />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">Bio</Label>
              <Textarea rows={4} placeholder="Your background, experience, and what drives your investments in education..." value={form.bio} onChange={e => set('bio', e.target.value)} className="rounded-xl" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">Profile Photo URL</Label>
              <Input placeholder="https://..." value={form.avatar_url} onChange={e => set('avatar_url', e.target.value)} className="rounded-xl" />
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-4">Capital Parameters</div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-xs uppercase tracking-widest text-muted-foreground">Minimum Check Size ($)</Label>
                <Input type="number" placeholder="50000" value={form.min_check_size} onChange={e => set('min_check_size', e.target.value)} className="rounded-xl" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs uppercase tracking-widest text-muted-foreground">Maximum Check Size ($)</Label>
                <Input type="number" placeholder="500000" value={form.max_check_size} onChange={e => set('max_check_size', e.target.value)} className="rounded-xl" />
              </div>
              <div className="col-span-2 space-y-1">
                <Label className="text-xs uppercase tracking-widest text-muted-foreground">Annual Deployment Target ($)</Label>
                <Input type="number" placeholder="1000000" value={form.annual_deployment_target} onChange={e => set('annual_deployment_target', e.target.value)} className="rounded-xl" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">Preferred Stage</Label>
              <MultiSelectPills options={STAGES} labels={STAGE_LABELS} selected={form.preferred_stage} onChange={v => set('preferred_stage', v)} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">Investment Type</Label>
              <MultiSelectPills options={INVEST_TYPES} labels={INVEST_TYPE_LABELS} selected={form.preferred_investment_type} onChange={v => set('preferred_investment_type', v)} />
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">Risk Appetite</Label>
              <div className="flex gap-2">
                {['conservative','balanced','bold','transformational'].map(r => (
                  <button key={r} type="button" onClick={() => set('risk_appetite', r)}
                    className={`flex-1 py-2 rounded-xl text-xs font-medium border capitalize transition-all ${form.risk_appetite === r ? 'bg-foreground text-background border-foreground' : 'border-border hover:border-foreground/40'}`}>
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-4">Focus & Geography</div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">Education Focus</Label>
              <MultiSelectPills options={EDU_FOCUS} labels={EDU_FOCUS_LABELS} selected={form.preferred_education_focus} onChange={v => set('preferred_education_focus', v)} />
            </div>
            <div className="space-y-1">
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">Preferred Geography</Label>
              <Input placeholder="e.g. Southeast US, National, Texas" value={form.preferred_geography} onChange={e => set('preferred_geography', e.target.value)} className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">Desired Involvement</Label>
              <MultiSelectPills options={INVOLVEMENT} labels={INVOLVEMENT_LABELS} selected={form.desired_involvement} onChange={v => set('desired_involvement', v)} />
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-4">Impact Priorities</div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">What matters most to you?</Label>
              <MultiSelectPills options={IMPACT_OPTS} labels={IMPACT_LABELS} selected={form.impact_priorities} onChange={v => set('impact_priorities', v)} />
            </div>
            <div className="space-y-2 pt-4 border-t border-border/40">
              <Label className="text-xs uppercase tracking-widest text-muted-foreground">Profile Visibility</Label>
              <Select value={form.visibility} onValueChange={v => set('visibility', v)}>
                <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public — Anyone can see my profile</SelectItem>
                  <SelectItem value="verified_only">Verified Only — Founders must be approved</SelectItem>
                  <SelectItem value="private">Private — Only visible after I request intro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mb-4">Investor Thesis</div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Label className="text-xs uppercase tracking-widest text-muted-foreground">Your Thesis Statement</Label>
                <Button size="sm" variant="outline" className="rounded-xl text-xs gap-1.5" onClick={generateThesis} disabled={generatingThesis}>
                  <Sparkles className="w-3 h-3" />
                  {generatingThesis ? 'Generating…' : 'AI Generate'}
                </Button>
              </div>
              <Textarea
                rows={4}
                placeholder="e.g. Invests $250K–$1M in growth-stage charter schools focused on literacy and underserved communities..."
                value={form.thesis_statement}
                onChange={e => set('thesis_statement', e.target.value)}
                className="rounded-xl"
              />
            </div>

            {/* Summary */}
            <div className="bg-muted rounded-xl p-4 space-y-2 text-xs text-muted-foreground">
              <div className="font-medium text-foreground mb-1">Profile Summary</div>
              <div>Capital: ${Number(form.min_check_size||0).toLocaleString()} – ${Number(form.max_check_size||0).toLocaleString()}</div>
              <div>Stages: {form.preferred_stage.map(s => STAGE_LABELS[s]).join(', ') || '—'}</div>
              <div>Focus: {form.preferred_education_focus.map(s => EDU_FOCUS_LABELS[s]).join(', ') || '—'}</div>
              <div>Risk: {form.risk_appetite || '—'}</div>
              <div>Geography: {form.preferred_geography || '—'}</div>
            </div>
          </>
        )}

        {/* Nav */}
        <div className="flex items-center justify-between pt-2 border-t border-border/40">
          <Button variant="outline" className="rounded-xl" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}>
            Back
          </Button>
          {step < STEPS.length - 1 ? (
            <Button className="rounded-xl bg-foreground text-background hover:bg-foreground/85" onClick={() => setStep(s => s + 1)}>
              Continue
            </Button>
          ) : (
            <Button className="rounded-xl bg-foreground text-background hover:bg-foreground/85 gap-2" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : 'Complete Profile'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}