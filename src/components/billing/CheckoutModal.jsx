import React, { useState } from 'react';
import { X, CreditCard, Shield, CheckCircle, AlertCircle, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const PAYMENT_METHODS = [
  { id: 'card_on_file', label: 'Card on file', sub: 'Visa ••••4242', icon: CreditCard },
  { id: 'new_card', label: 'Add a new card', sub: 'Credit or debit card', icon: CreditCard },
  { id: 'paypal', label: 'PayPal', sub: 'Pay securely with PayPal', icon: Shield },
  { id: 'affirm', label: 'Affirm', sub: 'Pay over time — subject to approval', icon: Shield },
];

export default function CheckoutModal({ onClose, booking }) {
  const [paymentMethod, setPaymentMethod] = useState('card_on_file');
  const [authorized, setAuthorized] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const tax = (booking?.price || 0) * 0.0725;
  const fee = 5;
  const total = (booking?.price || 0) + tax + fee;

  const handleSubmit = async () => {
    if (!authorized) { toast.error('Please authorize the payment first.'); return; }
    setProcessing(true);
    await new Promise(r => setTimeout(r, 1800));
    setProcessing(false);
    setSuccess(true);
    setTimeout(() => { onClose(); toast.success('Booking confirmed! A receipt has been sent to your email.'); }, 2000);
  };

  if (!booking) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-background border border-border rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="font-heading text-xl font-bold">Confirm Booking & Payment</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-muted"><X className="w-5 h-5" /></button>
        </div>

        {success ? (
          <div className="p-10 text-center">
            <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-4" />
            <h3 className="font-heading text-xl font-bold mb-2">Payment Successful!</h3>
            <p className="text-muted-foreground text-sm">Your booking has been confirmed. Check your email for the receipt.</p>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            {/* Order Summary */}
            <div className="bg-muted/40 rounded-xl p-4 space-y-2">
              <h3 className="font-semibold text-sm mb-3">Session Summary</h3>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">edVisor</span><span className="font-semibold">{booking.edvisor || 'Dr. Williams'}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Session Type</span><span>{booking.type || '1-on-1 Coaching'}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Date & Time</span><span>{booking.datetime || 'May 15, 2026 at 2:00 PM'}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Duration</span><span>{booking.duration || '60 minutes'}</span></div>
              </div>
              <div className="border-t border-border mt-3 pt-3 space-y-1.5 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Session Fee</span><span>${booking.price || 150}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Tax (7.25%)</span><span>${tax.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Platform Fee</span><span>${fee}</span></div>
                <div className="flex justify-between font-black text-base pt-1 border-t border-border"><span>Total Due Today</span><span>${total.toFixed(2)}</span></div>
              </div>
            </div>

            {/* Payment Methods */}
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-muted-foreground mb-2">
                Please confirm the payment method you would like to use for this session. Your booking will not be confirmed until payment is authorized.
              </p>
              <div className="space-y-2 mt-3">
                {PAYMENT_METHODS.map(m => {
                  const Icon = m.icon;
                  return (
                    <button key={m.id} onClick={() => setPaymentMethod(m.id)}
                      className={`w-full flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all text-left ${paymentMethod === m.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40'}`}>
                      <Icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <div>
                        <p className="text-sm font-bold">{m.label}</p>
                        <p className="text-xs text-muted-foreground">{m.sub}</p>
                      </div>
                      {paymentMethod === m.id && <CheckCircle className="w-4 h-4 text-primary ml-auto" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Authorization Checkbox */}
            <label className="flex items-start gap-3 cursor-pointer p-3 bg-muted/30 rounded-xl border border-border">
              <input type="checkbox" checked={authorized} onChange={e => setAuthorized(e.target.checked)} className="mt-0.5 rounded" />
              <span className="text-xs text-muted-foreground leading-relaxed">
                I authorize <strong>edXponential</strong> to charge my selected payment method for this session.
              </span>
            </label>

            <div className="flex items-center gap-1.5 text-xs text-muted-foreground justify-center">
              <Lock className="w-3 h-3" /> 256-bit SSL encrypted · Tokenized payments only
            </div>

            <Button onClick={handleSubmit} disabled={!authorized || processing} className="w-full rounded-xl h-11 font-bold">
              {processing ? 'Processing...' : `Pay $${total.toFixed(2)} & Confirm Booking`}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}