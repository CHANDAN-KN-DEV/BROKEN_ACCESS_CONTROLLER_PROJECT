import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useSystem } from '../../contexts/SystemContext';
import { useAuth } from '../../contexts/AuthContext';
import {
  MdAdd, MdEdit, MdDelete, MdSearch, MdFilterList,
  MdPersonOff, MdPerson, MdClose, MdCheck
} from 'react-icons/md';

const ROLES = ['Admin', 'Operator', 'Auditor', 'User', 'Analyst'];
const STATUSES = ['Active', 'Inactive', 'Suspended'];

const statusStyle = (s) => ({
  Active: 'bg-green-500/15 text-green-400 border border-green-500/30',
  Inactive: 'bg-slate-500/15 text-slate-400 border border-slate-500/30',
  Suspended: 'bg-red-500/15 text-red-400 border border-red-500/30',
}[s] || '');

const roleStyle = (r) => ({
  Admin: 'bg-red-500/10 text-red-400',
  Operator: 'bg-cyan-500/10 text-cyan-400',
  Auditor: 'bg-purple-500/10 text-purple-400',
  User: 'bg-slate-500/10 text-slate-400',
  Analyst: 'bg-yellow-500/10 text-yellow-400',
}[r] || 'bg-slate-500/10 text-slate-400');

const Modal = ({ title, onClose, children, isDark }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
    <div className={`relative w-full max-w-md rounded-2xl p-6 shadow-2xl z-10
      ${isDark ? 'bg-slate-900 border border-slate-700' : 'bg-white border border-slate-200'}`}>
      <div className="flex items-center justify-between mb-5">
        <h3 className={`text-base font-semibold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>{title}</h3>
        <button onClick={onClose} className={`p-1 rounded-lg ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}>
          <MdClose className="text-xl" />
        </button>
      </div>
      {children}
    </div>
  </div>
);

