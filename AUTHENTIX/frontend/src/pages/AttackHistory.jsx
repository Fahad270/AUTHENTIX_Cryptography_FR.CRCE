// pages/AttackHistory.jsx
import React, { useEffect, useState } from 'react';
import { History, X } from 'lucide-react';
import api from '../services/api';
import StatusBadge from '../components/StatusBadge';

export default function AttackHistory() {
  const [attacks, setAttacks] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await api.get('/attacks', { params: { limit: 50 } });
    setAttacks(res.data.items);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <History className="text-lab-accent" size={22} />
        <h1 className="text-2xl font-bold">Attack History</h1>
      </div>
      <p className="text-sm text-lab-muted mb-6">Every simulation ever run, pulled live from MongoDB.</p>

      <div className="lab-card overflow-x-auto scrollbar-thin">
        <table className="w-full text-xs lab-mono">
          <thead>
            <tr className="text-lab-muted border-b border-lab-border">
              <th className="text-left py-2.5 px-4">Attack ID</th>
              <th className="text-left py-2.5 px-4">Type</th>
              <th className="text-left py-2.5 px-4">Target</th>
              <th className="text-left py-2.5 px-4">Attempts</th>
              <th className="text-left py-2.5 px-4">Success</th>
              <th className="text-left py-2.5 px-4">Status</th>
              <th className="text-left py-2.5 px-4">Start Time</th>
              <th className="text-left py-2.5 px-4">End Time</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={8} className="py-6 text-center text-lab-muted">
                  Loading...
                </td>
              </tr>
            )}
            {!loading && attacks.length === 0 && (
              <tr>
                <td colSpan={8} className="py-6 text-center text-lab-muted">
                  No attacks run yet. Visit Attack Lab to start one.
                </td>
              </tr>
            )}
            {attacks.map((a) => (
              <tr
                key={a._id}
                onClick={() => setSelected(a)}
                className="border-b border-lab-border/50 hover:bg-lab-panel2 cursor-pointer"
              >
                <td className="py-2 px-4 text-lab-muted">{a._id.slice(-8)}</td>
                <td className="py-2 px-4">{a.attackType.replace('_', ' ')}</td>
                <td className="py-2 px-4">{a.targetUsername || `${a.targetUsers.length} users`}</td>
                <td className="py-2 px-4">{a.attemptCount}</td>
                <td className="py-2 px-4">{a.successfulAttempts}</td>
                <td className="py-2 px-4">
                  <StatusBadge status={a.status} />
                </td>
                <td className="py-2 px-4 text-lab-muted">{new Date(a.startTime).toLocaleString()}</td>
                <td className="py-2 px-4 text-lab-muted">{a.endTime ? new Date(a.endTime).toLocaleString() : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setSelected(null)}>
          <div className="lab-card p-6 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">Attack Details</h3>
              <button onClick={() => setSelected(null)} className="text-lab-muted hover:text-lab-text">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-2 text-sm lab-mono">
              <Row label="Type" value={selected.attackType.replace('_', ' ')} />
              <Row label="Target" value={selected.targetUsername || `Mock dataset (${selected.targetUsers.length} users)`} />
              <Row label="Attempts" value={selected.attemptCount} />
              <Row label="Successful" value={selected.successfulAttempts} />
              <Row label="Failed" value={selected.failedAttempts} />
              <Row label="Status" value={<StatusBadge status={selected.status} />} />
              <Row label="Start Time" value={new Date(selected.startTime).toLocaleString()} />
              <Row label="End Time" value={selected.endTime ? new Date(selected.endTime).toLocaleString() : '—'} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-lab-border/50 pb-2">
      <span className="text-lab-muted text-xs">{label}</span>
      <span>{value}</span>
    </div>
  );
}
