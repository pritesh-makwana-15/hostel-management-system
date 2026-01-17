import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, Users, UserCheck, Building2, CreditCard, 
  MessageSquare, Calendar, Megaphone, Briefcase, 
  Wallet, Receipt, Settings, LogOut, ChevronLeft, X,
  ClipboardList, UtensilsCrossed, FileText
} from 'lucide-react';
import '../../styles/admin/Sidebar.css';

const Sidebar = ({ isOpen, onClose, userRole = 'admin' }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Menu items based on user role
  const getMenuItems = () => {
    switch (userRole) {
      case 'admin':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: Home, route: '/admin/dashboard' },
          { id: 'students', label: 'Students', icon: Users, route: '/admin/students' },
          { id: 'wardens', label: 'Wardens', icon: UserCheck, route: '/admin/wardens' },
          { id: 'rooms', label: 'Rooms & Beds', icon: Building2, route: '/admin/rooms' },
          { id: 'fees', label: 'Fees', icon: CreditCard, route: '/admin/fees' },
          { id: 'complaints', label: 'Complaints', icon: MessageSquare, route: '/admin/complaints' },
          { id: 'attendance', label: 'Attendance', icon: Calendar, route: '/admin/attendance' },
          { id: 'announcements', label: 'Announcements', icon: Megaphone, route: '/admin/announcements' },
          { id: 'employees', label: 'Employees', icon: Briefcase, route: '/admin/employees' },
          { id: 'expenses', label: 'Expenses', icon: Wallet, route: '/admin/expenses' },
          { id: 'certificates', label: 'Certificates', icon: Receipt, route: '/admin/certificates' }
        ];
      
      case 'warden':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: Home, route: '/warden/dashboard' },
          { id: 'attendance', label: 'Attendance', icon: Calendar, route: '/warden/attendance' },
          { id: 'mess', label: 'Mess Management', icon: UtensilsCrossed, route: '/warden/mess' },
          { id: 'complaints', label: 'Complaints', icon: MessageSquare, route: '/warden/complaints' },
          { id: 'students', label: 'Students', icon: Users, route: '/warden/students' },
          { id: 'rooms', label: 'Rooms', icon: Building2, route: '/warden/rooms' },
          { id: 'announcements', label: 'Announcements', icon: Megaphone, route: '/warden/announcements' }
        ];
      
      case 'student':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: Home, route: '/student/dashboard' },
          { id: 'fees', label: 'Fee Payment', icon: CreditCard, route: '/student/fees' },
          { id: 'leave', label: 'Leave Application', icon: ClipboardList, route: '/student/leave' },
          { id: 'complaints', label: 'Complaints', icon: MessageSquare, route: '/student/complaints' },
          { id: 'room', label: 'My Room', icon: Building2, route: '/student/room' },
          { id: 'mess', label: 'Mess Menu', icon: UtensilsCrossed, route: '/student/mess' },
          { id: 'announcements', label: 'Announcements', icon: Megaphone, route: '/student/announcements' }
        ];
      
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  const getRoleTitle = () => {
    switch (userRole) {
      case 'admin': return 'HMS Admin Dashboard';
      case 'warden': return 'HMS Warden Portal';
      case 'student': return 'HMS Student Portal';
      default: return 'HMS Dashboard';
    }
  };

  const handleNavigate = (route) => {
    navigate(route);
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}

      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        {/* Logo & Title */}
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <Building2 size={24} />
          </div>
          <span className="sidebar-title">{getRoleTitle()}</span>
          <button className="sidebar-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.route;
            return (
              <button
                key={item.id}
                className={`sidebar-item ${isActive ? 'sidebar-item-active' : ''}`}
                onClick={() => handleNavigate(item.route)}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="sidebar-bottom">
          <button className="sidebar-item">
            <Settings size={20} />
            <span>Settings</span>
          </button>
          <button className="sidebar-item">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
          <button className="sidebar-collapse">
            <ChevronLeft size={20} />
            <span>Collapse</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;