const UserForm = ({ initial, onSave, onCancel, isDark }) => {
  const [form, setForm] = useState(initial || { name: '', email: '', role: 'User', status: 'Active' });
  const inputCls = `w-full px-3 py-2 rounded-lg border text-sm outline-none transition-colors
    ${isDark ? 'bg-slate-800 border-slate-700 text-slate-100 focus:border-cyan-500' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-cyan-500'}`;

  return (
    <div className="space-y-4">
      {['name', 'email'].map(f => (
        <div key={f}>
          <label className={`block text-xs font-medium mb-1 capitalize ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{f}</label>
          <input
            type={f === 'email' ? 'email' : 'text'}
            value={form[f]}
            onChange={e => setForm({ ...form, [f]: e.target.value })}
            className={inputCls}
            placeholder={f === 'name' ? 'Full name' : 'email@cyberdefense.io'}
            required
          />
        </div>
      ))}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Role</label>
          <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
            className={inputCls + ' appearance-none'}>
            {ROLES.map(r => <option key={r} value={r} className="bg-slate-900">{r}</option>)}
          </select>
        </div>
        <div>
          <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Status</label>
          <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
            className={inputCls + ' appearance-none'}>
            {STATUSES.map(s => <option key={s} value={s} className="bg-slate-900">{s}</option>)}
          </select>
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button onClick={() => onSave(form)}
          className="flex-1 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity">
          Save User
        </button>
        <button onClick={onCancel}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors
            ${isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
          Cancel
        </button>
      </div>
    </div>
  );
};

const UserManagement = () => {
  const { isDark } = useTheme();
  const { users, addUser, updateUser, deleteUser } = useSystem();
  const { user: currentUser } = useAuth();

  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('All');
  const [modal, setModal] = useState(null); // null | 'add' | 'edit' | 'delete'
  const [selected, setSelected] = useState(null);

  const filtered = users.filter(u =>
    (filterRole === 'All' || u.role === filterRole) &&
    (u.name.toLowerCase().includes(search.toLowerCase()) ||
     u.email.toLowerCase().includes(search.toLowerCase()))
  );

  const handleAdd = (form) => {
    addUser(form);
    setModal(null);
  };

  const handleEdit = (form) => {
    updateUser(selected.id, form);
    setModal(null);
    setSelected(null);
  };

  const handleDelete = () => {
    deleteUser(selected.id);
    setModal(null);
    setSelected(null);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className={`text-xl font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>User Management</h2>
          <p className={`text-sm mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            {users.length} users registered
          </p>
        </div>
        {currentUser?.role === 'Admin' && (
          <button
            id="add-user-btn"
            onClick={() => setModal('add')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-cyber-neon"
          >
            <MdAdd className="text-xl" />
            Add User
          </button>
        )}
      </div>

      {/* Filters */}
      <div className={`glass-panel rounded-xl p-4 flex flex-col sm:flex-row gap-3 ${isDark ? '' : 'bg-white/80'}`}>
        <div className={`relative flex items-center gap-2 flex-1 rounded-lg px-3 py-2 border
          ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
          <MdSearch className={`text-lg flex-shrink-0 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className={`bg-transparent outline-none text-sm flex-1 ${isDark ? 'text-slate-100 placeholder-slate-600' : 'text-slate-800 placeholder-slate-400'}`}
          />
        </div>
        <div className={`flex items-center gap-2 rounded-lg px-3 py-2 border
          ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
          <MdFilterList className={`text-lg flex-shrink-0 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
          <select
            value={filterRole}
            onChange={e => setFilterRole(e.target.value)}
            className={`bg-transparent outline-none text-sm ${isDark ? 'text-slate-100' : 'text-slate-800'} appearance-none`}
          >
            <option value="All" className="bg-slate-900">All Roles</option>
            {ROLES.map(r => <option key={r} value={r} className="bg-slate-900">{r}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className={`glass-panel rounded-xl overflow-hidden ${isDark ? '' : 'bg-white/80'}`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`text-xs font-medium uppercase tracking-wider border-b
                ${isDark ? 'text-slate-500 border-slate-800' : 'text-slate-400 border-slate-100'}`}>
                <th className="text-left px-4 py-3">User</th>
                <th className="text-left px-4 py-3 hidden md:table-cell">Email</th>
                <th className="text-left px-4 py-3">Role</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3 hidden lg:table-cell">Last Active</th>
                <th className="text-right px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className={`text-center py-12 text-sm ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
                    No users found matching your filters.
                  </td>
                </tr>
              ) : (
                filtered.map(u => (
                  <tr key={u.id} className={`border-b text-sm transition-colors
                    ${isDark ? 'border-slate-800/50 hover:bg-slate-800/30' : 'border-slate-50 hover:bg-slate-50'}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={u.avatar} alt={u.name}
                          className="w-8 h-8 rounded-full border border-cyan-500/20 flex-shrink-0" />
                        <div>
                          <p className={`font-medium ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>{u.name}</p>
                          <p className={`text-xs font-mono ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>{u.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className={`px-4 py-3 hidden md:table-cell text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{u.email}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${roleStyle(u.role)}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusStyle(u.status)}`}>
                        {u.status}
                      </span>
                    </td>
                    <td className={`px-4 py-3 text-xs hidden lg:table-cell ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      {u.lastActive}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => { setSelected(u); setModal('edit'); }}
                          className={`p-1.5 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-700 text-slate-400 hover:text-cyan-400' : 'hover:bg-slate-100 text-slate-400 hover:text-cyan-600'}`}
                          title="Edit User"
                        >
                          <MdEdit className="text-base" />
                        </button>
                        {currentUser?.role === 'Admin' && u.id !== currentUser?.id && (
                          <button
                            onClick={() => { setSelected(u); setModal('delete'); }}
                            className={`p-1.5 rounded-lg transition-colors ${isDark ? 'hover:bg-red-500/10 text-slate-400 hover:text-red-400' : 'hover:bg-red-50 text-slate-400 hover:text-red-500'}`}
                            title="Delete User"
                          >
                            <MdDelete className="text-base" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {modal === 'add' && (
        <Modal title="Add New User" onClose={() => setModal(null)} isDark={isDark}>
          <UserForm onSave={handleAdd} onCancel={() => setModal(null)} isDark={isDark} />
        </Modal>
      )}
      {modal === 'edit' && selected && (
        <Modal title={`Edit: ${selected.name}`} onClose={() => setModal(null)} isDark={isDark}>
          <UserForm initial={selected} onSave={handleEdit} onCancel={() => setModal(null)} isDark={isDark} />
        </Modal>
      )}
      {modal === 'delete' && selected && (
        <Modal title="Confirm Deletion" onClose={() => setModal(null)} isDark={isDark}>
          <p className={`text-sm mb-5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Are you sure you want to permanently delete <span className="font-semibold text-red-400">{selected.name}</span>?
            This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button onClick={handleDelete}
              className="flex-1 py-2 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors">
              Delete User
            </button>
            <button onClick={() => setModal(null)}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors
                ${isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
              Cancel
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default UserManagement;
