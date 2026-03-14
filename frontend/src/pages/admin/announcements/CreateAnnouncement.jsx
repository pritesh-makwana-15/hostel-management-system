// src/pages/admin/announcements/CreateAnnouncement.jsx
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Megaphone, Info, Upload, X, FileText, Image as ImageIcon } from 'lucide-react';
import '../../../styles/admin/announcements/createAnnouncement.css';

const CreateAnnouncement = () => {
  const navigate = useNavigate();
  const fileRef = useRef();
  const [form, setForm] = useState({
    title: '', message: '', audience: 'Students', priority: 'Normal',
    publishDate: '', expiryDate: '',
  });
  const [charCount, setCharCount] = useState(0);
  const [attachments, setAttachments] = useState([]);
  const [dragOver, setDragOver] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (name === 'message') setCharCount(value.length);
  };

  const handleAudience = (val) => setForm(prev => ({ ...prev, audience: val }));
  const handlePriority = (val) => setForm(prev => ({ ...prev, priority: val }));

  const handleFileDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    addFiles(files);
  };

  const addFiles = (files) => {
    const newFiles = files.map(f => ({
      name: f.name,
      size: (f.size / (1024 * 1024)).toFixed(1) + ' MB',
      progress: 100,
    }));
    setAttachments(prev => [...prev, ...newFiles]);
  };

  const removeAttachment = (idx) => setAttachments(prev => prev.filter((_, i) => i !== idx));

  const getAudienceLabel = () => {
    if (form.audience === 'Students') return 'all students';
    if (form.audience === 'Wardens') return 'all wardens';
    return 'all students and wardens';
  };

  return (
    <div className="ca-page">
      {/* Header */}
      <div className="ca-header">
        <div className="ca-breadcrumb">
          <span>Dashboard</span><span className="ca-sep">›</span>
          <span>Announcements</span><span className="ca-sep">›</span>
          <span className="ca-breadcrumb-active">Create</span>
        </div>
        <h1 className="ca-title"><Megaphone size={22} /> Create New Announcement</h1>
      </div>

      {/* Content Card */}
      <div className="ca-card">
        <div className="ca-section-title">Announcement Content</div>
        <p className="ca-section-sub">Define the core message and subject of your broadcast.</p>

        <div className="ca-form-group">
          <label className="ca-label">Announcement Title <span className="ca-required">*</span></label>
          <input
            className="ca-input"
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Annual Sports Meet 2026 Registration"
          />
          <span className="ca-hint"><Info size={12} /> This will be displayed as the main header in notifications.</span>
        </div>

        <div className="ca-form-group">
          <div className="ca-label-row">
            <label className="ca-label">Message Body <span className="ca-required">*</span></label>
            <span className="ca-char-count">{charCount} / 500 characters</span>
          </div>
          <textarea
            className="ca-textarea"
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Type your detailed announcement message here..."
            maxLength={500}
            rows={6}
          />
          <div className="ca-tip"><Info size={12} /> Tip: Keep it concise. High-priority announcements should include specific dates and locations if applicable.</div>
        </div>
      </div>

      {/* Targeting & Urgency */}
      <div className="ca-card">
        <div className="ca-section-title">Targeting & Urgency</div>
        <p className="ca-section-sub">Select who will receive this and how it should be flagged.</p>

        <div className="ca-targeting-grid">
          <div className="ca-form-group">
            <label className="ca-label">Select Audience <span className="ca-required">*</span></label>
            <div className="ca-toggle-group">
              {['Students', 'Wardens', 'Both'].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  className={`ca-toggle-btn ${form.audience === opt ? 'ca-toggle-active' : ''}`}
                  onClick={() => handleAudience(opt)}
                >{opt}</button>
              ))}
            </div>
            <span className="ca-hint">Broadcasting to <strong>{getAudienceLabel()}</strong>.</span>
          </div>

          <div className="ca-form-group">
            <label className="ca-label">Message Priority <span className="ca-required">*</span></label>
            <div className="ca-priority-group">
              {[
                { val: 'Normal', label: 'Normal', sub: 'Standard broadcast.' },
                { val: 'Important', label: 'Important', sub: 'Higher visibility.' },
                { val: 'Urgent', label: 'Urgent', sub: 'Critical alert.' },
              ].map((p) => (
                <button
                  key={p.val}
                  type="button"
                  className={`ca-priority-btn ca-priority-${p.val.toLowerCase()} ${form.priority === p.val ? 'ca-priority-selected' : ''}`}
                  onClick={() => handlePriority(p.val)}
                >
                  <span className="ca-priority-badge-label">{p.label}</span>
                  <span className="ca-priority-sub">{p.sub}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scheduling */}
      <div className="ca-card">
        <div className="ca-section-title">Scheduling</div>
        <p className="ca-section-sub">Set the timeframe for when this announcement is visible.</p>
        <div className="ca-date-grid">
          <div className="ca-form-group">
            <label className="ca-label">Publish Date & Time</label>
            <div className="ca-date-input-wrap">
              <input className="ca-input" type="datetime-local" name="publishDate" value={form.publishDate} onChange={handleChange} />
            </div>
            <span className="ca-hint">Leave blank to publish immediately.</span>
          </div>
          <div className="ca-form-group">
            <label className="ca-label">Expiry Date & Time</label>
            <div className="ca-date-input-wrap">
              <input className="ca-input" type="datetime-local" name="expiryDate" value={form.expiryDate} onChange={handleChange} />
            </div>
            <span className="ca-hint">Announcement will be archived after this date.</span>
          </div>
        </div>
      </div>

      {/* Attachments */}
      <div className="ca-card">
        <div className="ca-section-title">Attachments (Optional)</div>
        <p className="ca-section-sub">Upload documents or images relevant to this announcement.</p>
        <div
          className={`ca-dropzone ${dragOver ? 'ca-dropzone-active' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleFileDrop}
          onClick={() => fileRef.current?.click()}
        >
          <Upload size={28} className="ca-upload-icon" />
          <p className="ca-dropzone-text">Click to upload or drag and drop</p>
          <p className="ca-dropzone-sub">PDF, JPG, PNG or DOC (max. 10MB)</p>
          <input
            ref={fileRef}
            type="file"
            multiple
            hidden
            onChange={(e) => addFiles(Array.from(e.target.files))}
          />
        </div>
        {attachments.map((f, i) => (
          <div key={i} className="ca-attachment-row">
            <div className="ca-attachment-icon"><FileText size={16} /></div>
            <div className="ca-attachment-info">
              <span className="ca-attachment-name">{f.name}</span>
              <span className="ca-attachment-size">{f.size} • 100% Uploaded</span>
            </div>
            <button className="ca-attachment-remove" onClick={() => removeAttachment(i)}><X size={14} /></button>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="ca-form-actions">
        <button className="ca-btn-cancel" onClick={() => navigate('/admin/announcements')}>Cancel</button>
        <button className="ca-btn-primary">Publish Announcement</button>
      </div>
    </div>
  );
};

export default CreateAnnouncement;