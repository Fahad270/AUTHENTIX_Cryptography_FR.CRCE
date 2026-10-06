// pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await login(username, password);
      navigate('/');
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-lab-bg px-4">
      <div className="w-full max-w-sm lab-card p-8">
        <div className="flex flex-col items-center mb-6">
          <ShieldAlert className="text-lab-accent mb-2" size={32} />
          <h1 className="text-xl font-bold tracking-wider">AUTHENTIX</h1>
          <p className="text-xs text-lab-muted mt-1 text-center">
            Interactive Authentication Attack &amp; Security Simulation Laboratory
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-lab-muted">Username</label>
            <input
              className="w-full mt-1 bg-lab-panel2 border border-lab-border rounded px-3 py-2 text-sm focus:outline-none focus:border-lab-accent"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              autoFocus
            />
          </div>
          <div>
            <label className="text-xs text-lab-muted">Password</label>
            <input
              type="password"
              className="w-full mt-1 bg-lab-panel2 border border-lab-border rounded px-3 py-2 text-sm focus:outline-none focus:border-lab-accent"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-xs text-lab-danger">{error}</p>}

          <button
            type="submit"
            disabled={busy}
            className="w-full flex items-center justify-center gap-2 bg-lab-accent text-lab-bg font-semibold text-sm py-2 rounded hover:opacity-90 disabled:opacity-50"
          >
            <Lock size={15} /> {busy ? 'Authenticating...' : 'Login'}
          </button>
        </form>

        <p className="text-[11px] text-lab-muted mt-5 text-center">
          Laboratory account: <span className="lab-mono text-lab-text">admin / Admin@123</span>
          <br />
          (seeded via <span className="lab-mono">npm run seed</span>)
        </p>
      </div>
    </div>
  );
}
