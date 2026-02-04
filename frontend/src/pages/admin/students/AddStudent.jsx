import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X } from 'lucide-react';
import '../../../styles/admin/students/student-form.css';

const AddStudent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: '',
    email: '',
    phone: '',
    gender: 'Male',
    dateOfBirth: '',
    nationality: 'Indian',
    photo: null,
    
    // Academic Information
    enrollmentNo: '',
    course: '',
    yearSemester: '',
    
    // Guardian Information
    guardianName: '',
    guardianPhone: '',
    address: ''
  });

  const [photoPreview, setPhotoPreview] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, photo: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setFormData(prev => ({ ...prev, photo: null }));
    setPhotoPreview(null);
  };

  const handleReset = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      gender: 'Male',
      dateOfBirth: '',
      nationality: 'Indian',
      photo: null,
      enrollmentNo: '',
      course: '',
      yearSemester: '',
      guardianName: '',
      guardianPhone: '',
      address: ''
    });
    setPhotoPreview(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: API call to save student
    console.log('Form submitted:', formData);
    // Navigate back to students list
    navigate('/admin/students');
  };

  return (
    <div className="student-form-page">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Add Student</h1>
          <div className="breadcrumb">
            <span>Dashboard</span>
            <span className="breadcrumb-separator">›</span>
            <span>Students</span>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-active">Add</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Personal Information Section */}
        <div className="form-card">
          <h2 className="section-title">Personal Information</h2>
          
          {/* Photo Upload */}
          <div className="photo-upload-section">
            <label className="photo-label">Profile Photo</label>
            <div className="photo-upload-container">
              {photoPreview ? (
                <div className="photo-preview">
                  <img src={photoPreview} alt="Preview" />
                  <button 
                    type="button"
                    className="remove-photo-btn"
                    onClick={handleRemovePhoto}
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="photo-placeholder">
                  <div className="placeholder-icon">
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                      <circle cx="24" cy="24" r="24" fill="#E5E7EB"/>
                      <path d="M24 12C21.24 12 19 14.24 19 17C19 19.76 21.24 22 24 22C26.76 22 29 19.76 29 17C29 14.24 26.76 12 24 12ZM24 20C22.34 20 21 18.66 21 17C21 15.34 22.34 14 24 14C25.66 14 27 15.34 27 17C27 18.66 25.66 20 24 20ZM32 30C32 25 28 24 24 24C20 24 16 25 16 30V32H32V30ZM18.34 30C18.88 28.47 20.71 26 24 26C27.29 26 29.12 28.47 29.66 30H18.34Z" fill="#9CA3AF"/>
                    </svg>
                  </div>
                </div>
              )}
              <label className="upload-btn">
                <Upload size={16} />
                Upload Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  hidden
                />
              </label>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Jane Elizabeth Doe"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="jane.doe@example.edu"
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
                placeholder="+1 555 123 4567"
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
                placeholder="HMS2023001"
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
                placeholder="Computer Science"
                className="form-input"
                required
              />
            </div>

            <div className="form-group form-group-full">
              <label className="form-label">Year / Semester</label>
              <input
                type="text"
                name="yearSemester"
                value={formData.yearSemester}
                onChange={handleInputChange}
                placeholder="2nd Year / 4th Semester"
                className="form-input"
                required
              />
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
                placeholder="John Doe"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Guardian Phone</label>
              <input
                type="tel"
                name="guardianPhone"
                value={formData.guardianPhone}
                onChange={handleInputChange}
                placeholder="+1 555 987 6543"
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
                placeholder="123 University Avenue, Student Residence, Cityville, State, 12345"
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
            type="button" 
            className="btn-secondary"
            onClick={handleReset}
          >
            Reset
          </button>
          <button 
            type="submit" 
            className="btn-primary"
          >
            Save Student
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddStudent;