import { Route } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import DashboardLayout from '../layouts/DashboardLayout';

// ── Student Pages ─────────────────────────────────────────────
import StudentDashboard     from '../pages/student/StudentDashboard';
import FeePayment           from '../pages/student/FeePayment';
import LeaveApplication     from '../pages/student/LeaveApplication';
import StudentComplaints    from '../pages/student/Complaints';
import StudentRoom          from '../pages/student/Room';
import StudentMess          from '../pages/student/Mess';
import StudentAnnouncements from '../pages/student/Announcements';
// ─────────────────────────────────────────────────────────────

/**
 * StudentRoutes
 * All /student/* paths are protected by role="STUDENT".
 * Rendered inside DashboardLayout.
 */
function StudentRoutes() {
  return (
    <Route
      element={
        <ProtectedRoute allowedRole="STUDENT">
          <DashboardLayout />
        </ProtectedRoute>
      }
    >
      <Route path="/student/dashboard"      element={<StudentDashboard />} />
      <Route path="/student/fees"           element={<FeePayment />} />
      <Route path="/student/leave"          element={<LeaveApplication />} />
      <Route path="/student/complaints"     element={<StudentComplaints />} />
      <Route path="/student/room"           element={<StudentRoom />} />
      <Route path="/student/mess"           element={<StudentMess />} />
      <Route path="/student/announcements"  element={<StudentAnnouncements />} />
    </Route>
  );
}

export default StudentRoutes;