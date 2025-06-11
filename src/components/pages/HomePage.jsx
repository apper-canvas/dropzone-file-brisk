import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import HeroSection from '@/components/organisms/HeroSection';
import UploadStats from '@/components/organisms/UploadStats';
import MainFeature from '@/components/organisms/MainFeature';
import { fileUploadService } from '@/services';

function HomePage() {
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
      el.addEventListener('animationend', () => {
        el.classList.remove('animate-confetti');
      }, { once: true });
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
        <HeroSection />

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

export default HomePage;