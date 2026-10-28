// components/PhaseTag.jsx
// Small label distinguishing what's really working (Phase 1) from what's
// only planned (Phase 2) - used throughout the UI per the project's
// "clearly distinguish implemented vs future" requirement.
import React from 'react';

export function Phase1Tag() {
  return (
    <span className="phase1-tag">
      PHASE 1 — IMPLEMENTED
    </span>
  );
}

export function Phase2Tag() {
  return (
    <span className="phase2-tag">
      PHASE 2 — NOT IMPLEMENTED
    </span>
  );
}
