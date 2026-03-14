import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Building2, Lock, Eye, EyeOff, Info } from 'lucide-react';
import { hostelOptions, blockOptions, genderOptions } from '../../../data/wardensData';
import '../../../styles/admin/wardens/addWarden.css';

const AddWarden = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    gender: '',
    dateOfJoining: '',
    hostel: '',
    block: '',
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    // Integrate with API later
    navigate('/admin/wardens');
  };

  return (
    <div className="add-warden-page">
      {/* Page Header */}
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate('/admin/wardens')}>
          <ArrowLeft size={18} />
          Back to Wardens
        </button>
        <div>
          <h1 className="page-title">Add New Warden</h1>
          <p className="page-subtitle">Fill in the details to register a new warden to the management system.</p>
        </div>
      </div>

      <form className="warden-form" onSubmit={handleSave}>
        {/* Personal Information */}
        <div className="form-card">
          <div className="form-card-header">
            <div className="form-card-icon"><User size={20} /></div>
            <div>
              <h2 className="form-card-title">Warden Details</h2>
              <p className="form-card-subtitle">Complete all mandatory information fields.</p>
            </div>
          </div>

          <div className="form-section-label">Personal Information</div>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="input-wrapper">
                <User size={16} className="input-icon" />
                <input
                  type="text"
                  name="fullName"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-wrapper">
                <span className="input-icon input-icon-text">✉</span>
                <input
                  type="email"
                  name="email"
                  placeholder="j.doe@hms.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                name="phone"
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">Select Gender</option>
                {genderOptions.map((g) => (
                  <option key={g.id} value={g.name}>{g.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group form-group-full">
              <label className="form-label">Date of Joining</label>
              <input
                type="date"
                name="dateOfJoining"
                value={formData.dateOfJoining}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
          </div>

          {/* Hostel Assignment */}
          <div className="form-section-label">Hostel Assignment</div>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Assign Hostel</label>
              <select
                name="hostel"
                value={formData.hostel}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">Select Hostel</option>
                {hostelOptions.map((h) => (
                  <option key={h.id} value={h.name}>{h.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Assign Block</label>
              <select
                name="block"
                value={formData.block}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">Select Block</option>
                {blockOptions.map((b) => (
                  <option key={b.id} value={b.name}>{b.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="assignment-note">
            <Info size={16} className="note-icon" />
            <span>Wardens assigned to premium blocks require additional clearance checks for electronic amenity maintenance.</span>
          </div>

          {/* Login Credentials */}
          <div className="form-section-label">Login Credentials</div>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                type="text"
                name="username"
                placeholder="j.doe.warden"
                value={formData.username}
                onChange={handleChange}
                className="form-input"
                required
              />
              <span className="input-hint">Suggested format: firstname.lastname.role</span>
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-wrapper">
                <Lock size={16} className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="••••••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={() => navigate('/admin/wardens')}>
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            Save Warden
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddWarden;