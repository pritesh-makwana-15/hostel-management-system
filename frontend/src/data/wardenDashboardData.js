import {
  Users,
  Building2,
  MessageSquare,
  Megaphone,
  Bell,
  ClipboardList,
  UserPlus,
} from 'lucide-react';

export const stats = [
  {
    id: 1,
    title: 'Students Under Warden',
    value: '128',
    description: '+2 from last month',
    icon: Users,
    iconBg: '#E3F2FD',
    iconColor: '#1F3C88',
  },
  {
    id: 2,
    title: 'Rooms Managed',
    value: '24',
    description: '4 vacancies remaining',
    icon: Building2,
    iconBg: '#E0F2F1',
    iconColor: '#2BBBAD',
  },
  {
    id: 3,
    title: 'Pending Complaints',
    value: '6',
    description: '2 urgent escalations',
    icon: MessageSquare,
    iconBg: '#FFF3E0',
    iconColor: '#FB8C00',
  },
  {
    id: 4,
    title: 'Announcements',
    value: '3',
    description: 'Last sent 2 hours ago',
    icon: Megaphone,
    iconBg: '#F3E5F5',
    iconColor: '#1F3C88',
  },
];

export const quickActions = [
  { id: 1, label: 'New Announcement', icon: Megaphone },
  { id: 2, label: 'View Complaints', icon: ClipboardList },
  { id: 3, label: 'Register Student', icon: UserPlus },
  { id: 4, label: 'Send Notifications', icon: Bell },
];

export const complaints = [
  {
    id: 1,
    studentName: 'Anya Sharma',
    title: 'Water Leak in Room 101 Bathroom',
    room: 'Room 101',
    status: 'Pending',
    time: '10 mins ago',
  },
  {
    id: 2,
    studentName: 'Rohit Kumar',
    title: 'Wi-Fi connectivity issues on 2nd floor',
    room: 'Room 205',
    status: 'In Progress',
    time: '1 hour ago',
  },
  {
    id: 3,
    studentName: 'Priya Patel',
    title: 'Broken ceiling fan in Room 304',
    room: 'Room 304',
    status: 'Pending',
    time: '3 hours ago',
  },
  {
    id: 4,
    studentName: 'Siddharth V.',
    title: 'Laundry service delay complaint',
    room: 'Room 210',
    status: 'In Progress',
    time: 'Yesterday',
  },
  {
    id: 5,
    studentName: 'Meera K.',
    title: 'Noise complaint regarding Room 112',
    room: 'Room 112',
    status: 'Pending',
    time: 'Yesterday',
  },
];

export const alerts = [
  {
    id: 1,
    message: 'Maintenance schedule for Block B finalized for tomorrow.',
    time: '2:15 PM',
    active: true,
  },
  {
    id: 2,
    message: "Student 'Vikram Singh' late entry logged (11:45 PM).",
    time: '11:50 PM',
    active: true,
  },
  {
    id: 3,
    message: 'Monthly mess bill for April has been generated.',
    time: 'Yesterday',
    active: false,
  },
  {
    id: 4,
    message: 'Emergency drill completed successfully on 24th March.',
    time: '2 days ago',
    active: false,
  },
];

export const activities = [
  {
    id: 1,
    type: 'Fee Payment',
    description: 'John Doe paid monthly mess and hostel fee for April.',
    dateTime: '2024-03-20 14:30',
    status: 'Completed',
  },
  {
    id: 2,
    type: 'Room Allocation',
    description: 'Room 105 assigned to transfer student Jane Smith.',
    dateTime: '2024-03-19 10:00',
    status: 'Completed',
  },
  {
    id: 3,
    type: 'Complaint Logged',
    description: 'Water leak reported in Room 201 by Student Anya.',
    dateTime: '2024-03-18 16:45',
    status: 'Pending',
  },
  {
    id: 4,
    type: 'Student Admission',
    description: 'New student David Lee admitted and verified.',
    dateTime: '2024-03-17 09:15',
    status: 'Completed',
  },
  {
    id: 5,
    type: 'Announcement Sent',
    description: 'Holiday notice sent to all students via SMS/Email.',
    dateTime: '2024-03-16 11:00',
    status: 'Completed',
  },
];