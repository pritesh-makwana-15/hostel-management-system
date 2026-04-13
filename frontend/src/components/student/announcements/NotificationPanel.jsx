// src/components/student/announcements/NotificationPanel.jsx
import React from 'react';
import { Clock } from 'lucide-react';

const NotificationPanel = ({ notifications, onMarkAllRead, onClose }) => {
  return (
    <div className="snp-panel">
      <div className="snp-header">
        <span className="snp-title">Notifications</span>
        <button className="snp-mark-read" onClick={onMarkAllRead}>
          Mark all as read
        </button>
      </div>

      <div className="snp-list">
        {notifications.map((notif) => (
          <div key={notif.id} className={`snp-item ${notif.isUnread ? 'snp-item--unread' : ''}`}>
            {notif.isUnread && <span className="snp-unread-dot" />}
            <div className="snp-item-body">
              <p className="snp-message">{notif.message}</p>
              <span className="snp-time">
                <Clock size={11} /> {notif.time}
              </span>
            </div>
          </div>
        ))}
      </div>

      <button className="snp-view-all" onClick={onClose}>
        View All Notifications
      </button>
    </div>
  );
};

export default NotificationPanel;