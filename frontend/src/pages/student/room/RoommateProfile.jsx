import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../../styles/admin/students/student-profile.css';

const DetailItem = ({ label, value }) => (
  <div className="detail-item">
    <span className="detail-label">{label}</span>
    <span className="detail-value">{value || '—'}</span>
  </div>
);

const RoommateProfile = () => {
  const navigate = useNavigate();
  const { studentId } = useParams();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRoommate = async () => {
      try {
        setLoading(true);
        setError('');

        const token = localStorage.getItem('hms_token');

        const profileResponse = await fetch('http://localhost:8080/api/student/profile', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!profileResponse.ok) {
          throw new Error('Unable to fetch your profile.');
        }

        const profilePayload = await profileResponse.json();
        const roomNo = profilePayload?.data?.roomNo;

        if (!roomNo) {
          throw new Error('Room is not assigned to your account.');
        }

        const roommatesResponse = await fetch(
          `http://localhost:8080/api/student/roommates?room=${encodeURIComponent(roomNo)}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!roommatesResponse.ok) {
          throw new Error('Unable to fetch roommates list.');
        }

        const roommatesPayload = await roommatesResponse.json();
        const roommates = Array.isArray(roommatesPayload?.data) ? roommatesPayload.data : [];

        const matchedRoommate = roommates.find((rm) => {
          const enrollment = (rm.enrollmentNo || '').toString().toLowerCase();
          const idValue = rm.id != null ? String(rm.id).toLowerCase() : '';
          const param = (studentId || '').toString().toLowerCase();
          return enrollment === param || idValue === param;
        });

        if (!matchedRoommate) {
          throw new Error('Roommate not found in your room.');
        }

        setStudent(matchedRoommate);
      } catch (err) {
        setError(err.message || 'Failed to load roommate profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchRoommate();
  }, [studentId]);

  const statusColor = (status) => {
    if (status === 'Active') return { bg: '#10B98115', text: '#10B981' };
    if (status === 'Inactive') return { bg: '#EF444415', text: '#EF4444' };
    return { bg: '#F59E0B15', text: '#F59E0B' };
  };

  if (loading) return <div className="loading">Loading roommate profile...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!student) return null;

  const sc = statusColor(student.status);

  return (
    <div className="student-profile-page">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Roommate Profile</h1>
          <div className="breadcrumb">
            <span onClick={() => navigate('/student/dashboard')} style={{ cursor: 'pointer' }}>Dashboard</span>
            <span className="breadcrumb-separator">›</span>
            <span onClick={() => navigate('/student/room')} style={{ cursor: 'pointer' }}>Room</span>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-active">Profile</span>
          </div>
        </div>
      </div>

      <div className="profile-header-card">
        <div className="profile-header-content">
          <div className="profile-photo-section">
            <img
              src={student.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name || student.enrollmentNo}`}
              alt={student.name}
              className="profile-photo"
            />
          </div>
          <div className="profile-header-info">
            <h2 className="profile-name">{student.name || 'Student'}</h2>
            <p className="profile-enrollment">Enrollment No: {student.enrollmentNo || '—'}</p>
            <span className="profile-status-badge" style={{ backgroundColor: sc.bg, color: sc.text }}>
              {student.status || 'Unknown'}
            </span>
          </div>
        </div>
        <div className="profile-header-actions">
          <button className="profile-action-btn btn-edit" onClick={() => navigate('/student/room')}>
            Back to Room
          </button>
        </div>
      </div>

      <div className="profile-content-grid">
        <div className="profile-card">
          <h3 className="profile-card-title">Personal Details</h3>
          <div className="profile-details-grid">
            <DetailItem label="Full Name" value={student.name} />
            <DetailItem label="Email" value={student.email} />
            <DetailItem label="Phone" value={student.phone} />
            <DetailItem label="Gender" value={student.gender} />
            <DetailItem label="Date of Birth" value={student.dob} />
            <DetailItem label="Nationality" value={student.nationality} />
          </div>
        </div>

        <div className="profile-card">
          <h3 className="profile-card-title">Academic Details</h3>
          <div className="profile-details-grid">
            <DetailItem label="Enrollment No" value={student.enrollmentNo} />
            <DetailItem label="Course" value={student.course} />
            <DetailItem label="Year / Semester" value={student.yearSemester} />
            <DetailItem label="Batch" value={student.batch} />
            <DetailItem label="Program" value={student.program} />
          </div>
        </div>

        <div className="profile-card">
          <h3 className="profile-card-title">Hostel Allocation</h3>
          <div className="profile-details-grid">
            <DetailItem label="Hostel Block" value={student.hostelBlock} />
            <DetailItem label="Room Type" value={student.roomType} />
            <DetailItem label="Room No" value={student.roomNo} />
            <DetailItem label="Bed No" value={student.bedNo} />
            <DetailItem label="Allocated On" value={student.allocatedOn} />
          </div>
        </div>

        <div className="profile-card">
          <h3 className="profile-card-title">Guardian Details</h3>
          <div className="profile-details-grid">
            <DetailItem label="Guardian Name" value={student.guardianName} />
            <DetailItem label="Guardian Phone" value={student.guardianPhone} />
            <DetailItem label="Relationship" value={student.guardianRelation} />
            <div className="detail-item detail-item-full">
              <span className="detail-label">Address</span>
              <span className="detail-value">{student.address || '—'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoommateProfile;
