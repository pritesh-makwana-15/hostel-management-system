import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Edit, Home as HomeIcon, UserX } from 'lucide-react';
import { getStudentById } from '../../../data/studentsData';
import '../../../styles/admin/students/student-profile.css';

const StudentProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);

  useEffect(() => {
    const studentData = getStudentById(id);
    setStudent(studentData);
  }, [id]);

  if (!student) {
    return <div>Loading...</div>;
  }

  return (
    <div className="student-profile-page">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Student Profile</h1>
          <div className="breadcrumb">
            <span>Dashboard</span>
            <span className="breadcrumb-separator">›</span>
            <span>Students</span>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-active">Profile</span>
          </div>
        </div>
      </div>

      {/* Profile Header Card */}
      <div className="profile-header-card">
        <div className="profile-header-content">
          <div className="profile-photo-section">
            <img 
              src={student.photo} 
              alt={student.fullName}
              className="profile-photo"
            />
            <span className="profile-status-indicator"></span>
          </div>
          <div className="profile-header-info">
            <h2 className="profile-name">{student.fullName}</h2>
            <p className="profile-enrollment">Enrollment No: {student.enrollmentNo}</p>
            <span 
              className="profile-status-badge"
              style={{
                backgroundColor: student.status === 'Active' 
                  ? '#10B98115' 
                  : student.status === 'Inactive' 
                    ? '#EF444415' 
                    : '#F59E0B15',
                color: student.status === 'Active' 
                  ? '#10B981' 
                  : student.status === 'Inactive' 
                    ? '#EF4444' 
                    : '#F59E0B'
              }}
            >
              {student.status}
            </span>
          </div>
        </div>
        <div className="profile-header-actions">
          <button 
            className="profile-action-btn btn-edit"
            onClick={() => navigate(`/admin/students/edit/${id}`)}
          >
            <Edit size={18} />
            Edit
          </button>
          <button 
            className="profile-action-btn btn-assign"
            onClick={() => navigate(`/admin/students/assign/${id}`)}
          >
            <HomeIcon size={18} />
            Assign Room
          </button>
          <button 
            className="profile-action-btn btn-deactivate"
            onClick={() => setShowDeactivateModal(true)}
          >
            <UserX size={18} />
            Deactivate
          </button>
        </div>
      </div>

      {/* Profile Content Grid */}
      <div className="profile-content-grid">
        {/* Personal Details */}
        <div className="profile-card">
          <h3 className="profile-card-title">Personal Details</h3>
          <div className="profile-details-grid">
            <div className="detail-item">
              <span className="detail-label">Full Name</span>
              <span className="detail-value">{student.fullName}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Email</span>
              <span className="detail-value">{student.email}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Phone</span>
              <span className="detail-value">{student.phone}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Gender</span>
              <span className="detail-value">{student.gender}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Date of Birth</span>
              <span className="detail-value">{student.dateOfBirth}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Nationality</span>
              <span className="detail-value">{student.nationality}</span>
            </div>
          </div>
        </div>

        {/* Academic Details */}
        <div className="profile-card">
          <h3 className="profile-card-title">Academic Details</h3>
          <div className="profile-details-grid">
            <div className="detail-item">
              <span className="detail-label">Enrollment No</span>
              <span className="detail-value">{student.enrollmentNo}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Course/Department</span>
              <span className="detail-value">{student.course}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Year/Semester</span>
              <span className="detail-value">{student.yearSemester}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Batch</span>
              <span className="detail-value">{student.batch}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Program</span>
              <span className="detail-value">{student.program}</span>
            </div>
          </div>
        </div>

        {/* Guardian Details */}
        <div className="profile-card">
          <h3 className="profile-card-title">Guardian Details</h3>
          <div className="profile-details-grid">
            <div className="detail-item">
              <span className="detail-label">Guardian Name</span>
              <span className="detail-value">{student.guardianName}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Guardian Phone</span>
              <span className="detail-value">{student.guardianPhone}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Relationship</span>
              <span className="detail-value">{student.guardianRelation}</span>
            </div>
            <div className="detail-item detail-item-full">
              <span className="detail-label">Address</span>
              <span className="detail-value">{student.address}</span>
            </div>
          </div>
        </div>

        {/* Hostel Allocation */}
        <div className="profile-card">
          <h3 className="profile-card-title">Hostel Allocation</h3>
          <div className="profile-details-grid">
            <div className="detail-item">
              <span className="detail-label">Hostel Block</span>
              <span className="detail-value">{student.hostelBlock}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Room Type</span>
              <span className="detail-value">{student.roomType}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Room No</span>
              <span className="detail-value">{student.roomNo}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Bed No</span>
              <span className="detail-value">{student.bedNo}</span>
            </div>
            <div className="detail-item detail-item-full">
              <span className="detail-label">Allocated On</span>
              <span className="detail-value">{student.allocatedOn}</span>
            </div>
          </div>
        </div>

        {/* Fee Summary */}
        <div className="profile-card">
          <h3 className="profile-card-title">Fee Summary</h3>
          <div className="profile-details-grid">
            <div className="detail-item">
              <span className="detail-label">Total Fees Due</span>
              <span className="detail-value">₹{student.totalFeesDue.toLocaleString()}
                <span 
                  style={{
                    marginLeft: '8px',
                    padding: '2px 8px',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontWeight: '500',
                    backgroundColor: student.feeStatus === 'Paid' ? '#10B98115' : '#EF444415',
                    color: student.feeStatus === 'Paid' ? '#10B981' : '#EF4444'
                  }}
                >
                  {student.feeStatus}
                </span>
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Last Paid Date</span>
              <span className="detail-value">{student.lastPaidDate}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Current Outstanding</span>
              <span className="detail-value">₹{student.currentOutstanding.toLocaleString()}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Due Date (Upcoming)</span>
              <span className="detail-value">{student.dueDate}</span>
            </div>
          </div>
        </div>

        {/* Complaint Summary */}
        <div className="profile-card">
          <h3 className="profile-card-title">Complaint Summary</h3>
          <div className="profile-details-grid">
            <div className="detail-item">
              <span className="detail-label">Total Complaints</span>
              <span className="detail-value">{student.totalComplaints}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Open Complaints</span>
              <span className="detail-value">{student.openComplaints}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Resolved Complaints</span>
              <span className="detail-value">{student.resolvedComplaints}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Last Complaint</span>
              <span className="detail-value">{student.lastComplaint}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Deactivate Modal (Simple UI) */}
      {showDeactivateModal && (
        <div className="modal-overlay" onClick={() => setShowDeactivateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Confirm Deactivation</h3>
            <p>Are you sure you want to deactivate {student.fullName}? This action will set their status to inactive and may affect their hostel services.</p>
            <div className="modal-actions">
              <button 
                className="btn-secondary"
                onClick={() => setShowDeactivateModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn-danger"
                onClick={() => {
                  console.log('Deactivating student:', id);
                  setShowDeactivateModal(false);
                  navigate('/admin/students');
                }}
              >
                Confirm Deactivate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentProfile;