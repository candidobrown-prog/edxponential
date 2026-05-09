import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { Building2, LogOut, Shield, FileText } from 'lucide-react';
import VendorLogin from './VendorLogin';
import VendorDashboard from './VendorDashboard';

export default function VendorPortal() {
  const [user, setUser] = useState(null);
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkVendor = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);

        const vendors = await base44.entities.OpxVendor.filter(
          { contact_email: currentUser.email },
          '-created_date',
          1
        );

        if (vendors.length > 0) {
          setVendor(vendors[0]);
        }
      } catch (err) {
        console.error('Error loading vendor:', err);
      } finally {
        setLoading(false);
      }
    };

    checkVendor();
  }, []);

  const handleLogout = async () => {
    await base44.auth.logout('/operationx');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#080808] to-[#050505] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (!vendor) {
    return <VendorLogin />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#080808] via-[#0a0a0a] to-[#050505]">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-black/40 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">OperationX Vendor Portal</p>
              <p className="text-white/40 text-xs">{vendor.company_name}</p>
            </div>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 text-white/60 hover:text-white hover:border-white/20 transition-all text-sm font-medium"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </motion.button>
        </div>
      </div>

      {/* Main Content */}
      <VendorDashboard vendor={vendor} />
    </div>
  );
}