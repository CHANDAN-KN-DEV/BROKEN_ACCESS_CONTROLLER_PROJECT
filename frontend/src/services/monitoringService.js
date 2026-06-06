import axios from 'axios';

// Example:
// const API_URL = '/api/monitoring';

export const monitoringService = {
  getApiRequests: async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return { success: true };
  },
  getFailedLogins: async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return { success: true };
  },
  getActiveSessions: async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return { success: true };
  },
  getSystemMetrics: async () => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return { success: true };
  }
};
