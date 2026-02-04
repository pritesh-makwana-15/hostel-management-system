import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getStudentById } from '../../../data/studentsData';
import '../../../styles/admin/students/student-form.css';

const EditStudent = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    gender: 'Male',
    dateOfBirth: '',
    enrollmentNo: '',
    course: '',
    yearSemester: '',
    guardianName: '',
    guardianPhone: '',
    address: ''
  });

  const [photoPreview, setPhotoPreview] = useState(null);

  useEffect(() => {
    // Load student data
    const student = getStudentById(id);
    if (student) {
      setFormData({
        fullName: student.fullName,
        email: student.email,
        phone: student.phone,
        gender: student.gender,
        dateOfBirth: student.dateOfBirth,
        enrollmentNo: student.enrollmentNo,
        course: student.course,
        yearSemester: student.yearSemester,
        guardianName: student.guardianName,
        guardianPhone: student.guardianPhone,
        address: student.address
      });
      setPhotoPreview(student.photo);
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: API call to update student
    console.log('Updated student:', formData);
    navigate('/admin/students');
  };

  return (
    <div className="student-form-page">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Edit Student</h1>
          <div className="breadcrumb">
            <span>Dashboard</span>
            <span className="breadcrumb-separator">›</span>
            <span>Students</span>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-active">Edit</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Personal Information Section */}
        <div className="form-card">
          <h2 className="section-title">Personal Information</h2>
          
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Gender</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="gender"
                    value="Male"
                    checked={formData.gender === 'Male'}
                    onChange={handleInputChange}
                  />
                  <span>Male</span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="gender"
                    value="Female"
                    checked={formData.gender === 'Female'}
                    onChange={handleInputChange}
                  />
                  <span>Female</span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="gender"
                    value="Other"
                    checked={formData.gender === 'Other'}
                    onChange={handleInputChange}
                  />
                  <span>Other</span>
                </label>
              </div>
            </div>

            <div className="form-group form-group-full">
              <label className="form-label">Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>

            {/* Profile Photo Display */}
            <div className="form-group form-group-full">
              <label className="form-label">Profile Photo</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {photoPreview && (
                  <img 
                    src={photoPreview} 
                    alt="Student" 
                    style={{ 
                      width: '80px', 
                      height: '80px', 
                      borderRadius: '50%',
                      objectFit: 'cover'
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Academic Information Section */}
        <div className="form-card">
          <h2 className="section-title">Academic Information</h2>
          
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Enrollment Number</label>
              <input
                type="text"
                name="enrollmentNo"
                value={formData.enrollmentNo}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Course / Department</label>
              <input
                type="text"
                name="course"
                value={formData.course}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group form-group-full">
              <label className="form-label">Year / Semester</label>
              <select
                name="yearSemester"
                value={formData.yearSemester}
                onChange={handleInputChange}
                className="form-input"
                required
              >
                <option value="">Select Year/Semester</option>
                <option value="1st Year / 1st Semester">1st Year / 1st Semester</option>
                <option value="1st Year / 2nd Semester">1st Year / 2nd Semester</option>
                <option value="2nd Year / 3rd Semester">2nd Year / 3rd Semester</option>
                <option value="2nd Year / 4th Semester">2nd Year / 4th Semester</option>
                <option value="3rd Year / 5th Semester">3rd Year / 5th Semester</option>
                <option value="3rd Year / 6th Semester">Third Year - Semester 6</option>
                <option value="4th Year / 7th Semester">4th Year / 7th Semester</option>
                <option value="4th Year / 8th Semester">4th Year / 8th Semester</option>
              </select>
            </div>
          </div>
        </div>

        {/* Guardian Information Section */}
        <div className="form-card">
          <h2 className="section-title">Guardian Information</h2>
          
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Guardian Name</label>
              <input
                type="text"
                name="guardianName"
                value={formData.guardianName}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Guardian Phone Number</label>
              <input
                type="tel"
                name="guardianPhone"
                value={formData.guardianPhone}
                onChange={handleInputChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group form-group-full">
              <label className="form-label">Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="form-textarea"
                rows="3"
                required
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button 
            type="button" 
            className="btn-secondary"
            onClick={() => navigate('/admin/students')}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn-primary"
          >
            Update Student
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditStudent;