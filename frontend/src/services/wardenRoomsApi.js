import api from './api';

export const wardenRoomsApi = {
  // GET /api/warden/rooms
  getAll: () => api.get('/api/warden/rooms'),

  // GET /api/warden/rooms/{roomId}
  // roomId is "R001" in the UI
  getById: (roomId) => api.get(`/api/warden/rooms/${roomId}`),

  // POST /api/warden/rooms/{roomId}/assign
  assign: (roomId, { studentId, bedNo }) =>
    api.post(`/api/warden/rooms/${roomId}/assign`, { studentId, bedNo }),
};

