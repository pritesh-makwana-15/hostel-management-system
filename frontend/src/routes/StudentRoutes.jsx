// src/routes/StudentRoutes.jsx
import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import DashboardLayout from '../layouts/DashboardLayout';

// ── Lazy Load Student Pages ───────────────────────────────────
const StudentDashboard     = lazy(() => import('../pages/student/dashboard/StudentDashboard'));
const StudentRoomDetails   = lazy(() => import('../pages/student/Room'));
const RoommateProfile      = lazy(() => import('../pages/student/room/RoommateProfile'));
const LeaveApplication     = lazy(() => import('../pages/student/LeaveApplication'));

// Complaints Module
const StudentComplaints    = lazy(() => import('../pages/student/complaints/Complaints'));
const SubmitComplaint      = lazy(() => import('../pages/student/complaints/SubmitComplaint'));
const ComplaintDetails     = lazy(() => import('../pages/student/complaints/ComplaintDetails'));

// Announcements Module 
const StudentAnnouncements    = lazy(() => import('../pages/student/announcements/StudentAnnouncements'));
const AnnouncementDetails     = lazy(() => import('../pages/student/announcements/AnnouncementDetails'));

// Profile Module
const StudentProfile  = lazy(() => import('../pages/student/profile/StudentProfile'));
const EditProfile     = lazy(() => import('../pages/student/profile/EditProfile'));
const ChangePassword  = lazy(() => import('../pages/student/profile/ChangePassword'));

// Fee Module
const FeeDetails       = lazy(() => import('../pages/student/fees/FeeDetails'));
const PayFee           = lazy(() => import('../pages/student/fees/PayFee'));
const PaymentHistory   = lazy(() => import('../pages/student/fees/PaymentHistory'));
const PaymentReceipt   = lazy(() => import('../pages/student/fees/PaymentReceipt'));
const FeeCertificateRequest = lazy(() => import('../pages/student/fees/FeeCertificateRequest'));
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
        <Route path="room" element={<StudentRoomDetails />} />
        <Route path="roommates/:studentId" element={<RoommateProfile />} />
        <Route path="leave" element={<LeaveApplication />} />

        {/* ── Complaints Module ── */}
        <Route path="complaints"        element={<StudentComplaints />} />
        <Route path="complaints/new"    element={<SubmitComplaint />} />
        <Route path="complaints/:id"    element={<ComplaintDetails />} />

        {/* ── Announcements Module  ── */}
        <Route path="announcements"     element={<StudentAnnouncements />} />
        <Route path="announcements/:id" element={<AnnouncementDetails />} />

        {/* ── Fee Module (sub-routes) ── */}
        <Route path="fees"                   element={<FeeDetails />} />
        <Route path="fees/request"           element={<PayFee />} />
        <Route path="fees/pay"               element={<PayFee />} />
        <Route path="fees/history"           element={<PaymentHistory />} />
        <Route path="fees/certificate"       element={<FeeCertificateRequest />} />
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