import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import DropZone from '@/components/organisms/DropZone';
import UploadQueue from '@/components/organisms/UploadQueue';
import RecentUploads from '@/components/organisms/RecentUploads';
import { fileUploadService } from '@/services';

function MainFeature({ onUploadStart, onUploadProgress, onUploadComplete, recentUploads, loading }) {
  const [activeUploads, setActiveUploads] = useState([]);
  const [dragOver, setDragOver] = useState(false);

  const handleFilesSelected = useCallback(async (files) => {
    // Validate files
    const validFiles = [];
    const maxSize = 100 * 1024 * 1024; // 100MB
    const allowedTypes = ['image/', 'video/', 'audio/', 'application/pdf', 'text/', 'application/zip', 'application/x-rar'];

    for (const file of files) {
      if (file.size > maxSize) {
        toast.error(`File "${file.name}" is too large. Maximum size is 100MB.`);
        continue;
      }

      const isValidType = allowedTypes.some(type => file.type.startsWith(type));
      if (!isValidType) {
        toast.error(`File type "${file.type}" is not supported.`);
        continue;
      }

      validFiles.push(file);
    }

    if (validFiles.length === 0) {
      return;
    }

    // Create upload objects
    const uploadFiles = validFiles.map(file => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'queued',
      progress: 0,
      preview: null,
      error: null,
      uploadedAt: null
    }));

    // Generate previews for images
    for (const uploadFile of uploadFiles) {
      if (uploadFile.type.startsWith('image/')) {
        try {
          uploadFile.preview = await generatePreview(uploadFile.file);
        } catch (error) {
          console.error('Failed to generate preview:', error);
        }
      }
    }

    setActiveUploads(prev => [...prev, ...uploadFiles]);
    onUploadStart(uploadFiles);

    // Start uploads
    uploadFiles.forEach(uploadFile => {
      startUpload(uploadFile);
    });
  }, [onUploadStart]);

  const generatePreview = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const startUpload = async (uploadFile) => {
    try {
      // Update status to uploading
      setActiveUploads(prev => prev.map(f =>
        f.id === uploadFile.id ? { ...f, status: 'uploading' } : f
      ));

      // Simulate upload with progress
      const result = await fileUploadService.uploadFile(uploadFile.file, (progress) => {
        setActiveUploads(prev => prev.map(f =>
          f.id === uploadFile.id ? { ...f, progress } : f
        ));

        // Calculate total progress from all active uploads for HomePage
        const currentActiveUploads = activeUploads.map(f =>
            f.id === uploadFile.id ? { ...f, progress } : f
        );
        const totalUploadedBytes = currentActiveUploads.reduce((sum, f) => {
            if (f.status === 'completed') return sum + f.size;
            if (f.status === 'uploading') return sum + (f.size * f.progress / 100);
            return sum;
        }, 0);
        const totalSessionSize = currentActiveUploads.reduce((sum, f) => sum + f.size, 0);

        if (totalSessionSize > 0) {
            onUploadProgress(totalUploadedBytes, totalSessionSize);
        }
      });

      // Update status to completed
      setActiveUploads(prev => prev.map(f =>
        f.id === uploadFile.id ? {
          ...f,
          status: 'completed',
          progress: 100,
          uploadedAt: Date.now()
        } : f
      ));

      // Check if all uploads are complete
      setActiveUploads(prev => {
        const allComplete = prev.every(f => f.status === 'completed' || f.status === 'error');
        if (allComplete) {
          const completedFiles = prev.filter(f => f.status === 'completed');
          setTimeout(() => {
            onUploadComplete(completedFiles);
            setActiveUploads([]);
          }, 1000);
        }
        return prev;
      });

    } catch (error) {
      console.error('Upload failed:', error);
      setActiveUploads(prev => prev.map(f =>
        f.id === uploadFile.id ? {
          ...f,
          status: 'error',
          error: error.message || 'Upload failed'
        } : f
      ));
      toast.error(`Failed to upload "${uploadFile.name}"`);
    }
  };

  const handlePauseUpload = (id) => {
    setActiveUploads(prev => prev.map(f =>
      f.id === id ? { ...f, status: 'paused' } : f
    ));
    toast.info('Upload paused');
  };

  const handleResumeUpload = (id) => {
    const uploadFile = activeUploads.find(f => f.id === id);
    if (uploadFile) {
      setActiveUploads(prev => prev.map(f =>
        f.id === id ? { ...f, status: 'uploading' } : f
      ));
      // Continue upload from where it left off
      startUpload(uploadFile);
    }
  };

  const handleCancelUpload = (id) => {
    setActiveUploads(prev => prev.filter(f => f.id !== id));
    toast.info('Upload cancelled');
  };

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFilesSelected(files);
    }
  }, [handleFilesSelected]);

  return (
    <div className="space-y-8 max-w-full overflow-hidden">
      {/* Drop Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <DropZone
          onFilesSelected={handleFilesSelected}
          dragOver={dragOver}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          hasActiveUploads={activeUploads.length > 0}
        />
      </motion.div>

      {/* Upload Queue */}
      <AnimatePresence>
        {activeUploads.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <UploadQueue
              uploads={activeUploads}
              onPause={handlePauseUpload}
              onResume={handleResumeUpload}
              onCancel={handleCancelUpload}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recent Uploads */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <RecentUploads
          uploads={recentUploads}
          loading={loading}
        />
      </motion.div>
    </div>
  );
}

export default MainFeature;