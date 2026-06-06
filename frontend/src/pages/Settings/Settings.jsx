import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import {
  MdLightMode, MdDarkMode, MdSecurity, MdNotifications,
  MdPerson, MdVpnKey, MdShield, MdCheck, MdSave
} from 'react-icons/md';

const Toggle = ({ enabled, onChange, isDark }) => (
  <button
    onClick={() => onChange(!enabled)}
    className={`relative w-10 h-5 rounded-full transition-colors ${enabled ? 'bg-cyan-500' : isDark ? 'bg-slate-700' : 'bg-slate-200'}`}
  >
    <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform shadow-sm
      ${enabled ? 'translate-x-5' : 'translate-x-0'}`} />
  </button>
);

const Section = ({ title, icon: Icon, children, isDark }) => (
  <div className={`glass-panel rounded-xl overflow-hidden ${isDark ? '' : 'bg-white/80'}`}>
    <div className={`px-6 py-4 border-b flex items-center gap-2 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
      <Icon className={`text-xl ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
      <h3 className={`text-sm font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{title}</h3>
    </div>
    <div className="p-6 space-y-4">{children}</div>
  </div>
);

const SettingRow = ({ label, description, children, isDark }) => (
  <div className="flex items-center justify-between gap-4">
    <div>
      <p className={`text-sm font-medium ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{label}</p>
      {description && (
        <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{description}</p>
      )}
    </div>
    <div className="flex-shrink-0">{children}</div>
  </div>
);

const Settings = () => {
  const { isDark, toggleTheme } = useTheme();
  const { user } = useAuth();

  const [prefs, setPrefs] = useState({
    emailAlerts: true,
    criticalOnly: false,
    mfaEnabled: true,
    sessionTimeout: '30',
    apiLogging: true,
    auditRetention: '90',
    autoBlock: false,
    threatIntelFeed: true,
  });

  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const [saved, setSaved] = useState(false);

  const toggle = (key) => setPrefs(p => ({ ...p, [key]: !p[key] }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const inputCls = `w-full px-3 py-2 rounded-lg border text-sm outline-none transition-colors
    ${isDark ? 'bg-slate-800 border-slate-700 text-slate-100 focus:border-cyan-500' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-cyan-500'}`;

  const selectCls = inputCls + ' appearance-none';

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={`text-xl font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>Settings</h2>
          <p className={`text-sm mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            Manage preferences and system configuration
          </p>
        </div>
        <button
          id="save-settings-btn"
          onClick={handleSave}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all
            ${saved
              ? 'bg-green-500 text-white shadow-cyber-green'
              : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-cyber-neon hover:opacity-90'}`}
        >
          {saved ? <MdCheck className="text-lg" /> : <MdSave className="text-lg" />}
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      {/* Appearance */}
      <Section title="Appearance" icon={MdLightMode} isDark={isDark}>
        <SettingRow
          label="Dark Mode"
          description="Switch between dark and light interface themes"
          isDark={isDark}
        >
          <Toggle enabled={isDark} onChange={toggleTheme} isDark={isDark} />
        </SettingRow>
      </Section>

      {/* Profile */}
      <Section title="Profile" icon={MdPerson} isDark={isDark}>
        <div className="flex items-center gap-4">
          <img
            src={user?.avatar}
            alt={user?.name}
            className="w-16 h-16 rounded-full border-2 border-cyan-500/30"
          />
          <div>
            <p className={`font-semibold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>{user?.name}</p>
            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{user?.email}</p>
            <span className="text-xs px-2 py-0.5 mt-1 inline-block rounded-full bg-cyan-500/10 text-cyan-400">
              {user?.role}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Display Name</label>
            <input
              id="settings-name"
              value={profile.name}
              onChange={e => setProfile({ ...profile, name: e.target.value })}
              className={inputCls}
            />
          </div>
          <div>
            <label className={`block text-xs font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Email Address</label>
            <input
              id="settings-email"
              type="email"
              value={profile.email}
              onChange={e => setProfile({ ...profile, email: e.target.value })}
              className={inputCls}
            />
          </div>
        </div>
      </Section>

      {/* Notifications */}
      <Section title="Notifications" icon={MdNotifications} isDark={isDark}>
        <SettingRow label="Email Alerts" description="Send security alerts to your registered email" isDark={isDark}>
          <Toggle enabled={prefs.emailAlerts} onChange={() => toggle('emailAlerts')} isDark={isDark} />
        </SettingRow>
        <div className={`border-t ${isDark ? 'border-slate-800' : 'border-slate-100'}`} />
        <SettingRow label="Critical Alerts Only" description="Only notify for Critical and High severity events" isDark={isDark}>
          <Toggle enabled={prefs.criticalOnly} onChange={() => toggle('criticalOnly')} isDark={isDark} />
        </SettingRow>
      </Section>

      {/* Security */}
      <Section title="Security" icon={MdVpnKey} isDark={isDark}>
        <SettingRow label="Multi-Factor Authentication" description="Require MFA for all logins" isDark={isDark}>
          <Toggle enabled={prefs.mfaEnabled} onChange={() => toggle('mfaEnabled')} isDark={isDark} />
        </SettingRow>
        <div className={`border-t ${isDark ? 'border-slate-800' : 'border-slate-100'}`} />
        <SettingRow label="Session Timeout" description="Auto-logout after inactivity" isDark={isDark}>
          <select
            value={prefs.sessionTimeout}
            onChange={e => setPrefs({ ...prefs, sessionTimeout: e.target.value })}
            className={`w-32 px-3 py-1.5 rounded-lg border text-sm outline-none ${isDark ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-800'} appearance-none`}
          >
            {['15', '30', '60', '120'].map(v => (
              <option key={v} value={v} className="bg-slate-900">{v} min</option>
            ))}
          </select>
        </SettingRow>
      </Section>

      {/* System */}
      <Section title="System Configuration" icon={MdShield} isDark={isDark}>
        <SettingRow label="API Request Logging" description="Log all incoming API requests to audit trail" isDark={isDark}>
          <Toggle enabled={prefs.apiLogging} onChange={() => toggle('apiLogging')} isDark={isDark} />
        </SettingRow>
        <div className={`border-t ${isDark ? 'border-slate-800' : 'border-slate-100'}`} />
        <SettingRow label="Auto-Block Suspicious IPs" description="Automatically block IPs with repeated violations" isDark={isDark}>
          <Toggle enabled={prefs.autoBlock} onChange={() => toggle('autoBlock')} isDark={isDark} />
        </SettingRow>
        <div className={`border-t ${isDark ? 'border-slate-800' : 'border-slate-100'}`} />
        <SettingRow label="Threat Intelligence Feed" description="Enable real-time threat data synchronization" isDark={isDark}>
          <Toggle enabled={prefs.threatIntelFeed} onChange={() => toggle('threatIntelFeed')} isDark={isDark} />
        </SettingRow>
        <div className={`border-t ${isDark ? 'border-slate-800' : 'border-slate-100'}`} />
        <SettingRow label="Audit Log Retention" description="Number of days to retain audit logs" isDark={isDark}>
          <select
            value={prefs.auditRetention}
            onChange={e => setPrefs({ ...prefs, auditRetention: e.target.value })}
            className={`w-36 px-3 py-1.5 rounded-lg border text-sm outline-none ${isDark ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-800'} appearance-none`}
          >
            {['30', '60', '90', '180', '365'].map(v => (
              <option key={v} value={v} className="bg-slate-900">{v} days</option>
            ))}
          </select>
        </SettingRow>
      </Section>

      {/* Version info */}
      <div className={`text-center text-xs ${isDark ? 'text-slate-700' : 'text-slate-300'}`}>
        CyberDefense Access Control System · Frontend v1.0.0 · All data is mock — no backend connected
      </div>
    </div>
  );
};

export default Settings;
