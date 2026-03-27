import api from './api';

// ── Admin Warden API ──────────────────────────────────────────
// Usage: import { adminWardenApi } from '../services/adminWardenApi'

export const adminWardenApi = {

  // GET /api/admin/wardens
  // Returns: ApiResponse<WardenResponseDTO[]>
  getAll: () => api.get('/api/admin/wardens'),

  // GET /api/admin/wardens/{id}
  // Returns: ApiResponse<WardenResponseDTO>
  getById: (id) => api.get(`/api/admin/wardens/${id}`),

  // POST /api/admin/wardens
  // body: RegisterRequest
  // Used by: AddWarden.jsx
  create: (data) => api.post('/api/admin/wardens', data),

  // PUT /api/admin/wardens/{id}
  // body: RegisterRequest
  // Used by: EditWarden.jsx
  update: (id, data) => api.put(`/api/admin/wardens/${id}`, data),

  // DELETE /api/admin/wardens/{id}
  delete: (id) => api.delete(`/api/admin/wardens/${id}`),
};