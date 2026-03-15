import { Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AuthLayout from '../layouts/AuthLayout';

// ── Public / Visitor Pages ────────────────────────────────────
import Home        from '../pages/visitor/Home';
import VisitorHome from '../pages/visitor/VisitorHome';
import Facilities  from '../pages/visitor/Facilities';
import Inquiry     from '../pages/visitor/Inquiry';
import Login       from '../pages/Login';
// ─────────────────────────────────────────────────────────────

/**
 * Role → dashboard path mapping.
 * Used to redirect already-authenticated users away from /login.
 */
const ROLE_DASHBOARD_MAP = {
  ADMIN:   '/admin/dashboard',
  WARDEN:  '/warden/dashboard',
  STUDENT: '/student/dashboard',
};

/**
 * LoginRoute
 * If the user is already authenticated, redirect them to their dashboard.
 * Otherwise, render the Login page.
 */
function LoginRoute() {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontFamily: 'sans-serif',
          color: '#6b7280',
        }}
      >
        Loading...
      </div>
    );
  }

  if (isAuthenticated && user?.role) {
    const redirectTo = ROLE_DASHBOARD_MAP[user.role] ?? '/login';
    return <Navigate to={redirectTo} replace />;
  }

  return <Login />;
}

/**
 * PublicRoutes
 * All public-facing pages (no auth required).
 * Wrapped in AuthLayout for consistent public page styling.
 */
function PublicRoutes() {
  return (
    <>
      {/* Home + Login under AuthLayout */}
      <Route element={<AuthLayout />}>
        <Route path="/"                   element={<Home />} />
        <Route path="/login"              element={<LoginRoute />} />
      </Route>

      {/* Visitor section under AuthLayout */}
      <Route element={<AuthLayout />}>
        <Route path="/visitor"            element={<VisitorHome />} />
        <Route path="/visitor/facilities" element={<Facilities />} />
        <Route path="/visitor/inquiry"    element={<Inquiry />} />
      </Route>
    </>
  );
}

export default PublicRoutes;