import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, Info, Shield } from 'lucide-react';
import { getWardenById, hostelOptions, blockOptions, genderOptions } from '../../../data/wardensData';
import '../../../styles/admin/wardens/editWarden.css';

const EditWarden = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const warden = getWardenById(id) || {
    id: 'W-102',
    name: 'Robert Wilson',
    email: 'robert.wilson@hms-system.com',
    phone: '+1 (555) 123-4567',
    gender: 'Male',
    dateOfJoining: '2023-05-15',
    hostel: 'North Campus',
    block: 'Block B',
    username: 'rwilson_admin',
    status: 'Active',
  };

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: warden.name || '',
    email: warden.email || '',
    phone: warden.phone || '',
    gender: warden.gender || '',
    dateOfJoining: warden.dateOfJoining || '',
    hostel: warden.hostel || '',
    block: warden.block || '',
    username: warden.username || '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    navigate('/admin/wardens');
  };

  return (
    <div className="edit-warden-page">
      {/* Header */}
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate('/admin/wardens')}>
          <ArrowLeft size={18} />
        </button>
        <div className="header-content">
          <div>
            <h1 className="page-title">Edit Warden Profile</h1>
            <p className="page-subtitle">Update credentials and assignment for {warden.name}</p>
          </div>
          <span className="account-status-badge">Account Active</span>
        </div>
      </div>

      {/* Important Note */}
      <div className="important-note">
        <Info size={16} className="note-icon" />
        <span>
          System-level identifiers like Warden ID and Username cannot be modified.
          To change these, please contact the IT Infrastructure department.
        </span>
      </div>

      <form className="warden-form" onSubmit={handleUpdate}>
        <div className="form-card">
          <div className="form-card-heading">
            <Shield size={18} />
            <h2>Warden Details — {warden.id}</h2>
          </div>
          <p className="form-card-note">All fields are pre-filled based on the existing record in the database.</p>

          {/* Personal Information */}
          <div className="form-section-bar" />
          <div className="form-section-label">Personal Information</div>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-wrapper">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
                <span className="input-suffix-icon">✓</span>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="form-select"
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
              />
            </div>
          </div>

          {/* Hostel Assignment */}
          <div className="form-section-bar" />
          <div className="form-section-label">Hostel Assignment</div>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Primary Hostel</label>
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
              <label className="form-label">Assigned Block</label>
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

          {/* System Credentials */}
          <div className="form-section-bar" />
          <div className="form-section-label">System Credentials</div>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Username (Read-Only)</label>
              <input
                type="text"
                value={formData.username}
                className="form-input input-readonly"
                readOnly
              />
            </div>
            <div className="form-group">
              <label className="form-label">Change Password</label>
              <div className="input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Leave blank to keep current"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input"
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

        {/* Footer */}
        <div className="form-footer">
          <span className="last-updated">Last updated by Administrator on Oct 12, 2023 at 04:32 PM</span>
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => navigate('/admin/wardens')}>Cancel</button>
            <button type="submit" className="btn-primary">Update Warden</button>
          </div>
        </div>

        {/* Extra Links */}
        <div className="extra-links">
          <button type="button" className="extra-link extra-link-blue">View Activity Logs</button>
          <button type="button" className="extra-link extra-link-teal">Hostel Capacity Report</button>
          <button type="button" className="extra-link extra-link-red">Reset 2FA Status</button>
        </div>
      </form>
    </div>
  );
};

export default EditWarden;