"use client";
import React, { useEffect, useState } from "react";
import { listFactors, createFactor } from "@/lib/factors/api";
import DashboardHeader from '@/components/dashboard/Header';
import type { Factor, CreateFactorRequest } from "@/types/factors/factorstypes";

export default function FactorsPage() {
  const [items, setItems] = useState<Factor[]>([]);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("");
  const [unitIn, setUnitIn] = useState("");
  const [unitOut, setUnitOut] = useState("");
  const [value, setValue] = useState<number | "">("");
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await listFactors();
      setItems(res);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const now = new Date();
      const payload: CreateFactorRequest = {
        category,
        unit_in: unitIn,
        unit_out: unitOut,
        factor_value: Number(value),
        vendor: 'unknown',
        method: 'default',
        valid_from: now.toISOString(),
        valid_to: new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      };
      const f = await createFactor(payload);
      setItems((s) => [f, ...s]);
      setCategory("");
      setUnitIn("");
      setUnitOut("");
      setValue("");
    } catch (err) {
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
        <h1>Factors</h1>
      <form onSubmit={onCreate}>
        <input placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
        <input placeholder="Unit In" value={unitIn} onChange={(e) => setUnitIn(e.target.value)} />
        <input placeholder="Unit Out" value={unitOut} onChange={(e) => setUnitOut(e.target.value)} />
        <input placeholder="Value" value={String(value)} onChange={(e) => setValue(e.target.value === '' ? '' : Number(e.target.value))} />
        <button type="submit">Create Factor</button>
      </form>
      {error && <pre style={{ color: 'red' }}>{error}</pre>}
      {loading ? <div>Loading...</div> : <ul>{items.map((it) => <li key={it.id}>{it.category} — {it.factor_value}</li>)}</ul>}
    </main>
    </div>
  );
}
