// src/pages/warden/announcements/AnnouncementDetails.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, Edit, Trash2, Users, Calendar, Clock,
  Download, FileText, Image, Info
} from 'lucide-react';
import { wardenApi } from '../../../services/wardenApi';
import '../../../styles/warden/announcements/announcementDetails.css';

const AnnouncementDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [announcement, setAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const formatDate = (value) => {
    if (!value) return '';
    return new Date(value).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const mapAnnouncement = (item) => {
    let targetAudience = 'All Students';
    if (item.audience === 'WARDENS') targetAudience = 'Wardens';
    else if (item.audience === 'BOTH') targetAudience = 'All Students & Wardens';

    let status = 'Scheduled';
    if (item.status === 'PUBLISHED') status = 'Active';
    else if (item.status === 'EXPIRED') status = 'Expired';

    return {
      id: item.id,
      title: item.title,
      description: item.message,
      targetAudience,
      createdDate: formatDate(item.createdAt),
      expiryDate: formatDate(item.expiryDate),
      status,
      priority:
        item.priority?.charAt(0).toUpperCase() + item.priority?.slice(1).toLowerCase(),
      createdBy: item.createdBy,
      attachments: [],
      deliveryStatus: { totalRecipients: 0, delivered: 0, read: 0 },
      recentActivity: [],
    };
  };

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        setLoading(true);
        const response = await wardenApi.getActiveAnnouncements();
        const apiData = response.data?.data || [];
        const found = apiData.find((item) => String(item.id) === id);
        if (found) {
          setAnnouncement(mapAnnouncement(found));
        } else {
          setError('Announcement not found or not currently active.');
        }
      } catch (err) {
        console.error('Error loading announcement details:', err);
        setError('Unable to load announcement details.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncement();
  }, [id]);

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

  const deliveredPct = announcement?.deliveryStatus
    ? Math.round((announcement.deliveryStatus.delivered / announcement.deliveryStatus.totalRecipients) * 100)
    : 0;
  const readPct = announcement?.deliveryStatus
    ? Math.round((announcement.deliveryStatus.read / announcement.deliveryStatus.totalRecipients) * 100)
    : 0;

  if (loading) {
    return (
      <div className="ad-page">
        <p className="ad-loading">Loading announcement details...</p>
      </div>
    );
  }

  if (error || !announcement) {
    return (
      <div className="ad-page ad-error-page">
        <p className="ad-error-message">{error || 'Announcement details are unavailable.'}</p>
      </div>
    );
  }

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
            <span className={`ad-priority-badge ${priorityClass(announcement.priority)}`}>{announcement.priority} Priority</span>
            <span className={`ad-status-badge ${statusClass(announcement.status)}`}>{announcement.status}</span>
          </div>
        </div>
        <div className="ad-ref-id">Ref ID: <span className="ad-ref-id-val">{announcement.id}</span></div>
      </div>

      <div className="ad-layout">
        {/* Left Column */}
        <div className="ad-left">
          {/* Main Content Card */}
          <div className="ad-content-card">
            <h2 className="ad-ann-title">{announcement.title}</h2>

            <div className="ad-meta-row">
              <div className="ad-meta-item">
                <Users size={14} />
                <span>{announcement.targetAudience}</span>
              </div>
              <div className="ad-meta-item">
                <Calendar size={14} />
                <span>Created: {announcement.createdDate}</span>
              </div>
              <div className="ad-meta-item">
                <Clock size={14} />
                <span>Expires: {announcement.expiryDate}</span>
              </div>
            </div>

            <div className="ad-divider" />

            <div className="ad-description">
              {announcement.description.split('\n').map((line, i) => (
                <p key={i}>{line || <br />}</p>
              ))}
            </div>

            {/* Attachments */}
            {announcement.attachments && announcement.attachments.length > 0 && (
              <div className="ad-attachments">
                <div className="ad-attachments-title">
                  <FileText size={16} /> Attachments ({announcement.attachments.length})
                </div>
                <div className="ad-attachments-grid">
                  {announcement.attachments.map((att, i) => (
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
                <Info size={13} /> Post published by <strong>{announcement.createdBy}</strong>
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
                <div className="ad-total-value">{announcement.deliveryStatus?.totalRecipients?.toLocaleString()}</div>
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
                  {announcement.deliveryStatus?.delivered?.toLocaleString()} / {announcement.deliveryStatus?.totalRecipients?.toLocaleString()}
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
                  {announcement.deliveryStatus?.read?.toLocaleString()} / {announcement.deliveryStatus?.totalRecipients?.toLocaleString()}
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
          {announcement.recentActivity && announcement.recentActivity.length > 0 && (
            <div className="ad-activity-card">
              <div className="ad-activity-title">
                <Clock size={15} /> Recent Activity
              </div>
              <div className="ad-activity-list">
                {announcement.recentActivity.map((act, i) => (
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
                See All {announcement.deliveryStatus?.totalRecipients?.toLocaleString()} Logs
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