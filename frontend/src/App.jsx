import { Navigate, Routes, Route } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

// Layouts
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Auth Pages
import Login from './pages/Login';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import StudentsList from './pages/admin/students/StudentsList';
import AddStudent from './pages/admin/students/AddStudent';
import EditStudent from './pages/admin/students/EditStudent';
import AssignRoom from './pages/admin/students/AssignRoom';
import StudentProfile from './pages/admin/students/StudentProfile';
import RoomsList from './pages/admin/rooms/RoomsList';
import AddRoom from './pages/admin/rooms/AddRoom';
import EditRoom from './pages/admin/rooms/EditRoom';
import BedAllocation from './pages/admin/rooms/BedAllocation';
import RoomOccupancy from './pages/admin/rooms/RoomOccupancy';

// ── Warden Module ────────────────────────────────────────────
import WardensList from './pages/admin/wardens/WardensList';
import AddWarden from './pages/admin/wardens/AddWarden';
import EditWarden from './pages/admin/wardens/EditWarden';
import AssignBlock from './pages/admin/wardens/AssignBlock';
// ─────────────────────────────────────────────────────────────

// ── Fee Module ───────────────────────────────────────────────
import FeesDashboard     from './pages/admin/fees/FeesDashboard';
import FeeStructure      from './pages/admin/fees/FeeStructure';
import FeeDetails        from './pages/admin/fees/FeeDetails';
import StudentFeeRecords from './pages/admin/fees/StudentFeeRecords';
import GenerateInvoice   from './pages/admin/fees/GenerateInvoice';
import PaymentHistory    from './pages/admin/fees/PaymentHistory';
// ─────────────────────────────────────────────────────────────

// ── Complaint Module ─────────────────────────────────────────
import ComplaintsList    from './pages/admin/complaints/ComplaintsList';
import ComplaintDetails  from './pages/admin/complaints/ComplaintDetails';
import AssignComplaint   from './pages/admin/complaints/AssignComplaint';
import ComplaintResponse from './pages/admin/complaints/ComplaintResponse';
// ─────────────────────────────────────────────────────────────

// ── Announcement Module ──────────────────────────────────────
import AnnouncementsList    from './pages/admin/announcements/AnnouncementsList';
import CreateAnnouncement   from './pages/admin/announcements/CreateAnnouncement';
import EditAnnouncement     from './pages/admin/announcements/EditAnnouncement';
import BroadcastAnnouncement from './pages/admin/announcements/BroadcastAnnouncement';
import NotificationHistory  from './pages/admin/announcements/NotificationHistory';
// ─────────────────────────────────────────────────────────────

import ManageAttendance    from './pages/admin/ManageAttendance';
import ManageAnnouncements from './pages/admin/ManageAnnouncements';
import ManageEmployees     from './pages/admin/ManageEmployees';
import ManageExpenses      from './pages/admin/ManageExpenses';
import ManageCertificates  from './pages/admin/ManageCertificates';

// Warden Pages
import WardenDashboard    from './pages/warden/WardenDashboard';
import WardenAttendance   from './pages/warden/Attendance';
import MessManagement     from './pages/warden/MessManagement';
import WardenComplaints   from './pages/warden/Complaints';
import WardenStudents     from './pages/warden/Students';
import WardenRooms        from './pages/warden/Rooms';
import WardenAnnouncements from './pages/warden/Announcements';

// Student Pages
import StudentDashboard    from './pages/student/StudentDashboard';
import FeePayment          from './pages/student/FeePayment';
import LeaveApplication    from './pages/student/LeaveApplication';
import StudentComplaints   from './pages/student/Complaints';
import StudentRoom         from './pages/student/Room';
import StudentMess         from './pages/student/Mess';
import StudentAnnouncements from './pages/student/Announcements';

// Visitor Pages
import Home        from './pages/visitor/Home';
import VisitorHome from './pages/visitor/VisitorHome';
import Facilities  from './pages/visitor/Facilities';
import Inquiry     from './pages/visitor/Inquiry';

// Import CSS Variables
import './styles/variables.css';

// ─── ProtectedRoute Component ────────────────────────────────
function ProtectedRoute({ children, allowedRole }) {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user?.role !== allowedRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

// ─── Unauthorized Page ───────────────────────────────────────
function UnauthorizedPage() {
  const { user } = useAuth();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', gap: '16px' }}>
      <h1 style={{ fontSize: '2rem' }}>403 — Access Denied</h1>
      <p>You do not have permission to view this page.</p>
      {user && (
        <a href={`/${user.role.toLowerCase()}/dashboard`} style={{ color: '#4f46e5' }}>
          Go to your dashboard
        </a>
      )}
    </div>
  );
}

