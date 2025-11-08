'use client';

import { CheckCircle, Calendar, Download, Clock } from 'lucide-react';

export default function ReportInstructions() {
  const instructions = [
    {
      number: 1,
      text: 'Use the calendar to select your desired start and end date for the report.',
      icon: Calendar,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
      borderColor: 'border-blue-400/30'
    },
    {
      number: 2,
      text: 'Click the "Download CSV" button to start generating your report file.',
      icon: Download,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/20',
      borderColor: 'border-emerald-400/30'
    },
    {
      number: 3,
      text: 'The file will download automatically when ready. For large date ranges, this may take a few moments.',
      icon: Clock,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
      borderColor: 'border-purple-400/30'
    },
  ];

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-amber-500/20 rounded-lg border border-amber-400/30">
          <CheckCircle className="w-6 h-6 text-amber-400" />
        </div>
        <h2 className="text-2xl font-bold text-white">How to Download Your Report</h2>
      </div>

      <div className="grid gap-6">
        {instructions.map((instruction) => {
          const Icon = instruction.icon;
          return (
            <div key={instruction.number} className="group">
              <div className="flex items-start gap-6 p-6 bg-linear-to-r from-slate-800/30 to-slate-700/30 rounded-xl border border-slate-600/20 hover:border-slate-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-slate-900/20">
                <div className={`p-3 ${instruction.bgColor} rounded-xl border ${instruction.borderColor} group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-6 h-6 ${instruction.color}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {instruction.number}
                      </span>
                    </div>
                    <div className="h-px bg-linear-to-r from-transparent via-slate-500 to-transparent flex-1"></div>
                  </div>
                  <p className="text-gray-300 leading-relaxed text-lg">
                    {instruction.text}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Additional Info Card */}
      <div className="mt-8 p-6 bg-linear-to-r from-indigo-900/20 to-purple-900/20 rounded-xl border border-indigo-500/20">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-indigo-500/20 rounded-lg border border-indigo-400/30">
            <CheckCircle className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Report Contents</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Your CSV report will include detailed emissions data with columns for emission ID, event details,
              activity categories, quantities, and calculated CO₂ equivalent values. Perfect for analysis,
              compliance reporting, and sustainability tracking.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}