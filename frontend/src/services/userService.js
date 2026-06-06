import axios from 'axios';

// Example:
// const API_URL = '/api/users';

export const userService = {
  getUsers: async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return { success: true };
  },
  createUser: async (userData) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return { success: true, data: userData };
  },
  updateUser: async (id, userData) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return { success: true, id, data: userData };
  },
  deleteUser: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return { success: true, id };
  }
};
