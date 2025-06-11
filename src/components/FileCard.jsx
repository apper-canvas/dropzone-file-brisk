import { motion } from 'framer-motion';
import ApperIcon from './ApperIcon';
import { formatFileSize, getFileIcon } from '../utils/fileUtils';

function FileCard({ upload, onPause, onResume, onCancel, showActions = false }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-success';
      case 'error':
        return 'text-error';
      case 'paused':
        return 'text-warning';
      case 'uploading':
        return 'text-info';
      default:
        return 'text-slate-500';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return 'CheckCircle';
      case 'error':
        return 'XCircle';
      case 'paused':
        return 'PauseCircle';
      case 'uploading':
        return 'Loader';
      default:
        return 'Clock';
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="glass rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-200"
    >
      <div className="flex items-start space-x-4 min-w-0">
        {/* File preview/icon */}
        <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-slate-100 flex items-center justify-center">
          {upload.preview ? (
            <img
              src={upload.preview}
              alt={upload.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <ApperIcon
              name={getFileIcon(upload.type)}
              className="w-6 h-6 text-slate-400"
            />
          )}
        </div>

        {/* File info */}
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-start justify-between">
            <div className="min-w-0 flex-1">
              <h3 className="font-medium text-slate-700 truncate" title={upload.name}>
                {upload.name}
              </h3>
              <p className="text-sm text-slate-500">
                {formatFileSize(upload.size)}
              </p>
            </div>

            {/* Status */}
            <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
              <ApperIcon
                name={getStatusIcon(upload.status)}
                className={`w-4 h-4 ${getStatusColor(upload.status)} ${
                  upload.status === 'uploading' ? 'animate-spin' : ''
                }`}
              />
              <span className={`text-xs font-medium ${getStatusColor(upload.status)}`}>
                {upload.status.charAt(0).toUpperCase() + upload.status.slice(1)}
              </span>
            </div>
          </div>

          {/* Progress bar */}
          {(upload.status === 'uploading' || upload.status === 'paused') && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-500">
                <span>{upload.progress.toFixed(0)}%</span>
                <span>{upload.status === 'uploading' ? 'Uploading...' : 'Paused'}</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${upload.progress}%` }}
                  transition={{ duration: 0.3 }}
                  className="h-full bg-gradient-to-r from-primary to-secondary relative"
                >
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-50 blur-sm" />
                </motion.div>
              </div>
            </div>
          )}

          {/* Error message */}
          {upload.status === 'error' && upload.error && (
            <p className="text-xs text-error bg-error/10 px-2 py-1 rounded">
              {upload.error}
            </p>
          )}

          {/* Actions */}
          {showActions && (upload.status === 'uploading' || upload.status === 'paused' || upload.status === 'queued') && (
            <div className="flex items-center space-x-2 pt-1">
              {upload.status === 'uploading' && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onPause}
                  className="flex items-center space-x-1 px-2 py-1 text-xs bg-warning/10 text-warning rounded-lg hover:bg-warning/20 transition-colors"
                >
                  <ApperIcon name="Pause" className="w-3 h-3" />
                  <span>Pause</span>
                </motion.button>
              )}

              {upload.status === 'paused' && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onResume}
                  className="flex items-center space-x-1 px-2 py-1 text-xs bg-info/10 text-info rounded-lg hover:bg-info/20 transition-colors"
                >
                  <ApperIcon name="Play" className="w-3 h-3" />
                  <span>Resume</span>
                </motion.button>
              )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onCancel}
                className="flex items-center space-x-1 px-2 py-1 text-xs bg-error/10 text-error rounded-lg hover:bg-error/20 transition-colors"
              >
                <ApperIcon name="X" className="w-3 h-3" />
                <span>Cancel</span>
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default FileCard;