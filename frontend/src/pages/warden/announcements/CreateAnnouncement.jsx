// src/pages/warden/announcements/CreateAnnouncement.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Megaphone } from 'lucide-react';
import AnnouncementForm from '../../../components/warden/announcements/AnnouncementForm';
import '../../../styles/warden/announcements/createAnnouncement.css';

const CreateAnnouncement = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    description: '',
    targetType: 'all',
    block: '',
    priority: 'Normal',
    startDate: '',
    endDate: '',
  });
  const [attachments, setAttachments] = useState([]);

  const handlePublish = () => {
    // In a real app, submit to API
    navigate('/warden/announcements');
  };

  return (
    <div className="wca-page">
      {/* Header */}
      <div className="wca-header">
        <div className="wca-header-left">
          <div className="wca-breadcrumb">
            <span onClick={() => navigate('/warden/dashboard')} className="wca-breadcrumb-link">Dashboard</span>
            <span className="wca-sep">›</span>
            <span onClick={() => navigate('/warden/announcements')} className="wca-breadcrumb-link">Announcements</span>
            <span className="wca-sep">›</span>
            <span className="wca-breadcrumb-active">Create</span>
          </div>
          <h1 className="wca-title">
            <Megaphone size={22} /> Create New Announcement
          </h1>
          <p className="wca-subtitle">Draft and schedule communications for residents.</p>
        </div>
        <div className="wca-header-actions">
          <button className="wca-btn-cancel" onClick={() => navigate('/warden/announcements')}>
            Cancel
          </button>
          <button className="wca-btn-publish" onClick={handlePublish}>
            <Megaphone size={16} /> Publish Announcement
          </button>
        </div>
      </div>

      {/* Live Preview Panel (right side on desktop) */}
      <div className="wca-layout">
        <div className="wca-form-col">
          <AnnouncementForm
            form={form}
            setForm={setForm}
            attachments={attachments}
            setAttachments={setAttachments}
          />
        </div>

        <div className="wca-preview-col">
          {/* Live Preview */}
          <div className="wca-preview-card">
            <div className="wca-preview-header">
              <span className="wca-preview-label">👁 LIVE PREVIEW</span>
              {form.priority === 'Urgent' && <span className="wca-preview-urgent">IMPORTANT</span>}
              {form.priority === 'Important' && <span className="wca-preview-important">IMPORTANT</span>}
            </div>
            <div className="wca-preview-body">
              <div className="wca-preview-target">
                TARGET:{' '}
                {form.targetType === 'all'
                  ? 'ALL STUDENTS'
                  : form.targetType === 'block'
                  ? `BLOCK ${form.block || '—'}`
                  : 'SELECTED ROOM'}
              </div>
              <h2 className="wca-preview-title">
                {form.title || 'Announcement Title'}
              </h2>
              <p className="wca-preview-message">
                {form.description || 'Your announcement message will appear here...'}
              </p>
              {attachments.length > 0 && (
                <div className="wca-preview-attachments">
                  <span className="wca-preview-att-label">ATTACHMENTS ({attachments.length})</span>
                  {attachments.map((a, i) => (
                    <div key={i} className="wca-preview-att-item">
                      📎 {a.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="wca-preview-footer">
              <p>This is how the message will appear to students.</p>
            </div>
          </div>

          {/* Estimated Reach */}
          <div className="wca-reach-card">
            <div className="wca-reach-header">
              <span className="wca-reach-label">ESTIMATED REACH</span>
              <span className="wca-reach-icon">👥</span>
            </div>
            <div className="wca-reach-value">
              {form.targetType === 'all' ? '1,240' : form.targetType === 'block' ? '310' : '4'}
            </div>
            <div className="wca-reach-row">
              <span>Recipients</span>
              <span>Students</span>
            </div>
            <div className="wca-reach-bar">
              <div className="wca-reach-bar-fill" />
            </div>
            <p className="wca-reach-desc">
              Calculated based on current residents
              {form.targetType === 'block' && form.block ? ` in Block ${form.block}` : ''}
              .
            </p>
          </div>

          {/* Pre-broadcast Check */}
          <div className="wca-precheck-card">
            <div className="wca-precheck-title">ℹ Pre-broadcast Check</div>
            <p className="wca-precheck-text">
              Once published, this message will be delivered to the mobile app and student portal.
              Urgent announcements also trigger SMS alerts.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Actions (mobile) */}
      <div className="wca-bottom-actions">
        <button className="wca-btn-save-draft">Save Draft</button>
        <button className="wca-btn-publish" onClick={handlePublish}>
          <Megaphone size={16} /> Publish Announcement
        </button>
      </div>
    </div>
  );
};

export default CreateAnnouncement;