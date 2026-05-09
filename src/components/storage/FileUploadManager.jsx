import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, CheckCircle, AlertCircle, Loader2, Trash2 } from 'lucide-react';
import { uploadFile, getStorageQuota, deleteFile } from '@/lib/storage';
import { Button } from '@/components/ui/button';

export default function FileUploadManager({ onFileUploaded = () => {}, userId = null, schoolId = null, module = 'general' }) {
  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [quota, setQuota] = useState(null);
  const fileInputRef = useRef(null);

  React.useEffect(() => {
    loadQuota();
  }, []);

  const loadQuota = async () => {
    const q = await getStorageQuota();
    setQuota(q);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles) {
      handleFiles(droppedFiles);
    }
  };

  const handleChange = (e) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      handleFiles(selectedFiles);
    }
  };

  const handleFiles = async (fileList) => {
    const newFiles = Array.from(fileList).map((file, idx) => ({
      id: `${Date.now()}_${idx}`,
      name: file.name,
      size: file.size,
      type: file.type,
      progress: 0,
      status: 'pending',
      error: null,
      file,
    }));

    setFiles(prev => [...prev, ...newFiles]);

    // Upload each file
    for (const fileEntry of newFiles) {
      await uploadFileEntry(fileEntry);
    }
  };

  const uploadFileEntry = async (fileEntry) => {
    try {
      setFiles(prev =>
        prev.map(f =>
          f.id === fileEntry.id ? { ...f, status: 'uploading' } : f
        )
      );

      const fileUrl = await uploadFile(fileEntry.file, {
        userId,
        schoolId,
        module,
        onProgress: (progress) => {
          const percentComplete = (progress.loaded / progress.total) * 100;
          setFiles(prev =>
            prev.map(f =>
              f.id === fileEntry.id
                ? { ...f, progress: Math.round(percentComplete) }
                : f
            )
          );
        },
        onError: (error) => {
          setFiles(prev =>
            prev.map(f =>
              f.id === fileEntry.id
                ? { ...f, status: 'error', error: error.message }
                : f
            )
          );
        },
      });

      setFiles(prev =>
        prev.map(f =>
          f.id === fileEntry.id
            ? { ...f, status: 'complete', fileUrl, progress: 100 }
            : f
        )
      );

      onFileUploaded({ id: fileEntry.id, name: fileEntry.name, url: fileUrl });
      await loadQuota();
    } catch (error) {
      setFiles(prev =>
        prev.map(f =>
          f.id === fileEntry.id
            ? { ...f, status: 'error', error: error.message }
            : f
        )
      );
    }
  };

  const handleRemove = async (fileId) => {
    const file = files.find(f => f.id === fileId);
    if (file && file.fileUrl) {
      await deleteFile(file.fileUrl, userId);
      await loadQuota();
    }
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const getStoragePercentage = () => {
    if (!quota) return 0;
    return (quota.used / quota.limit) * 100;
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <motion.div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        animate={{ backgroundColor: dragActive ? '#f0f9ff' : '#ffffff' }}
        className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center transition-colors cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          Drag files here or click to upload
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Supports all file types up to 5GB per file
        </p>
        <Button variant="outline" className="mx-auto">
          Choose Files
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleChange}
          className="hidden"
        />
      </motion.div>

      {/* Storage Quota */}
      {quota && (
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-900">
              Storage ({quota.tier.toUpperCase()})
            </span>
            <span className="text-xs text-gray-600">
              {formatBytes(quota.used)} / {formatBytes(quota.limit)}
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${getStoragePercentage()}%` }}
              className={`h-full ${
                getStoragePercentage() > 90 ? 'bg-red-500' : 'bg-blue-500'
              }`}
            />
          </div>
          {getStoragePercentage() > 90 && (
            <p className="text-xs text-red-600 mt-2">
              ⚠ Storage nearly full. Consider upgrading your plan.
            </p>
          )}
        </div>
      )}

      {/* File List */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-2"
          >
            <h4 className="text-sm font-semibold text-gray-900">Uploads</h4>
            {files.map(file => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg"
              >
                {file.status === 'uploading' && (
                  <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                )}
                {file.status === 'complete' && (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                )}
                {file.status === 'error' && (
                  <AlertCircle className="w-4 h-4 text-red-500" />
                )}
                {file.status === 'pending' && (
                  <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                )}

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatBytes(file.size)}
                  </p>
                </div>

                {file.status === 'uploading' && (
                  <div className="w-20">
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${file.progress}%` }}
                        className="h-full bg-blue-500"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1 text-right">
                      {file.progress}%
                    </p>
                  </div>
                )}

                {(file.status === 'complete' || file.status === 'error') && (
                  <button
                    onClick={() => handleRemove(file.id)}
                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                  </button>
                )}

                {file.error && (
                  <p className="text-xs text-red-600">{file.error}</p>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}