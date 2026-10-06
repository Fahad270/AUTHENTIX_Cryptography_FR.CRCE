// components/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  ShieldAlert,
  LayoutDashboard,
  Crosshair,
  History,
  ScrollText,
  KeyRound,
  ShieldOff,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/', label: 'Overview', icon: ShieldAlert, end: true },
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/attack-lab', label: 'Attack Lab', icon: Crosshair },
  { to: '/attack-history', label: 'Attack History', icon: History },
  { to: '/logs', label: 'Authentication Logs', icon: ScrollText },
  { to: '/cryptography', label: 'Cryptography', icon: KeyRound },
  { to: '/security-controls', label: 'Security Controls', icon: ShieldOff },
];

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="w-64 shrink-0 h-screen sticky top-0 bg-lab-panel border-r border-lab-border flex flex-col">
      <div className="px-5 py-5 border-b border-lab-border">
        <div className="flex items-center gap-2">
          <ShieldAlert className="text-lab-accent" size={22} />
          <span className="font-bold tracking-wider text-lg">AUTHENTIX</span>
        </div>
        <p className="text-xs text-lab-muted mt-1">Auth Attack & Security Lab</p>
      </div>

      <nav className="flex-1 overflow-y-auto scrollbar-thin py-3">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-5 py-2.5 text-sm transition-colors border-l-2 ${
                isActive
                  ? 'border-lab-accent bg-lab-panel2 text-lab-accent'
                  : 'border-transparent text-lab-muted hover:text-lab-text hover:bg-lab-panel2'
              }`
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      {user && (
        <div className="px-5 py-4 border-t border-lab-border">
          <div className="text-sm font-medium">{user.username}</div>
          <div className="text-xs text-lab-muted mb-3">{user.role}</div>
          <button
            onClick={logout}
            className="flex items-center gap-2 text-xs text-lab-danger hover:underline"
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      )}
    </aside>
  );
}
