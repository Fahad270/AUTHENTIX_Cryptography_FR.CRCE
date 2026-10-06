// pages/AttackLab.jsx
// -----------------------------------------------------------------------------
// The heart of AUTHENTIX. Lets the Security Admin pick one of the three
// attack types, see an explanation + config panel specific to that type,
// start it, watch a live attempt stream (via polling), and stop it.
// -----------------------------------------------------------------------------
import React, { useState } from 'react';
import { Crosshair, Play, Square, Info } from 'lucide-react';
import api from '../services/api';
import usePolling from '../hooks/usePolling';
import StatusBadge from '../components/StatusBadge';

const ATTACK_INFO = {
  BRUTE_FORCE: {
    title: 'Brute Force',
    strategy: 'Many passwords',
    targetPattern: 'One account',
    description:
      'Repeatedly tries multiple candidate passwords against a single target account, one after another, until a match is found or the wordlist is exhausted.',
    configLabel: 'Target Account',
  },
  CREDENTIAL_STUFFING: {
    title: 'Credential Stuffing',
    strategy: 'Known username/password pairs',
    targetPattern: 'Many accounts',
    description:
      'Uses a fixed set of username:password pairs (as if leaked from elsewhere) and replays each pair once against AUTHENTIX. The attacker is not guessing — they already "know" the credential.',
    configLabel: 'Mock Credential Dataset',
  },
  PASSWORD_SPRAYING: {
    title: 'Password Spraying',
    strategy: 'Few common passwords',
    targetPattern: 'Many accounts',
    description:
      'Tries a small set of common passwords against every account, one password at a time across all targets, before moving to the next password. The opposite pattern of brute force.',
    configLabel: 'Target Users',
  },
};

const START_ENDPOINTS = {
  BRUTE_FORCE: '/attacks/bruteforce/start',
  CREDENTIAL_STUFFING: '/attacks/credential-stuffing/start',
  PASSWORD_SPRAYING: '/attacks/password-spraying/start',
};

