import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Topbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-card shadow-sm border-b border-border">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left Section - Page Title or Breadcrumb */}
        <div>
          <h1 className="text-xl font-semibold text-text-primary">
            Welcome, {user?.name || 'User'}
          </h1>
          <p className="text-sm text-text-secondary">
            Have a great day ahead!
          </p>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-4">
          {/* Notifications Icon */}
          <button className="p-2 hover:bg-background rounded-small transition-all">
            <span className="text-xl">🔔</span>
          </button>

          {/* Profile Dropdown */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-semibold text-sm">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-primary text-white rounded-small hover:bg-opacity-90 transition-all font-medium text-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Topbar;