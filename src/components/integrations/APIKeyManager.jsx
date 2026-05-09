import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Copy, Eye, EyeOff, Trash2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';

export default function APIKeyManager() {
  const [apiKeys, setApiKeys] = useState([]);
  const [showNew, setShowNew] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyScopes, setNewKeyScopes] = useState(['read']);
  const [loading, setLoading] = useState(false);
  const [generatedKey, setGeneratedKey] = useState(null);

  useEffect(() => {
    const fetchKeys = async () => {
      try {
        const keys = await base44.entities.APIKey.list();
        setApiKeys(keys.filter(k => k.status === 'active'));
      } catch (error) {
        console.error('Failed to fetch API keys:', error);
      }
    };
    fetchKeys();
  }, []);

  const handleCreateKey = async () => {
    if (!newKeyName.trim()) return;

    setLoading(true);
    try {
      // In a real app, generate a proper API key with hash
      const keyId = `edx_live_${Math.random().toString(36).substr(2, 9)}`;
      const keyHash = btoa(keyId); // Simplified hashing

      const key = await base44.entities.APIKey.create({
        key_name: newKeyName,
        key_hash: keyHash,
        key_prefix: keyId.substr(0, 8),
        type: 'public_api',
        scopes: newKeyScopes,
        status: 'active',
        created_by: (await base44.auth.me()).email,
        rate_limit: 1000,
      });

      setGeneratedKey({ ...key, plaintext: keyId });
      setNewKeyName('');
      setNewKeyScopes(['read']);
    } catch (error) {
      console.error('Failed to create API key:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeKey = async (keyId) => {
    if (!confirm('Revoke this API key? It will no longer work.')) return;

    try {
      await base44.entities.APIKey.update(keyId, { status: 'revoked' });
      setApiKeys(apiKeys.filter(k => k.id !== keyId));
    } catch (error) {
      console.error('Failed to revoke key:', error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-black tracking-[-0.04em]">API Keys</h2>
          <p className="text-muted-foreground mt-1">Generate and manage API keys for integrations and webhooks.</p>
        </div>
        <Button
          onClick={() => setShowNew(!showNew)}
          className="gap-2 bg-black text-white hover:bg-black/85"
        >
          <Plus className="w-4 h-4" />
          New API Key
        </Button>
      </div>

      {/* New Key Form */}
      <AnimatePresence>
        {showNew && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-6 rounded-2xl border border-border bg-muted"
          >
            <div className="space-y-4">
              <div>
                <label className="text-sm font-bold text-black block mb-2">Key Name</label>
                <Input
                  placeholder="e.g., Production API, Webhook Receiver"
                  value={newKeyName}
                  onChange={e => setNewKeyName(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-bold text-black block mb-2">Scopes</label>
                <div className="space-y-2">
                  {['read', 'write', 'webhooks', 'admin'].map(scope => (
                    <label key={scope} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={newKeyScopes.includes(scope)}
                        onChange={e => {
                          if (e.target.checked) {
                            setNewKeyScopes([...newKeyScopes, scope]);
                          } else {
                            setNewKeyScopes(newKeyScopes.filter(s => s !== scope));
                          }
                        }}
                        className="rounded"
                      />
                      {scope.charAt(0).toUpperCase() + scope.slice(1)}
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowNew(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateKey}
                  disabled={loading || !newKeyName.trim()}
                  className="flex-1 bg-black text-white hover:bg-black/85"
                >
                  {loading ? 'Creating...' : 'Create Key'}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Generated Key Display */}
      <AnimatePresence>
        {generatedKey && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 rounded-2xl border border-green-200 bg-green-50"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <div>
                  <h3 className="font-bold text-black">API Key Created</h3>
                  <p className="text-sm text-muted-foreground">Save this key securely. You won't see it again.</p>
                </div>
              </div>
              <button
                onClick={() => setGeneratedKey(null)}
                className="text-green-600 hover:text-green-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 mb-4">
              <div>
                <label className="text-xs font-bold text-muted-foreground block mb-1">Key ID</label>
                <div className="flex gap-2">
                  <code className="flex-1 p-3 rounded-lg bg-white border border-border font-mono text-sm">
                    {generatedKey.plaintext}
                  </code>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(generatedKey.plaintext);
                    }}
                    className="p-3 rounded-lg border border-border hover:bg-white transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* API Keys List */}
      <div className="space-y-2">
        {apiKeys.length === 0 ? (
          <div className="text-center py-12 rounded-2xl border border-border bg-muted">
            <p className="text-muted-foreground">No API keys yet. Create one to get started.</p>
          </div>
        ) : (
          apiKeys.map((key, i) => (
            <motion.div
              key={key.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-4 rounded-xl border border-border bg-white hover:border-black/20 transition-all flex items-center justify-between"
            >
              <div className="flex-1">
                <div className="font-bold text-black">{key.key_name}</div>
                <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                  <code className="bg-muted px-2 py-1 rounded">edx_live_{key.key_prefix}...</code>
                  <span>Created {format(new Date(key.created_date), 'MMM d, yyyy')}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-xs text-muted-foreground">
                  {key.scopes?.join(', ')}
                </div>
                <button
                  onClick={() => handleRevokeKey(key.id)}
                  className="p-2 rounded-lg text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}