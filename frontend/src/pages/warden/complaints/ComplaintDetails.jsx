// src/pages/warden/complaints/ComplaintDetails.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  ArrowLeft, Phone, Mail, RefreshCw, Paperclip,
  Send, UserCheck, MessageSquare, AlertCircle, X
} from 'lucide-react';
import { getComplaintById, wardensData, statusOptions } from '../../../data/complaintsData';
import { wardenComplaintsApi } from '../../../services/wardenComplaintsApi';
import '../../../styles/warden/complaints/complaintDetails.css';

const ComplaintDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const decodedId = decodeURIComponent(id);
  const [complaint, setComplaint] = useState(location.state?.complaint || null);
  const [loadingComplaint, setLoadingComplaint] = useState(!location.state?.complaint);

  useEffect(() => {
    if (location.state?.complaint) {
      setComplaint(location.state.complaint);
      setLoadingComplaint(false);
      return;
    }

    let cancelled = false;

    const fetchComplaint = async () => {
      try {
        setLoadingComplaint(true);
        const response = await wardenComplaintsApi.getAll();
        const complaints = response?.data?.data || [];
        const matchedComplaint = complaints.find((item) => {
          return String(item.id) === String(decodedId) || item.complaintCode === decodedId;
        });

        if (!cancelled) {
          setComplaint(matchedComplaint || getComplaintById(decodedId) || null);
        }
      } catch (error) {
        if (!cancelled) {
          setComplaint(getComplaintById(decodedId) || null);
        }
      } finally {
        if (!cancelled) {
          setLoadingComplaint(false);
        }
      }
    };

    fetchComplaint();

    return () => {
      cancelled = true;
    };
  }, [decodedId, location.state?.complaint]);

  const [currentStatus, setCurrentStatus] = useState(complaint?.status || 'Open');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [timeline, setTimeline] = useState(complaint?.timeline || []);
  const [statusSaved, setStatusSaved] = useState(false);
  const [replySent, setReplySent] = useState(false);

  useEffect(() => {
    if (complaint) {
      setCurrentStatus(complaint.status || 'Open');
      setTimeline(complaint.timeline || []);
    }
  }, [complaint]);

  if (loadingComplaint) {
    return (
      <div className="wcd-page">
        <div className="wcd-not-found">
          <h2>Loading complaint...</h2>
          <p>Fetching complaint details from the live complaint table.</p>
        </div>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="wcd-page">
        <div className="wcd-not-found">
          <AlertCircle size={48} />
          <h2>Complaint Not Found</h2>
          <p>The complaint "{id}" does not exist.</p>
          <button className="wcd-btn-primary" onClick={() => navigate('/warden/complaints')}>
            Back to List
          </button>
        </div>
      </div>
    );
  }

  const warden = wardensData.find(w => w.id === complaint.assignedWardenId);

  const getStatusBadgeClass = (s) => {
    if (s === 'Open') return 'wcd-badge wcd-badge-pending';
    if (s === 'In Progress') return 'wcd-badge wcd-badge-inprogress';
    if (s === 'Resolved') return 'wcd-badge wcd-badge-resolved';
    return 'wcd-badge wcd-badge-closed';
  };

  const getStatusLabel = (s) => s === 'Open' ? 'Pending' : s;

  const getPriorityClass = (p) => {
    if (p === 'High') return 'wcd-priority wcd-priority-high';
    if (p === 'Medium') return 'wcd-priority wcd-priority-medium';
    return 'wcd-priority wcd-priority-low';
  };

  const handleUpdateStatus = async () => {
    try {
      const response = await wardenComplaintsApi.updateStatus(complaint.id, {
        status: currentStatus,
        resolutionNotes,
      });

      const updatedComplaint = response?.data?.data;
      if (updatedComplaint) {
        setComplaint(updatedComplaint);
        setCurrentStatus(updatedComplaint.status || currentStatus);
      }

      const entry = {
        id: timeline.length + 1,
        user: 'Robert Miller',
        role: 'Warden',
        action: 'status change',
        actionLabel: 'Updated status',
        message: `Status updated to "${currentStatus}".${resolutionNotes ? ' ' + resolutionNotes : ''}`,
        timestamp: new Date().toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
        avatar: 'RM',
        side: 'right',
      };
      setTimeline(prev => [...prev, entry]);
      setStatusSaved(true);
      setTimeout(() => setStatusSaved(false), 2000);
    } catch (error) {
      console.error('Error updating complaint status:', error);
      alert(error.response?.data?.message || 'Failed to update complaint status');
    }
  };

  const handleSendReply = () => {
    if (!replyMessage.trim()) return;
    const entry = {
      id: timeline.length + 1,
      user: 'Robert Miller',
      role: 'Warden',
      action: 'reply',
      actionLabel: 'Replied',
      message: replyMessage,
      timestamp: new Date().toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
      avatar: 'RM',
      side: 'right',
    };
    setTimeline(prev => [...prev, entry]);
    setReplyMessage('');
    setAttachments([]);
    setReplySent(true);
    setTimeout(() => setReplySent(false), 2000);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map(f => ({ name: f.name, url: URL.createObjectURL(f) }));
    setAttachments(prev => [...prev, ...previews]);
  };

  const removeAttachment = (idx) => {
    setAttachments(prev => prev.filter((_, i) => i !== idx));
  };

  // Determine alternating sides
  const getTimelineSide = (entry, idx) => {
    if (entry.role === 'Student') return 'left';
    return 'right';
  };

  const getRoleColor = (role) => {
    if (role === 'Student') return { bg: '#EFF6FF', color: '#1D4ED8', label: 'STUDENT' };
    if (role === 'Warden') return { bg: '#F0FDF4', color: '#15803D', label: 'WARDEN' };
    return { bg: '#FDF4FF', color: '#7E22CE', label: 'ADMIN' };
  };

  return (
    <div className="wcd-page">
      {/* Breadcrumb + Title */}
      <div className="wcd-page-header">
        <div className="wcd-page-header-left">
          <div className="wcd-breadcrumb">
            <span onClick={() => navigate('/warden/dashboard')} style={{ cursor: 'pointer' }}>Dashboard</span>
            <span className="wcd-sep">›</span>
            <span onClick={() => navigate('/warden/complaints')} style={{ cursor: 'pointer' }}>Complaints</span>
            <span className="wcd-sep">›</span>
            <span className="wcd-breadcrumb-active">Complaint Details</span>
          </div>
          <h1 className="wcd-title">Complaint Details: #{complaint.id}</h1>
        </div>
        <button className="wcd-back-btn" onClick={() => navigate('/warden/complaints')}>
          <ArrowLeft size={14} /> Back to List
        </button>
      </div>

      {/* Top Row: General Info + Assigned Personnel */}
      <div className="wcd-top-row">
        {/* General Information */}
        <div className="wcd-card wcd-info-card">
          <h2 className="wcd-card-title">
            <AlertCircle size={15} /> General Information
          </h2>
          <div className="wcd-info-grid">
            <div className="wcd-info-item">
              <span className="wcd-info-label">COMPLAINT ID</span>
              <span className="wcd-info-value wcd-id">#{complaint.id}</span>
            </div>
            <div className="wcd-info-item">
              <span className="wcd-info-label">PRIORITY</span>
              <span className={getPriorityClass(complaint.priority)}>{complaint.priority}</span>
            </div>
            <div className="wcd-info-item">
              <span className="wcd-info-label">SUBMITTED DATE</span>
              <span className="wcd-info-value">{complaint.submittedDate} – {complaint.submittedTime}</span>
            </div>
            <div className="wcd-info-item">
              <span className="wcd-info-label">STUDENT NAME</span>
              <span className="wcd-info-value">{complaint.studentName}</span>
            </div>
            <div className="wcd-info-item">
              <span className="wcd-info-label">STUDENT ID</span>
              <span className="wcd-info-value">{complaint.studentId}</span>
            </div>
            <div className="wcd-info-item">
              <span className="wcd-info-label">STATUS</span>
              <span className={getStatusBadgeClass(complaint.status)}>
                {getStatusLabel(complaint.status)}
              </span>
            </div>
            <div className="wcd-info-item">
              <span className="wcd-info-label">HOSTEL / BLOCK</span>
              <span className="wcd-info-value">{complaint.hostelBlock}</span>
            </div>
            <div className="wcd-info-item">
              <span className="wcd-info-label">ROOM NUMBER</span>
              <span className="wcd-info-value">{complaint.roomNumber}</span>
            </div>
            <div className="wcd-info-item">
              <span className="wcd-info-label">CATEGORY</span>
              <span className="wcd-info-value">{complaint.category}</span>
            </div>
          </div>
        </div>

        {/* Assigned Personnel */}
        <div className="wcd-card wcd-personnel-card">
          <h2 className="wcd-card-title">
            <UserCheck size={15} /> Assigned Personnel
          </h2>
          {warden ? (
            <div className="wcd-warden-body">
              <div className="wcd-warden-avatar-wrap">
                <div className="wcd-warden-avatar">{warden.avatar}</div>
                <div className="wcd-warden-dot" />
              </div>
              <div className="wcd-warden-name">{warden.name}</div>
              <div className="wcd-warden-role">{warden.designation} (Ganga Block)</div>
              <div className="wcd-warden-contacts">
                <div className="wcd-warden-contact">
                  <Phone size={14} />
                  <span>+91 98765 43210</span>
                </div>
                <div className="wcd-warden-contact">
                  <Mail size={14} />
                  <span>r.miller@hms.edu</span>
                </div>
              </div>
              <button className="wcd-btn-change-warden">
                <RefreshCw size={13} /> Change Warden
              </button>
            </div>
          ) : (
            <div className="wcd-no-warden">
              <p>No warden assigned yet</p>
              <button className="wcd-btn-primary">Assign Warden</button>
            </div>
          )}
        </div>
      </div>

      {/* Problem Description */}
      <div className="wcd-card">
        <h2 className="wcd-card-title-plain">Problem Description</h2>
        <p className="wcd-description">{complaint.description}</p>
      </div>

      {/* Attachments */}
      <div className="wcd-card">
        <h2 className="wcd-card-title-plain">
          <Paperclip size={15} style={{ marginRight: 6 }} />
          Attachments &amp; Evidence
        </h2>
        {complaint.attachments && complaint.attachments.length > 0 ? (
          <div className="wcd-attachments">
            {complaint.attachments.slice(0, 3).map((src, i) => (
              <div key={i} className="wcd-attach-thumb">
                <img src={src} alt={`Attachment ${i + 1}`} />
              </div>
            ))}
            {complaint.attachments.length > 3 && (
              <div className="wcd-attach-more">
                <span>View {complaint.attachments.length - 3} More</span>
              </div>
            )}
          </div>
        ) : (
          <p className="wcd-no-attach">No attachments provided.</p>
        )}
      </div>

      {/* Update Status + Reply (side by side) */}
      <div className="wcd-action-row">
        {/* Update Status */}
        <div className="wcd-card wcd-update-card">
          <h2 className="wcd-card-title">
            <RefreshCw size={15} /> Update Status
          </h2>
          <div className="wcd-form-group">
            <label className="wcd-form-label">Current Status</label>
            <select
              className="wcd-form-select"
              value={currentStatus}
              onChange={e => setCurrentStatus(e.target.value)}
            >
              {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="wcd-form-group">
            <label className="wcd-form-label">Resolution Notes</label>
            <textarea
              className="wcd-form-textarea"
              placeholder="Add internal notes or resolution details..."
              rows={4}
              value={resolutionNotes}
              onChange={e => setResolutionNotes(e.target.value)}
            />
            <span className="wcd-form-hint">* These notes are visible to wardens and administrators.</span>
          </div>
          <button
            className={`wcd-btn-primary wcd-btn-full ${statusSaved ? 'wcd-btn-saved' : ''}`}
            onClick={handleUpdateStatus}
          >
            <RefreshCw size={14} />
            {statusSaved ? 'Status Updated!' : 'Update Status'}
          </button>
        </div>

        {/* Reply to Complaint */}
        <div className="wcd-card wcd-reply-card">
          <h2 className="wcd-card-title">
            <MessageSquare size={15} /> Reply to Complaint
          </h2>
          <div className="wcd-form-group">
            <label className="wcd-form-label">Message</label>
            <textarea
              className="wcd-form-textarea wcd-reply-textarea"
              placeholder="Type your message to the student here..."
              rows={5}
              value={replyMessage}
              onChange={e => setReplyMessage(e.target.value)}
            />
          </div>
          <div className="wcd-form-group">
            <label className="wcd-form-label">Attachments</label>
            <div className="wcd-attach-row">
              {attachments.map((a, i) => (
                <div key={i} className="wcd-attach-preview">
                  <img src={a.url} alt={a.name} />
                  <button className="wcd-attach-remove" onClick={() => removeAttachment(i)}>
                    <X size={10} />
                  </button>
                </div>
              ))}
              <label className="wcd-attach-btn" title="Attach file">
                <Paperclip size={16} />
                <input type="file" multiple onChange={handleFileChange} style={{ display: 'none' }} />
              </label>
            </div>
          </div>
          <div className="wcd-reply-actions">
            <button className="wcd-btn-cancel">Cancel</button>
            <button
              className={`wcd-btn-send ${replySent ? 'wcd-btn-saved' : ''}`}
              onClick={handleSendReply}
            >
              <Send size={14} />
              {replySent ? 'Sent!' : 'Send Reply'}
            </button>
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="wcd-card wcd-timeline-card">
        <div className="wcd-timeline-header">
          <h2 className="wcd-card-title">
            <RefreshCw size={15} /> Activity Timeline
          </h2>
          <button className="wcd-refresh-btn">
            <RefreshCw size={13} /> Refresh History
          </button>
        </div>

        <div className="wcd-timeline">
          {timeline.map((entry, idx) => {
            const side = getTimelineSide(entry, idx);
            const roleStyle = getRoleColor(entry.role);
            return (
              <div key={entry.id} className={`wcd-tl-item wcd-tl-${side}`}>
                {side === 'left' && (
                  <div className="wcd-tl-avatar" style={{ background: roleStyle.bg, color: roleStyle.color }}>
                    {entry.avatar}
                  </div>
                )}
                <div className={`wcd-tl-bubble wcd-tl-bubble-${side}`}>
                  <div className="wcd-tl-meta">
                    <span className="wcd-tl-user">{entry.user}</span>
                    <span className="wcd-tl-role" style={{ background: roleStyle.bg, color: roleStyle.color }}>
                      {roleStyle.label}
                    </span>
                    <span className="wcd-tl-time">{entry.timestamp}</span>
                  </div>
                  <p className="wcd-tl-message">{entry.message}</p>
                  {entry.attachment && (
                    <div className="wcd-tl-attach">
                      <img src={entry.attachment} alt="attachment" />
                    </div>
                  )}
                </div>
                {side === 'right' && (
                  <div className="wcd-tl-avatar" style={{ background: roleStyle.bg, color: roleStyle.color }}>
                    {entry.avatar}
                  </div>
                )}
              </div>
            );
          })}
          {timeline.length === 0 && (
            <p className="wcd-tl-empty">No activity yet.</p>
          )}
        </div>
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="wcd-action-bar">
        <div className="wcd-action-bar-left">
          <div className="wcd-action-bar-icon">
            <RefreshCw size={16} />
          </div>
          <span className="wcd-action-bar-label">Immediate Actions Required</span>
        </div>
        <div className="wcd-action-bar-btns">
          <button className="wcd-bar-btn-outline">
            <UserCheck size={14} /> Assign Warden
          </button>
          <button className="wcd-bar-btn-outline">
            <MessageSquare size={14} /> Reply to Student
          </button>
          <button className="wcd-bar-btn-primary">
            <RefreshCw size={14} /> Update Status
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="wcd-footer">
        © 2024 Warden Complaints Management System • HMS v2.4.0
        <span className="wcd-footer-links">
          <a href="#">Support</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </span>
      </div>
    </div>
  );
};

export default ComplaintDetails;