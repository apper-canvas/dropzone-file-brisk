import { motion, AnimatePresence } from 'framer-motion';
import FileCard from './FileCard';
import ApperIcon from './ApperIcon';

function FileList({ files, title, loading, onAction }) {
  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-heading font-semibold text-slate-700">
          {title}
        </h2>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-xl p-4 shadow-lg"
            >
              <div className="animate-pulse flex items-center space-x-4">
                <div className="w-12 h-12 bg-slate-200 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12 space-y-4"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="w-16 h-16 mx-auto bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center"
        >
          <ApperIcon name="FolderOpen" className="w-8 h-8 text-slate-400" />
        </motion.div>
        <div>
          <h3 className="text-lg font-heading font-medium text-slate-600">No files yet</h3>
          <p className="text-slate-500 mt-1">Upload your first file to get started</p>
        </div>
        {onAction && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onAction}
            className="mt-4 px-6 py-2 bg-gradient-to-r from-primary to-secondary text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Upload Files
          </motion.button>
        )}
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-heading font-semibold text-slate-700">
        {title}
      </h2>
      <div className="space-y-3 max-w-full overflow-hidden">
        <AnimatePresence>
          {files.map((file, index) => (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
            >
              <FileCard upload={file} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default FileList;