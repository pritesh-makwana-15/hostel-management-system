// src/components/student/announcements/AnnouncementCard.jsx
import React from 'react';
import { Bookmark, Share2, ChevronRight } from 'lucide-react';

const categoryColors = {
  Maintenance: { bg: '#FFF8E7', color: '#D97706', border: '#FDE68A' },
  Important:   { bg: '#FEF2F2', color: '#DC2626', border: '#FECACA' },
  Event:       { bg: '#F0FDF4', color: '#16A34A', border: '#BBF7D0' },
  General:     { bg: '#EEF2FF', color: '#1F3C88', border: '#C7D2FE' },
};

const priorityColors = {
  'High Priority': { bg: '#FEF2F2', color: '#EF4444', dot: '#EF4444' },
};

const AnnouncementCard = ({ announcement, bookmarked, onBookmark, onReadMore }) => {
  const {
    category, priority, isNew, isCritical, criticalCount,
    title, description, postedBy, department, date, time,
    avatarInitials, accentColor, isScheduled, scheduledNote, hasRead,
  } = announcement;

  const catStyle = categoryColors[category] || categoryColors.General;
  const priStyle = priority ? priorityColors[priority] : null;

  return (
    <div className={`sac-card ${hasRead ? 'sac-card--read' : ''}`}>
      {/* Left color accent bar */}
      <div className="sac-accent-bar" style={{ background: accentColor }} />

      <div className="sac-body">
        {/* Top badges row */}
        <div className="sac-badges-row">
          <div className="sac-badges-left">
            <span
              className="sac-category-badge"
              style={{ background: catStyle.bg, color: catStyle.color, border: `1px solid ${catStyle.border}` }}
            >
              {category}
            </span>

            {priority && priStyle && (
              <span
                className="sac-priority-badge"
                style={{ background: priStyle.bg, color: priStyle.color }}
              >
                <span className="sac-priority-dot" style={{ background: priStyle.dot }} />
                {priority}
              </span>
            )}

            {isNew && <span className="sac-new-badge">NEW</span>}

            {isCritical && criticalCount && (
              <span className="sac-critical-badge">{criticalCount} Critical</span>
            )}
          </div>

          <div className="sac-actions">
            <button
              className={`sac-icon-btn ${bookmarked ? 'sac-icon-btn--active' : ''}`}
              onClick={(e) => { e.stopPropagation(); onBookmark(); }}
              title="Bookmark"
            >
              <Bookmark size={15} fill={bookmarked ? 'currentColor' : 'none'} />
            </button>
            <button className="sac-icon-btn" title="Share">
              <Share2 size={15} />
            </button>
          </div>
        </div>

        {/* Scheduled alert banner */}
        {isScheduled && scheduledNote && (
          <div className="sac-scheduled-banner">
            <span className="sac-scheduled-dot" />
            {scheduledNote}
          </div>
        )}

        {/* Title */}
        <h2 className="sac-title" onClick={onReadMore}>{title}</h2>

        {/* Description */}
        <p className="sac-description">{description}</p>

        {/* Footer */}
        <div className="sac-footer">
          <div className="sac-poster">
            <div className="sac-avatar" style={{ background: accentColor }}>
              {avatarInitials}
            </div>
            <div className="sac-poster-info">
              <span className="sac-poster-name">{postedBy}</span>
              <span className="sac-poster-meta">
                {department} · {date} · {time}
              </span>
            </div>
          </div>

          <button className="sac-read-btn" onClick={onReadMore}>
            Read Full Notice <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementCard;