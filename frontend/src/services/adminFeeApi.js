import api from './api';

export const feeStructureApi = {
  healthCheck: () => api.get('/api/admin/fee-structures/health'),
  
  getAll: () => api.get('/api/admin/fee-structures'),
  
  getById: (id) => api.get(`/api/admin/fee-structures/${id}`),
  
  create: (data) => {
    console.log('Creating fee structure with:', data);
    return api.post('/api/admin/fee-structures', data);
  },
  
  update: (id, data) => api.put(`/api/admin/fee-structures/${id}`, data),
  
  delete: (id) => api.delete(`/api/admin/fee-structures/${id}`),
  
  getByBlock: (hostelBlock) => api.get(`/api/admin/fee-structures/block/${hostelBlock}`),
  
  getByRoomType: (roomType) => api.get(`/api/admin/fee-structures/room-type/${roomType}`),

  exists: (hostelBlock, roomType, excludeId = null) =>
    api.get('/api/admin/fee-structures/exists', {
      params: { hostelBlock, roomType, ...(excludeId !== null ? { excludeId } : {}) }
    }),
};

export const studentFeeApi = {
  getFeeStructure: () => api.get('/api/student/fee-structure'),
  
  getMyFee: () => api.get('/api/student/my-fee'),

  getMyRecord: (academicCycle) =>
    api.get('/api/student/fees', {
      params: academicCycle ? { academicCycle } : {},
    }),

  submitPayment: (data) => api.post('/api/student/fees/pay', data),

  getPayments: () => api.get('/api/student/fees/payments'),

  getPaymentById: (paymentId) => api.get(`/api/student/fees/payments/${paymentId}`),
  
  getFeeDetails: () => api.get('/api/student/fee-details'),
  
  getPaymentHistory: () => api.get('/api/student/payment-history'),
};

export const adminFeesApi = {
  getAllRecords: () => api.get('/api/admin/fees'),
  getStudentRecords: (studentId) => api.get(`/api/admin/fees/student/${studentId}`),
  getStudentPayments: (studentId) => api.get(`/api/admin/fees/student/${studentId}/payments`),
  getAllPayments: () => api.get('/api/admin/fees/payments'),
  verifyPayment: (paymentId, notes) =>
    api.put(`/api/admin/fees/payments/${paymentId}/verify`, { notes }),
  rejectPayment: (paymentId, notes) =>
    api.put(`/api/admin/fees/payments/${paymentId}/reject`, { notes }),
};