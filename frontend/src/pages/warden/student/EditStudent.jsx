// src/pages/warden/EditStudent.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  User, Mail, Phone, Calendar, Hash, BookOpen,
  Clock, UserCheck, MapPin,
} from 'lucide-react';
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
    <div className="wsf-page">

      {/* ── Breadcrumb + Title ───────────────────────────── */}
      <div className="wsf-header">
        <div className="wsf-breadcrumb">
          <span>Dashboard</span>
          <span className="wsf-bc-sep">›</span>
          <span
            className="wsf-bc-link"
            onClick={() => navigate('/warden/students')}
          >
            Students
          </span>
          <span className="wsf-bc-sep">›</span>
          <span className="wsf-bc-active">Edit Student</span>
        </div>
        <h1 className="wsf-title">Edit Student</h1>
      </div>

      <form className="wsf-form" onSubmit={handleSubmit}>

        {/* ── Section 1: Personal Information ─────────────── */}
        <div className="wsf-section">
          <h2 className="wsf-section-title">Personal Information</h2>
          <div className="wsf-section-divider" />

          <div className="wsf-grid-2">

            {/* Full Name */}
            <div className="wsf-field">
              <label className="wsf-label">Full Name</label>
              <div className="wsf-input-wrap">
                <User size={16} className="wsf-input-icon" />
                <input
                  type="text"
                  className="wsf-input"
                  value={form.name}
                  onChange={set('name')}
                  placeholder="Enter full name"
                />
              </div>
            </div>

            {/* Email */}
            <div className="wsf-field">
              <label className="wsf-label">Email Address</label>
              <div className="wsf-input-wrap">
                <Mail size={16} className="wsf-input-icon" />
                <input
                  type="email"
                  className="wsf-input"
                  value={form.email}
                  onChange={set('email')}
                  placeholder="Enter email address"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="wsf-field">
              <label className="wsf-label">Phone Number</label>
              <div className="wsf-input-wrap">
                <Phone size={16} className="wsf-input-icon" />
                <input
                  type="tel"
                  className="wsf-input"
                  value={form.phone}
                  onChange={set('phone')}
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
            </div>

            {/* Gender */}
            <div className="wsf-field">
              <label className="wsf-label">Gender</label>
              <div className="wsf-radio-group">
                {['Male', 'Female', 'Other'].map((g) => (
                  <label key={g} className="wsf-radio-label">
                    <input
                      type="radio"
                      name="gender"
                      value={g}
                      checked={form.gender === g}
                      onChange={set('gender')}
                      className="wsf-radio"
                    />
                    {g}
                  </label>
                ))}
              </div>
            </div>

            {/* Date of Birth */}
            <div className="wsf-field">
              <label className="wsf-label">Date of Birth</label>
              <div className="wsf-input-wrap">
                <Calendar size={16} className="wsf-input-icon" />
                <input
                  type="date"
                  className="wsf-input"
                  value={form.dateOfBirth}
                  onChange={set('dateOfBirth')}
                />
              </div>
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

        {/* ── Section 2: Academic Information ─────────────── */}
        <div className="wsf-section">
          <h2 className="wsf-section-title">Academic Information</h2>
          <div className="wsf-section-divider" />

          <div className="wsf-grid-2">

            {/* Enrollment No — disabled */}
            <div className="wsf-field">
              <label className="wsf-label">Enrollment Number</label>
              <div className="wsf-input-wrap">
                <Hash size={16} className="wsf-input-icon" />
                <input
                  type="text"
                  className="wsf-input wsf-input-disabled"
                  value={form.enrollmentNo}
                  disabled
                />
              </div>
            </div>

            {/* Course / Department — disabled */}
            <div className="wsf-field">
              <label className="wsf-label">Course / Department</label>
              <div className="wsf-input-wrap">
                <BookOpen size={16} className="wsf-input-icon" />
                <input
                  type="text"
                  className="wsf-input wsf-input-disabled"
                  value={form.courseDept}
                  disabled
                />
              </div>
            </div>

            {/* Year / Semester */}
            <div className="wsf-field wsf-field-full">
              <label className="wsf-label">Year / Semester</label>
              <div className="wsf-input-wrap">
                <Clock size={16} className="wsf-input-icon" />
                <select
                  className="wsf-select"
                  value={form.yearSemester}
                  onChange={set('yearSemester')}
                >
                  {yearSemesterOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <p className="wsf-field-note">
                Note: Academic fields are system-managed and cannot be edited.
              </p>
            </div>

          </div>
        </div>

        {/* ── Section 3: Guardian Information ─────────────── */}
        <div className="wsf-section">
          <h2 className="wsf-section-title">Guardian Information</h2>
          <div className="wsf-section-divider" />

          <div className="wsf-grid-2">

            {/* Guardian Name */}
            <div className="wsf-field">
              <label className="wsf-label">Guardian Name</label>
              <div className="wsf-input-wrap">
                <UserCheck size={16} className="wsf-input-icon" />
                <input
                  type="text"
                  className="wsf-input"
                  value={form.guardianName}
                  onChange={set('guardianName')}
                  placeholder="Enter guardian name"
                />
              </div>
            </div>

            {/* Guardian Phone */}
            <div className="wsf-field">
              <label className="wsf-label">Guardian Phone Number</label>
              <div className="wsf-input-wrap">
                <Phone size={16} className="wsf-input-icon" />
                <input
                  type="tel"
                  className="wsf-input"
                  value={form.guardianPhone}
                  onChange={set('guardianPhone')}
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
            </div>

            {/* Permanent Address */}
            <div className="wsf-field wsf-field-full">
              <label className="wsf-label">Permanent Address</label>
              <div className="wsf-input-wrap wsf-textarea-wrap">
                <MapPin size={16} className="wsf-input-icon wsf-textarea-icon" />
                <textarea
                  className="wsf-textarea"
                  rows={4}
                  value={form.address}
                  onChange={set('address')}
                  placeholder="Enter permanent address"
                />
              </div>
            </div>

          </div>
        </div>

        {/* ── Section divider ──────────────────────────────── */}
        <div className="wsf-section-divider" />

        {/* ── Form Actions ─────────────────────────────────── */}
        <div className="wsf-form-actions">
          <button
            type="button"
            className="wsf-btn-cancel"
            onClick={() => navigate('/warden/students')}
          >
            Cancel
          </button>
          <button type="submit" className="wsf-btn-submit" disabled={submitting}>
            {submitting ? 'Updating...' : 'Update Student'}
          </button>
        </div>

      </form>
    </div>
  );
};

export default EditStudent;