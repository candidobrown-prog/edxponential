/**
 * SecureCheckoutBadges — Trust indicators for any checkout page
 */
import React from 'react';
import { Lock, Shield, CheckCircle, CreditCard } from 'lucide-react';

const BADGES = [
  { icon: Lock, label: 'Secure Checkout' },
  { icon: Shield, label: 'PCI Compliant' },
  { icon: CheckCircle, label: 'Encrypted Payments' },
  { icon: CreditCard, label: 'All Major Cards' },
];

export default function SecureCheckoutBadges({ variant = 'row', className = '' }) {
  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-1.5 ${className}`}>
        <Lock className="w-3 h-3 text-muted-foreground" />
        <span className="text-[11px] font-semibold text-muted-foreground">Secure · Encrypted · PCI Compliant</span>
      </div>
    );
  }

  return (
    <div className={`flex flex-wrap items-center gap-3 justify-center ${className}`}>
      {BADGES.map(({ icon: Icon, label }) => (
        <div key={label} className="flex items-center gap-1.5 text-muted-foreground">
          <Icon className="w-3.5 h-3.5" />
          <span className="text-[11px] font-semibold">{label}</span>
        </div>
      ))}
    </div>
  );
}