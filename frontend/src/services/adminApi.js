import api from './api';

export const adminApi = {
  // Get admin profile information
  getProfile: async () => {
    const response = await api.get('/api/admin/profile');
    return response;
  },

  // Update admin profile
  updateProfile: async (profileData) => {
    const response = await api.put('/api/admin/profile', profileData);
    return response;
  },

  // Change admin password
  changePassword: async (passwordData) => {
    const response = await api.post('/api/admin/change-password', passwordData);
    return response;
  },

  // Get admin dashboard stats
  getDashboardStats: async () => {
    const response = await api.get('/api/admin/dashboard/stats');
    return response;
  }
};
