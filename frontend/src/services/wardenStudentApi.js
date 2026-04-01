import api from './api';

// ── Warden Student API ─────────────────────────────────────────
// Usage: import { wardenStudentApi } from '../services/wardenStudentApi'

export const wardenStudentApi = {

  // GET /api/warden/students
  // Returns: ApiResponse<StudentResponseDTO[]>
  getAll: () => api.get('/api/warden/students'),

  // GET /api/warden/students/{id}
  // Returns: ApiResponse<StudentResponseDTO>
  getById: (id) => api.get(`/api/warden/students/${id}`),

  // GET /api/warden/students/{id}/profile
  // Returns: ApiResponse<StudentProfileDTO>  ← full joined data
  // Used by: StudentProfile.jsx
  getProfile: (id) => api.get(`/api/warden/students/${id}/profile`),

  // PUT /api/warden/students/{id}
  // body: RegisterRequest
  // Used by: EditStudent.jsx
  update: (id, data) => api.put(`/api/warden/students/${id}`, data),

  // PATCH /api/warden/students/{id}/status
  // body: { status: "Active" | "Inactive" | "On Leave" }
  // Used by: StudentProfile.jsx deactivate button
  updateStatus: (id, status) =>
    api.patch(`/api/warden/students/${id}/status`, { status }),
};