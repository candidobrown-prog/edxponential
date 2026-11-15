import React from 'react';
import { ArrowUpRight, DollarSign, TrendingUp, Zap, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';

const colorMap = {
  default: { bg: 'bg-black', text: 'text-white', icon: 'text-white/60' },
  green: { bg: 'bg-green-50', text: 'text-green-900', icon: 'text-green-500' },
  red: { bg: 'bg-red-50', text: 'text-red-900', icon: 'text-red-500' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-900', icon: 'text-amber-500' },
  orange: { bg: 'bg-orange-50', text: 'text-orange-900', icon: 'text-orange-500' },
};

export default function FinancialMetricCard({ label, value, icon: Icon, trend, color = 'default', loading }) {
  const c = colorMap[color] || colorMap.default;
  return (
    <div className={`${c.bg} rounded-2xl p-5 space-y-2`}>
      <div className="flex items-center justify-between">
        <Icon className={`w-4 h-4 ${c.icon}`} />
        {trend && (
          <div className="flex items-center gap-0.5 text-green-500">
            <ArrowUpRight className="w-3 h-3" />
            <span className="text-[10px] font-black">{trend}</span>
          </div>
        )}
      </div>
      {loading ? (
        <div className="h-8 bg-current opacity-10 rounded-lg animate-pulse" />
      ) : (
        <p className={`text-2xl font-black ${c.text} leading-none`}>{value}</p>
      )}
      <p className={`text-xs font-bold ${color === 'default' ? 'text-white/40' : 'text-current opacity-60'}`}>{label}</p>
    </div>
  );
}