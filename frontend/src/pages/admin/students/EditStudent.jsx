import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { adminStudentApi } from '../../../services/adminStudentApi';
import '../../../styles/admin/students/student-form.css';

const yearSemesterOptions = [
  '1st Year / 1st Semester', '1st Year / 2nd Semester',
  '2nd Year / 3rd Semester', '2nd Year / 4th Semester',
  '3rd Year / 5th Semester', '3rd Year / 6th Semester',
  '4th Year / 7th Semester', '4th Year / 8th Semester',
];

const EditStudent = () => {
  const navigate = useNavigate();
  const { id }   = useParams();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState('');

  const [formData, setFormData] = useState({
    name: '', email: '', phone: '',
    gender: 'Male', dob: '',
    nationality: 'Indian', photoUrl: '',
    enrollmentNo: '', course: '',
    yearSemester: '', batch: '', program: '',
    joinDate: '',
    guardianName: '', guardianPhone: '',
    guardianRelation: '', address: '',
    status: 'Active',
  });

  // ── Load existing student from API ────────────────────────
  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await adminStudentApi.getById(id);
        const s   = res.data.data;
        setFormData({
          name:             s.name             || '',
          email:            s.email            || '',
          phone:            s.phone            || '',
          gender:           s.gender           || 'Male',
          dob:              s.dob              || '',
          nationality:      s.nationality      || 'Indian',
          photoUrl:         s.photoUrl         || '',
          enrollmentNo:     s.enrollmentNo     || '',
          course:           s.course           || '',
          yearSemester:     s.yearSemester     || '',
          batch:            s.batch            || '',
          program:          s.program          || '',
          joinDate:         s.joinDate         || '',
          guardianName:     s.guardianName     || '',
          guardianPhone:    s.guardianPhone    || '',
          guardianRelation: s.guardianRelation || '',
          address:          s.address          || '',
          status:           s.status           || 'Active',
        });
      } catch {
        setError('Failed to load student data.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ── Submit with correct field names backend expects ───────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await adminStudentApi.update(id, {
        name:             formData.name,
        email:            formData.email,
        phone:            formData.phone,
        gender:           formData.gender,
        dob:              formData.dob      || null,
        nationality:      formData.nationality,
        photoUrl:         formData.photoUrl || null,
        enrollmentNo:     formData.enrollmentNo,
        course:           formData.course,
        yearSemester:     formData.yearSemester,
        batch:            formData.batch,
        program:          formData.program,
        joinDate:         formData.joinDate || null,
        guardianName:     formData.guardianName,
        guardianPhone:    formData.guardianPhone,
        guardianRelation: formData.guardianRelation,
        address:          formData.address,
        status:           formData.status,
      });
      navigate('/admin/students');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update student.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading">Loading student data...</div>;

  return (
    <div className="student-form-page">
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

      {error && <div className="error-banner">{error}</div>}

      <form onSubmit={handleSubmit}>

        {/* ── Personal Information ── */}
        <div className="form-card">
          <h2 className="section-title">Personal Information</h2>
          <div className="form-grid">

            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input type="text" name="name" value={formData.name}
                onChange={handleChange} className="form-input" required />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input type="email" name="email" value={formData.email}
                onChange={handleChange} className="form-input" required />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input type="tel" name="phone" value={formData.phone}
                onChange={handleChange} className="form-input" />
            </div>

            <div className="form-group">
              <label className="form-label">Gender</label>
              <div className="radio-group">
                {['Male', 'Female', 'Other'].map(g => (
                  <label key={g} className="radio-label">
                    <input type="radio" name="gender" value={g}
                      checked={formData.gender === g} onChange={handleChange} />
                    <span>{g}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Date of Birth</label>
              <input type="text" name="dob" value={formData.dob}
                onChange={handleChange} className="form-input" 
                placeholder="DD-MM-YYYY or DD-MM-YYYYYY" />
            </div>

            <div className="form-group">
              <label className="form-label">Nationality</label>
              <input type="text" name="nationality" value={formData.nationality}
                onChange={handleChange} className="form-input" />
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select name="status" value={formData.status}
                onChange={handleChange} className="form-input">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="On Leave">On Leave</option>
              </select>
            </div>

            {formData.photoUrl && (
              <div className="form-group form-group-full">
                <label className="form-label">Current Photo</label>
                <img src={formData.photoUrl} alt="Student"
                  style={{ width: '80px', height: '80px',
                    borderRadius: '50%', objectFit: 'cover' }} />
              </div>
            )}

          </div>
        </div>

        {/* ── Academic Information ── */}
        <div className="form-card">
          <h2 className="section-title">Academic Information</h2>
          <div className="form-grid">

            <div className="form-group">
              <label className="form-label">Enrollment Number</label>
              <input type="text" name="enrollmentNo" value={formData.enrollmentNo}
                onChange={handleChange} className="form-input" />
            </div>

            <div className="form-group">
              <label className="form-label">Course / Department</label>
              <input type="text" name="course" value={formData.course}
                onChange={handleChange} className="form-input" />
            </div>

            <div className="form-group">
              <label className="form-label">Year / Semester</label>
              <select name="yearSemester" value={formData.yearSemester}
                onChange={handleChange} className="form-input">
                <option value="">Select Year/Semester</option>
                {yearSemesterOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Batch</label>
              <input type="text" name="batch" value={formData.batch}
                onChange={handleChange} className="form-input"
                placeholder="e.g. 2022-2026" />
            </div>

            <div className="form-group">
              <label className="form-label">Program</label>
              <input type="text" name="program" value={formData.program}
                onChange={handleChange} className="form-input"
                placeholder="e.g. Undergraduate" />
            </div>

            <div className="form-group">
              <label className="form-label">Join Date</label>
              <input type="text" name="joinDate" value={formData.joinDate}
                onChange={handleChange} className="form-input" 
                placeholder="DD-MM-YYYY or DD-MM-YYYYYY" />
            </div>

          </div>
        </div>

        {/* ── Guardian Information ── */}
        <div className="form-card">
          <h2 className="section-title">Guardian Information</h2>
          <div className="form-grid">

            <div className="form-group">
              <label className="form-label">Guardian Name</label>
              <input type="text" name="guardianName" value={formData.guardianName}
                onChange={handleChange} className="form-input" />
            </div>

            <div className="form-group">
              <label className="form-label">Guardian Phone</label>
              <input type="tel" name="guardianPhone" value={formData.guardianPhone}
                onChange={handleChange} className="form-input" />
            </div>

            <div className="form-group">
              <label className="form-label">Relationship</label>
              <input type="text" name="guardianRelation" value={formData.guardianRelation}
                onChange={handleChange} className="form-input"
                placeholder="e.g. Father" />
            </div>

            <div className="form-group form-group-full">
              <label className="form-label">Address</label>
              <textarea name="address" value={formData.address}
                onChange={handleChange} className="form-textarea" rows="3" />
            </div>

          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-secondary"
            onClick={() => navigate('/admin/students')}>Cancel</button>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Updating...' : 'Update Student'}
          </button>
        </div>

      </form>
    </div>
  );
};

export default EditStudent;
