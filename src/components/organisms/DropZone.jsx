import React, { useRef } from 'react';
import Input from '@/components/atoms/Input';
import DropZoneArea from '@/components/molecules/DropZoneArea';

function DropZone({ onFilesSelected, dragOver, onDragOver, onDragLeave, onDrop, hasActiveUploads }) {
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      onFilesSelected(files);
    }
    // Reset input
    e.target.value = '';
  };

  return (
    <>
      <DropZoneArea
        dragOver={dragOver}
        onClick={handleClick}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        hasActiveUploads={hasActiveUploads}
      />
      {/* Hidden file input */}
      <Input
        type="file"
        ref={fileInputRef}
        multiple
        onChange={handleFileSelect}
        className="hidden"
        accept="image/*,video/*,audio/*,application/pdf,text/*,application/zip,application/x-rar-compressed"
      />
    </>
  );
}

export default DropZone;