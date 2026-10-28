// App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';

import Login from './pages/Login';
import Overview from './pages/Overview';
import Dashboard from './pages/Dashboard';
import AttackLab from './pages/AttackLab';
import AttackHistory from './pages/AttackHistory';
import AuthLogs from './pages/AuthLogs';
import Cryptography from './pages/Cryptography';
import SecurityControls from './pages/SecurityControls';
import Guide from './pages/Guide';

function Page({ children, adminOnly }) {
  return (
    <ProtectedRoute adminOnly={adminOnly}>
      <DashboardLayout>{children}</DashboardLayout>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Page><Overview /></Page>} />
      <Route path="/dashboard" element={<Page adminOnly><Dashboard /></Page>} />
      <Route path="/attack-lab" element={<Page adminOnly><AttackLab /></Page>} />
      <Route path="/attack-history" element={<Page adminOnly><AttackHistory /></Page>} />
      <Route path="/logs" element={<Page adminOnly><AuthLogs /></Page>} />
      <Route path="/cryptography" element={<Page><Cryptography /></Page>} />
      <Route path="/security-controls" element={<Page><SecurityControls /></Page>} />
      <Route path="/guide" element={<Page><Guide /></Page>} />
    </Routes>
  );
}
