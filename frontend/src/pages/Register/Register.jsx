import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { MdPerson, MdEmail, MdLock, MdVisibility, MdVisibilityOff, MdSecurity, MdBadge } from 'react-icons/md';

const ROLES = ['Admin', 'Operator', 'Auditor', 'User', 'Analyst'];

const Register = () => {
  const { register } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', role: 'User', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    const result = await register(form.name, form.email, form.role, form.password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  const strength = (pw) => {
    if (!pw) return 0;
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  };

  const pwStrength = strength(form.password);
  const strengthColors = ['bg-red-500', 'bg-orange-400', 'bg-yellow-400', 'bg-green-400', 'bg-green-500'];
  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];

  const fields = [
    { name: 'name', label: 'Full Name', type: 'text', icon: MdPerson, placeholder: 'Sarah Connor' },
    { name: 'email', label: 'Email Address', type: 'email', icon: MdEmail, placeholder: 'sarah@cyberdefense.io' },
  ];

  return (
    <div className={`min-h-screen flex items-center justify-center relative overflow-hidden py-8
      ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>

      <div className="cyber-grid opacity-60" />
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse-glow pointer-events-none" />

      <div className="relative z-10 w-full max-w-md px-4">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-600 shadow-cyber-neon mb-4 animate-float">
            <MdSecurity className="text-white text-3xl" />
          </div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>Create Account</h1>
          <p className={`text-sm font-mono mt-1 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
            REGISTER NEW OPERATOR
          </p>
        </div>

        {/* Card */}
        <div className={`glass-panel rounded-2xl p-8 ${isDark ? '' : 'bg-white/80'}`}>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {fields.map(({ name, label, type, icon: Icon, placeholder }) => (
              <div key={name}>
                <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {label}
                </label>
                <div className={`relative flex items-center rounded-lg border transition-all
                  ${isDark ? 'bg-slate-800/50 border-slate-700 focus-within:border-cyan-500' : 'bg-slate-50 border-slate-200 focus-within:border-cyan-500'}`}>
                  <Icon className={`absolute left-3 text-lg ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                  <input
                    id={`register-${name}`}
                    name={name}
                    type={type}
                    value={form[name]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    required
                    className={`w-full pl-10 pr-4 py-2.5 bg-transparent text-sm outline-none
                      ${isDark ? 'text-slate-100 placeholder-slate-600' : 'text-slate-800 placeholder-slate-400'}`}
                  />
                </div>
              </div>
            ))}

            {/* Role Select */}
            <div>
              <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Role
              </label>
              <div className={`relative flex items-center rounded-lg border transition-all
                ${isDark ? 'bg-slate-800/50 border-slate-700 focus-within:border-cyan-500' : 'bg-slate-50 border-slate-200 focus-within:border-cyan-500'}`}>
                <MdBadge className={`absolute left-3 text-lg ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                <select
                  id="register-role"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2.5 bg-transparent text-sm outline-none appearance-none
                    ${isDark ? 'text-slate-100' : 'text-slate-800'}`}
                >
                  {ROLES.map(r => <option key={r} value={r} className="bg-slate-900">{r}</option>)}
                </select>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Password
              </label>
              <div className={`relative flex items-center rounded-lg border transition-all
                ${isDark ? 'bg-slate-800/50 border-slate-700 focus-within:border-cyan-500' : 'bg-slate-50 border-slate-200 focus-within:border-cyan-500'}`}>
                <MdLock className={`absolute left-3 text-lg ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                <input
                  id="register-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 6 characters"
                  required
                  className={`w-full pl-10 pr-10 py-2.5 bg-transparent text-sm outline-none
                    ${isDark ? 'text-slate-100 placeholder-slate-600' : 'text-slate-800 placeholder-slate-400'}`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3 ${isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`}>
                  {showPassword ? <MdVisibilityOff className="text-lg" /> : <MdVisibility className="text-lg" />}
                </button>
              </div>
              {/* Strength Bar */}
              {form.password && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    {[1,2,3,4].map(i => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-colors
                        ${i <= pwStrength ? strengthColors[pwStrength] : isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />
                    ))}
                  </div>
                  <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    Strength: <span className="font-medium">{strengthLabels[pwStrength]}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Confirm Password
              </label>
              <div className={`relative flex items-center rounded-lg border transition-all
                ${form.confirmPassword && form.confirmPassword !== form.password
                  ? 'border-red-500'
                  : isDark ? 'bg-slate-800/50 border-slate-700 focus-within:border-cyan-500' : 'bg-slate-50 border-slate-200 focus-within:border-cyan-500'}`}>
                <MdLock className={`absolute left-3 text-lg ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                <input
                  id="register-confirm-password"
                  name="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat password"
                  required
                  className={`w-full pl-10 pr-10 py-2.5 bg-transparent text-sm outline-none
                    ${isDark ? 'text-slate-100 placeholder-slate-600' : 'text-slate-800 placeholder-slate-400'}`}
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  className={`absolute right-3 ${isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`}>
                  {showConfirm ? <MdVisibilityOff className="text-lg" /> : <MdVisibility className="text-lg" />}
                </button>
              </div>
            </div>

            <button
              id="register-btn"
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-600 text-white text-sm font-semibold
                hover:from-purple-400 hover:to-cyan-500 transition-all shadow-cyber-neon disabled:opacity-50 mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating Account...
                </span>
              ) : 'Create Secure Account'}
            </button>
          </form>

          <p className={`text-center text-sm mt-6 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            Already have an account?{' '}
            <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
