import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import DashboardLayout from '../layouts/DashboardLayout';

// ── Lazy Load Student Pages ───────────────────────────────────
const StudentDashboard     = lazy(() => import('../pages/student/dashboard/StudentDashboard'));
const FeePayment           = lazy(() => import('../pages/student/FeePayment'));
const StudentComplaints    = lazy(() => import('../pages/student/Complaints'));
const StudentRoom          = lazy(() => import('../pages/student/Room'));
const StudentAnnouncements = lazy(() => import('../pages/student/Announcements'));

// Profile Module
const StudentProfile  = lazy(() => import('../pages/student/profile/StudentProfile'));
const EditProfile     = lazy(() => import('../pages/student/profile/EditProfile'));
const ChangePassword  = lazy(() => import('../pages/student/profile/ChangePassword'));
// ─────────────────────────────────────────────────────────────

const StudentRoutes = () => (
  <Suspense fallback={<div className="p-10 text-center text-gray-500 italic">Loading student module...</div>}>
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
        <Route path="dashboard"     element={<StudentDashboard />} />

        {/* ── Core Modules ── */}
        <Route path="fees"          element={<FeePayment />} />
        <Route path="complaints"    element={<StudentComplaints />} />
        <Route path="room"          element={<StudentRoom />} />
        <Route path="announcements" element={<StudentAnnouncements />} />

        {/* ── Profile Module ── */}
        <Route path="profile"                   element={<StudentProfile />} />
        <Route path="profile/edit"              element={<EditProfile />} />
        <Route path="profile/change-password"   element={<ChangePassword />} />
      </Route>
    </Routes>
  </Suspense>
);

export default StudentRoutes;