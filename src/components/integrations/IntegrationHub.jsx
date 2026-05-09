import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MoreVertical, RefreshCw, Trash2, Settings, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import IntegrationCatalog from './IntegrationCatalog';
import IntegrationSetupWizard from './IntegrationSetupWizard';
import ConnectedIntegrationCard from './ConnectedIntegrationCard';
import IntegrationActivityLog from './IntegrationActivityLog';
import APIKeyManager from './APIKeyManager';

export default function IntegrationHub() {
  const [activeTab, setActiveTab] = useState('connected');
  const [integrations, setIntegrations] = useState([]);
  const [selectedIntegration, setSelectedIntegration] = useState(null);
  const [showWizard, setShowWizard] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch integrations
  useEffect(() => {
    const fetchIntegrations = async () => {
      try {
        setLoading(true);
        const data = await base44.entities.Integration.list();
        setIntegrations(data);
      } catch (error) {
        console.error('Failed to fetch integrations:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchIntegrations();
  }, []);

  const handleConnect = (integrationId) => {
    setSelectedIntegration(integrationId);
    setShowWizard(true);
  };

  const handleWizardComplete = async () => {
    setShowWizard(false);
    setSelectedIntegration(null);
    // Refresh integrations list
    const data = await base44.entities.Integration.list();
    setIntegrations(data);
  };

  const connectedCount = integrations.filter(i => i.status === 'connected').length;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-border px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-black text-black mb-2 tracking-[-0.04em]">Integrations Hub</h1>
          <p className="text-muted-foreground">Connect external apps and services to extend the platform.</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Tabs */}
        <div className="flex gap-2 border-b border-border mb-8">
          <button
            onClick={() => setActiveTab('connected')}
            className={`px-4 py-3 font-semibold text-sm transition-colors border-b-2 -mb-[2px] ${
              activeTab === 'connected'
                ? 'text-black border-b-black'
                : 'text-muted-foreground border-b-transparent hover:text-black'
            }`}
          >
            Connected ({connectedCount})
          </button>
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-4 py-3 font-semibold text-sm transition-colors border-b-2 -mb-[2px] ${
              activeTab === 'catalog'
                ? 'text-black border-b-black'
                : 'text-muted-foreground border-b-transparent hover:text-black'
            }`}
          >
            Browse All
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-4 py-3 font-semibold text-sm transition-colors border-b-2 -mb-[2px] ${
              activeTab === 'logs'
                ? 'text-black border-b-black'
                : 'text-muted-foreground border-b-transparent hover:text-black'
            }`}
          >
            Activity Logs
          </button>
          <button
            onClick={() => setActiveTab('api')}
            className={`px-4 py-3 font-semibold text-sm transition-colors border-b-2 -mb-[2px] ${
              activeTab === 'api'
                ? 'text-black border-b-black'
                : 'text-muted-foreground border-b-transparent hover:text-black'
            }`}
          >
            API & Webhooks
          </button>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'connected' && (
            <motion.div key="connected" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {integrations.filter(i => i.status === 'connected').length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-muted-foreground mb-6">No integrations connected yet.</p>
                  <Button
                    onClick={() => setActiveTab('catalog')}
                    className="bg-black text-white hover:bg-black/85"
                  >
                    Browse Integrations
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {integrations
                    .filter(i => i.status === 'connected')
                    .map((integration, i) => (
                      <motion.div
                        key={integration.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <ConnectedIntegrationCard integration={integration} />
                      </motion.div>
                    ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'catalog' && (
            <motion.div key="catalog" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <IntegrationCatalog onConnect={handleConnect} />
            </motion.div>
          )}

          {activeTab === 'logs' && (
            <motion.div key="logs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <IntegrationActivityLog />
            </motion.div>
          )}

          {activeTab === 'api' && (
            <motion.div key="api" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <APIKeyManager />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Setup Wizard Modal */}
      <AnimatePresence>
        {showWizard && (
          <IntegrationSetupWizard
            integrationId={selectedIntegration}
            onComplete={handleWizardComplete}
            onCancel={() => setShowWizard(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}