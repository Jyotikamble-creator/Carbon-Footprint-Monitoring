"use client";
import React, { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardHeader from '@/components/dashboard/Header';
import { fetchUsers, createUser } from '@/lib/tenants/api';
import { Logger as logger } from '@/lib/logger';
import type { TenantUser, CreateUserRequest } from '@/types/tenants/tenantstypes';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<TenantUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // create form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('viewer');

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchUsers();
      setUsers(res || []);
    } catch (err) {
      logger.e('TENANTS_USERS_FETCH', err);
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const payload: CreateUserRequest = { email, password, role };
      const u = await createUser(payload);
      setUsers((s) => [u, ...s]);
      setEmail(''); setPassword(''); setRole('viewer');
    } catch (err) {
      logger.e('TENANTS_USERS_CREATE', err);
      setError(String(err));
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <ProtectedRoute requiredRole="admin">
      <div>
        <DashboardHeader />
        <main className="p-6">
          <h1 className="text-2xl font-semibold mb-4">Tenant Users</h1>

          <section className="mb-6 max-w-xl">
            <h2 className="font-medium mb-2">Create User</h2>
            <form onSubmit={onCreate} className="space-y-3">
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email" className="w-full p-2 bg-gray-800 border rounded" />
              <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" type="password" className="w-full p-2 bg-gray-800 border rounded" />
              <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full p-2 bg-gray-800 border rounded">
                <option value="viewer">viewer</option>
                <option value="editor">editor</option>
                <option value="admin">admin</option>
              </select>
              <div>
                <button className="px-4 py-2 bg-emerald-600 rounded" type="submit">Create User</button>
              </div>
            </form>
            {error && <div className="text-red-400 mt-2">{error}</div>}
          </section>

          <section>
            <h2 className="font-medium mb-3">Users</h2>
            {loading ? (
              <div>Loading users…</div>
            ) : (
              <ul className="space-y-2">
                {users.length === 0 && <li>No users found.</li>}
                {users.map((u) => (
                  <li key={u.id} className="p-3 border rounded flex justify-between items-center">
                    <div>
                      <div className="font-medium">{u.email}</div>
                      <div className="text-sm text-gray-400">{u.role} — {u.is_active ? 'active' : 'inactive'}</div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </main>
      </div>
    </ProtectedRoute>
  );
}
