import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Clock, RefreshCw, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

export default function IntegrationActivityLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [eventFilter, setEventFilter] = useState('all');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await base44.entities.IntegrationLog.list('-timestamp', 100);
        setLogs(data);
      } catch (error) {
        console.error('Failed to fetch logs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const filtered = logs.filter(log => {
    const statusMatch = statusFilter === 'all' || log.status === statusFilter;
    const eventMatch = eventFilter === 'all' || log.event_type === eventFilter;
    return statusMatch && eventMatch;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-amber-600" />;
      default:
        return <RefreshCw className="w-4 h-4 text-gray-600" />;
    }
  };

  const getEventColor = (event) => {
    switch (event) {
      case 'connection':
        return 'bg-blue-50 border-blue-200 text-blue-700';
      case 'disconnection':
        return 'bg-red-50 border-red-200 text-red-700';
      case 'sync_complete':
        return 'bg-green-50 border-green-200 text-green-700';
      case 'sync_failed':
        return 'bg-red-50 border-red-200 text-red-700';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-700';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-bold text-muted-foreground">Filter:</span>
        </div>

        <select
          value={eventFilter}
          onChange={e => setEventFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:border-black"
        >
          <option value="all">All Events</option>
          <option value="connection">Connection</option>
          <option value="disconnection">Disconnection</option>
          <option value="sync_start">Sync Started</option>
          <option value="sync_complete">Sync Complete</option>
          <option value="sync_failed">Sync Failed</option>
          <option value="error">Error</option>
        </select>

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:border-black"
        >
          <option value="all">All Status</option>
          <option value="success">Success</option>
          <option value="failed">Failed</option>
          <option value="pending">Pending</option>
        </select>

        <Button
          onClick={() => {
            setLoading(true);
            setTimeout(() => setLoading(false), 500);
          }}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <RefreshCw className="w-3 h-3" />
          Refresh
        </Button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-12">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
          <p className="text-muted-foreground mt-3">Loading activity logs...</p>
        </div>
      )}

      {/* Logs Table */}
      {!loading && (
        <div className="rounded-2xl border border-border overflow-hidden bg-white">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-bold text-muted-foreground">Date/Time</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-muted-foreground">Integration</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-muted-foreground">Event</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-muted-foreground">Action</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-muted-foreground">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-muted-foreground">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center text-muted-foreground">
                      No activity logs found
                    </td>
                  </tr>
                ) : (
                  filtered.map((log, i) => (
                    <motion.tr
                      key={log.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.02 }}
                      className="hover:bg-muted transition-colors"
                    >
                      <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                        {format(new Date(log.timestamp), 'MMM d, h:mm:ss a')}
                      </td>
                      <td className="px-4 py-3 text-xs font-medium text-black capitalize">
                        {log.integration_type.replace(/_/g, ' ')}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-bold border ${getEventColor(log.event_type)}`}>
                          {log.event_type.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground max-w-xs truncate">
                        {log.action}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(log.status)}
                          <span className="text-xs font-medium capitalize">{log.status}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs">
                        {log.records_processed && (
                          <div className="text-muted-foreground">
                            {log.records_processed} records
                          </div>
                        )}
                        {log.error_message && (
                          <div className="text-red-600 truncate" title={log.error_message}>
                            {log.error_message}
                          </div>
                        )}
                        {log.duration_ms && (
                          <div className="text-muted-foreground">
                            {log.duration_ms}ms
                          </div>
                        )}
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && logs.length === 0 && (
        <div className="text-center py-20 rounded-2xl border-2 border-dashed border-border">
          <Clock className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No integration activity yet.</p>
          <p className="text-xs text-muted-foreground mt-1">Connect an integration to see activity logs.</p>
        </div>
      )}
    </div>
  );
}