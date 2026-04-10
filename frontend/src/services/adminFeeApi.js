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
};

export const studentFeeApi = {
  getFeeStructure: () => api.get('/api/student/fee-structure'),
  
  getMyFee: () => api.get('/api/student/my-fee'),
  
  getFeeDetails: () => api.get('/api/student/fee-details'),
  
  getPaymentHistory: () => api.get('/api/student/payment-history'),
};