import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Lazy load route modules
const AdminRoutes   = lazy(() => import('../routes/AdminRoutes'));
const WardenRoutes  = lazy(() => import('../routes/WardenRoutes'));
const StudentRoutes = lazy(() => import('../routes/StudentRoutes'));
const PublicRoutes  = lazy(() => import('../routes/PublicRoutes'));

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
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        {/* ── 1. Public / Visitor Routes ─────────────────────── */}
        <Route path="/*" element={<PublicRoutes />} />

        {/* ── 2. Admin Protected Routes ──────────────────────── */}
        <Route path="/admin/*" element={<AdminRoutes />} />

        {/* ── 3. Warden Protected Routes ─────────────────────── */}
        <Route path="/warden/*" element={<WardenRoutes />} />

        {/* ── 4. Student Protected Routes ────────────────────── */}
        <Route path="/student/*" element={<StudentRoutes />} />

        {/* ── 5. Utility Routes ──────────────────────────────── */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* Catch-all: redirect unknown paths to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  );
}

export default AppRouter;