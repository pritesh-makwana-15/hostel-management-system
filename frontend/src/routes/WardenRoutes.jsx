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

// Add other warden pages here as you build them:
// import WardenAttendance  from '../pages/warden/Attendance';
// import WardenComplaints  from '../pages/warden/Complaints';
// import MessManagement    from '../pages/warden/MessManagement';
// import WardenAnnouncements from '../pages/warden/Announcements';
// import WardenRooms       from '../pages/warden/Rooms';

const WardenRoutes = () => (
  <Route path="/warden" element={<DashboardLayout />}>
    {/* Dashboard */}
    <Route path="dashboard"  element={<WardenDashboard />} />

    {/* ── Student Management ────────────────────────── */}
    <Route path="students"                    element={<StudentsList />} />
    <Route path="students/edit/:id"           element={<EditStudent />} />
    <Route path="students/profile/:id"        element={<StudentProfile />} />

    {/* Placeholder routes — wire up when pages are built */}
    {/* <Route path="attendance"    element={<WardenAttendance />} /> */}
    {/* <Route path="complaints"    element={<WardenComplaints />} /> */}
    {/* <Route path="mess"          element={<MessManagement />} /> */}
    {/* <Route path="announcements" element={<WardenAnnouncements />} /> */}
    {/* <Route path="rooms"         element={<WardenRooms />} /> */}
  </Route>
);

export default WardenRoutes;