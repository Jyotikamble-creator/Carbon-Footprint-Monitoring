"use client";
import React, { useEffect, useState } from "react";
import { fetchFacilities, createFacility } from "@/lib/tenants/api";
import DashboardHeader from '@/components/dashboard/Header';
import type { Facility } from "@/types/tenants/tenantstypes";

export default function FacilitiesPage() {
  const [items, setItems] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [grid, setGrid] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchFacilities();
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
      const f = await createFacility({ name, country, grid_region: grid });
      setItems((s) => [f, ...s]);
      setName("");
      setCountry("");
      setGrid("");
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
        <h1>Facilities</h1>
      <form onSubmit={onCreate}>
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)} />
        <input placeholder="Grid region" value={grid} onChange={(e) => setGrid(e.target.value)} />
        <button type="submit">Create</button>
      </form>
      {error && <pre style={{ color: "red" }}>{error}</pre>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <ul>
          {items.map((it) => (
            <li key={it.id}>{it.name} — {it.country} — {it.grid_region}</li>
          ))}
        </ul>
      )}
    </main>
    </div>
  );
}
