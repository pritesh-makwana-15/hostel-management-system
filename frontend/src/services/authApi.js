import api from './api';

// ── Auth API ──────────────────────────────────────────────────
// Usage: import { authApi } from '../services/authApi'

export const authApi = {

  // POST /auth/login
  // body: { email, password }
  // returns: { token, role, name, email }
  login: (credentials) => api.post('/auth/login', credentials),

};