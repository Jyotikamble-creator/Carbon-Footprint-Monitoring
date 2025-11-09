'use client';

import { useState } from 'react';
import FileDropzone from '@/components/upload/FileDropzone';
import AlternativeStates from '@/components/upload/AlternativeStates';
import { uploadCsv } from '@/lib/ingest/api';
import type { IngestResponse } from '@/types/ingest/ingesttypes';
import { FileText } from 'lucide-react';

export default function UploadActivityContent() {
  const [uploadState, setUploadState] = useState<'idle' | 'ready' | 'uploading' | 'complete' | 'error'>('idle');
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState<IngestResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setUploadState('ready');
    setError(null);
  };

  const handleFileRemove = () => {
    setFile(null);
    setUploadState('idle');
    setUploadProgress(0);
    setUploadResult(null);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploadState('uploading');
    setUploadProgress(0);
    setError(null);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 20;
        });
      }, 200);

      // Actually upload the file to backend
      const result = await uploadCsv(file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadResult(result);
      setUploadState('complete');
      
    } catch (err) {
      console.error('Upload failed:', err);
      setError(err instanceof Error ? err.message : 'Upload failed. Please try again.');
      setUploadState('error');
      setUploadProgress(0);
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          Upload Activity Data
        </h1>
        <p className="text-gray-400">
          Upload your activity data via CSV to calculate emissions.
        </p>
      </div>

      {/* Show upload results */}
      {uploadState === 'complete' && uploadResult && (
        <div className="bg-emerald-900/50 border border-emerald-700 rounded-xl p-6 mb-6">
          <h3 className="text-emerald-400 font-semibold mb-3">Upload Successful!</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-gray-300">
              <span className="text-emerald-400 font-medium">{uploadResult.created_events}</span> events created
            </div>
            <div className="text-gray-300">
              <span className="text-yellow-400 font-medium">{uploadResult.skipped_duplicates}</span> duplicates skipped
            </div>
            <div className="text-gray-300">
              <span className="text-blue-400 font-medium">{uploadResult.created_emissions}</span> emissions calculated
            </div>
          </div>
        </div>
      )}

      {/* Show upload errors */}
      {uploadState === 'error' && error && (
        <div className="bg-red-900/50 border border-red-700 rounded-xl p-6 mb-6">
          <h3 className="text-red-400 font-semibold mb-2">Upload Failed</h3>
          <p className="text-gray-300 text-sm">{error}</p>
        </div>
      )}

      {/* Template Download Section */}
      <div className="bg-blue-900/30 border border-blue-700/50 rounded-xl p-6 mb-6">
        <h3 className="text-blue-300 font-semibold mb-3 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Need a Template?
        </h3>
        <p className="text-blue-400 text-sm mb-4">
          Download our CSV template to ensure your data is formatted correctly for upload.
        </p>
        <button
          onClick={() => {
            // Create a sample CSV template
            const csvContent = `facility_name,activity_type,category,value,unit,date
Headquarters,Electricity,Electricity,15000,kWh,2024-01-15
Branch Office,Natural Gas,Natural Gas,5000,therms,2024-01-15
Warehouse,Diesel,Diesel,2000,gallons,2024-01-15
Office,Air Travel,Air Travel,5000,miles,2024-01-15`;

            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'emissions_template.csv';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          <FileText className="w-4 h-4" />
          Download CSV Template
        </button>
      </div>

      {/* Main Upload Section */}
      {uploadState === 'idle' && (
        <>
          <FileDropzone onFileSelect={handleFileSelect} />
          <div className="text-center mt-4">
            <a href="#" className="text-sm text-gray-400 hover:text-gray-300 underline">
              Don&apos;t have a template? Download sample file.
            </a>
          </div>
        </>
      )}

      {/* Alternative States */}
      {uploadState !== 'idle' && (
        <AlternativeStates
          state={uploadState}
          file={file}
          progress={uploadProgress}
          onRemove={handleFileRemove}
          onUpload={handleUpload}
        />
      )}
    </div>
  );
}