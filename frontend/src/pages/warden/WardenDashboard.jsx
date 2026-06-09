import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../../components/ui/dashboard/StatCard';
import QuickActions from '../../components/ui/dashboard/QuickActions';
import PendingComplaints from '../../components/ui/dashboard/PendingComplaints';
import SystemAlerts from '../../components/ui/dashboard/SystemAlerts';
import RecentActivity from '../../components/ui/dashboard/RecentActivity';
import { quickActions } from '../../data/wardenDashboardData';
import { wardenApi } from '../../services/wardenApi';
import '../../styles/warden/WardenDashboard.css';

const WardenDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [activities, setActivities] = useState([]);
  const [wardenName, setWardenName] = useState('Warden');
  const [blockName, setBlockName] = useState('Hostel');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [profileRes, statsRes, complaintsRes, alertsRes, activitiesRes] = await Promise.all([
        wardenApi.getProfile(),
        wardenApi.getDashboardStats(),
        wardenApi.getPendingComplaints(),
        wardenApi.getAlerts(),
        wardenApi.getActivities(),
      ]);

      const profile = profileRes?.data?.data;
      if (profile) {
        setWardenName(profile.name || 'Warden');
        setBlockName(profile.block || 'Hostel');
      }

      const statsData = statsRes?.data?.data;
      if (statsData) {
        setStats([
          {
            id: 1,
            title: 'Students Under Warden',
            value: statsData.studentsUnderWarden || '0',
            description: statsData.newStudentsThisMonth || '0 new this month',
            icon: require('lucide-react').Users,
            iconBg: '#E3F2FD',
            iconColor: '#1F3C88',
          },
          {
            id: 2,
            title: 'Rooms Managed',
            value: statsData.roomsManaged || '0',
            description: statsData.vacanciesRemaining || '0 vacancies',
            icon: require('lucide-react').Building2,
            iconBg: '#E0F2F1',
            iconColor: '#2BBBAD',
          },
          {
            id: 3,
            title: 'Pending Complaints',
            value: statsData.pendingComplaints || '0',
            description: statsData.urgentEscalations || '0 urgent escalations',
            icon: require('lucide-react').MessageSquare,
            iconBg: '#FFF3E0',
            iconColor: '#FB8C00',
          },
          {
            id: 4,
            title: 'Announcements',
            value: statsData.announcementsCount || '0',
            description: statsData.lastAnnouncementTime || 'No recent announcements',
            icon: require('lucide-react').Megaphone,
            iconBg: '#F3E5F5',
            iconColor: '#1F3C88',
          },
        ]);
      }

      const complaintsData = complaintsRes?.data?.data || [];
      setComplaints(
        complaintsData.slice(0, 5).map((complaint, index) => {
          const submittedDate = complaint.submittedDate || '';
          const submittedTime = complaint.submittedTime || '';
          const combinedDateTime = `${submittedDate} ${submittedTime}`.trim();

          return {
            id: complaint.id || index + 1,
            studentName: complaint.studentName || 'Unknown Student',
            title: complaint.title || complaint.description || 'Untitled Complaint',
            room: complaint.roomNumber || 'Unknown Room',
            status: complaint.status || 'Open',
            code: complaint.complaintCode || complaint.id,
            time: combinedDateTime || 'Just now',
          };
        })
      );

      const alertsData = alertsRes?.data?.data || [];
      setAlerts(
        alertsData.slice(0, 5).map((alert, index) => ({
          id: alert.id || index + 1,
          message: alert.message || 'System alert',
          time: alert.createdAt || 'Just now',
          active: alert.active !== false,
        }))
      );

      const activitiesData = activitiesRes?.data?.data || [];
      setActivities(
        activitiesData.slice(0, 10).map((activity, index) => {
          const rawDate = activity.createdAt || '';
          const parsedDate = new Date(rawDate);
          const hasValidDate = !Number.isNaN(parsedDate.getTime());

          return {
            id: activity.id || index + 1,
            type: activity.type || 'System Activity',
            description: activity.description || 'Activity performed',
            dateTime: rawDate || 'Just now',
            status: activity.status || 'Completed',
            timestamp: hasValidDate ? parsedDate.toISOString() : null,
          };
        })
      );

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Fallback to dummy data if API fails
      setStats([
        {
          id: 1,
          title: 'Students Under Warden',
          value: '0',
          description: 'No data available',
          icon: require('lucide-react').Users,
          iconBg: '#E3F2FD',
          iconColor: '#1F3C88',
        },
        {
          id: 2,
          title: 'Rooms Managed',
          value: '0',
          description: 'No data available',
          icon: require('lucide-react').Building2,
          iconBg: '#E0F2F1',
          iconColor: '#2BBBAD',
        },
        {
          id: 3,
          title: 'Pending Complaints',
          value: '0',
          description: 'No data available',
          icon: require('lucide-react').MessageSquare,
          iconBg: '#FFF3E0',
          iconColor: '#FB8C00',
        },
        {
          id: 4,
          title: 'Announcements',
          value: '0',
          description: 'No data available',
          icon: require('lucide-react').Megaphone,
          iconBg: '#F3E5F5',
          iconColor: '#1F3C88',
        },
      ]);
      setActivities([]);
    }
  };

  return (
    <div className="warden-dashboard">

      {/* Welcome Header */}
      <div className="warden-welcome">
        <h1 className="warden-welcome-title">Welcome back, {wardenName}</h1>
        <p className="warden-welcome-sub">Here's what's happening in {blockName} today.</p>
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
        <PendingComplaints
          complaints={complaints}
          onViewAll={() => navigate('/warden/complaints')}
          onViewComplaint={(complaint) => {
            const complaintId = complaint?.code || complaint?.id;
            if (!complaintId) return;
            navigate(`/warden/complaints/view/${encodeURIComponent(complaintId)}`, {
              state: { complaint },
            });
          }}
        />
        <SystemAlerts alerts={alerts} />
      </div>

      {/* Recent Activity */}
      <RecentActivity activities={activities} />

    </div>
  );
};

export default WardenDashboard;