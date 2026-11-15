import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Search, Filter, Users, Clock, TrendingDown, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const RISK_CONFIG = {
  high_value: { label: 'High-Value', color: 'text-green-400', bg: 'bg-green-400/10' },
  active: { label: 'Active', color: 'text-blue-400', bg: 'bg-blue-400/10' },
  declining: { label: 'Declining', color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  needs_outreach: { label: 'Needs Outreach', color: 'text-orange-400', bg: 'bg-orange-400/10' },
  inactive: { label: 'Inactive', color: 'text-red-400', bg: 'bg-red-400/10' },
};

function getRiskStatus(user, transactions) {
  const userTxns = transactions.filter(t => t.user_email === user.email && t.status === 'completed');
  const totalSpend = userTxns.reduce((s, t) => s + (t.amount_usd || 0), 0);
  const daysSinceJoin = (Date.now() - new Date(user.created_date)) / 86400000;
  if (totalSpend > 500) return 'high_value';
  if (daysSinceJoin < 30) return 'active';
  if (daysSinceJoin > 90 && totalSpend === 0) return 'inactive';
  if (daysSinceJoin > 60) return 'needs_outreach';
  return 'active';
}

function getEngagementScore(user, transactions) {
  const userTxns = transactions.filter(t => t.user_email === user.email && t.status === 'completed');
  const spend = userTxns.reduce((s, t) => s + (t.amount_usd || 0), 0);
  const daysSinceJoin = Math.max(1, (Date.now() - new Date(user.created_date)) / 86400000);
  return Math.min(100, Math.round((spend / daysSinceJoin) * 10 + (userTxns.length * 5)));
}

export default function ExecUsers() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [sort, setSort] = useState('newest');

  const { data: users = [], isLoading: uLoad } = useQuery({ queryKey: ['exec_users_full'], queryFn: () => base44.entities.User.list('-created_date', 500) });
  const { data: transactions = [] } = useQuery({ queryKey: ['exec_txns'], queryFn: () => base44.entities.Transaction.list('-created_date', 500) });

  const roles = [...new Set(users.map(u => u.role || 'user'))];

  const enriched = users.map(u => ({
    ...u,
    risk: getRiskStatus(u, transactions),
    engagementScore: getEngagementScore(u, transactions),
    totalSpend: transactions.filter(t => t.user_email === u.email && t.status === 'completed').reduce((s, t) => s + (t.amount_usd || 0), 0),
    purchaseCount: transactions.filter(t => t.user_email === u.email && t.status === 'completed').length,
    daysSinceJoin: Math.round((Date.now() - new Date(u.created_date)) / 86400000),
  }));

  const filtered = enriched
    .filter(u => {
      const matchSearch = !search || u.full_name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase());
      const matchRole = roleFilter === 'all' || (u.role || 'user') === roleFilter;
      const matchRisk = riskFilter === 'all' || u.risk === riskFilter;
      return matchSearch && matchRole && matchRisk;
    })
    .sort((a, b) => {
      if (sort === 'newest') return new Date(b.created_date) - new Date(a.created_date);
      if (sort === 'spend') return b.totalSpend - a.totalSpend;
      if (sort === 'engagement') return b.engagementScore - a.engagementScore;
      return 0;
    });

  // Stats
  const highValue = enriched.filter(u => u.risk === 'high_value').length;
  const inactive = enriched.filter(u => u.risk === 'inactive').length;
  const needsOutreach = enriched.filter(u => u.risk === 'needs_outreach').length;

  return (
    <div className="space-y-6">
      {/* Summary strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Users', value: users.length, icon: Users },
          { label: 'High-Value', value: highValue, icon: Star },
          { label: 'Needs Outreach', value: needsOutreach, icon: TrendingDown },
          { label: 'Inactive', value: inactive, icon: Clock },
        ].map((s, i) => (
          <div key={i} className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-4 flex items-center gap-3">
            <s.icon className="w-4 h-4 text-white/40 flex-shrink-0" />
            <div>
              <p className="text-xl font-black text-white">{s.value}</p>
              <p className="text-white/35 text-[11px] font-bold">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
          <Input className="pl-9 h-8 text-xs bg-white/[0.05] border-white/10 text-white placeholder:text-white/25 rounded-xl focus:border-white/30"
            placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-36 h-8 text-xs bg-white/[0.05] border-white/10 text-white/70 rounded-xl">
            <SelectValue placeholder="All Roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            {roles.map(r => <SelectItem key={r} value={r} className="capitalize">{r}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={riskFilter} onValueChange={setRiskFilter}>
          <SelectTrigger className="w-44 h-8 text-xs bg-white/[0.05] border-white/10 text-white/70 rounded-xl">
            <SelectValue placeholder="All Risk Levels" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Risk Levels</SelectItem>
            {Object.entries(RISK_CONFIG).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-40 h-8 text-xs bg-white/[0.05] border-white/10 text-white/70 rounded-xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="spend">Highest Spend</SelectItem>
            <SelectItem value="engagement">Engagement</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-white/25 text-xs ml-auto">{filtered.length} users</span>
      </div>

      {/* Table */}
      <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {['User', 'Role', 'Joined', 'Purchases', 'Total Spend', 'Engagement', 'Risk Status'].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left text-[10px] font-black text-white/25 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {uLoad ? (
                [...Array(8)].map((_, i) => (
                  <tr key={i}><td colSpan={7} className="px-5 py-3"><div className="h-4 bg-white/5 rounded animate-pulse" /></td></tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-10 text-white/25">No users found</td></tr>
              ) : filtered.map(u => {
                const rc = RISK_CONFIG[u.risk] || RISK_CONFIG.active;
                return (
                  <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-bold text-white/80">{u.full_name || '—'}</p>
                      <p className="text-white/35">{u.email}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="bg-white/10 text-white/60 px-2 py-0.5 rounded-full text-[10px] font-black capitalize">{u.role || 'user'}</span>
                    </td>
                    <td className="px-5 py-3.5 text-white/40">
                      <p>{new Date(u.created_date).toLocaleDateString()}</p>
                      <p className="text-[10px] text-white/25">{u.daysSinceJoin}d ago</p>
                    </td>
                    <td className="px-5 py-3.5 text-white/60 font-bold">{u.purchaseCount}</td>
                    <td className="px-5 py-3.5 font-black text-white">${u.totalSpend.toFixed(2)}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-white rounded-full" style={{ width: `${u.engagementScore}%` }} />
                        </div>
                        <span className="text-white/50 text-[10px]">{u.engagementScore}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`${rc.bg} ${rc.color} text-[10px] font-black px-2.5 py-1 rounded-full`}>{rc.label}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}