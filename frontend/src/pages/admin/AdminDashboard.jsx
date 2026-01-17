import React from 'react';
import StatCards from '../../components/admin/StatCards';
import QuickActions from '../../components/admin/QuickActions';
import Alerts from '../../components/admin/Alerts';
import Charts from '../../components/admin/Charts';
import RecentActivity from '../../components/admin/RecentActivity';
import '../../styles/admin/AdminDashboard.css';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <StatCards />
      <QuickActions />
      <Alerts />
      <Charts />
      <RecentActivity />
    </div>
  );
};

export default AdminDashboard;