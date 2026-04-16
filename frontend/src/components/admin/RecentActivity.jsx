import React, { useState, useEffect } from 'react';
import { adminDashboardApi } from '../../services/adminDashboardApi';
import '../../styles/admin/RecentActivity.css';

const RecentActivity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRecentActivity();
  }, []);

  const formatDateTime = (timestamp) => {
    if (!timestamp) {
      return '-';
    }
    const parsed = new Date(timestamp);
    if (Number.isNaN(parsed.getTime())) {
      return timestamp;
    }
    return parsed.toLocaleString();
  };

  const fetchRecentActivity = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await adminDashboardApi.getRecentActivity();

      if (res.data?.status === 'success') {
        const dbActivity = res.data.data || {};

        const mappedActivities = [
          ...(dbActivity.recentRegistrations || []).map((reg, index) => ({
            id: `db-reg-${index}`,
            type: 'Student Registration',
            description: `${reg.studentName || 'Student'} registered`,
            sortTimestamp: reg.timestamp || '',
            dateTime: formatDateTime(reg.timestamp),
            status: 'Completed',
            statusColor: '#10B981'
          })),
          ...(dbActivity.recentComplaints || []).map((complaint, index) => ({
            id: `db-comp-${index}`,
            type: 'Complaint Logged',
            description: `${complaint.title || 'Complaint'} by ${complaint.studentName || 'Student'}`,
            sortTimestamp: complaint.timestamp || '',
            dateTime: formatDateTime(complaint.timestamp),
            status: complaint.status || 'Open',
            statusColor: complaint.status?.toLowerCase() === 'resolved' ? '#10B981' : '#F59E0B'
          })),
          ...(dbActivity.recentPayments || []).map((payment, index) => ({
            id: `db-payment-${index}`,
            type: 'Fee Payment',
            description: `${payment.studentName || 'Student'} paid ₹${Number(payment.amount || 0).toLocaleString('en-IN')}`,
            sortTimestamp: payment.timestamp || '',
            dateTime: formatDateTime(payment.timestamp),
            status: payment.status || 'PENDING',
            statusColor: payment.status?.toLowerCase() === 'verified' ? '#10B981' : '#F59E0B'
          }))

        ].sort((a, b) => new Date(b.sortTimestamp).getTime() - new Date(a.sortTimestamp).getTime()).slice(0, 10);

        setActivities(mappedActivities);
      } else {
        setActivities([]);
        setError('Failed to load recent activity');
      }
    } catch {
      setActivities([]);
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
        {activities.length === 0 ? (
          <div className="loading" style={{ padding: '20px' }}>No recent activity found.</div>
        ) : (
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
        )}
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