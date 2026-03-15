import { Route } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import DashboardLayout from '../layouts/DashboardLayout';

// ── Warden Pages ─────────────────────────────────────────────
import WardenDashboard     from '../pages/warden/WardenDashboard';
import WardenAttendance    from '../pages/warden/Attendance';
import MessManagement      from '../pages/warden/MessManagement';
import WardenComplaints    from '../pages/warden/Complaints';
import WardenStudents      from '../pages/warden/Students';
import WardenRooms         from '../pages/warden/Rooms';
import WardenAnnouncements from '../pages/warden/Announcements';
// ─────────────────────────────────────────────────────────────

/**
 * WardenRoutes
 * All /warden/* paths are protected by role="WARDEN".
 * Rendered inside DashboardLayout.
 */
function WardenRoutes() {
  return (
    <Route
      element={
        <ProtectedRoute allowedRole="WARDEN">
          <DashboardLayout />
        </ProtectedRoute>
      }
    >
      <Route path="/warden/dashboard"       element={<WardenDashboard />} />
      <Route path="/warden/attendance"      element={<WardenAttendance />} />
      <Route path="/warden/mess"            element={<MessManagement />} />
      <Route path="/warden/complaints"      element={<WardenComplaints />} />
      <Route path="/warden/students"        element={<WardenStudents />} />
      <Route path="/warden/rooms"           element={<WardenRooms />} />
      <Route path="/warden/announcements"   element={<WardenAnnouncements />} />
    </Route>
  );
}

export default WardenRoutes;