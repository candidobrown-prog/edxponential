import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Activity, AlertCircle, CheckCircle, Eye, Zap, BarChart3, 
  RefreshCw, TrendingUp, Lock, Link as LinkIcon, Loader 
} from 'lucide-react';
import { linkValidator, ECOSYSTEM_ROUTES } from '@/lib/linkValidator';
import { Button } from '@/components/ui/button';

export default function ComprehensiveLinkMonitoring() {
  const [report, setReport] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [activeTab, setActiveTab] = useState('health');

  const runComprehensiveScan = async () => {
    setScanning(true);
    try {
      // Perform ecosystem scan
      const scanResult = linkValidator.scanEcosystem();
      setReport(linkValidator.getHealthReport());
      setAnalytics(linkValidator.getNavigationAnalytics());
    } finally {
      setScanning(false);
    }
  };

  useEffect(() => {
    runComprehensiveScan();
  }, []);

  if (!report) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const healthStatus = report.healthScore >= 95 ? 'excellent' : report.healthScore >= 80 ? 'good' : 'needs-attention';
  const statusColors = {
    excellent: 'text-green-600',
    good: 'text-yellow-600',
    'needs-attention': 'text-red-600',
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl font-black text-black mb-2">Link Health Dashboard</h1>
                <p className="text-muted-foreground">Real-time monitoring of edXponential ecosystem navigation</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={runComprehensiveScan}
                disabled={scanning}
                className="px-6 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 disabled:opacity-60 flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${scanning ? 'animate-spin' : ''}`} />
                {scanning ? 'Scanning...' : 'Run Full Scan'}
              </motion.button>
            </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {/* Health Score */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0 }}
              className="rounded-xl border border-border bg-white p-6 hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <Activity className="w-6 h-6 text-primary" />
                <span className={`text-2xl font-black ${statusColors[healthStatus]}`}>
                  {report.healthScore}%
                </span>
              </div>
              <p className="text-sm text-muted-foreground">Health Score</p>
              <p className="text-xs text-muted-foreground mt-2">
                Status: <span className="capitalize font-semibold">{healthStatus.replace('-', ' ')}</span>
              </p>
            </motion.div>

            {/* Broken Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-xl border border-border bg-white p-6 hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <AlertCircle className="w-6 h-6 text-red-500" />
                <span className="text-2xl font-black text-red-600">{report.brokenLinks}</span>
              </div>
              <p className="text-sm text-muted-foreground">Broken Links</p>
              <p className="text-xs text-muted-foreground mt-2">Requires attention</p>
            </motion.div>

            {/* Routes Tracked */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-xl border border-border bg-white p-6 hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <LinkIcon className="w-6 h-6 text-blue-500" />
                <span className="text-2xl font-black text-blue-600">{Object.keys(ECOSYSTEM_ROUTES).length}</span>
              </div>
              <p className="text-sm text-muted-foreground">Total Routes</p>
              <p className="text-xs text-muted-foreground mt-2">Registered in system</p>
            </motion.div>

            {/* Navigation Success Rate */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-xl border border-border bg-white p-6 hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="w-6 h-6 text-green-500" />
                <span className="text-2xl font-black text-green-600">{Math.round(analytics?.successRate || 0)}%</span>
              </div>
              <p className="text-sm text-muted-foreground">Success Rate</p>
              <p className="text-xs text-muted-foreground mt-2">{analytics?.total || 0} navigations tracked</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="mb-8 flex gap-2 border-b border-border">
          {[
            { id: 'health', label: 'Health Status', icon: Activity },
            { id: 'broken', label: 'Broken Links', icon: AlertCircle },
            { id: 'analytics', label: 'Navigation', icon: BarChart3 },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 font-semibold flex items-center gap-2 transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'text-primary border-primary'
                  : 'text-muted-foreground border-transparent hover:text-black'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Health Status */}
          {activeTab === 'health' && (
            <div className="space-y-6">
              <div className="rounded-xl border border-border bg-white p-8">
                <h3 className="heading-2 mb-6">Ecosystem Health Report</h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">Overall Health</span>
                      <span className={`text-sm font-bold ${statusColors[healthStatus]}`}>
                        {report.healthScore}%
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${report.healthScore}%` }}
                        transition={{ duration: 1 }}
                        className={`h-full rounded-full ${
                          healthStatus === 'excellent'
                            ? 'bg-green-500'
                            : healthStatus === 'good'
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 mt-8">
                    <div className="p-4 rounded-lg border border-green-200 bg-green-50">
                      <CheckCircle className="w-5 h-5 text-green-600 mb-2" />
                      <p className="text-sm text-green-600 font-semibold">Working Routes</p>
                      <p className="text-2xl font-black text-green-700 mt-2">
                        {Object.keys(ECOSYSTEM_ROUTES).length - report.brokenLinks}
                      </p>
                    </div>

                    <div className="p-4 rounded-lg border border-red-200 bg-red-50">
                      <AlertCircle className="w-5 h-5 text-red-600 mb-2" />
                      <p className="text-sm text-red-600 font-semibold">Broken Routes</p>
                      <p className="text-2xl font-black text-red-700 mt-2">{report.brokenLinks}</p>
                    </div>

                    <div className="p-4 rounded-lg border border-blue-200 bg-blue-50">
                      <Eye className="w-5 h-5 text-blue-600 mb-2" />
                      <p className="text-sm text-blue-600 font-semibold">Last Scanned</p>
                      <p className="text-xs text-blue-700 mt-2">
                        {report.lastScanTime ? new Date(report.lastScanTime).toLocaleTimeString() : 'Never'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Broken Links */}
          {activeTab === 'broken' && (
            <div className="rounded-xl border border-border bg-white p-8">
              <h3 className="heading-2 mb-6">Broken Links Detected</h3>
              
              {report.brokenLinks === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <p className="text-lg font-semibold text-black">All links are working perfectly!</p>
                  <p className="text-muted-foreground mt-2">Zero broken links detected in the ecosystem.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {Array.from(report.brokenLinkDetails).map((link, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="p-4 rounded-lg border border-red-200 bg-red-50"
                    >
                      <div className="flex items-start gap-4">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
                        <div className="flex-1 min-w-0">
                          <p className="font-mono text-sm text-red-700 break-all">{link.url}</p>
                          <p className="text-xs text-red-600 mt-1">
                            Detected: {new Date(link.timestamp).toLocaleString()}
                          </p>
                          {link.context?.reason && (
                            <p className="text-xs text-red-600 mt-1">Reason: {link.context.reason}</p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Navigation Analytics */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="rounded-xl border border-border bg-white p-8">
                <h3 className="heading-2 mb-6">Navigation Analytics</h3>
                
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center p-6 rounded-lg bg-surface">
                    <p className="text-sm text-muted-foreground mb-2">Total Navigations</p>
                    <p className="text-3xl font-black text-black">{analytics?.total || 0}</p>
                  </div>
                  <div className="text-center p-6 rounded-lg bg-green-50">
                    <p className="text-sm text-green-700 mb-2">Successful</p>
                    <p className="text-3xl font-black text-green-600">{analytics?.successful || 0}</p>
                  </div>
                  <div className="text-center p-6 rounded-lg bg-red-50">
                    <p className="text-sm text-red-700 mb-2">Failed</p>
                    <p className="text-3xl font-black text-red-600">{analytics?.failed || 0}</p>
                  </div>
                </div>

                <div className="border-t border-border pt-6">
                  <h4 className="font-semibold text-black mb-4">Recent Navigation History</h4>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {analytics?.history?.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">No navigation history</p>
                    ) : (
                      analytics?.history?.map((nav, i) => (
                        <div
                          key={i}
                          className={`p-3 rounded-lg text-sm ${
                            nav.success
                              ? 'bg-green-50 border border-green-200'
                              : 'bg-red-50 border border-red-200'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            {nav.success ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-red-600" />
                            )}
                            <span className="font-mono text-xs">{nav.from || '/'} → {nav.to}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {new Date(nav.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 p-6 rounded-xl border border-primary/30 bg-primary/5"
        >
          <div className="flex items-start gap-4">
            <Lock className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
            <div>
              <p className="font-semibold text-black mb-1">Zero Dead Links Guarantee</p>
              <p className="text-sm text-muted-foreground">
                Every button, link, and interactive element on edXponential is validated and monitored in real-time. 
                This dashboard runs automatic scans and tracks all navigation events to ensure seamless user experience 
                across the entire ecosystem.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}