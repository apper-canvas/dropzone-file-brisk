import React from 'react';
import { motion } from 'framer-motion';

const ProgressBar = ({ progress, className, showShine = false }) => {
    return (
        <div className={`w-full bg-slate-200 rounded-full h-2 overflow-hidden ${className}`}>
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
                className="h-full bg-gradient-to-r from-primary to-secondary relative"
            >
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-50 blur-sm" />
                {/* Moving shine effect (conditional for UploadStats) */}
                {showShine && (
                    <motion.div
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                    />
                )}
            </motion.div>
        </div>
    );
};

export default ProgressBar;