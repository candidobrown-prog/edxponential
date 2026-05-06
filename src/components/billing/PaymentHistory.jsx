import React from 'react';
import { Download, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const HISTORY = [
  { id: 'inv001', date: '2026-05-01', description: 'Founders Sphere — Monthly', amount: 99, status: 'paid', method: 'Visa ••4242' },
  { id: 'inv002', date: '2026-04-22', description: 'edVisor Session — Dr. Williams', amount: 150, status: 'paid', method: 'Visa ••4242' },
  { id: 'inv003', date: '2026-04-01', description: 'Founders Sphere — Monthly', amount: 99, status: 'paid', method: 'Mastercard ••8210' },
  { id: 'inv004', date: '2026-03-15', description: 'Course: School Leadership Fundamentals', amount: 49, status: 'refunded', method: 'Visa ••4242' },
  { id: 'inv005', date: '2026-03-01', description: 'Founders Sphere — Monthly', amount: 99, status: 'paid', method: 'Mastercard ••8210' },
  { id: 'inv006', date: '2026-02-12', description: 'edVisor Session — Coach Rivera', amount: 120, status: 'failed', method: 'Visa ••4242' },
];

const STATUS_CONFIG = {
  paid: { label: 'Paid', icon: CheckCircle, color: 'text-green-600', badge: 'default' },
  refunded: { label: 'Refunded', icon: Clock, color: 'text-blue-600', badge: 'secondary' },
  failed: { label: 'Failed', icon: AlertCircle, color: 'text-red-600', badge: 'destructive' },
};

export default function PaymentHistory() {
  return (
    <div className="bg-card border border-border/50 rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-lg font-semibold">Payment History</h3>
        <Button variant="outline" size="sm" className="rounded-xl gap-1.5">
          <Download className="w-4 h-4" /> Export
        </Button>
      </div>

      {HISTORY.some(h => h.status === 'failed') && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          You have a failed payment. Please update your payment method.
        </div>
      )}

      <div className="space-y-2">
        {HISTORY.map(item => {
          const cfg = STATUS_CONFIG[item.status];
          const Icon = cfg.icon;
          return (
            <div key={item.id} className="flex items-center justify-between p-3.5 rounded-xl border border-border hover:bg-muted/30 transition-colors">
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${cfg.color} flex-shrink-0`} />
                <div>
                  <p className="text-sm font-semibold">{item.description}</p>
                  <p className="text-xs text-muted-foreground">{item.date} · {item.method}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-sm font-bold ${item.status === 'refunded' ? 'text-blue-600' : item.status === 'failed' ? 'text-red-600' : ''}`}>
                  {item.status === 'refunded' ? '-' : ''}${item.amount}
                </span>
                <Badge variant={cfg.badge === 'default' ? 'outline' : cfg.badge} className="text-xs">{cfg.label}</Badge>
                {item.status === 'paid' && (
                  <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                    <Download className="w-3 h-3 mr-1" /> Receipt
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}