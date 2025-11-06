"use client";
import React, { useEffect, useState } from "react";
import { listEmissions, recomputeEmissions } from "@/lib/emissions/api";
import { Logger as logger } from '@/lib/logger';
import DashboardHeader from '@/components/dashboard/Header';
import type { Emission } from "@/types/emission/emissiontypes";

export default function EmissionsPage() {
  const [items, setItems] = useState<Emission[]>([]);
  const [loading, setLoading] = useState(false);
  const [since, setSince] = useState("");
  const [until, setUntil] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [recalcResult, setRecalcResult] = useState<number | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await listEmissions();
      setItems(res);
    } catch (err) {
      logger.e('listEmissions', err);
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }

  async function onRecompute(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const resp = await recomputeEmissions({ since: since || undefined, until: until || undefined });
      setRecalcResult(resp.recalculated_events);
      await load();
    } catch (err) {
      logger.e('recomputeEmissions', err);
      setError(String(err));
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <DashboardHeader />
      <main>
        <h1>Emissions</h1>
      <form onSubmit={onRecompute}>
        <input placeholder="since (ISO)" value={since} onChange={(e) => setSince(e.target.value)} />
        <input placeholder="until (ISO)" value={until} onChange={(e) => setUntil(e.target.value)} />
        <button type="submit">Recompute</button>
      </form>
      {recalcResult !== null && <div>Recalculated events: {recalcResult}</div>}
      {error && <pre style={{ color: 'red' }}>{error}</pre>}
      {loading ? <div>Loading...</div> : <ul>{items.map((it) => <li key={it.id}>{it.category} — {it.co2e_kg} kg</li>)}</ul>}
      </main>
    </div>
  );
}
