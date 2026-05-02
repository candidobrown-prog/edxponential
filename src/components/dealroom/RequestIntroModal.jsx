import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, Lock } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useQueryClient } from '@tanstack/react-query';

export default function RequestIntroModal({ deal, open, onClose, userEmail }) {
  const [step, setStep] = useState('form'); // 'form' | 'success'
  const [form, setForm] = useState({
    investment_interest_range: '100k_500k',
    why_interested: '',
    invest_timeline: '3_6_months',
    intro_message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await base44.entities.Pipeline.create({
      investor_email: userEmail,
      deal_id: deal.id,
      deal_title: deal.title,
      founder_name: deal.founder_name,
      amount_seeking: deal.amount_seeking,
      stage: 'intro_requested',
      ...form,
      last_activity: new Date().toISOString().split('T')[0],
    });
    await base44.entities.DealRoom.update(deal.id, {
      intros_count: (deal.intros_count || 0) + 1,
    });
    queryClient.invalidateQueries({ queryKey: ['deals'] });
    queryClient.invalidateQueries({ queryKey: ['pipeline'] });
    setSubmitting(false);
    setStep('success');
  };

  const handleClose = () => {
    setStep('form');
    setForm({ investment_interest_range: '100k_500k', why_interested: '', invest_timeline: '3_6_months', intro_message: '' });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {step === 'success' ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-foreground flex items-center justify-center mx-auto">
              <CheckCircle className="w-7 h-7 text-background" />
            </div>
            <div>
              <h3 className="font-heading text-xl font-bold">Intro Requested</h3>
              <p className="text-muted-foreground text-sm mt-1">
                {deal.founder_name} has been notified. This deal is now in your pipeline.
              </p>
            </div>
            <div className="bg-muted rounded-xl p-4 text-xs text-muted-foreground text-left space-y-1">
              <div className="font-medium text-foreground mb-2">What happens next</div>
              <div>→ Founder reviews your profile within 48 hours</div>
              <div>→ If accepted, you'll receive a warm intro</div>
              <div>→ Track status in My Pipeline</div>
            </div>
            <Button onClick={handleClose} className="rounded-xl w-full">Go to My Pipeline</Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <div className="flex items-center gap-2 mb-1">
                <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Confidential</span>
              </div>
              <DialogTitle className="font-heading text-xl">Request Introduction</DialogTitle>
              <p className="text-sm text-muted-foreground">{deal.title}</p>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
              <div className="space-y-2">
                <Label>Investment Interest Range</Label>
                <Select value={form.investment_interest_range} onValueChange={v => setForm({...form, investment_interest_range: v})}>
                  <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under_100k">Under $100K</SelectItem>
                    <SelectItem value="100k_500k">$100K – $500K</SelectItem>
                    <SelectItem value="500k_1m">$500K – $1M</SelectItem>
                    <SelectItem value="1m_5m">$1M – $5M</SelectItem>
                    <SelectItem value="5m_plus">$5M+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Why are you interested in this opportunity?</Label>
                <Textarea
                  placeholder="Share what resonates with you about this deal..."
                  className="rounded-xl min-h-[90px]"
                  value={form.why_interested}
                  onChange={e => setForm({...form, why_interested: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Timeline to Invest</Label>
                <Select value={form.invest_timeline} onValueChange={v => setForm({...form, invest_timeline: v})}>
                  <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediately">Immediately</SelectItem>
                    <SelectItem value="1_3_months">1–3 months</SelectItem>
                    <SelectItem value="3_6_months">3–6 months</SelectItem>
                    <SelectItem value="6_12_months">6–12 months</SelectItem>
                    <SelectItem value="exploring">Just exploring</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Message to Founder <span className="text-muted-foreground font-normal">(optional)</span></Label>
                <Textarea
                  placeholder="Optional note to the founder..."
                  className="rounded-xl min-h-[70px]"
                  value={form.intro_message}
                  onChange={e => setForm({...form, intro_message: e.target.value})}
                />
              </div>
              <Button type="submit" disabled={submitting} className="w-full rounded-xl bg-foreground text-background hover:bg-foreground/85">
                {submitting ? 'Submitting...' : 'Submit Request'}
              </Button>
              <p className="text-[10px] text-muted-foreground text-center">
                Your request is confidential and only shared with the founder.
              </p>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}