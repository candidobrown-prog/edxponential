import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { MoreVertical, RefreshCw, Settings, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

const INTEGRATION_ICONS = {
  google_workspace: '🔵',
  microsoft_365: '◼️',
  zoom: '⚪',
  slack: '🟣',
  stripe: '🔵',
  square: '⬜',
  paypal: '🔘',
  quickbooks: '🟢',
  gusto: '🔴',
  adp: '⚫',
  canvas: '🟠',
  schoology: '🔷',
  clever: '🟩',
  classlink: '🔵',
  powerschool: '🟪',
  infinite_campus: '🔘',
  salesforce: '☁️',
  hubspot: '🟠',
  zapier: '⚡',
  webhooks: '🪝',
};

export default function ConnectedIntegrationCard({ integration }) {
  const [showMenu, setShowMenu] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSync = async () => {
    setLoading(true);
    try {
      // Trigger sync
      await base44.entities.IntegrationLog.create({
        integration_id: integration.id,
        integration_type: integration.integration_type,
        organization_id: integration.organization_id,
        event_type: 'sync_start',
        action: 'Manual sync initiated',
        status: 'pending',
      });
      // In a real app, this would call a backend function to perform the actual sync
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm('Disconnect this integration? This will stop syncing data.')) return;
    try {
      await base44.entities.Integration.update(integration.id, { status: 'disconnected' });
      // Refresh parent
      window.location.reload();
    } catch (error) {
      console.error('Failed to disconnect:', error);
    }
  };

  const lastSyncText = integration.last_sync
    ? `Last synced ${format(new Date(integration.last_sync), 'MMM d, h:mm a')}`
    : 'Never synced';

  const statusColor = integration.status === 'connected' ? 'text-green-600' : 'text-red-600';
  const statusIcon = integration.status === 'connected' ? CheckCircle : AlertCircle;
  const StatusIcon = statusIcon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative p-6 rounded-2xl border border-border bg-white hover:border-black/20 hover:shadow-sm transition-all group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-3xl">{INTEGRATION_ICONS[integration.integration_type] || '⚙️'}</div>
          <div>
            <h3 className="font-bold text-black">{integration.name}</h3>
            <div className={`flex items-center gap-1 text-xs font-medium ${statusColor}`}>
              <StatusIcon className="w-3 h-3" />
              {integration.status === 'connected' ? 'Connected' : 'Error'}
            </div>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 rounded-lg text-muted-foreground hover:bg-muted transition-colors opacity-0 group-hover:opacity-100"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute right-0 top-10 z-10 w-40 rounded-lg border border-border bg-white shadow-lg"
            >
              <button
                onClick={() => {
                  handleSync();
                  setShowMenu(false);
                }}
                disabled={loading}
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-muted transition-colors flex items-center gap-2 border-b border-border/50"
              >
                <RefreshCw className="w-3 h-3" />
                Sync Now
              </button>
              <button className="w-full text-left px-4 py-2.5 text-sm hover:bg-muted transition-colors flex items-center gap-2 border-b border-border/50">
                <Settings className="w-3 h-3" />
                Settings
              </button>
              <button
                onClick={() => {
                  handleDisconnect();
                  setShowMenu(false);
                }}
                className="w-full text-left px-4 py-2.5 text-sm hover:bg-red-50 text-red-600 transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-3 h-3" />
                Disconnect
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="space-y-2 text-xs text-muted-foreground mb-4">
        <div>Connected by {integration.connected_by}</div>
        <div>{lastSyncText}</div>
        {integration.last_error && (
          <div className="text-red-600 font-medium">{integration.last_error}</div>
        )}
      </div>

      {/* Sync details */}
      {integration.sync_enabled && (
        <div className="mb-4 p-3 rounded-lg bg-muted text-xs">
          <div className="font-semibold text-black mb-1">Syncing {integration.sync_frequency}</div>
          <div className="text-muted-foreground">
            {integration.data_types?.join(', ') || 'Various data types'}
          </div>
        </div>
      )}

      {/* Permissions */}
      {integration.permissions?.length > 0 && (
        <div className="mb-4">
          <div className="text-xs font-bold text-muted-foreground mb-2">Permissions:</div>
          <div className="flex flex-wrap gap-1">
            {integration.permissions.slice(0, 3).map((perm, i) => (
              <span key={i} className="px-2 py-1 rounded text-[10px] bg-muted text-muted-foreground">
                {perm}
              </span>
            ))}
            {integration.permissions.length > 3 && (
              <span className="px-2 py-1 rounded text-[10px] bg-muted text-muted-foreground">
                +{integration.permissions.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Action button */}
      <Button
        onClick={handleSync}
        disabled={loading}
        className="w-full h-8 bg-black text-white hover:bg-black/85 transition-all text-xs font-semibold"
      >
        {loading ? 'Syncing...' : 'Sync Now'}
      </Button>
    </motion.div>
  );
}