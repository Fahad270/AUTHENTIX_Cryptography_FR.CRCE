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
  BookOpen,
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
  { to: '/guide', label: 'Guide', icon: BookOpen },
];

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="sidebar">
      <div className="p-5 border-b border-border">
        <div className="flex items-center gap-2">
          <ShieldAlert className="text-primary-600" size={24} />
          <span className="font-bold tracking-wider text-xl text-text">AUTHENTIX</span>
        </div>
        <p className="text-xs text-muted mt-1">Auth Attack & Security Lab</p>
      </div>

      <nav className="flex-1 overflow-y-auto scrollbar-thin p-3">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'sidebar-link-active' : 'sidebar-link-inactive'}`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {user && (
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
              <ShieldAlert className="text-primary-600" size={16} />
            </div>
            <div>
              <div className="text-sm font-medium text-text">{user.username}</div>
              <div className="text-xs text-muted">{user.role}</div>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 text-sm text-danger-600 hover:bg-red-50 rounded-lg px-3 py-2 transition-colors"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      )}
    </aside>
  );
}