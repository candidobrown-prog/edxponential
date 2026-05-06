import React, { useState } from 'react';
import { Zap, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const ACTIVE_SUBS = [
  { id: 'sub1', name: 'Founders Sphere', price: '$99/mo', renewsOn: '2026-06-01', status: 'active', canCancel: true },
  { id: 'sub2', name: 'edVisor Verification', price: '$249/mo', renewsOn: '2026-06-01', status: 'active', canCancel: true },
];

export default function SubscriptionPanel() {
  const [subs, setSubs] = useState(ACTIVE_SUBS);
  const [cancelling, setCancelling] = useState(null);

  const handleCancel = (id) => {
    if (cancelling === id) {
      setSubs(subs.map(s => s.id === id ? { ...s, status: 'cancelled' } : s));
      setCancelling(null);
      toast.success('Subscription cancelled. You retain access until the billing period ends.');
    } else {
      setCancelling(id);
    }
  };

  return (
    <div className="space-y-4">
      {subs.map(sub => (
        <div key={sub.id} className="bg-card border border-border/50 rounded-2xl p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-heading text-base font-bold">{sub.name}</h3>
                <Badge variant={sub.status === 'active' ? 'outline' : 'secondary'} className="text-xs">
                  {sub.status === 'active' ? 'Active' : 'Cancelled'}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{sub.price}</p>
              {sub.status === 'active' && (
                <p className="text-xs text-muted-foreground mt-1">Renews on {sub.renewsOn}</p>
              )}
            </div>
            {sub.canCancel && sub.status === 'active' && (
              <div className="flex flex-col items-end gap-2">
                {cancelling === sub.id && (
                  <p className="text-xs text-muted-foreground text-right max-w-[200px]">
                    Click again to confirm cancellation.
                  </p>
                )}
                <Button
                  variant={cancelling === sub.id ? 'destructive' : 'outline'}
                  size="sm" className="rounded-xl"
                  onClick={() => handleCancel(sub.id)}>
                  {cancelling === sub.id ? 'Confirm Cancel' : 'Cancel Subscription'}
                </Button>
              </div>
            )}
          </div>
        </div>
      ))}

      {subs.every(s => s.status === 'cancelled') && (
        <div className="bg-card border border-border/50 rounded-2xl p-8 text-center">
          <Zap className="w-8 h-8 mx-auto mb-3 text-muted-foreground opacity-40" />
          <p className="text-muted-foreground text-sm">No active subscriptions.</p>
          <Button className="mt-4 rounded-xl" onClick={() => window.location.href = '/pricing'}>Browse Plans</Button>
        </div>
      )}
    </div>
  );
}