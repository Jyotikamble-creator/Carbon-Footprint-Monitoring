"use client";
import React, { useState } from 'react';
import DashboardHeader from '@/components/dashboard/Header';
import { previewFactors } from '@/lib/factors/api';
import { Logger as logger } from '@/lib/logger';

export default function FactorsPreviewPage() {
  const [category, setCategory] = useState('');
  const [occurredAt, setOccurredAt] = useState(() => new Date().toISOString().slice(0, 10));
  const [geography, setGeography] = useState('GLOBAL');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<null | { factor_value: number; version: number; geography: string }>(null);
  const [error, setError] = useState<string | null>(null);

  async function onPreview(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await previewFactors({ category, occurred_at: occurredAt, geography });
      setResult({ factor_value: res.factor_value, version: res.version, geography: res.geography });
    } catch (err) {
      logger.e('FACTORS_PREVIEW', err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <DashboardHeader />
      <main className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Factor Preview</h1>
        <form onSubmit={onPreview} className="space-y-4 max-w-lg">
          <div>
            <label className="block text-sm text-gray-200 mb-1">Category</label>
            <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. electricity-grid" className="w-full p-2 bg-gray-800 border rounded" />
          </div>

          <div>
            <label className="block text-sm text-gray-200 mb-1">Occurred At</label>
            <input type="date" value={occurredAt} onChange={(e) => setOccurredAt(e.target.value)} className="w-full p-2 bg-gray-800 border rounded" />
          </div>

          <div>
            <label className="block text-sm text-gray-200 mb-1">Geography</label>
            <input value={geography} onChange={(e) => setGeography(e.target.value)} className="w-full p-2 bg-gray-800 border rounded" />
          </div>

          <div>
            <button type="submit" className="px-4 py-2 bg-emerald-600 rounded" disabled={loading}>{loading ? 'Fetching…' : 'Preview Factor'}</button>
          </div>
        </form>

        <div className="mt-6">
          {error && <div className="text-red-400">{error}</div>}
          {result && (
            <div className="bg-gray-800 p-4 rounded border">
              <div>Factor value: <strong>{result.factor_value}</strong></div>
              <div>Version: <strong>{result.version}</strong></div>
              <div>Geography: <strong>{result.geography}</strong></div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
