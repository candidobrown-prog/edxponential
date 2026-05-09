import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { HardDrive, Users, Building2, AlertCircle, TrendingUp, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function StorageDashboard() {
  const [storageMetrics, setStorageMetrics] = useState(null);
  const [userStorageTop, setUserStorageTop] = useState([]);
  const [schoolStorageTop, setSchoolStorageTop] = useState([]);
  const [failedUploads, setFailedUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const currentUser = await base44.auth.me();
      
      // Check if admin
      if (currentUser?.role !== 'admin') {
        return;
      }

      setUser(currentUser);

      // Fetch file upload data
      const allFiles = await base44.entities.FileUpload?.filter?.({}, '-uploaded_at', 1000);
      const activeFiles = allFiles?.filter(f => f.status === 'active') || [];
      const deletedFiles = allFiles?.filter(f => f.status === 'deleted') || [];

      // Calculate total storage
      const totalStorage = activeFiles.reduce((sum, f) => sum + (f.file_size || 0), 0);
      const totalFiles = activeFiles.length;
      const totalUsers = new Set(activeFiles.map(f => f.user_email)).size;
      const totalSchools = new Set(activeFiles.map(f => f.school_id)).size;

      // Get top users by storage
      const userStorage = {};
      activeFiles.forEach(f => {
        if (f.user_email) {
          userStorage[f.user_email] = (userStorage[f.user_email] || 0) + (f.file_size || 0);
        }
      });
      const topUsers = Object.entries(userStorage)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([email, size]) => ({ email, size, fileCount: activeFiles.filter(f => f.user_email === email).length }));

      // Get top schools by storage
      const schoolStorage = {};
      activeFiles.forEach(f => {
        if (f.school_id) {
          schoolStorage[f.school_id] = (schoolStorage[f.school_id] || 0) + (f.file_size || 0);
        }
      });
      const topSchools = Object.entries(schoolStorage)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([schoolId, size]) => ({ schoolId, size, fileCount: activeFiles.filter(f => f.school_id === schoolId).length }));

      // Get failed uploads
      const failed = allFiles?.filter(f => f.status === 'failed')?.slice(0, 20) || [];

      setStorageMetrics({
        totalStorage,
        totalFiles,
        totalUsers,
        totalSchools,
        deletedFiles: deletedFiles.length,
        activeFiles: activeFiles.length,
      });
      setUserStorageTop(topUsers);
      setSchoolStorageTop(topSchools);
      setFailedUploads(failed);
    } catch (error) {
      console.error('Failed to load storage dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="text-center py-16">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
        <p className="text-gray-600">Only administrators can access this dashboard.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-black text-gray-900 mb-2">Storage Dashboard</h1>
        <p className="text-gray-600">Monitor platform storage, usage, and quotas</p>
      </div>

      {/* Key Metrics */}
      {storageMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-600">Total Storage Used</h3>
              <HardDrive className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-3xl font-black text-gray-900">{formatBytes(storageMetrics.totalStorage)}</p>
            <p className="text-xs text-gray-500 mt-2">{storageMetrics.totalFiles} files</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-600">Active Users</h3>
              <Users className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-black text-gray-900">{storageMetrics.totalUsers}</p>
            <p className="text-xs text-gray-500 mt-2">storing files</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-600">Schools Using Storage</h3>
              <Building2 className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-3xl font-black text-gray-900">{storageMetrics.totalSchools}</p>
            <p className="text-xs text-gray-500 mt-2">across platform</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-600">Deleted Files</h3>
              <Trash2 className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-3xl font-black text-gray-900">{storageMetrics.deletedFiles}</p>
            <p className="text-xs text-gray-500 mt-2">can be purged</p>
          </motion.div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Users */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Top Users by Storage
          </h2>
          <div className="space-y-3">
            {userStorageTop.map((user, i) => (
              <div key={user.email} className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{user.email}</p>
                  <p className="text-xs text-gray-500">{user.fileCount} files</p>
                </div>
                <p className="font-bold text-gray-900">{formatBytes(user.size)}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Schools */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Top Schools by Storage
          </h2>
          <div className="space-y-3">
            {schoolStorageTop.map((school, i) => (
              <div key={school.schoolId} className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{school.schoolId || 'Unknown School'}</p>
                  <p className="text-xs text-gray-500">{school.fileCount} files</p>
                </div>
                <p className="font-bold text-gray-900">{formatBytes(school.size)}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Failed Uploads */}
      {failedUploads.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 rounded-xl border border-red-200 p-6">
          <h2 className="text-lg font-bold text-red-900 mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Failed Uploads ({failedUploads.length})
          </h2>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {failedUploads.map((upload, i) => (
              <div key={i} className="text-sm text-red-800 p-2 bg-white rounded border border-red-100">
                <p className="font-semibold">{upload.file_name}</p>
                <p className="text-xs text-red-600">{upload.user_email}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Recommendations */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-blue-50 rounded-xl border border-blue-200 p-6">
        <h2 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Storage Recommendations
        </h2>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>✓ Regularly audit storage usage to optimize costs</li>
          <li>✓ Encourage users to delete old/unused files</li>
          <li>✓ Implement automatic compression for media files</li>
          <li>✓ Set up regular backups of critical school data</li>
          <li>✓ Consider tiered storage for different file types</li>
          <li>✓ Monitor upload failures and investigate patterns</li>
        </ul>
      </motion.div>
    </div>
  );
}