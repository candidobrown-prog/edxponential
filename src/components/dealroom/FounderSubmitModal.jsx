import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useQueryClient } from '@tanstack/react-query';
import { cn } from '@/lib/utils';

const STEPS = ['Founder', 'Basics', 'Opportunity', 'School Data', 'Funding', 'Documents', 'Review'];

const CAPITAL_TYPES = ['donation','grant','equity','revenue_share','loan','philanthropic','strategic_partnership'];
const CAPITAL_LABELS = { donation:'Donation', grant:'Grant', equity:'Equity', revenue_share:'Revenue-Share', loan:'Loan', philanthropic:'Philanthropic Capital', strategic_partnership:'Strategic Partnership' };
const IMPACT_OPTS = ['literacy','math','culture','scaling','turnaround','access'];
const IMPACT_LABELS = { literacy:'Literacy', math:'Math', culture:'Culture', scaling:'Scaling', turnaround:'Turnaround', access:'Access/Underserved' };
const INVOLVEMENT_OPTS = ['passive_capital','advisory','board','strategic_partner','hands_on'];
const INVOLVEMENT_LABELS = { passive_capital:'Passive Capital', advisory:'Advisory Role', board:'Board Role', strategic_partner:'Strategic Partner', hands_on:'Hands-On Support' };

function MultiPills({ options, labels, selected, onChange }) {
  const toggle = (v) => onChange(
    Array.isArray(selected)
      ? selected.includes(v) ? selected.filter(x => x !== v) : [...selected, v]
      : [v]
  );
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => (
        <button key={opt} type="button" onClick={() => toggle(opt)}
          className={cn('px-3 py-1.5 rounded-xl text-xs font-medium border transition-all',
            Array.isArray(selected) && selected.includes(opt)
              ? 'bg-foreground text-background border-foreground'
              : 'bg-transparent text-foreground border-border hover:border-foreground/40'
          )}>
          {labels[opt] || opt}
        </button>
      ))}
    </div>
  );
}

const EMPTY_FORM = {
  // Founder
  founder_background: '', founder_track_record: '', years_operating: '', founder_photo: '',
  // Basics
  organization: '', location: '', geography: '', stage: 'early_traction', education_type: 'charter',
  thesis: '', vision: '',
  // Opportunity
  problem: '', solution: '', growth_plan: '', evidence_of_traction: '', risks: '',
  impact_focus: 'literacy', desired_investor_involvement: 'advisory', risk_profile: 'balanced',
  capital_type_requested: [],
  // School Data
  reading_proficiency: '', math_proficiency: '', attendance_rate: '', enrollment: '',
  teacher_retention: '', current_revenue: '', reading_growth: '', math_growth: '',
  // Funding
  amount_seeking: '', minimum_investment: '', use_of_funds: '', timeline: '',
  // Documents
  pitch_deck_url: '', financials_url: '', growth_plan_url: '', data_report_url: '',
  board_deck_url: '', legal_docs_url: '',
};

export default function FounderSubmitModal({ open, onClose, user }) {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [generatingThesis, setGeneratingThesis] = useState(false);
  const queryClient = useQueryClient();
  const [form, setForm] = useState(EMPTY_FORM);

  const up = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const generateThesis = async () => {
    setGeneratingThesis(true);
    const res = await base44.functions.invoke('generateThesis', { type: 'founder', data: form });
    if (res.data?.thesis) up('thesis', res.data.thesis);
    setGeneratingThesis(false);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const deal = await base44.entities.DealRoom.create({
      ...form,
      title: form.thesis || `${form.organization} — ${form.stage?.replace('_', ' ')} Round`,
      founder_email: user?.email,
      founder_name: user?.full_name || 'Anonymous',
      amount_seeking: form.amount_seeking ? Number(form.amount_seeking) : undefined,
      minimum_investment: form.minimum_investment ? Number(form.minimum_investment) : undefined,
      reading_proficiency: form.reading_proficiency ? Number(form.reading_proficiency) : undefined,
      math_proficiency: form.math_proficiency ? Number(form.math_proficiency) : undefined,
      attendance_rate: form.attendance_rate ? Number(form.attendance_rate) : undefined,
      enrollment: form.enrollment ? Number(form.enrollment) : undefined,
      teacher_retention: form.teacher_retention ? Number(form.teacher_retention) : undefined,
      current_revenue: form.current_revenue ? Number(form.current_revenue) : undefined,
      years_operating: form.years_operating ? Number(form.years_operating) : undefined,
      reading_growth: form.reading_growth ? Number(form.reading_growth) : undefined,
      math_growth: form.math_growth ? Number(form.math_growth) : undefined,
      status: 'pending_review',
      description: [form.problem, form.solution, form.vision].filter(Boolean).join('\n\n'),
    });
    // Generate opportunity thesis
    if (deal?.id) {
      const res = await base44.functions.invoke('generateThesis', { type: 'founder', data: { ...form, ...deal } });
      if (res.data?.thesis) {
        await base44.entities.DealRoom.update(deal.id, { opportunity_thesis: res.data.thesis });
      }
      // Score pitch readiness
      await base44.functions.invoke('computePitchReadiness', { deal_id: deal.id });
    }
    queryClient.invalidateQueries({ queryKey: ['deals'] });
    queryClient.invalidateQueries({ queryKey: ['my-deals'] });
    setSubmitting(false);
    setSubmitted(true);
  };

  const handleClose = () => {
    setStep(0);
    setSubmitted(false);
    setForm(EMPTY_FORM);
    onClose();
  };

  if (submitted) return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <div className="py-8 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-foreground flex items-center justify-center mx-auto">
            <CheckCircle className="w-7 h-7 text-background" />
          </div>
          <div>
            <h3 className="font-heading text-xl font-bold">Submitted for Review</h3>
            <p className="text-muted-foreground text-sm mt-2 max-w-xs mx-auto">
              Your opportunity is under review. Once approved, it will appear in the Deal Room and matched with aligned edVestors.
            </p>
          </div>
          <div className="bg-muted rounded-xl p-4 text-xs text-muted-foreground text-left space-y-1.5">
            <div className="font-medium text-foreground mb-2">What happens next</div>
            <div>→ Admin reviews within 24–48 hours</div>
            <div>→ Your pitch readiness score is calculated</div>
            <div>→ AI matches you with aligned edVestors</div>
            <div>→ Investors can request introductions</div>
          </div>
          <Button onClick={handleClose} className="rounded-xl w-full bg-foreground text-background">Done</Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">Submit Opportunity</DialogTitle>
          <div className="flex items-center gap-0.5 mt-3">
            {STEPS.map((s, i) => (
              <div key={s} className={`h-1 flex-1 rounded-full transition-all ${i <= step ? 'bg-foreground' : 'bg-muted'}`} />
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Step {step + 1} of {STEPS.length}: <span className="font-medium text-foreground">{STEPS[step]}</span></p>
        </DialogHeader>

        <div className="space-y-4 mt-2">

          {/* STEP 0 — Founder Profile */}
          {step === 0 && (
            <>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">About You</div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-widest text-muted-foreground">Founder Background</Label>
                <Textarea placeholder="Your experience, background, and what led you to this work..." className="rounded-xl min-h-[80px]" value={form.founder_background} onChange={e => up('founder_background', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-widest text-muted-foreground">Track Record & Prior Results</Label>
                <Textarea placeholder="Prior outcomes, schools built, awards, milestones..." className="rounded-xl min-h-[80px]" value={form.founder_track_record} onChange={e => up('founder_track_record', e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-widest text-muted-foreground">Years Operating</Label>
                  <Input type="number" placeholder="5" value={form.years_operating} onChange={e => up('years_operating', e.target.value)} className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-widest text-muted-foreground">Profile Photo URL</Label>
                  <Input placeholder="https://..." value={form.founder_photo} onChange={e => up('founder_photo', e.target.value)} className="rounded-xl" />
                </div>
              </div>
            </>
          )}

          {/* STEP 1 — Basics */}
          {step === 1 && (
            <>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Organization Details</div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-widest text-muted-foreground">Organization Name</Label>
                  <Input placeholder="Horizon Academy" value={form.organization} onChange={e => up('organization', e.target.value)} className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-widest text-muted-foreground">City, State</Label>
                  <Input placeholder="Atlanta, GA" value={form.location} onChange={e => up('location', e.target.value)} className="rounded-xl" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-widest text-muted-foreground">Stage</Label>
                  <Select value={form.stage} onValueChange={v => up('stage', v)}>
                    <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="idea">Idea</SelectItem>
                      <SelectItem value="launch">Launch</SelectItem>
                      <SelectItem value="early_traction">Early Traction</SelectItem>
                      <SelectItem value="growth">Growth</SelectItem>
                      <SelectItem value="turnaround">Turnaround</SelectItem>
                      <SelectItem value="acquisition">Acquisition</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-widest text-muted-foreground">Education Type</Label>
                  <Select value={form.education_type} onValueChange={v => up('education_type', v)}>
                    <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="charter">Charter</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="higher_ed">Higher Ed</SelectItem>
                      <SelectItem value="edtech">EdTech</SelectItem>
                      <SelectItem value="services">Services</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-widest text-muted-foreground">Geography / Region Served</Label>
                <Input placeholder="e.g. Southeast US, National, Texas" value={form.geography} onChange={e => up('geography', e.target.value)} className="rounded-xl" />
              </div>
            </>
          )}

          {/* STEP 2 — Opportunity */}
          {step === 2 && (
            <>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Your Investment Case</div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-widest text-muted-foreground">The Problem</Label>
                <Textarea placeholder="What problem are you solving and for whom?" className="rounded-xl min-h-[70px]" value={form.problem} onChange={e => up('problem', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-widest text-muted-foreground">Your Solution</Label>
                <Textarea placeholder="How are you solving it? What's your model?" className="rounded-xl min-h-[70px]" value={form.solution} onChange={e => up('solution', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-widest text-muted-foreground">Evidence of Traction</Label>
                <Textarea placeholder="Results, wins, milestones, proof points..." className="rounded-xl min-h-[60px]" value={form.evidence_of_traction} onChange={e => up('evidence_of_traction', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-widest text-muted-foreground">Risks</Label>
                <Textarea placeholder="What could go wrong? Honest assessment builds trust." className="rounded-xl min-h-[60px]" value={form.risks} onChange={e => up('risks', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-widest text-muted-foreground">Impact Focus</Label>
                <Select value={form.impact_focus} onValueChange={v => up('impact_focus', v)}>
                  <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {IMPACT_OPTS.map(o => <SelectItem key={o} value={o}>{IMPACT_LABELS[o]}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-widest text-muted-foreground">Desired Investor Involvement</Label>
                <div className="flex flex-wrap gap-2">
                  {INVOLVEMENT_OPTS.map(o => (
                    <button key={o} type="button" onClick={() => up('desired_investor_involvement', o)}
                      className={cn('px-3 py-1.5 rounded-xl text-xs font-medium border transition-all',
                        form.desired_investor_involvement === o
                          ? 'bg-foreground text-background border-foreground'
                          : 'border-border hover:border-foreground/40'
                      )}>
                      {INVOLVEMENT_LABELS[o]}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-widest text-muted-foreground">Risk Profile</Label>
                <div className="flex gap-2">
                  {['conservative','balanced','bold','transformational'].map(r => (
                    <button key={r} type="button" onClick={() => up('risk_profile', r)}
                      className={cn('flex-1 py-2 rounded-xl text-xs font-medium border capitalize transition-all',
                        form.risk_profile === r ? 'bg-foreground text-background border-foreground' : 'border-border hover:border-foreground/40'
                      )}>
                      {r}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-widest text-muted-foreground">Capital Type Requested</Label>
                <MultiPills options={CAPITAL_TYPES} labels={CAPITAL_LABELS} selected={form.capital_type_requested} onChange={v => up('capital_type_requested', v)} />
              </div>
            </>
          )}

          {/* STEP 3 — School Data */}
          {step === 3 && (
            <>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Performance Metrics (leave blank if N/A)</div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Reading Proficiency (%)</Label>
                  <Input type="number" placeholder="74" value={form.reading_proficiency} onChange={e => up('reading_proficiency', e.target.value)} className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Math Proficiency (%)</Label>
                  <Input type="number" placeholder="68" value={form.math_proficiency} onChange={e => up('math_proficiency', e.target.value)} className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Reading Growth (%)</Label>
                  <Input type="number" placeholder="12" value={form.reading_growth} onChange={e => up('reading_growth', e.target.value)} className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Math Growth (%)</Label>
                  <Input type="number" placeholder="10" value={form.math_growth} onChange={e => up('math_growth', e.target.value)} className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Attendance Rate (%)</Label>
                  <Input type="number" placeholder="95" value={form.attendance_rate} onChange={e => up('attendance_rate', e.target.value)} className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Enrollment (students)</Label>
                  <Input type="number" placeholder="450" value={form.enrollment} onChange={e => up('enrollment', e.target.value)} className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Teacher Retention (%)</Label>
                  <Input type="number" placeholder="88" value={form.teacher_retention} onChange={e => up('teacher_retention', e.target.value)} className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Current Revenue / Budget ($)</Label>
                  <Input type="number" placeholder="3500000" value={form.current_revenue} onChange={e => up('current_revenue', e.target.value)} className="rounded-xl" />
                </div>
              </div>
            </>
          )}

          {/* STEP 4 — Funding */}
          {step === 4 && (
            <>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Capital Ask</div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-widest text-muted-foreground">Total Raise ($)</Label>
                  <Input type="number" placeholder="2000000" value={form.amount_seeking} onChange={e => up('amount_seeking', e.target.value)} className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-widest text-muted-foreground">Minimum Investment ($)</Label>
                  <Input type="number" placeholder="100000" value={form.minimum_investment} onChange={e => up('minimum_investment', e.target.value)} className="rounded-xl" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-widest text-muted-foreground">Use of Funds</Label>
                <Textarea placeholder="How will you deploy the capital? Be specific with allocations." className="rounded-xl min-h-[80px]" value={form.use_of_funds} onChange={e => up('use_of_funds', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-widest text-muted-foreground">Growth Plan</Label>
                <Textarea placeholder="3–5 year growth trajectory..." className="rounded-xl min-h-[60px]" value={form.growth_plan} onChange={e => up('growth_plan', e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-widest text-muted-foreground">Timeline to Close</Label>
                  <Input placeholder="e.g. Q3 2025" value={form.timeline} onChange={e => up('timeline', e.target.value)} className="rounded-xl" />
                </div>
              </div>

              {/* Thesis generator */}
              <div className="pt-4 border-t border-border/40 space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs uppercase tracking-widest text-muted-foreground">One-Line Opportunity Thesis</Label>
                  <Button size="sm" variant="outline" className="rounded-xl text-xs gap-1.5 h-7" onClick={generateThesis} disabled={generatingThesis}>
                    <Sparkles className="w-3 h-3" />
                    {generatingThesis ? 'Generating…' : 'AI Generate'}
                  </Button>
                </div>
                <Input
                  placeholder='e.g. "Growth-stage charter seeking $1.5M for literacy expansion and teacher retention"'
                  value={form.thesis}
                  onChange={e => up('thesis', e.target.value)}
                  className="rounded-xl"
                />
              </div>
            </>
          )}

          {/* STEP 5 — Documents */}
          {step === 5 && (
            <>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Upload Documents (paste URLs)</div>
              <p className="text-xs text-muted-foreground">Documents unlock investor confidence. Upload to cloud storage and paste the link below.</p>
              {[
                { key: 'pitch_deck_url', label: 'Pitch Deck', required: true },
                { key: 'financials_url', label: 'Financials', required: true },
                { key: 'growth_plan_url', label: 'Growth Plan' },
                { key: 'data_report_url', label: 'Data / Outcomes Report' },
                { key: 'board_deck_url', label: 'Board Deck' },
                { key: 'legal_docs_url', label: 'Legal Documents' },
              ].map(doc => (
                <div key={doc.key} className="space-y-1">
                  <Label className="text-xs text-muted-foreground">
                    {doc.label} {doc.required && <span className="text-amber-600">*</span>}
                  </Label>
                  <Input
                    placeholder="https://drive.google.com/..."
                    value={form[doc.key]}
                    onChange={e => up(doc.key, e.target.value)}
                    className="rounded-xl text-xs"
                  />
                </div>
              ))}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
                Documents marked with <span className="text-amber-600 font-medium">*</span> are strongly recommended. Missing documents reduce your pitch readiness score.
              </div>
            </>
          )}

          {/* STEP 6 — Review */}
          {step === 6 && (
            <div className="space-y-3">
              <div className="bg-muted rounded-xl p-4 space-y-2 text-sm">
                <div><span className="text-muted-foreground">Organization:</span> <strong>{form.organization || '—'}</strong></div>
                <div><span className="text-muted-foreground">Stage:</span> <strong className="capitalize">{form.stage?.replace('_', ' ')}</strong></div>
                <div><span className="text-muted-foreground">Type:</span> <strong>{form.education_type}</strong></div>
                <div><span className="text-muted-foreground">Location:</span> <strong>{form.location || '—'}</strong></div>
                <div><span className="text-muted-foreground">Seeking:</span> <strong>${Number(form.amount_seeking || 0).toLocaleString()}</strong></div>
                <div><span className="text-muted-foreground">Capital Type:</span> <strong>{(form.capital_type_requested || []).map(c => CAPITAL_LABELS[c]).join(', ') || '—'}</strong></div>
                {form.thesis && <div className="italic text-muted-foreground pt-2 border-t border-border/40">"{form.thesis}"</div>}
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { label: 'Pitch Deck', val: form.pitch_deck_url },
                  { label: 'Financials', val: form.financials_url },
                  { label: 'Growth Plan', val: form.growth_plan_url || form.growth_plan },
                  { label: 'Data Report', val: form.data_report_url },
                ].map(d => (
                  <div key={d.label} className={cn('flex items-center gap-1.5 rounded-lg px-3 py-2 border', d.val ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-muted text-muted-foreground')}>
                    <CheckCircle className={cn('w-3 h-3', d.val ? 'opacity-100' : 'opacity-30')} />
                    {d.label}
                  </div>
                ))}
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
                Your submission will go to admin review before appearing in the Deal Room. Admin typically reviews within 24–48 hours.
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2 border-t border-border/40">
            {step > 0 && (
              <Button variant="outline" onClick={() => setStep(s => s - 1)} className="rounded-xl gap-1">
                <ChevronLeft className="w-4 h-4" /> Back
              </Button>
            )}
            {step < STEPS.length - 1 ? (
              <Button onClick={() => setStep(s => s + 1)} className="flex-1 rounded-xl gap-1 bg-foreground text-background hover:bg-foreground/85">
                Next <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={submitting} className="flex-1 rounded-xl bg-foreground text-background hover:bg-foreground/85">
                {submitting ? 'Submitting…' : 'Submit for Review'}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}