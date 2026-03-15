import React from 'react';

const statusStyle = (status) => {
  if (status === 'Pending') {
    return { backgroundColor: '#FFF3E0', color: '#FB8C00' };
  }
  if (status === 'In Progress') {
    return { backgroundColor: '#E3F2FD', color: '#1976D2' };
  }
  return { backgroundColor: '#E8F5E9', color: '#43A047' };
};

const PendingComplaints = ({ complaints }) => {
  return (
    <div className="warden-section-card warden-complaints-card">
      <div className="warden-complaints-header">
        <h2 className="warden-section-title">Pending Complaints</h2>
        <button className="warden-view-all-btn">View All Complaints</button>
      </div>
      <div className="warden-complaints-list">
        {complaints.map((c) => (
          <div key={c.id} className="warden-complaint-item">
            <div className="warden-complaint-main">
              <div className="warden-complaint-top">
                <span className="warden-complaint-name">{c.studentName}</span>
                <span className="warden-complaint-badge" style={statusStyle(c.status)}>
                  {c.status}
                </span>
              </div>
              <p className="warden-complaint-title">{c.title}</p>
            </div>
            <div className="warden-complaint-meta">
              <span className="warden-complaint-time">{c.time}</span>
              <button className="warden-complaint-view-btn">View</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PendingComplaints;