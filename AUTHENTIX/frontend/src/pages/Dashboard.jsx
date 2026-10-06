// pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import { Activity, XCircle, CheckCircle2, Crosshair, ShieldX } from 'lucide-react';
import api from '../services/api';
import usePolling from '../hooks/usePolling';

const COLORS = ['#22d3ee', '#f87171', '#fbbf24'];

function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <div className="lab-card p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-lab-muted">{label}</span>
        <Icon size={16} className={accent} />
      </div>
      <div className="text-2xl font-bold lab-mono">{value}</div>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [eventsOverTime, setEventsOverTime] = useState([]);
  const [recentEvents, setRecentEvents] = useState([]);

  async function load() {
    const [statsRes, recentRes] = await Promise.all([
      api.get('/dashboard/stats'),
      api.get('/dashboard/recent-events'),
    ]);
    setStats(statsRes.data.stats);
    setEventsOverTime(statsRes.data.eventsOverTime.map((r) => ({ time: r._id, success: r.success, failure: r.failure })));
    setRecentEvents(recentRes.data.events);
  }

  usePolling(load, 5000, true);

  if (!stats) {
    return <div className="text-lab-muted text-sm">Loading dashboard from MongoDB...</div>;
  }

  const attackTypeData = Object.entries(stats.attackTypeStats).map(([type, v]) => ({
    name: type.replace('_', ' '),
    executions: v.executions,
    compromises: v.compromises,
  }));

  const authSplit = [
    { name: 'Success', value: stats.successfulLogins },
    { name: 'Failure', value: stats.failedLogins },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Security Dashboard</h1>
      <p className="text-sm text-lab-muted mb-6">Live data from MongoDB — refreshes automatically every 5s.</p>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <StatCard icon={Activity} label="TOTAL AUTH EVENTS" value={stats.totalAuthEvents} accent="text-lab-accent" />
        <StatCard icon={XCircle} label="FAILED LOGINS" value={stats.failedLogins} accent="text-lab-danger" />
        <StatCard icon={CheckCircle2} label="SUCCESSFUL LOGINS" value={stats.successfulLogins} accent="text-lab-success" />
        <StatCard icon={Crosshair} label="ATTACKS EXECUTED" value={stats.attacksExecuted} accent="text-lab-warn" />
        <StatCard icon={ShieldX} label="COMPROMISED ACCOUNTS" value={stats.compromisedAccounts} accent="text-lab-danger" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="lab-card p-4">
          <h3 className="text-sm font-semibold mb-3">Auth Success vs Failure</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={authSplit} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75}>
                {authSplit.map((entry, i) => (
                  <Cell key={entry.name} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: '#121821', border: '1px solid #232c3a' }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="lab-card p-4">
          <h3 className="text-sm font-semibold mb-3">Attack Types (Executions vs Compromises)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={attackTypeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#232c3a" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#8b98ab' }} />
              <YAxis tick={{ fontSize: 10, fill: '#8b98ab' }} allowDecimals={false} />
              <Tooltip contentStyle={{ background: '#121821', border: '1px solid #232c3a' }} />
              <Legend />
              <Bar dataKey="executions" fill="#22d3ee" />
              <Bar dataKey="compromises" fill="#f87171" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="lab-card p-4">
          <h3 className="text-sm font-semibold mb-3">Auth Events Over Time</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={eventsOverTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="#232c3a" />
              <XAxis dataKey="time" tick={{ fontSize: 8, fill: '#8b98ab' }} />
              <YAxis tick={{ fontSize: 10, fill: '#8b98ab' }} allowDecimals={false} />
              <Tooltip contentStyle={{ background: '#121821', border: '1px solid #232c3a' }} />
              <Line type="monotone" dataKey="success" stroke="#34d399" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="failure" stroke="#f87171" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="lab-card p-4">
        <h3 className="text-sm font-semibold mb-3">Recent Authentication Events</h3>
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-xs lab-mono">
            <thead>
              <tr className="text-lab-muted border-b border-lab-border">
                <th className="text-left py-2 pr-4">Time</th>
                <th className="text-left py-2 pr-4">Username</th>
                <th className="text-left py-2 pr-4">Event</th>
                <th className="text-left py-2 pr-4">Result</th>
                <th className="text-left py-2 pr-4">Source</th>
              </tr>
            </thead>
            <tbody>
              {recentEvents.map((ev) => (
                <tr key={ev._id} className="border-b border-lab-border/50">
                  <td className="py-1.5 pr-4 text-lab-muted">{new Date(ev.timestamp).toLocaleTimeString()}</td>
                  <td className="py-1.5 pr-4">{ev.username}</td>
                  <td className="py-1.5 pr-4">{ev.eventType}</td>
                  <td className={`py-1.5 pr-4 ${ev.success ? 'text-lab-success' : 'text-lab-danger'}`}>
                    {ev.success ? 'SUCCESS' : 'FAILED'}
                  </td>
                  <td className="py-1.5 pr-4 text-lab-muted">{ev.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
