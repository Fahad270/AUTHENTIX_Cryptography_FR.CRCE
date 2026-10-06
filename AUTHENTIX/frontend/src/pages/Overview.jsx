// pages/Overview.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Crosshair, LayoutDashboard, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Phase1Tag, Phase2Tag } from '../components/PhaseTag';

export default function Overview() {
  const { user, isAdmin } = useAuth();

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-3 mb-2">
        <ShieldAlert className="text-lab-accent" size={26} />
        <h1 className="text-2xl font-bold">Welcome to AUTHENTIX</h1>
      </div>
      <p className="text-lab-muted text-sm mb-8">
        Logged in as <span className="text-lab-text font-medium">{user?.username}</span> ({user?.role})
      </p>

      <div className="lab-card p-6 mb-6">
        <h2 className="font-semibold mb-2">What is AUTHENTIX?</h2>
        <p className="text-sm text-lab-muted leading-relaxed">
          AUTHENTIX is a controlled authentication security laboratory that demonstrates how different
          credential-based attacks affect an authentication system. The system implements three attack
          simulations — brute force, credential stuffing and password spraying — against mock accounts.
          Every attempt passes through the real authentication backend and is recorded in MongoDB, so the
          dashboard visualizes genuine effects, not hardcoded demo numbers. Password hashing and salting
          demonstrate the cryptographic protection layer. Prevention, detection, containment and
          incident-response mechanisms are planned for the next phase.
        </p>
      </div>

      {isAdmin ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Link to="/dashboard" className="lab-card p-4 hover:border-lab-accent transition-colors">
            <LayoutDashboard className="text-lab-accent mb-2" size={20} />
            <div className="font-semibold text-sm">Dashboard</div>
            <div className="text-xs text-lab-muted">Live auth + attack statistics</div>
          </Link>
          <Link to="/attack-lab" className="lab-card p-4 hover:border-lab-accent transition-colors">
            <Crosshair className="text-lab-accent mb-2" size={20} />
            <div className="font-semibold text-sm">Attack Lab</div>
            <div className="text-xs text-lab-muted">Run a controlled simulation</div>
          </Link>
          <Link to="/cryptography" className="lab-card p-4 hover:border-lab-accent transition-colors">
            <KeyRound className="text-lab-accent mb-2" size={20} />
            <div className="font-semibold text-sm">Cryptography</div>
            <div className="text-xs text-lab-muted">Hashing &amp; salting explained</div>
          </Link>
        </div>
      ) : (
        <div className="lab-card p-4 mb-6 text-sm text-lab-muted">
          You're logged in as a Normal User. The Attack Lab, Dashboard and Logs are restricted to the
          Security Admin role.
        </div>
      )}

      <div className="flex items-center gap-2">
        <Phase1Tag />
        <span className="text-xs text-lab-muted">Authentication, logging, dashboard, and all 3 attacks are real and working.</span>
      </div>
      <div className="flex items-center gap-2 mt-2">
        <Phase2Tag />
        <span className="text-xs text-lab-muted">Rate limiting, lockout, MFA, CAPTCHA and incident response are planned only.</span>
      </div>
    </div>
  );
}
