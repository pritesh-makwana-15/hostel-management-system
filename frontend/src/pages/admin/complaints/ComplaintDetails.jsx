// src/pages/admin/complaints/ComplaintDetails.jsx
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, Tag, User, MapPin, Calendar, AlertCircle,
  Phone, Mail, UserCheck, MessageSquare, RefreshCw, Paperclip
} from 'lucide-react';
import { getComplaintById, wardensData } from '../../../data/complaintsData';
import '../../../styles/admin/complaints/complaintDetails.css';

const ComplaintDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const complaint = getComplaintById(id);

  if (!complaint) {
    return (
      <div className="cd-page">
        <div className="cd-not-found">
          <AlertCircle size={48} />
          <h2>Complaint Not Found</h2>
          <p>The complaint "{id}" does not exist.</p>
          <button className="cd-btn-primary" onClick={() => navigate('/admin/complaints')}>
            Back to List
          </button>
        </div>
      </div>
    );
  }

  const warden = wardensData.find(w => w.id === complaint.assignedWardenId);

  const getPriorityClass = (p) => {
    if (p === 'High') return 'cd-badge-priority cd-priority-high';
    if (p === 'Medium') return 'cd-badge-priority cd-priority-medium';
    return 'cd-badge-priority cd-priority-low';
  };

  const getStatusClass = (s) => {
    if (s === 'Open') return 'cd-badge-status cd-status-open';
    if (s === 'In Progress') return 'cd-badge-status cd-status-inprogress';
    if (s === 'Resolved') return 'cd-badge-status cd-status-resolved';
    return 'cd-badge-status cd-status-closed';
  };

  return (
    <div className="cd-page">
      {/* Header */}
      <div className="cd-page-header">
        <div className="cd-page-header-left">
          <div className="cd-breadcrumb">
            <span>Dashboard</span><span className="cd-sep">›</span>
            <span>Complaints</span><span className="cd-sep">›</span>
            <span className="cd-breadcrumb-active">Complaint Details</span>
          </div>
          <h1 className="cd-page-title">Complaint Details: #{complaint.id}</h1>
        </div>
        <button className="cd-back-btn" onClick={() => navigate('/admin/complaints')}>
          <ArrowLeft size={16} /> Back to List
        </button>
      </div>

      {/* Two-column layout */}
      <div className="cd-layout">
        {/* Left Column */}
        <div className="cd-left">
          {/* General Info Card */}
          <div className="cd-card">
            <h2 className="cd-card-title">General Information</h2>
            <div className="cd-info-grid">
              <div className="cd-info-item">
                <div className="cd-info-label"><Tag size={13} /> COMPLAINT ID</div>
                <div className="cd-info-value cd-id-value">#{complaint.id}</div>
              </div>
              <div className="cd-info-item">
                <div className="cd-info-label"><Paperclip size={13} /> CATEGORY</div>
                <div className="cd-info-value">{complaint.category}</div>
              </div>
              <div className="cd-info-item">
                <div className="cd-info-label"><AlertCircle size={13} /> PRIORITY</div>
                <div className="cd-info-value">
                  <span className={getPriorityClass(complaint.priority)}>{complaint.priority}</span>
                </div>
              </div>
              <div className="cd-info-item">
                <div className="cd-info-label"><User size={13} /> STUDENT NAME</div>
                <div className="cd-info-value">{complaint.studentName}</div>
              </div>
              <div className="cd-info-item">
                <div className="cd-info-label"><Tag size={13} /> STUDENT ID</div>
                <div className="cd-info-value">{complaint.studentId}</div>
              </div>
              <div className="cd-info-item">
                <div className="cd-info-label"><RefreshCw size={13} /> STATUS</div>
                <div className="cd-info-value">
                  <span className={getStatusClass(complaint.status)}>{complaint.status}</span>
                </div>
              </div>
              <div className="cd-info-item">
                <div className="cd-info-label"><MapPin size={13} /> HOSTEL / BLOCK</div>
                <div className="cd-info-value">{complaint.hostelBlock}</div>
              </div>
              <div className="cd-info-item">
                <div className="cd-info-label"><MapPin size={13} /> ROOM NUMBER</div>
                <div className="cd-info-value">{complaint.roomNumber}</div>
              </div>
              <div className="cd-info-item">
                <div className="cd-info-label"><Calendar size={13} /> SUBMITTED DATE</div>
                <div className="cd-info-value">{complaint.submittedDate} – {complaint.submittedTime}</div>
              </div>
            </div>
          </div>

          {/* Problem Description */}
          <div className="cd-card">
            <h2 className="cd-card-title">Problem Description</h2>
            <p className="cd-description">{complaint.description}</p>
          </div>

          {/* Attachments */}
          <div className="cd-card">
            <h2 className="cd-card-title">Attachments &amp; Evidence</h2>
            {complaint.attachments.length > 0 ? (
              <div className="cd-attachments">
                {complaint.attachments.map((src, i) => (
                  <div key={i} className="cd-attachment-thumb">
                    <img src={src} alt={`Attachment ${i + 1}`} />
                  </div>
                ))}
                <div className="cd-attachment-viewall">
                  <Paperclip size={20} />
                  <span>VIEW ALL</span>
                </div>
              </div>
            ) : (
              <p className="cd-no-attachments">No attachments provided.</p>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="cd-right">
          {/* Assigned Personnel */}
          <div className="cd-card">
            <h2 className="cd-card-title">Assigned Personnel</h2>
            {warden ? (
              <div className="cd-warden-info">
                <div className="cd-warden-avatar-wrap">
                  <div className="cd-warden-avatar">{warden.avatar}</div>
                  <div className="cd-warden-status-dot" />
                </div>
                <div className="cd-warden-name">{warden.name}</div>
                <div className="cd-warden-role">{warden.designation} ({warden.block.split(' ')[1]})</div>
                <div className="cd-warden-contacts">
                  <div className="cd-warden-contact"><Phone size={14} /> {warden.phone}</div>
                  <div className="cd-warden-contact"><Mail size={14} /> {warden.email}</div>
                </div>
                <button className="cd-btn-outline" onClick={() => navigate(`/admin/complaints/${id}/assign`)}>
                  Change Warden
                </button>
              </div>
            ) : (
              <div className="cd-no-warden">
                <User size={40} />
                <p>No warden assigned yet</p>
                <button className="cd-btn-primary" onClick={() => navigate(`/admin/complaints/${id}/assign`)}>
                  <UserCheck size={15} /> Assign Warden
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="cd-action-bar">
        <div className="cd-action-bar-left">
          <div className="cd-action-bar-icon"><RefreshCw size={18} /></div>
          <div>
            <div className="cd-action-bar-title">Immediate Actions Required</div>
            <div className="cd-action-bar-sub">Select a workflow to proceed with the resolution.</div>
          </div>
        </div>
        <div className="cd-action-bar-buttons">
          <button className="cd-btn-outline-sm" onClick={() => navigate(`/admin/complaints/${id}/assign`)}>
            <UserCheck size={15} /> Assign Warden
          </button>
          <button className="cd-btn-outline-sm" onClick={() => navigate(`/admin/complaints/${id}/response`)}>
            <MessageSquare size={15} /> Reply to Student
          </button>
          <button className="cd-btn-primary-sm" onClick={() => navigate(`/admin/complaints/${id}/response`)}>
            <RefreshCw size={15} /> Update Status
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetails;