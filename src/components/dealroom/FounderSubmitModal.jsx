import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, ChevronRight, ChevronLeft } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useQueryClient } from '@tanstack/react-query';

const STEPS = ['Basics', 'Opportunity', 'Data', 'Funding', 'Review'];

export default function FounderSubmitModal({ open, onClose, user }) {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    organization: '', location: '', stage: 'early', education_type: 'charter',
    thesis: '', problem: '', solution: '', vision: '',
    reading_proficiency: '', math_proficiency: '', attendance_rate: '', enrollment: '',
    amount_seeking: '', minimum_investment: '', use_of_funds: '', timeline: '',
    description: '', geography: '',
  });

  const up = (k, v) => setForm(f => ({...f, [k]: v}));

  const handleSubmit = async () => {
    setSubmitting(true);
    await base44.entities.DealRoom.create({
      ...form,
      title: form.thesis || `${form.organization} — ${form.stage} Round`,
      founder_email: user?.email,
      founder_name: user?.full_name || 'Anonymous',
      amount_seeking: form.amount_seeking ? Number(form.amount_seeking) : undefined,
      minimum_investment: form.minimum_investment ? Number(form.minimum_investment) : undefined,
      reading_proficiency: form.reading_proficiency ? Number(form.reading_proficiency) : undefined,
      math_proficiency: form.math_proficiency ? Number(form.math_proficiency) : undefined,
      attendance_rate: form.attendance_rate ? Number(form.attendance_rate) : undefined,
      enrollment: form.enrollment ? Number(form.enrollment) : undefined,
      status: 'pending_review',
      description: form.description || [form.problem, form.solution, form.vision].filter(Boolean).join('\n\n'),
    });
    queryClient.invalidateQueries({ queryKey: ['deals'] });
    setSubmitting(false);
    setSubmitted(true);
  };

  const handleClose = () => {
    setStep(0);
    setSubmitted(false);
    setForm({
      organization: '', location: '', stage: 'early', education_type: 'charter',
      thesis: '', problem: '', solution: '', vision: '',
      reading_proficiency: '', math_proficiency: '', attendance_rate: '', enrollment: '',
      amount_seeking: '', minimum_investment: '', use_of_funds: '', timeline: '',
      description: '', geography: '',
    });
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
              Your opportunity is under review. Once approved, it will appear in the Deal Room.
            </p>
          </div>
          <div className="bg-muted rounded-xl p-4 text-xs text-muted-foreground text-left space-y-1">
            <div className="font-medium text-foreground mb-2">What happens next</div>
            <div>→ Admin reviews within 24–48 hours</div>
            <div>→ You'll be notified when it goes live</div>
            <div>→ Investors can then request introductions</div>
          </div>
          <Button onClick={handleClose} className="rounded-xl w-full">Done</Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">Submit Opportunity</DialogTitle>
          <div className="flex items-center gap-1 mt-3">
            {STEPS.map((s, i) => (
              <React.Fragment key={s}>
                <div className={`h-1 flex-1 rounded-full transition-all ${i <= step ? 'bg-foreground' : 'bg-muted'}`} />
              </React.Fragment>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Step {step + 1} of {STEPS.length}: {STEPS[step]}</p>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {step === 0 && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Organization Name</Label>
                  <Input placeholder="Horizon Academy" value={form.organization} onChange={e => up('organization', e.target.value)} className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input placeholder="Atlanta, GA" value={form.location} onChange={e => up('location', e.target.value)} className="rounded-xl" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Stage</Label>
                  <Select value={form.stage} onValueChange={v => up('stage', v)}>
                    <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="idea">Idea Stage</SelectItem>
                      <SelectItem value="seed">Seed</SelectItem>
                      <SelectItem value="early">Early</SelectItem>
                      <SelectItem value="growth">Growth</SelectItem>
                      <SelectItem value="turnaround">Turnaround</SelectItem>
                      <SelectItem value="acquisition">Acquisition</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Education Type</Label>
                  <Select value={form.education_type} onValueChange={v => up('education_type', v)}>
                    <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="charter">Charter</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="higher_ed">Higher Ed</SelectItem>
                      <SelectItem value="edtech">EdTech</SelectItem>
                      <SelectItem value="services">Services</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>One-line investment thesis</Label>
                <Input placeholder='e.g. "Turning around a 300-student charter from 22% to 80% proficiency"' value={form.thesis} onChange={e => up('thesis', e.target.value)} className="rounded-xl" />
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <div className="space-y-2">
                <Label>The Problem</Label>
                <Textarea placeholder="What problem are you solving and for whom?" className="rounded-xl min-h-[80px]" value={form.problem} onChange={e => up('problem', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Your Solution</Label>
                <Textarea placeholder="How are you solving it? What's your model?" className="rounded-xl min-h-[80px]" value={form.solution} onChange={e => up('solution', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>The Vision</Label>
                <Textarea placeholder="Where does this go in 5–10 years?" className="rounded-xl min-h-[80px]" value={form.vision} onChange={e => up('vision', e.target.value)} />
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <p className="text-xs text-muted-foreground">Share your key performance metrics (leave blank if not applicable)</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Reading Proficiency (%)</Label>
                  <Input type="number" placeholder="74" value={form.reading_proficiency} onChange={e => up('reading_proficiency', e.target.value)} className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>Math Proficiency (%)</Label>
                  <Input type="number" placeholder="68" value={form.math_proficiency} onChange={e => up('math_proficiency', e.target.value)} className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>Attendance Rate (%)</Label>
                  <Input type="number" placeholder="95" value={form.attendance_rate} onChange={e => up('attendance_rate', e.target.value)} className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>Enrollment (students)</Label>
                  <Input type="number" placeholder="450" value={form.enrollment} onChange={e => up('enrollment', e.target.value)} className="rounded-xl" />
                </div>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Total Raise ($)</Label>
                  <Input type="number" placeholder="2000000" value={form.amount_seeking} onChange={e => up('amount_seeking', e.target.value)} className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>Minimum Investment ($)</Label>
                  <Input type="number" placeholder="100000" value={form.minimum_investment} onChange={e => up('minimum_investment', e.target.value)} className="rounded-xl" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Use of Funds</Label>
                <Textarea placeholder="How will you deploy the capital?" className="rounded-xl min-h-[80px]" value={form.use_of_funds} onChange={e => up('use_of_funds', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Timeline</Label>
                <Input placeholder="e.g. Close by Q3 2025, deploy over 18 months" value={form.timeline} onChange={e => up('timeline', e.target.value)} className="rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label>Geography</Label>
                <Input placeholder="e.g. Southeast US, National" value={form.geography} onChange={e => up('geography', e.target.value)} className="rounded-xl" />
              </div>
            </>
          )}

          {step === 4 && (
            <div className="space-y-3">
              <div className="bg-muted rounded-xl p-4 space-y-2 text-sm">
                <div><span className="text-muted-foreground">Organization:</span> <strong>{form.organization || '—'}</strong></div>
                <div><span className="text-muted-foreground">Stage:</span> <strong>{form.stage}</strong></div>
                <div><span className="text-muted-foreground">Type:</span> <strong>{form.education_type}</strong></div>
                <div><span className="text-muted-foreground">Seeking:</span> <strong>${Number(form.amount_seeking || 0).toLocaleString()}</strong></div>
                <div><span className="text-muted-foreground">Thesis:</span> <span className="italic">{form.thesis || '—'}</span></div>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
                Your submission will go to admin review before appearing in the Deal Room. Typically approved within 24–48 hours.
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            {step > 0 && (
              <Button variant="outline" onClick={() => setStep(s => s - 1)} className="rounded-xl gap-1">
                <ChevronLeft className="w-4 h-4" /> Back
              </Button>
            )}
            {step < STEPS.length - 1 ? (
              <Button onClick={() => setStep(s => s + 1)} className="flex-1 rounded-xl gap-1">
                Next <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={submitting} className="flex-1 rounded-xl bg-foreground text-background">
                {submitting ? 'Submitting...' : 'Submit for Review'}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}