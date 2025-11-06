"use client";
import React, { useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardHeader from '@/components/dashboard/Header';
import { getReportPeriod } from "@/lib/reports/api";
import { Calendar, FileText, AlertCircle, RefreshCw, Clock } from 'lucide-react';

export default function ReportPeriodPage() {
  const [period, setPeriod] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchPeriod() {
    setLoading(true);
    setError(null);
    try {
      // Use a default date range for the report - last 30 days
      const to = new Date().toISOString().split('T')[0];
      const from = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const p = await getReportPeriod(from, to);
      setPeriod(p);
    } catch (err) {
      console.error('Report period error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch report period');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ProtectedRoute requiredRole="viewer">
      <div>
        <DashboardHeader />
        <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-emerald-900">
          <div className="container mx-auto px-6 py-8">
            <h1 className="text-white">Report Period (placeholder)</h1>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
