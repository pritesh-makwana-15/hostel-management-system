import React from 'react';

const SystemAlerts = ({ alerts }) => {
  return (
    <div className="warden-section-card warden-alerts-card">
      <h2 className="warden-section-title">System Alerts</h2>
      <div className="warden-alerts-list">
        {alerts.map((alert) => (
          <div key={alert.id} className="warden-alert-item">
            <span
              className="warden-alert-dot"
              style={{ backgroundColor: alert.active ? '#1F3C88' : '#D1D5DB' }}
            />
            <div className="warden-alert-content">
              <p className="warden-alert-message">{alert.message}</p>
              <span className="warden-alert-time">{alert.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SystemAlerts;