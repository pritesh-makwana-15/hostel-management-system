import api from './api';

// ── Admin Room API Service ────────────────────────────────────
// Base URL: /api/admin/rooms (secured by JWT + ADMIN role)

export const adminRoomApi = {

  // GET /api/admin/rooms — fetch all rooms
  getAll: () => api.get('/api/admin/rooms'),

  // GET /api/admin/rooms/:id — fetch single room with beds
  getById: (id) => api.get(`/api/admin/rooms/${id}`),

  // POST /api/admin/rooms — create room (beds auto-created)
  create: (data) => api.post('/api/admin/rooms', data),

  // PUT /api/admin/rooms/:id — update room + adjust beds
  update: (id, data) => api.put(`/api/admin/rooms/${id}`, data),

  // Get unique hostel blocks from rooms
  getHostelBlocks: async () => {
    const response = await api.get('/api/admin/rooms/blocks');
    const blocks = response.data.data || [];
    
    return blocks.map(block => ({
      id: block.toLowerCase().replace(/\s+/g, '-'),
      name: block
    }));
  },

  // Get room numbers for specific hostel block
  getRoomsByHostel: async (hostelBlock) => {
    const response = await api.get('/api/admin/rooms');
    const rooms = response.data.data || [];
    
    // Filter rooms by hostel block
    const filteredRooms = rooms.filter(room => room.hostelBlock === hostelBlock);
    
    return filteredRooms.map(room => ({
      id: room.id,
      name: room.roomNumber,
      roomType: room.roomType,
      totalBeds: room.totalBeds
    }));
  }
};
