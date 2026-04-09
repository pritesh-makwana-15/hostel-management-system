import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import DashboardLayout from '../layouts/DashboardLayout';

// ── Lazy Load Student Pages ───────────────────────────────────
const StudentDashboard     = lazy(() => import('../pages/student/dashboard/StudentDashboard'));
const StudentRoomDetails   = lazy(() => import('../pages/student/room/RoomDetails'));
const StudentComplaints    = lazy(() => import('../pages/student/Complaints'));
const StudentAnnouncements = lazy(() => import('../pages/student/Announcements'));

// Profile Module
const StudentProfile  = lazy(() => import('../pages/student/profile/StudentProfile'));
const EditProfile     = lazy(() => import('../pages/student/profile/EditProfile'));
const ChangePassword  = lazy(() => import('../pages/student/profile/ChangePassword'));

// Fee Module
const FeeDetails       = lazy(() => import('../pages/student/fees/FeeDetails'));
const PayFee           = lazy(() => import('../pages/student/fees/PayFee'));
const PaymentHistory   = lazy(() => import('../pages/student/fees/PaymentHistory'));
const PaymentReceipt   = lazy(() => import('../pages/student/fees/PaymentReceipt'));
// ─────────────────────────────────────────────────────────────

const StudentRoutes = () => (
  <Suspense fallback={<div className="loading-fallback">Loading student module...</div>}>
    <Routes>
      <Route
        path="/*"
        element={
          <ProtectedRoute allowedRole="STUDENT">
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* ── Dashboard ── */}
        <Route path="dashboard" element={<StudentDashboard />} />

        {/* ── Core Modules ── */}
        <Route path="room"          element={<StudentRoomDetails />} />
        <Route path="complaints"    element={<StudentComplaints />} />
        <Route path="announcements" element={<StudentAnnouncements />} />

        {/* ── Fee Module (sub-routes) ── */}
        <Route path="fees"                   element={<FeeDetails />} />
        <Route path="fees/pay"               element={<PayFee />} />
        <Route path="fees/history"           element={<PaymentHistory />} />
        <Route path="fees/receipt/:id"       element={<PaymentReceipt />} />

        {/* ── Profile Module ── */}
        <Route path="profile"                 element={<StudentProfile />} />
        <Route path="profile/edit"            element={<EditProfile />} />
        <Route path="profile/change-password" element={<ChangePassword />} />
      </Route>
    </Routes>
  </Suspense>
);

export default StudentRoutes;