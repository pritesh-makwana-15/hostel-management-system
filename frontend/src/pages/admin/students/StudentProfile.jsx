import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Edit, Home as HomeIcon, UserX } from 'lucide-react';
import { adminStudentApi } from '../../../services/adminStudentApi';
import '../../../styles/admin/students/student-profile.css';

const StudentProfile = () => {
  const navigate = useNavigate();
  const { id }   = useParams();

  const [student, setStudent]                   = useState(null);
  const [loading, setLoading]                   = useState(true);
  const [error, setError]                       = useState('');
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [deactivating, setDeactivating]         = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await adminStudentApi.getProfile(id);
        setStudent(res.data.data);
      } catch {
        setError('Failed to load student profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  const handleDeactivate = async () => {
    setDeactivating(true);
    try {
      await adminStudentApi.updateStatus(id, 'Inactive');
      navigate('/admin/students');
    } catch {
      alert('Failed to deactivate student.');
      setDeactivating(false);
    }
  };

  const statusColor = (status) => {
    if (status === 'Active')   return { bg: '#10B98115', text: '#10B981' };
    if (status === 'Inactive') return { bg: '#EF444415', text: '#EF4444' };
    return { bg: '#F59E0B15', text: '#F59E0B' };
  };

  if (loading) return <div className="loading">Loading profile...</div>;
  if (error)   return <div className="error">{error}</div>;
  if (!student) return null;

  const sc = statusColor(student.status);

  return (
    <div className="student-profile-page">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Student Profile</h1>
          <div className="breadcrumb">
            <span>Dashboard</span><span className="breadcrumb-separator">›</span>
            <span>Students</span><span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-active">Profile</span>
          </div>
        </div>
      </div>

      {/* Profile Header Card */}
      <div className="profile-header-card">
        <div className="profile-header-content">
          <div className="profile-photo-section">
            <img
              src={student.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`}
              alt={student.name}
              className="profile-photo"
            />
          </div>
          <div className="profile-header-info">
            <h2 className="profile-name">{student.name}</h2>
            <p className="profile-enrollment">Enrollment No: {student.enrollmentNo || '—'}</p>
            <span className="profile-status-badge"
              style={{ backgroundColor: sc.bg, color: sc.text }}>
              {student.status}
            </span>
          </div>
        </div>
        <div className="profile-header-actions">
          <button className="profile-action-btn btn-edit"
            onClick={() => navigate(`/admin/students/edit/${id}`)}>
            <Edit size={18} /> Edit
          </button>
          <button className="profile-action-btn btn-assign"
            onClick={() => navigate(`/admin/students/assign/${id}`)}>
            <HomeIcon size={18} /> Assign Room
          </button>
          <button className="profile-action-btn btn-deactivate"
            onClick={() => setShowDeactivateModal(true)}>
            <UserX size={18} /> Deactivate
          </button>
        </div>
      </div>

      {/* Content Grid */}
      <div className="profile-content-grid">

        {/* Personal Details */}
        <div className="profile-card">
          <h3 className="profile-card-title">Personal Details</h3>
          <div className="profile-details-grid">
            <DetailItem label="Full Name"    value={student.name} />
            <DetailItem label="Email"        value={student.email} />
            <DetailItem label="Phone"        value={student.phone} />
            <DetailItem label="Gender"       value={student.gender} />
            <DetailItem label="Date of Birth" value={student.dob} />
            <DetailItem label="Nationality"  value={student.nationality} />
          </div>
        </div>

        {/* Academic Details */}
        <div className="profile-card">
          <h3 className="profile-card-title">Academic Details</h3>
          <div className="profile-details-grid">
            <DetailItem label="Enrollment No"    value={student.enrollmentNo} />
            <DetailItem label="Course"           value={student.course} />
            <DetailItem label="Year / Semester"  value={student.yearSemester} />
            <DetailItem label="Batch"            value={student.batch} />
            <DetailItem label="Program"          value={student.program} />
          </div>
        </div>

        {/* Guardian Details */}
        <div className="profile-card">
          <h3 className="profile-card-title">Guardian Details</h3>
          <div className="profile-details-grid">
            <DetailItem label="Guardian Name"  value={student.guardianName} />
            <DetailItem label="Guardian Phone" value={student.guardianPhone} />
            <DetailItem label="Relationship"   value={student.guardianRelation} />
            <div className="detail-item detail-item-full">
              <span className="detail-label">Address</span>
              <span className="detail-value">{student.address || '—'}</span>
            </div>
          </div>
        </div>

        {/* Hostel Allocation */}
        <div className="profile-card">
          <h3 className="profile-card-title">Hostel Allocation</h3>
          <div className="profile-details-grid">
            <DetailItem label="Hostel Block"  value={student.hostelBlock} />
            <DetailItem label="Room Type"     value={student.roomType} />
            <DetailItem label="Room No"       value={student.roomNo} />
            <DetailItem label="Bed No"        value={student.bedNo} />
            <DetailItem label="Allocated On"  value={student.allocatedOn} />
          </div>
        </div>

        {/* Fee Summary */}
        <div className="profile-card">
          <h3 className="profile-card-title">Fee Summary</h3>
          <div className="profile-details-grid">
            <div className="detail-item">
              <span className="detail-label">Total Fees Due</span>
              <span className="detail-value">
                ₹{(student.totalFeesDue || 0).toLocaleString()}
                <span style={{
                  marginLeft: '8px', padding: '2px 8px', borderRadius: '8px',
                  fontSize: '11px', fontWeight: '500',
                  backgroundColor: student.feeStatus === 'Paid' ? '#10B98115' : '#EF444415',
                  color: student.feeStatus === 'Paid' ? '#10B981' : '#EF4444',
                }}>
                  {student.feeStatus || 'N/A'}
                </span>
              </span>
            </div>
            <DetailItem label="Last Paid Date"     value={student.lastPaidDate} />
            <DetailItem label="Current Outstanding" value={`₹${(student.currentOutstanding || 0).toLocaleString()}`} />
            <DetailItem label="Due Date"           value={student.dueDate} />
          </div>
        </div>

        {/* Complaint Summary */}
        <div className="profile-card">
          <h3 className="profile-card-title">Complaint Summary</h3>
          <div className="profile-details-grid">
            <DetailItem label="Total Complaints"    value={student.totalComplaints ?? 0} />
            <DetailItem label="Open Complaints"     value={student.openComplaints ?? 0} />
            <DetailItem label="Resolved Complaints" value={student.resolvedComplaints ?? 0} />
            <DetailItem label="Last Complaint"      value={student.lastComplaint} />
          </div>
        </div>

      </div>

      {/* Deactivate Modal */}
      {showDeactivateModal && (
        <div className="modal-overlay" onClick={() => setShowDeactivateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Confirm Deactivation</h3>
            <p>Are you sure you want to deactivate <strong>{student.name}</strong>?
              This will set their status to Inactive.</p>
            <div className="modal-actions">
              <button className="btn-secondary"
                onClick={() => setShowDeactivateModal(false)}>Cancel</button>
              <button className="btn-danger" disabled={deactivating}
                onClick={handleDeactivate}>
                {deactivating ? 'Deactivating...' : 'Confirm Deactivate'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper component
const DetailItem = ({ label, value }) => (
  <div className="detail-item">
    <span className="detail-label">{label}</span>
    <span className="detail-value">{value || '—'}</span>
  </div>
);

export default StudentProfile;