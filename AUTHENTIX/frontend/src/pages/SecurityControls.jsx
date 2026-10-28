// pages/SecurityControls.jsx
// Phase 2 controls: rate limiting, account lockout, and a runtime toggle.
// Phase 2 is OFF by default (PHASE2_ENABLED=false) to preserve Phase 1 behavior.
// Toggle in this page (Security Admin only) flips it at runtime.
import React, { useState, useEffect } from 'react';
import { ShieldOff, Lock, ToggleRight, Info, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Phase2Tag } from '../components/PhaseTag';
import api from '../services/api';

const CONTROLS = [
  {
    category: 'Prevention',
    items: [
      { name: 'Rate Limiting', desc: 'Restrict repeated authentication requests within a time window (10 login/15min, 20 attacks/5min per IP).', phase2: true },
      { name: 'Account Lockout', desc: 'Temporarily disable accounts after 5 consecutive failed attempts (15 min auto-unlock).', phase2: true },
      { name: 'MFA', desc: 'Require an additional authentication factor beyond password.', phase2: false },
      { name: 'CAPTCHA / Adaptive Challenge', desc: 'Introduce an additional challenge when suspicious behavior is detected.', phase2: false },
    ],
  },
  {
    category: 'Detection',
    items: [
      { name: 'Attack Detection', desc: 'Analyze authentication patterns to automatically classify attack type.', phase2: false },
      { name: 'Risk Scoring', desc: 'Calculate a numeric risk score from authentication behavior.', phase2: false },
      { name: 'Suspicious IP Detection', desc: 'Flag requests originating from anomalous sources.', phase2: false },
    ],
  },
  {
    category: 'Response',
    items: [
      { name: 'Account Containment', desc: 'Automatically restrict a compromised account.', phase2: false },
      { name: 'Session Invalidation', desc: 'Revoke active sessions after a detected compromise.', phase2: false },
      { name: 'Credential Reset', desc: 'Force a password reset after suspicious activity.', phase2: false },
      { name: 'Incident Response Workflow', desc: 'Detect → Contain → Recover → Report.', phase2: false },
    ],
  },
];

export default function SecurityControls() {
  const [phase2Enabled, setPhase2Enabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [error, setError] = useState(null);

  const fetchPhase2Status = async () => {
    try {
      const res = await api.get('/config/phase2');
      setPhase2Enabled(res.data.data.enabled);
    } catch (err) {
      setError('Failed to load Phase 2 status');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (newEnabled) => {
    setToggling(true);
    setError(null);
    try {
      const res = await api.patch('/config/phase2', { enabled: newEnabled });
      setPhase2Enabled(res.data.data.enabled);
    } catch (err) {
      setError('Failed to toggle Phase 2. Ensure you are logged in as Security Admin.');
      console.error(err);
      // Revert UI on error
      setPhase2Enabled(!newEnabled);
    } finally {
      setToggling(false);
    }
  };

  useEffect(() => {
    fetchPhase2Status();
  }, []);

  return (
    <div className="max-w-4xl space-y-8">
      <div className="flex items-center gap-2">
        <ShieldOff className="text-primary-600" size={24} />
        <h1 className="text-2xl lg:text-3xl font-bold text-text">Security Controls</h1>
      </div>

      {/* Phase 2 Toggle */}
      <div className="card p-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
              <ShieldOff className="text-primary-600" size={20} />
            </div>
            <div>
              <h2 className="font-semibold text-text">Phase 2 Defenses</h2>
              <p className="text-sm text-muted">Runtime toggle — no restart required</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {phase2Enabled ? (
              <span className="badge badge-success flex items-center gap-1">
                <CheckCircle size={12} /> ACTIVE
              </span>
            ) : (
              <span className="badge badge-warning flex items-center gap-1">
                <AlertTriangle size={12} /> INACTIVE
              </span>
            )}
            <label className="toggle" title={phase2Enabled ? 'Disable Phase 2' : 'Enable Phase 2'}>
              <input
                type="checkbox"
                checked={phase2Enabled}
                onChange={(e) => handleToggle(e.target.checked)}
                disabled={toggling || loading}
              />
              <span />
              <div />
            </label>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2 text-sm text-red-700">
            <XCircle size={16} /> {error}
          </div>
        )}

        <div className="mt-4 p-4 rounded-lg bg-surface-50 border border-border">
          <h3 className="font-medium text-text mb-2 flex items-center gap-2">
            <Info size={16} className="text-primary-600" />
            What This Toggle Does
          </h3>
          <ul className="text-sm text-muted space-y-1">
            <li className="flex items-start gap-2"><CheckCircle size={14} className="text-success flex-shrink-0 mt-0.5" /> <strong>Rate Limiting:</strong> Login (10 req/15min), Attack endpoints (20 req/5min) per IP</li>
            <li className="flex items-start gap-2"><CheckCircle size={14} className="text-success flex-shrink-0 mt-0.5" /> <strong>Account Lockout:</strong> 5 failed attempts → locked for 15 min (auto-unlock)</li>
            <li className="flex items-start gap-2"><CheckCircle size={14} className="text-success flex-shrink-0 mt-0.5" /> <strong>Auth Engine:</strong> Checks lock status before bcrypt compare; logs ACCOUNT_LOCKED events</li>
            <li className="flex items-start gap-2"><CheckCircle size={14} className="text-success flex-shrink-0 mt-0.5" /> <strong>Successful Login:</strong> Resets failed attempts counter</li>
            <li className="flex items-start gap-2"><CheckCircle size={14} className="text-success flex-shrink-0 mt-0.5" /> <strong>Phase 1 Mode:</strong> All above skipped — attacks can succeed (for demo)</li>
          </ul>
        </div>
      </div>

      {/* Controls Grid */}
      <div className="space-y-8">
        {CONTROLS.map((group) => (
          <div key={group.category}>
            <h2 className="font-semibold text-text mb-4">{group.category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {group.items.map((item) => (
                <div key={item.name} className="card p-5">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex-1">
                      <h3 className="font-medium text-text">{item.name}</h3>
                      <p className="text-sm text-muted mt-1">{item.desc}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {item.phase2 ? (
                        phase2Enabled ? (
                          <span className="badge badge-success flex items-center gap-1">
                            <CheckCircle size={10} /> ENABLED
                          </span>
                        ) : (
                          <span className="badge badge-muted flex items-center gap-1">
                            <Lock size={10} /> PHASE 2
                          </span>
                        )
                      ) : (
                        <Phase2Tag />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Before/After */}
        <div className="card p-5">
          <h3 className="font-semibold text-text mb-4">Phase 2 Story: Before vs After Defense</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border border-red-200 bg-red-50">
              <div className="text-red-700 font-bold mb-2 flex items-center gap-2">
                <XCircle size={18} /> BEFORE DEFENSE (Phase 1 — Default)
              </div>
              <div className="text-sm text-red-600 font-mono">Attack → Compromise</div>
              <p className="text-xs text-red-500 mt-2">No rate limiting, no lockout. All three attacks can succeed.</p>
            </div>
            <div className="p-4 rounded-lg border border-green-200 bg-green-50">
              <div className="text-green-700 font-bold mb-2 flex items-center gap-2">
                <CheckCircle size={18} /> AFTER DEFENSE (Phase 2 — Enabled)
              </div>
              <div className="text-sm text-green-600 font-mono">Attack → Detection → Block → No Compromise</div>
              <p className="text-xs text-green-500 mt-2">Rate limited, accounts lock after 5 failures. Attacks stopped.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
