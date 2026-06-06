import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useSystem } from '../../contexts/SystemContext';
import {
  MdWarning, MdCheck, MdSearch, MdFilterList,
  MdCircle, MdShield, MdBlock, MdInfo
} from 'react-icons/md';

const severityOrder = { Critical: 0, High: 1, Medium: 2, Low: 3 };

const severityBadge = (sev) => ({
  Critical: 'bg-red-500/15 text-red-400 border border-red-500/30',
  High: 'bg-orange-500/15 text-orange-400 border border-orange-500/30',
  Medium: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30',
  Low: 'bg-blue-500/15 text-blue-400 border border-blue-500/30',
}[sev] || 'bg-slate-500/15 text-slate-400');

const statusBadge = (status) => ({
  Active: 'bg-red-500/15 text-red-400 border border-red-500/20',
  Investigating: 'bg-orange-500/15 text-orange-400 border border-orange-500/20',
  Resolved: 'bg-green-500/15 text-green-400 border border-green-500/20',
}[status] || '');

const sevIcon = (sev) => {
  if (sev === 'Critical') return <MdShield className="text-red-400" />;
  if (sev === 'High') return <MdWarning className="text-orange-400" />;
  if (sev === 'Medium') return <MdInfo className="text-yellow-400" />;
  return <MdCircle className="text-blue-400" />;
};

const Alerts = () => {
  const { isDark } = useTheme();
  const { alerts, resolveAlert, acknowledgeAlert } = useSystem();
  const [search, setSearch] = useState('');
  const [filterSev, setFilterSev] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [expanded, setExpanded] = useState(null);

  const filtered = alerts
    .filter(a =>
      (filterSev === 'All' || a.severity === filterSev) &&
      (filterStatus === 'All' || a.status === filterStatus) &&
      (a.type.toLowerCase().includes(search.toLowerCase()) ||
       a.sourceIp.includes(search) ||
       a.userAffected.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => (severityOrder[a.severity] ?? 99) - (severityOrder[b.severity] ?? 99));

  const counts = {
    Critical: alerts.filter(a => a.severity === 'Critical').length,
    Active: alerts.filter(a => a.status === 'Active').length,
    Resolved: alerts.filter(a => a.status === 'Resolved').length,
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h2 className={`text-xl font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>Alert Center</h2>
        <p className={`text-sm mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          Security incidents and threat notifications
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Critical', count: counts.Critical, color: 'red' },
          { label: 'Active', count: counts.Active, color: 'orange' },
          { label: 'Resolved', count: counts.Resolved, color: 'green' },
        ].map(({ label, count, color }) => (
          <div key={label} className={`glass-panel rounded-xl p-4 text-center ${isDark ? '' : 'bg-white/80'}`}>
            <p className={`text-2xl font-bold font-mono
              ${color === 'red' ? 'text-red-400' : color === 'orange' ? 'text-orange-400' : 'text-green-400'}`}>
              {count}
            </p>
            <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className={`glass-panel rounded-xl p-4 flex flex-col sm:flex-row gap-3 ${isDark ? '' : 'bg-white/80'}`}>
        <div className={`relative flex items-center gap-2 flex-1 rounded-lg px-3 py-2 border
          ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
          <MdSearch className={`text-lg flex-shrink-0 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
          <input
            type="text"
            placeholder="Search alerts..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className={`bg-transparent outline-none text-sm flex-1 ${isDark ? 'text-slate-100 placeholder-slate-600' : 'text-slate-800 placeholder-slate-400'}`}
          />
        </div>
        {[
          { val: filterSev, setter: setFilterSev, opts: ['All', 'Critical', 'High', 'Medium', 'Low'], label: 'Severity' },
          { val: filterStatus, setter: setFilterStatus, opts: ['All', 'Active', 'Investigating', 'Resolved'], label: 'Status' },
        ].map(({ val, setter, opts, label }) => (
          <div key={label} className={`flex items-center gap-2 rounded-lg px-3 py-2 border
            ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
            <MdFilterList className={`text-lg flex-shrink-0 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
            <select value={val} onChange={e => setter(e.target.value)}
              className={`bg-transparent outline-none text-sm appearance-none ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
              {opts.map(o => <option key={o} value={o} className="bg-slate-900">{o === 'All' ? `All ${label}` : o}</option>)}
            </select>
          </div>
        ))}
      </div>

      {/* Alerts List */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className={`glass-panel rounded-xl p-12 text-center ${isDark ? '' : 'bg-white/80'}`}>
            <MdCheck className="text-4xl text-green-400 mx-auto mb-3" />
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>No alerts match your filters.</p>
          </div>
        ) : (
          filtered.map(alert => (
            <div key={alert.id}
              className={`glass-panel rounded-xl overflow-hidden transition-all duration-200 cursor-pointer
                ${isDark ? 'hover:border-cyan-500/20' : 'bg-white/80 hover:border-cyan-200'}
                ${alert.severity === 'Critical' ? 'border-l-4 border-l-red-500' :
                  alert.severity === 'High' ? 'border-l-4 border-l-orange-400' :
                  alert.severity === 'Medium' ? 'border-l-4 border-l-yellow-400' : ''}`}
              onClick={() => setExpanded(expanded === alert.id ? null : alert.id)}>
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="flex-shrink-0 mt-0.5">{sevIcon(alert.severity)}</div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`font-mono text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{alert.id}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${severityBadge(alert.severity)}`}>
                          {alert.severity}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge(alert.status)}`}>
                          {alert.status}
                        </span>
                      </div>
                      <p className={`font-semibold text-sm mt-1 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
                        {alert.type}
                      </p>
                      <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                        {alert.timestamp} · Source: {alert.sourceIp}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {alert.status === 'Active' && (
                      <>
                        <button
                          onClick={e => { e.stopPropagation(); acknowledgeAlert(alert.id); }}
                          className="px-3 py-1 rounded-lg bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 text-xs font-medium hover:bg-yellow-500/20 transition-colors"
                        >
                          Investigate
                        </button>
                        <button
                          onClick={e => { e.stopPropagation(); resolveAlert(alert.id); }}
                          className="px-3 py-1 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20 text-xs font-medium hover:bg-green-500/20 transition-colors"
                        >
                          Resolve
                        </button>
                      </>
                    )}
                    {alert.status === 'Investigating' && (
                      <button
                        onClick={e => { e.stopPropagation(); resolveAlert(alert.id); }}
                        className="px-3 py-1 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20 text-xs font-medium hover:bg-green-500/20 transition-colors"
                      >
                        Mark Resolved
                      </button>
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {expanded === alert.id && (
                  <div className={`mt-4 pt-4 border-t space-y-3 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                    <p className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      {alert.description}
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>Affected User</span>
                        <p className={`font-medium mt-0.5 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                          {alert.userAffected}
                        </p>
                      </div>
                      <div>
                        <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>Source IP</span>
                        <p className={`font-mono font-medium mt-0.5 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                          {alert.sourceIp}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Alerts;
