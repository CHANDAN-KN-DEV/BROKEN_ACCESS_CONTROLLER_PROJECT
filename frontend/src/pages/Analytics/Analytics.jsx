import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts';
import monitoringData from '../../mockData/monitoringMock.json';

const COLORS = ['#f43f5e', '#f97316', '#eab308', '#22d3ee'];

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

const Analytics = () => {
  const { isDark } = useTheme();
  const { threatsOverTime, monthlyTraffic, threatTypes, userStats } = monitoringData.chartsData;

  const axisStyle = { fontSize: 11, fill: isDark ? '#64748b' : '#94a3b8' };
  const grid = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)';

  const kpis = [
    { label: 'Avg Response Time', value: '342ms', trend: '↓ 12%', good: true },
    { label: 'Threat Detection Rate', value: '98.7%', trend: '↑ 2.1%', good: true },
    { label: 'False Positive Rate', value: '1.3%', trend: '↓ 0.4%', good: true },
    { label: 'Mean Time to Resolve', value: '4.2h', trend: '↓ 0.8h', good: true },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className={`text-xl font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>Analytics</h2>
        <p className={`text-sm mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          System performance metrics and security trend analysis
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(({ label, value, trend, good }) => (
          <div key={label} className={`glass-panel rounded-xl p-4 ${isDark ? '' : 'bg-white/80'}`}>
            <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{label}</p>
            <p className={`text-2xl font-bold font-mono mt-1 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>{value}</p>
            <p className={`text-xs mt-1 font-medium ${good ? 'text-green-400' : 'text-red-400'}`}>{trend} this week</p>
          </div>
        ))}
      </div>

      {/* Monthly Traffic */}
      <div className={`glass-panel rounded-xl p-5 ${isDark ? '' : 'bg-white/80'}`}>
        <h3 className={`text-sm font-semibold mb-4 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
          Monthly Traffic Analysis
        </h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={monthlyTraffic} barSize={16}>
            <CartesianGrid strokeDasharray="3 3" stroke={grid} />
            <XAxis dataKey="month" tick={axisStyle} axisLine={false} tickLine={false} />
            <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip isDark={isDark} />} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="apiRequests" name="API Requests" fill="#22d3ee" radius={[4,4,0,0]} opacity={0.8} />
            <Bar dataKey="maliciousRequests" name="Malicious Requests" fill="#f43f5e" radius={[4,4,0,0]} opacity={0.8} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Threat Trend + Breakdown Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Threat Trend */}
        <div className={`glass-panel rounded-xl p-5 ${isDark ? '' : 'bg-white/80'}`}>
          <h3 className={`text-sm font-semibold mb-4 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
            Hourly Threat Trend
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={threatsOverTime}>
              <CartesianGrid strokeDasharray="3 3" stroke={grid} />
              <XAxis dataKey="time" tick={axisStyle} axisLine={false} tickLine={false} />
              <YAxis tick={axisStyle} axisLine={false} tickLine={false} width={20} />
              <Tooltip content={<CustomTooltip isDark={isDark} />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="critical" name="Critical" stroke="#f43f5e" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="high" name="High" stroke="#f97316" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="medium" name="Medium" stroke="#22d3ee" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Threat Type Distribution */}
        <div className={`glass-panel rounded-xl p-5 ${isDark ? '' : 'bg-white/80'}`}>
          <h3 className={`text-sm font-semibold mb-4 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
            Attack Vector Distribution
          </h3>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="50%" height={180}>
              <PieChart>
                <Pie data={threatTypes} cx="50%" cy="50%" outerRadius={75} dataKey="value" paddingAngle={3}>
                  {threatTypes.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip content={<CustomTooltip isDark={isDark} />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {threatTypes.map((t, i) => (
                <div key={t.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: COLORS[i] }} />
                    <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t.name}</span>
                  </div>
                  <span className={`text-xs font-bold font-mono ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {t.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* User Stats */}
      <div className={`glass-panel rounded-xl p-5 ${isDark ? '' : 'bg-white/80'}`}>
        <h3 className={`text-sm font-semibold mb-4 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
          User Role Distribution
        </h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={userStats} layout="vertical" barSize={18}>
            <CartesianGrid strokeDasharray="3 3" stroke={grid} horizontal={false} />
            <XAxis type="number" tick={axisStyle} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="name" tick={axisStyle} axisLine={false} tickLine={false} width={70} />
            <Tooltip content={<CustomTooltip isDark={isDark} />} />
            <Bar dataKey="count" name="Users" radius={[0,4,4,0]}>
              {userStats.map((_, i) => <Cell key={i} fill={['#06b6d4','#8b5cf6','#10b981','#f59e0b'][i]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Analytics;
