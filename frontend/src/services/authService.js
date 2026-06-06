import axios from 'axios';

// In production, set the base URL of your API:
// const API = axios.create({ baseURL: 'https://api.cyberdefense.io/v1' });

export const authService = {
  login: async (email, password) => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Support standard test credentials for different roles
    if (email === 'admin@cyberdefense.io' && password === 'admin123') {
      return {
        success: true,
        token: 'mock-jwt-token-admin',
        user: {
          id: 'USR-001',
          name: 'Sarah Connor',
          email: 'admin@cyberdefense.io',
          role: 'Admin',
          avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Sarah'
        }
      };
    } else if (email === 'operator@cyberdefense.io' && password === 'operator123') {
      return {
        success: true,
        token: 'mock-jwt-token-operator',
        user: {
          id: 'USR-002',
          name: 'John Connor',
          email: 'operator@cyberdefense.io',
          role: 'Operator',
          avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=John'
        }
      };
    } else if (email === 'auditor@cyberdefense.io' && password === 'auditor123') {
      return {
        success: true,
        token: 'mock-jwt-token-auditor',
        user: {
          id: 'USR-003',
          name: 'Alice Vance',
          email: 'auditor@cyberdefense.io',
          role: 'Auditor',
          avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Alice'
        }
      };
    } else if (password === 'password123') {
      // Allow any user with password123 for easier demonstration
      const name = email.split('@')[0].replace('.', ' ');
      const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1);
      const formattedName = name.split(' ').map(capitalize).join(' ');
      return {
        success: true,
        token: 'mock-jwt-token-standard',
        user: {
          id: `USR-${Math.floor(100 + Math.random() * 900)}`,
          name: formattedName,
          email: email,
          role: 'User',
          avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${name}`
        }
      };
    } else {
      throw new Error('Invalid credentials. (Hint: Use admin@cyberdefense.io / admin123)');
    }
  },

  register: async (userData) => {
    await new Promise((resolve) => setTimeout(resolve, 600));

    return {
      success: true,
      token: 'mock-jwt-token-registered',
      user: {
        id: `USR-${Math.floor(100 + Math.random() * 900)}`,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(userData.name)}`
      }
    };
  },

  logout: () => {
    return true;
  }
};
