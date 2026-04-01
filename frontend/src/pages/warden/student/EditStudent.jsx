// src/pages/warden/EditStudent.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { wardenStudentApi } from '../../../services/wardenStudentApi';
import '../../../styles/warden/student/student-form.css';

const yearSemesterOptions = [
  '1st Year / 1st Semester', '1st Year / 2nd Semester',
  '2nd Year / 3rd Semester', '2nd Year / 4th Semester',
  '3rd Year / 5th Semester', '3rd Year / 6th Semester',
  '4th Year / 7th Semester', '4th Year / 8th Semester',
];

const EditStudent = () => {
  const { id }   = useParams();
  const navigate = useNavigate();
  const fileRef  = useRef(null);

  const [form, setForm] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await wardenStudentApi.getById(id);
        const s = response.data.data;
        if (s) {
          setForm({
            name:         s.name,
            email:        s.email,
            phone:        s.phone,
            gender:       s.gender,
            dateOfBirth:  s.dob,
            enrollmentNo: s.enrollmentNo,
            courseDept:   `${s.course} / ${s.program}`,
            yearSemester: s.yearSemester,
            guardianName: s.guardianName,
            guardianPhone:s.guardianPhone,
            address:      s.address,
          });
          setPhotoPreview(s.photoUrl);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load student');
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, [id]);

  if (loading) return <div className="wsf-loading">Loading student data…</div>;
  if (error) return <div className="wsf-error">{error}</div>;
  if (!form) return <div className="wsf-loading">Student not found</div>;

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (file) setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await wardenStudentApi.update(id, form);
      navigate('/warden/students');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update student');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="student-form-page">

      {/* ── Breadcrumb + Title ───────────────────────────── */}
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Edit Student</h1>
          <div className="breadcrumb">
            <span>Dashboard</span><span className="breadcrumb-separator">›</span>
            <span>Students</span><span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-active">Edit</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>

        {/* ── Photo Upload Section ── */}
        <div className="photo-upload-section">
          <label className="photo-label">Profile Photo</label>
          <div className="photo-upload-container">
            {photoPreview ? (
              <div className="photo-preview">
                <img src={photoPreview} alt="Profile" />
                <button
                  type="button"
                  className="remove-photo-btn"
                  onClick={() => setPhotoPreview('')}
                >
                  ×
                </button>
              </div>
            ) : (
              <div className="photo-placeholder">
                <div className="placeholder-icon">📷</div>
              </div>
            )}
            <button
              type="button"
              className="upload-btn"
              onClick={() => fileRef.current?.click()}
            >
              📎 Upload Photo
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handlePhoto}
            />
          </div>
        </div>

        {/* ── Personal Information ── */}
        <div className="form-card">
          <h2 className="section-title">Personal Information</h2>
          <div className="form-grid">

            {/* Full Name */}
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                className="form-input"
                value={form.name}
                onChange={set('name')}
                placeholder="Enter full name"
                required
              />
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                className="form-input"
                value={form.email}
                onChange={set('email')}
                placeholder="Enter email address"
                required
              />
            </div>

            {/* Phone */}
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                className="form-input"
                value={form.phone}
                onChange={set('phone')}
                placeholder="+91 XXXXX XXXXX"
              />
            </div>

            {/* Gender */}
            <div className="form-group">
              <label className="form-label">Gender</label>
              <div className="radio-group">
                {['Male', 'Female', 'Other'].map((g) => (
                  <label key={g} className="radio-label">
                    <input
                      type="radio"
                      name="gender"
                      value={g}
                      checked={form.gender === g}
                      onChange={set('gender')}
                    />
                    <span>{g}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Date of Birth */}
            <div className="form-group">
              <label className="form-label">Date of Birth</label>
              <input
                type="date"
                className="form-input"
                value={form.dateOfBirth}
                onChange={set('dateOfBirth')}
              />
            </div>

            {/* Profile Photo */}
            <div className="wsf-field">
              <label className="wsf-label">Profile Photo</label>
              <div className="wsf-photo-row">
                <img
                  src={photoPreview}
                  alt="Profile"
                  className="wsf-photo-preview"
                />
                <div className="wsf-photo-info">
                  <p className="wsf-photo-filename">
                    Current Photo: profile_{id?.toLowerCase()}.jpg
                  </p>
                  <button
                    type="button"
                    className="wsf-change-photo"
                    onClick={() => fileRef.current?.click()}
                  >
                    Change Photo
                  </button>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handlePhoto}
                  />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ── Academic Information ── */}
        <div className="form-card">
          <h2 className="section-title">Academic Information</h2>
          <div className="form-grid">

            {/* Enrollment No — disabled */}
            <div className="form-group">
              <label className="form-label">Enrollment Number</label>
              <input
                type="text"
                className="form-input"
                value={form.enrollmentNo}
                disabled
              />
            </div>

            {/* Course / Department — disabled */}
            <div className="form-group">
              <label className="form-label">Course / Department</label>
              <input
                type="text"
                className="form-input"
                value={form.courseDept}
                disabled
              />
            </div>

            {/* Year / Semester */}
            <div className="form-group-full">
              <label className="form-label">Year / Semester</label>
              <select
                className="form-input"
                value={form.yearSemester}
                onChange={set('yearSemester')}
              >
                {yearSemesterOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', fontStyle: 'italic', margin: '4px 0 0' }}>
                Note: Academic fields are system-managed and cannot be edited.
              </p>
            </div>

          </div>
        </div>

        {/* ── Guardian Information ── */}
        <div className="form-card">
          <h2 className="section-title">Guardian Information</h2>
          <div className="form-grid">

            {/* Guardian Name */}
            <div className="form-group">
              <label className="form-label">Guardian Name</label>
              <input
                type="text"
                className="form-input"
                value={form.guardianName}
                onChange={set('guardianName')}
                placeholder="Enter guardian name"
              />
            </div>

            {/* Guardian Phone */}
            <div className="form-group">
              <label className="form-label">Guardian Phone Number</label>
              <input
                type="tel"
                className="form-input"
                value={form.guardianPhone}
                onChange={set('guardianPhone')}
                placeholder="+91 XXXXX XXXXX"
              />
            </div>

            {/* Permanent Address */}
            <div className="form-group-full">
              <label className="form-label">Permanent Address</label>
              <textarea
                className="form-textarea"
                rows={4}
                value={form.address}
                onChange={set('address')}
                placeholder="Enter permanent address"
              />
            </div>

          </div>
        </div>

        {/* ── Section divider ──────────────────────────────── */}
        <div className="wsf-section-divider" />

        {/* ── Form Actions ── */}
        <div className="form-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate('/warden/students')}
          >
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? 'Updating...' : 'Update Student'}
          </button>
        </div>
            {submitting ? 'Updating...' : 'Update Student'}
          </button>
        </div>

      </form>
    </div>
  );
};

export default EditStudent;