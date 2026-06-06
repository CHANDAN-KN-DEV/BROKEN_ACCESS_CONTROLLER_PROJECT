import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { MdEmail, MdLock, MdVisibility, MdVisibilityOff, MdSecurity, MdShield } from 'react-icons/md';

const Login = () => {
  const { login, user } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('rememberEmail');
    if (saved) { setEmail(saved); setRememberMe(true); }
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password, rememberMe);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  const demoCredentials = [
    { label: 'Admin', email: 'admin@cyberdefense.io', password: 'admin123', color: 'from-red-500 to-rose-600' },
    { label: 'Operator', email: 'operator@cyberdefense.io', password: 'operator123', color: 'from-cyan-500 to-blue-600' },
    { label: 'Auditor', email: 'auditor@cyberdefense.io', password: 'auditor123', color: 'from-purple-500 to-violet-600' },
  ];

  return (
    <div className={`min-h-screen flex items-center justify-center relative overflow-hidden
      ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>

      {/* Background Grid */}
      <div className="cyber-grid opacity-60" />

      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse-glow pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-pulse-glow pointer-events-none" style={{ animationDelay: '1.5s' }} />

      <div className="relative z-10 w-full max-w-md px-4">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-cyber-neon mb-4 animate-float">
            <MdSecurity className="text-white text-3xl" />
          </div>
          <h1 className={`text-2xl font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
            CyberDefense
          </h1>
          <p className={`text-sm font-mono mt-1 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`}>
            ACCESS CONTROL SYSTEM
          </p>
        </div>

        {/* Card */}
        <div className={`glass-panel rounded-2xl p-8 ${isDark ? '' : 'bg-white/80'}`}>
          <h2 className={`text-lg font-semibold mb-6 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
            Sign In to Dashboard
          </h2>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className={`block text-xs font-medium mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Email Address
              </label>
              <div className={`relative flex items-center rounded-lg border transition-all
                ${isDark ? 'bg-slate-800/50 border-slate-700 focus-within:border-cyan-500' : 'bg-slate-50 border-slate-200 focus-within:border-cyan-500'}`}>
                <MdEmail className={`absolute left-3 text-lg ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@cyberdefense.io"
                  required
                  className={`w-full pl-10 pr-4 py-2.5 bg-transparent text-sm outline-none
                    ${isDark ? 'text-slate-100 placeholder-slate-600' : 'text-slate-800 placeholder-slate-400'}`}
                />
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
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className={`w-full pl-10 pr-10 py-2.5 bg-transparent text-sm outline-none
                    ${isDark ? 'text-slate-100 placeholder-slate-600' : 'text-slate-800 placeholder-slate-400'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3 ${isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {showPassword ? <MdVisibilityOff className="text-lg" /> : <MdVisibility className="text-lg" />}
                </button>
              </div>
            </div>

            {/* Remember Me + Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="w-4 h-4 accent-cyan-500 rounded"
                />
                <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <button
              id="login-btn"
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-semibold
                hover:from-cyan-400 hover:to-blue-500 transition-all shadow-cyber-neon disabled:opacity-50 disabled:cursor-not-allowed
                relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    <MdShield className="text-lg" />
                    Sign In Securely
                  </>
                )}
              </span>
            </button>
          </form>

          <p className={`text-center text-sm mt-6 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            Need an account?{' '}
            <Link to="/register" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
              Register here
            </Link>
          </p>
        </div>

        {/* Demo Credentials */}
        <div className="mt-6">
          <p className={`text-center text-xs mb-3 font-mono ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
            — DEMO CREDENTIALS —
          </p>
          <div className="grid grid-cols-3 gap-2">
            {demoCredentials.map(({ label, email: dEmail, password: dPass, color }) => (
              <button
                key={label}
                id={`demo-${label.toLowerCase()}`}
                onClick={() => { setEmail(dEmail); setPassword(dPass); }}
                className={`p-2 rounded-lg bg-gradient-to-br ${color} text-white text-xs font-semibold
                  hover:opacity-90 transition-opacity shadow-lg`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
