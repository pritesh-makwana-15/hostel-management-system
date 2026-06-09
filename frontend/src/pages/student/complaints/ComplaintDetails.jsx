// src/pages/student/complaints/ComplaintDetails.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ChevronLeft,
  Download,
  XCircle,
  Hash,
  Tag,
  AlertTriangle,
  User,
  Building2,
  Home,
  Calendar,
  MessageSquare,
  Phone,
  Mail,
  Clock,
  Shield,
  HelpCircle,
  Paperclip,
  Send,
  CheckCircle,
  Circle,
  Plus,
} from 'lucide-react';
import { studentApi } from '../../../services/studentApi';
import '../../../styles/student/complaints/complaints.css';

/* ── helpers ──────────────────────────────────────────────── */
const getStatusClass = (status) => {
  const map = {
    'Open': 'status-open',
    'In Progress': 'status-in-progress',
    'Resolved': 'status-resolved',
    'Closed': 'status-closed',
    'Pending': 'status-pending',
  };
  return map[status] || 'status-open';
};

const getPriorityClass = (priority) => {
  const map = { High: 'priority-high', Medium: 'priority-medium', Low: 'priority-low' };
  return map[priority] || 'priority-medium';
};

/* ── Timeline steps (static) ─────────────────────────────── */
const getTimelineSteps = (complaint) => {
  const steps = [
    {
      label: 'Complaint Submitted',
      time: `${complaint.submittedDate} - ${complaint.submittedTime}`,
      done: true,
    },
    {
      label: 'Assigned to Warden',
      time: complaint.assignedWarden ? `Assigned to ${complaint.assignedWarden}` : 'Pending assignment',
      done: !!complaint.assignedWarden,
    },
    {
      label: 'Work In Progress',
      time: complaint.status === 'In Progress' ? 'Ongoing' : 'Pending',
      done: complaint.status === 'In Progress' || complaint.status === 'Resolved' || complaint.status === 'Closed',
      active: complaint.status === 'In Progress',
    },
    {
      label: 'Resolved & Verified',
      time: complaint.status === 'Resolved' || complaint.status === 'Closed' ? 'Completed' : 'Pending resolution',
      done: complaint.status === 'Resolved' || complaint.status === 'Closed',
    },
  ];
  return steps;
};

/* ── SLA data ─────────────────────────────────────────────── */
const getSLAInfo = (priority) => {
  const map = {
    High:   { window: 'High (4h Window)', expected: 'Today, 04:00 PM', response: '22 minutes' },
    Medium: { window: 'Medium (2-3 Days)', expected: 'Within 3 Days', response: '45 minutes' },
    Low:    { window: 'Low (5-7 Days)', expected: 'Within 7 Days', response: '2 hours' },
  };
  return map[priority] || map.Medium;
};

/* ── Component ────────────────────────────────────────────── */
const ComplaintDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [messages, setMessages] = useState([]);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        setLoading(true);
        setLoadError('');

        try {
          const response = await studentApi.getComplaintById(id);
          const data = response?.data?.data || null;
          setComplaint(data);
          setMessages([]);
          return;
        } catch (singleFetchError) {
          // Fallback path: load all complaints and resolve by id.
          const listResponse = await studentApi.getComplaints();
          const list = Array.isArray(listResponse?.data?.data) ? listResponse.data.data : [];
          const matched = list.find((item) => item?.id === id);

          if (matched) {
            setComplaint(matched);
            setMessages([]);
            return;
          }

          throw singleFetchError;
        }
      } catch (error) {
        console.error('Failed to fetch complaint details:', error);
        setComplaint(null);
        setLoadError(error?.response?.data?.message || 'Complaint not found or could not be loaded.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchComplaint();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="complaint-details-page">
        <button className="details-back-link" onClick={() => navigate('/student/complaints')}>
          <ChevronLeft size={16} /> Back to My Complaints
        </button>
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)' }}>
          <p style={{ fontSize: 16 }}>Loading complaint...</p>
        </div>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="complaint-details-page">
        <button className="details-back-link" onClick={() => navigate('/student/complaints')}>
          <ChevronLeft size={16} /> Back to My Complaints
        </button>
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)' }}>
          <HelpCircle size={48} style={{ opacity: 0.3, marginBottom: 12 }} />
          <p style={{ fontSize: 16 }}>{loadError || 'Complaint not found.'}</p>
        </div>
      </div>
    );
  }

  const warden = complaint.assignedWarden
    ? {
        avatar: complaint.assignedWarden
          .split(' ')
          .filter(Boolean)
          .slice(0, 2)
          .map((part) => part[0])
          .join('')
          .toUpperCase(),
        name: complaint.assignedWarden,
        designation: 'Warden',
        block: complaint.hostelBlock || 'Hostel',
      }
    : null;
  const sla = getSLAInfo(complaint.priority);
  const timelineSteps = getTimelineSteps(complaint);

  const handleSendReply = () => {
    if (!replyText.trim()) return;
    const newMsg = {
      id: Date.now(),
      user: complaint.studentName || 'Student',
      role: 'Student',
      action: 'reply',
      actionLabel: 'Replied',
      message: replyText.trim(),
      timestamp: new Date().toLocaleString('en-IN', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', hour12: true,
      }),
      avatar: 'RS',
    };
    setMessages((prev) => [...prev, newMsg]);
    setReplyText('');
  };

  const msgCount = messages.filter((m) => m.action === 'reply' || m.action === 'submission').length;

  const handleCloseComplaint = async () => {
    if (!complaint?.id || deleting) return;

    const confirmed = window.confirm(
      'Close this complaint? This will permanently delete it from your complaint list.'
    );

    if (!confirmed) return;

    try {
      setDeleting(true);
      await studentApi.deleteComplaint(complaint.id);
      navigate('/student/complaints', {
        replace: true,
        state: { message: 'Complaint deleted successfully.' },
      });
    } catch (error) {
      console.error('Failed to delete complaint:', error);
      alert(error?.response?.data?.message || 'Failed to delete complaint. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="complaint-details-page">
      {/* Back */}
      <button className="details-back-link" onClick={() => navigate('/student/complaints')}>
        <ChevronLeft size={16} /> Back to My Complaints
      </button>

      {/* Top Bar */}
      <div className="details-top-bar">
        <div className="details-top-bar-left">
          <h1>Complaint Details: #{complaint.id}</h1>
          <span className={`status-badge ${getStatusClass(complaint.status)}`}>
            {complaint.status}
          </span>
        </div>
        <div className="details-top-bar-actions">
          <button className="btn-export">
            <Download size={14} /> Export PDF
          </button>
          <button className="btn-close-complaint" onClick={handleCloseComplaint} disabled={deleting}>
            <XCircle size={14} /> {deleting ? 'Closing...' : 'Close Complaint'}
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="details-grid">
        {/* ── LEFT COLUMN ── */}
        <div>
          {/* General Info */}
          <div className="details-card">
            <div className="details-card-title">
              <Hash size={16} style={{ color: 'var(--primary)' }} /> General Information
            </div>
            <div className="info-grid">
              <div className="info-item">
                <label>COMPLAINT ID</label>
                <div className="info-value mono">#{complaint.id}</div>
              </div>
              <div className="info-item">
                <label>CATEGORY</label>
                <div className="info-value">{complaint.category}</div>
              </div>
              <div className="info-item">
                <label>PRIORITY</label>
                <span className={`priority-badge ${getPriorityClass(complaint.priority)}`}>
                  {complaint.priority}
                </span>
              </div>
              <div className="info-item">
                <label>STUDENT NAME</label>
                <div className="info-value">{complaint.studentName || '-'}</div>
              </div>
              <div className="info-item">
                <label>STUDENT ID</label>
                <div className="info-value mono">{complaint.studentId || '-'}</div>
              </div>
              <div className="info-item">
                <label>STATUS</label>
                <span className={`status-badge ${getStatusClass(complaint.status)}`}>
                  {complaint.status}
                </span>
              </div>
              <div className="info-item">
                <label>HOSTEL / BLOCK</label>
                <div className="info-value">{complaint.hostelBlock || '-'}</div>
              </div>
              <div className="info-item">
                <label>ROOM NUMBER</label>
                <div className="info-value">{complaint.roomNumber}</div>
              </div>
              <div className="info-item">
                <label>SUBMITTED DATE</label>
                <div className="info-value">
                  {complaint.submittedDate ? new Date(complaint.submittedDate).toLocaleDateString('en-IN', {
                    day: '2-digit', month: 'short', year: 'numeric',
                  }) : '-'} - {complaint.submittedTime || '-'}
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="details-card">
            <div className="details-card-title">
              <MessageSquare size={16} style={{ color: 'var(--primary)' }} /> Problem Description
            </div>
            <div className="description-text">{complaint.description}</div>
          </div>

          {/* Attachments */}
          {(complaint.attachments || []).length > 0 && (
            <div className="details-card">
              <div className="details-card-title">
                <Paperclip size={16} style={{ color: 'var(--primary)' }} /> Attachments &amp; Evidence
              </div>
              <div className="attachments-grid">
                {(complaint.attachments || []).map((src, i) => (
                  <div className="attachment-thumb" key={i}>
                    <img src={src} alt={`Attachment ${i + 1}`} />
                  </div>
                ))}
                <div className="attachment-add">
                  <Plus size={18} />
                  <span>ADD MORE</span>
                </div>
              </div>
            </div>
          )}

          {/* Conversation */}
          <div className="details-card">
            <div className="conversation-header">
              <div className="title">
                <MessageSquare size={16} /> Conversation History
              </div>
              <span className="msg-count">{msgCount} Messages</span>
            </div>

            <div className="messages-list">
              {messages.map((msg) => {
                const isStudent = msg.role === 'Student';
                const avatarClass = isStudent
                  ? 'student-avatar'
                  : msg.role === 'Warden'
                  ? 'warden-avatar'
                  : 'admin-avatar';
                const bubbleClass = isStudent ? 'student-bubble' : 'warden-bubble';

                return (
                  <div
                    key={msg.id}
                    className={`message-row ${isStudent ? 'student-msg' : ''}`}
                  >
                    <div className={`msg-avatar ${avatarClass}`}>{msg.avatar}</div>
                    <div className="msg-content">
                      <div className="msg-meta">
                        <span className="msg-author">{msg.user}</span>
                        <span className="msg-role">{msg.role}</span>
                        <span className="msg-time">{msg.timestamp}</span>
                      </div>
                      <div className={`msg-bubble ${bubbleClass}`}>{msg.message}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Reply Box */}
            <div className="reply-box">
              <textarea
                className="reply-textarea"
                placeholder="Type your response to the maintenance team..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleSendReply();
                }}
              />
              <div className="reply-actions">
                <button className="reply-attach-btn">
                  <Paperclip size={14} /> Attach Proof (Max 5MB)
                </button>
                <button className="btn-send" onClick={handleSendReply}>
                  <Send size={14} /> Send Reply
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT SIDEBAR ── */}
        <div className="details-sidebar">
          {/* Assigned Warden */}
          <div className="warden-card">
            <div className="warden-card-title">Assigned Personnel</div>
            {warden ? (
              <>
                <div className="warden-profile">
                  <div className="warden-avatar-large">{warden.avatar}</div>
                  <div className="warden-name">{warden.name}</div>
                  <div className="warden-role">{warden.designation} ({warden.block.split(' ')[1]})</div>
                </div>
                <div className="warden-contact-btns">
                  <button className="contact-btn">
                    <Phone size={13} /> Call Warden
                  </button>
                  <button className="contact-btn">
                    <Mail size={13} /> Email
                  </button>
                </div>
                <div className="warden-availability">
                  AVAILABLE: 09:00 AM – 06:00 PM
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-secondary)', fontSize: 13 }}>
                No warden assigned yet.
              </div>
            )}
          </div>

          {/* Timeline */}
          <div className="timeline-card">
            <div className="timeline-card-title">Complaint Lifecycle</div>
            <div className="timeline-list">
              {timelineSteps.map((step, idx) => (
                <div className="timeline-item" key={idx}>
                  <div
                    className={`timeline-dot ${
                      step.active ? 'active' : step.done ? 'done' : ''
                    }`}
                  />
                  <div className="timeline-content">
                    <div className="step-label">{step.label}</div>
                    <div className="step-time">{step.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SLA Metrics */}
          <div className="sla-metrics-card">
            <div className="sla-metrics-title">
              <Clock size={16} style={{ color: 'var(--secondary)' }} /> SLA Target &amp; Metrics
            </div>
            <div className="sla-metric-row">
              <span className="sla-metric-label">Expected Resolution:</span>
              <span className="sla-metric-value highlight">{sla.expected}</span>
            </div>
            <div className="sla-metric-row">
              <span className="sla-metric-label">Priority Level:</span>
              <span className={`sla-metric-value priority-badge ${getPriorityClass(complaint.priority)}`}>
                {sla.window}
              </span>
            </div>
            <div className="sla-metric-row">
              <span className="sla-metric-label">Average Response:</span>
              <span className="sla-metric-value">{sla.response}</span>
            </div>
            <button className="btn-status-update">Request Status Update</button>
          </div>

          {/* Help */}
          <div className="help-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <HelpCircle size={14} style={{ color: 'var(--text-secondary)' }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>Need Urgent Help?</span>
            </div>
            <p className="help-card" style={{ background: 'none', border: 'none', padding: 0, boxShadow: 'none', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              If this plumbing issue is causing flooding, please contact the 24/7 Hostel Emergency Desk at
              <span className="help-phone" style={{ display: 'block', marginTop: 6 }}>+91 98765 00001</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetails;