// src/pages/student/announcements/AnnouncementDetails.jsx
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Users, Calendar, Clock, FileText, Info } from 'lucide-react';
import '../../../styles/student/announcements/announcementDetails.css';

// ── Dummy data (replace with API call) ────────────────────────
const dummyAnnouncements = [
  {
    id: '1',
    category: 'Maintenance',
    priority: 'High Priority',
    status: 'Active',
    title: 'Annual Hostel Maintenance & Safety Drill Schedule',
    description: `Please be informed that the annual maintenance check and safety drill is scheduled for this weekend.

This includes:
- Electrical inspections of all floors
- Plumbing checks and valve maintenance
- Fire safety walkthroughs and extinguisher checks
- Emergency exit verification

Schedule:
Saturday, Oct 12: Blocks A & B (09:00 AM - 05:00 PM)
Sunday, Oct 13: Blocks C & D (09:00 AM - 05:00 PM)

During these times, there may be brief interruptions in power and water services. We appreciate your cooperation in maintaining a safe environment.

Regards,
Hostel Administration`,
    targetAudience: 'All Students',
    createdDate: 'Oct 12, 2024, 09:00 AM',
    expiryDate: 'Oct 15, 2024, 05:00 PM',
    postedBy: 'Chief Warden',
    accentColor: '#F59E0B',
  },
  {
    id: '2',
    category: 'Important',
    priority: 'High Priority',
    status: 'Active',
    title: 'Urgent: Water Supply Interruption in Block A & B',
    description: `Due to a pipe burst near the main tank, water supply will be suspended for Block A and B between 10 AM and 2 PM today.

We advise residents to store sufficient water for immediate needs.

Affected Blocks: A and B
Duration: 10:00 AM – 2:00 PM

Regards,
Estate Manager`,
    targetAudience: 'Block A & B Residents',
    createdDate: 'Oct 11, 2024, 07:30 AM',
    expiryDate: 'Oct 11, 2024, 06:00 PM',
    postedBy: 'Estate Manager',
    accentColor: '#EF4444',
  },
];

const priorityClass = (p) => {
  if (p === 'High Priority') return 'sad-priority-high';
  if (p === 'Urgent') return 'sad-priority-urgent';
  return 'sad-priority-normal';
};

const statusClass = (s) => {
  if (s === 'Active') return 'sad-status-active';
  if (s === 'Scheduled') return 'sad-status-scheduled';
  return 'sad-status-expired';
};

const AnnouncementDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const announcement = dummyAnnouncements.find((a) => a.id === id);

  if (!announcement) {
    return (
      <div className="sad-page">
        <div className="sad-error">Announcement not found.</div>
      </div>
    );
  }

  return (
    <div className="sad-page">
      {/* Breadcrumb */}
      <div className="sad-breadcrumb">
        <span className="sad-bc-link" onClick={() => navigate('/student/dashboard')}>Dashboard</span>
        <span className="sad-bc-sep">›</span>
        <span className="sad-bc-link" onClick={() => navigate('/student/announcements')}>Announcements</span>
        <span className="sad-bc-sep">›</span>
        <span className="sad-bc-active">View Details</span>
      </div>

      {/* Page Header */}
      <div className="sad-page-header">
        <div className="sad-title-row">
          <h1 className="sad-page-title">Announcement Details</h1>
          <div className="sad-badges">
            {announcement.priority && (
              <span className={`sad-priority-badge ${priorityClass(announcement.priority)}`}>
                {announcement.priority}
              </span>
            )}
            <span className={`sad-status-badge ${statusClass(announcement.status)}`}>
              {announcement.status}
            </span>
          </div>
        </div>
      </div>

      {/* Content Card */}
      <div className="sad-card">
        <div className="sad-card-accent" style={{ background: announcement.accentColor }} />
        <div className="sad-card-inner">
          <span className="sad-category-tag">{announcement.category}</span>
          <h2 className="sad-title">{announcement.title}</h2>

          <div className="sad-meta">
            <div className="sad-meta-item"><Users size={13} /> {announcement.targetAudience}</div>
            <div className="sad-meta-item"><Calendar size={13} /> Created: {announcement.createdDate}</div>
            <div className="sad-meta-item"><Clock size={13} /> Expires: {announcement.expiryDate}</div>
          </div>

          <hr className="sad-divider" />

          <div className="sad-description">
            {announcement.description.split('\n').map((line, i) => (
              <p key={i}>{line || <br />}</p>
            ))}
          </div>

          <div className="sad-footer">
            <span className="sad-published-by">
              <Info size={13} /> Post published by <strong>{announcement.postedBy}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Back button */}
      <div className="sad-actions">
        <button className="sad-back-btn" onClick={() => navigate('/student/announcements')}>
          <ArrowLeft size={15} /> Back to Announcements
        </button>
      </div>
    </div>
  );
};

export default AnnouncementDetails;