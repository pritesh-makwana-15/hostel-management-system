// src/routes/WardenRoutes.jsx
import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import DashboardLayout from '../layouts/DashboardLayout';

// ── Lazy Load Warden Pages ─────────────────────────────────────
const WardenDashboard = lazy(() => import('../pages/warden/WardenDashboard'));

// Warden Student Management
const StudentsList   = lazy(() => import('../pages/warden/student/StudentsList'));
const EditStudent    = lazy(() => import('../pages/warden/student/EditStudent'));
const StudentProfile = lazy(() => import('../pages/warden/student/StudentProfile'));

// Warden Room Management
const WardenRooms  = lazy(() => import('../pages/warden/rooms/WardenRooms'));
const RoomDetails  = lazy(() => import('../pages/warden/rooms/RoomDetails'));
const AssignRoom   = lazy(() => import('../pages/warden/rooms/AssignRoom'));

// Warden Complaint Management
const WardenComplaints = lazy(() => import('../pages/warden/complaints/WardenComplaints'));
const ComplaintDetails = lazy(() => import('../pages/warden/complaints/ComplaintDetails'));

// Warden Announcement Management
const WardenAnnouncements = lazy(() => import('../pages/warden/announcements/WardenAnnouncements'));
const CreateAnnouncement  = lazy(() => import('../pages/warden/announcements/CreateAnnouncement'));
const AnnouncementDetails = lazy(() => import('../pages/warden/announcements/AnnouncementDetails'));

// Warden Profile Management
const WardenProfile        = lazy(() => import('../pages/warden/profile/WardenProfile'));
const WardenChangePassword = lazy(() => import('../pages/warden/profile/WardenChangePassword'));

/**
 * WardenRoutes
 * All /warden/* paths are protected by role="WARDEN".
 * Renders protected routes inside DashboardLayout.
 */
const WardenRoutes = () => (
  <Suspense fallback={<div className="loading-fallback">Loading warden module...</div>}>
    <Routes>
      <Route
        path="/*"
        element={
          <ProtectedRoute allowedRole="WARDEN">
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        {/* Dashboard */}
        <Route path="dashboard" element={<WardenDashboard />} />

        {/* ── Student Management ── */}
        <Route path="students"              element={<StudentsList />} />
        <Route path="students/edit/:id"     element={<EditStudent />} />
        <Route path="students/profile/:id"  element={<StudentProfile />} />

        {/* ── Room Management ── */}
        <Route path="rooms"                 element={<WardenRooms />} />
        <Route path="rooms/view/:id"        element={<RoomDetails />} />
        <Route path="rooms/assign/:id"      element={<AssignRoom />} />

        {/* ── Complaint Management ── */}
        <Route path="complaints"            element={<WardenComplaints />} />
        <Route path="complaints/view/:id"   element={<ComplaintDetails />} />

        {/* ── Announcement Management ── */}
        <Route path="announcements"              element={<WardenAnnouncements />} />
        <Route path="announcements/create"       element={<CreateAnnouncement />} />
        <Route path="announcements/view/:id"     element={<AnnouncementDetails />} />

        {/* ── Profile Management ── */}
        <Route path="profile"         element={<WardenProfile />} />
        <Route path="change-password" element={<WardenChangePassword />} />
      </Route>
    </Routes>
  </Suspense>
);

export default WardenRoutes;