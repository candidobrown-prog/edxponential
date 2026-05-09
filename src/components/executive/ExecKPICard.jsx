import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

export default function ExecKPICard({ label, value, sub, icon: Icon, trend, trendDir = 'up', loading, dark = false, size = 'md' }) {
  const trendColor = trendDir === 'up' ? 'text-green-400' : trendDir === 'down' ? 'text-red-400' : 'text-white/30';
  const TrendIcon = trendDir === 'up' ? ArrowUpRight : trendDir === 'down' ? ArrowDownRight : Minus;

  if (dark) {
    return (
      <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5 space-y-3 hover:bg-white/[0.06] transition-colors">
        <div className="flex items-center justify-between">
          {Icon && <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center"><Icon className="w-4 h-4 text-white/60" /></div>}
          {trend && (
            <div className={`flex items-center gap-1 ${trendColor}`}>
              <TrendIcon className="w-3 h-3" />
              <span className="text-[10px] font-black">{trend}</span>
            </div>
          )}
        </div>
        {loading ? (
          <div className="h-8 bg-white/10 rounded-lg animate-pulse" />
        ) : (
          <p className={`font-black text-white leading-none ${size === 'lg' ? 'text-3xl' : size === 'sm' ? 'text-xl' : 'text-2xl'}`}>{value}</p>
        )}
        <div>
          <p className="text-white/50 text-xs font-bold">{label}</p>
          {sub && <p className="text-white/25 text-[10px] mt-0.5">{sub}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-5 space-y-3 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        {Icon && <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center"><Icon className="w-4 h-4 text-muted-foreground" /></div>}
        {trend && (
          <div className={`flex items-center gap-1 ${trendDir === 'up' ? 'text-green-600' : trendDir === 'down' ? 'text-red-600' : 'text-muted-foreground'}`}>
            <TrendIcon className="w-3 h-3" />
            <span className="text-[10px] font-black">{trend}</span>
          </div>
        )}
      </div>
      {loading ? (
        <div className="h-8 bg-muted rounded-lg animate-pulse" />
      ) : (
        <p className={`font-black text-foreground leading-none ${size === 'lg' ? 'text-3xl' : size === 'sm' ? 'text-xl' : 'text-2xl'}`}>{value}</p>
      )}
      <div>
        <p className="text-muted-foreground text-xs font-bold">{label}</p>
        {sub && <p className="text-muted-foreground/60 text-[10px] mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}