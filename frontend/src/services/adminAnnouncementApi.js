import api from './api';

// Admin Announcement API Service
export const adminAnnouncementApi = {
  // GET /api/announcements/all - get all announcements for admin list
  getAll: () => api.get('/api/announcements/all'),

  // GET /api/announcements/{id} - get announcement by ID
  getById: (id) => api.get(`/api/announcements/${id}`),

  // POST /api/announcements - create new announcement
  create: (data) => api.post('/api/announcements', data),

  // PUT /api/announcements/{id} - update announcement
  update: (id, data) => api.put(`/api/announcements/${id}`, data),

  // DELETE /api/announcements/{id} - delete announcement
  delete: (id) => api.delete(`/api/announcements/${id}`),

  // GET /api/announcements/active - get active announcements
  getActive: () => api.get('/api/announcements/active'),

  // GET /api/announcements/audience/{audience} - get announcements by audience
  getByAudience: (audience) => api.get(`/api/announcements/audience/${audience}`),

  // GET /api/announcements/search - search announcements
  search: (keyword, page = 0, size = 10) => 
    api.get(`/api/announcements/search?keyword=${keyword}&page=${page}&size=${size}`),

  // GET /api/announcements/stats - get announcement statistics
  getStats: () => api.get('/api/announcements/stats'),
};
