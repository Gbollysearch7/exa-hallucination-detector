'use client';

import { useState } from 'react';
import { FileText, CheckCircle, AlertTriangle, Clock, Eye, Download, Share2 } from 'lucide-react';

interface DocumentCardProps {
  document: {
    id: string;
    filename: string;
    fileSize: number;
    claimCount: number;
    verifiedCount: number;
    status: 'processing' | 'completed' | 'needs_review';
    confidence: number;
    lastUpdated: string;
  };
  onView: (document: any) => void;
}

export default function DocumentCard({ document, onView }: DocumentCardProps) {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = () => {
    switch (document.status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'needs_review':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'processing':
        return <Clock className="w-5 h-5 text-blue-500 animate-spin" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = () => {
    switch (document.status) {
      case 'completed':
        return 'bg-green-500/20 text-green-500';
      case 'needs_review':
        return 'bg-yellow-500/20 text-yellow-500';
      case 'processing':
        return 'bg-blue-500/20 text-blue-500';
      default:
        return 'bg-gray-500/20 text-gray-500';
    }
  };

  const getConfidenceColor = () => {
    if (document.confidence >= 80) return 'text-green-500';
    if (document.confidence >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 hover:border-gray-600 transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <FileText className="w-8 h-8 text-blue-500" />
          <div>
            <h3 className="font-semibold text-white text-lg">{document.filename}</h3>
            <p className="text-sm text-gray-400">{formatFileSize(document.fileSize)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor()}`}>
            {document.status.replace('_', ' ')}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-800 rounded-lg p-3">
          <p className="text-xs text-gray-400 mb-1">Claims Found</p>
          <p className="text-xl font-semibold text-white">{document.claimCount}</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-3">
          <p className="text-xs text-gray-400 mb-1">Verified</p>
          <p className="text-xl font-semibold text-green-500">{document.verifiedCount}</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-gray-400 mb-1">Overall Confidence</p>
          <p className={`text-lg font-semibold ${getConfidenceColor()}`}>
            {document.confidence}%
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400 mb-1">Last Updated</p>
          <p className="text-sm text-gray-300">{document.lastUpdated}</p>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onView(document)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Eye className="w-4 h-4" />
          Review Claims
        </button>
        <button className="p-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors">
          <Download className="w-4 h-4" />
        </button>
        <button className="p-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors">
          <Share2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}