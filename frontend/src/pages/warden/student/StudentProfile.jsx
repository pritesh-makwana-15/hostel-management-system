// src/pages/warden/StudentProfile.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Home, GraduationCap, User, Users,
  MessageSquare, Shield, ChevronLeft, Pencil,
  IdCard, Building2, Mail, Phone,
  CalendarDays, Globe, Droplets,
} from 'lucide-react';
import { wardenStudentApi } from '../../../services/wardenStudentApi';
import '../../../styles/warden/student/student-profile.css';

const getStatusColor = (status) => {
  const colors = {
    'Active': '#059669',
    'Inactive': '#DC2626',
    'On Leave': '#D97706'
  };
  return colors[status] || '#6B7280';
};

const DetailItem = ({ label, value }) => (
  <div className="wsp-detail-item">
    <span className="wsp-detail-label">{label}</span>
    <span className="wsp-detail-value">{value || '—'}</span>
  </div>
);

const SectionCard = ({ icon: Icon, title, children, action }) => (
  <div className="wsp-card">
    <div className="wsp-card-header">
      <div className="wsp-card-heading">
        <Icon size={18} className="wsp-card-icon" />
        <h3 className="wsp-card-title">{title}</h3>
      </div>
      {action && <button className="wsp-view-history">{action}</button>}
    </div>
    <div className="wsp-card-body">{children}</div>
  </div>
);

