import api from './api';

// ── Admin Dashboard API ──────────────────────────────────────────
// Usage: import { adminDashboardApi } from '../services/adminDashboardApi'

export const adminDashboardApi = {

  // GET /api/admin/dashboard/stats
  // Returns: ApiResponse<Map<String, Object>>
  getStats: () => api.get('/api/admin/dashboard/stats'),

  // GET /api/admin/dashboard/recent-activity
  // Returns: ApiResponse<Map<String, Object>>
  getRecentActivity: () => api.get('/api/admin/dashboard/recent-activity'),
};
