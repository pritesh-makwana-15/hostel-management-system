import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Sidebar = () => {
  const { user } = useAuth();

  // Menu items will be populated based on role
  // For now, just placeholder structure
  const menuItems = [
    { path: `/${user?.role}/dashboard`, label: 'Dashboard', icon: '📊' },
    // More items will be added dynamically based on role
  ];

  return (
    <aside className="w-64 bg-card shadow-lg flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-border">
        <h2 className="text-2xl font-bold text-primary">HMS</h2>
        <p className="text-sm text-text-secondary mt-1">
          {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Panel'}
        </p>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-small transition-all ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-text-primary hover:bg-background'
                  }`
                }
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Info Section */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-text-primary">
              {user?.name || 'User Name'}
            </p>
            <p className="text-xs text-text-secondary">
              {user?.email || 'user@example.com'}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;