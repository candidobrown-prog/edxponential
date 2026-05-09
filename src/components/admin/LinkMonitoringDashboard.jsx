import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle, Clock, TrendingUp, RefreshCw } from 'lucide-react';
import { linkValidator } from '@/lib/linkValidator';

/**
 * LinkMonitoringDashboard
 * Admin tool for monitoring link health across the platform
 * Real-time alerts and weekly reports
 */
export default function LinkMonitoringDashboard() {
  const [health, setHealth] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  const fetchHealthReport = () => {
    setIsScanning(true);
    setTimeout(() => {
      setHealth(linkValidator.getHealthReport());
      setIsScanning(false);
    }, 1000);
  };

  useEffect(() => {
    fetchHealthReport();
    // Poll every 5 minutes
    const interval = setInterval(fetchHealthReport, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (!health) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-8 h-8 border-4 border-border border-t-primary rounded-full"
        />
      </div>
    );
  }

  const brokenPercentage = (health.brokenLinks / health.totalLinks) * 100 || 0;
  const healthPercentage = health.healthScore || 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="heading-2">Link Health Monitoring</h2>
        <button
          onClick={fetchHealthReport}
          disabled={isScanning}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-surface transition-all disabled:opacity-60"
        >
          <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
          Scan Now
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-border bg-white p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">Total Links</p>
            <Clock className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-3xl font-bold">{health.totalLinks}</p>
        </motion.div>

        {/* Broken Links Alert */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`rounded-xl border p-6 ${
            health.brokenLinks > 0
              ? 'bg-destructive/5 border-destructive/30'
              : 'bg-white border-border'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">Broken Links</p>
            {health.brokenLinks > 0 ? (
              <AlertCircle className="w-4 h-4 text-destructive" />
            ) : (
              <CheckCircle className="w-4 h-4 text-success" />
            )}
          </div>
          <p className={`text-3xl font-bold ${health.brokenLinks > 0 ? 'text-destructive' : 'text-success'}`}>
            {health.brokenLinks}
          </p>
        </motion.div>

        {/* Health Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border border-border bg-white p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">Health Score</p>
            <TrendingUp className="w-4 h-4 text-primary" />
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-primary">
              {Math.round(healthPercentage)}%
            </p>
          </div>
          <div className="mt-3 w-full h-2 bg-border rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${healthPercentage}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-primary to-primary/60"
            />
          </div>
        </motion.div>

        {/* Status Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl border border-border bg-white p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">Status</p>
            <div className={`w-2 h-2 rounded-full ${
              health.brokenLinks === 0 ? 'bg-success animate-pulse' : 'bg-destructive'
            }`} />
          </div>
          <p className={`text-lg font-semibold ${
            health.brokenLinks === 0 ? 'text-success' : 'text-destructive'
          }`}>
            {health.brokenLinks === 0 ? 'All Clear' : 'Issues Found'}
          </p>
        </motion.div>
      </div>

      {/* Broken Links Table */}
      {health.brokenLinks > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-destructive/30 bg-destructive/5 p-6"
        >
          <h3 className="heading-3 mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-destructive" />
            Broken Links Detected
          </h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {health.brokenLinkDetails.map((link, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-3 rounded-lg bg-white border border-destructive/20"
              >
                <p className="text-sm font-mono text-destructive font-semibold mb-1">
                  {link.url}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(link.timestamp).toLocaleString()}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Health Status Message */}
      {health.brokenLinks === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-xl border border-success/30 bg-success/5 p-6 text-center"
        >
          <CheckCircle className="w-8 h-8 text-success mx-auto mb-3" />
          <p className="text-success font-semibold">
            ✓ Perfect! Zero dead links detected.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Last scanned: {health.lastScan ? new Date(health.lastScan).toLocaleString() : 'Just now'}
          </p>
        </motion.div>
      )}
    </div>
  );
}