import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const DropZoneArea = ({ dragOver, onClick, onDragOver, onDragLeave, onDrop, hasActiveUploads }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="relative"
    >
      <div
        onClick={onClick}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`
          relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer
          transition-all duration-300 ease-out min-h-[300px] flex flex-col items-center justify-center
          ${dragOver
            ? 'border-primary bg-gradient-to-br from-primary/5 to-secondary/5 scale-105 shadow-lg'
            : 'border-slate-300 hover:border-primary/50 hover:bg-gradient-to-br hover:from-slate-50 hover:to-slate-100'
          }
          ${hasActiveUploads ? 'opacity-75' : ''}
        `}
      >
        {/* Background gradient effect */}
        <div className={`
          absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl
          transition-opacity duration-300
          ${dragOver ? 'opacity-100' : 'opacity-0'}
        `} />

        {/* Animated upload icon */}
        <motion.div
          animate={dragOver ? {
            scale: [1, 1.2, 1],
            rotate: [0, 5, -5, 0]
          } : {
            y: [0, -5, 0]
          }}
          transition={{
            duration: dragOver ? 0.6 : 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className={`
            relative z-10 w-20 h-20 rounded-full flex items-center justify-center mb-6
            ${dragOver
              ? 'bg-gradient-to-br from-primary to-secondary text-white shadow-lg'
              : 'bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400'
            }
          `}
        >
          <ApperIcon
            name={dragOver ? "Upload" : "FolderOpen"}
            className="w-10 h-10"
          />
        </motion.div>

        {/* Text content */}
        <div className="relative z-10 space-y-3">
          <h3 className={`
            text-2xl font-heading font-semibold
            ${dragOver ? 'text-primary' : 'text-slate-700'}
          `}>
            {dragOver ? 'Drop files here' : 'Drag & drop files'}
          </h3>

          <p className="text-slate-500 text-lg">
            or <span className="text-primary font-medium underline">browse from your device</span>
          </p>

          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {['Images', 'Videos', 'Documents', 'Audio'].map((type) => (
              <span
                key={type}
                className="px-3 py-1 text-sm bg-white/50 text-slate-600 rounded-full border border-slate-200"
              >
                {type}
              </span>
            ))}
          </div>

          <p className="text-xs text-slate-400 mt-4">
            Maximum file size: 100MB
          </p>
        </div>

        {/* Pulse animation border */}
        {dragOver && (
          <motion.div
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 1.1, opacity: 0 }}
            transition={{ duration: 1, repeat: Infinity }}
            className="absolute inset-0 border-2 border-primary rounded-2xl"
          />
        )}
      </div>
    </motion.div>
  );
};

export default DropZoneArea;