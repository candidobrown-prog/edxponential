import React from 'react';
import { Upload } from 'lucide-react';

export default function VendorComplianceDocs({ vendorId, onUpload }) {
  const handleUpload = () => {
    onUpload();
  };

  return (
    <button
      onClick={handleUpload}
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-black font-semibold hover:bg-white/90 transition-all"
    >
      <Upload className="w-4 h-4" />
      Upload Document
    </button>
  );
}