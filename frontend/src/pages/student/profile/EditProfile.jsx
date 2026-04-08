import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronRight, User, Mail, Phone, Calendar, Globe,
  BookOpen, Building2, Users, MapPin, Shield,
  Lock, HelpCircle, Save, X, Upload, CheckCircle
} from 'lucide-react';
import { studentApi } from '../../../services/studentApi';
import '../../../styles/student/profile/editProfile.css';

// Initial empty data structure
const initialData = {
  // Account & Personal
  fullName:     '',
  email:        '',
  phone:        '',
  dob:          '',
  gender:       '',
  nationality:  '',

  // Identity
  studentId:    '',   // readonly
  enrollmentId: '',   // readonly
  nationalId:   '',

  // Academic
  course:    '',
  semester:  '',
  advisor:   '',

  // Hostel (mostly readonly)
  block:      '',
  floor:      '',
  roomNo:     '',
  bedId:      '',
  checkIn:    '',

  // Address
  address: '',

  // Guardian
  guardianName:     '',
  guardianRelation: '',
  guardianPhone:    '',

  // Emergency
  emergencyName:    '',
  emergencyPhone:   '',
  emergencyAddress: '',
};

// ── Reusable FormInput ────────────────────────────────────
const FormInput = ({ label, name, type = 'text', value, onChange, required = false, readOnly = false, placeholder = '' }) => (
  <div className="ep-form-group">
    <label className="ep-label">
      {label} {required && <span className="ep-required">*</span>}
      {readOnly && <span className="ep-readonly-tag">SYSTEM ONLY</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={readOnly ? undefined : onChange}
      readOnly={readOnly}
      placeholder={placeholder}
      className={`ep-input ${readOnly ? 'ep-input--readonly' : ''}`}
    />
  </div>
);

// ── Main Component ────────────────────────────────────────
const EditProfile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialData);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load student data from API
  useEffect(() => {
    const loadStudentData = async () => {
      try {
        setLoading(true);
        const res = await studentApi.getProfile();
        const student = res.data.data;
        
        console.log('Student data from API:', student); // Debug log
        
        // Map API data to form fields - using correct field names from StudentProfileDTO
        setFormData({
          fullName:     student.name || '',
          email:        student.email || '',
          phone:        student.phone || '',
          dob:          student.dob || '',
          gender:       student.gender || '',
          nationality:  student.nationality || '',
          studentId:    student.id || '', // Using 'id' instead of 'studentId'
          enrollmentId: student.enrollmentNo || '', // Using 'enrollmentNo' instead of 'enrollmentId'
          nationalId:   '', // This field doesn't exist in DTO - will be empty
          course:       student.course || '',
          semester:     student.yearSemester || '',
          advisor:      '', // This field doesn't exist in DTO - will be empty
          block:        student.hostelBlock || '',
          floor:        '', // This field doesn't exist in DTO - will be empty
          roomNo:       student.roomNo || '',
          bedId:        student.bedNo || '',
          checkIn:      student.allocatedOn || '',
          address:      student.address || '',
          guardianName:     student.guardianName || '',
          guardianRelation: student.guardianRelation || '',
          guardianPhone:    student.guardianPhone || '',
          emergencyName:    '', // This field doesn't exist in DTO - will be empty
          emergencyPhone:   '', // This field doesn't exist in DTO - will be empty
          emergencyAddress: '', // This field doesn't exist in DTO - will be empty
        });
        
        if (student.photoUrl) {
          setPhotoPreview(student.photoUrl);
        }
      } catch (err) {
        console.error('Error loading student data:', err);
        setError('Failed to load student data: ' + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };
    
    loadStudentData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');
      
      // Prepare data for API (only updatable fields)
      const updateData = {
        name: formData.fullName,
        phone: formData.phone,
        gender: formData.gender,
        dob: formData.dob,
        nationality: formData.nationality,
        course: formData.course,
        yearSemester: formData.semester,
        guardianName: formData.guardianName,
        guardianRelation: formData.guardianRelation,
        guardianPhone: formData.guardianPhone,
        address: formData.address,
      };
      
      await studentApi.updateProfile(updateData);
      
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        // Don't redirect - keep user on edit page
      }, 3000); // Show success message longer
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ep-page">

      {/* Loading State */}
      {loading && (
        <div className="ep-loading-overlay">
          <div className="ep-loading-spinner">Loading student data...</div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="ep-error-banner">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Success State */}
      {saved && (
        <div className="ep-success-banner">
          <CheckCircle size={18} />
          <span>Student information updated successfully in database!</span>
        </div>
      )}

      {/* Page Header */}
      <div className="ep-page-header">
        <div>
          <div className="ep-breadcrumb">
            <span className="ep-bc-link" onClick={() => navigate('/student/dashboard')}>Dashboard</span>
            <ChevronRight size={13} />
            <span className="ep-bc-link" onClick={() => navigate('/student/profile')}>My Profile</span>
            <ChevronRight size={13} />
            <span className="ep-bc-active">Edit Profile</span>
          </div>
          <h1 className="ep-page-title">Edit Personal Profile</h1>
          <p className="ep-page-subtitle">Manage your academic, residential, and emergency contact details.</p>
        </div>
        <div className="ep-header-actions">
          <button type="button" className="ep-btn-discard" onClick={() => navigate('/student/profile')}>
            <X size={15} /> Discard
          </button>
          <button type="button" className={`ep-btn-save ${saved ? 'ep-btn-save--done' : ''}`} onClick={handleSubmit} disabled={loading}>
            {loading ? 'Saving...' : saved ? <><CheckCircle size={15} /> Saved!</> : <><Save size={15} /> Save Profile Update</>}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>

        {/* ── 1. Account & Personal Info ── */}
        <div className="ep-card">
          <div className="ep-card-header">
            <div className="ep-card-icon-wrap"><User size={18} /></div>
            <div>
              <h3 className="ep-card-title">Account &amp; Personal Information</h3>
              <p className="ep-card-sub">Update your primary details and profile appearance.</p>
            </div>
            <span className="ep-verified-tag"><CheckCircle size={12} /> Verified</span>
          </div>

          {/* Photo Upload */}
          <div className="ep-photo-section">
            <div className="ep-photo-preview">
              {photoPreview
                ? <img src={photoPreview} alt="Profile" />
                : <div className="ep-photo-placeholder"><User size={36} color="#9CA3AF" /></div>
              }
            </div>
            <div className="ep-photo-info">
              <p className="ep-photo-name">{formData.fullName}</p>
              <p className="ep-photo-hint">JPG, GIF or PNG. Max size 2MB.</p>
              <label className="ep-upload-btn">
                <Upload size={14} /> Upload Photo
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoChange} />
              </label>
            </div>
          </div>

          <div className="ep-grid ep-grid-2">
            <FormInput label="Full Name"      name="fullName"    value={formData.fullName}    onChange={handleChange} required placeholder="Enter full name" />
            <FormInput label="Email Address"  name="email"       value={formData.email}        onChange={handleChange} required type="email" placeholder="Enter email" />
            <FormInput label="Phone Number"   name="phone"       value={formData.phone}        onChange={handleChange} required placeholder="+91 XXXXX XXXXX" />
            <FormInput label="Date of Birth"  name="dob"         value={formData.dob}          onChange={handleChange} type="date" />
            <div className="ep-form-group">
              <label className="ep-label">Gender <span className="ep-required">*</span></label>
              <select name="gender" value={formData.gender} onChange={handleChange} className="ep-input">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <FormInput label="Nationality" name="nationality" value={formData.nationality} onChange={handleChange} placeholder="e.g. Indian" />
          </div>
        </div>

        {/* ── 2. Identity Verification ── */}
        <div className="ep-card">
          <div className="ep-card-header">
            <div className="ep-card-icon-wrap"><Shield size={18} /></div>
            <div>
              <h3 className="ep-card-title">Identity Verification</h3>
              <p className="ep-card-sub">Legal identification documents and system IDs.</p>
            </div>
          </div>
          <div className="ep-grid ep-grid-2">
            <FormInput label="Student ID"    name="studentId"    value={formData.studentId}    onChange={handleChange} readOnly />
            <FormInput label="Enrollment ID" name="enrollmentId" value={formData.enrollmentId} onChange={handleChange} readOnly />
            <FormInput label="National ID / Passport" name="nationalId" value={formData.nationalId} onChange={handleChange} required placeholder="e.g. A-55998822" />
          </div>
        </div>

        {/* ── 3. Academic Info ── */}
        <div className="ep-card">
          <div className="ep-card-header">
            <div className="ep-card-icon-wrap"><BookOpen size={18} /></div>
            <div>
              <h3 className="ep-card-title">Academic Profile</h3>
              <p className="ep-card-sub">Your current program and performance stats.</p>
            </div>
          </div>
          <div className="ep-grid ep-grid-2">
            <FormInput label="Course / Program" name="course"   value={formData.course}   onChange={handleChange} placeholder="e.g. B.Sc. Computer Science" />
            <FormInput label="Current Semester" name="semester" value={formData.semester} onChange={handleChange} placeholder="e.g. 4th Semester" />
            <FormInput label="Advisor Name"     name="advisor"  value={formData.advisor}  onChange={handleChange} placeholder="e.g. Dr. Sarah Connor" />
          </div>
        </div>

        {/* ── 4. Hostel & Room Allocation ── */}
        <div className="ep-card">
          <div className="ep-card-header">
            <div className="ep-card-icon-wrap"><Building2 size={18} /></div>
            <div>
              <h3 className="ep-card-title">Hostel &amp; Room Allocation</h3>
              <p className="ep-card-sub">Current residential assignment and contract info.</p>
            </div>
            <span className="ep-residence-tag">Active Residence</span>
          </div>
          <div className="ep-grid ep-grid-3">
            <FormInput label="Hostel Block"   name="block"   value={formData.block}   onChange={handleChange} readOnly />
            <FormInput label="Floor Level"    name="floor"   value={formData.floor}   onChange={handleChange} readOnly />
            <FormInput label="Room Number"    name="roomNo"  value={formData.roomNo}  onChange={handleChange} readOnly />
            <FormInput label="Bed / Bunk ID"  name="bedId"   value={formData.bedId}   onChange={handleChange} readOnly />
            <FormInput label="Check-in Date"  name="checkIn" value={formData.checkIn} onChange={handleChange} readOnly type="date" />
          </div>
          <p className="ep-hostel-note">
            Allocation fields marked as "System Only" cannot be edited manually.
            To request a room transfer or check-out, please visit the Hostel Warden Portal.
          </p>
        </div>

        {/* ── 5. Address ── */}
        <div className="ep-card">
          <div className="ep-card-header">
            <div className="ep-card-icon-wrap"><MapPin size={18} /></div>
            <div>
              <h3 className="ep-card-title">Address Information</h3>
              <p className="ep-card-sub">Your current residential address for logistics.</p>
            </div>
          </div>
          <div className="ep-form-group">
            <label className="ep-label">Current Residential Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={3}
              className="ep-textarea"
              placeholder="Enter your permanent or current correspondence address outside the hostel."
            />
          </div>
        </div>

        {/* ── 6. Guardian & Emergency ── */}
        <div className="ep-card">
          <div className="ep-card-header">
            <div className="ep-card-icon-wrap"><Users size={18} /></div>
            <div>
              <h3 className="ep-card-title">Guardian &amp; Emergency Contacts</h3>
              <p className="ep-card-sub">Who should we contact in case of an emergency?</p>
            </div>
          </div>

          <div className="ep-two-col-section">
            <div className="ep-sub-section">
              <h4 className="ep-sub-title">GUARDIAN INFORMATION</h4>
              <div className="ep-grid ep-grid-1">
                <FormInput label="Guardian Name"   name="guardianName"     value={formData.guardianName}     onChange={handleChange} required placeholder="Full name" />
                <FormInput label="Relationship"    name="guardianRelation" value={formData.guardianRelation} onChange={handleChange} required placeholder="e.g. Father" />
                <FormInput label="Guardian Phone"  name="guardianPhone"    value={formData.guardianPhone}    onChange={handleChange} required placeholder="+91 XXXXX XXXXX" />
              </div>
            </div>

            <div className="ep-sub-section">
              <h4 className="ep-sub-title">EMERGENCY BACKUP</h4>
              <div className="ep-grid ep-grid-1">
                <FormInput label="Emergency Contact Name" name="emergencyName"    value={formData.emergencyName}    onChange={handleChange} required placeholder="Full name" />
                <FormInput label="Emergency Phone"        name="emergencyPhone"   value={formData.emergencyPhone}   onChange={handleChange} required placeholder="+91 XXXXX XXXXX" />
                <FormInput label="Home / Permanent Address" name="emergencyAddress" value={formData.emergencyAddress} onChange={handleChange} placeholder="Full address" />
              </div>
            </div>
          </div>
        </div>

        {/* ── Extra Cards Row ── */}
        <div className="ep-extras-row">
          <div className="ep-extra-card">
            <div className="ep-extra-icon ep-extra-icon--shield"><Shield size={18} /></div>
            <h4 className="ep-extra-title">Data Privacy</h4>
            <p className="ep-extra-desc">Your data is encrypted and only accessible by authorized staff.</p>
          </div>
          <div className="ep-extra-card">
            <div className="ep-extra-icon ep-extra-icon--check"><CheckCircle size={18} /></div>
            <h4 className="ep-extra-title">Verification</h4>
            <p className="ep-extra-desc">Changes to email or phone require SMS/OTP verification.</p>
          </div>
          <div className="ep-extra-card">
            <div className="ep-extra-icon ep-extra-icon--help"><HelpCircle size={18} /></div>
            <h4 className="ep-extra-title">Help &amp; Support</h4>
            <p className="ep-extra-desc">Stuck? Email helpdesk@uni.edu or call support line.</p>
          </div>
        </div>

        {/* ── Bottom Action Bar ── */}
        <div className="ep-action-bar">
          <p className="ep-unsaved-note">Make sure to save your changes before leaving this page.</p>
          <div className="ep-action-btns">
            <button type="button" className="ep-btn-cancel" onClick={() => navigate('/student/profile')}>
              <X size={15} /> Cancel Changes
            </button>
            <button type="submit" className={`ep-btn-save ${saved ? 'ep-btn-save--done' : ''}`}>
              {saved ? <><CheckCircle size={15} /> Saved!</> : <><Save size={15} /> Save Profile Update</>}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
};

export default EditProfile;