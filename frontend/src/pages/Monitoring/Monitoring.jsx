import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useSystem } from '../../contexts/SystemContext';
import {
  MdRadio, MdBlock, MdCheck, MdBolt, MdWifi,
  MdLaptop, MdStorage, MdSecurity, MdCircle
} from 'react-icons/md';
import monitoringData from '../../mockData/monitoringMock.json';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';

const CustomTooltip = ({ active, payload, label, isDark }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className={`p-3 rounded-lg border text-xs ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200 shadow-lg'}`}>
      <p className={`font-medium mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>{p.name}: <span className="font-bold">{p.value}</span></p>
      ))}
    </div>
  );
};

const statusStyle = (code) => {
  if (code >= 200 && code < 300) return 'bg-green-500/15 text-green-400';
  if (code >= 400 && code < 500) return 'bg-red-500/15 text-red-400';
  return 'bg-yellow-500/15 text-yellow-400';
};

const methodStyle = (m) => ({
  GET: 'bg-blue-500/15 text-blue-400',
  POST: 'bg-green-500/15 text-green-400',
  PUT: 'bg-yellow-500/15 text-yellow-400',
  DELETE: 'bg-red-500/15 text-red-400',
  PATCH: 'bg-purple-500/15 text-purple-400',
}[m] || 'bg-slate-500/15 text-slate-400');

const Monitoring = () => {
  const { isDark } = useTheme();
  const { monitoring } = useSystem();
  const [activeTab, setActiveTab] = useState('sessions');

  const { apiRequests, failedLogins, activeSessions } = monitoringData;
  const { threatsOverTime } = monitoringData.chartsData;

  const axisStyle = { fontSize: 11, fill: isDark ? '#64748b' : '#94a3b8' };

  const tabs = [
    { key: 'sessions', label: 'Active Sessions', icon: MdWifi },
    { key: 'api', label: 'API Requests', icon: MdStorage },
    { key: 'failed', label: 'Failed Logins', icon: MdBlock },
  ];

  const metricCards = [
    { label: 'Active Sessions', value: activeSessions.length, icon: MdLaptop, color: 'green' },
    { label: 'API Requests/hr', value: '8,247', icon: MdStorage, color: 'cyan' },
    { label: 'Failed Logins', value: failedLogins.length, icon: MdBlock, color: 'red' },
    { label: 'Threat Events', value: '14', icon: MdSecurity, color: 'yellow' },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h2 className={`text-xl font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>System Monitoring</h2>
        <p className={`text-sm mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          Real-time activity, session tracking, and API surveillance
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className={`glass-panel rounded-xl p-4 ${isDark ? '' : 'bg-white/80'}`}>
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center
                ${color === 'cyan' ? 'bg-cyan-500/10 text-cyan-400' :
                  color === 'green' ? 'bg-green-500/10 text-green-400' :
                  color === 'red' ? 'bg-red-500/10 text-red-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                <Icon className="text-lg" />
              </div>
              <div>
                <p className={`text-lg font-bold font-mono ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>{value}</p>
                <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Threat Timeline Chart */}
      <div className={`glass-panel rounded-xl p-5 ${isDark ? '' : 'bg-white/80'}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-sm font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
            Threat Events Timeline (Today)
          </h3>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className={`text-xs font-mono ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>LIVE</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={threatsOverTime}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)'} />
            <XAxis dataKey="time" tick={axisStyle} axisLine={false} tickLine={false} />
            <YAxis tick={axisStyle} axisLine={false} tickLine={false} width={20} />
            <Tooltip content={<CustomTooltip isDark={isDark} />} />
            <Line type="monotone" dataKey="critical" name="Critical" stroke="#f43f5e" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="high" name="High" stroke="#f97316" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="medium" name="Medium" stroke="#22d3ee" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Tabs */}
      <div className={`glass-panel rounded-xl overflow-hidden ${isDark ? '' : 'bg-white/80'}`}>
        <div className={`flex border-b ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px
                ${activeTab === key
                  ? isDark ? 'text-cyan-400 border-cyan-400' : 'text-cyan-600 border-cyan-500'
                  : isDark ? 'text-slate-500 border-transparent hover:text-slate-300' : 'text-slate-400 border-transparent hover:text-slate-600'}`}
            >
              <Icon className="text-base" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        <div className="p-4 overflow-x-auto">
          {/* Active Sessions */}
          {activeTab === 'sessions' && (
            <table className="w-full text-xs">
              <thead>
                <tr className={`${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  {['Session ID', 'User', 'Role', 'IP Address', 'Device', 'Duration'].map(h => (
                    <th key={h} className="text-left pb-2 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {activeSessions.map(s => (
                  <tr key={s.id} className={`border-t ${isDark ? 'border-slate-800/50 hover:bg-slate-800/30' : 'border-slate-50 hover:bg-slate-50'}`}>
                    <td className={`py-2.5 font-mono ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{s.id}</td>
                    <td className={`py-2.5 font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{s.user}</td>
                    <td className="py-2.5">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium bg-cyan-500/10 text-cyan-400`}>{s.role}</span>
                    </td>
                    <td className={`py-2.5 font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{s.ip}</td>
                    <td className={`py-2.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{s.device}</td>
                    <td className={`py-2.5 ${isDark ? 'text-green-400' : 'text-green-600'}`}>{s.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* API Requests */}
          {activeTab === 'api' && (
            <table className="w-full text-xs">
              <thead>
                <tr className={`${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  {['ID', 'Endpoint', 'Method', 'Status', 'Response Time', 'Timestamp', 'Source IP'].map(h => (
                    <th key={h} className="text-left pb-2 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {apiRequests.map(r => (
                  <tr key={r.id} className={`border-t ${isDark ? 'border-slate-800/50 hover:bg-slate-800/30' : 'border-slate-50 hover:bg-slate-50'}`}>
                    <td className={`py-2.5 font-mono ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{r.id}</td>
                    <td className={`py-2.5 font-mono max-w-[200px] truncate ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{r.endpoint}</td>
                    <td className="py-2.5">
                      <span className={`px-2 py-0.5 rounded font-mono font-bold ${methodStyle(r.method)}`}>{r.method}</span>
                    </td>
                    <td className="py-2.5">
                      <span className={`px-2 py-0.5 rounded font-mono font-bold ${statusStyle(r.status)}`}>{r.status}</span>
                    </td>
                    <td className={`py-2.5 font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{r.responseTime}</td>
                    <td className={`py-2.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{r.timestamp}</td>
                    <td className={`py-2.5 font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{r.ip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Failed Logins */}
          {activeTab === 'failed' && (
            <table className="w-full text-xs">
              <thead>
                <tr className={`${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  {['ID', 'Username', 'IP Address', 'Location', 'Reason', 'Timestamp'].map(h => (
                    <th key={h} className="text-left pb-2 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {failedLogins.map(f => (
                  <tr key={f.id} className={`border-t ${isDark ? 'border-slate-800/50 hover:bg-slate-800/30' : 'border-slate-50 hover:bg-slate-50'}`}>
                    <td className={`py-2.5 font-mono ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{f.id}</td>
                    <td className={`py-2.5 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{f.username}</td>
                    <td className={`py-2.5 font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{f.ip}</td>
                    <td className={`py-2.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{f.location}</td>
                    <td className={`py-2.5 text-red-400`}>{f.reason}</td>
                    <td className={`py-2.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{f.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Monitoring;
