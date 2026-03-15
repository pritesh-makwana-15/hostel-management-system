import { Routes, Route, Navigate } from 'react-router-dom';

// Route modules
import AdminRoutes   from '../routes/AdminRoutes';
import WardenRoutes  from '../routes/WardenRoutes';
import StudentRoutes from '../routes/StudentRoutes';
import PublicRoutes  from '../routes/PublicRoutes';

// Unauthorized page (exported from ProtectedRoute)
import { UnauthorizedPage } from '../components/ProtectedRoute';

/**
 * AppRouter
 *
 * The single source of truth for all application routing.
 * It composes the four route modules and adds utility routes.
 *
 * Route loading order:
 *  1. Public routes  — /, /login, /visitor/*
 *  2. Admin routes   — /admin/*   (role: ADMIN)
 *  3. Warden routes  — /warden/*  (role: WARDEN)
 *  4. Student routes — /student/* (role: STUDENT)
 *  5. Utility        — /unauthorized, catch-all
 */
function AppRouter() {
  return (
    <Routes>
      {/* ── 1. Public / Visitor Routes ─────────────────────── */}
      {PublicRoutes()}

      {/* ── 2. Admin Protected Routes ──────────────────────── */}
      {AdminRoutes()}

      {/* ── 3. Warden Protected Routes ─────────────────────── */}
      {WardenRoutes()}

      {/* ── 4. Student Protected Routes ────────────────────── */}
      {StudentRoutes()}

      {/* ── 5. Utility Routes ──────────────────────────────── */}
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Catch-all: redirect unknown paths to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default AppRouter;