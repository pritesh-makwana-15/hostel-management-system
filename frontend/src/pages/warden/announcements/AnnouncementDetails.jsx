// src/pages/warden/announcements/AnnouncementDetails.jsx
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, Edit, Trash2, Users, Calendar, Clock,
  Download, FileText, Image, Info
} from 'lucide-react';
import { getWardenAnnouncementById } from '../../../data/wardenAnnouncementsData';
import '../../../styles/warden/announcements/announcementDetails.css';

const AnnouncementDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const ann = getWardenAnnouncementById(id) || {
    id: 'ANN-2024-012',
    title: 'Urgent: Water Supply Maintenance in Block A & B',
    description: `Dear Students,\n\nPlease be informed that a scheduled water supply maintenance check will be conducted for Blocks A & B tomorrow.\n\nDuring this period, there will be a temporary suspension of water supply to ensure the cleaning of overhead tanks and plumbing inspections.\n\nDetails:\n- Date: Saturday, Oct 12, 2024\n- Time: 10:00 AM to 02:00 PM\n- Affected Areas: All rooms in Block A and Block B\n\nWe advise all residents to store sufficient water for their basic needs prior to the commencement of work. We regret any inconvenience this may cause.\n\nRegards,\nHostel Administration`,
    targetAudience: 'All Students in Block A & B',
    createdDate: 'Oct 12, 2024, 09:00 AM',
    expiryDate: 'Oct 13, 2024, 05:00 PM',
    status: 'Active',
    priority: 'Urgent',
    createdBy: 'Chief Warden',
    attachments: [
      { name: 'Maintenance_Schedule.pdf', size: '1.2 MB', type: 'pdf' },
      { name: 'Tank_Cleaning_SOP.pdf', size: '850 KB', type: 'pdf' },
      { name: 'Notice_Board_Photo.jpg', size: '2.4 MB', type: 'image' },
    ],
    deliveryStatus: {
      totalRecipients: 1240,
      delivered: 1240,
      read: 982,
    },
    recentActivity: [
      { name: 'Rahul Sharma', room: 'A-102', action: 'Read', time: '10 mins ago', avatar: 'R' },
      { name: 'Ananya Iyer', room: 'B-305', action: 'Read', time: '22 mins ago', avatar: 'A' },
      { name: 'Vikram Singh', room: 'A-208', action: 'Delivered', time: '45 mins ago', avatar: 'V' },
      { name: 'Sneha Patel', room: 'B-112', action: 'Read', time: '1 hour ago', avatar: 'S' },
      { name: 'Kabir Das', room: 'A-415', action: 'Read', time: '2 hours ago', avatar: 'K' },
    ],
  };

  const priorityClass = (p) => {
    if (p === 'Urgent') return 'ad-priority-urgent';
    if (p === 'Important') return 'ad-priority-important';
    return 'ad-priority-normal';
  };

  const statusClass = (s) => {
    if (s === 'Active') return 'ad-status-active';
    if (s === 'Scheduled') return 'ad-status-scheduled';
    return 'ad-status-expired';
  };

  const actionClass = (action) => {
    if (action === 'Read') return 'ad-action-read';
    return 'ad-action-delivered';
  };

  const deliveredPct = ann.deliveryStatus
    ? Math.round((ann.deliveryStatus.delivered / ann.deliveryStatus.totalRecipients) * 100)
    : 0;
  const readPct = ann.deliveryStatus
    ? Math.round((ann.deliveryStatus.read / ann.deliveryStatus.totalRecipients) * 100)
    : 0;

  return (
    <div className="ad-page">
      {/* Breadcrumb */}
      <div className="ad-breadcrumb">
        <span onClick={() => navigate('/warden/dashboard')} className="ad-breadcrumb-link">Dashboard</span>
        <span className="ad-sep">›</span>
        <span onClick={() => navigate('/warden/announcements')} className="ad-breadcrumb-link">Announcements</span>
        <span className="ad-sep">›</span>
        <span className="ad-breadcrumb-active">View Details</span>
      </div>

      {/* Page Header */}
      <div className="ad-page-header">
        <div className="ad-page-title-row">
          <h1 className="ad-page-title">Announcement Details</h1>
          <div className="ad-badges">
            <span className={`ad-priority-badge ${priorityClass(ann.priority)}`}>{ann.priority} Priority</span>
            <span className={`ad-status-badge ${statusClass(ann.status)}`}>{ann.status}</span>
          </div>
        </div>
        <div className="ad-ref-id">Ref ID: <span className="ad-ref-id-val">{ann.id}</span></div>
      </div>

      <div className="ad-layout">
        {/* Left Column */}
        <div className="ad-left">
          {/* Main Content Card */}
          <div className="ad-content-card">
            <h2 className="ad-ann-title">{ann.title}</h2>

            <div className="ad-meta-row">
              <div className="ad-meta-item">
                <Users size={14} />
                <span>{ann.targetAudience}</span>
              </div>
              <div className="ad-meta-item">
                <Calendar size={14} />
                <span>Created: {ann.createdDate}</span>
              </div>
              <div className="ad-meta-item">
                <Clock size={14} />
                <span>Expires: {ann.expiryDate}</span>
              </div>
            </div>

            <div className="ad-divider" />

            <div className="ad-description">
              {ann.description.split('\n').map((line, i) => (
                <p key={i}>{line || <br />}</p>
              ))}
            </div>

            {/* Attachments */}
            {ann.attachments && ann.attachments.length > 0 && (
              <div className="ad-attachments">
                <div className="ad-attachments-title">
                  <FileText size={16} /> Attachments ({ann.attachments.length})
                </div>
                <div className="ad-attachments-grid">
                  {ann.attachments.map((att, i) => (
                    <div key={i} className="ad-attachment-item">
                      <div className={`ad-att-icon ${att.type === 'image' ? 'ad-att-img' : 'ad-att-pdf'}`}>
                        {att.type === 'image' ? <Image size={18} /> : <FileText size={18} />}
                      </div>
                      <div className="ad-att-info">
                        <span className="ad-att-name">{att.name}</span>
                        <span className="ad-att-size">{att.size}</span>
                      </div>
                      <button className="ad-att-download">
                        <Download size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="ad-card-footer">
              <span className="ad-published-by">
                <Info size={13} /> Post published by <strong>{ann.createdBy}</strong>
              </span>
              <button className="ad-preview-btn">👁 Preview Mode</button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="ad-action-row">
            <button className="ad-btn-back" onClick={() => navigate('/warden/announcements')}>
              <ArrowLeft size={16} /> Back to List
            </button>
            <div className="ad-action-right">
              <button className="ad-btn-edit" onClick={() => navigate('/warden/announcements/create')}>
                <Edit size={16} /> Edit Content
              </button>
              <button className="ad-btn-delete">
                <Trash2 size={16} /> Delete Announcement
              </button>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="ad-right">
          {/* Delivery Status */}
          <div className="ad-delivery-card">
            <div className="ad-delivery-header">
              <span className="ad-delivery-title">
                <Clock size={15} /> Delivery Status
              </span>
              <button className="ad-delivery-info"><Info size={14} /></button>
            </div>

            <div className="ad-total-recipients">
              <div>
                <div className="ad-total-label">TOTAL RECIPIENTS</div>
                <div className="ad-total-value">{ann.deliveryStatus?.totalRecipients?.toLocaleString()}</div>
              </div>
              <div className="ad-recipients-icon">
                <Users size={22} />
              </div>
            </div>

            <div className="ad-metric">
              <div className="ad-metric-row">
                <div className="ad-metric-icon"><Clock size={13} /></div>
                <span>Delivered</span>
                <span className="ad-metric-val">
                  {ann.deliveryStatus?.delivered?.toLocaleString()} / {ann.deliveryStatus?.totalRecipients?.toLocaleString()}
                </span>
                <span className="ad-metric-pct">{deliveredPct}%</span>
              </div>
              <div className="ad-progress-bar">
                <div className="ad-progress-fill ad-progress-blue" style={{ width: `${deliveredPct}%` }} />
              </div>
            </div>

            <div className="ad-metric">
              <div className="ad-metric-row">
                <div className="ad-metric-icon"><Users size={13} /></div>
                <span>Read Receipts</span>
                <span className="ad-metric-val">
                  {ann.deliveryStatus?.read?.toLocaleString()} / {ann.deliveryStatus?.totalRecipients?.toLocaleString()}
                </span>
                <span className="ad-metric-pct">{readPct}%</span>
              </div>
              <div className="ad-progress-bar">
                <div className="ad-progress-fill ad-progress-teal" style={{ width: `${readPct}%` }} />
              </div>
            </div>

            <button className="ad-analytics-btn">View Full Delivery Analytics ›</button>
          </div>

          {/* Recent Activity */}
          {ann.recentActivity && ann.recentActivity.length > 0 && (
            <div className="ad-activity-card">
              <div className="ad-activity-title">
                <Clock size={15} /> Recent Activity
              </div>
              <div className="ad-activity-list">
                {ann.recentActivity.map((act, i) => (
                  <div key={i} className="ad-activity-item">
                    <div className="ad-activity-avatar">{act.avatar}</div>
                    <div className="ad-activity-info">
                      <span className="ad-activity-name">{act.name}</span>
                      <span className="ad-activity-room">Room: {act.room}</span>
                    </div>
                    <div className="ad-activity-right">
                      <span className={`ad-activity-action ${actionClass(act.action)}`}>{act.action}</span>
                      <span className="ad-activity-time">{act.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="ad-see-all-btn">
                See All {ann.deliveryStatus?.totalRecipients?.toLocaleString()} Logs
              </button>
            </div>
          )}

          {/* Warden Tip */}
          <div className="ad-tip-card">
            <div className="ad-tip-title">🔔 Warden Tip</div>
            <p className="ad-tip-text">
              This announcement was broadcasted via Mobile App notification, Email, and SMS (for
              urgent priority). Real-time delivery stats are updated every 5 minutes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementDetails;