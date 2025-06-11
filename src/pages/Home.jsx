import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import MainFeature from '../components/MainFeature';
import UploadStats from '../components/UploadStats';
import { fileUploadService } from '../services';

function Home() {
  const [uploadSession, setUploadSession] = useState({
    totalFiles: 0,
    totalSize: 0,
    uploadedSize: 0,
    startTime: null,
    estimatedTimeRemaining: 0
  });
  const [recentUploads, setRecentUploads] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRecentUploads();
  }, []);

  const loadRecentUploads = async () => {
    setLoading(true);
    try {
      const uploads = await fileUploadService.getRecentUploads();
      setRecentUploads(uploads);
    } catch (error) {
      console.error('Failed to load recent uploads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadStart = (files) => {
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    setUploadSession({
      totalFiles: files.length,
      totalSize,
      uploadedSize: 0,
      startTime: Date.now(),
      estimatedTimeRemaining: 0
    });
  };

  const handleUploadProgress = (uploadedSize, totalSize) => {
    const elapsed = Date.now() - uploadSession.startTime;
    const rate = uploadedSize / elapsed; // bytes per ms
    const remaining = totalSize - uploadedSize;
    const estimatedTimeRemaining = remaining / rate;

    setUploadSession(prev => ({
      ...prev,
      uploadedSize,
      estimatedTimeRemaining: estimatedTimeRemaining || 0
    }));
  };

  const handleUploadComplete = async (completedFiles) => {
    toast.success(`Successfully uploaded ${completedFiles.length} file(s)!`);
    
    // Confetti effect
    const confettiElements = document.querySelectorAll('.confetti');
    confettiElements.forEach(el => {
      el.classList.add('animate-confetti');
    });

    // Reset session
    setUploadSession({
      totalFiles: 0,
      totalSize: 0,
      uploadedSize: 0,
      startTime: null,
      estimatedTimeRemaining: 0
    });

    // Reload recent uploads
    await loadRecentUploads();
  };

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8 max-w-full overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        {/* Hero Section */}
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

        {/* Upload Stats */}
        <UploadStats
          session={uploadSession}
          onProgress={handleUploadProgress}
        />

        {/* Main Upload Feature */}
        <MainFeature
          onUploadStart={handleUploadStart}
          onUploadProgress={handleUploadProgress}
          onUploadComplete={handleUploadComplete}
          recentUploads={recentUploads}
          loading={loading}
        />

        {/* Confetti elements for success animation */}
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="confetti absolute w-2 h-2 bg-gradient-to-r from-primary to-secondary rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default Home;