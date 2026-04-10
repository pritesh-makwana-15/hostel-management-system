import React, { useState, useEffect } from 'react';
import { adminDashboardApi } from '../../services/adminDashboardApi';
import { dashboardData } from '../../data/dashboardData';
import '../../styles/admin/RecentActivity.css';

const RecentActivity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRecentActivity();
  }, []);

  const fetchRecentActivity = async () => {
    try {
      setLoading(true);
      const res = await adminDashboardApi.getRecentActivity();
      console.log('RecentActivity: Recent activity response:', res);
      
      if (res.data && res.data.status === 'success') {
        const dbActivity = res.data.data || {};
        
        // Map database activity to expected format
        const mappedActivities = [
          ...(dbActivity.recentRegistrations || []).map((reg, index) => ({
            id: `db-reg-${index}`,
            type: 'Student Registration',
            description: `New student registered`,
            dateTime: new Date().toLocaleString(),
            status: 'Completed',
            statusColor: '#10B981'
          })),
          ...(dbActivity.recentComplaints || []).map((complaint, index) => ({
            id: `db-comp-${index}`,
            type: 'Complaint Logged',
            description: `${complaint.title || 'New complaint'}`,
            dateTime: new Date().toLocaleString(),
            status: 'Pending',
            statusColor: '#F59E0B'
          })),
          ...(dbActivity.recentPayments || []).map((payment, index) => ({
            id: `db-payment-${index}`,
            type: 'Fee Payment',
            description: `${payment.studentName || 'Student'} paid fee`,
            dateTime: new Date().toLocaleString(),
            status: 'Completed',
            statusColor: '#10B981'
          }))
        ];
        
        setActivities(mappedActivities.length > 0 ? mappedActivities : dashboardData.recentActivity);
      } else {
        // Use dummy data as fallback if API fails
        console.log('RecentActivity: Using dummy data as fallback');
        setActivities(dashboardData.recentActivity);
      }
    } catch (error) {
      console.error('RecentActivity: Error fetching recent activity:', error);
      console.log('RecentActivity: Using dummy data as fallback');
      // Use dummy data as fallback
      setActivities(dashboardData.recentActivity);
      setError('Failed to load recent activity');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="recent-activity-card">
        <h2 className="section-title">Recent Activity</h2>
        <div className="loading">Loading recent activity...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="recent-activity-card">
        <h2 className="section-title">Recent Activity</h2>
        <div className="error" style={{ color: '#EF4444', textAlign: 'center', padding: '20px' }}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="recent-activity-card">
      <h2 className="section-title">Recent Activity</h2>
      
      {/* Desktop/Tablet Table */}
      <div className="activity-table">
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Description</th>
              <th>Date & Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity) => (
              <tr key={activity.id}>
                <td className="activity-type">{activity.type}</td>
                <td className="activity-description">{activity.description}</td>
                <td className="activity-datetime">{activity.dateTime}</td>
                <td>
                  <span 
                    className="activity-status"
                    style={{ 
                      backgroundColor: `${activity.statusColor}15`, 
                      color: activity.statusColor 
                    }}
                  >
                    {activity.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="activity-cards">
        {activities.map((activity) => (
          <div key={activity.id} className="activity-card-mobile">
            <div className="activity-card-header">
              <span className="activity-card-type">{activity.type}</span>
              <span 
                className="activity-status"
                style={{ 
                  backgroundColor: `${activity.statusColor}15`, 
                  color: activity.statusColor 
                }}
              >
                {activity.status}
              </span>
            </div>
            <p className="activity-card-description">{activity.description}</p>
            <span className="activity-card-datetime">{activity.dateTime}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;