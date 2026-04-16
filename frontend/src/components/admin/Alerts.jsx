import React, { useEffect, useState } from 'react';
import { adminDashboardApi } from '../../services/adminDashboardApi';
import '../../styles/admin/Alerts.css';

const Alerts = () => {
  const [pendingComplaints, setPendingComplaints] = useState([]);
  const [pendingFees, setPendingFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadAlerts = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await adminDashboardApi.getAlerts();
        if (response.data?.status === 'success') {
          const alerts = response.data.data || {};
          setPendingComplaints(alerts.pendingComplaints || []);
          setPendingFees(alerts.pendingFees || []);
        } else {
          setPendingComplaints([]);
          setPendingFees([]);
          setError('Failed to load alerts');
        }
      } catch {
        setPendingComplaints([]);
        setPendingFees([]);
        setError('Failed to load alerts');
      } finally {
        setLoading(false);
      }
    };

    loadAlerts();
  }, []);

  if (loading) {
    return <div className="alerts-container"><div className="loading">Loading alerts...</div></div>;
  }

  if (error) {
    return <div className="alerts-container"><div className="error" style={{ color: '#EF4444' }}>{error}</div></div>;
  }

  return (
    <div className="alerts-container">
      {/* Pending Complaints */}
      <div className="alert-card">
        <h2 className="section-title">Pending Complaints</h2>
        <div className="alert-list">
          {pendingComplaints.map((complaint) => (
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
          {pendingFees.map((fee) => (
            <div key={fee.id} className="alert-item">
              <div className="alert-content">
                <h4 className="alert-title">{fee.student}</h4>
                <p className="alert-subtitle">₹{Number(fee.amount || 0).toLocaleString('en-IN')}</p>
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