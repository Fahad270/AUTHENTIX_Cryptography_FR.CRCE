// components/PhaseTag.jsx
// Small label distinguishing what's really working (Phase 1) from what's
// only planned (Phase 2) - used throughout the UI per the project's
// "clearly distinguish implemented vs future" requirement.
import React from 'react';

export function Phase1Tag() {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wide bg-emerald-950 text-lab-success border border-emerald-800">
      PHASE 1 — IMPLEMENTED
    </span>
  );
}

export function Phase2Tag() {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wide bg-lab-panel2 text-lab-muted border border-lab-border">
      PHASE 2 — NOT IMPLEMENTED
    </span>
  );
}
