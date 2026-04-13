// src/components/student/announcements/NotificationItem.jsx
import React from 'react';
import { Clock } from 'lucide-react';

const NotificationItem = ({ notification }) => {
  const { message, time, isUnread } = notification;
  return (
    <div className={`sni-item ${isUnread ? 'sni-item--unread' : ''}`}>
      {isUnread && <span className="sni-dot" />}
      <div className="sni-body">
        <p className="sni-message">{message}</p>
        <span className="sni-time">
          <Clock size={11} /> {time}
        </span>
      </div>
    </div>
  );
};

export default NotificationItem;