import React from 'react';
import { dashboardData } from '../../data/dashboardData';
import '../../styles/admin/Alerts.css';

const Alerts = () => {
  return (
    <div className="alerts-container">
      {/* Pending Complaints */}
      <div className="alert-card">
        <h2 className="section-title">Pending Complaints</h2>
        <div className="alert-list">
          {dashboardData.pendingComplaints.map((complaint) => (
            <div key={complaint.id} className="alert-item">
              <div className="alert-content">
                <h4 className="alert-title">{complaint.title}</h4>
                <p className="alert-subtitle">Student: {complaint.student}</p>
              </div>
              <div className="alert-actions">
                <span 
                  className="alert-badge"
                  style={{ 
                    backgroundColor: `${complaint.statusColor}15`, 
                    color: complaint.statusColor 
                  }}
                >
                  {complaint.status}
                </span>
                <button className="alert-btn">View</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pending Fees */}
      <div className="alert-card">
        <h2 className="section-title">Pending Fees</h2>
        <div className="alert-list">
          {dashboardData.pendingFees.map((fee) => (
            <div key={fee.id} className="alert-item">
              <div className="alert-content">
                <h4 className="alert-title">{fee.student}</h4>
                <p className="alert-subtitle">{fee.amount}</p>
              </div>
              <div className="alert-actions">
                <span 
                  className="alert-badge"
                  style={{ 
                    backgroundColor: `${fee.statusColor}15`, 
                    color: fee.statusColor 
                  }}
                >
                  {fee.status}
                </span>
                <button className="alert-btn-primary">Collect Now</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Alerts;