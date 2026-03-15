import React from 'react';

const StatCard = ({ title, value, description, icon: Icon, iconBg, iconColor }) => {
  return (
    <div className="warden-stat-card">
      <div className="warden-stat-body">
        <div className="warden-stat-text">
          <p className="warden-stat-label">{title}</p>
          <h2 className="warden-stat-value">{value}</h2>
          <p className="warden-stat-desc">{description}</p>
        </div>
        <div className="warden-stat-icon" style={{ backgroundColor: iconBg }}>
          <Icon size={24} style={{ color: iconColor }} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;