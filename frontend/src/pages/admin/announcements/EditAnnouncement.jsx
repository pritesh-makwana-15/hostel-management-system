// src/pages/admin/announcements/EditAnnouncement.jsx
import React, { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Info, Upload, X, FileText, Clock } from 'lucide-react';
import { getAnnouncementById } from '../../../data/announcementsData';
import '../../../styles/admin/announcements/editAnnouncement.css';

const EditAnnouncement = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const fileRef = useRef();
  const ann = getAnnouncementById(id) || {
    id: 'AN-2026-0123',
    title: 'Quarterly Hostel Maintenance Schedule - Block A & B',
    message: `Dear Residents,\n\nPlease be informed that the quarterly maintenance for Block A and Block B is scheduled for next week. Our technical team will be conducting fire safety audits and plumbing checks between 10 AM and 4 PM.\n\nKindly ensure your rooms are accessible if required. We apologize for any inconvenience caused.\n\nRegards,\nManagement`,
    audience: 'Both',
    priority: 'Urgent',
    publishDate: '2026-03-15',
    expiryDate: '2026-03-22',
    status: 'Active',
    attachments: [
      { name: 'maintenance_map.pdf', size: '1.2 MB' },
      { name: 'safety_checklist.docx', size: '450 KB' },
    ],
  };

  const [form, setForm] = useState({
    title: ann.title || '',
    message: ann.message || '',
    audience: ann.audience || 'Both',
    priority: ann.priority || 'Urgent',
    publishDate: ann.publishDate || '',
    expiryDate: ann.expiryDate || '',
  });
  const [attachments, setAttachments] = useState(ann.attachments || []);
  const [dragOver, setDragOver] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    addFiles(files);
  };

  const addFiles = (files) => {
    const newFiles = files.map(f => ({ name: f.name, size: (f.size / (1024 * 1024)).toFixed(1) + ' MB' }));
    setAttachments(prev => [...prev, ...newFiles]);
  };

  const removeAttachment = (idx) => setAttachments(prev => prev.filter((_, i) => i !== idx));

  const getStatusClass = (s) => {
    if (s === 'Active') return 'ea-status-active';
    if (s === 'Scheduled') return 'ea-status-scheduled';
    return 'ea-status-expired';
  };

  return (
    <div className="ea-page">
      {/* Header */}
      <div className="ea-header">
        <div className="ea-header-left">
          <div className="ea-breadcrumb">
            <span>Dashboard</span><span className="ea-sep">›</span>
            <span>Announcements</span><span className="ea-sep">›</span>
            <span className="ea-breadcrumb-active">Edit</span>
          </div>
          <div className="ea-title-row">
            <h1 className="ea-title">Edit Announcement</h1>
            <span className={`ea-status-badge ${getStatusClass(ann.status)}`}>{ann.status}</span>
          </div>
        </div>
        <button className="ea-back-btn" onClick={() => navigate('/admin/announcements')}>
          ‹ Back to List
        </button>
      </div>

      {/* Meta Info Bar */}
      <div className="ea-meta-bar">
        <div className="ea-meta-item">
          <span className="ea-meta-label">ANNOUNCEMENT ID</span>
          <span className="ea-meta-value">{ann.id}</span>
        </div>
        <div className="ea-meta-item">
          <span className="ea-meta-label">CREATED BY</span>
          <span className="ea-meta-value">Admin Smith (ID: 9821)</span>
        </div>
        <div className="ea-meta-item">
          <span className="ea-meta-label">CREATED DATE</span>
          <span className="ea-meta-value">10 Mar 2026, 09:45 AM</span>
        </div>
        <div className="ea-meta-item">
          <span className="ea-meta-label">LAST MODIFIED</span>
          <span className="ea-meta-value ea-meta-muted">No modifications yet</span>
        </div>
      </div>

      {/* Main Form Card */}
      <div className="ea-card">
        <div className="ea-card-section-header">
          <Info size={16} className="ea-info-icon" />
          <span>Content & Delivery Settings</span>
        </div>
        <p className="ea-section-sub">Modify the announcement details. Changes will be updated across all active broadcast channels.</p>

        <div className="ea-form-group">
          <label className="ea-label">Announcement Title <span className="ea-required">*</span></label>
          <input
            className="ea-input"
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            maxLength={100}
          />
          <span className="ea-hint">Provide a clear, concise subject line. Maximum 100 characters.</span>
        </div>

        <div className="ea-form-group">
          <label className="ea-label">Announcement Message <span className="ea-required">*</span></label>
          <textarea
            className="ea-textarea"
            name="message"
            value={form.message}
            onChange={handleChange}
            rows={8}
          />
        </div>

        <div className="ea-two-col">
          <div className="ea-form-group">
            <label className="ea-label">Target Audience <span className="ea-required">*</span></label>
            <div className="ea-toggle-group">
              {['Students', 'Wardens', 'Both'].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  className={`ea-toggle-btn ${form.audience === opt ? 'ea-toggle-active' : ''}`}
                  onClick={() => setForm(prev => ({ ...prev, audience: opt }))}
                >{opt}</button>
              ))}
            </div>
          </div>

          <div className="ea-form-group">
            <label className="ea-label">Priority Level <span className="ea-required">*</span></label>
            <select
              className="ea-select"
              name="priority"
              value={form.priority}
              onChange={handleChange}
            >
              {['Normal', 'Important', 'Urgent'].map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>

        <div className="ea-two-col">
          <div className="ea-form-group">
            <label className="ea-label">Publish Date <span className="ea-required">*</span></label>
            <div className="ea-date-wrap">
              <input className="ea-input" type="date" name="publishDate" value={form.publishDate} onChange={handleChange} />
            </div>
          </div>
          <div className="ea-form-group">
            <label className="ea-label">Expiry Date <span className="ea-required">*</span></label>
            <div className="ea-date-wrap">
              <input className="ea-input" type="date" name="expiryDate" value={form.expiryDate} onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* Rescheduling Notice */}
        <div className="ea-reschedule-notice">
          <Clock size={16} />
          <div>
            <strong>Rescheduling Notice</strong>
            <p>Changing the publish date to a future time will automatically transition this announcement back to a <strong>'Scheduled'</strong> status. All active broadcasts for this content will be paused until the new date.</p>
          </div>
        </div>

        {/* Attachments */}
        <div className="ea-form-group">
          <label className="ea-label">Attachments (Optional)</label>
          <div
            className={`ea-dropzone ${dragOver ? 'ea-dropzone-active' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleFileDrop}
            onClick={() => fileRef.current?.click()}
          >
            <Upload size={24} />
            <p>Click to upload or drag and drop</p>
            <p className="ea-dropzone-sub">PDF, JPG, PNG or DOCX (Max. 5MB)</p>
            <input ref={fileRef} type="file" multiple hidden onChange={(e) => addFiles(Array.from(e.target.files))} />
          </div>
          <div className="ea-attachments-list">
            {attachments.map((f, i) => (
              <div key={i} className="ea-attachment-tag">
                <span>{f.name}</span>
                <button onClick={() => removeAttachment(i)}><X size={12} /></button>
              </div>
            ))}
          </div>
        </div>

        {/* Auto-save hint + Actions */}
        <div className="ea-form-footer">
          <span className="ea-autosave"><Info size={12} /> Last auto-saved at 10:24 AM</span>
          <div className="ea-form-actions">
            <button className="ea-btn-cancel" onClick={() => navigate('/admin/announcements')}>Cancel</button>
            <button className="ea-btn-primary">Update Announcement</button>
          </div>
        </div>
      </div>

      {/* Bottom Info Cards */}
      <div className="ea-info-cards">
        <div className="ea-info-card">
          <div className="ea-info-card-title">Broadcast Channels</div>
          {[['Mobile App', 'Enabled'], ['Email Notification', 'Enabled'], ['Portal Dashboard', 'Enabled']].map(([k, v]) => (
            <div key={k} className="ea-info-card-row">
              <span>{k}</span><span className="ea-info-enabled">{v}</span>
            </div>
          ))}
        </div>
        <div className="ea-info-card">
          <div className="ea-info-card-title">Delivery Preview</div>
          <div className="ea-info-card-row"><span className="ea-check">✓</span><span>Students (Block A/B)</span></div>
          <div className="ea-info-card-row"><span className="ea-check">✓</span><span>Wardens (All Blocks)</span></div>
        </div>
        <div className="ea-info-card">
          <div className="ea-info-card-title">Quick Help</div>
          <p className="ea-info-card-text">Need help formatting your message? Use standard markdown for bold or italics. Images will be rendered as full-width blocks.</p>
        </div>
      </div>
    </div>
  );
};

export default EditAnnouncement;