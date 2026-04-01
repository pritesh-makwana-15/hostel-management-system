import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import '../../../styles/layouts/Topbar.css';

const Topbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="topbar">
      <div className="topbar-content">
        {/* Left Section - Page Title or Breadcrumb */}
        <div className="topbar-left">
          <h1 className="topbar-title">
            Welcome, {user?.name || 'User'}
          </h1>
          <p className="topbar-subtitle">
            Have a great day ahead!
          </p>
        </div>

        {/* Right Section - Actions */}
        <div className="topbar-right">
          {/* Notifications Icon */}
          <button className="topbar-notification-btn">
            <span className="topbar-notification-icon">🔔</span>
          </button>

          {/* Profile Dropdown */}
          <div className="topbar-profile">
            <div className="topbar-avatar">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="topbar-logout-btn"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Topbar;