import api from './api';

// ── Warden Complaints API Service ──────────────────────────────
// Usage: import { wardenComplaintsApi } from '../services/wardenComplaintsApi'

export const wardenComplaintsApi = {
  // GET /api/warden/complaints — get all complaints assigned to current warden
  getAll: () => api.get('/api/warden/complaints'),

  // PUT /api/warden/complaints/:id/status — persist complaint status updates
  updateStatus: (id, data) => api.put(`/api/warden/complaints/${id}/status`, data),

  // Additional helper method for filtering
  getByStatus: (status) => api.get('/api/warden/complaints', { params: { status } }),
};

export default wardenComplaintsApi;
