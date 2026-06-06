import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useSystem } from '../../contexts/SystemContext';
import {
  MdSearch, MdNotifications, MdLightMode, MdDarkMode,
  MdCircle, MdKeyboardArrowDown
} from 'react-icons/md';

const Navbar = () => {
  const { user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { alerts } = useSystem();
  const [showNotifs, setShowNotifs] = useState(false);

  const unreadAlerts = alerts?.filter(a => a.status === 'Active').slice(0, 5) || [];

  return (
    <header className={`flex-shrink-0 flex items-center justify-between px-6 h-14 z-10 relative
      ${isDark ? 'bg-slate-900/80 border-b border-cyan-500/10' : 'bg-white/80 border-b border-slate-200'}
    `} style={{ backdropFilter: 'blur(12px)' }}>

      {/* Search */}
      <div className={`relative flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm w-72
        ${isDark ? 'bg-slate-800/60 border border-slate-700/50 text-slate-400' : 'bg-slate-50 border border-slate-200 text-slate-500'}`}>
        <MdSearch className="text-lg flex-shrink-0" />
        <input
          type="text"
          placeholder="Search threats, users, logs..."
          className="bg-transparent outline-none w-full text-sm placeholder-current"
        />
        <span className={`text-xs px-1.5 py-0.5 rounded font-mono ${isDark ? 'bg-slate-700 text-slate-400' : 'bg-slate-200 text-slate-500'}`}>
          ⌘K
        </span>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-3">

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          id="theme-toggle"
          className={`p-2 rounded-lg transition-all ${isDark ? 'text-slate-400 hover:text-yellow-400 hover:bg-slate-800' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'}`}
        >
          {isDark ? <MdLightMode className="text-xl" /> : <MdDarkMode className="text-xl" />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            id="notifications-btn"
            onClick={() => setShowNotifs(!showNotifs)}
            className={`relative p-2 rounded-lg transition-all ${isDark ? 'text-slate-400 hover:text-cyan-400 hover:bg-slate-800' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'}`}
          >
            <MdNotifications className="text-xl" />
            {unreadAlerts.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            )}
          </button>

          {showNotifs && (
            <div className={`absolute right-0 top-full mt-2 w-80 rounded-xl overflow-hidden shadow-xl z-50 border
              ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
              <div className={`px-4 py-3 border-b ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
                <div className="flex items-center justify-between">
                  <h3 className={`text-sm font-semibold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
                    Active Alerts
                  </h3>
                  <span className="text-xs bg-red-500/10 text-red-400 px-2 py-0.5 rounded-full">
                    {unreadAlerts.length} active
                  </span>
                </div>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {unreadAlerts.length === 0 ? (
                  <p className={`text-center py-6 text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    No active alerts
                  </p>
                ) : (
                  unreadAlerts.map((alert) => (
                    <div key={alert.id} className={`px-4 py-3 border-b last:border-b-0 transition-colors
                      ${isDark ? 'border-slate-800 hover:bg-slate-800/50' : 'border-slate-50 hover:bg-slate-50'}`}>
                      <div className="flex items-start gap-3">
                        <MdCircle className={`text-xs mt-1 flex-shrink-0
                          ${alert.severity === 'Critical' ? 'text-red-500' :
                            alert.severity === 'High' ? 'text-orange-400' :
                            alert.severity === 'Medium' ? 'text-yellow-400' : 'text-blue-400'}`}
                        />
                        <div>
                          <p className={`text-sm font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                            {alert.type}
                          </p>
                          <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                            {alert.description?.slice(0, 60)}...
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Status Indicator */}
        <div className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs
          ${isDark ? 'bg-green-500/10 text-green-400' : 'bg-green-50 text-green-600'}`}>
          <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
          SYSTEM ONLINE
        </div>

        {/* User Avatar */}
        <div className="flex items-center gap-2 cursor-pointer">
          <img
            src={user?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.name}`}
            alt={user?.name}
            className="w-8 h-8 rounded-full border-2 border-cyan-500/30"
          />
          <div className="hidden md:block">
            <p className={`text-xs font-semibold leading-tight ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
              {user?.name}
            </p>
            <p className={`text-[10px] ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
              {user?.role}
            </p>
          </div>
          <MdKeyboardArrowDown className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
        </div>
      </div>

      {/* Click outside to close */}
      {showNotifs && (
        <div className="fixed inset-0 z-40" onClick={() => setShowNotifs(false)} />
      )}
    </header>
  );
};

export default Navbar;
