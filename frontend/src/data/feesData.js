// ─── HMS Fee Management – Dummy Data ────────────────────────────────────────

// Fee Structures
export const feeStructures = [
  { id: 'STR-001', hostelName: 'North Wing Boys',  roomType: 'AC',     monthlyFee: 1200, securityDeposit: 5000, utilities: 150, lateFee: 50,  status: 'Active' },
  { id: 'STR-002', hostelName: 'North Wing Boys',  roomType: 'Non-AC', monthlyFee: 800,  securityDeposit: 3000, utilities: 100, lateFee: 30,  status: 'Active' },
  { id: 'STR-003', hostelName: 'South Wing Girls', roomType: 'AC',     monthlyFee: 1350, securityDeposit: 5500, utilities: 180, lateFee: 60,  status: 'Active' },
  { id: 'STR-004', hostelName: 'South Wing Girls', roomType: 'Non-AC', monthlyFee: 900,  securityDeposit: 3500, utilities: 120, lateFee: 40,  status: 'Inactive' },
  { id: 'STR-005', hostelName: 'Main Block',       roomType: 'AC',     monthlyFee: 1500, securityDeposit: 6000, utilities: 200, lateFee: 75,  status: 'Active' },
];

export const hostelOptions = ['North Wing Boys', 'South Wing Girls', 'Main Block', 'Block A (Premium Boys)', 'Golden Heights'];
export const roomTypeOptions = ['AC', 'Non-AC', 'Sharing', 'Single'];
export const feeCycleOptions = ['Monthly', 'Quarterly', 'Semester'];

// Student Fee Records
export const studentFeeRecords = [
  { id: 'HMS2024001', name: 'John Doe',      avatar: null, room: 'A-101', month: 'March 2024', amount: 8500, dueDate: '10 Mar 2024', status: 'Paid' },
  { id: 'HMS2024045', name: 'Sarah Jenkins', avatar: null, room: 'B-204', month: 'March 2024', amount: 7200, dueDate: '10 Mar 2024', status: 'Pending' },
  { id: 'HMS2024112', name: 'Michael Chen',  avatar: null, room: 'A-302', month: 'March 2024', amount: 8500, dueDate: '10 Mar 2024', status: 'Overdue' },
  { id: 'HMS2024089', name: 'Emily White',   avatar: null, room: 'C-105', month: 'March 2024', amount: 6800, dueDate: '10 Mar 2024', status: 'Paid' },
  { id: 'HMS2024201', name: 'Robert Wilson', avatar: null, room: 'B-112', month: 'March 2024', amount: 7200, dueDate: '10 Mar 2024', status: 'Pending' },
  { id: 'HMS2024033', name: 'Priya Sharma',  avatar: null, room: 'C-210', month: 'March 2024', amount: 8500, dueDate: '10 Mar 2024', status: 'Paid' },
  { id: 'HMS2024077', name: 'David Lee',     avatar: null, room: 'A-109', month: 'March 2024', amount: 7500, dueDate: '10 Mar 2024', status: 'Overdue' },
];

// Payment History / Transactions
export const paymentTransactions = [
  { txnId: 'TXN-88291', name: 'John Doe',      avatar: null, room: 'A-101', amount: 8500,  method: 'UPI',           date: '2024-03-20', status: 'Paid' },
  { txnId: 'TXN-88292', name: 'Emily White',   avatar: null, room: 'B-205', amount: 12000, method: 'Bank Transfer',  date: '2024-03-19', status: 'Failed' },
  { txnId: 'TXN-88293', name: 'Michael Brown', avatar: null, room: 'C-302', amount: 7500,  method: 'Cash',           date: '2024-03-18', status: 'Paid' },
  { txnId: 'TXN-88294', name: 'Sarah Jenkins', avatar: null, room: 'A-105', amount: 8500,  method: 'Card',           date: '2024-03-17', status: 'Refunded' },
  { txnId: 'TXN-88295', name: 'David Lee',     avatar: null, room: 'B-112', amount: 8500,  method: 'UPI',            date: '2024-03-16', status: 'Pending' },
  { txnId: 'TXN-88296', name: 'Priya Sharma',  avatar: null, room: 'C-210', amount: 6800,  method: 'Online',         date: '2024-03-15', status: 'Paid' },
  { txnId: 'TXN-88297', name: 'Robert Wilson', avatar: null, room: 'A-301', amount: 9200,  method: 'UPI',            date: '2024-03-14', status: 'Paid' },
];

// Dashboard – recent payments
export const recentPayments = [
  { name: 'Alex Thompson', avatar: null, room: 'A-204', amount: 1200, method: 'Online', date: '2024-06-12', status: 'Paid' },
  { name: 'Sarah Jenkins', avatar: null, room: 'B-102', amount: 850,  method: 'Cash',   date: '2024-06-11', status: 'Pending' },
  { name: 'Michael Chen',  avatar: null, room: 'A-301', amount: 1200, method: 'Online', date: '2024-06-10', status: 'Paid' },
  { name: 'Emma Wilson',   avatar: null, room: 'C-005', amount: 950,  method: 'Online', date: '2024-06-09', status: 'Failed' },
  { name: 'David Miller',  avatar: null, room: 'B-212', amount: 1100, method: 'Online', date: '2024-06-08', status: 'Paid' },
];

// Monthly chart data
export const monthlyCollectionData = [
  { month: 'Jan', collected: 118000 },
  { month: 'Feb', collected: 132000 },
  { month: 'Mar', collected: 128000 },
  { month: 'Apr', collected: 141000 },
  { month: 'May', collected: 138000 },
  { month: 'Jun', collected: 150000 },
];

// Generate Invoice – student info
export const invoiceStudents = [
  { id: 'HMS-2024-8892', name: 'Arjun Mehta', hostel: 'Golden Heights', block: 'B-Block', room: '304-A (Sharing)', course: 'B.Tech - Computer Science Engineering', monthlyFee: 7000, utilities: 1500 },
  { id: 'HMS-2024-0012', name: 'John Doe',    hostel: 'North Wing',    block: 'A-Block', room: 'A-101 (Sharing)', course: 'BCA - Computer Application',          monthlyFee: 8500, utilities: 1200 },
];