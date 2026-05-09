import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Upload, CheckCircle, Clock, AlertCircle, Plus, Download, Eye } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import VendorInvoiceSubmission from '../../components/operationx/VendorInvoiceSubmission';
import VendorComplianceDocs from '../../components/operationx/VendorComplianceDocs';

export default function VendorDashboard({ vendor }) {
  const [tab, setTab] = useState('invoices'); // invoices, compliance, documents
  const [invoices, setInvoices] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    paid: 0,
    totalValue: 0,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Mock invoice data - in production would query based on vendor_id
        const mockInvoices = [
          {
            id: '1',
            invoice_number: 'INV-2026-001',
            amount: 2500,
            date_submitted: '2026-05-08',
            status: 'approved',
            description: 'HVAC System Maintenance',
          },
          {
            id: '2',
            invoice_number: 'INV-2026-002',
            amount: 1800,
            date_submitted: '2026-05-09',
            status: 'pending_review',
            description: 'Electrical Repairs - Building A',
          },
          {
            id: '3',
            invoice_number: 'INV-2026-003',
            amount: 5200,
            date_submitted: '2026-05-07',
            status: 'paid',
            description: 'Roof Inspection and Repairs',
          },
        ];

        const mockDocs = [
          {
            id: '1',
            type: 'insurance',
            name: 'General Liability Insurance',
            expires: '2026-08-15',
            status: 'valid',
            file_url: 'https://example.com/doc1.pdf',
          },
          {
            id: '2',
            type: 'w9',
            name: 'W-9 Form',
            expires: '2027-12-31',
            status: 'valid',
            file_url: 'https://example.com/doc2.pdf',
          },
          {
            id: '3',
            type: 'insurance',
            name: 'Workers Compensation',
            expires: '2026-06-30',
            status: 'expiring_soon',
            file_url: 'https://example.com/doc3.pdf',
          },
        ];

        setInvoices(mockInvoices);
        setDocuments(mockDocs);

        setStats({
          pending: mockInvoices.filter(i => i.status === 'pending_review').length,
          approved: mockInvoices.filter(i => i.status === 'approved').length,
          paid: mockInvoices.filter(i => i.status === 'paid').length,
          totalValue: mockInvoices.reduce((sum, i) => sum + i.amount, 0),
        });

        setLoading(false);
      } catch (err) {
        console.error('Error loading vendor data:', err);
        setLoading(false);
      }
    };

    loadData();
  }, [vendor]);

  const statusConfig = {
    pending_review: { color: 'bg-yellow-500/10', text: 'text-yellow-600', label: 'Pending Review', icon: Clock },
    approved: { color: 'bg-blue-500/10', text: 'text-blue-600', label: 'Approved', icon: CheckCircle },
    paid: { color: 'bg-green-500/10', text: 'text-green-600', label: 'Paid', icon: CheckCircle },
    rejected: { color: 'bg-red-500/10', text: 'text-red-600', label: 'Rejected', icon: AlertCircle },
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12"
      >
        {[
          { label: 'Pending Invoices', value: stats.pending, icon: Clock, color: 'yellow' },
          { label: 'Approved', value: stats.approved, icon: CheckCircle, color: 'blue' },
          { label: 'Paid', value: stats.paid, icon: CheckCircle, color: 'green' },
          { label: 'Total Value', value: `$${stats.totalValue.toLocaleString()}`, icon: FileText, color: 'purple' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-5 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-white/60 text-sm font-semibold">{stat.label}</p>
              <stat.icon className="w-4 h-4 text-white/40" />
            </div>
            <p className="text-2xl font-black text-white">{stat.value}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex gap-2 mb-8 border-b border-white/5 pb-4"
      >
        {[
          { id: 'invoices', label: 'Invoices', icon: FileText },
          { id: 'compliance', label: 'Compliance', icon: CheckCircle },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
              tab === t.id
                ? 'bg-white text-black'
                : 'text-white/60 hover:text-white/80'
            }`}
          >
            <t.icon className="w-4 h-4" />
            {t.label}
          </button>
        ))}
      </motion.div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {tab === 'invoices' && (
          <motion.div
            key="invoices"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Invoice Management</h2>
              <button
                onClick={() => setShowInvoiceForm(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-black font-semibold hover:bg-white/90 transition-all"
              >
                <Plus className="w-4 h-4" />
                Submit Invoice
              </button>
            </div>

            <div className="space-y-3">
              {invoices.map((invoice, i) => {
                const config = statusConfig[invoice.status];
                const StatusIcon = config.icon;

                return (
                  <motion.div
                    key={invoice.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="p-5 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <p className="font-bold text-white">{invoice.invoice_number}</p>
                          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${config.color}`}>
                            <StatusIcon className={`w-3 h-3 ${config.text}`} />
                            <span className={`text-xs font-semibold ${config.text}`}>{config.label}</span>
                          </div>
                        </div>
                        <p className="text-white/60 text-sm mb-2">{invoice.description}</p>
                        <p className="text-white/40 text-xs">Submitted: {new Date(invoice.date_submitted).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-2xl font-black text-white">${invoice.amount.toLocaleString()}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {tab === 'compliance' && (
          <motion.div
            key="compliance"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Compliance Documents</h2>
              <VendorComplianceDocs vendorId={vendor.id} onUpload={() => {}} />
            </div>

            <div className="space-y-3">
              {documents.map((doc, i) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-5 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="font-bold text-white">{doc.name}</p>
                        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${
                          doc.status === 'valid' ? 'bg-green-500/10' : 'bg-yellow-500/10'
                        }`}>
                          <CheckCircle className={`w-3 h-3 ${doc.status === 'valid' ? 'text-green-600' : 'text-yellow-600'}`} />
                          <span className={`text-xs font-semibold ${doc.status === 'valid' ? 'text-green-600' : 'text-yellow-600'}`}>
                            {doc.status === 'valid' ? 'Active' : 'Expiring Soon'}
                          </span>
                        </div>
                      </div>
                      <p className="text-white/60 text-sm">Expires: {new Date(doc.expires).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button className="p-2 rounded-lg hover:bg-white/10 transition-all">
                        <Download className="w-4 h-4 text-white/60 hover:text-white" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-white/10 transition-all">
                        <Eye className="w-4 h-4 text-white/60 hover:text-white" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Invoice Form Modal */}
      <AnimatePresence>
        {showInvoiceForm && (
          <VendorInvoiceSubmission
            vendor={vendor}
            onClose={() => setShowInvoiceForm(false)}
            onSubmit={() => {
              setShowInvoiceForm(false);
              // Refresh invoices
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}