export default function AttackLab() {
  const [selected, setSelected] = useState('BRUTE_FORCE');
  const [targetUsername, setTargetUsername] = useState('admin');
  const [attack, setAttack] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const info = ATTACK_INFO[selected];
  const isRunning = attack?.status === 'RUNNING';

  usePolling(
    async () => {
      if (!attack?._id) return;
      const res = await api.get(`/attacks/${attack._id}/status`);
      setAttack((prev) => ({ ...prev, ...res.data }));
    },
    800,
    isRunning
  );

  async function startAttack() {
    setError('');
    setBusy(true);
    try {
      const body = selected === 'BRUTE_FORCE' ? { targetUsername } : {};
      const res = await api.post(START_ENDPOINTS[selected], body);
      setAttack(res.data.attack);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to start attack.');
    } finally {
      setBusy(false);
    }
  }

  async function stopAttack() {
    if (!attack?._id) return;
    try {
      await api.post(`/attacks/${attack._id}/stop`);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to stop attack.');
    }
  }

  function resetForNewRun() {
    setAttack(null);
    setError('');
  }

  const attempts = attack?.credentialsTested || [];

  return (
    <div className="max-w-5xl">
      <div className="flex items-center gap-2 mb-1">
        <Crosshair className="text-lab-accent" size={22} />
        <h1 className="text-2xl font-bold">Attack Lab</h1>
      </div>
      <p className="text-sm text-lab-muted mb-6">
        Controlled simulations against AUTHENTIX's own mock laboratory accounts only. No external targets.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        {Object.entries(ATTACK_INFO).map(([key, val]) => (
          <button
            key={key}
            onClick={() => {
              if (!isRunning) {
                setSelected(key);
                resetForNewRun();
              }
            }}
            disabled={isRunning}
            className={`lab-card p-4 text-left transition-colors ${
              selected === key ? 'border-lab-accent' : 'hover:border-lab-border'
            } ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="font-semibold text-sm mb-1">{val.title}</div>
            <div className="text-xs text-lab-muted">
              {val.strategy} → {val.targetPattern}
            </div>
          </button>
        ))}
      </div>

      <div className="lab-card p-5 mb-6">
        <div className="flex items-start gap-2 mb-4">
          <Info size={16} className="text-lab-accent mt-0.5 shrink-0" />
          <p className="text-sm text-lab-muted">{info.description}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-xs text-lab-muted mb-1">ATTACK TYPE</div>
            <div className="font-semibold">{info.title}</div>
          </div>
          <div>
            <div className="text-xs text-lab-muted mb-1">{info.configLabel.toUpperCase()}</div>
            {selected === 'BRUTE_FORCE' ? (
              <select
                value={targetUsername}
                onChange={(e) => setTargetUsername(e.target.value)}
                disabled={isRunning}
                className="bg-lab-panel2 border border-lab-border rounded px-2 py-1 text-sm lab-mono"
              >
                {['admin', 'alice', 'bob', 'charlie', 'manager', 'employee1', 'employee2'].map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            ) : (
              <div className="font-semibold lab-mono text-sm">
                {selected === 'CREDENTIAL_STUFFING' ? 'Mock Credential Dataset (24 pairs)' : 'All Laboratory Users'}
              </div>
            )}
          </div>
        </div>

        {error && <p className="text-xs text-lab-danger mb-3">{error}</p>}

        <div className="flex items-center gap-3">
          {!isRunning ? (
            <button
              onClick={startAttack}
              disabled={busy}
              className="flex items-center gap-2 bg-lab-accent text-lab-bg font-semibold text-sm px-4 py-2 rounded hover:opacity-90 disabled:opacity-50"
            >
              <Play size={15} /> {busy ? 'Starting...' : 'Start Attack'}
            </button>
          ) : (
            <button
              onClick={stopAttack}
              className="flex items-center gap-2 bg-lab-danger text-lab-bg font-semibold text-sm px-4 py-2 rounded hover:opacity-90"
            >
              <Square size={15} /> Stop Attack
            </button>
          )}
          {attack && <StatusBadge status={attack.status} />}
        </div>
      </div>

      {attack && (
        <>
          <div className="grid grid-cols-4 gap-3 mb-4">
            <div className="lab-card p-3">
              <div className="text-xs text-lab-muted">Attempts</div>
              <div className="text-xl font-bold lab-mono">{attack.attemptCount ?? 0}</div>
            </div>
            <div className="lab-card p-3">
              <div className="text-xs text-lab-muted">Failed</div>
              <div className="text-xl font-bold lab-mono text-lab-danger">{attack.failedAttempts ?? 0}</div>
            </div>
            <div className="lab-card p-3">
              <div className="text-xs text-lab-muted">Successful</div>
              <div className="text-xl font-bold lab-mono text-lab-success">{attack.successfulAttempts ?? 0}</div>
            </div>
            <div className="lab-card p-3">
              <div className="text-xs text-lab-muted">Status</div>
              <div className="mt-1">
                <StatusBadge status={attack.status} />
              </div>
            </div>
          </div>

          <div className="lab-card p-4">
            <h3 className="text-sm font-semibold mb-3">Live Attack Events</h3>
            <div className="max-h-96 overflow-y-auto scrollbar-thin space-y-1.5">
              {attempts.length === 0 && <p className="text-xs text-lab-muted">Waiting for first attempt...</p>}
              {attempts
                .slice()
                .reverse()
                .map((a, i) => (
                  <div
                    key={i}
                    className={`flex items-center justify-between text-xs lab-mono px-3 py-2 rounded border ${
                      a.result === 'SUCCESS'
                        ? 'bg-emerald-950/40 border-emerald-800 text-lab-success'
                        : 'bg-lab-panel2 border-lab-border text-lab-muted'
                    }`}
                  >
                    <span>
                      Attempt #{attempts.length - i} — {a.username} → {a.passwordMasked}
                    </span>
                    <span className="font-bold">{a.result}</span>
                  </div>
                ))}
            </div>
          </div>
        </>
      )}

      <div className="lab-card p-4 mt-8">
        <h3 className="text-sm font-semibold mb-3">Three Authentication Attacks — Comparison</h3>
        <table className="w-full text-xs lab-mono">
          <thead>
            <tr className="text-lab-muted border-b border-lab-border">
              <th className="text-left py-2 pr-4">Attack</th>
              <th className="text-left py-2 pr-4">Main Strategy</th>
              <th className="text-left py-2 pr-4">Target Pattern</th>
            </tr>
          </thead>
          <tbody>
            {Object.values(ATTACK_INFO).map((v) => (
              <tr key={v.title} className="border-b border-lab-border/50">
                <td className="py-2 pr-4 font-semibold">{v.title}</td>
                <td className="py-2 pr-4 text-lab-muted">{v.strategy}</td>
                <td className="py-2 pr-4 text-lab-muted">{v.targetPattern}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
