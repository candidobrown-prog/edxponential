import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CalendarDays, Clock, CheckCircle2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function BookingModal({ coach, open, onClose, preselectedSlot }) {
  const [step, setStep] = useState('form'); // 'form' | 'confirmed'
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', date: '', time: '', notes: '' });

  // Sync preselectedSlot into form when modal opens
  useEffect(() => {
    if (open && preselectedSlot) {
      setForm(f => ({ ...f, date: preselectedSlot.date, time: preselectedSlot.time }));
    }
  }, [open, preselectedSlot]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Send a confirmation email to the user
    await base44.integrations.Core.SendEmail({
      to: form.email,
      subject: `Session Booked with ${coach.coach_name}`,
      body: `Hi ${form.name},\n\nYour ${coach.session_type?.replace('_', '-')} session with ${coach.coach_name} has been requested for ${form.date} at ${form.time}.\n\nNotes: ${form.notes || 'None'}\n\nYou will receive a confirmation from the coach shortly.\n\n— Exponential.org`,
    });
    setLoading(false);
    setStep('confirmed');
  };

  const handleClose = () => {
    setStep('form');
    setForm({ name: '', email: '', date: '', time: '', notes: '' });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">
            {step === 'confirmed' ? 'Session Requested!' : `Book a Session with ${coach?.coach_name}`}
          </DialogTitle>
        </DialogHeader>

        {step === 'confirmed' ? (
          <div className="flex flex-col items-center text-center py-6 gap-4">
            <CheckCircle2 className="w-14 h-14 text-green-500" />
            <p className="text-muted-foreground">
              Your booking request has been submitted. A confirmation email has been sent to <strong>{form.email}</strong>.
            </p>
            <Button onClick={handleClose} className="bg-secondary hover:bg-secondary/90 text-secondary-foreground w-full rounded-xl">
              Done
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Your Name</Label>
                <Input required placeholder="Full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input required type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1.5"><CalendarDays className="w-3.5 h-3.5" /> Preferred Date</Label>
                <Input required type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Preferred Time</Label>
                <Input required type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Notes (optional)</Label>
              <Textarea placeholder="Topics you'd like to cover, questions, or context..." value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className="resize-none h-20" />
            </div>
            <div className="bg-accent/50 rounded-xl p-3 text-sm text-muted-foreground flex justify-between items-center">
              <span>{coach?.session_type?.replace('_', '-')} · {coach?.duration_minutes} min</span>
              <span className="font-semibold text-foreground">${coach?.price} / session</span>
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-xl h-11 font-semibold">
              {loading ? 'Submitting...' : 'Confirm Booking Request'}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}