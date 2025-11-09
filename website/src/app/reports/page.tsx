"use client";
import React, { useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { PageLayout } from '@/components/layout/PageLayout';
import { getReportPeriod } from "@/lib/reports/api";
import { Calendar, FileText, AlertCircle, RefreshCw, Clock, Download, FileSpreadsheet, File } from 'lucide-react';

export default function ReportsPage() {
  const [reportData, setReportData] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fromDate, setFromDate] = useState(() => {
    // Default to last 30 days
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date.toISOString().split('T')[0];
  });
  const [toDate, setToDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [format, setFormat] = useState<'csv' | 'pdf'>('csv');
  async function generateReport() {
    setLoading(true);
    setError(null);
    try {
      const data = await getReportPeriod(fromDate, toDate, format);
      setReportData(data);
    } catch (err: unknown) {
      console.error('Report generation error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate report';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  const downloadReport = () => {
    if (!reportData) return;

    const mimeType = format === 'pdf' ? 'application/pdf' : 'text/csv';
    const extension = format;
    const blob = new Blob([reportData], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `emissions-report-${fromDate}-to-${toDate}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <ProtectedRoute>
      <PageLayout
        title="Reports"
        description="Generate and download emissions reports in CSV or PDF format"
        icon={Calendar}
      >

            {/* Main Content Card */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50 w-full max-w-4xl mx-auto">
              {/* Date Range Selection */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">Select Date Range</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="fromDate" className="block text-sm font-medium text-gray-300 mb-2">
                      From Date
                    </label>
                    <input
                      type="date"
                      id="fromDate"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="toDate" className="block text-sm font-medium text-gray-300 mb-2">
                      To Date
                    </label>
                    <input
                      type="date"
                      id="toDate"
                      onChange={(e) => setToDate(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Format Selection */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-white mb-4">Report Format</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    onClick={() => setFormat('csv')}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      format === 'csv'
                        ? 'border-emerald-500 bg-emerald-500/10'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <FileSpreadsheet className="w-8 h-8 text-emerald-400" />
                      <div>
                        <h3 className="text-lg font-semibold text-white">CSV Format</h3>
                        <p className="text-gray-400 text-sm">Spreadsheet-compatible data export</p>
                      </div>
                    </div>
                  </div>
                  <div
                    onClick={() => setFormat('pdf')}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      format === 'pdf'
                        ? 'border-emerald-500 bg-emerald-500/10'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <File className="w-8 h-8 text-emerald-400" />
                      <div>
                        <h3 className="text-lg font-semibold text-white">PDF Format</h3>
                        <p className="text-gray-400 text-sm">Professional formatted report</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-8 h-8 text-emerald-400" />
                </div>

                <h3 className="text-2xl font-bold text-white mb-4">
                  {format === 'csv' ? 'CSV Emissions Report' : 'PDF Emissions Report'}
                </h3>
                <p className="text-gray-400 mb-8">
                  Generate a detailed {format.toUpperCase()} report of emissions data for the selected date range.
                </p>

                {/* Action Button */}
                <button
                  onClick={generateReport}
                  disabled={loading}
                  className="flex items-center justify-center gap-3 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 text-white font-semibold rounded-lg transition-colors mx-auto mb-8"
                >
                  <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                  {loading ? 'Generating Report...' : `Generate ${format.toUpperCase()} Report`}
                </button>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-4 flex items-center gap-3 mb-6">
                    <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                    <div className="text-left">
                      <p className="text-red-300 font-medium">Error</p>
                      <p className="text-red-400 text-sm">{error}</p>
                    </div>
                  </div>
                )}

                {/* Report Result */}
                {reportData && (
                  <div className="bg-emerald-900/30 border border-emerald-700/50 rounded-lg p-6">
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <Clock className="w-6 h-6 text-emerald-400" />
                      <h3 className="text-lg font-semibold text-emerald-300">Report Generated</h3>
                    </div>

                    <div className="text-sm font-mono text-white bg-gray-800/50 rounded-lg p-4 border border-gray-700 max-h-64 overflow-auto mb-4">
                      <pre>{reportData}</pre>
                    </div>

                    <div className="flex items-center justify-center gap-4">
                      <p className="text-emerald-400 text-sm">
                        {format.toUpperCase()} report containing emissions data from {fromDate} to {toDate}
                      </p>
                      <button
                        onClick={downloadReport}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        Download {format.toUpperCase()}
                      </button>
                    </div>
                  </div>
                )}

                {/* Help Text */}
                {!reportData && !loading && !error && (
                  <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-4 text-left">
                    <h4 className="text-blue-300 font-medium mb-2">About {format.toUpperCase()} Reports</h4>
                    <p className="text-blue-400 text-sm">
                      {format === 'csv'
                        ? "Generate detailed emissions reports in CSV format containing: emission_id, event_id, occurred_at, category, unit, value_numeric, scope, and co2e_kg for the specified date range."
                        : "Generate professional PDF reports with formatted tables, headers, and summary statistics for the specified date range."
                      }
                    </p>
                  </div>
                )}
              </div>
            </div>
      </PageLayout>
    </ProtectedRoute>
  );
}