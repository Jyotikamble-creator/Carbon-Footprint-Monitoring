'use client';

import { X, FileText, CheckCircle, AlertCircle } from 'lucide-react';

interface AlternativeStatesProps {
  state: 'ready' | 'uploading' | 'complete' | 'error';
  file: File | null;
  progress: number;
  onRemove: () => void;
  onUpload: () => void;
}

export default function AlternativeStates({ 
  state, 
  file, 
  progress, 
  onRemove, 
  onUpload 
}: AlternativeStatesProps) {
  
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-6">
      {/* File Ready for Upload */}
      {state === 'ready' && file && (
        <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          <h3 className="text-white font-semibold mb-4">File Ready for Upload</h3>
          
          <div className="flex items-center justify-between bg-gray-900/50 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <div className="text-white font-medium">{file.name}</div>
                <div className="text-sm text-gray-400">{formatFileSize(file.size)}</div>
              </div>
            </div>
            <button
              onClick={onRemove}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={onUpload}
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-gray-900 font-semibold rounded-lg transition-colors"
          >
            Upload File
          </button>
        </div>
      )}

      {/* Uploading */}
      {state === 'uploading' && (
        <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          <h3 className="text-white font-semibold mb-4">Uploading...</h3>
          
          <div className="mb-2">
            <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          
          <p className="text-sm text-gray-400 text-center">{progress}% complete</p>
        </div>
      )}

      {/* Upload Complete */}
      {state === 'complete' && (
        <div className="bg-emerald-900/30 backdrop-blur-sm rounded-xl p-6 border border-emerald-700/50">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-white font-semibold mb-1">Upload Complete</h3>
              <p className="text-gray-300 text-sm">Your data is now being processed.</p>
            </div>
          </div>
        </div>
      )}

      {/* Upload Failed */}
      {state === 'error' && (
        <div className="bg-red-900/30 backdrop-blur-sm rounded-xl p-6 border border-red-700/50">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-white font-semibold mb-1">Upload Failed</h3>
              <p className="text-gray-300 text-sm">
                Incorrect file type. Only .csv files are accepted.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}