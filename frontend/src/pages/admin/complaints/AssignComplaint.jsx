// src/pages/admin/complaints/AssignComplaint.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, Info, Hash, User, MapPin, Tag, AlertCircle, Loader,
  UserCheck, Users, StickyNote, Save, CheckCircle, Calendar
} from 'lucide-react';
import { adminComplaintApi } from '../../../services/adminOtherApi';
import { adminWardenApi } from '../../../services/adminWardenApi';
import '../../../styles/admin/complaints/assignComplaint.css';

const AssignComplaint = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [complaint, setComplaint] = useState(null);
  const [wardens, setWardens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedWarden, setSelectedWarden] = useState('');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [assigning, setAssigning] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [complaintRes, wardensRes] = await Promise.all([
          adminComplaintApi.getById(id),
          adminWardenApi.getAll()
        ]);
        
        if (complaintRes.data?.data) setComplaint(complaintRes.data.data);
        if (wardensRes.data?.data) setWardens(wardensRes.data.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load complaint or wardens');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="ac-page">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <Loader size={40} style={{ animation: 'spin 1s linear infinite' }} />
          <span style={{ marginLeft: '10px' }}>Loading...</span>
        </div>
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="ac-page">
        <div className="ac-not-found">
          <AlertCircle size={48} />
          <h2>{error ? 'Error' : 'Complaint Not Found'}</h2>
          <p>{error || `The complaint "${id}" does not exist.`}</p>
          <button className="ac-btn-primary" onClick={() => navigate('/admin/complaints')}>
            Back to List
          </button>
        </div>
      </div>
    );
  }

  const getPriorityClass = (p) => {
    if (p === 'High') return 'ac-badge-high';
    if (p === 'Medium') return 'ac-badge-medium';
    return 'ac-badge-low';
  };

  const handleAssign = async () => {
    if (!selectedWarden) {
      alert('Please select a warden.');
      return;
    }
    
    try {
      setAssigning(true);
      await adminComplaintApi.assign(id, { wardenId: parseInt(selectedWarden), notes });
      setSubmitted(true);
      setTimeout(() => {
        navigate(`/admin/complaints/${id}`);
      }, 1500);
    } catch (err) {
      console.error('Error assigning complaint:', err);
      alert('Failed to assign warden: ' + (err.response?.data?.message || err.message));
      setAssigning(false);
    }
  };

  const selectedWardenData = wardens.find(w => w.id === parseInt(selectedWarden));
  const uniqBlocks = [...new Set(wardens.map(w => w.hostelBlock || ''))].filter(Boolean);

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

        <div className="ac-form-group">
          <label className="ac-form-label"><UserCheck size={14} /> Select Warden</label>
          <select className="ac-form-select" value={selectedWarden}
            onChange={e => setSelectedWarden(e.target.value)}>
            <option value="">Choose a warden</option>
            {wardens.map(w => (
              <option key={w.id} value={w.id}>
                {w.name} - {w.hostelBlock || 'All Blocks'}
              </option>
            ))}
          </select>
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
            <button className="ac-btn-primary" onClick={handleAssign} disabled={assigning}>
              {assigning ? <Loader size={15} style={{ marginRight: '8px', animation: 'spin 1s linear infinite' }} /> : <UserCheck size={15} />}
              {assigning ? 'Assigning...' : 'Assign Complaint'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignComplaint;