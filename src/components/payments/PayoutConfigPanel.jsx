import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, Settings, Zap, Pause, Play } from 'lucide-react';
import { toast } from 'sonner';

const BRANDS = [
  'edxponential_core', 'whalledoh', 'tilii', 'twotrx', 'onejob',
  'edxportante', 'xschores', 'coaching', 'deal_room', 'communities',
];

export default function PayoutConfigPanel() {
  const queryClient = useQueryClient();
  const { data: configs = [], isLoading } = useQuery({
    queryKey: ['payout_configs'],
    queryFn: () => base44.entities.PayoutConfig.list(),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.PayoutConfig.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['payout_configs'] }); toast.success('Payout config updated'); },
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.PayoutConfig.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['payout_configs'] }); toast.success('Config created'); },
  });

  const getConfig = (brand) => configs.find(c => c.brand === brand);

  const handleTogglePause = (brand) => {
    const config = getConfig(brand);
    if (config) {
      updateMutation.mutate({ id: config.id, data: { payout_paused: !config.payout_paused } });
    } else {
      createMutation.mutate({ brand, payout_paused: true, schedule: 'weekly', platform_fee_pct: 20, creator_pct: 80 });
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-black text-white rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-1">
          <Zap className="w-5 h-5 text-white/60" />
          <h3 className="font-black text-base">Automatic Payout Engine</h3>
        </div>
        <p className="text-white/40 text-sm">Configure revenue split ratios, payout schedules, and routing preferences per brand or globally.</p>
      </div>

      <div className="grid gap-4">
        {BRANDS.map(brand => {
          const config = getConfig(brand);
          const isPaused = config?.payout_paused;
          return (
            <div key={brand} className="bg-card border border-border rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-black capitalize">{brand.replace(/_/g, ' ')}</p>
                  <p className="text-xs text-muted-foreground">
                    Platform: {config?.platform_fee_pct ?? 20}% · Creator: {config?.creator_pct ?? 80}% · Schedule: {config?.schedule ?? 'weekly'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {isPaused ? (
                    <span className="text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-full flex items-center gap-1"><Pause className="w-3 h-3" /> Paused</span>
                  ) : (
                    <span className="text-xs font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-full flex items-center gap-1"><Play className="w-3 h-3" /> Active</span>
                  )}
                  <Button variant="outline" size="sm" className="rounded-xl text-xs gap-1.5 h-7"
                    onClick={() => handleTogglePause(brand)}>
                    {isPaused ? <><Play className="w-3 h-3" /> Resume</> : <><Pause className="w-3 h-3" /> Pause</>}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Platform Fee %</label>
                  <Input type="number" defaultValue={config?.platform_fee_pct ?? 20} min={0} max={100} className="h-8 text-sm rounded-lg"
                    onBlur={e => {
                      const val = parseInt(e.target.value);
                      if (config) updateMutation.mutate({ id: config.id, data: { platform_fee_pct: val, creator_pct: 100 - val } });
                      else createMutation.mutate({ brand, platform_fee_pct: val, creator_pct: 100 - val, schedule: 'weekly' });
                    }} />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Creator/Partner %</label>
                  <Input type="number" value={100 - (config?.platform_fee_pct ?? 20)} readOnly className="h-8 text-sm rounded-lg bg-muted" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Schedule</label>
                  <Select defaultValue={config?.schedule ?? 'weekly'}
                    onValueChange={v => {
                      if (config) updateMutation.mutate({ id: config.id, data: { schedule: v } });
                      else createMutation.mutate({ brand, schedule: v, platform_fee_pct: 20, creator_pct: 80 });
                    }}>
                    <SelectTrigger className="h-8 text-sm rounded-lg"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="instant">Instant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}