"use client";
import React, { useEffect, useState } from "react";
import { listFactors, createFactor } from "@/lib/factors/api";
import DashboardHeader from '@/components/dashboard/Header';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Calculator, Plus, Search, AlertCircle, Activity, TrendingUp, Eye, Edit2, Trash2 } from 'lucide-react';
import type { Factor, CreateFactorRequest } from "@/types/factors/factorstypes";

export default function FactorsPage() {
  const [items, setItems] = useState<Factor[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [category, setCategory] = useState("");
  const [unitIn, setUnitIn] = useState("");
  const [unitOut, setUnitOut] = useState("");
  const [value, setValue] = useState<number | "">("");
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredItems = items.filter(item =>
    item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.unit_in.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.unit_out.toLowerCase().includes(searchQuery.toLowerCase())
  );

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await listFactors();
      setItems(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!category || !unitIn || !unitOut || !value) {
      setError("Please fill in all required fields");
      return;
    }

    setCreating(true);
    setError(null);
    try {
      const now = new Date();
      const payload: CreateFactorRequest = {
        category,
        unit_in: unitIn,
        unit_out: unitOut,
        factor_value: Number(value),
        vendor: 'User Created',
        method: 'Manual Entry',
        valid_from: now.toISOString(),
        valid_to: new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      };
      const f = await createFactor(payload);
      setItems((s) => [f, ...s]);
      setCategory("");
      setUnitIn("");
      setUnitOut("");
      setValue("");
      setShowAddModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setCreating(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const getCategoryIcon = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes('electricity') || cat.includes('energy')) return <Activity className="w-4 h-4" />;
    if (cat.includes('transport') || cat.includes('fuel')) return <TrendingUp className="w-4 h-4" />;
    return <Calculator className="w-4 h-4" />;
  };

  return (
    <ProtectedRoute>
      <div>
        <DashboardHeader />
        <div className="min-h-screen bg-linear-to-br from-gray-900 via-emerald-950 to-gray-900">
          <main className="max-w-7xl mx-auto px-6 py-8">
            {/* Header Section */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                  <Calculator className="w-8 h-8 text-emerald-400" />
                  Emission Factors
                </h1>
                <p className="text-gray-400">Manage conversion factors for calculating emissions from activity data</p>
              </div>
              
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-gray-900 rounded-lg hover:bg-emerald-600 transition-colors font-semibold"
              >
                <Plus className="w-5 h-5" />
                Add Factor
              </button>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search factors by category or unit..."
                  className="w-full pl-10 pr-4 py-3 bg-gray-800/40 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mb-6 bg-red-900/50 border border-red-700 rounded-lg p-4 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                <div>
                  <p className="text-red-400 font-medium">Error</p>
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* Factors Table */}
            <div className="bg-gray-800/40 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700/50 bg-gray-800/50">
                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Input Unit
                    </th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Output Unit
                    </th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Factor Value
                    </th>
                    <th className="text-left py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Source
                    </th>
                    <th className="text-right py-4 px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center">
                        <div className="flex items-center justify-center gap-3 text-gray-400">
                          <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                          Loading factors...
                        </div>
                      </td>
                    </tr>
                  ) : filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-gray-400">
                        {searchQuery ? "No factors found matching your search." : "No emission factors available. Add one to get started."}
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map((item, index) => (
                      <tr
                        key={item.id}
                        className={`border-b border-gray-700/30 hover:bg-gray-800/30 transition-colors ${
                          index === filteredItems.length - 1 ? 'border-b-0' : ''
                        }`}
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-500/20 rounded-lg">
                              {getCategoryIcon(item.category)}
                            </div>
                            <div>
                              <div className="text-white font-medium">{item.category}</div>
                              <div className="text-gray-400 text-sm">ID: {item.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-gray-300">{item.unit_in}</td>
                        <td className="py-4 px-6 text-gray-300">{item.unit_out}</td>
                        <td className="py-4 px-6">
                          <span className="text-emerald-400 font-semibold">
                            {item.factor_value.toFixed(6)}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-gray-300 text-sm">{item.vendor || 'Unknown'}</div>
                          <div className="text-gray-500 text-xs">{item.method || 'Default'}</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => console.log('View factor details:', item.id)}
                              className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => console.log('Edit factor:', item.id)}
                              className="p-2 text-gray-400 hover:text-emerald-400 transition-colors"
                              title="Edit Factor"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => console.log('Delete factor:', item.id)}
                              className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                              title="Delete Factor"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Add Factor Modal */}
            {showAddModal && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                <div className="bg-gray-800 rounded-xl p-6 w-full max-w-lg border border-gray-700">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-white">Add Emission Factor</h2>
                    <button
                      onClick={() => {
                        setShowAddModal(false);
                        setError(null);
                      }}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={onCreate} className="space-y-4">
                    {/* Category */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Category *
                      </label>
                      <input
                        type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        placeholder="e.g., electricity, transport, fuel"
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Unit In */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Input Unit *
                        </label>
                        <input
                          type="text"
                          value={unitIn}
                          onChange={(e) => setUnitIn(e.target.value)}
                          placeholder="e.g., kWh, km, L"
                          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          required
                        />
                      </div>

                      {/* Unit Out */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Output Unit *
                        </label>
                        <input
                          type="text"
                          value={unitOut}
                          onChange={(e) => setUnitOut(e.target.value)}
                          placeholder="e.g., kg CO2e"
                          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          required
                        />
                      </div>
                    </div>

                    {/* Factor Value */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Factor Value *
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={value}
                        onChange={(e) => setValue(e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="e.g., 0.233"
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        required
                      />
                    </div>

                    {error && (
                      <div className="p-3 bg-red-900/50 border border-red-700 rounded-lg">
                        <p className="text-sm text-red-400">{error}</p>
                      </div>
                    )}

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddModal(false);
                          setError(null);
                        }}
                        className="flex-1 px-4 py-3 text-gray-300 border border-gray-600 rounded-lg hover:bg-gray-700/50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={creating}
                        className="flex-1 px-4 py-3 bg-emerald-500 text-gray-900 rounded-lg hover:bg-emerald-600 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {creating ? (
                          <>
                            <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                            Creating...
                          </>
                        ) : (
                          'Add Factor'
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
