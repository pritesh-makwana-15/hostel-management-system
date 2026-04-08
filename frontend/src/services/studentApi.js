import api from './api';

// ── Student API ───────────────────────────────────────────────
// Usage: import { studentApi } from '../services/studentApi'

// Student API endpoints for student-specific operations
export const studentApi = {

  // GET /api/student/profile
  // Returns: ApiResponse<StudentProfileDTO>
  // Used by: StudentProfile.jsx
  getProfile: () => api.get('/api/student/profile'),

  // PUT /api/student/profile
  // body: { name, phone }
  // Used by: StudentProfile.jsx
  updateProfile: (data) => api.put('/api/student/profile', data),

  // POST /api/student/change-password
  // body: { currentPassword, newPassword }
  // Used by: ChangePassword.jsx
  changePassword: (data) => api.post('/api/student/change-password', data),

  // GET /api/student/payment-history
  // Returns: ApiResponse<StudentProfileDTO> (contains payment data)
  // Used by: StudentProfile.jsx
  getPaymentHistory: () => api.get('/api/student/payment-history'),

  // GET /api/student/complaints
  // Returns: ApiResponse<StudentProfileDTO> (contains complaint data)
  // Used by: StudentProfile.jsx
  getComplaints: () => api.get('/api/student/complaints'),

  // POST /api/student/complaints
  // body: { category, description }
  // Used by: NewTicket.jsx
  createComplaint: (data) => api.post('/api/student/complaints', data),

  // POST /api/student/logout-all
  // Used by: StudentProfile.jsx
  logoutAllDevices: () => api.post('/api/student/logout-all'),
};
