"use client";
import React, { useEffect, useState } from "react";
import { fetchUsers, createUser } from "@/lib/tenants/api";
import ProtectedRoute from '@/components/ProtectedRoute';
import type { TenantUser } from "@/types/tenants/tenantstypes";

export default function TenantUsersPage() {
  const [items, setItems] = useState<TenantUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchUsers();
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
      await createUser({ email, password, role });
      // reload list
      await load();
      setEmail("");
      setPassword("");
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
        <h1 className="text-4xl font-bold text-white mb-8">Tenant Users</h1>
        <form onSubmit={onCreate} className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input 
              placeholder="Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <input 
              type="password"
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>
          <button 
            type="submit"
            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
          >
            Create User
          </button>
        </form>
        {error && <pre className="text-red-400 mb-4 p-4 bg-red-900/20 rounded-lg">{error}</pre>}
        {loading ? (
          <div className="text-gray-400">Loading...</div>
        ) : (
          <ul className="space-y-2">
            {items.map((it) => (
              <li key={it.id} className="p-4 bg-gray-800/50 rounded-lg text-white">
                {it.email} — {it.role} — {it.is_active ? 'active' : 'inactive'}
              </li>
            ))}
          </ul>
        )}
      </div>
    </ProtectedRoute>
  );
}
