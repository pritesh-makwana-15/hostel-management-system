import api from './api';

// ── Admin Student API ─────────────────────────────────────────
// Usage: import { adminStudentApi } from '../services/adminStudentApi'

export const adminStudentApi = {

  // GET /api/admin/students
  // Returns: ApiResponse<StudentResponseDTO[]>
  getAll: () => api.get('/api/admin/students'),

  // GET /api/admin/students/{id}
  // Returns: ApiResponse<StudentResponseDTO>
  getById: (id) => api.get(`/api/admin/students/${id}`),

  // GET /api/admin/students/{id}/profile
  // Returns: ApiResponse<StudentProfileDTO>  ← full joined data
  // Used by: StudentProfile.jsx
  getProfile: (id) => api.get(`/api/admin/students/${id}/profile`),

  // POST /api/admin/students
  // body: RegisterRequest (all student fields)
  // Used by: AddStudent.jsx
  create: (data) => api.post('/api/admin/students', data),

  // PUT /api/admin/students/{id}
  // body: RegisterRequest
  // Used by: EditStudent.jsx
  update: (id, data) => api.put(`/api/admin/students/${id}`, data),

  // PATCH /api/admin/students/{id}/status
  // body: { status: "Active" | "Inactive" | "On Leave" }
  // Used by: StudentProfile.jsx deactivate button
  updateStatus: (id, status) =>
    api.patch(`/api/admin/students/${id}/status`, { status }),

  // POST /api/admin/students/{id}/assign-room
  // body: { hostelBlock, roomType, roomNo, bedNo, roomId }
  // Used by: AssignRoom.jsx
  assignRoom: (id, roomData) =>
    api.post(`/api/admin/students/${id}/assign-room`, roomData),

  // DELETE /api/admin/students/{id}
  delete: (id) => api.delete(`/api/admin/students/${id}`),
};