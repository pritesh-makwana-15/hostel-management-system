import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentAPI } from '../../../services/api';
import '../../../styles/admin/students/student-form.css';

const AddStudent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', phone: '',
    gender: 'Male', dob: '', course: '', joinDate: '',
    guardianName: '', guardianPhone: '', address: '',
    enrollmentNo: '', yearSemester: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await studentAPI.create({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        gender: formData.gender,
        dob: formData.dob || null,
        course: formData.course,
        joinDate: formData.joinDate || null,
        address: formData.address,
      });
      navigate('/admin/students');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create student. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="student-form-page">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Add Student</h1>
          <div className="breadcrumb">
            <span>Dashboard</span> <span className="breadcrumb-separator">›</span>
            <span>Students</span> <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-active">Add</span>
          </div>
        </div>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-card">
          <h2 className="section-title">Personal Information</h2>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input type="text" name="name" value={formData.name}
                onChange={handleChange} className="form-input" required />
            </div>
            <div className="form-group">
              <label className="form-label">Email *</label>
              <input type="email" name="email" value={formData.email}
                onChange={handleChange} className="form-input" required />
            </div>
            <div className="form-group">
              <label className="form-label">Password *</label>
              <input type="password" name="password" value={formData.password}
                onChange={handleChange} className="form-input" required />
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input type="tel" name="phone" value={formData.phone}
                onChange={handleChange} className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">Gender</label>
              <div className="radio-group">
                {['Male','Female','Other'].map(g => (
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
              <input type="date" name="dob" value={formData.dob}
                onChange={handleChange} className="form-input" />
            </div>
          </div>
        </div>

        <div className="form-card">
          <h2 className="section-title">Academic Information</h2>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Course</label>
              <input type="text" name="course" value={formData.course}
                onChange={handleChange} className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">Join Date</label>
              <input type="date" name="joinDate" value={formData.joinDate}
                onChange={handleChange} className="form-input" />
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
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Student'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddStudent;