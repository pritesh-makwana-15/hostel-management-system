import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, Mail, Phone, Shield, Calendar,
  Edit2, Lock, LogOut, CheckCircle, X, Save,
  Clock, Key, Monitor, Building2, BookOpen,
  MapPin, Users, CreditCard, MessageSquare,
  ChevronRight, AlertCircle, CheckCircle2, Loader2
} from 'lucide-react';
import '../../../styles/student/profile/studentProfile.css';

// ── Dummy Data ────────────────────────────────────────────────
const studentData = {
  name: 'Aryan Sharma',
  studentId: 'STU-2024-HMS-012',
  email: 'aryan.sharma@student.com',
  phone: '+91 9898123456',
  role: 'Hostel Student',
  status: 'Active',
  course: 'B.C.A – Bachelor of Computer Applications',
  semester: '4th Semester (Sophomore)',
  enrollmentId: 'EN-2024-X99',
  cgpa: '3.82 / 4.00',
  advisor: 'Dr. Sarah Connor',
  expectedGraduation: 'May 2026',
  block: 'Block B',
  floor: '1st Floor',
  roomNo: 'B-101',
  bedId: 'Bed 01 (Lower)',
  checkInDate: 'June 01, 2025',
  contractType: 'Annual Membership',
  dob: 'February 17, 2006',
  gender: 'Male',
  nationality: 'Indian',
  nationalId: 'ID-4422991100',
  guardianName: 'Mr. Ramesh Sharma',
  guardianRelation: 'Father',
  guardianPhone: '+91 9876543210',
  emergencyContact: 'Mrs. Sunita Sharma',
  emergencyPhone: '+91 9876501234',
  homeAddress: '12, Shree Nagar, Rajkot, Gujarat – 360001',
  joinDate: 'June 01, 2025',
  lastLogin: '25 Mar 2026, 09:30 AM',
  accountStatus: 'Active',
  activeSessions: 1,
};

const paymentHistory = [
  { id: 1, description: 'Room Rent – Oct 2024',       date: 'Oct 01, 2024', amount: '₹15,000', status: 'Paid' },
  { id: 2, description: 'Mess & Utility – Oct 2024',  date: 'Oct 05, 2024', amount: '₹3,500',  status: 'Paid' },
  { id: 3, description: 'Laundry Deposit',             date: 'Sep 15, 2024', amount: '₹500',    status: 'Paid' },
  { id: 4, description: 'Hostel Maintenance Fee',      date: 'Nov 01, 2024', amount: '₹1,200',  status: 'Pending' },
];

const complaintLogs = [
  { id: '#TKT-2024-081', category: 'Plumbing',   date: 'Sep 12, 2024', status: 'Resolved' },
  { id: '#TKT-2024-094', category: 'Electrical', date: 'Sep 28, 2024', status: 'Resolved' },
  { id: '#TKT-2024-102', category: 'Internet',   date: 'Oct 10, 2024', status: 'Pending'  },
];

// ── Status Badge Component ────────────────────────────────────
const StatusBadge = ({ status }) => {
  const config = {
    Paid:       { color: '#10B981', bg: 'rgba(16,185,129,0.1)'  },
    Pending:    { color: '#F59E0B', bg: 'rgba(245,158,11,0.1)'  },
    Resolved:   { color: '#2BBBAD', bg: 'rgba(43,187,173,0.1)' },
    Active:     { color: '#10B981', bg: 'rgba(16,185,129,0.1)'  },
    'In Progress': { color: '#1F3C88', bg: 'rgba(31,60,136,0.1)' },
  };
  const cfg = config[status] || { color: '#6B7280', bg: '#F4F6F9' };
  return (
    <span className="sp-status-badge" style={{ color: cfg.color, backgroundColor: cfg.bg }}>
      {status === 'Paid'     && <CheckCircle2 size={10} />}
      {status === 'Pending'  && <AlertCircle  size={10} />}
      {status === 'Resolved' && <CheckCircle2 size={10} />}
      {status === 'Active'   && <CheckCircle  size={10} />}
      {status}
    </span>
  );
};

// ── Info Row Component ────────────────────────────────────────
const InfoRow = ({ label, value, last = false }) => (
  <div className={`sp-info-row ${last ? 'sp-info-row--last' : ''}`}>
    <span className="sp-info-label">{label}</span>
    <span className="sp-info-value">{value}</span>
  </div>
);

// ── Main Component ────────────────────────────────────────────
const StudentProfile = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData]   = useState({ name: studentData.name, phone: studentData.phone });
  const [savedData, setSavedData] = useState({ name: studentData.name, phone: studentData.phone });

  const handleSave = () => {
    setSavedData({ ...formData });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({ ...savedData });
    setIsEditing(false);
  };

  return (
    <div className="sp-page">

      {/* ── Page Header ── */}
      <div className="sp-page-header">
        <div>
          <div className="sp-breadcrumb">
            <span className="sp-breadcrumb-link" onClick={() => navigate('/student/dashboard')}>Dashboard</span>
            <ChevronRight size={14} />
            <span className="sp-breadcrumb-active">My Profile</span>
          </div>
          <h1 className="sp-page-title">My Profile</h1>
          <p className="sp-page-subtitle">Manage your personal information and view hostel records.</p>
        </div>
        <div className="sp-page-actions">
          <button className="sp-btn-outline" onClick={() => navigate('/student/profile/edit')}>
            <Edit2 size={15} /> Edit Personal Info
          </button>
          <button className="sp-btn-primary" onClick={() => navigate('/student/profile/change-password')}>
            <Lock size={15} /> Change Password
          </button>
        </div>
      </div>

      {/* ── Profile Hero Card ── */}
      <div className="sp-hero-card">
        <div className="sp-hero-left">
          <div className="sp-avatar-wrap">
            <div className="sp-avatar"><User size={38} /></div>
            <span className="sp-online-dot" />
          </div>
          <div className="sp-hero-info">
            {isEditing ? (
              <input
                className="sp-name-input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            ) : (
              <h2 className="sp-hero-name">{savedData.name}</h2>
            )}
            <div className="sp-hero-meta">
              <span className="sp-role-badge"><Shield size={11} /> {studentData.role}</span>
              <span className="sp-meta-dot">•</span>
              <span className="sp-meta-id">{studentData.studentId}</span>
            </div>
          </div>
        </div>
        <div className="sp-hero-actions">
          {isEditing ? (
            <>
              <button className="sp-btn-cancel" onClick={handleCancel}><X size={15}/> Cancel</button>
              <button className="sp-btn-save"   onClick={handleSave}><Save size={15}/> Save Changes</button>
            </>
          ) : (
            <button className="sp-btn-edit" onClick={() => setIsEditing(true)}>
              <Edit2 size={15} /> Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* ── Info Strip ── */}
      <div className="sp-info-strip">
        <div className="sp-strip-item">
          <div className="sp-strip-icon"><Mail size={15} /></div>
          <div className="sp-strip-content">
            <span className="sp-strip-label">EMAIL ADDRESS</span>
            <span className="sp-strip-value">{studentData.email}</span>
          </div>
        </div>
        <div className="sp-strip-divider" />
        <div className="sp-strip-item">
          <div className="sp-strip-icon"><Phone size={15} /></div>
          <div className="sp-strip-content">
            <span className="sp-strip-label">PHONE NUMBER</span>
            {isEditing ? (
              <input
                className="sp-strip-input"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            ) : (
              <span className="sp-strip-value">{savedData.phone}</span>
            )}
          </div>
        </div>
        <div className="sp-strip-divider" />
        <div className="sp-strip-item">
          <div className="sp-strip-icon"><Building2 size={15} /></div>
          <div className="sp-strip-content">
            <span className="sp-strip-label">ROOM / BED</span>
            <span className="sp-strip-value">{studentData.roomNo} • {studentData.bedId}</span>
          </div>
        </div>
        <div className="sp-strip-divider" />
        <div className="sp-strip-item">
          <div className="sp-strip-icon"><Calendar size={15} /></div>
          <div className="sp-strip-content">
            <span className="sp-strip-label">JOINED ON</span>
            <span className="sp-strip-value">{studentData.joinDate}</span>
          </div>
        </div>
      </div>

      {/* ── Lower Grid ── */}
      <div className="sp-lower-grid">

        {/* ── LEFT COLUMN ── */}
        <div className="sp-left-col">

          {/* Personal Information */}
          <div className="sp-section-card">
            <div className="sp-section-header">
              <User size={18} className="sp-section-icon" />
              <div>
                <h3 className="sp-section-title">Personal Information</h3>
                <p className="sp-section-sub">Basic identity and demographic details.</p>
              </div>
            </div>
            <InfoRow label="Full Name"          value={savedData.name} />
            <InfoRow label="Date of Birth"      value={studentData.dob} />
            <InfoRow label="Gender"             value={studentData.gender} />
            <InfoRow label="Nationality"        value={studentData.nationality} />
            <InfoRow label="National ID"        value={studentData.nationalId} last />
          </div>

          {/* Hostel Allocation */}
          <div className="sp-section-card">
            <div className="sp-section-header">
              <Building2 size={18} className="sp-section-icon" />
              <div>
                <h3 className="sp-section-title">Hostel Allocation</h3>
                <p className="sp-section-sub">Your current room assignment.</p>
              </div>
            </div>
            <InfoRow label="Block"          value={studentData.block} />
            <InfoRow label="Floor"          value={studentData.floor} />
            <InfoRow label="Room Number"    value={studentData.roomNo} />
            <InfoRow label="Bed ID"         value={studentData.bedId} />
            <InfoRow label="Check-in Date"  value={studentData.checkInDate} />
            <InfoRow label="Contract Type"  value={studentData.contractType} last />
          </div>

          {/* Academic Records */}
          <div className="sp-section-card">
            <div className="sp-section-header">
              <BookOpen size={18} className="sp-section-icon" />
              <div>
                <h3 className="sp-section-title">Academic Records</h3>
                <p className="sp-section-sub">Enrollment and academic performance.</p>
              </div>
            </div>
            <InfoRow label="Enrollment ID"        value={studentData.enrollmentId} />
            <InfoRow label="Course"               value={studentData.course} />
            <InfoRow label="Current Semester"     value={studentData.semester} />
            <InfoRow label="Advisor"              value={studentData.advisor} />
            <InfoRow label="CGPA"                 value={studentData.cgpa} />
            <InfoRow label="Expected Graduation"  value={studentData.expectedGraduation} last />
          </div>

          {/* Guardian & Emergency */}
          <div className="sp-section-card">
            <div className="sp-section-header">
              <Users size={18} className="sp-section-icon" />
              <div>
                <h3 className="sp-section-title">Guardian & Emergency Details</h3>
                <p className="sp-section-sub">Emergency contact information.</p>
              </div>
            </div>
            <InfoRow label="Guardian Name"    value={studentData.guardianName} />
            <InfoRow label="Relationship"     value={studentData.guardianRelation} />
            <InfoRow label="Guardian Phone"   value={studentData.guardianPhone} />
            <InfoRow label="Emergency Contact" value={studentData.emergencyContact} />
            <InfoRow label="Emergency Phone"  value={studentData.emergencyPhone} />
            <InfoRow label="Home Address"     value={studentData.homeAddress} last />
          </div>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="sp-right-col">

          {/* Account Information */}
          <div className="sp-section-card">
            <div className="sp-section-header">
              <Shield size={18} className="sp-section-icon" />
              <div>
                <h3 className="sp-section-title">Account Information</h3>
                <p className="sp-section-sub">System metadata and login status.</p>
              </div>
            </div>
            <InfoRow label="Student ID"    value={studentData.studentId} />
            <InfoRow label="Course"        value="B.C.A" />
            <InfoRow label="Last Login"    value={studentData.lastLogin} />
            <div className="sp-info-row sp-info-row--last">
              <span className="sp-info-label">Account Status</span>
              <StatusBadge status={studentData.accountStatus} />
            </div>
          </div>

          {/* Security Settings */}
          <div className="sp-section-card">
            <div className="sp-section-header">
              <Lock size={18} className="sp-section-icon" />
              <div>
                <h3 className="sp-section-title">Security Settings</h3>
                <p className="sp-section-sub">Manage credentials and sessions.</p>
              </div>
            </div>

            <div className="sp-security-action">
              <div className="sp-sec-icon-wrap"><Key size={18} /></div>
              <div className="sp-sec-content">
                <h4 className="sp-sec-title">Change Password</h4>
                <p className="sp-sec-desc">Keep your account secure by updating your password regularly.</p>
                <button className="sp-btn-primary sp-btn-sm" onClick={() => navigate('/student/profile/change-password')}>
                  Update Password
                </button>
              </div>
            </div>

            <div className="sp-security-action" style={{ marginTop: 14 }}>
              <div className="sp-sec-icon-wrap sp-sec-logout"><Monitor size={18} /></div>
              <div className="sp-sec-content">
                <h4 className="sp-sec-title">Active Sessions</h4>
                <p className="sp-sec-desc">
                  You are logged in on {studentData.activeSessions} active device. Logout to terminate all sessions.
                </p>
                <button className="sp-btn-logout">
                  <LogOut size={14} /> Logout All Devices
                </button>
              </div>
            </div>
          </div>

          {/* Payment History */}
          <div className="sp-section-card">
            <div className="sp-section-header-row">
              <div className="sp-section-header">
                <CreditCard size={18} className="sp-section-icon" />
                <div>
                  <h3 className="sp-section-title">Payment History</h3>
                  <p className="sp-section-sub">Recent fee transactions.</p>
                </div>
              </div>
              <button className="sp-link-btn">View All</button>
            </div>
            <div className="sp-table-wrap">
              <table className="sp-table">
                <thead>
                  <tr>
                    <th>DESCRIPTION</th>
                    <th>DATE</th>
                    <th>AMOUNT</th>
                    <th>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentHistory.map((p) => (
                    <tr key={p.id}>
                      <td className="sp-td-primary">{p.description}</td>
                      <td className="sp-td-secondary">{p.date}</td>
                      <td className="sp-td-amount">{p.amount}</td>
                      <td><StatusBadge status={p.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Complaint Logs */}
          <div className="sp-section-card">
            <div className="sp-section-header-row">
              <div className="sp-section-header">
                <MessageSquare size={18} className="sp-section-icon" />
                <div>
                  <h3 className="sp-section-title">Complaint Logs</h3>
                  <p className="sp-section-sub">Service requests and tickets.</p>
                </div>
              </div>
              <button className="sp-link-btn">New Ticket</button>
            </div>
            <div className="sp-table-wrap">
              <table className="sp-table">
                <thead>
                  <tr>
                    <th>TICKET ID</th>
                    <th>CATEGORY</th>
                    <th>DATE</th>
                    <th>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {complaintLogs.map((c) => (
                    <tr key={c.id}>
                      <td className="sp-td-ticket">{c.id}</td>
                      <td className="sp-td-primary">{c.category}</td>
                      <td className="sp-td-secondary">{c.date}</td>
                      <td><StatusBadge status={c.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default StudentProfile;