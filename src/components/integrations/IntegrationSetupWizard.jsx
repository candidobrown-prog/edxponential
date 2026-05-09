import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { X, ChevronRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const INTEGRATION_DETAILS = {
  google_workspace: {
    name: 'Google Workspace',
    description: 'Connect Gmail, Drive, Docs, Sheets, and Calendar',
    steps: ['Permissions Review', 'Authorize', 'Sync Settings', 'Confirm'],
    permissions: ['Email access', 'Drive files', 'Calendar events', 'Document editing'],
    dataTypes: ['calendar', 'email', 'documents'],
  },
  slack: {
    name: 'Slack',
    description: 'Team messaging and notifications',
    steps: ['Permissions Review', 'Authorize', 'Channel Setup', 'Confirm'],
    permissions: ['Channel access', 'Message posting', 'User info'],
    dataTypes: ['messages', 'notifications'],
  },
  stripe: {
    name: 'Stripe',
    description: 'Payment processing and billing',
    steps: ['API Key Entry', 'Test Connection', 'Sync Settings', 'Confirm'],
    permissions: ['Payment data', 'Customer info', 'Invoice access'],
    dataTypes: ['payments', 'customers', 'invoices'],
  },
  // Add more integrations as needed
};

export default function IntegrationSetupWizard({ integrationId, onComplete, onCancel }) {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    syncFrequency: 'daily',
    syncDirection: 'one_way_import',
    selectedDataTypes: [],
  });

  const details = INTEGRATION_DETAILS[integrationId] || {
    name: 'Unknown Integration',
    description: '',
    steps: ['Setup', 'Confirm'],
    permissions: [],
    dataTypes: [],
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      // Create integration record
      await base44.entities.Integration.create({
        integration_type: integrationId,
        name: details.name,
        category: 'automation', // Should be dynamic based on integration
        connection_type: integrationId === 'stripe' ? 'api_key' : 'oauth',
        status: 'connected',
        sync_enabled: true,
        sync_frequency: formData.syncFrequency,
        sync_direction: formData.syncDirection,
        permissions: details.permissions,
        data_types: formData.selectedDataTypes || details.dataTypes,
        connected_date: new Date().toISOString(),
      });

      onComplete?.();
    } catch (error) {
      console.error('Failed to complete setup:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-2xl bg-white rounded-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-border">
          <div>
            <h2 className="text-2xl font-black text-black tracking-[-0.04em]">Connect {details.name}</h2>
            <p className="text-sm text-muted-foreground mt-1">{details.description}</p>
          </div>
          <button onClick={onCancel} className="p-2 rounded-lg text-muted-foreground hover:bg-muted">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress */}
        <div className="px-8 pt-8">
          <div className="flex gap-2">
            {details.steps.map((s, i) => (
              <motion.div
                key={i}
                className={`flex-1 h-1 rounded-full transition-all ${
                  i <= step ? 'bg-black' : 'bg-muted'
                }`}
              />
            ))}
          </div>
          <div className="mt-2 text-xs font-bold text-muted-foreground">
            Step {step + 1} of {details.steps.length}: {details.steps[step]}
          </div>
        </div>

        {/* Content */}
        <div className="p-8 min-h-64">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="permissions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h3 className="font-bold text-black mb-4">This app requests:</h3>
                <div className="space-y-2">
                  {details.permissions.map((perm, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      {perm}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="authorize" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h3 className="font-bold text-black mb-4">Authorize Connection</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  You will be redirected to {details.name} to authorize this connection. Your API credentials will be securely stored.
                </p>
                <Button className="w-full bg-black text-white hover:bg-black/85">
                  Continue to {details.name}
                </Button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="sync" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h3 className="font-bold text-black mb-4">Sync Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-bold text-black block mb-2">Sync Frequency</label>
                    <select
                      value={formData.syncFrequency}
                      onChange={e => setFormData({ ...formData, syncFrequency: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-black"
                    >
                      <option value="hourly">Hourly</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="manual">Manual</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-bold text-black block mb-2">Sync Direction</label>
                    <select
                      value={formData.syncDirection}
                      onChange={e => setFormData({ ...formData, syncDirection: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:border-black"
                    >
                      <option value="one_way_import">Import Only</option>
                      <option value="one_way_export">Export Only</option>
                      <option value="two_way">Two-Way Sync</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="confirm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="text-center">
                  <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                  <h3 className="font-bold text-black text-lg mb-2">Ready to Connect</h3>
                  <p className="text-sm text-muted-foreground">
                    {details.name} will now sync data according to your settings.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-border flex justify-between gap-3">
          <Button
            variant="outline"
            onClick={onCancel}
            className="px-6"
          >
            Cancel
          </Button>

          <div className="flex gap-3">
            {step > 0 && (
              <Button
                variant="outline"
                onClick={() => setStep(step - 1)}
                className="px-6"
              >
                Back
              </Button>
            )}

            <Button
              onClick={() => {
                if (step === details.steps.length - 1) {
                  handleComplete();
                } else {
                  setStep(step + 1);
                }
              }}
              disabled={loading}
              className="gap-2 bg-black text-white hover:bg-black/85 px-6"
            >
              {step === details.steps.length - 1 ? 'Connect' : 'Next'}
              {step < details.steps.length - 1 && <ChevronRight className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}