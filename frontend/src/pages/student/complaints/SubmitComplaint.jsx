// src/pages/student/complaints/SubmitComplaint.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Info,
  Wrench,
  Zap,
  Wifi,
  Utensils,
  Brush,
  Package,
  HelpCircle,
  Link,
  Clock,
  Shield,
  AlertTriangle,
  Trash2,
  Plus,
} from 'lucide-react';
import { studentApi } from '../../../services/studentApi';
import '../../../styles/student/complaints/complaints.css';

const CATEGORIES = [
  { id: 'Plumbing',    label: 'Plumbing',    icon: <Wrench size={20} /> },
  { id: 'Electrical', label: 'Electrical',   icon: <Zap size={20} /> },
  { id: 'Internet',   label: 'Internet',     icon: <Wifi size={20} /> },
  { id: 'Mess / Food', label: 'Food',        icon: <Utensils size={20} /> },
  { id: 'Cleaning',   label: 'Cleaning',     icon: <Brush size={20} /> },
  { id: 'Other',      label: 'Other',        icon: <HelpCircle size={20} /> },
];

const PRIORITIES = ['Low', 'Medium', 'High'];

const SLA_INFO = {
  High:   { label: '< 24 Hours',  cls: 'high' },
  Medium: { label: '2 - 3 Days',  cls: 'medium' },
  Low:    { label: '5 - 7 Days',  cls: 'low' },
};

const MAX_CHARS = 1000;

