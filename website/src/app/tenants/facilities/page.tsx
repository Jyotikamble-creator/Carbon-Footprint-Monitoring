"use client";
import React, { useEffect, useState } from "react";
import { fetchFacilities, createFacility } from "@/lib/tenants/api";
import ProtectedRoute from '@/components/ProtectedRoute';
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
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-4xl font-bold text-white mb-8">Facilities</h1>
        <form onSubmit={onCreate} className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input 
              placeholder="Name" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <input 
              placeholder="Country" 
              value={country} 
              onChange={(e) => setCountry(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <input 
              placeholder="Grid region" 
              value={grid} 
              onChange={(e) => setGrid(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <button 
            type="submit"
            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
          >
            Create Facility
          </button>
        </form>
        {error && <pre className="text-red-400 mb-4 p-4 bg-red-900/20 rounded-lg">{error}</pre>}
        {loading ? (
          <div className="text-gray-400">Loading...</div>
        ) : (
          <ul className="space-y-2">
            {items.map((it) => (
              <li key={it.id} className="p-4 bg-gray-800/50 rounded-lg text-white">
                {it.name} — {it.country} — {it.grid_region}
              </li>
            ))}
          </ul>
        )}
      </div>
    </ProtectedRoute>
  );
}
