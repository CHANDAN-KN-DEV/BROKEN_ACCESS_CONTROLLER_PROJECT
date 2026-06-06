import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar/Sidebar';
import Navbar from '../components/Navbar/Navbar';
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';
import Dashboard from '../pages/Dashboard/Dashboard';
import UserManagement from '../pages/UserManagement/UserManagement';
import Monitoring from '../pages/Monitoring/Monitoring';
import Alerts from '../pages/Alerts/Alerts';
import AuditLogs from '../pages/AuditLogs/AuditLogs';
import Analytics from '../pages/Analytics/Analytics';
import Settings from '../pages/Settings/Settings';

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950 text-cyan-400">
        <div className="relative flex items-center justify-center w-16 h-16">
          <div className="absolute border-4 border-cyan-400/20 rounded-full w-full h-full"></div>
          <div className="absolute border-4 border-t-cyan-400 border-r-transparent border-b-transparent border-l-transparent rounded-full w-full h-full animate-spin"></div>
          <span className="text-xs font-mono tracking-widest text-cyan-400 animate-pulse">SEC</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

const DashboardLayout = () => {
  return (
    <div className="relative flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 light:bg-slate-50 light:text-slate-900 transition-colors duration-200">
      {/* 3D Cyber grid background effect */}
      <div className="cyber-grid"></div>

      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden z-10 relative">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto w-full space-y-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/monitoring" element={<Monitoring />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/audit-logs" element={<AuditLogs />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
