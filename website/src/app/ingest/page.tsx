"use client";
import React, { useState } from "react";
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardHeader from '@/components/dashboard/Header';
import { ingestEvents, uploadCsv } from "@/lib/ingest/api";
import type { IngestResponse } from "@/types/ingest/ingesttypes";
import { Upload, FileText, Send, AlertCircle, CheckCircle } from 'lucide-react';

export default function IngestPage() {
  const [jsonText, setJsonText] = useState(`{
  "events": [
    {
      "occurred_at": "2024-01-15T10:00:00Z",
      "category": "electricity",
      "unit": "kWh",
      "value_numeric": 100,
      "facility_id": 1,
      "source_id": "meter_001"
    }
  ]
}`);
  const [result, setResult] = useState<IngestResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submitJson(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const payload = JSON.parse(jsonText);
      const res = await ingestEvents(payload);
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null);
    setResult(null);
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      const res = await uploadCsv(file);
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <ProtectedRoute>
      <div>
        <DashboardHeader />
        <div className="min-h-screen bg-linear-to-br from-gray-900 via-emerald-950 to-gray-900 p-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-white">Ingest (placeholder)</h1>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
