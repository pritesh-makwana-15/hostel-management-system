// src/pages/admin/announcements/CreateAnnouncement.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Megaphone, Info } from 'lucide-react';
import '../../../styles/admin/announcements/createAnnouncement.css';

const CreateAnnouncement = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', message: '', audience: 'Students', priority: 'Normal',
    publishDate: '', expiryDate: '',
  });
  const [charCount, setCharCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (name === 'message') setCharCount(value.length);
  };

  const handleAudience = (val) => setForm(prev => ({ ...prev, audience: val }));
  const handlePriority = (val) => setForm(prev => ({ ...prev, priority: val }));

  const getAudienceLabel = () => {
    if (form.audience === 'Students') return 'all students';
    if (form.audience === 'Wardens') return 'all wardens';
    return 'all students and wardens';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!form.title.trim() || !form.message.trim()) {
      setError('Title and message are required');
      return;
    }
    
    if (form.message.length > 500) {
      setError('Message must be 500 characters or less');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('hms_token');
      const announcementData = {
        title: form.title.trim(),
        message: form.message.trim(),
        audience: form.audience,
        priority: form.priority,
        publishDate: form.publishDate || null,
        expiryDate: form.expiryDate || null
      };
      
      const response = await fetch('http://localhost:8080/api/announcements', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(announcementData)
      });
      
      if (response.ok) {
        navigate('/admin/announcements');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to create announcement');
      }
    } catch (err) {
      console.error('Error creating announcement:', err);
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ca-page">
      {/* Error Display */}
      {error && (
        <div className="ca-error">
          <span>{error}</span>
          <button onClick={() => setError('')}>×</button>
        </div>
      )}

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

      {/* Actions */}
      <div className="ca-form-actions">
        <button className="ca-btn-cancel" onClick={() => navigate('/admin/announcements')}>Cancel</button>
        <button 
          className="ca-btn-primary" 
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Publishing...' : 'Publish Announcement'}
        </button>
      </div>
    </div>
  );
};

export default CreateAnnouncement;