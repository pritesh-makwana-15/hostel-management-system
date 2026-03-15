import { Route } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import DashboardLayout from '../layouts/DashboardLayout';

// ── Admin Pages ──────────────────────────────────────────────
import AdminDashboard      from '../pages/admin/AdminDashboard';

// Students
import StudentsList        from '../pages/admin/students/StudentsList';
import AddStudent          from '../pages/admin/students/AddStudent';
import EditStudent         from '../pages/admin/students/EditStudent';
import AssignRoom          from '../pages/admin/students/AssignRoom';
import StudentProfile      from '../pages/admin/students/StudentProfile';

// Rooms
import RoomsList           from '../pages/admin/rooms/RoomsList';
import AddRoom             from '../pages/admin/rooms/AddRoom';
import EditRoom            from '../pages/admin/rooms/EditRoom';
import BedAllocation       from '../pages/admin/rooms/BedAllocation';
import RoomOccupancy       from '../pages/admin/rooms/RoomOccupancy';

// Wardens
import WardensList         from '../pages/admin/wardens/WardensList';
import AddWarden           from '../pages/admin/wardens/AddWarden';
import EditWarden          from '../pages/admin/wardens/EditWarden';
import AssignBlock         from '../pages/admin/wardens/AssignBlock';

// Fees
import FeesDashboard       from '../pages/admin/fees/FeesDashboard';
import FeeStructure        from '../pages/admin/fees/FeeStructure';
import FeeDetails          from '../pages/admin/fees/FeeDetails';
import StudentFeeRecords   from '../pages/admin/fees/StudentFeeRecords';
import GenerateInvoice     from '../pages/admin/fees/GenerateInvoice';
import PaymentHistory      from '../pages/admin/fees/PaymentHistory';

// Complaints
import ComplaintsList      from '../pages/admin/complaints/ComplaintsList';
import ComplaintDetails    from '../pages/admin/complaints/ComplaintDetails';
import AssignComplaint     from '../pages/admin/complaints/AssignComplaint';
import ComplaintResponse   from '../pages/admin/complaints/ComplaintResponse';

// Announcements
import AnnouncementsList       from '../pages/admin/announcements/AnnouncementsList';
import CreateAnnouncement      from '../pages/admin/announcements/CreateAnnouncement';
import EditAnnouncement        from '../pages/admin/announcements/EditAnnouncement';
import BroadcastAnnouncement   from '../pages/admin/announcements/BroadcastAnnouncement';
import NotificationHistory     from '../pages/admin/announcements/NotificationHistory';

// Profile
import AdminProfile        from '../pages/admin/profile/AdminProfile';
import ChangePassword      from '../pages/admin/profile/ChangePassword';

// Misc Admin Pages
import ManageAttendance    from '../pages/admin/ManageAttendance';
import ManageEmployees     from '../pages/admin/ManageEmployees';
import ManageExpenses      from '../pages/admin/ManageExpenses';
import ManageCertificates  from '../pages/admin/ManageCertificates';
// ─────────────────────────────────────────────────────────────

/**
 * AdminRoutes
 * All /admin/* paths are protected by role="ADMIN".
 * Rendered inside DashboardLayout.
 *
 * Usage in AppRouter:
 *   <Route element={<AdminRoutes />}>
 *     {AdminRoutes()}   ← JSX children auto-injected via Outlet
 *   </Route>
 *
 * This file exports a JSX fragment of <Route> elements so that
 * AppRouter can compose them directly inside a wrapping <Route>.
 */
function AdminRoutes() {
  return (
    <Route
      element={
        <ProtectedRoute allowedRole="ADMIN">
          <DashboardLayout />
        </ProtectedRoute>
      }
    >
      {/* Dashboard */}
      <Route path="/admin/dashboard"                element={<AdminDashboard />} />

      {/* Students */}
      <Route path="/admin/students"                 element={<StudentsList />} />
      <Route path="/admin/students/add"             element={<AddStudent />} />
      <Route path="/admin/students/edit/:id"        element={<EditStudent />} />
      <Route path="/admin/students/assign/:id"      element={<AssignRoom />} />
      <Route path="/admin/students/profile/:id"     element={<StudentProfile />} />

      {/* Rooms */}
      <Route path="/admin/rooms"                    element={<RoomsList />} />
      <Route path="/admin/rooms/add"                element={<AddRoom />} />
      <Route path="/admin/rooms/:roomId/edit"       element={<EditRoom />} />
      <Route path="/admin/rooms/:roomId/beds"       element={<BedAllocation />} />
      <Route path="/admin/rooms/occupancy"          element={<RoomOccupancy />} />

      {/* Wardens */}
      <Route path="/admin/wardens"                  element={<WardensList />} />
      <Route path="/admin/wardens/add"              element={<AddWarden />} />
      <Route path="/admin/wardens/:id/edit"         element={<EditWarden />} />
      <Route path="/admin/wardens/:id/assign"       element={<AssignBlock />} />

      {/* Fees */}
      <Route path="/admin/fees"                     element={<FeesDashboard />} />
      <Route path="/admin/fees/structure"           element={<FeeStructure />} />
      <Route path="/admin/fees/structure/new"       element={<FeeDetails />} />
      <Route path="/admin/fees/student-records"     element={<StudentFeeRecords />} />
      <Route path="/admin/fees/generate-invoice"    element={<GenerateInvoice />} />
      <Route path="/admin/fees/payment-history"     element={<PaymentHistory />} />

      {/* Complaints */}
      <Route path="/admin/complaints"               element={<ComplaintsList />} />
      <Route path="/admin/complaints/:id"           element={<ComplaintDetails />} />
      <Route path="/admin/complaints/:id/assign"    element={<AssignComplaint />} />
      <Route path="/admin/complaints/:id/response"  element={<ComplaintResponse />} />

      {/* Announcements */}
      <Route path="/admin/announcements"                 element={<AnnouncementsList />} />
      <Route path="/admin/announcements/create"          element={<CreateAnnouncement />} />
      <Route path="/admin/announcements/edit/:id"        element={<EditAnnouncement />} />
      <Route path="/admin/announcements/broadcast/:id"   element={<BroadcastAnnouncement />} />
      <Route path="/admin/announcements/history"         element={<NotificationHistory />} />

      {/* Profile */}
      <Route path="/admin/profile"                  element={<AdminProfile />} />
      <Route path="/admin/profile/change-password"  element={<ChangePassword />} />

      {/* Misc */}
      <Route path="/admin/attendance"               element={<ManageAttendance />} />
      <Route path="/admin/employees"                element={<ManageEmployees />} />
      <Route path="/admin/expenses"                 element={<ManageExpenses />} />
      <Route path="/admin/certificates"             element={<ManageCertificates />} />
    </Route>
  );
}

export default AdminRoutes;