import React from 'react';
import { dashboardData } from '../../data/dashboardData';
import '../../styles/admin/RecentActivity.css';

const RecentActivity = () => {
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
            {dashboardData.recentActivity.map((activity) => (
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
        {dashboardData.recentActivity.map((activity) => (
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