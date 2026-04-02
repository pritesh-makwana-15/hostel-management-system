import api from './api';

// ── Admin Room API Service ────────────────────────────────────
// Base URL: /api/admin/rooms (secured by JWT + ADMIN role)

export const adminRoomApi = {

  // GET /api/admin/rooms — fetch all rooms
  getAll: () => api.get('/api/admin/rooms'),

  // GET /api/admin/rooms/:id — fetch single room with beds
  getById: (id) => api.get(`/api/admin/rooms/${id}`),

  // POST /api/admin/rooms — create room (beds auto-created)
  create: (data) => api.post('/api/admin/rooms', data),

  // PUT /api/admin/rooms/:id — update room + adjust beds
  update: (id, data) => api.put(`/api/admin/rooms/${id}`, data),
};
