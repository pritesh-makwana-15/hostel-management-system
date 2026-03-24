// src/components/warden/announcements/AnnouncementCard.jsx
import React from 'react';

const AnnouncementCard = ({ icon: Icon, label, value, iconBg, iconColor }) => {
  return (
    <div className="wa-stat-card">
      <div className="wa-stat-icon" style={{ background: iconBg, color: iconColor }}>
        <Icon size={22} />
      </div>
      <div className="wa-stat-body">
        <div className="wa-stat-label">{label}</div>
        <div className="wa-stat-value">{value}</div>
      </div>
    </div>
  );
};

export default AnnouncementCard;