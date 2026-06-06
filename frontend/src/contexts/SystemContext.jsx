import React, { createContext, useContext, useState, useEffect } from 'react';
import usersMock from '../mockData/usersMock.json';
import alertsMock from '../mockData/alertsMock.json';
import logsMock from '../mockData/logsMock.json';
import monitoringMock from '../mockData/monitoringMock.json';

const SystemContext = createContext();

export const SystemProvider = ({ children }) => {
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('sys_users');
    return saved ? JSON.parse(saved) : usersMock;
  });

  const [alerts, setAlerts] = useState(() => {
    const saved = localStorage.getItem('sys_alerts');
    return saved ? JSON.parse(saved) : alertsMock;
  });

  const [logs, setLogs] = useState(() => {
    const saved = localStorage.getItem('sys_logs');
    return saved ? JSON.parse(saved) : logsMock;
  });

  const [monitoring, setMonitoring] = useState(() => {
    const saved = localStorage.getItem('sys_monitoring');
    return saved ? JSON.parse(saved) : monitoringMock;
  });

  // Persist states to local storage to simulate backend data retention
  useEffect(() => {
    localStorage.setItem('sys_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('sys_alerts', JSON.stringify(alerts));
  }, [alerts]);

  useEffect(() => {
    localStorage.setItem('sys_logs', JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem('sys_monitoring', JSON.stringify(monitoring));
  }, [monitoring]);

  // Helper to add audit logs
  const addLog = (action, actor, details, status = 'Success', ip = '127.0.0.1') => {
    const newLog = {
      id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actor,
      action,
      status,
      ipAddress: ip,
      details
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  // User CRUD Operations
  const addUser = (userData) => {
    const newUser = {
      id: `USR-${Math.floor(100 + Math.random() * 900)}`,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(userData.name)}`,
      lastActive: 'Never',
      ...userData
    };
    setUsers((prev) => [...prev, newUser]);
    
    // Update chart data in monitoring
    setMonitoring((prev) => {
      const updatedUserStats = prev.chartsData.userStats.map(stat => {
        if (stat.name === userData.role + 's' || (userData.role === 'User' && stat.name === 'Users')) {
          return { ...stat, count: stat.count + 1 };
        }
        return stat;
      });
      return {
        ...prev,
        chartsData: {
          ...prev.chartsData,
          userStats: updatedUserStats
        }
      };
    });

    addLog('USER_CREATE', 'Administrator', `Created user account ${newUser.id} (${newUser.email})`);
    return newUser;
  };

  const updateUser = (id, updatedData) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, ...updatedData } : u))
    );
    
    const userObj = users.find(u => u.id === id);
    addLog('USER_UPDATE', 'Administrator', `Updated user account ${id} information`);
  };

  const deleteUser = (id) => {
    const userObj = users.find(u => u.id === id);
    setUsers((prev) => prev.filter((u) => u.id !== id));
    
    if (userObj) {
      // Update chart data in monitoring
      setMonitoring((prev) => {
        const updatedUserStats = prev.chartsData.userStats.map(stat => {
          if (stat.name === userObj.role + 's' || (userObj.role === 'User' && stat.name === 'Users')) {
            return { ...stat, count: Math.max(0, stat.count - 1) };
          }
          return stat;
        });
        return {
          ...prev,
          chartsData: {
            ...prev.chartsData,
            userStats: updatedUserStats
          }
        };
      });
      addLog('USER_DELETE', 'Administrator', `Deleted user account ${id} (${userObj.email})`);
    }
  };

  // Alert Operations
  const resolveAlert = (id) => {
    setAlerts((prev) =>
      prev.map((alt) => (alt.id === id ? { ...alt, status: 'Resolved' } : alt))
    );
    addLog('ALERT_RESOLVE', 'Administrator', `Resolved security incident ${id}`);
  };

  const acknowledgeAlert = (id) => {
    setAlerts((prev) =>
      prev.map((alt) => (alt.id === id ? { ...alt, status: 'Investigating' } : alt))
    );
    addLog('ALERT_ACKNOWLEDGE', 'Administrator', `Investigating security incident ${id}`);
  };

  // Export Log Data
  const exportLogs = (format = 'json') => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `security_audit_logs_${Date.now()}.${format}`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    addLog('LOG_EXPORT', 'Administrator', `Exported ${logs.length} audit logs in ${format.toUpperCase()} format`);
  };

  return (
    <SystemContext.Provider
      value={{
        users,
        alerts,
        logs,
        monitoring,
        addUser,
        updateUser,
        deleteUser,
        resolveAlert,
        acknowledgeAlert,
        addLog,
        exportLogs
      }}
    >
      {children}
    </SystemContext.Provider>
  );
};

export const useSystem = () => useContext(SystemContext);
