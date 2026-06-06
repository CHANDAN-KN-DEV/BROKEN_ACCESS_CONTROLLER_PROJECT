import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import {
  MdDashboard, MdPeople, MdMonitor, MdNotifications,
  MdDescription, MdBarChart, MdSettings, MdLogout,
  MdShield, MdChevronLeft, MdChevronRight, MdSecurity
} from 'react-icons/md';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: MdDashboard },
  { path: '/users', label: 'Users', icon: MdPeople },
  { path: '/monitoring', label: 'Monitoring', icon: MdMonitor },
  { path: '/alerts', label: 'Alerts', icon: MdNotifications },
  { path: '/audit-logs', label: 'Audit Logs', icon: MdDescription },
  { path: '/analytics', label: 'Analytics', icon: MdBarChart },
  { path: '/settings', label: 'Settings', icon: MdSettings },
];

const Sidebar = () => {
  const { user, logout } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside
      className={`relative flex flex-col z-20 transition-all duration-300 ease-in-out
        ${collapsed ? 'w-16' : 'w-60'}
        ${isDark ? 'bg-slate-900/95 border-r border-cyan-500/10' : 'bg-white/95 border-r border-slate-200'}
      `}
      style={{ backdropFilter: 'blur(12px)' }}
    >
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b ${isDark ? 'border-cyan-500/10' : 'border-slate-100'}`}>
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-cyber-neon">
          <MdSecurity className="text-white text-lg" />
        </div>
        {!collapsed && (
          <div>
            <h1 className={`text-sm font-bold tracking-wide ${isDark ? 'text-cyan-400' : 'text-slate-800'}`}>
              CyberDefense
            </h1>
            <p className={`text-[10px] font-mono ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              ACCESS CONTROL v2.0
            </p>
          </div>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative
              ${isActive
                ? isDark
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                  : 'bg-cyan-50 text-cyan-700 border border-cyan-200'
                : isDark
                  ? 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-cyan-400 rounded-r-full" />
                )}
                <Icon className={`text-xl flex-shrink-0 ${isActive ? 'text-cyan-400' : ''}`} />
                {!collapsed && <span>{label}</span>}
                {collapsed && (
                  <div className={`absolute left-14 px-2 py-1 rounded-md text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap
                    ${isDark ? 'bg-slate-800 text-slate-100 border border-slate-700' : 'bg-white text-slate-800 border border-slate-200 shadow-lg'}`}>
                    {label}
                  </div>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Card */}
      <div className={`p-3 border-t ${isDark ? 'border-cyan-500/10' : 'border-slate-100'}`}>
        {!collapsed && (
          <div className={`flex items-center gap-2 p-2 rounded-lg mb-2 ${isDark ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
            <img
              src={user?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.name}`}
              alt={user?.name}
              className="w-8 h-8 rounded-full border border-cyan-500/30"
            />
            <div className="min-w-0">
              <p className={`text-xs font-semibold truncate ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
                {user?.name}
              </p>
              <p className={`text-[10px] truncate ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
                {user?.role}
              </p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
            ${isDark ? 'text-slate-400 hover:text-red-400 hover:bg-red-500/10' : 'text-slate-500 hover:text-red-500 hover:bg-red-50'}`}
        >
          <MdLogout className="text-xl flex-shrink-0" />
          {!collapsed && 'Logout'}
        </button>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className={`absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center z-30 transition-colors shadow-md
          ${isDark ? 'bg-slate-800 border border-cyan-500/30 text-cyan-400 hover:bg-slate-700' : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'}`}
      >
        {collapsed ? <MdChevronRight className="text-sm" /> : <MdChevronLeft className="text-sm" />}
      </button>
    </aside>
  );
};

export default Sidebar;
