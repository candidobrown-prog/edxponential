import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

export default function VendorInvoiceSubmission({ vendor, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    invoiceNumber: '',
    amount: '',
    description: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ invoiceNumber: '', amount: '', description: '' });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 max-w-md w-full"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">Submit Invoice</h3>
          <button onClick={onClose} className="text-white/60 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-white/80 mb-2">Invoice Number</label>
            <input
              type="text"
              placeholder="INV-2026-..."
              value={formData.invoiceNumber}
              onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-white/80 mb-2">Amount</label>
            <input
              type="number"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-white/80 mb-2">Description</label>
            <textarea
              placeholder="Invoice details..."
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2.5 rounded-lg bg-white text-black font-semibold hover:bg-white/90 transition-all"
          >
            Submit Invoice
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}