import { motion } from 'framer-motion';
import ApperIcon from './ApperIcon';
import { formatFileSize, formatTime } from '../utils/fileUtils';

function UploadStats({ session, onProgress }) {
  const progressPercentage = session.totalSize > 0 
    ? (session.uploadedSize / session.totalSize) * 100 
    : 0;

  if (session.totalFiles === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-xl p-6 shadow-lg"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-heading font-semibold text-slate-700 flex items-center space-x-2">
          <ApperIcon name="BarChart3" className="w-5 h-5 text-primary" />
          <span>Upload Progress</span>
        </h3>
        <div className="text-right">
          <div className="text-2xl font-bold gradient-text">
            {progressPercentage.toFixed(0)}%
          </div>
          <div className="text-xs text-slate-500">
            {session.totalFiles} file{session.totalFiles !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5 }}
            className="h-full bg-gradient-to-r from-primary to-secondary relative"
          >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-50 blur-sm" />
            {/* Moving shine effect */}
            <motion.div
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
            />
          </motion.div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className="space-y-1">
          <div className="text-slate-500">Uploaded</div>
          <div className="font-medium text-slate-700">
            {formatFileSize(session.uploadedSize)}
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="text-slate-500">Total Size</div>
          <div className="font-medium text-slate-700">
            {formatFileSize(session.totalSize)}
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="text-slate-500">Time Remaining</div>
          <div className="font-medium text-slate-700">
            {session.estimatedTimeRemaining > 0 
              ? formatTime(session.estimatedTimeRemaining)
              : '--'
            }
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="text-slate-500">Speed</div>
          <div className="font-medium text-slate-700">
            {session.startTime && session.uploadedSize > 0
              ? `${formatFileSize((session.uploadedSize / (Date.now() - session.startTime)) * 1000)}/s`
              : '--'
            }
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default UploadStats;