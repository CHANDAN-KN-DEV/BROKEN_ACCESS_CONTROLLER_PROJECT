import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useSystem } from '../../contexts/SystemContext';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
  MdPeople, MdPersonAdd, MdApi, MdWarning,
  MdArrowUpward, MdArrowDownward, MdCircle, MdShield
} from 'react-icons/md';
import monitoringData from '../../mockData/monitoringMock.json';

const COLORS = ['#f43f5e', '#f97316', '#eab308', '#22d3ee'];

const StatCard = ({ title, value, change, positive, icon: Icon, color, isDark }) => (
  <div className={`glass-panel rounded-xl p-5 relative overflow-hidden group
    transition-all duration-300 hover:-translate-y-1
    ${isDark ? '' : 'bg-white/80'}`}>
    <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${color === 'cyan' ? 'shadow-cyber-neon' : color === 'green' ? 'shadow-cyber-green' : color === 'red' ? 'shadow-cyber-red' : 'shadow-cyber-yellow'}`} style={{ pointerEvents: 'none' }} />
    <div className="flex items-start justify-between">
      <div>
        <p className={`text-xs font-medium uppercase tracking-wider mb-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{title}</p>
        <p className={`text-2xl font-bold font-mono ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>{value}</p>
      </div>
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center
        ${color === 'cyan' ? 'bg-cyan-500/10 text-cyan-400' :
          color === 'green' ? 'bg-green-500/10 text-green-400' :
          color === 'red' ? 'bg-red-500/10 text-red-400' :
          'bg-yellow-500/10 text-yellow-400'}`}>
        <Icon className="text-xl" />
      </div>
    </div>
    <div className="flex items-center gap-1 mt-3">
      {positive ? (
        <MdArrowUpward className="text-xs text-green-400" />
      ) : (
        <MdArrowDownward className="text-xs text-red-400" />
      )}
      <span className={`text-xs font-medium ${positive ? 'text-green-400' : 'text-red-400'}`}>{change}</span>
      <span className={`text-xs ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>vs last hour</span>
    </div>
  </div>
);

const severityBadge = (sev) => {
  const map = {
    Critical: 'bg-red-500/15 text-red-400 border border-red-500/30',
    High: 'bg-orange-500/15 text-orange-400 border border-orange-500/30',
    Medium: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30',
    Low: 'bg-blue-500/15 text-blue-400 border border-blue-500/30',
    Info: 'bg-slate-500/15 text-slate-400 border border-slate-500/30',
  };
  return map[sev] || map.Info;
};

const statusBadge = (status) => {
  const map = {
    Active: 'bg-red-500/15 text-red-400',
    Investigating: 'bg-orange-500/15 text-orange-400',
    Resolved: 'bg-green-500/15 text-green-400',
  };
  return map[status] || 'bg-slate-500/15 text-slate-400';
};

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

const Dashboard = () => {
  const { isDark } = useTheme();
  const { users, alerts } = useSystem();

  const { threatsOverTime, userStats, threatTypes } = monitoringData.chartsData;

  const activeAlerts = alerts.filter(a => a.status === 'Active').length;
  const activeUsers = users.filter(u => u.status === 'Active').length;

  const stats = [
    { title: 'Total Users', value: users.length, change: '+12%', positive: true, icon: MdPeople, color: 'cyan' },
    { title: 'Active Users', value: activeUsers, change: '+3%', positive: true, icon: MdPersonAdd, color: 'green' },
    { title: 'API Requests', value: '8,247', change: '+18%', positive: true, icon: MdApi, color: 'yellow' },
    { title: 'Security Alerts', value: activeAlerts, change: '+2 new', positive: false, icon: MdWarning, color: 'red' },
  ];

  const axisStyle = { fontSize: 11, fill: isDark ? '#64748b' : '#94a3b8' };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-xl font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
            Security Dashboard
          </h2>
          <p className={`text-sm mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            Real-time threat overview &amp; system status
          </p>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono
          ${isDark ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-green-50 text-green-600 border border-green-200'}`}>
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          LIVE MONITORING
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => (
          <StatCard key={s.title} {...s} isDark={isDark} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Threat Timeline */}
        <div className={`glass-panel rounded-xl p-5 lg:col-span-2 ${isDark ? '' : 'bg-white/80'}`}>
          <h3 className={`text-sm font-semibold mb-4 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
            Threat Overview (Today)
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={threatsOverTime}>
              <defs>
                <linearGradient id="critGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="highGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="medGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" tick={axisStyle} axisLine={false} tickLine={false} />
              <YAxis tick={axisStyle} axisLine={false} tickLine={false} width={20} />
              <Tooltip content={<CustomTooltip isDark={isDark} />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Area type="monotone" dataKey="critical" name="Critical" stroke="#f43f5e" fill="url(#critGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="high" name="High" stroke="#f97316" fill="url(#highGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="medium" name="Medium" stroke="#22d3ee" fill="url(#medGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Threat Type Pie */}
        <div className={`glass-panel rounded-xl p-5 ${isDark ? '' : 'bg-white/80'}`}>
          <h3 className={`text-sm font-semibold mb-4 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
            Threat Breakdown
          </h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={threatTypes} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={3}>
                {threatTypes.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip isDark={isDark} />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 space-y-1">
            {threatTypes.map((t, i) => (
              <div key={t.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ background: COLORS[i] }} />
                  <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>{t.name}</span>
                </span>
                <span className={`font-mono font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{t.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User Stats + Recent Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* User Statistics Bar Chart */}
        <div className={`glass-panel rounded-xl p-5 ${isDark ? '' : 'bg-white/80'}`}>
          <h3 className={`text-sm font-semibold mb-4 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
            User Distribution
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={userStats} barSize={24}>
              <XAxis dataKey="name" tick={axisStyle} axisLine={false} tickLine={false} />
              <YAxis tick={axisStyle} axisLine={false} tickLine={false} width={20} />
              <Tooltip content={<CustomTooltip isDark={isDark} />} />
              <Bar dataKey="count" name="Users" radius={[4,4,0,0]}>
                {userStats.map((_, i) => (
                  <Cell key={i} fill={['#06b6d4','#8b5cf6','#10b981','#f59e0b'][i]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Alerts Table */}
        <div className={`glass-panel rounded-xl p-5 lg:col-span-2 ${isDark ? '' : 'bg-white/80'}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-sm font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
              Recent Activities
            </h3>
            <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{alerts.length} total alerts</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className={`${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  <th className="text-left pb-2 font-medium">ID</th>
                  <th className="text-left pb-2 font-medium">Type</th>
                  <th className="text-left pb-2 font-medium hidden sm:table-cell">Source IP</th>
                  <th className="text-left pb-2 font-medium">Severity</th>
                  <th className="text-left pb-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="space-y-1">
                {alerts.slice(0, 5).map((alert, i) => (
                  <tr key={alert.id} className={`border-t transition-colors
                    ${isDark ? 'border-slate-800/50 hover:bg-slate-800/30' : 'border-slate-100 hover:bg-slate-50'}`}>
                    <td className={`py-2.5 font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{alert.id}</td>
                    <td className={`py-2.5 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                      <div className="flex items-center gap-2">
                        <MdShield className={`flex-shrink-0 ${alert.severity === 'Critical' ? 'text-red-400' : alert.severity === 'High' ? 'text-orange-400' : 'text-yellow-400'}`} />
                        <span className="truncate max-w-[140px]">{alert.type}</span>
                      </div>
                    </td>
                    <td className={`py-2.5 font-mono hidden sm:table-cell ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{alert.sourceIp}</td>
                    <td className="py-2.5">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${severityBadge(alert.severity)}`}>
                        {alert.severity}
                      </span>
                    </td>
                    <td className="py-2.5">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge(alert.status)}`}>
                        {alert.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
