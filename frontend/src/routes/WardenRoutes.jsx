// src/routes/WardenRoutes.jsx
import React from 'react';
import { Route } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';

// Existing warden pages
import WardenDashboard from '../pages/warden/WardenDashboard';

// ── Warden Student Management ──────────────────────────
import StudentsList   from '../pages/warden/student/StudentsList';
import EditStudent    from '../pages/warden/student/EditStudent';
import StudentProfile from '../pages/warden/student/StudentProfile';

// ── Warden Room Management ──────────────────────────────
import WardenRooms  from '../pages/warden/rooms/WardenRooms';
import RoomDetails  from '../pages/warden/rooms/RoomDetails';
import AssignRoom   from '../pages/warden/rooms/AssignRoom';

// ── Warden Complaint Management ─────────────────────────
import WardenComplaints from '../pages/warden/complaints/WardenComplaints';
import ComplaintDetails from '../pages/warden/complaints/ComplaintDetails';

// ── Warden Announcement Management ─────────────────────
import WardenAnnouncements from '../pages/warden/announcements/WardenAnnouncements';
import CreateAnnouncement  from '../pages/warden/announcements/CreateAnnouncement';
import AnnouncementDetails from '../pages/warden/announcements/AnnouncementDetails';

// ── Warden Profile Management ─────────────────────────
import WardenProfile        from '../pages/warden/profile/WardenProfile';
import WardenChangePassword from '../pages/warden/profile/WardenChangePassword';
 

const WardenRoutes = () => (
  <Route path="/warden" element={<DashboardLayout />}>
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

    
    <Route path="profile"         element={<WardenProfile />} />
    <Route path="change-password" element={<WardenChangePassword />} />
  </Route>
);

export default WardenRoutes;