// src/pages/admin/complaints/AssignComplaint.jsx
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, Info, Hash, User, MapPin, Tag, AlertCircle,
  UserCheck, Users, StickyNote, Save, CheckCircle, Calendar
} from 'lucide-react';
import {
  getComplaintById, wardensData, hostelBlocks, getWardensByBlock
} from '../../../data/complaintsData';
import '../../../styles/admin/complaints/assignComplaint.css';

const AssignComplaint = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const complaint = getComplaintById(id);

  const [selectedBlock, setSelectedBlock] = useState(complaint?.hostelBlock || '');
  const [selectedWarden, setSelectedWarden] = useState('');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!complaint) {
    return (
      <div className="ac-page">
        <div className="ac-not-found">
          <AlertCircle size={48} />
          <h2>Complaint Not Found</h2>
          <button className="ac-btn-primary" onClick={() => navigate('/admin/complaints')}>Back to List</button>
        </div>
      </div>
    );
  }

  const filteredWardens = selectedBlock ? getWardensByBlock(selectedBlock) : wardensData;

  const getPriorityClass = (p) => {
    if (p === 'High') return 'ac-badge-high';
    if (p === 'Medium') return 'ac-badge-medium';
    return 'ac-badge-low';
  };

  const handleAssign = () => {
    if (!selectedWarden) { alert('Please select a warden.'); return; }
    setSubmitted(true);
    setTimeout(() => {
      navigate(`/admin/complaints/${id}`);
    }, 1500);
  };

  const selectedWardenData = wardensData.find(w => w.id === selectedWarden);
  const recommendedWarden = filteredWardens.reduce((min, w) =>
    w.activeComplaints < (min?.activeComplaints ?? Infinity) ? w : min, null);

  if (submitted) {
    return (
      <div className="ac-page">
        <div className="ac-success">
          <div className="ac-success-icon"><CheckCircle size={52} /></div>
          <h2>Complaint Assigned!</h2>
          <p>Redirecting to complaint details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ac-page">
      {/* Header */}
      <div className="ac-page-header">
        <div className="ac-page-header-left">
          <div className="ac-breadcrumb">
            <span>Dashboard</span><span className="ac-sep">›</span>
            <span>Complaints</span><span className="ac-sep">›</span>
            <span className="ac-breadcrumb-active">Assign</span>
          </div>
          <h1 className="ac-page-title">Assign Complaint to Warden</h1>
        </div>
        <button className="ac-back-btn" onClick={() => navigate(`/admin/complaints/${id}`)}>
          <ArrowLeft size={16} /> Back
        </button>
      </div>

      {/* Complaint Summary Card */}
      <div className="ac-card ac-summary-card">
        <div className="ac-card-title-row">
          <Info size={16} />
          <h2 className="ac-card-title">Complaint Summary</h2>
        </div>
        <div className="ac-summary-grid">
          <div className="ac-summary-item">
            <div className="ac-summary-label"><Hash size={12} /> COMPLAINT ID</div>
            <div className="ac-summary-value ac-summary-id">{complaint.id}</div>
          </div>
          <div className="ac-summary-item">
            <div className="ac-summary-label"><User size={12} /> STUDENT NAME</div>
            <div className="ac-summary-value">
              {complaint.studentName}
              <span className="ac-summary-sub">({complaint.studentId})</span>
            </div>
          </div>
          <div className="ac-summary-item">
            <div className="ac-summary-label"><MapPin size={12} /> ROOM &amp; BLOCK</div>
            <div className="ac-summary-value">{complaint.roomNumber}, {complaint.hostelBlock.split(' ')[1]}</div>
          </div>
          <div className="ac-summary-item">
            <div className="ac-summary-label"><Tag size={12} /> CATEGORY</div>
            <div className="ac-summary-value">{complaint.category}</div>
          </div>
          <div className="ac-summary-item">
            <div className="ac-summary-label"><AlertCircle size={12} /> PRIORITY</div>
            <div className="ac-summary-value">
              <span className={`ac-priority-badge ${getPriorityClass(complaint.priority)}`}>
                {complaint.priority} Priority
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Assign Warden Card */}
      <div className="ac-card">
        <h2 className="ac-section-title">Assign Warden</h2>
        <p className="ac-section-sub">Select the appropriate warden to handle this resolution.</p>

        <div className="ac-form-row">
          <div className="ac-form-group">
            <label className="ac-form-label"><Users size={14} /> Hostel Block</label>
            <select className="ac-form-select" value={selectedBlock}
              onChange={e => { setSelectedBlock(e.target.value); setSelectedWarden(''); }}>
              <option value="">All Blocks</option>
              {hostelBlocks.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
            {selectedBlock && (
              <span className="ac-filter-note">Filtering wardens assigned to this block.</span>
            )}
          </div>
          <div className="ac-form-group">
            <label className="ac-form-label"><UserCheck size={14} /> Select Warden</label>
            <select className="ac-form-select" value={selectedWarden}
              onChange={e => setSelectedWarden(e.target.value)}>
              <option value="">Choose a warden</option>
              {filteredWardens.map(w => (
                <option key={w.id} value={w.id}>
                  {w.name} ({w.activeComplaints} active)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Notes */}
        <div className="ac-form-group ac-notes-group">
          <label className="ac-form-label"><StickyNote size={14} /> Assignment Notes / Instructions</label>
          <textarea
            className="ac-form-textarea"
            placeholder="E.g., Please check the leaking pipe in the second floor bathroom. Student reported it's flooding the floor."
            value={notes}
            onChange={e => setNotes(e.target.value)}
            rows={4}
          />
        </div>

        {/* Action Buttons */}
        <div className="ac-form-actions">
          <button className="ac-btn-cancel" onClick={() => navigate(`/admin/complaints/${id}`)}>
            <ArrowLeft size={15} /> Cancel
          </button>
          <div className="ac-form-actions-right">
            <button className="ac-btn-secondary"><Save size={15} /> Save Draft</button>
            <button className="ac-btn-primary" onClick={handleAssign}>
              <UserCheck size={15} /> Assign Complaint
            </button>
          </div>
        </div>
      </div>

      {/* Hint Cards */}
      <div className="ac-hints-grid">
        <div className="ac-hint-card">
          <div className="ac-hint-icon ac-hint-icon-blue"><Users size={18} /></div>
          <div className="ac-hint-body">
            <div className="ac-hint-title">Balanced Workload</div>
            {recommendedWarden ? (
              <div className="ac-hint-text">
                Assigning to {recommendedWarden.name} is recommended based on their low current task count ({recommendedWarden.activeComplaints} active).
              </div>
            ) : (
              <div className="ac-hint-text">Select a block to see workload suggestions.</div>
            )}
          </div>
        </div>
        <div className="ac-hint-card">
          <div className="ac-hint-icon ac-hint-icon-teal"><Calendar size={18} /></div>
          <div className="ac-hint-body">
            <div className="ac-hint-title">SLA Target</div>
            <div className="ac-hint-text">
              Resolution should be completed by tomorrow 4:00 PM (24h Window).
            </div>
          </div>
        </div>
        <div className="ac-hint-card ac-hint-card-link">
          <div className="ac-hint-body">
            <div className="ac-hint-title-sm">Need help?</div>
            <button className="ac-hint-link">View Assignment Guidelines</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignComplaint;