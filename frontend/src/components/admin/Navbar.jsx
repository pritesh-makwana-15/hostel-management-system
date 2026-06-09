import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, Search, Bell, Building2, LogOut, User, Settings } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import '../../styles/admin/Navbar.css';

const Navbar = ({ onMenuClick, userRole = 'admin' }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setShowDropdown(false);
  }, [location.pathname]);

  const getPageTitle = () => {
    const path = location.pathname;
    const segments = path.split('/');
    const lastSegment = segments[segments.length - 1];
    if (lastSegment === 'dashboard') return 'Dashboard';
    return lastSegment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getRoleTitle = () => {
    switch (userRole) {
      case 'admin':   return 'HMS Admin Dashboard';
      case 'warden':  return 'HMS Warden Portal';
      case 'student': return 'HMS Student Portal';
      default:        return 'HMS Dashboard';
    }
  };

  const getUserInitial = () => {
    if (user?.name) return user.name.charAt(0).toUpperCase();
    switch (userRole) {
      case 'admin':   return 'A';
      case 'warden':  return 'W';
      case 'student': return 'S';
      default:        return 'U';
    }
  };

  // Navigate to role-specific profile route
  const getProfileRoute = () => {
    switch (userRole) {
      case 'admin':   return '/admin/profile';
      case 'warden':  return '/warden/profile';
      case 'student': return '/student/profile';
      default:        return '/admin/profile';
    }
  };

  const handleProfile = () => {
    setShowDropdown(false);
    navigate(getProfileRoute());
  };

  const handleSettings = () => {
    setShowDropdown(false);
    navigate(getProfileRoute()); // Settings lives inside profile for now
  };

  const handleLogout = () => {
    setShowDropdown(false);
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button className="navbar-menu-btn" onClick={onMenuClick}>
          <Menu size={24} />
        </button>
        <div className="navbar-logo-mobile">
          <Building2 size={24} />
          <span>{getRoleTitle()}</span>
        </div>
        <h1 className="navbar-title">{getPageTitle()}</h1>
      </div>

      <div className="navbar-right">
        {/* <div className="navbar-search">
          <Search size={20} />
          <input type="text" placeholder="Search..." />
        </div> */}
        {/* <buxon> */}
        {/* <button className="navbar-icon-btn">
          <Bell size={20} />
          <span className="navbar-badge">3</span>
        </button> */}

        <div className="navbar-profile" ref={dropdownRef}>
          <button
            className="navbar-avatar"
            onClick={() => setShowDropdown((prev) => !prev)}
          >
            <span>{getUserInitial()}</span>
          </button>

          {showDropdown && (
            <div className="navbar-dropdown">
              {user?.name && (
                <div className="navbar-dropdown-user">
                  <strong>{user.name}</strong>
                  <small>{user.email}</small>
                </div>
              )}
              <button className="navbar-dropdown-item" onClick={handleProfile}>
                <User size={16} /> Profile
              </button>
              <button className="navbar-dropdown-item" onClick={handleSettings}>
                <Settings size={16} /> Settings
              </button>
              <button className="navbar-dropdown-item logout" onClick={handleLogout}>
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;