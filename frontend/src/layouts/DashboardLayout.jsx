import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/admin/Sidebar';
import Navbar from '../components/admin/Navbar';
import '../styles/layouts/DashboardLayout.css';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Determine user role from current path
  const getUserRole = () => {
    const path = location.pathname;
    if (path.startsWith('/admin')) return 'admin';
    if (path.startsWith('/warden')) return 'warden';
    if (path.startsWith('/student')) return 'student';
    return 'admin'; // default
  };

  const userRole = getUserRole();

  return (
    <div className="dashboard-layout">
      <Sidebar 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userRole={userRole}
      />
      <div className="dashboard-main">
        <Navbar 
          onMenuClick={() => setSidebarOpen(true)}
          userRole={userRole}
        />
        <main className="dashboard-content">
          <Outlet />
          <footer className="dashboard-footer">
            © 2026 HMS Admin Dashboard. All rights reserved.
          </footer>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;