// ─── App ─────────────────────────────────────────────────────
function App() {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        Loading...
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={
            isAuthenticated
              ? <Navigate to={`/${user.role.toLowerCase()}/dashboard`} replace />
              : <Login />
          }
        />
      </Route>

      {/* Utility Routes */}
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Protected Routes - Admin */}
      <Route
        element={
          <ProtectedRoute allowedRole="ADMIN">
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin/dashboard"                  element={<AdminDashboard />} />

        {/* Students */}
        <Route path="/admin/students"                   element={<StudentsList />} />
        <Route path="/admin/students/add"               element={<AddStudent />} />
        <Route path="/admin/students/edit/:id"          element={<EditStudent />} />
        <Route path="/admin/students/assign/:id"        element={<AssignRoom />} />
        <Route path="/admin/students/profile/:id"       element={<StudentProfile />} />

        {/* Rooms */}
        <Route path="/admin/rooms"                      element={<RoomsList />} />
        <Route path="/admin/rooms/add"                  element={<AddRoom />} />
        <Route path="/admin/rooms/:roomId/edit"         element={<EditRoom />} />
        <Route path="/admin/rooms/:roomId/beds"         element={<BedAllocation />} />
        <Route path="/admin/rooms/occupancy"            element={<RoomOccupancy />} />

        {/* Wardens */}
        <Route path="/admin/wardens"                    element={<WardensList />} />
        <Route path="/admin/wardens/add"                element={<AddWarden />} />
        <Route path="/admin/wardens/:id/edit"           element={<EditWarden />} />
        <Route path="/admin/wardens/:id/assign"         element={<AssignBlock />} />

        {/* Fees */}
        <Route path="/admin/fees"                       element={<FeesDashboard />} />
        <Route path="/admin/fees/structure"             element={<FeeStructure />} />
        <Route path="/admin/fees/structure/new"         element={<FeeDetails />} />
        <Route path="/admin/fees/student-records"       element={<StudentFeeRecords />} />
        <Route path="/admin/fees/generate-invoice"      element={<GenerateInvoice />} />
        <Route path="/admin/fees/payment-history"       element={<PaymentHistory />} />

        {/* ── Complaints Module ── */}
        <Route path="/admin/complaints"                 element={<ComplaintsList />} />
        <Route path="/admin/complaints/:id"             element={<ComplaintDetails />} />
        <Route path="/admin/complaints/:id/assign"      element={<AssignComplaint />} />
        <Route path="/admin/complaints/:id/response"    element={<ComplaintResponse />} />
        {/* ─────────────────────── */}

        {/* ── Announcements Module ── */}
        <Route path="/admin/announcements"                   element={<AnnouncementsList />} />
        <Route path="/admin/announcements/create"            element={<CreateAnnouncement />} />
        <Route path="/admin/announcements/edit/:id"          element={<EditAnnouncement />} />
        <Route path="/admin/announcements/broadcast/:id"     element={<BroadcastAnnouncement />} />
        <Route path="/admin/announcements/history"           element={<NotificationHistory />} />
        {/* ──────────────────────────── */}
        <Route path="/admin/announcements"              element={<ManageAnnouncements />} />
        <Route path="/admin/employees"                  element={<ManageEmployees />} />
        <Route path="/admin/expenses"                   element={<ManageExpenses />} />
        <Route path="/admin/certificates"               element={<ManageCertificates />} />
      </Route>

      {/* Protected Routes - Warden */}
      <Route
        element={
          <ProtectedRoute allowedRole="WARDEN">
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/warden/dashboard"                 element={<WardenDashboard />} />
        <Route path="/warden/attendance"                element={<WardenAttendance />} />
        <Route path="/warden/mess"                      element={<MessManagement />} />
        <Route path="/warden/complaints"                element={<WardenComplaints />} />
        <Route path="/warden/students"                  element={<WardenStudents />} />
        <Route path="/warden/rooms"                     element={<WardenRooms />} />
        <Route path="/warden/announcements"             element={<WardenAnnouncements />} />
      </Route>

      {/* Protected Routes - Student */}
      <Route
        element={
          <ProtectedRoute allowedRole="STUDENT">
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/student/dashboard"                element={<StudentDashboard />} />
        <Route path="/student/fees"                     element={<FeePayment />} />
        <Route path="/student/leave"                    element={<LeaveApplication />} />
        <Route path="/student/complaints"               element={<StudentComplaints />} />
        <Route path="/student/room"                     element={<StudentRoom />} />
        <Route path="/student/mess"                     element={<StudentMess />} />
        <Route path="/student/announcements"            element={<StudentAnnouncements />} />
      </Route>

      {/* Public Routes - Visitor */}
      <Route element={<AuthLayout />}>
        <Route path="/visitor"                          element={<VisitorHome />} />
        <Route path="/visitor/facilities"               element={<Facilities />} />
        <Route path="/visitor/inquiry"                  element={<Inquiry />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;