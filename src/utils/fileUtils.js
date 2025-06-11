export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const formatTime = (milliseconds) => {
  if (milliseconds < 1000) return '< 1s';
  
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
};

export const getFileIcon = (type) => {
  if (type.startsWith('image/')) return 'Image';
  if (type.startsWith('video/')) return 'Video';
  if (type.startsWith('audio/')) return 'Music';
  if (type === 'application/pdf') return 'FileText';
  if (type.startsWith('text/')) return 'FileText';
  if (type === 'application/zip' || type === 'application/x-rar-compressed') return 'Archive';
  return 'File';
};

export const generateFileId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const validateFileType = (file) => {
  const allowedTypes = [
    'image/',
    'video/',
    'audio/',
    'application/pdf',
    'text/',
    'application/zip',
    'application/x-rar-compressed'
  ];
  
  return allowedTypes.some(type => file.type.startsWith(type));
};

export const validateFileSize = (file, maxSize = 100 * 1024 * 1024) => {
  return file.size <= maxSize;
};