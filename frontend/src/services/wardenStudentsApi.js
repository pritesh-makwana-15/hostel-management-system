import api from './api';

export const wardenStudentsApi = {
  // GET /api/warden/students?page=0&size=1000
  getAll: (params = {}) => api.get('/api/warden/students', { params }),
};

