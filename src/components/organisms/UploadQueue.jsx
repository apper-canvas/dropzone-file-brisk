import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import FileCard from '@/components/molecules/FileCard';

function UploadQueue({ uploads, onPause, onResume, onCancel }) {
  const activeUploads = uploads.filter(upload =>
    upload.status === 'queued' || upload.status === 'uploading' || upload.status === 'paused'
  );

  if (activeUploads.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-heading font-semibold text-slate-700 flex items-center space-x-2">
          <ApperIcon name="Upload" className="w-5 h-5 text-primary" />
          <span>Upload Queue</span>
          <span className="text-sm font-normal text-slate-500">
            ({activeUploads.length} file{activeUploads.length !== 1 ? 's' : ''})
          </span>
        </h2>
      </div>

      <div className="space-y-3 max-w-full overflow-hidden">
        <AnimatePresence>
          {activeUploads.map((upload, index) => (
            <motion.div
              key={upload.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.1 }}
            >
              <FileCard
                upload={upload}
                onPause={() => onPause(upload.id)}
                onResume={() => onResume(upload.id)}
                onCancel={() => onCancel(upload.id)}
                showActions={true}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default UploadQueue;