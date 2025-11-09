"use client";
import React, { useState } from "react";
import { getHealth } from "@/lib/health/api";
import ProtectedRoute from '@/components/ProtectedRoute';

export default function HealthPage() {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchHealth() {
    setLoading(true);
    setError(null);
    try {
      const res = await getHealth();
      setData(res);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-4xl font-bold text-white mb-8">System Health</h1>
        <button
          onClick={fetchHealth}
          disabled={loading}
          className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 text-white rounded-lg transition-colors mb-4"
        >
          {loading ? "Loading..." : "Check Health"}
        </button>
        {error && <pre className="text-red-400 p-4 bg-red-900/20 rounded-lg mb-4">{error}</pre>}
        {data && <pre className="text-white p-4 bg-gray-800/50 rounded-lg overflow-auto">{JSON.stringify(data, null, 2)}</pre>}
      </div>
    </ProtectedRoute>
  );
}
