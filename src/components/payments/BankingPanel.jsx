import React from 'react';
import { Shield, Lock, CheckCircle, Building2, CreditCard, ArrowRight, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function BankingPanel() {
  return (
    <div className="space-y-6 max-w-3xl">
      {/* Verified Security Header */}
      <div className="bg-black text-white rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-black text-lg">Banking & Payout Infrastructure</h3>
            <p className="text-white/40 text-sm">Your connected accounts are encrypted and securely verified.</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 mt-4">
          {['Bank-Grade Encryption', 'ACH Verified', 'PCI Compliant', 'Stripe Treasury'].map(b => (
            <div key={b} className="flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1">
              <CheckCircle className="w-3 h-3 text-green-400" />
              <span className="text-xs font-bold text-white/80">{b}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stripe Connect CTA */}
      <div className="bg-card border-2 border-black rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-[#635BFF] rounded-xl flex items-center justify-center flex-shrink-0">
            <CreditCard className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="font-black text-base mb-1">Connect Your Business Bank Account</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Connect via Stripe's secure onboarding to enable automatic payouts to your verified business bank account.
              All revenue flows directly to your connected account on your configured schedule.
            </p>
            <div className="grid grid-cols-2 gap-3 mb-5 text-sm">
              {[
                ['ACH / Direct Deposit', 'Free · 2 business days'],
                ['Instant Payout', 'Available · 1.5% fee'],
                ['Wire Transfer', 'Available for large amounts'],
                ['International', 'Multi-currency support'],
              ].map(([method, detail]) => (
                <div key={method} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-xs">{method}</p>
                    <p className="text-[11px] text-muted-foreground">{detail}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button className="gap-2 rounded-xl">
              <Building2 className="w-4 h-4" /> Connect Bank Account via Stripe
              <ExternalLink className="w-3.5 h-3.5 opacity-60" />
            </Button>
          </div>
        </div>
      </div>

      {/* Additional payment methods */}
      <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
        <h4 className="font-black text-base">Payment Methods Supported</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { name: 'Stripe', desc: 'Primary processor', status: 'active' },
            { name: 'Apple Pay', desc: 'Mobile checkout', status: 'active' },
            { name: 'Google Pay', desc: 'Mobile checkout', status: 'active' },
            { name: 'ACH / Bank Transfer', desc: 'Direct bank payments', status: 'active' },
            { name: 'PayPal', desc: 'Alternative processor', status: 'available' },
            { name: 'Affirm / BNPL', desc: 'Buy now, pay later', status: 'available' },
          ].map(m => (
            <div key={m.name} className="border border-border rounded-xl p-3">
              <div className="flex items-center justify-between mb-1">
                <p className="font-bold text-sm">{m.name}</p>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${m.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-muted text-muted-foreground'}`}>
                  {m.status}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tax & Compliance */}
      <div className="bg-card border border-border rounded-2xl p-6 space-y-3">
        <h4 className="font-black text-base">Tax & Compliance</h4>
        <p className="text-sm text-muted-foreground">Stripe handles automatic tax calculation, 1099 generation, and VAT compliance. Export financial data for QuickBooks or Xero.</p>
        <div className="flex flex-wrap gap-2">
          {['Sales Tax Auto-Calc', 'VAT Support', '1099-K Reporting', 'QuickBooks Export', 'Xero Compatible', 'CSV Export'].map(f => (
            <span key={f} className="text-xs font-bold bg-muted px-3 py-1 rounded-full">{f}</span>
          ))}
        </div>
      </div>
    </div>
  );
}