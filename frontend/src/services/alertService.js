import axios from 'axios';

// Example:
// const API_URL = '/api/alerts';

export const alertService = {
  getAlerts: async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return { success: true };
  },
  resolveAlert: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return { success: true, id };
  },
  acknowledgeAlert: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return { success: true, id };
  }
};
