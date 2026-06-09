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

  // GET /api/admin/dashboard/alerts
  // Returns: ApiResponse<Map<String, Object>>
  getAlerts: () => api.get('/api/admin/dashboard/alerts'),

  // GET /api/admin/dashboard/charts
  // Returns: ApiResponse<Map<String, Object>>
  getCharts: () => api.get('/api/admin/dashboard/charts'),
};
