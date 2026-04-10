// src/pages/admin/announcements/EditAnnouncement.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Info, Clock } from 'lucide-react';
import '../../../styles/admin/announcements/editAnnouncement.css';

const EditAnnouncement = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [ann, setAnn] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    message: '',
    audience: 'Both',
    priority: 'Normal',
    publishDate: '',
    expiryDate: '',
  });

  // Fetch announcement data from backend
  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const token = localStorage.getItem('hms_token');
        const response = await fetch(`http://localhost:8080/api/announcements/${id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data && data.data) {
            setAnn(data.data);
            setForm({
              title: data.data.title || '',
              message: data.data.message || '',
              audience: data.data.audience || 'Both',
              priority: data.data.priority || 'Normal',
              publishDate: data.data.publishDate ? new Date(data.data.publishDate).toISOString().slice(0, 16) : '',
              expiryDate: data.data.expiryDate ? new Date(data.data.expiryDate).toISOString().slice(0, 16) : '',
            });
          } else {
            setError('Announcement not found or has been deleted');
          }
        } else {
          setError('Announcement not found or has been deleted');
          // Redirect back to list after a short delay
          setTimeout(() => {
            navigate('/admin/announcements');
          }, 2000);
        }
      } catch (err) {
        console.error('Error fetching announcement:', err);
        setError('Error connecting to server');
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncement();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const getStatusClass = (s) => {
    if (s === 'Active') return 'ea-status-active';
    if (s === 'Scheduled') return 'ea-status-scheduled';
    return 'ea-status-expired';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (updating) return;
    
    setUpdating(true);
    try {
      const token = localStorage.getItem('hms_token');
      const response = await fetch(`http://localhost:8080/api/announcements/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      });

      if (response.ok) {
        navigate('/admin/announcements');
      } else {
        setError('Failed to update announcement');
      }
    } catch (err) {
      console.error('Error updating announcement:', err);
      setError('Error connecting to server');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="ea-page">
      {/* Loading State */}
      {loading && (
        <div className="ea-loading">
          <div className="ea-loading-spinner"></div>
          <p>Loading announcement...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="ea-error">
          <span>{error}</span>
          <button onClick={() => setError('')}>×</button>
        </div>
      )}

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
            {ann && <span className={`ea-status-badge ${getStatusClass(ann.status)}`}>{ann.status}</span>}
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
          <span className="ea-meta-value">{ann ? `ANN-${ann.id}` : 'Loading...'}</span>
        </div>
        <div className="ea-meta-item">
          <span className="ea-meta-label">CREATED BY</span>
          <span className="ea-meta-value">{ann ? ann.createdBy || 'Admin' : 'Loading...'}</span>
        </div>
        <div className="ea-meta-item">
          <span className="ea-meta-label">CREATED DATE</span>
          <span className="ea-meta-value">{ann ? new Date(ann.createdAt).toLocaleDateString() : 'Loading...'}</span>
        </div>
        <div className="ea-meta-item">
          <span className="ea-meta-label">LAST MODIFIED</span>
          <span className="ea-meta-value">{ann ? (ann.updatedAt ? new Date(ann.updatedAt).toLocaleDateString() : 'Never') : 'Loading...'}</span>
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
              <input className="ea-input" type="datetime-local" name="publishDate" value={form.publishDate} onChange={handleChange} />
            </div>
          </div>
          <div className="ea-form-group">
            <label className="ea-label">Expiry Date <span className="ea-required">*</span></label>
            <div className="ea-date-wrap">
              <input className="ea-input" type="datetime-local" name="expiryDate" value={form.expiryDate} onChange={handleChange} />
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

        {/* Auto-save hint + Actions */}
        <div className="ea-form-actions">
          <span className="ea-autosave"><Info size={12} /> Last auto-saved at 10:24 AM</span>
          <div className="ea-form-actions">
            <button className="ea-btn-cancel" onClick={() => navigate('/admin/announcements')}>Cancel</button>
            <button className="ea-btn-primary" disabled={loading || updating} onClick={handleSubmit}>
              {updating ? 'Updating...' : 'Update Announcement'}
            </button>
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