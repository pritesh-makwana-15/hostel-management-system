// src/components/admin/Sidebar.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Home, Users, UserCheck, Building2, CreditCard,
  MessageSquare, Calendar, Megaphone, Briefcase,
  Wallet, Receipt, Settings, LogOut, ChevronLeft, X,
  ClipboardList, UtensilsCrossed, UserCircle
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import '../../styles/admin/Sidebar.css';

const Sidebar = ({ isOpen, onClose, userRole = 'admin' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const getMenuItems = () => {
    switch (userRole) {
      case 'admin':
        return [
          { id: 'dashboard',     label: 'Dashboard',     icon: Home,           route: '/admin/dashboard' },
          { id: 'students',      label: 'Students',       icon: Users,          route: '/admin/students' },
          { id: 'wardens',       label: 'Wardens',        icon: UserCheck,      route: '/admin/wardens' },
          { id: 'rooms',         label: 'Rooms & Beds',   icon: Building2,      route: '/admin/rooms' },
          { id: 'fees',          label: 'Fees',           icon: CreditCard,     route: '/admin/fees' },
          { id: 'complaints',    label: 'Complaints',     icon: MessageSquare,  route: '/admin/complaints' },
          { id: 'announcements', label: 'Announcements',  icon: Megaphone,      route: '/admin/announcements' },
          { id: 'profile',       label: 'Profile',        icon: UserCircle,     route: '/admin/profile' },
        ];
      case 'warden':
        return [
          { id: 'dashboard',     label: 'Dashboard',      icon: Home,           route: '/warden/dashboard' },
          { id: 'students',      label: 'Students',       icon: Users,          route: '/warden/students' },
          { id: 'rooms',         label: 'Rooms',          icon: Building2,      route: '/warden/rooms' },
          { id: 'complaints',    label: 'Complaints',     icon: MessageSquare,  route: '/warden/complaints' },
          { id: 'announcements', label: 'Announcements',  icon: Megaphone,      route: '/warden/announcements' },
          { id: 'profile',       label: 'Profile',        icon: UserCircle,     route: '/warden/profile' },
        ];
      case 'student':
        return [
          { id: 'dashboard',     label: 'Dashboard',      icon: Home,           route: '/student/dashboard' },
          { id: 'room',          label: 'My Room',        icon: Building2,      route: '/student/room' },
          { id: 'fees',          label: 'Fee Payment',    icon: CreditCard,     route: '/student/fees' },
          { id: 'complaints',    label: 'Complaints',     icon: MessageSquare,  route: '/student/complaints' },
          { id: 'announcements', label: 'Announcements',  icon: Megaphone,      route: '/student/announcements' }, // ✅ Enabled
          { id: 'profile',       label: 'Profile',        icon: UserCircle,     route: '/student/profile' },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  const getRoleTitle = () => {
    switch (userRole) {
      case 'admin':   return 'HMS Admin Dashboard';
      case 'warden':  return 'HMS Warden Portal';
      case 'student': return 'HMS Student Portal';
      default:        return 'HMS Dashboard';
    }
  };

  const isItemActive = (item) => {
    const path = location.pathname;

    const exactRoutes = [
      '/admin/dashboard', '/admin/attendance', '/admin/announcements',
      '/admin/employees', '/admin/expenses', '/admin/certificates',
      '/warden/dashboard', '/warden/attendance', '/warden/mess',
      '/warden/complaints', '/warden/students', '/warden/rooms', '/warden/announcements',
      '/student/dashboard', '/student/fees', '/student/leave',
      '/student/complaints', '/student/room', '/student/mess', '/student/announcements',
    ];

    if (exactRoutes.includes(item.route)) {
      // For announcements, stay active on detail pages too
      if (item.id === 'announcements') {
        return path === item.route || path.startsWith(item.route + '/');
      }
      return path === item.route;
    }

    return path === item.route || path.startsWith(item.route + '/');
  };

  const handleNavigate = (route) => {
    navigate(route);
    if (window.innerWidth < 768) onClose();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}

      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <Building2 size={24} />
          </div>
          <span className="sidebar-title">{getRoleTitle()}</span>
          <button className="sidebar-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isItemActive(item);
            return (
              <button
                key={item.id}
                className={`sidebar-item ${active ? 'sidebar-item-active' : ''}`}
                onClick={() => handleNavigate(item.route)}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <button className="sidebar-item" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;