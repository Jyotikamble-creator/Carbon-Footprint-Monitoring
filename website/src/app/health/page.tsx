"use client";
import React, { useState } from "react";
import { getHealth } from "@/lib/health/api";
import DashboardHeader from '@/components/dashboard/Header';

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
    <div>
      <DashboardHeader />
      <main>
        <h1>Health</h1>
      <button onClick={fetchHealth} disabled={loading}>
        {loading ? "Loading..." : "Check Health"}
      </button>
      {error && <pre style={{ color: "red" }}>{error}</pre>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
      </main>
    </div>
  );
}