const StudentProfile = () => {
  const { id }   = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await wardenStudentApi.getProfile(id);
        setStudent(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (loading) return <div className="wsp-loading">Loading profile…</div>;
  if (error) return <div className="wsp-error">{error}</div>;
  if (!student) return <div className="wsp-loading">Profile not found</div>;

  const statusColor = getStatusColor(student.status);

  return (
    <div className="wsp-page">

      {/* ── Breadcrumb + Title ───────────────────────────── */}
      <div className="wsp-page-header">
        <div className="wsp-page-header-left">
          <div className="wsp-breadcrumb">
            <span>Dashboard</span>
            <span className="wsp-bc-sep">›</span>
            <span
              className="wsp-bc-link"
              onClick={() => navigate('/warden/students')}
            >
              Students
            </span>
            <span className="wsp-bc-sep">›</span>
            <span className="wsp-bc-active">Profile</span>
          </div>
          <h1 className="wsp-page-title">Student Profile</h1>
        </div>
        <div className="wsp-page-actions">
          <button
            className="wsp-btn-back"
            onClick={() => navigate('/warden/students')}
          >
            <ChevronLeft size={16} />
            Back to List
          </button>
          <button
            className="wsp-btn-edit"
            onClick={() => navigate(`/warden/students/edit/${id}`)}
          >
            <Pencil size={15} />
            Edit Profile
          </button>
        </div>
      </div>

      {/* ── Profile Hero Card ────────────────────────────── */}
      <div className="wsp-hero">
        <div className="wsp-hero-left">
          <div className="wsp-avatar-wrap">
            <img src={student.photoUrl} alt={student.name} className="wsp-avatar" />
            <span
              className="wsp-status-pill"
              style={{ background: statusColor }}
            >
              {student.status.toUpperCase()}
            </span>
          </div>
          <div className="wsp-hero-info">
            <h2 className="wsp-hero-name">{student.name}</h2>
            <div className="wsp-hero-meta">
              <span className="wsp-hero-meta-item">
                <IdCard size={14} />
                ID: {student.enrollmentNo}
              </span>
              <span className="wsp-hero-divider">|</span>
              <span className="wsp-hero-meta-item">
                <Building2 size={14} />
                {student.hostelBlock}, Room {student.roomNo}
              </span>
            </div>
            <div className="wsp-hero-tags">
              <span className="wsp-tag">{student.course}</span>
              <span className="wsp-tag">Batch {student.batch}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Detail Cards Grid ────────────────────────────── */}
      <div className="wsp-grid">

        {/* Hostel Allocation */}
        <SectionCard icon={Home} title="Hostel Allocation">
          <div className="wsp-details-grid">
            <DetailItem label="HOSTEL BLOCK"     value={student.hostelBlock} />
            <DetailItem label="ROOM TYPE"        value={student.roomType} />
            <DetailItem label="ROOM NUMBER"      value={student.roomNo} />
            <DetailItem label="BED NUMBER"       value={student.bedNo} />
            <DetailItem label="ALLOCATED ON"     value={student.allocatedOn ? new Date(student.allocatedOn).toLocaleDateString() : '—'} />
          </div>
        </SectionCard>

        {/* Academic Details */}
        <SectionCard icon={GraduationCap} title="Academic Details">
          <div className="wsp-details-grid">
            <DetailItem label="COURSE"             value={student.course} />
            <DetailItem label="PROGRAM"            value={student.program} />
            <DetailItem label="CURRENT SEMESTER"   value={student.yearSemester} />
            <DetailItem label="ACADEMIC BATCH"     value={student.batch} />
            <DetailItem label="ENROLLMENT NUMBER"  value={student.enrollmentNo} />
          </div>
        </SectionCard>

        {/* Personal Information */}
        <SectionCard icon={User} title="Personal Information">
          <div className="wsp-details-grid">
            <div className="wsp-detail-item">
              <span className="wsp-detail-label">
                <Mail size={12} style={{ marginRight: 4 }} />
                EMAIL ADDRESS
              </span>
              <span className="wsp-detail-value">{student.email}</span>
            </div>
            <div className="wsp-detail-item">
              <span className="wsp-detail-label">
                <Phone size={12} style={{ marginRight: 4 }} />
                PHONE NUMBER
              </span>
              <span className="wsp-detail-value">{student.phone}</span>
            </div>
            <div className="wsp-detail-item">
              <span className="wsp-detail-label">
                <CalendarDays size={12} style={{ marginRight: 4 }} />
                DATE OF BIRTH
              </span>
              <span className="wsp-detail-value">
                {student.dob ? new Date(student.dob).toLocaleDateString('en-US', {
                  month: 'long', day: 'numeric', year: 'numeric',
                }) : '—'}
              </span>
            </div>
            <DetailItem label="GENDER"      value={student.gender} />
            <div className="wsp-detail-item">
              <span className="wsp-detail-label">
                <Globe size={12} style={{ marginRight: 4 }} />
                NATIONALITY
              </span>
              <span className="wsp-detail-value">{student.nationality}</span>
            </div>
          </div>
        </SectionCard>

        {/* Guardian Details */}
        <SectionCard icon={Users} title="Guardian Details">
          <div className="wsp-details-grid">
            <DetailItem label="GUARDIAN NAME"     value={student.guardianName} />
            <DetailItem label="RELATIONSHIP"      value={student.guardianRelation} />
            <div className="wsp-detail-item">
              <span className="wsp-detail-label">
                <Phone size={12} style={{ marginRight: 4 }} />
                CONTACT NUMBER
              </span>
              <span className="wsp-detail-value">{student.guardianPhone}</span>
            </div>
            <div className="wsp-detail-item wsp-detail-full">
              <span className="wsp-detail-label">PERMANENT ADDRESS</span>
              <span className="wsp-detail-value">{student.address}</span>
            </div>
          </div>
        </SectionCard>

        {/* Complaint History */}
        <SectionCard icon={MessageSquare} title="Complaint History" action="View History">
          <div className="wsp-complaint-stats">
            <div className="wsp-complaint-stat">
              <span className="wsp-complaint-num">{student.totalComplaints || 0}</span>
              <span className="wsp-complaint-lbl">TOTAL</span>
            </div>
            <div className="wsp-complaint-divider" />
            <div className="wsp-complaint-stat">
              <span className="wsp-complaint-num wsp-resolved">{student.resolvedComplaints || 0}</span>
              <span className="wsp-complaint-lbl">RESOLVED</span>
            </div>
            <div className="wsp-complaint-divider" />
            <div className="wsp-complaint-stat">
              <span className="wsp-complaint-num wsp-pending">{student.openComplaints || 0}</span>
              <span className="wsp-complaint-lbl">PENDING</span>
            </div>
          </div>
          <p className="wsp-latest-activity">
            <Shield size={13} style={{ marginRight: 6, flexShrink: 0 }} />
            {student.lastComplaint || 'No recent activity'}
          </p>
        </SectionCard>

        {/* Fee Status */}
        <SectionCard icon={Shield} title="Fee Status">
          <div className="wsp-fee-row">
            <span className="wsp-fee-label">Current Outstanding</span>
            <span
              className="wsp-fee-status"
              style={{
                color: (student.currentOutstanding || 0) === 0 ? '#059669' : '#DC2626',
                background: (student.currentOutstanding || 0) === 0 ? '#D1FAE5' : '#FEE2E2',
              }}
            >
              ₹{student.currentOutstanding || 0}
            </span>
          </div>
          <div className="wsp-fee-divider" />
          <div className="wsp-fee-meta">
            <div className="wsp-fee-meta-item">
              <span className="wsp-detail-label">TOTAL FEES DUE</span>
              <span className="wsp-detail-value">₹{student.totalFeesDue || 0}</span>
            </div>
            <div className="wsp-fee-meta-item">
              <span className="wsp-detail-label">STATUS</span>
              <span className="wsp-detail-value">{student.feeStatus || 'N/A'}</span>
            </div>
          </div>
        </SectionCard>

      </div>
    </div>
  );
};

export default StudentProfile;