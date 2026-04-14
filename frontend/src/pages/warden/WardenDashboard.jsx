import React, { useState, useEffect } from 'react';
import StatCard from '../../components/ui/dashboard/StatCard';
import QuickActions from '../../components/ui/dashboard/QuickActions';
import PendingComplaints from '../../components/ui/dashboard/PendingComplaints';
import SystemAlerts from '../../components/ui/dashboard/SystemAlerts';
import RecentActivity from '../../components/ui/dashboard/RecentActivity';
import { quickActions } from '../../data/wardenDashboardData';
import '../../styles/warden/WardenDashboard.css';

const WardenDashboard = () => {
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
      const token = localStorage.getItem('hms_token');
      
      // Fetch warden profile data
      const profileResponse = await fetch('http://localhost:8080/api/warden/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        if (profileData.data) {
          setWardenName(profileData.data.name || 'Warden');
          setBlockName(profileData.data.block || 'Hostel');
        }
      }

      // Fetch dashboard statistics
      const statsResponse = await fetch('http://localhost:8080/api/warden/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        if (statsData.data) {
          setStats([
            {
              id: 1,
              title: 'Students Under Warden',
              value: statsData.data.studentsUnderWarden || '0',
              description: statsData.data.newStudentsThisMonth || '0 new this month',
              icon: require('lucide-react').Users,
              iconBg: '#E3F2FD',
              iconColor: '#1F3C88',
            },
            {
              id: 2,
              title: 'Rooms Managed',
              value: statsData.data.roomsManaged || '0',
              description: statsData.data.vacanciesRemaining || '0 vacancies',
              icon: require('lucide-react').Building2,
              iconBg: '#E0F2F1',
              iconColor: '#2BBBAD',
            },
            {
              id: 3,
              title: 'Pending Complaints',
              value: statsData.data.pendingComplaints || '0',
              description: statsData.data.urgentEscalations || '0 urgent escalations',
              icon: require('lucide-react').MessageSquare,
              iconBg: '#FFF3E0',
              iconColor: '#FB8C00',
            },
            {
              id: 4,
              title: 'Announcements',
              value: statsData.data.announcementsCount || '0',
              description: statsData.data.lastAnnouncementTime || 'No recent announcements',
              icon: require('lucide-react').Megaphone,
              iconBg: '#F3E5F5',
              iconColor: '#1F3C88',
            },
          ]);
        }
      }

      // Fetch pending complaints
      const complaintsResponse = await fetch('http://localhost:8080/api/warden/complaints/pending', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (complaintsResponse.ok) {
        const complaintsData = await complaintsResponse.json();
        if (complaintsData.data) {
          setComplaints(complaintsData.data.slice(0, 5).map((complaint, index) => ({
            id: complaint.id || index + 1,
            studentName: complaint.studentName || 'Unknown Student',
            title: complaint.title || complaint.description || 'Untitled Complaint',
            room: complaint.roomNumber || 'Unknown Room',
            status: complaint.status || 'Pending',
            time: complaint.createdAt || 'Just now',
          })));
        }
      }

      // Fetch system alerts
      const alertsResponse = await fetch('http://localhost:8080/api/warden/alerts', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (alertsResponse.ok) {
        const alertsData = await alertsResponse.json();
        if (alertsData.data) {
          setAlerts(alertsData.data.slice(0, 5).map((alert, index) => ({
            id: alert.id || index + 1,
            message: alert.message || 'System alert',
            time: alert.createdAt || 'Just now',
            active: alert.active !== false,
          })));
        }
      }

      // Fetch recent activities
      const activitiesResponse = await fetch('http://localhost:8080/api/warden/activities', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (activitiesResponse.ok) {
        const activitiesData = await activitiesResponse.json();
        if (activitiesData.data) {
          setActivities(activitiesData.data.slice(0, 5).map((activity, index) => ({
            id: activity.id || index + 1,
            type: activity.type || 'System Activity',
            description: activity.description || 'Activity performed',
            dateTime: activity.createdAt || new Date().toISOString(),
            status: activity.status || 'Completed',
          })));
        }
      }

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
        <PendingComplaints complaints={complaints} />
        <SystemAlerts alerts={alerts} />
      </div>

      {/* Recent Activity */}
      <RecentActivity activities={activities} />

    </div>
  );
};

export default WardenDashboard;