import mockData from '../mockData/fileUploads.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class FileUploadService {
  constructor() {
    this.uploads = [...mockData];
  }

  async getRecentUploads() {
    await delay(300);
    
    // Filter uploads from last 24 hours
    const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
    const recentUploads = this.uploads
      .filter(upload => upload.uploadedAt && upload.uploadedAt > oneDayAgo)
      .sort((a, b) => b.uploadedAt - a.uploadedAt);
    
    return [...recentUploads];
  }

  async uploadFile(file, onProgress) {
    await delay(200);
    
    // Simulate upload progress
    const totalChunks = 20;
    let uploadedChunks = 0;
    
    return new Promise((resolve, reject) => {
      const uploadInterval = setInterval(() => {
        uploadedChunks++;
        const progress = (uploadedChunks / totalChunks) * 100;
        onProgress(Math.min(progress, 100));
        
        if (uploadedChunks >= totalChunks) {
          clearInterval(uploadInterval);
          
          // Create upload record
          const upload = {
            id: Date.now() + Math.random(),
            name: file.name,
            size: file.size,
            type: file.type,
            status: 'completed',
            progress: 100,
            uploadedAt: Date.now(),
            preview: null,
            error: null
          };
          
          // Add to uploads list
          this.uploads.unshift(upload);
          
          resolve(upload);
        }
      }, 150 + Math.random() * 100); // Random delay between 150-250ms
      
      // Simulate occasional failures (5% chance)
      if (Math.random() < 0.05) {
        setTimeout(() => {
          clearInterval(uploadInterval);
          reject(new Error('Upload failed due to network error'));
        }, 1000 + Math.random() * 2000);
      }
    });
  }

  async pauseUpload(id) {
    await delay(100);
    
    const upload = this.uploads.find(u => u.id === id);
    if (upload) {
      upload.status = 'paused';
    }
    
    return upload;
  }

  async resumeUpload(id) {
    await delay(100);
    
    const upload = this.uploads.find(u => u.id === id);
    if (upload) {
      upload.status = 'uploading';
    }
    
    return upload;
  }

  async cancelUpload(id) {
    await delay(100);
    
    this.uploads = this.uploads.filter(u => u.id !== id);
    return true;
  }

  async deleteUpload(id) {
    await delay(200);
    
    this.uploads = this.uploads.filter(u => u.id !== id);
    return true;
  }

  async getUploadById(id) {
    await delay(150);
    
    const upload = this.uploads.find(u => u.id === id);
    return upload ? { ...upload } : null;
  }

  async getUploadStats() {
    await delay(200);
    
    const completed = this.uploads.filter(u => u.status === 'completed');
    const totalSize = completed.reduce((sum, u) => sum + u.size, 0);
    
    return {
      totalUploads: completed.length,
      totalSize,
      successRate: this.uploads.length > 0 ? (completed.length / this.uploads.length) * 100 : 0,
      averageSize: completed.length > 0 ? totalSize / completed.length : 0
    };
  }
}

export default new FileUploadService();