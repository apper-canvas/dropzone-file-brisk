import React from 'react';
import { motion } from 'framer-motion';

const HeroSection = () => {
    return (
        <div className="text-center space-y-4">
            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-5xl font-heading font-bold gradient-text"
            >
                Upload Files Effortlessly
            </motion.h1>
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-slate-600 max-w-2xl mx-auto"
            >
                Drag and drop your files or click to browse. Experience smooth, visual progress tracking with a modern interface.
            </motion.p>
        </div>
    );
};

export default HeroSection;