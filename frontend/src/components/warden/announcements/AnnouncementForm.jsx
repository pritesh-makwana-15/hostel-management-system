// src/components/warden/announcements/AnnouncementForm.jsx
import React, { useRef } from 'react';
import { Upload, X, FileText, Info } from 'lucide-react';

const AnnouncementForm = ({ form, setForm, attachments, setAttachments }) => {
  const fileRef = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const addFiles = (files) => {
    const newFiles = Array.from(files).map((f) => ({
      name: f.name,
      size: (f.size / (1024 * 1024)).toFixed(1) + ' MB',
      type: f.type.includes('image') ? 'image' : 'pdf',
    }));
    setAttachments((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (idx) => setAttachments((prev) => prev.filter((_, i) => i !== idx));

  return (
    <>
      {/* Broadcast Details */}
      <div className="wa-form-card">
        <div className="wa-form-section-title">Broadcast Details</div>
        <p className="wa-form-section-sub">Define the core message and target audience.</p>

        <div className="wa-form-label-row">
          <span className="wa-form-badge">ANNOUNCEMENT CONTENT</span>
        </div>

        <div className="wa-form-group">
          <label className="wa-form-label">
            Announcement Title <span className="wa-required">*</span>
          </label>
          <input
            className="wa-form-input"
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Annual Hostel Maintenance & Safety Drill Schedule"
          />
          <span className="wa-form-hint">
            <Info size={12} /> This will be displayed as the main header in notifications.
          </span>
        </div>

        <div className="wa-form-group">
          <div className="wa-label-char-row">
            <label className="wa-form-label">
              Message Body <span className="wa-required">*</span>
            </label>
            <span className="wa-char-count">{form.description?.length || 0} / 500</span>
          </div>
          <textarea
            className="wa-form-textarea"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Type your detailed announcement message here..."
            maxLength={500}
            rows={6}
          />
          <div className="wa-form-tip">
            <Info size={12} /> Tip: Keep it concise. High-priority announcements should include specific dates and locations if applicable.
          </div>
        </div>
      </div>

      {/* Targeting & Priority */}
      <div className="wa-form-card">
        <div className="wa-form-label-row">
          <span className="wa-form-badge">TARGETING &amp; PRIORITY</span>
        </div>

        <div className="wa-targeting-grid">
          <div className="wa-form-group">
            <label className="wa-form-label">
              Select Audience <span className="wa-required">*</span>
            </label>
            <select className="wa-form-select" name="targetType" value={form.targetType} onChange={handleChange}>
              <option value="all">All Students</option>
              <option value="block">Block</option>
              <option value="room">Room</option>
            </select>
            {form.targetType === 'block' && (
              <select className="wa-form-select" style={{ marginTop: 8 }} name="block" value={form.block || ''} onChange={handleChange}>
                <option value="">Select Block</option>
                <option value="A">Block A</option>
                <option value="B">Block B</option>
                <option value="C">Block C</option>
                <option value="D">Block D</option>
              </select>
            )}
          </div>

          <div className="wa-form-group">
            <label className="wa-form-label">Delivery Priority</label>
            <div className="wa-priority-group">
              {['Normal', 'Important', 'Urgent'].map((p) => (
                <button
                  key={p}
                  type="button"
                  className={`wa-priority-btn wa-priority-${p.toLowerCase()} ${form.priority === p ? 'wa-priority-selected' : ''}`}
                  onClick={() => setForm((prev) => ({ ...prev, priority: p }))}
                >
                  <span className="wa-priority-label">{p}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scheduling */}
      <div className="wa-form-card">
        <div className="wa-form-label-row">
          <span className="wa-form-badge">SCHEDULING</span>
        </div>

        <div className="wa-date-grid">
          <div className="wa-form-group">
            <label className="wa-form-label">Publish Date &amp; Time</label>
            <input className="wa-form-input" type="datetime-local" name="startDate" value={form.startDate} onChange={handleChange} />
            <span className="wa-form-hint">Leave blank to publish immediately.</span>
          </div>
          <div className="wa-form-group">
            <label className="wa-form-label">Expiry Date &amp; Time</label>
            <input className="wa-form-input" type="datetime-local" name="endDate" value={form.endDate} onChange={handleChange} />
            <span className="wa-form-hint">Announcement will be archived after this date.</span>
          </div>
        </div>
      </div>

      {/* Attachments */}
      <div className="wa-form-card">
        <div className="wa-form-label-row">
          <span className="wa-form-badge">ATTACHMENTS (OPTIONAL)</span>
        </div>

        <div
          className="wa-dropzone"
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); addFiles(e.dataTransfer.files); }}
        >
          <Upload size={28} className="wa-upload-icon" />
          <p className="wa-dropzone-text">Click to upload or drag and drop</p>
          <p className="wa-dropzone-sub">PDF, JPG, PNG or DOC (max. 10MB)</p>
          <input
            ref={fileRef}
            type="file"
            multiple
            hidden
            onChange={(e) => addFiles(e.target.files)}
          />
        </div>

        {attachments.map((f, i) => (
          <div key={i} className="wa-attachment-row">
            <FileText size={16} className="wa-attachment-icon" />
            <div className="wa-attachment-info">
              <span className="wa-attachment-name">{f.name}</span>
              <span className="wa-attachment-size">{f.size} • Uploaded</span>
            </div>
            <button className="wa-attachment-remove" onClick={() => removeFile(i)}>
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default AnnouncementForm;