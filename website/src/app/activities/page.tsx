"use client";
import React, { useEffect, useState } from "react";
import DashboardHeader from '@/components/dashboard/Header';
import { getActivities, Activity } from '@/lib/activities/api';
import { Logger as logger } from '@/lib/logger';

export default function ActivitiesPage() {
  const [items, setItems] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await getActivities({ page: 1, page_size: 50 });
      setItems(res || []);
    } catch (err) {
      logger.e('ACTIVITIES', err);
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <div>
      <DashboardHeader />
      <main className="p-4">
        <h1 className="text-2xl font-semibold mb-4">Activities</h1>
        <div className="mb-4">
          <button className="btn" onClick={load} disabled={loading}>
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {error && <pre className="text-red-600">{error}</pre>}

        {loading ? (
          <div>Loading activities…</div>
        ) : (
          <ul className="space-y-2">
            {items.length === 0 && <li>No activities found.</li>}
            {items.map((it) => (
              <li key={it.id} className="p-2 border rounded">
                <div className="text-sm text-gray-600">{it.occurred_at} - facility {it.facility_id}</div>
                <div className="font-medium">{it.category} {it.value_numeric ? `: ${it.value_numeric} ${it.unit ?? ''}` : ''}</div>
                {it.description && <div className="text-sm text-gray-700">{it.description}</div>}
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