const SubmitComplaint = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [description, setDescription] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [studentRoomNumber, setStudentRoomNumber] = useState('');

  useEffect(() => {
    const loadStudentProfile = async () => {
      try {
        const response = await studentApi.getProfile();
        const profile = response?.data?.data;
        if (profile) {
          setStudentName(profile.name || '');
          setStudentRoomNumber(profile.roomNo || '');
        }
      } catch (error) {
        console.error('Failed to load student profile for complaint form:', error);
      }
    };

    loadStudentProfile();
  }, []);

  /* Fake file upload simulation */
  const handleFiles = (files) => {
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newFile = {
          id: Date.now() + Math.random(),
          name: file.name,
          preview: e.target.result,
          progress: 0,
        };
        setUploadedFiles((prev) => [...prev, newFile]);

        // Simulate progress
        let prog = 0;
        const interval = setInterval(() => {
          prog += Math.floor(Math.random() * 25) + 10;
          if (prog >= 100) { prog = 100; clearInterval(interval); }
          setUploadedFiles((prev) =>
            prev.map((f) => (f.id === newFile.id ? { ...f, progress: prog } : f))
          );
        }, 200);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeFile = (id) => setUploadedFiles((prev) => prev.filter((f) => f.id !== id));

  const handleSubmit = async () => {
    if (!title || !category || !description) {
      alert('Please fill in all required fields.');
      return;
    }

    try {
      setSubmitting(true);
      await studentApi.createComplaint({
        title,
        category,
        priority,
        description,
        roomNumber: studentRoomNumber,
      });

      alert(`Complaint submitted successfully!\n\nTitle: ${title}\nCategory: ${category}\nPriority: ${priority}`);
      navigate('/student/complaints');
    } catch (error) {
      const message = error?.response?.data?.message || 'Unable to submit complaint. Please try again.';
      alert(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="submit-complaint-page">
      {/* Breadcrumb */}
      <div className="page-breadcrumb">
        <span onClick={() => navigate('/student/dashboard')}>Dashboard</span>
        <span className="sep">›</span>
        <span onClick={() => navigate('/student/complaints')}>My Complaints</span>
        <span className="sep">›</span>
        <span className="current">New Complaint</span>
      </div>

      {/* Page Header */}
      <div className="submit-complaint-header">
        <h1>Submit Complaint</h1>
        <p>Log an issue or facility request. Our team will resolve it based on priority.</p>
      </div>

      <div className="submit-complaint-grid">
        {/* ── LEFT: FORM ── */}
        <div>
          {/* Instructions Banner */}
          <div className="instructions-banner">
            <Info size={16} />
            <p>
              <strong>Instructions: </strong>
              Please provide clear details of the issue. Attach photos if available to help our
              technicians identify the problem faster.{' '}
              <strong>Room numbers are automatically fetched</strong> from your profile.
            </p>
          </div>

          <div className="form-card">
            <div className="form-card-title">Problem Details</div>

            {/* Title */}
            <div className="form-group">
              <label className="form-label">
                Complaint Title <span className="required">*</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="Leaking tap in bathroom"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Category */}
            <div className="form-group">
              <label className="form-label">
                Category <span className="required">*</span>
              </label>
              <div className="category-grid">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    className={`category-btn ${category === cat.id ? 'selected' : ''}`}
                    onClick={() => setCategory(cat.id)}
                    type="button"
                  >
                    {cat.icon}
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Priority + Room */}
            <div className="priority-row">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Priority Level</label>
                <div className="priority-toggle-group">
                  {PRIORITIES.map((p) => (
                    <button
                      key={p}
                      type="button"
                      className={`priority-toggle ${priority === p ? `selected-${p.toLowerCase()}` : ''}`}
                      onClick={() => setPriority(p)}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Room Number</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    className="form-input"
                    value={studentRoomNumber}
                    readOnly
                  />
                  <Link
                    size={14}
                    style={{
                      position: 'absolute', right: 12, top: '50%',
                      transform: 'translateY(-50%)', color: 'var(--text-secondary)',
                    }}
                  />
                </div>
                <span className="form-input-hint">
                  <Info size={11} /> Linked to your student profile
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="form-group" style={{ marginTop: 22 }}>
              <label className="form-label">
                Detailed Description <span className="required">*</span>
              </label>
              <textarea
                className="form-textarea"
                placeholder="Describe the issue in detail..."
                value={description}
                onChange={(e) => setDescription(e.target.value.slice(0, MAX_CHARS))}
              />
              <div className="char-count">
                {description.length} / {MAX_CHARS}
              </div>
            </div>

            {/* Submit Footer */}
            <div className="submit-footer">
              <div className="submit-footer-info">
                <strong>Submitting as {studentName || 'Student'}</strong>
                Room {studentRoomNumber || '-'} | Student
              </div>
              <div className="submit-footer-btns">
                <button className="btn-secondary" onClick={() => navigate('/student/complaints')}>
                  Cancel
                </button>
                <button className="btn-primary" onClick={handleSubmit} disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Complaint'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="right-panel">
          {/* Attachments */}
          <div className="panel-card">
            <div className="panel-card-title">
              <Package size={16} /> Attachments &amp; Evidence
            </div>

            {/* Drop Zone */}
            <div
              className={`upload-zone ${dragOver ? 'drag-over' : ''}`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current.click()}
            >
              <div className="upload-icon"><Plus size={20} /></div>
              <p>
                <strong>Click to upload</strong> or drag and drop
                <br />
                PNG, JPG or PDF (max. 5MB each)
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,.pdf"
                style={{ display: 'none' }}
                onChange={(e) => handleFiles(e.target.files)}
              />
            </div>

            {/* File List */}
            {uploadedFiles.length > 0 && (
              <div className="upload-files-list">
                {uploadedFiles.map((f) => (
                  <div className="upload-file-item" key={f.id}>
                    <img
                      src={f.preview}
                      alt={f.name}
                      className="upload-file-thumb"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <div className="upload-file-info">
                      <div className="file-name">{f.name}</div>
                      <div className="file-progress">
                        <div className="progress-bar-bg">
                          <div
                            className="progress-bar-fill"
                            style={{ width: `${f.progress}%` }}
                          />
                        </div>
                        <span className="file-percent">{f.progress}%</span>
                      </div>
                    </div>
                    <button className="upload-delete-btn" onClick={() => removeFile(f.id)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="upload-tip">
              <Info size={12} /> Upload clear photos to avoid inspection delays.
            </div>
          </div>

          {/* SLA Card */}
          <div className="sla-card">
            <div className="sla-card-title">
              <Clock size={16} /> SLA Expectations
            </div>
            <p className="sla-desc">
              Our maintenance team prioritizes requests based on urgency and safety. Here is our
              committed turnaround time:
            </p>
            <div className="sla-rows">
              {Object.entries(SLA_INFO).map(([level, info]) => (
                <div className="sla-row" key={level}>
                  <span className="sla-label">{level} Priority</span>
                  <span className={`sla-value ${info.cls}`}>{info.label}</span>
                </div>
              ))}
            </div>
            <div className="sla-divider" />
            <div className="sla-guarantee">
              <Shield size={13} />
              <span><strong>SERVICE GUARANTEE</strong> — All repairs are covered by HMS Policy.</span>
            </div>
          </div>

          {/* Help Card */}
          <div className="help-card">
            <div className="help-card-title">NEED IMMEDIATE HELP?</div>
            <p>
              For emergencies like gas leaks or fire hazards, please call the 24/7 Warden Desk directly.
            </p>
            <div className="help-phone">+91 98765 43210</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitComplaint;