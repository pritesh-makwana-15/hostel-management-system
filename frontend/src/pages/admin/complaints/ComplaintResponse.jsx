// src/pages/admin/complaints/ComplaintResponse.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Clock, MessageSquare, Send, Paperclip, RefreshCw,
  AlertCircle, X, Loader
} from 'lucide-react';
import { adminComplaintApi } from '../../../services/adminOtherApi';
import '../../../styles/admin/complaints/complaintResponse.css';

const roleColors = {
  Student: { bg: '#EFF6FF', color: '#1D4ED8', border: '#BFDBFE' },
  Admin:   { bg: '#F0FDF4', color: '#15803D', border: '#BBF7D0' },
  Warden:  { bg: '#FDF4FF', color: '#7E22CE', border: '#E9D5FF' },
};

const actionIcons = {
  submission: <AlertCircle size={13} />,
  assignment: <RefreshCw size={13} />,
  'status change': <Clock size={13} />,
  reply: <MessageSquare size={13} />,
};

const statusOptions = ['Open', 'In Progress', 'Resolved', 'Closed'];

const ComplaintResponse = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentStatus, setCurrentStatus] = useState('Open');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [statusSaved, setStatusSaved] = useState(false);
  const [replySent, setReplySent] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [timeline, setTimeline] = useState([]);

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        setLoading(true);
        const res = await adminComplaintApi.getById(id);
        const data = res?.data?.data;
        if (!data) {
          setError('Complaint not found');
          setComplaint(null);
          return;
        }

        setComplaint(data);
        setCurrentStatus(data.status || 'Open');
        setTimeline([]);
        setError(null);
      } catch (err) {
        console.error('Error fetching complaint:', err);
        setError(err?.response?.data?.message || 'Failed to fetch complaint');
        setComplaint(null);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaint();
  }, [id]);

  if (loading) {
    return (
      <div className="cr-page">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <Loader size={40} style={{ animation: 'spin 1s linear infinite' }} />
          <span style={{ marginLeft: '10px' }}>Loading complaint...</span>
        </div>
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="cr-page">
        <div className="cr-not-found">
          <AlertCircle size={48} />
          <h2>{error ? 'Error Loading Complaint' : 'Complaint Not Found'}</h2>
          <p>{error || `The complaint "${id}" does not exist.`}</p>
          <button className="cr-btn-primary" onClick={() => navigate('/admin/complaints')}>Back to List</button>
        </div>
      </div>
    );
  }

  const handleStatusUpdate = async () => {
    try {
      setUpdating(true);
      const res = await adminComplaintApi.resolve(id, {
        status: currentStatus,
        resolutionNotes,
      });

      const updated = res?.data?.data;
      if (updated) {
        setComplaint(updated);
        setCurrentStatus(updated.status || currentStatus);
      }

      setStatusSaved(true);
      setTimeout(() => setStatusSaved(false), 2000);
    } catch (err) {
      console.error('Error updating status:', err);
      alert(err?.response?.data?.message || 'Failed to update complaint status');
    } finally {
      setUpdating(false);
    }
  };

  const handleSendReply = () => {
    if (!message.trim()) { alert('Please enter a message.'); return; }
    setReplySent(true);
    const newEntry = {
      id: timeline.length + 1,
      user: 'Admin User',
      role: 'Admin',
      action: 'reply',
      actionLabel: 'Replied',
      message: message,
      timestamp: new Date().toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
      avatar: 'AU',
    };
    setTimeline(prev => [...prev, newEntry]);
    setMessage('');
    setAttachments([]);
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

  return (
    <div className="cr-page">
      {/* Header */}
      <div className="cr-page-header">
        <div>
          <h1 className="cr-page-title">Complaint Response &amp; Status</h1>
          <div className="cr-breadcrumb">
            <span>Dashboard</span><span className="cr-sep">/</span>
            <span>Complaints</span><span className="cr-sep">/</span>
            <span className="cr-breadcrumb-active">Response</span>
          </div>
        </div>
        <button className="cr-back-btn" onClick={() => navigate(`/admin/complaints/${id}`)}>
          ← Back to Details
        </button>
      </div>

      {/* Top Two Panels */}
      <div className="cr-top-grid">
        {/* Update Status Panel */}
        <div className="cr-card">
          <div className="cr-card-title-row">
            <Clock size={16} />
            <h2 className="cr-card-title">Update Status</h2>
          </div>

          <div className="cr-form-group">
            <label className="cr-form-label">Current Status</label>
            <select className="cr-form-select" value={currentStatus}
              onChange={e => setCurrentStatus(e.target.value)}>
              {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="cr-form-group">
            <label className="cr-form-label">Resolution Notes</label>
            <textarea className="cr-form-textarea"
              placeholder="Add internal notes or resolution details..."
              value={resolutionNotes}
              onChange={e => setResolutionNotes(e.target.value)}
              rows={4}
            />
            <span className="cr-form-hint">* These notes are visible to wardens and administrators.</span>
          </div>

          <button
            className={`cr-btn-primary cr-btn-full ${statusSaved ? 'cr-btn-saved' : ''}`}
            onClick={handleStatusUpdate}
            disabled={updating}
          >
            {updating ? <Loader size={15} /> : <RefreshCw size={15} />}
            {updating ? 'Updating...' : statusSaved ? 'Status Updated!' : 'Update Status'}
          </button>
        </div>

        {/* Reply Panel */}
        <div className="cr-card">
          <div className="cr-card-title-row">
            <MessageSquare size={16} />
            <h2 className="cr-card-title">Reply to Complaint</h2>
          </div>

          <div className="cr-form-group">
            <label className="cr-form-label">Message</label>
            <textarea className="cr-form-textarea cr-reply-textarea"
              placeholder="Type your message to the student here..."
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={5}
            />
          </div>

          {/* Attachments */}
          <div className="cr-form-group">
            <label className="cr-form-label">Attachments</label>
            <div className="cr-attachments-row">
              {attachments.map((att, i) => (
                <div key={i} className="cr-attachment-thumb">
                  <img src={att.url} alt={att.name} />
                  <button className="cr-attachment-remove" onClick={() => removeAttachment(i)}><X size={12} /></button>
                </div>
              ))}
              <label className="cr-attach-btn" title="Attach file">
                <Paperclip size={18} />
                <span>ATTACH</span>
                <input type="file" multiple onChange={handleFileChange} style={{ display: 'none' }} />
              </label>
            </div>
          </div>

          <div className="cr-reply-actions">
            <button className="cr-btn-secondary" onClick={() => navigate(`/admin/complaints/${id}`)}>Cancel</button>
            <button
              className={`cr-btn-primary ${replySent ? 'cr-btn-saved' : ''}`}
              onClick={handleSendReply}
            >
              <Send size={15} />
              {replySent ? 'Reply Sent!' : 'Send Reply'}
            </button>
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="cr-card cr-timeline-card">
        <div className="cr-timeline-header">
          <div className="cr-card-title-row">
            <Clock size={16} />
            <h2 className="cr-card-title">Activity Timeline</h2>
          </div>
          <button className="cr-refresh-btn"><RefreshCw size={14} /> Refresh History</button>
        </div>

        <div className="cr-timeline">
          {timeline.map((entry, idx) => {
            const roleStyle = roleColors[entry.role] || roleColors.Admin;
            const isLast = idx === timeline.length - 1;
            return (
              <div key={entry.id} className={`cr-timeline-item ${isLast ? 'cr-timeline-item-last' : ''}`}>
                <div className="cr-timeline-left">
                  <div className="cr-timeline-avatar" style={{ background: roleStyle.bg, color: roleStyle.color, border: `1px solid ${roleStyle.border}` }}>
                    {entry.avatar}
                  </div>
                  {!isLast && <div className="cr-timeline-line" />}
                </div>
                <div className="cr-timeline-content">
                  <div className="cr-timeline-meta">
                    <div className="cr-timeline-meta-left">
                      <span className="cr-timeline-user">{entry.user}</span>
                      <span className="cr-timeline-role-badge" style={{ background: roleStyle.bg, color: roleStyle.color }}>
                        {entry.role}
                      </span>
                      <span className="cr-timeline-action">
                        {actionIcons[entry.action]}
                        {entry.action}
                      </span>
                    </div>
                    <span className="cr-timeline-time">{entry.timestamp}</span>
                  </div>
                  <div className="cr-timeline-message">{entry.message}</div>
                  {entry.attachment && (
                    <div className="cr-timeline-attachment">
                      <img src={entry.attachment} alt="attachment" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          {timeline.length === 0 && (
            <div className="cr-timeline-empty">No activity yet.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplaintResponse;