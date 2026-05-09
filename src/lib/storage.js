import { base44 } from '@/api/base44Client';

/**
 * Enterprise-grade storage management for edXponential
 * Handles file uploads, storage tracking, and performance optimization
 */

const STORAGE_LIMITS = {
  free: 5 * 1024 * 1024 * 1024, // 5GB
  pro: 100 * 1024 * 1024 * 1024, // 100GB
  enterprise: 1024 * 1024 * 1024 * 1024, // 1TB
};

const MAX_FILE_SIZE = 5 * 1024 * 1024 * 1024; // 5GB per file
const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB chunks for resumable uploads

/**
 * Upload a file with progress tracking and resumability
 */
export async function uploadFile(file, options = {}) {
  const {
    onProgress = () => {},
    onError = () => {},
    userId = null,
    schoolId = null,
    module = 'general',
    metadata = {},
  } = options;

  try {
    // Validate file
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`File exceeds maximum size of 5GB`);
    }

    // Check storage quota
    const user = await base44.auth.me();
    const storageUsed = await getStorageUsed(user.email);
    const tier = user.tier || 'free';
    const limit = STORAGE_LIMITS[tier];

    if (storageUsed + file.size > limit) {
      throw new Error(`Storage quota exceeded. Upgrade your plan for more space.`);
    }

    // For small files, upload directly
    if (file.size < CHUNK_SIZE) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('metadata', JSON.stringify({
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        userId,
        schoolId,
        module,
        uploadedAt: new Date().toISOString(),
        ...metadata,
      }));

      const response = await base44.integrations.Core.UploadFile({ file });
      
      // Track file in database
      await trackFileUpload({
        fileUrl: response.file_url,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        userId,
        schoolId,
        module,
        metadata,
      });

      onProgress({ loaded: file.size, total: file.size });
      return response.file_url;
    }

    // For large files, upload in chunks with resumability
    return uploadLargeFile(file, { onProgress, onError, userId, schoolId, module, metadata });
  } catch (error) {
    onError(error);
    throw error;
  }
}

/**
 * Upload large files in chunks for resumability
 */
async function uploadLargeFile(file, options) {
  const { onProgress, userId, schoolId, module, metadata } = options;
  const chunks = Math.ceil(file.size / CHUNK_SIZE);
  let uploadedSize = 0;

  // Get or create upload session
  const sessionId = await createUploadSession({
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type,
    totalChunks: chunks,
  });

  const uploadedChunks = [];

  for (let i = 0; i < chunks; i++) {
    const start = i * CHUNK_SIZE;
    const end = Math.min(start + CHUNK_SIZE, file.size);
    const chunk = file.slice(start, end);

    try {
      // Upload chunk
      const response = await base44.integrations.Core.UploadFile({ file: chunk });
      uploadedChunks.push({
        chunkIndex: i,
        chunkUrl: response.file_url,
      });

      uploadedSize += chunk.size;
      onProgress({ loaded: uploadedSize, total: file.size, chunkIndex: i + 1, totalChunks: chunks });
    } catch (error) {
      // Save session for resumability
      await updateUploadSession(sessionId, { uploadedChunks, failedAt: new Date().toISOString() });
      throw error;
    }
  }

  // Combine chunks and create final file
  return finalizeUpload({
    sessionId,
    uploadedChunks,
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type,
    userId,
    schoolId,
    module,
    metadata,
  });
}

/**
 * Track uploaded file in database for quota management
 */
async function trackFileUpload(fileData) {
  try {
    await base44.entities.FileUpload?.create?.({
      file_url: fileData.fileUrl,
      file_name: fileData.fileName,
      file_size: fileData.fileSize,
      file_type: fileData.fileType,
      user_email: fileData.userId,
      school_id: fileData.schoolId,
      module: fileData.module,
      metadata: JSON.stringify(fileData.metadata),
      uploaded_at: new Date().toISOString(),
      status: 'active',
    });
  } catch (error) {
    console.error('Failed to track file upload:', error);
  }
}

/**
 * Get total storage used by user
 */
export async function getStorageUsed(userEmail) {
  try {
    const files = await base44.entities.FileUpload?.filter?.({ user_email: userEmail });
    return files?.reduce((total, file) => total + (file.file_size || 0), 0) || 0;
  } catch (error) {
    console.error('Failed to get storage usage:', error);
    return 0;
  }
}

/**
 * Get storage quota for user's tier
 */
export async function getStorageQuota() {
  try {
    const user = await base44.auth.me();
    const tier = user.tier || 'free';
    return {
      limit: STORAGE_LIMITS[tier],
      tier,
      used: await getStorageUsed(user.email),
    };
  } catch (error) {
    console.error('Failed to get storage quota:', error);
    return { limit: STORAGE_LIMITS.free, tier: 'free', used: 0 };
  }
}

/**
 * Create resumable upload session
 */
async function createUploadSession(sessionData) {
  try {
    const session = await base44.entities.UploadSession?.create?.({
      session_id: `session_${Date.now()}_${Math.random()}`,
      file_name: sessionData.fileName,
      file_size: sessionData.fileSize,
      file_type: sessionData.fileType,
      total_chunks: sessionData.totalChunks,
      uploaded_chunks: JSON.stringify([]),
      status: 'in_progress',
      created_at: new Date().toISOString(),
    });
    return session?.session_id;
  } catch (error) {
    console.error('Failed to create upload session:', error);
    return null;
  }
}

/**
 * Update upload session progress
 */
async function updateUploadSession(sessionId, updates) {
  try {
    const sessions = await base44.entities.UploadSession?.filter?.({ session_id: sessionId });
    if (sessions?.[0]) {
      await base44.entities.UploadSession?.update?.(sessions[0].id, updates);
    }
  } catch (error) {
    console.error('Failed to update upload session:', error);
  }
}

/**
 * Finalize large file upload
 */
async function finalizeUpload(options) {
  const { sessionId, uploadedChunks, fileName, fileSize, fileType, userId, schoolId, module, metadata } = options;

  try {
    // Create combined file entry
    await trackFileUpload({
      fileUrl: `combined://${sessionId}`,
      fileName,
      fileSize,
      fileType,
      userId,
      schoolId,
      module,
      metadata: { ...metadata, chunks: uploadedChunks.length, combined: true },
    });

    // Mark session as complete
    const sessions = await base44.entities.UploadSession?.filter?.({ session_id: sessionId });
    if (sessions?.[0]) {
      await base44.entities.UploadSession?.update?.(sessions[0].id, { status: 'completed' });
    }

    return `combined://${sessionId}`;
  } catch (error) {
    console.error('Failed to finalize upload:', error);
    throw error;
  }
}

/**
 * Delete a file and free up storage
 */
export async function deleteFile(fileUrl, userId) {
  try {
    const files = await base44.entities.FileUpload?.filter?.({ file_url: fileUrl, user_email: userId });
    if (files?.[0]) {
      await base44.entities.FileUpload?.update?.(files[0].id, {
        status: 'deleted',
        deleted_at: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error('Failed to delete file:', error);
  }
}

/**
 * Get user's files
 */
export async function getUserFiles(userEmail, filters = {}) {
  try {
    const query = { user_email: userEmail, status: 'active', ...filters };
    const files = await base44.entities.FileUpload?.filter?.(query, '-uploaded_at', 100);
    return files || [];
  } catch (error) {
    console.error('Failed to get user files:', error);
    return [];
  }
}

/**
 * Get school files
 */
export async function getSchoolFiles(schoolId, filters = {}) {
  try {
    const query = { school_id: schoolId, status: 'active', ...filters };
    const files = await base44.entities.FileUpload?.filter?.(query, '-uploaded_at', 100);
    return files || [];
  } catch (error) {
    console.error('Failed to get school files:', error);
    return [];
  }
}

export default {
  uploadFile,
  getStorageUsed,
  getStorageQuota,
  deleteFile,
  getUserFiles,
  getSchoolFiles,
  STORAGE_LIMITS,
};