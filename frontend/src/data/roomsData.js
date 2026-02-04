// src/data/roomsData.js

export const roomsData = [
  {
    id: 'R001',
    blockHostel: 'Block A',
    roomNumber: '101',
    roomType: 'AC',
    floor: '1st',
    totalBeds: 4,
    occupiedBeds: 3,
    availableBeds: 1,
    occupancyStatus: 'Partially Occupied',
    description: 'Standard AC room with two beds and an attached washroom. Recently renovated.',
    beds: [
      { id: 'B1', status: 'Occupied', studentName: 'John Doe', enrollment: 'S101' },
      { id: 'B2', status: 'Occupied', studentName: 'Jane Smith', enrollment: 'S102' },
      { id: 'B3', status: 'Occupied', studentName: 'Mike Johnson', enrollment: 'S103' },
      { id: 'B4', status: 'Available', studentName: null, enrollment: null }
    ]
  },
  {
    id: 'R002',
    blockHostel: 'Block A',
    roomNumber: '102',
    roomType: 'Non-AC',
    floor: '1st',
    totalBeds: 3,
    occupiedBeds: 0,
    availableBeds: 3,
    occupancyStatus: 'Available',
    description: 'Non-AC room with good ventilation.',
    beds: [
      { id: 'B1', status: 'Available', studentName: null, enrollment: null },
      { id: 'B2', status: 'Available', studentName: null, enrollment: null },
      { id: 'B3', status: 'Available', studentName: null, enrollment: null }
    ]
  },
  {
    id: 'R003',
    blockHostel: 'Block B',
    roomNumber: '201',
    roomType: 'AC',
    floor: '2nd',
    totalBeds: 2,
    occupiedBeds: 2,
    availableBeds: 0,
    occupancyStatus: 'Fully Occupied',
    description: 'Compact AC room for two students.',
    beds: [
      { id: 'B1', status: 'Occupied', studentName: 'Rohan Sharma', enrollment: 'S202301' },
      { id: 'B2', status: 'Occupied', studentName: 'Priya Singh', enrollment: 'S202305' }
    ]
  },
  {
    id: 'R004',
    blockHostel: 'Block B',
    roomNumber: '202',
    roomType: 'Non-AC',
    floor: '2nd',
    totalBeds: 4,
    occupiedBeds: 1,
    availableBeds: 3,
    occupancyStatus: 'Partially Occupied',
    description: 'Spacious non-AC room.',
    beds: [
      { id: 'B1', status: 'Occupied', studentName: 'Amit Patel', enrollment: 'S204' },
      { id: 'B2', status: 'Available', studentName: null, enrollment: null },
      { id: 'B3', status: 'Available', studentName: null, enrollment: null },
      { id: 'B4', status: 'Available', studentName: null, enrollment: null }
    ]
  },
  {
    id: 'R005',
    blockHostel: 'Block C',
    roomNumber: '301',
    roomType: 'AC',
    floor: '3rd',
    totalBeds: 6,
    occupiedBeds: 6,
    availableBeds: 0,
    occupancyStatus: 'Fully Occupied',
    description: 'Large AC room with six beds.',
    beds: [
      { id: 'B1', status: 'Occupied', studentName: 'Raj Kumar', enrollment: 'S301' },
      { id: 'B2', status: 'Occupied', studentName: 'Sneha Reddy', enrollment: 'S302' },
      { id: 'B3', status: 'Occupied', studentName: 'Vikram Singh', enrollment: 'S303' },
      { id: 'B4', status: 'Occupied', studentName: 'Pooja Sharma', enrollment: 'S304' },
      { id: 'B5', status: 'Occupied', studentName: 'Karan Mehta', enrollment: 'S305' },
      { id: 'B6', status: 'Occupied', studentName: 'Anjali Gupta', enrollment: 'S306' }
    ]
  },
  {
    id: 'R006',
    blockHostel: 'Block C',
    roomNumber: '302',
    roomType: 'Non-AC',
    floor: '3rd',
    totalBeds: 5,
    occupiedBeds: 0,
    availableBeds: 5,
    occupancyStatus: 'Available',
    description: 'Non-AC room available for allocation.',
    beds: [
      { id: 'B1', status: 'Available', studentName: null, enrollment: null },
      { id: 'B2', status: 'Available', studentName: null, enrollment: null },
      { id: 'B3', status: 'Available', studentName: null, enrollment: null },
      { id: 'B4', status: 'Available', studentName: null, enrollment: null },
      { id: 'B5', status: 'Available', studentName: null, enrollment: null }
    ]
  },
  {
    id: 'R007',
    blockHostel: 'Block D',
    roomNumber: '401',
    roomType: 'AC',
    floor: '4th',
    totalBeds: 4,
    occupiedBeds: 4,
    availableBeds: 0,
    occupancyStatus: 'Fully Occupied',
    description: 'Premium AC room on 4th floor.',
    beds: [
      { id: 'B1', status: 'Occupied', studentName: 'Arjun Nair', enrollment: 'S401' },
      { id: 'B2', status: 'Occupied', studentName: 'Divya Iyer', enrollment: 'S402' },
      { id: 'B3', status: 'Occupied', studentName: 'Rahul Verma', enrollment: 'S403' },
      { id: 'B4', status: 'Occupied', studentName: 'Neha Das', enrollment: 'S404' }
    ]
  }
];

// Hostel Blocks for filters
export const hostelBlocks = [
  { id: 'block-a', name: 'Block A', totalRooms: 50 },
  { id: 'block-b', name: 'Block B', totalRooms: 45 },
  { id: 'block-c', name: 'Block C', totalRooms: 40 },
  { id: 'block-d', name: 'Block D', totalRooms: 35 }
];

// Room Types
export const roomTypes = [
  { id: 'ac', name: 'AC' },
  { id: 'non-ac', name: 'Non-AC' }
];

// Occupancy Status Options
export const occupancyStatusOptions = [
  { id: 'available', name: 'Available', color: '#10B981' },
  { id: 'partially-occupied', name: 'Partially Occupied', color: '#F59E0B' },
  { id: 'fully-occupied', name: 'Fully Occupied', color: '#EF4444' }
];

// Bed Status Options
export const bedStatusOptions = [
  { id: 'available', name: 'Available' },
  { id: 'occupied', name: 'Occupied' },
  { id: 'maintenance', name: 'Maintenance' }
];

// Helper Functions
export const getRoomById = (roomId) => {
  return roomsData.find(room => room.id === roomId);
};

export const getAvailableRooms = () => {
  return roomsData.filter(room => room.availableBeds > 0);
};

export const getTotalStats = () => {
  const totalRooms = roomsData.length;
  const totalBeds = roomsData.reduce((sum, room) => sum + room.totalBeds, 0);
  const occupiedBeds = roomsData.reduce((sum, room) => sum + room.occupiedBeds, 0);
  const availableBeds = roomsData.reduce((sum, room) => sum + room.availableBeds, 0);
  
  return {
    totalRooms,
    totalBeds,
    occupiedBeds,
    availableBeds
  };
};

export const getOccupancyColor = (occupiedBeds, totalBeds) => {
  const percentage = (occupiedBeds / totalBeds) * 100;
  if (percentage === 0) return '#10B981'; // Green - Available
  if (percentage === 100) return '#EF4444'; // Red - Full
  return '#3B82F6'; // Blue - Partial
};

export const getOccupancyPercentage = (occupiedBeds, totalBeds) => {
  return Math.round((occupiedBeds / totalBeds) * 100);
};