import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import '../../styles/layouts/Sidebar.css';

const Sidebar = () => {
  const { user } = useAuth();

  // Menu items will be populated based on role
  // For now, just placeholder structure
  const menuItems = [
    { path: `/${user?.role}/dashboard`, label: 'Dashboard', icon: '📊' },
    // More items will be added dynamically based on role
  ];

  return (
    <aside className="sidebar">
      {/* Logo Section */}
      <div className="sidebar-logo-section">
        <h2 className="sidebar-logo">HMS</h2>
        <p className="sidebar-subtitle">
          {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Panel'}
        </p>
      </div>

      {/* Navigation Menu */}
      <nav className="sidebar-nav">
        <ul className="sidebar-menu">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `sidebar-menu-item ${isActive ? 'active' : ''}`
                }
              >
                <span className="sidebar-menu-icon">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Info Section */}
      <div className="sidebar-user-section">
        <div className="sidebar-user-info">
          <div className="sidebar-user-avatar">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="sidebar-user-details">
            <p className="sidebar-user-name">
              {user?.name || 'User Name'}
            </p>
            <p className="sidebar-user-role">
              {user?.email || 'user@example.com'}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;