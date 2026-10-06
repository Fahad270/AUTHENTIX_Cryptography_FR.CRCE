// pages/AuthLogs.jsx
import React, { useEffect, useState } from 'react';
import { ScrollText, Search } from 'lucide-react';
import api from '../services/api';

const EVENT_TYPES = [
  '',
  'LOGIN_SUCCESS',
  'LOGIN_FAILURE',
  'BRUTE_FORCE_ATTEMPT',
  'CREDENTIAL_STUFFING_ATTEMPT',
  'PASSWORD_SPRAY_ATTEMPT',
];

export default function AuthLogs() {
  const [events, setEvents] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(25);
  const [username, setUsername] = useState('');
  const [eventType, setEventType] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await api.get('/events', { params: { page, limit, username, eventType, success } });
    setEvents(res.data.items);
    setTotal(res.data.total);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  function applyFilters(e) {
    e.preventDefault();
    setPage(1);
    load();
  }

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <ScrollText className="text-lab-accent" size={22} />
        <h1 className="text-2xl font-bold">Authentication Logs</h1>
      </div>
      <p className="text-sm text-lab-muted mb-6">Every login attempt — normal or simulated — is recorded here.</p>

      <form onSubmit={applyFilters} className="flex flex-wrap items-end gap-3 mb-4">
        <div>
          <label className="text-xs text-lab-muted block mb-1">Username</label>
          <div className="relative">
            <Search size={13} className="absolute left-2 top-2.5 text-lab-muted" />
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="search..."
              className="bg-lab-panel2 border border-lab-border rounded pl-7 pr-3 py-1.5 text-sm w-40"
            />
          </div>
        </div>
        <div>
          <label className="text-xs text-lab-muted block mb-1">Event Type</label>
          <select
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            className="bg-lab-panel2 border border-lab-border rounded px-2 py-1.5 text-sm lab-mono"
          >
            {EVENT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t || 'ALL'}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-lab-muted block mb-1">Result</label>
          <select
            value={success}
            onChange={(e) => setSuccess(e.target.value)}
            className="bg-lab-panel2 border border-lab-border rounded px-2 py-1.5 text-sm lab-mono"
          >
            <option value="">ALL</option>
            <option value="true">SUCCESS</option>
            <option value="false">FAILED</option>
          </select>
        </div>
        <button type="submit" className="bg-lab-accent text-lab-bg text-sm font-semibold px-4 py-1.5 rounded">
          Apply
        </button>
      </form>

      <div className="lab-card overflow-x-auto scrollbar-thin">
        <table className="w-full text-xs lab-mono">
          <thead>
            <tr className="text-lab-muted border-b border-lab-border">
              <th className="text-left py-2.5 px-4">Timestamp</th>
              <th className="text-left py-2.5 px-4">Username</th>
              <th className="text-left py-2.5 px-4">Attack Type</th>
              <th className="text-left py-2.5 px-4">Event</th>
              <th className="text-left py-2.5 px-4">Result</th>
              <th className="text-left py-2.5 px-4">Source</th>
              <th className="text-left py-2.5 px-4">Attack ID</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={7} className="py-6 text-center text-lab-muted">
                  Loading...
                </td>
              </tr>
            )}
            {!loading && events.length === 0 && (
              <tr>
                <td colSpan={7} className="py-6 text-center text-lab-muted">
                  No matching events.
                </td>
              </tr>
            )}
            {events.map((ev) => (
              <tr key={ev._id} className="border-b border-lab-border/50">
                <td className="py-2 px-4 text-lab-muted">{new Date(ev.timestamp).toLocaleString()}</td>
                <td className="py-2 px-4">{ev.username}</td>
                <td className="py-2 px-4 text-lab-muted">
                  {ev.eventType.includes('ATTEMPT') ? ev.eventType.replace('_ATTEMPT', '') : '—'}
                </td>
                <td className="py-2 px-4">{ev.eventType}</td>
                <td className={`py-2 px-4 ${ev.success ? 'text-lab-success' : 'text-lab-danger'}`}>
                  {ev.success ? 'SUCCESS' : 'FAILED'}
                </td>
                <td className="py-2 px-4 text-lab-muted">{ev.source}</td>
                <td className="py-2 px-4 text-lab-muted">{ev.attackId ? String(ev.attackId).slice(-8) : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-3 text-xs text-lab-muted">
        <span>
          Page {page} of {totalPages} ({total} events)
        </span>
        <div className="flex gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1 border border-lab-border rounded disabled:opacity-40"
          >
            Prev
          </button>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="px-3 py-1 border border-lab-border rounded disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
