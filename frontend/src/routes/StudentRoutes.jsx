import { Route } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import DashboardLayout from '../layouts/DashboardLayout';

// ── Student Pages ─────────────────────────────────────────────
import StudentDashboard     from '../pages/student/dashboard/StudentDashboard';
import FeePayment           from '../pages/student/FeePayment';
import LeaveApplication     from '../pages/student/LeaveApplication';
import StudentComplaints    from '../pages/student/Complaints';
import StudentRoom          from '../pages/student/Room';
import StudentMess          from '../pages/student/Mess';
import StudentAnnouncements from '../pages/student/Announcements';

// ── Student Profile Module ────────────────────────────────────
import StudentProfile  from '../pages/student/profile/StudentProfile';
import EditProfile     from '../pages/student/profile/EditProfile';
import ChangePassword  from '../pages/student/profile/ChangePassword';
// ─────────────────────────────────────────────────────────────

function StudentRoutes() {
  return (
    <Route
      element={
        <ProtectedRoute allowedRole="STUDENT">
          <DashboardLayout />
        </ProtectedRoute>
      }
    >
      {/* ── Dashboard ── */}
      <Route path="/student/dashboard"     element={<StudentDashboard />} />

      {/* ── Core Modules ── */}
      <Route path="/student/fees"          element={<FeePayment />} />
      <Route path="/student/complaints"    element={<StudentComplaints />} />
      <Route path="/student/room"          element={<StudentRoom />} />
      <Route path="/student/announcements" element={<StudentAnnouncements />} />
      {/* <Route path="/student/leave"         element={<LeaveApplication />} /> */}
      {/* <Route path="/student/mess"          element={<StudentMess />} /> */}

      {/* ── Profile Module ── */}
      <Route path="/student/profile"                   element={<StudentProfile />} />
      <Route path="/student/profile/edit"              element={<EditProfile />} />
      <Route path="/student/profile/change-password"   element={<ChangePassword />} />
    </Route>
  );
}

export default StudentRoutes;