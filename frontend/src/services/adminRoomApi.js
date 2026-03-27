import api from './api';

// ── Admin Room API ────────────────────────────────────────────
// Usage: import { adminRoomApi } from '../services/adminRoomApi'

export const adminRoomApi = {

  // GET /api/admin/rooms
  getAll: () => api.get('/api/admin/rooms'),

  // GET /api/admin/rooms/{id}
  getById: (id) => api.get(`/api/admin/rooms/${id}`),

  // GET /api/admin/rooms/available?block=&type=
  getAvailable: (block, type) =>
    api.get('/api/admin/rooms/available', { params: { block, type } }),

  // POST /api/admin/rooms
  create: (data) => api.post('/api/admin/rooms', data),

  // PUT /api/admin/rooms/{id}
  update: (id, data) => api.put(`/api/admin/rooms/${id}`, data),

  // DELETE /api/admin/rooms/{id}
  delete: (id) => api.delete(`/api/admin/rooms/${id}`),
};