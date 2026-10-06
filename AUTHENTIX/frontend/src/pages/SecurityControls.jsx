// pages/SecurityControls.jsx
// Every control on this page is explicitly Phase 2 - planned, not functional.
// Nothing here actually rate-limits, locks accounts, or blocks anything in
// Phase 1; that's intentional, see AUTHENTIX's README for why.
import React from 'react';
import { ShieldOff } from 'lucide-react';
import { Phase2Tag } from '../components/PhaseTag';

const CONTROLS = [
  {
    category: 'Prevention',
    items: [
      { name: 'Rate Limiting', desc: 'Restrict repeated authentication requests within a time window.' },
      { name: 'Account Lockout', desc: 'Temporarily disable accounts after excessive failed attempts.' },
      { name: 'MFA', desc: 'Require an additional authentication factor beyond password.' },
      { name: 'CAPTCHA / Adaptive Challenge', desc: 'Introduce an additional challenge when suspicious behavior is detected.' },
    ],
  },
  {
    category: 'Detection',
    items: [
      { name: 'Attack Detection', desc: 'Analyze authentication patterns to automatically classify attack type.' },
      { name: 'Risk Scoring', desc: 'Calculate a numeric risk score from authentication behavior.' },
      { name: 'Suspicious IP Detection', desc: 'Flag requests originating from anomalous sources.' },
    ],
  },
  {
    category: 'Response',
    items: [
      { name: 'Account Containment', desc: 'Automatically restrict a compromised account.' },
      { name: 'Session Invalidation', desc: 'Revoke active sessions after a detected compromise.' },
      { name: 'Credential Reset', desc: 'Force a password reset after suspicious activity.' },
      { name: 'Incident Response Workflow', desc: 'Detect → Contain → Recover → Report.' },
    ],
  },
];

export default function SecurityControls() {
  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-2 mb-1">
        <ShieldOff className="text-lab-muted" size={22} />
        <h1 className="text-2xl font-bold">Security Controls</h1>
      </div>
      <p className="text-sm text-lab-muted mb-2">
        None of the controls below are active in AUTHENTIX today. Phase 1 deliberately omits them so the three
        attack simulations can demonstrate what happens when these defenses are absent.
      </p>
      <div className="mb-8">
        <Phase2Tag />
      </div>

      {CONTROLS.map((group) => (
        <div key={group.category} className="mb-8">
          <h2 className="font-semibold mb-3">{group.category}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {group.items.map((item) => (
              <div key={item.name} className="lab-card p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm">{item.name}</span>
                  <Phase2Tag />
                </div>
                <p className="text-xs text-lab-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="lab-card p-5">
        <h3 className="font-semibold mb-3 text-sm">Phase 2 Story: Before vs After Defense</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs lab-mono">
          <div className="p-3 rounded border border-red-800 bg-red-950/30">
            <div className="text-lab-danger font-bold mb-1">BEFORE DEFENSE (Phase 1 — today)</div>
            <div>Attack → Compromise</div>
          </div>
          <div className="p-3 rounded border border-emerald-800 bg-emerald-950/30">
            <div className="text-lab-success font-bold mb-1">AFTER DEFENSE (Phase 2 — planned)</div>
            <div>Attack → Detection → Block → No Compromise</div>
          </div>
        </div>
      </div>
    </div>
  );
}
