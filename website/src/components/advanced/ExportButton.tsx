"use client";

import React, { useState } from 'react';
import { Download, FileText, FileSpreadsheet, File, Printer, Check } from 'lucide-react';
import {
  exportToCSV,
  exportToExcel,
  exportToPDF,
  exportToJSON,
  ExportColumn,
  EXPORT_FORMATS,
  ExportFormat
} from '@/lib/export';

interface ExportButtonProps {
  data: any[];
  columns: ExportColumn[];
  filename: string;
  className?: string;
  disabled?: boolean;
}

export function ExportButton({
  data,
  columns,
  filename,
  className = '',
  disabled = false
}: ExportButtonProps) {
  const [showFormats, setShowFormats] = useState(false);
  const [exporting, setExporting] = useState<ExportFormat | null>(null);

  const handleExport = async (format: ExportFormat) => {
    if (data.length === 0) {
      alert('No data to export');
      return;
    }

    setExporting(format);
    setShowFormats(false);

    try {
      const options = { filename, columns, data };

      switch (format) {
        case 'csv':
          exportToCSV(options);
          break;
        case 'excel':
          exportToExcel(options);
          break;
        case 'pdf':
          await exportToPDF(options);
          break;
        case 'json':
          exportToJSON(options);
          break;
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setExporting(null);
    }
  };

  const getFormatIcon = (format: ExportFormat) => {
    switch (format) {
      case 'csv':
        return <FileText className="w-4 h-4" />;
      case 'excel':
        return <FileSpreadsheet className="w-4 h-4" />;
      case 'pdf':
        return <Printer className="w-4 h-4" />;
      case 'json':
        return <File className="w-4 h-4" />;
    }
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setShowFormats(!showFormats)}
        disabled={disabled || data.length === 0}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
      >
        <Download className="w-4 h-4" />
        Export
        {data.length > 0 && (
          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
            {data.length}
          </span>
        )}
      </button>

      {showFormats && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
          <div className="p-2">
            <div className="text-xs text-gray-400 px-2 py-1">Export Format</div>
            {Object.entries(EXPORT_FORMATS).map(([format, config]) => (
              <button
                key={format}
                onClick={() => handleExport(format as ExportFormat)}
                disabled={exporting !== null}
                className="w-full flex items-center gap-3 px-3 py-2 text-left text-gray-300 hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
              >
                {getFormatIcon(format as ExportFormat)}
                <span className="flex-1">{config.label}</span>
                {exporting === format && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Quick export component for common use cases
interface QuickExportProps {
  data: any[];
  filename: string;
  format?: ExportFormat;
  columns?: ExportColumn[];
  className?: string;
  disabled?: boolean;
}

export function QuickExport({
  data,
  filename,
  format = 'csv',
  columns,
  className = '',
  disabled = false
}: QuickExportProps) {
  const [exporting, setExporting] = useState(false);

  // Auto-generate columns if not provided
  const defaultColumns: ExportColumn[] = columns || (
    data.length > 0
      ? Object.keys(data[0]).map(key => ({
          key,
          label: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')
        }))
      : []
  );

  const handleExport = async () => {
    if (data.length === 0) {
      alert('No data to export');
      return;
    }

    setExporting(true);

    try {
      const options = { filename, columns: defaultColumns, data };

      switch (format) {
        case 'csv':
          exportToCSV(options);
          break;
        case 'excel':
          exportToExcel(options);
          break;
        case 'pdf':
          await exportToPDF(options);
          break;
        case 'json':
          exportToJSON(options);
          break;
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={disabled || exporting || data.length === 0}
      className={`flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg transition-colors disabled:cursor-not-allowed ${className}`}
    >
      {exporting ? (
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : (
        <Download className="w-4 h-4" />
      )}
      Export {EXPORT_FORMATS[format].label}
      {data.length > 0 && (
        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
          {data.length}
        </span>
      )}
    </button>
  );
}