import api from './api';

// ── Warden API Service ──────────────────────────────────────
// Base URL: /api/warden (secured by JWT + WARDEN role)

export const wardenApi = {

  // GET /api/warden/profile — get current warden's profile
  getProfile: () => api.get('/api/warden/profile'),

  // PUT /api/warden/profile — update warden profile
  updateProfile: (data) => api.put('/api/warden/profile', data),

  // POST /api/warden/change-password — change password
  changePassword: (data) => api.post('/api/warden/change-password', data),

  // GET /api/warden/sessions — get active sessions
  getActiveSessions: () => api.get('/api/warden/sessions'),

  // POST /api/warden/logout-all — logout from all devices
  logoutAllDevices: () => api.post('/api/warden/logout-all'),

  // ── Announcements API for Wardens ──────────────────────────

  // GET /api/announcements/active — get active announcements for wardens
  getActiveAnnouncements: () => api.get('/api/announcements/active'),

  // POST /api/announcements/warden — create an announcement as a warden
  createAnnouncement: (data) => api.post('/api/announcements/warden', data),
};

export default wardenApi;
