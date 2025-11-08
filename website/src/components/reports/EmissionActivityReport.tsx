'use client';

import { useState } from 'react';
import DateRangeCalendar from '@/components/reports/DateRangeCalendar';
import ReportInstructions from '@/components/reports/ReportInstructions';
import { Download, FileText, Calendar, Sparkles, ArrowRight } from 'lucide-react';

export default function EmissionsActivityReport() {
  const [selectedRange, setSelectedRange] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: null,
    endDate: null,
  });

  const handleDownload = () => {
    if (selectedRange.startDate && selectedRange.endDate) {
      console.log('Downloading report for:', selectedRange);
      // Add download logic here
    } else {
      alert('Please select a date range first');
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-emerald-600/20 via-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-white/10">
        <div className="absolute inset-0 bg-linear-to-r from-emerald-500/10 via-blue-500/10 to-purple-500/10"></div>
        <div className="relative p-8 md:p-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-emerald-500/20 rounded-xl border border-emerald-400/30">
              <FileText className="w-8 h-8 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                Emissions Activity Report
              </h1>
              <div className="flex items-center gap-2 text-emerald-300">
                <Sparkles className="w-5 h-5" />
                <span className="text-lg">Generate detailed CSV reports</span>
              </div>
            </div>
          </div>
          <p className="text-gray-300 text-lg leading-relaxed max-w-2xl">
            Transform your emissions data into actionable insights. Select your date range and download comprehensive CSV reports for analysis and compliance.
          </p>
        </div>
      </div>

      {/* Date Range Selection Card */}
      <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-500/20 rounded-lg border border-blue-400/30">
              <Calendar className="w-6 h-6 text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Select Date Range</h2>
          </div>

          <div className="bg-linear-to-r from-slate-800/50 to-slate-700/50 rounded-xl p-6 border border-slate-600/30 mb-8">
            <DateRangeCalendar
              selectedRange={selectedRange}
              onRangeChange={setSelectedRange}
            />
          </div>

          {/* Enhanced Download Button */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="text-center sm:text-left">
              <p className="text-gray-300 mb-1">Ready to generate your report?</p>
              <p className="text-sm text-gray-400">
                {selectedRange.startDate && selectedRange.endDate
                  ? `Selected: ${selectedRange.startDate.toLocaleDateString()} - ${selectedRange.endDate.toLocaleDateString()}`
                  : 'Please select a date range above'
                }
              </p>
            </div>

            <button
              onClick={handleDownload}
              disabled={!selectedRange.startDate || !selectedRange.endDate}
              className="group relative px-8 py-4 bg-linear-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-emerald-500/25"
            >
              <div className="flex items-center gap-3">
                <Download className="w-5 h-5" />
                <span>Download CSV Report</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Instructions Card */}
      <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 shadow-2xl">
        <ReportInstructions />
      </div>
    </div>
  );
}