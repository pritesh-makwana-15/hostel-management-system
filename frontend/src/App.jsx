import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
// import { useAuth } from './hooks/useAuth';

// Layouts
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Auth Pages
import Login from './pages/Login';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageStudents from './pages/admin/ManageStudents';
import ManageWardens from './pages/admin/ManageWardens';
import ManageRooms from './pages/admin/ManageRooms';
import ManageFees from './pages/admin/ManageFees';
import ManageComplaints from './pages/admin/ManageComplaints';
import ManageAttendance from './pages/admin/ManageAttendance';
import ManageAnnouncements from './pages/admin/ManageAnnouncements';
import ManageEmployees from './pages/admin/ManageEmployees';
import ManageExpenses from './pages/admin/ManageExpenses';
import ManageCertificates from './pages/admin/ManageCertificates';

// Warden Pages
import WardenDashboard from './pages/warden/WardenDashboard';
import WardenAttendance from './pages/warden/Attendance';
import MessManagement from './pages/warden/MessManagement';
import WardenComplaints from './pages/warden/Complaints';
import WardenStudents from './pages/warden/Students';
import WardenRooms from './pages/warden/Rooms';
import WardenAnnouncements from './pages/warden/Announcements';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import FeePayment from './pages/student/FeePayment';
import LeaveApplication from './pages/student/LeaveApplication';
import StudentComplaints from './pages/student/Complaints';
import StudentRoom from './pages/student/Room';
import StudentMess from './pages/student/Mess';
import StudentAnnouncements from './pages/student/Announcements';

// Visitor Pages
import Home from './pages/visitor/Home';
import VisitorHome from './pages/visitor/VisitorHome';
import Facilities from './pages/visitor/Facilities';
import Inquiry from './pages/visitor/Inquiry';

// Import CSS Variables
import './styles/variables.css';

function App() {
  // Uncomment when useAuth is implemented
  // const { user } = useAuth();
  
  // Temporary: For development without auth
  const user = null; // Set to { role: 'admin' } or { role: 'warden' } or { role: 'student' } for testing

  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Route>

      {/* Protected Routes - Admin */}
      <Route element={<DashboardLayout />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/students" element={<ManageStudents />} />
        <Route path="/admin/wardens" element={<ManageWardens />} />
        <Route path="/admin/rooms" element={<ManageRooms />} />
        <Route path="/admin/fees" element={<ManageFees />} />
        <Route path="/admin/complaints" element={<ManageComplaints />} />
        <Route path="/admin/attendance" element={<ManageAttendance />} />
        <Route path="/admin/announcements" element={<ManageAnnouncements />} />
        <Route path="/admin/employees" element={<ManageEmployees />} />
        <Route path="/admin/expenses" element={<ManageExpenses />} />
        <Route path="/admin/certificates" element={<ManageCertificates />} />
      </Route>

      {/* Protected Routes - Warden */}
      <Route element={<DashboardLayout />}>
        <Route path="/warden/dashboard" element={<WardenDashboard />} />
        <Route path="/warden/attendance" element={<WardenAttendance />} />
        <Route path="/warden/mess" element={<MessManagement />} />
        <Route path="/warden/complaints" element={<WardenComplaints />} />
        <Route path="/warden/students" element={<WardenStudents />} />
        <Route path="/warden/rooms" element={<WardenRooms />} />
        <Route path="/warden/announcements" element={<WardenAnnouncements />} />
      </Route>

      {/* Protected Routes - Student */}
      <Route element={<DashboardLayout />}>
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/fees" element={<FeePayment />} />
        <Route path="/student/leave" element={<LeaveApplication />} />
        <Route path="/student/complaints" element={<StudentComplaints />} />
        <Route path="/student/room" element={<StudentRoom />} />
        <Route path="/student/mess" element={<StudentMess />} />
        <Route path="/student/announcements" element={<StudentAnnouncements />} />
      </Route>

      {/* Public Routes - Visitor */}
      <Route element={<AuthLayout />}>
        <Route path="/visitor" element={<VisitorHome />} />
        <Route path="/visitor/facilities" element={<Facilities />} />
        <Route path="/visitor/inquiry" element={<Inquiry />} />
      </Route>

      {/* Default Redirects */}
      <Route
        path="/"
        element={
          user ? <Navigate to={`/${user.role}/dashboard`} /> : <Navigate to="/login" />
        }
      />
      <Route path="*" element={<Navigate to="/admin/dashboard" />} />
    </Routes>
  );
}

export default App;