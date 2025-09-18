'use client';

import { useState, useRef } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle, X, Loader2 } from 'lucide-react';

interface UploadedFile {
  filename: string;
  fileSize: number;
  fileType: string;
  extractedText: string;
  claims: any[];
  claimCount: number;
}

interface DocumentUploadProps {
  onFileProcessed?: (data: UploadedFile) => void;
}

export default function DocumentUpload({ onFileProcessed }: DocumentUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('word')) return '📝';
    if (fileType.includes('text')) return '📃';
    return '📄';
  };

  const simulateProgress = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
      }
      setProgress(Math.min(progress, 99));
    }, 200);
    return interval;
  };

  const handleFile = async (file: File) => {
    setError('');
    setUploading(true);
    setProgress(0);

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];

    if (!allowedTypes.includes(file.type)) {
      setError('Unsupported file type. Please upload PDF, DOCX, or TXT files.');
      setUploading(false);
      return;
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setError('File too large. Maximum size is 10MB.');
      setUploading(false);
      return;
    }

    const progressInterval = simulateProgress();

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      clearInterval(progressInterval);
      setProgress(100);

      const uploadedData: UploadedFile = {
        filename: data.filename,
        fileSize: data.fileSize,
        fileType: data.fileType,
        extractedText: data.extractedText,
        claims: data.claims,
        claimCount: data.claimCount
      };

      setUploadedFile(uploadedData);
      onFileProcessed?.(uploadedData);

    } catch (err) {
      clearInterval(progressInterval);
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const resetUpload = () => {
    setUploadedFile(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Upload Area */}
      {!uploadedFile && (
        <div
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 ${
            dragActive
              ? 'border-blue-500 bg-blue-500/10'
              : uploading
              ? 'border-gray-600 bg-gray-900/50'
              : 'border-gray-600 hover:border-gray-500'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInput}
            accept=".pdf,.docx,.txt"
            className="hidden"
            disabled={uploading}
          />

          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center">
              {uploading ? (
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              ) : (
                <Upload className="w-8 h-8 text-gray-400" />
              )}
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {uploading ? 'Processing Document...' : 'Upload Document'}
              </h3>
              <p className="text-gray-400 mb-4">
                {uploading
                  ? 'Extracting text and analyzing claims...'
                  : 'Drag and drop your document here, or click to browse'
                }
              </p>
              <p className="text-sm text-gray-500">
                Supports PDF, DOCX, and TXT files (max 10MB)
              </p>
            </div>

            {!uploading && (
              <button
                onClick={openFileDialog}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FileText className="w-5 h-5" />
                Select File
              </button>
            )}

            {/* Progress Bar */}
            {uploading && (
              <div className="space-y-2">
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-400">{Math.round(progress)}% complete</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-4 bg-red-900/20 border border-red-700 rounded-lg">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-400">{error}</p>
          </div>
        </div>
      )}

      {/* Success Result */}
      {uploadedFile && (
        <div className="space-y-6">
          {/* File Info Card */}
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <span className="text-3xl">{getFileIcon(uploadedFile.fileType)}</span>
                <div>
                  <h3 className="text-lg font-semibold text-white">{uploadedFile.filename}</h3>
                  <p className="text-sm text-gray-400">
                    {formatFileSize(uploadedFile.fileSize)} • {uploadedFile.claimCount} claims detected
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-green-500 text-sm">Processed</span>
              </div>
            </div>

            {/* Extracted Text Preview */}
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-300 mb-2">Extracted Text Preview:</h4>
              <div className="bg-gray-800 rounded-lg p-4 max-h-32 overflow-y-auto">
                <p className="text-sm text-gray-300 leading-relaxed">
                  {uploadedFile.extractedText}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={resetUpload}
                className="flex items-center gap-2 px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <X className="w-4 h-4" />
                Upload Another File
              </button>
            </div>
          </div>

          {/* Claims Summary */}
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Detected Claims</h3>
            <div className="space-y-3">
              {uploadedFile.claims.map((claim, index) => (
                <div key={index} className="bg-gray-800 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-gray-300 mb-2">{claim.claim}</p>
                      <p className="text-xs text-gray-500">
                        Original: "{claim.original_text}"
                      </p>
                    </div>
                    <span className="text-xs bg-blue-600/20 text-blue-400 px-2 py-1 rounded-full">
                      Claim #{index + 1}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}