import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Clock, Send, Filter, Search } from 'lucide-react';

export default function ApplicationReview() {
  const queryClient = useQueryClient();
  const [filterStatus, setFilterStatus] = useState('submitted');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: applications = [], isLoading } = useQuery({
    queryKey: ['applications', filterStatus],
    queryFn: () =>
      base44.entities.ApplicationRequest.filter(
        { status: filterStatus },
        '-created_date',
        100
      ),
  });

  const approveMutation = useMutation({
    mutationFn: (id) =>
      base44.entities.ApplicationRequest.update(id, {
        status: 'approved',
        approved_at: new Date().toISOString(),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['applications'] }),
  });

  const rejectMutation = useMutation({
    mutationFn: (id) =>
      base44.entities.ApplicationRequest.update(id, {
        status: 'rejected',
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['applications'] }),
  });

  const filteredApps = applications.filter(
    (app) =>
      app.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.work_email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const statusColors = {
    submitted: 'bg-blue-50 border-blue-200 text-blue-700',
    under_review: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    approved: 'bg-green-50 border-green-200 text-green-700',
    rejected: 'bg-red-50 border-red-200 text-red-700',
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight mb-2">Application Review</h1>
        <p className="text-white/60 text-sm">Manage access requests and approve new members</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {['submitted', 'under_review', 'approved', 'rejected'].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              filterStatus === status
                ? 'bg-white text-black'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            {status.replace('_', ' ').toUpperCase()}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-white/40" />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-10 pl-10 pr-4 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
        />
      </div>

      {/* Applications List */}
      <div className="space-y-3">
        {isLoading ? (
          <p className="text-white/60">Loading applications...</p>
        ) : filteredApps.length === 0 ? (
          <p className="text-white/60">No applications found</p>
        ) : (
          filteredApps.map((app) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg border ${statusColors[app.status]}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold mb-1">{app.first_name} {app.last_name}</h3>
                  <p className="text-xs opacity-75">{app.work_email}</p>
                  <p className="text-xs opacity-75 mt-1">{app.organization} • {app.role}</p>
                </div>
                <span className="text-xs font-semibold opacity-75">
                  {new Date(app.created_date).toLocaleDateString()}
                </span>
              </div>

              {app.reasons && app.reasons.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-1">
                  {app.reasons.slice(0, 3).map((reason) => (
                    <span key={reason} className="text-xs bg-white/20 px-2 py-1 rounded">
                      {reason}
                    </span>
                  ))}
                </div>
              )}

              {app.status === 'submitted' && (
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => approveMutation.mutate(app.id)}
                    disabled={approveMutation.isPending}
                    className="flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded bg-green-600 text-white hover:bg-green-700 transition-all disabled:opacity-50"
                  >
                    <CheckCircle className="w-3 h-3" /> Approve
                  </button>
                  <button
                    onClick={() => rejectMutation.mutate(app.id)}
                    disabled={rejectMutation.isPending}
                    className="flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition-all disabled:opacity-50"
                  >
                    <XCircle className="w-3 h-3" /> Reject
                  </button>
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}