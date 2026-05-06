import React, { useState } from 'react';
import { CreditCard, Lock, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AddCardModal({ onClose, onAdd }) {
  const [card, setCard] = useState({ name: '', number: '', expiry: '', cvv: '', type: 'visa', saveForFuture: true });

  const formatNumber = v => v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  const formatExpiry = v => { const d = v.replace(/\D/g, '').slice(0, 4); return d.length >= 3 ? d.slice(0,2)+'/'+d.slice(2) : d; };

  const detectType = num => {
    const n = num.replace(/\s/g,'');
    if (n.startsWith('4')) return 'visa';
    if (n.startsWith('5') || n.startsWith('2')) return 'mastercard';
    if (n.startsWith('3')) return 'amex';
    if (n.startsWith('6')) return 'discover';
    return 'visa';
  };

  const isValid = card.name && card.number.replace(/\s/g,'').length === 16 && card.expiry.length === 5 && card.cvv.length >= 3;

  const handleSubmit = () => {
    onAdd({ type: detectType(card.number), last4: card.number.replace(/\s/g,'').slice(-4), expiry: card.expiry, name: card.name });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-background border border-border rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="font-heading text-lg font-bold">Add New Card</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-muted"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">Cardholder Name</label>
            <input placeholder="Jane Smith" value={card.name} onChange={e => setCard({...card, name: e.target.value})}
              className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">Card Number</label>
            <div className="relative">
              <input placeholder="1234 5678 9012 3456" value={card.number}
                onChange={e => setCard({...card, number: formatNumber(e.target.value)})}
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring pr-10" />
              <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">Expiry</label>
              <input placeholder="MM/YY" value={card.expiry} onChange={e => setCard({...card, expiry: formatExpiry(e.target.value)})}
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 block">CVV</label>
              <input placeholder="123" maxLength={4} value={card.cvv} onChange={e => setCard({...card, cvv: e.target.value.replace(/\D/g,'')})}
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={card.saveForFuture} onChange={e => setCard({...card, saveForFuture: e.target.checked})}
              className="rounded" />
            <span className="text-sm text-muted-foreground">Save card for future use</span>
          </label>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Lock className="w-3 h-3" /> Your card details are encrypted and tokenized. We never store raw card data.
          </div>
        </div>
        <div className="p-6 pt-0 flex gap-3">
          <Button variant="outline" className="flex-1 rounded-xl" onClick={onClose}>Cancel</Button>
          <Button className="flex-1 rounded-xl" disabled={!isValid} onClick={handleSubmit}>Add Card</Button>
        </div>
      </div>
    </div>
  );
}