import { 
  Users, Building2, Bed, BedDouble, Briefcase, IndianRupee,
  UserPlus, Home, UserCheck, CreditCard, Megaphone, MessageSquare
} from 'lucide-react';

export const dashboardData = {
  stats: [
    {
      id: 1,
      title: 'Total Students',
      value: '1,200',
      description: '10% increase',
      icon: Users,
      iconBg: '#E3F2FD',
      iconColor: '#1976D2'
    },
    {
      id: 2,
      title: 'Total Rooms',
      value: '150',
      description: 'All Available',
      icon: Building2,
      iconBg: '#E0F2F1',
      iconColor: '#00897B'
    },
    {
      id: 3,
      title: 'Occupied Beds',
      value: '450 / 500',
      description: '90% Occupancy',
      icon: Bed,
      iconBg: '#FFF3E0',
      iconColor: '#FB8C00'
    },
    {
      id: 4,
      title: 'Available Beds',
      value: '50',
      description: 'Book Now',
      icon: BedDouble,
      iconBg: '#F3E5F5',
      iconColor: '#8E24AA'
    },
    {
      id: 5,
      title: 'Total Wardens',
      value: '15',
      description: 'All Active',
      icon: Briefcase,
      iconBg: '#E8F5E9',
      iconColor: '#43A047'
    },
    {
      id: 6,
      title: 'Monthly Fee Collection',
      value: '₹1.5M',
      description: 'Up 5% from last month',
      icon: IndianRupee,
      iconBg: '#FFF9C4',
      iconColor: '#F57F17'
    }
  ],
  
  quickActions: [
    { id: 1, label: 'Add Student', icon: UserPlus, color: '#1F3C88' },
    { id: 2, label: 'Add Room', icon: Home, color: '#2BBBAD' },
    { id: 3, label: 'Add Warden', icon: UserCheck, color: '#1F3C88' },
    { id: 4, label: 'Collect Fee', icon: CreditCard, color: '#2BBBAD' },
    { id: 5, label: 'New Announcement', icon: Megaphone, color: '#1F3C88' },
    { id: 6, label: 'View Complaints', icon: MessageSquare, color: '#EF4444' }
  ],
  
  pendingComplaints: [
    {
      id: 1,
      title: 'Water Leak in Room 101',
      student: 'John Doe',
      status: 'High',
      statusColor: '#EF4444'
    },
    {
      id: 2,
      title: 'Fan Not Working Room 205',
      student: 'Jane Smith',
      status: 'Medium',
      statusColor: '#F59E0B'
    },
    {
      id: 3,
      title: 'Food Quality Issue',
      student: 'David Lee',
      status: 'Low',
      statusColor: '#10B981'
    }
  ],
  
  pendingFees: [
    { 
      id: 1, 
      student: 'John Doe', 
      amount: '₹12,000', 
      status: 'Overdue', 
      statusColor: '#EF4444' 
    },
    { 
      id: 2, 
      student: 'Emily White', 
      amount: '₹8,000', 
      status: 'Due Soon', 
      statusColor: '#F59E0B' 
    },
    { 
      id: 3, 
      student: 'Michael Brown', 
      amount: '₹15,000', 
      status: 'Pending', 
      statusColor: '#6B7280' 
    }
  ],
  
  monthlyFeeData: [
    { month: 'Jan', value: 850000 },
    { month: 'Feb', value: 1275000 },
    { month: 'Mar', value: 1400000 },
    { month: 'Apr', value: 1350000 },
    { month: 'May', value: 1600000 },
    { month: 'Jun', value: 1700000 }
  ],
  
  recentActivity: [
    {
      id: 1,
      type: 'Fee Payment',
      description: 'John Doe paid monthly fee',
      dateTime: '2024-03-20 14:30',
      status: 'Completed',
      statusColor: '#10B981'
    },
    {
      id: 2,
      type: 'Room Allocation',
      description: 'Room 105 assigned to Jane Smith',
      dateTime: '2024-03-19 10:00',
      status: 'Completed',
      statusColor: '#10B981'
    },
    {
      id: 3,
      type: 'Complaint Logged',
      description: 'Water leak reported in Room 201',
      dateTime: '2024-03-18 16:45',
      status: 'Pending',
      statusColor: '#F59E0B'
    },
    {
      id: 4,
      type: 'Student Admission',
      description: 'New student David Lee admitted',
      dateTime: '2024-03-17 09:15',
      status: 'Completed',
      statusColor: '#10B981'
    },
    {
      id: 5,
      type: 'Announcement Sent',
      description: 'Holiday notice sent to all students',
      dateTime: '2024-03-16 11:00',
      status: 'Completed',
      statusColor: '#10B981'
    }
  ]
};