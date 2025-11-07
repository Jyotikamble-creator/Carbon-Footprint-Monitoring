"use client";
import React, { useEffect, useState } from "react";
import { fetchUsers, createUser } from "@/lib/tenants/api";
import DashboardHeader from '@/components/dashboard/Header';
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
    <div>
      <DashboardHeader />
      <main>
        <h1>Tenant Users</h1>
      <form onSubmit={onCreate}>
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="admin">admin</option>
          <option value="user">user</option>
        </select>
        <button type="submit">Create User</button>
      </form>
      {error && <pre style={{ color: "red" }}>{error}</pre>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <ul>
          {items.map((it) => (
            <li key={it.id}>{it.email} — {it.role} — {it.is_active ? 'active' : 'inactive'}</li>
          ))}
        </ul>
      )}
    </main>
    </div>
  );
}
