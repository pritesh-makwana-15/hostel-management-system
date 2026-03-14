// src/data/wardensData.js

export const wardensData = [
  {
    id: 'W-001',
    name: 'John Doe',
    email: 'john.doe@hms.com',
    phone: '+1 234-567-8901',
    gender: 'Male',
    dateOfJoining: '2022-06-01',
    hostel: 'Lakeside Hostel',
    block: 'Block A',
    status: 'Active',
    username: 'john.doe.warden',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    address: '12, Elm Street, New York - 10001',
  },
  {
    id: 'W-002',
    name: 'Sarah Wilson',
    email: 'sarah.w@hms.com',
    phone: '+1 234-567-8902',
    gender: 'Female',
    dateOfJoining: '2021-03-15',
    hostel: 'Mountain View',
    block: 'Block B',
    status: 'Active',
    username: 'sarah.wilson.warden',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    address: '45, Oak Avenue, Los Angeles - 90001',
  },
  {
    id: 'W-003',
    name: 'Michael Chen',
    email: 'm.chen@hms.com',
    phone: '+1 234-567-8903',
    gender: 'Male',
    dateOfJoining: '2020-09-10',
    hostel: 'Lakeside Hostel',
    block: 'Block C',
    status: 'Inactive',
    username: 'michael.chen.warden',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
    address: '78, Pine Road, Chicago - 60601',
  },
  {
    id: 'W-004',
    name: 'Emily Davis',
    email: 'emily.d@hms.com',
    phone: '+1 234-567-8904',
    gender: 'Female',
    dateOfJoining: '2023-01-20',
    hostel: 'Green Valley',
    block: 'Block A',
    status: 'Active',
    username: 'emily.davis.warden',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
    address: '90, Maple Lane, Houston - 77001',
  },
  {
    id: 'W-005',
    name: 'Robert Miller',
    email: 'r.miller@hms.com',
    phone: '+1 234-567-8905',
    gender: 'Male',
    dateOfJoining: '2022-11-05',
    hostel: 'City Center',
    block: 'Block D',
    status: 'Active',
    username: 'robert.miller.warden',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Robert',
    address: '33, Cedar Blvd, Phoenix - 85001',
  },
  {
    id: 'W-006',
    name: 'Priya Patel',
    email: 'priya.p@hms.com',
    phone: '+1 234-567-8906',
    gender: 'Female',
    dateOfJoining: '2023-07-12',
    hostel: 'North Campus',
    block: 'Block B',
    status: 'Active',
    username: 'priya.patel.warden',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
    address: '56, Birch Street, Philadelphia - 19101',
  },
  {
    id: 'W-007',
    name: 'David Kim',
    email: 'd.kim@hms.com',
    phone: '+1 234-567-8907',
    gender: 'Male',
    dateOfJoining: '2021-08-30',
    hostel: 'South Block',
    block: 'Block C',
    status: 'Inactive',
    username: 'david.kim.warden',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    address: '21, Walnut Drive, San Antonio - 78201',
  },
];

// Hostel options
export const hostelOptions = [
  { id: 'lakeside', name: 'Lakeside Hostel' },
  { id: 'mountain', name: 'Mountain View' },
  { id: 'greenvalley', name: 'Green Valley' },
  { id: 'citycenter', name: 'City Center' },
  { id: 'northcampus', name: 'North Campus' },
  { id: 'southblock', name: 'South Block' },
];

// Block options
export const blockOptions = [
  { id: 'block-a', name: 'Block A' },
  { id: 'block-b', name: 'Block B' },
  { id: 'block-c', name: 'Block C' },
  { id: 'block-d', name: 'Block D' },
  { id: 'block-e', name: 'Block E' },
];

// Status options
export const wardenStatusOptions = [
  { id: 'active', name: 'Active', color: '#10B981' },
  { id: 'inactive', name: 'Inactive', color: '#6B7280' },
];

// Gender options
export const genderOptions = [
  { id: 'male', name: 'Male' },
  { id: 'female', name: 'Female' },
  { id: 'other', name: 'Other' },
];

// Stats
export const wardenStats = {
  totalWardens: 24,
  activeWardens: 21,
  assignedBlocks: 18,
  pendingComplaints: 9,
};

// Helper functions
export const getWardenById = (id) => wardensData.find((w) => w.id === id);