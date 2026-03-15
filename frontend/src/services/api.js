import axios from 'axios';

const TOKEN_KEY = 'hms_token';
const USER_KEY = 'hms_user';

// Base API instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor — attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401 globally (auto logout)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — clear session and redirect
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      window.location.href = '/login';
    }

    if (error.response?.status === 403) {
      console.error('Access forbidden:', error.response.data);
    }

    if (!error.response) {
      console.error('Network Error — backend may be down');
    }

    return Promise.reject(error);
  }
);

export default api;

// ─── Auth API ────────────────────────────────────────────────
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
};

// ─── Admin API ───────────────────────────────────────────────
export const studentAPI = {
  getAll: () => api.get('/api/admin/students'),
  getById: (id) => api.get(`/api/admin/students/${id}`),
  create: (data) => api.post('/api/admin/students', data),
  update: (id, data) => api.put(`/api/admin/students/${id}`, data),
  delete: (id) => api.delete(`/api/admin/students/${id}`),
};

export const roomAPI = {
  getAll: () => api.get('/api/admin/rooms'),
  getById: (id) => api.get(`/api/admin/rooms/${id}`),
  create: (data) => api.post('/api/admin/rooms', data),
  update: (id, data) => api.put(`/api/admin/rooms/${id}`, data),
  delete: (id) => api.delete(`/api/admin/rooms/${id}`),
};

export const wardenAPI = {
  getAll: () => api.get('/api/admin/wardens'),
  create: (data) => api.post('/api/admin/wardens', data),
  update: (id, data) => api.put(`/api/admin/wardens/${id}`, data),
  delete: (id) => api.delete(`/api/admin/wardens/${id}`),
};

export const feeAPI = {
  getAll: () => api.get('/api/admin/fees'),
  getByStudent: (id) => api.get(`/api/admin/fees/student/${id}`),
};

export const complaintAPI = {
  getAll: () => api.get('/api/admin/complaints'),
  resolve: (id, data) => api.put(`/api/admin/complaints/${id}/resolve`, data),
};

export const attendanceAPI = {
  getAll: () => api.get('/api/admin/attendance'),
};

export const announcementAPI = {
  getAll: () => api.get('/api/admin/announcements'),
  create: (data) => api.post('/api/admin/announcements', data),
  delete: (id) => api.delete(`/api/admin/announcements/${id}`),
};

// ─── Warden API ──────────────────────────────────────────────
export const wardenStudentAPI = {
  getAll: () => api.get('/api/warden/students'),
  updateAttendance: (data) => api.post('/api/warden/attendance', data),
};

export const messAPI = {
  getMenu: () => api.get('/api/warden/mess'),
  updateMenu: (data) => api.put('/api/warden/mess', data),
};

export const expenseAPI = {
  getAll: () => api.get('/api/warden/expenses'),
  create: (data) => api.post('/api/warden/expenses', data),
};

// ─── Student API ─────────────────────────────────────────────
export const leaveAPI = {
  apply: (data) => api.post('/api/student/leave', data),
  getMyLeaves: () => api.get('/api/student/leave'),
};

export const studentComplaintAPI = {
  submit: (data) => api.post('/api/student/complaints', data),
  getMy: () => api.get('/api/student/complaints'),
};

export const studentFeeAPI = {
  getMy: () => api.get('/api/student/fees'),
  pay: (data) => api.post('/api/student/fees/pay', data),
};