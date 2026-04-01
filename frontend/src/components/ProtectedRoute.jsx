import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// ─── Unauthorized Page ───────────────────────────────────────
export function UnauthorizedPage() {
  const { user } = useAuth();

  const dashboardMap = {
    ADMIN: '/admin/dashboard',
    WARDEN: '/warden/dashboard',
    STUDENT: '/student/dashboard',
  };

  const redirectPath = user?.role ? dashboardMap[user.role] : '/login';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        gap: '16px',
        fontFamily: 'sans-serif',
      }}
    >
      <h1 style={{ fontSize: '2rem', color: '#1f3c88' }}>403 — Access Denied</h1>
      <p style={{ color: '#6b7280' }}>You do not have permission to view this page.</p>
      {user && (
        <a href={redirectPath} style={{ color: '#4f46e5', textDecoration: 'underline' }}>
          Go to your dashboard
        </a>
      )}
    </div>
  );
}

// Decode JWT payload without a library
function decodeToken(token) {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

function isTokenExpired(token) {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;
  return decoded.exp * 1000 < Date.now();
}

// ─── ProtectedRoute Component ────────────────────────────────
/**
 * Wraps any route that requires authentication and an optional role check.
 */
function ProtectedRoute({ children, allowedRole }) {
  const { user, token, loading, logout } = useAuth();

  // 1. Wait for auth hydration from localStorage before making any decision.
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'sans-serif', color: '#6b7280' }}>
        Loading...
      </div>
    );
  }

  // 2. Proactive Expiration Check
  if (token && isTokenExpired(token)) {
    logout();
    return <Navigate to="/login" replace />;
  }

  // 3. Not authenticated → redirect to login.
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // 4. Authenticated but wrong role → show 403 page.
  if (allowedRole && user?.role !== allowedRole) {
    return <UnauthorizedPage />;
  }

  // 5. All checks passed → render protected content.
  return children;
}

export default ProtectedRoute;