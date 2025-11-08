"use client";
import React, { useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardHeader from '@/components/dashboard/Header';
import { getReportPeriod } from "@/lib/reports/api";
import { Calendar, FileText, AlertCircle, RefreshCw, Clock, Download } from 'lucide-react';

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

  async function generateReport() {
    setLoading(true);
    setError(null);
    try {
      const data = await getReportPeriod(fromDate, toDate);
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
    
    const blob = new Blob([reportData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `emissions-report-${fromDate}-to-${toDate}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <ProtectedRoute>
      <div>
        <DashboardHeader />
        <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-emerald-900 flex items-center justify-center">
          <div className="container mx-auto px-6 py-8 w-full max-w-6xl">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                <Calendar className="w-8 h-8 text-emerald-400" />
                Reports
              </h1>
              <p className="text-gray-400">Generate and download emissions reports for specific date ranges</p>
            </div>

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
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-8 h-8 text-emerald-400" />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-4">Emissions CSV Report</h3>
                <p className="text-gray-400 mb-8">
                  Generate a detailed CSV report of emissions data for the selected date range.
                </p>

                {/* Action Button */}
                <button
                  onClick={generateReport}
                  disabled={loading}
                  className="flex items-center justify-center gap-3 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 text-white font-semibold rounded-lg transition-colors mx-auto mb-8"
                >
                  <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                  {loading ? 'Generating Report...' : 'Generate CSV Report'}
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
                        CSV report containing emissions data from {fromDate} to {toDate}
                      </p>
                      <button
                        onClick={downloadReport}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        Download CSV
                      </button>
                    </div>
                  </div>
                )}

                {/* Help Text */}
                {!reportData && !loading && !error && (
                  <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-4 text-left">
                    <h4 className="text-blue-300 font-medium mb-2">About CSV Reports</h4>
                    <p className="text-blue-400 text-sm">
                      Generate detailed emissions reports in CSV format containing: emission_id, event_id, 
                      occurred_at, category, unit, value_numeric, scope, and co2e_kg for the specified date range.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}