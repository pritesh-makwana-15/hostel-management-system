import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import DashboardLayout from '../layouts/DashboardLayout';

// ── Lazy Load Admin Pages ─────────────────────────────────────
const AdminDashboard      = lazy(() => import('../pages/admin/AdminDashboard'));

// Students
const StudentsList        = lazy(() => import('../pages/admin/students/StudentsList'));
const AddStudent          = lazy(() => import('../pages/admin/students/AddStudent'));
const EditStudent         = lazy(() => import('../pages/admin/students/EditStudent'));
const AssignRoom          = lazy(() => import('../pages/admin/students/AssignRoom'));
const StudentProfile      = lazy(() => import('../pages/admin/students/StudentProfile'));

// Rooms
const RoomsList           = lazy(() => import('../pages/admin/rooms/RoomsList'));
const AddRoom             = lazy(() => import('../pages/admin/rooms/AddRoom'));
const EditRoom            = lazy(() => import('../pages/admin/rooms/EditRoom'));
const BedAllocation       = lazy(() => import('../pages/admin/rooms/BedAllocation'));
const RoomOccupancy       = lazy(() => import('../pages/admin/rooms/RoomOccupancy'));

// Wardens
const WardensList         = lazy(() => import('../pages/admin/wardens/WardensList'));
const AddWarden           = lazy(() => import('../pages/admin/wardens/AddWarden'));
const EditWarden          = lazy(() => import('../pages/admin/wardens/EditWarden'));
const AssignBlock         = lazy(() => import('../pages/admin/wardens/AssignBlock'));

// Fees
const FeesDashboard       = lazy(() => import('../pages/admin/fees/FeesDashboard'));
const FeeStructure        = lazy(() => import('../pages/admin/fees/FeeStructure'));
const FeeDetails          = lazy(() => import('../pages/admin/fees/FeeDetails'));
const StudentFeeRecords   = lazy(() => import('../pages/admin/fees/StudentFeeRecords'));
const GenerateInvoice     = lazy(() => import('../pages/admin/fees/GenerateInvoice'));
const PaymentHistory      = lazy(() => import('../pages/admin/fees/PaymentHistory'));

// Complaints
const ComplaintsList      = lazy(() => import('../pages/admin/complaints/ComplaintsList'));
const ComplaintDetails    = lazy(() => import('../pages/admin/complaints/ComplaintDetails'));
const AssignComplaint     = lazy(() => import('../pages/admin/complaints/AssignComplaint'));
const ComplaintResponse   = lazy(() => import('../pages/admin/complaints/ComplaintResponse'));

// Announcements
const AnnouncementsList       = lazy(() => import('../pages/admin/announcements/AnnouncementsList'));
const CreateAnnouncement      = lazy(() => import('../pages/admin/announcements/CreateAnnouncement'));
const EditAnnouncement        = lazy(() => import('../pages/admin/announcements/EditAnnouncement'));
const BroadcastAnnouncement   = lazy(() => import('../pages/admin/announcements/BroadcastAnnouncement'));
const NotificationHistory     = lazy(() => import('../pages/admin/announcements/NotificationHistory'));

// Profile
const AdminProfile        = lazy(() => import('../pages/admin/profile/AdminProfile'));
const ChangePassword      = lazy(() => import('../pages/admin/profile/ChangePassword'));

// Misc Admin Pages
const ManageAttendance    = lazy(() => import('../pages/admin/ManageAttendance'));
const ManageEmployees     = lazy(() => import('../pages/admin/ManageEmployees'));
const ManageExpenses      = lazy(() => import('../pages/admin/ManageExpenses'));
const ManageCertificates  = lazy(() => import('../pages/admin/ManageCertificates'));
// ─────────────────────────────────────────────────────────────

/**
 * AdminRoutes
 * All /admin/* paths are protected by role="ADMIN".
 * Renders protected routes inside DashboardLayout.
 */
const AdminRoutes = () => (
  <Suspense fallback={<div className="loading-fallback">Loading admin module...</div>}>
    <Routes>
      <Route
        path="/*"
        element={
          <ProtectedRoute allowedRole="ADMIN">
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* Dashboard */}
        <Route path="dashboard"                element={<AdminDashboard />} />

        {/* Students */}
        <Route path="students"                 element={<StudentsList />} />
        <Route path="students/add"             element={<AddStudent />} />
        <Route path="students/edit/:id"        element={<EditStudent />} />
        <Route path="students/assign/:id"      element={<AssignRoom />} />
        <Route path="students/profile/:id"     element={<StudentProfile />} />

        {/* Rooms */}
        <Route path="rooms"                    element={<RoomsList />} />
        <Route path="rooms/add"                element={<AddRoom />} />
        <Route path="rooms/:roomId/edit"       element={<EditRoom />} />
        <Route path="rooms/:roomId/beds"       element={<BedAllocation />} />
        <Route path="rooms/occupancy"          element={<RoomOccupancy />} />

        {/* Wardens */}
        <Route path="wardens"                  element={<WardensList />} />
        <Route path="wardens/add"              element={<AddWarden />} />
        <Route path="wardens/edit/:id"         element={<EditWarden />} />
        <Route path="wardens/assign/:id"       element={<AssignBlock />} />

        {/* Fees */}
        <Route path="fees"                     element={<FeesDashboard />} />
        <Route path="fees/structure"           element={<FeeStructure />} />
        <Route path="fees/details/:id"         element={<FeeDetails />} />
        <Route path="fees/student/:id"         element={<StudentFeeRecords />} />
        <Route path="fees/invoice/:id"         element={<GenerateInvoice />} />
        <Route path="fees/history"             element={<PaymentHistory />} />

        {/* Complaints */}
        <Route path="complaints"               element={<ComplaintsList />} />
        <Route path="complaints/:id"           element={<ComplaintDetails />} />
        <Route path="complaints/assign/:id"    element={<AssignComplaint />} />
        <Route path="complaints/response/:id"  element={<ComplaintResponse />} />

        {/* Announcements */}
        <Route path="announcements"            element={<AnnouncementsList />} />
        <Route path="announcements/create"     element={<CreateAnnouncement />} />
        <Route path="announcements/edit/:id"   element={<EditAnnouncement />} />
        <Route path="announcements/broadcast"  element={<BroadcastAnnouncement />} />
        <Route path="announcements/history"    element={<NotificationHistory />} />

        {/* Profile */}
        <Route path="profile"                  element={<AdminProfile />} />
        <Route path="change-password"          element={<ChangePassword />} />

        {/* Misc */}
        <Route path="attendance"               element={<ManageAttendance />} />
        <Route path="employees"                element={<ManageEmployees />} />
        <Route path="expenses"                 element={<ManageExpenses />} />
        <Route path="certificates"             element={<ManageCertificates />} />
      </Route>
    </Routes>
  </Suspense>
);

export default AdminRoutes;