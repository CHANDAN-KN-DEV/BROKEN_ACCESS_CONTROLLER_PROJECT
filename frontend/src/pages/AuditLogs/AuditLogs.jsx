import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useSystem } from '../../contexts/SystemContext';
import {
  MdSearch, MdFilterList, MdDownload, MdDescription,
  MdCheck, MdClose, MdRefresh
} from 'react-icons/md';

const actionColors = {
  USER_LOGIN: 'bg-blue-500/15 text-blue-400',
  USER_LOGOUT: 'bg-slate-500/15 text-slate-400',
  USER_CREATE: 'bg-green-500/15 text-green-400',
  USER_UPDATE: 'bg-cyan-500/15 text-cyan-400',
  USER_DELETE: 'bg-red-500/15 text-red-400',
  USER_SUSPEND: 'bg-orange-500/15 text-orange-400',
  ACCESS_VIOLATION: 'bg-red-500/15 text-red-400',
  ALERT_RESOLVE: 'bg-green-500/15 text-green-400',
  ALERT_ACKNOWLEDGE: 'bg-yellow-500/15 text-yellow-400',
  POLICY_UPDATE: 'bg-purple-500/15 text-purple-400',
  LOG_EXPORT: 'bg-cyan-500/15 text-cyan-400',
};

const ALL_ACTIONS = ['All', 'USER_LOGIN', 'USER_CREATE', 'USER_UPDATE', 'USER_DELETE', 'USER_SUSPEND', 'ACCESS_VIOLATION', 'ALERT_RESOLVE', 'POLICY_UPDATE', 'LOG_EXPORT'];

const AuditLogs = () => {
  const { isDark } = useTheme();
  const { logs, exportLogs } = useSystem();
  const [search, setSearch] = useState('');
  const [filterAction, setFilterAction] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const filtered = logs.filter(l =>
    (filterAction === 'All' || l.action === filterAction) &&
    (filterStatus === 'All' || l.status === filterStatus) &&
    (l.actor.toLowerCase().includes(search.toLowerCase()) ||
     l.action.toLowerCase().includes(search.toLowerCase()) ||
     l.details.toLowerCase().includes(search.toLowerCase()) ||
     l.id.toLowerCase().includes(search.toLowerCase()))
  );

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice(page * pageSize, (page + 1) * pageSize);

  const inputCls = `flex items-center gap-2 rounded-lg px-3 py-2 border text-sm
    ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`;
  const selectCls = `bg-transparent outline-none appearance-none text-sm ${isDark ? 'text-slate-100' : 'text-slate-800'}`;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className={`text-xl font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>Audit Logs</h2>
          <p className={`text-sm mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            {logs.length} total log entries
          </p>
        </div>
        <button
          id="export-logs-btn"
          onClick={() => exportLogs('json')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg"
        >
          <MdDownload className="text-xl" />
          Export JSON
        </button>
      </div>

      {/* Filters */}
      <div className={`glass-panel rounded-xl p-4 flex flex-col sm:flex-row gap-3 ${isDark ? '' : 'bg-white/80'}`}>
        <div className={`${inputCls} flex-1`}>
          <MdSearch className={`text-lg flex-shrink-0 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
          <input
            type="text"
            placeholder="Search by actor, action, details..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(0); }}
            className={`bg-transparent outline-none flex-1 ${isDark ? 'text-slate-100 placeholder-slate-600' : 'text-slate-800 placeholder-slate-400'}`}
          />
        </div>
        <div className={inputCls}>
          <MdFilterList className={`text-lg flex-shrink-0 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
          <select className={selectCls} value={filterAction} onChange={e => { setFilterAction(e.target.value); setPage(0); }}>
            {ALL_ACTIONS.map(a => <option key={a} value={a} className="bg-slate-900">{a === 'All' ? 'All Actions' : a}</option>)}
          </select>
        </div>
        <div className={inputCls}>
          <select className={selectCls} value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(0); }}>
            <option value="All" className="bg-slate-900">All Status</option>
            <option value="Success" className="bg-slate-900">Success</option>
            <option value="Failure" className="bg-slate-900">Failure</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className={`glass-panel rounded-xl overflow-hidden ${isDark ? '' : 'bg-white/80'}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className={`border-b ${isDark ? 'text-slate-500 border-slate-800' : 'text-slate-400 border-slate-100'}`}>
                {['Log ID', 'Timestamp', 'Actor', 'Action', 'Details', 'IP Address', 'Status'].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-medium uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={7} className={`text-center py-12 text-sm ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
                    <MdDescription className="text-3xl mx-auto mb-2 opacity-30" />
                    No logs match your filters.
                  </td>
                </tr>
              ) : (
                paginated.map(log => (
                  <tr key={log.id} className={`border-b transition-colors
                    ${isDark ? 'border-slate-800/50 hover:bg-slate-800/30' : 'border-slate-50 hover:bg-slate-50'}`}>
                    <td className={`px-4 py-3 font-mono ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{log.id}</td>
                    <td className={`px-4 py-3 whitespace-nowrap ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{log.timestamp}</td>
                    <td className={`px-4 py-3 max-w-[150px] truncate ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{log.actor}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded font-mono text-xs font-bold whitespace-nowrap
                        ${actionColors[log.action] || 'bg-slate-500/15 text-slate-400'}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className={`px-4 py-3 max-w-[250px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      <span title={log.details} className="truncate block">{log.details}</span>
                    </td>
                    <td className={`px-4 py-3 font-mono ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{log.ipAddress}</td>
                    <td className="px-4 py-3">
                      <span className={`flex items-center gap-1 w-fit px-2 py-0.5 rounded-full font-medium
                        ${log.status === 'Success' ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'}`}>
                        {log.status === 'Success'
                          ? <MdCheck className="text-xs" />
                          : <MdClose className="text-xs" />
                        }
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className={`flex items-center justify-between px-4 py-3 border-t text-xs
            ${isDark ? 'border-slate-800 text-slate-500' : 'border-slate-100 text-slate-400'}`}>
            <span>{filtered.length} results · Page {page + 1} of {totalPages}</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className={`px-3 py-1 rounded transition-colors disabled:opacity-30
                  ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-600'}`}
              >
                Prev
              </button>
              {[...Array(Math.min(totalPages, 5))].map((_, i) => (
                <button key={i} onClick={() => setPage(i)}
                  className={`w-7 h-7 rounded transition-colors font-medium
                    ${i === page
                      ? 'bg-cyan-500 text-white'
                      : isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-600'}`}>
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className={`px-3 py-1 rounded transition-colors disabled:opacity-30
                  ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-600'}`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditLogs;
