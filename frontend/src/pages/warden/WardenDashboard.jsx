import React from 'react';
import StatCard from '../../components/ui/dashboard/StatCard';
import QuickActions from '../../components/ui/dashboard/QuickActions';
import PendingComplaints from '../../components/ui/dashboard/PendingComplaints';
import SystemAlerts from '../../components/ui/dashboard/SystemAlerts';
import RecentActivity from '../../components/ui/dashboard/RecentActivity';
import { stats, quickActions, complaints, alerts, activities } from '../../data/wardenDashboardData';
import '../../styles/warden/WardenDashboard.css';

const WardenDashboard = () => {
  return (
    <div className="warden-dashboard">

      {/* Welcome Header */}
      <div className="warden-welcome">
        <h1 className="warden-welcome-title">Welcome back, John Doe</h1>
        <p className="warden-welcome-sub">Here's what's happening in Block B today.</p>
      </div>

      {/* Stats Grid */}
      <div className="warden-stats-grid">
        {stats.map((stat) => (
          <StatCard key={stat.id} {...stat} />
        ))}
      </div>

      {/* Quick Actions */}
      <QuickActions actions={quickActions} />

      {/* Middle Row: Complaints + Alerts */}
      <div className="warden-middle-row">
        <PendingComplaints complaints={complaints} />
        <SystemAlerts alerts={alerts} />
      </div>

      {/* Recent Activity */}
      <RecentActivity activities={activities} />

    </div>
  );
};

export default WardenDashboard;