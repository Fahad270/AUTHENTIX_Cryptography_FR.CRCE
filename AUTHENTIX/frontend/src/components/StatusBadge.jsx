// components/StatusBadge.jsx
import React from 'react';

const STYLES = {
  IDLE: 'bg-lab-panel2 text-lab-muted border-lab-border',
  READY: 'bg-lab-panel2 text-lab-muted border-lab-border',
  RUNNING: 'bg-cyan-950 text-lab-accent border-cyan-800',
  COMPLETED: 'bg-emerald-950 text-lab-success border-emerald-800',
  STOPPED: 'bg-amber-950 text-lab-warn border-amber-800',
  COMPROMISED: 'bg-red-950 text-lab-danger border-red-800',
  FAILED: 'bg-red-950 text-lab-danger border-red-800',
  SUCCESS: 'bg-emerald-950 text-lab-success border-emerald-800',
};

export default function StatusBadge({ status }) {
  const cls = STYLES[status] || STYLES.IDLE;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border lab-mono ${cls}`}>
      {status === 'RUNNING' && <span className="w-1.5 h-1.5 rounded-full bg-lab-accent pulse-dot" />}
      {status}
    </span>
  );
}
