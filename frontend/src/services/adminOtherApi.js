import api from './api';

// ── Admin Fee API ─────────────────────────────────────────────
export const adminFeeApi = {
  getAll:       ()        => api.get('/api/admin/fees'),
  getByStudent: (id)      => api.get(`/api/admin/fees/student/${id}`),
  create:       (data)    => api.post('/api/admin/fees', data),
  update:       (id,data) => api.put(`/api/admin/fees/${id}`, data),
};

// ── Admin Complaint API ───────────────────────────────────────
export const adminComplaintApi = {
  getAll:   ()          => api.get('/api/admin/complaints'),
  getById:  (id)        => api.get(`/api/admin/complaints/${id}`),
  resolve:  (id, data)  => api.put(`/api/admin/complaints/${id}/resolve`, data),
  assign:   (id, data)  => api.put(`/api/admin/complaints/${id}/assign`, data),
};

// ── Admin Announcement API ────────────────────────────────────
export const adminAnnouncementApi = {
  getAll:  ()      => api.get('/api/admin/announcements'),
  create:  (data)  => api.post('/api/admin/announcements', data),
  update:  (id,d)  => api.put(`/api/admin/announcements/${id}`, d),
  delete:  (id)    => api.delete(`/api/admin/announcements/${id}`),
};

// ── Admin Attendance API ──────────────────────────────────────
export const adminAttendanceApi = {
  getAll: () => api.get('/api/admin/attendance'),
};

// ── Warden APIs ───────────────────────────────────────────────
export const wardenStudentApi = {
  getAll:           ()     => api.get('/api/warden/students'),
  updateAttendance: (data) => api.post('/api/warden/attendance', data),
};

export const messApi = {
  getMenu:    ()     => api.get('/api/warden/mess'),
  updateMenu: (data) => api.put('/api/warden/mess', data),
};

export const expenseApi = {
  getAll:  ()     => api.get('/api/warden/expenses'),
  create:  (data) => api.post('/api/warden/expenses', data),
};

// ── Student APIs ──────────────────────────────────────────────
export const leaveApi = {
  apply:      (data) => api.post('/api/student/leave', data),
  getMyLeaves: ()    => api.get('/api/student/leave'),
};

export const studentComplaintApi = {
  submit: (data) => api.post('/api/student/complaints', data),
  getMy:  ()     => api.get('/api/student/complaints'),
};

export const studentFeeApi = {
  getMy: ()     => api.get('/api/student/fees'),
  request: (data) => api.post('/api/student/fees/request', data),
  pay:   (data) => api.post('/api/student/fees/request', data),
};