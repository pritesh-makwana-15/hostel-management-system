import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, Shield, AlertCircle, CheckCircle } from 'lucide-react';
import '../../../styles/warden/profile/changePassword.css';

const WardenChangePassword = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState('');

  const toggleShow = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setSuccessMsg('');
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.currentPassword) newErrors.currentPassword = 'Current password is required.';
    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required.';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters.';
    } else if (!/[A-Z]/.test(formData.newPassword)) {
      newErrors.newPassword = 'Password must include an uppercase letter.';
    } else if (!/[0-9]/.test(formData.newPassword)) {
      newErrors.newPassword = 'Password must include a number.';
    } else if (!/[^A-Za-z0-9]/.test(formData.newPassword)) {
      newErrors.newPassword = 'Password must include a special character.';
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password.';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }
    return newErrors;
  };

  const handleSubmit = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setSuccessMsg('Password updated successfully!');
    setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setErrors({});
  };

  const pw = formData.newPassword;
  const requirements = [
    { label: 'Minimum 8 characters',                 met: pw.length >= 8 },
    { label: 'Include at least one uppercase letter', met: /[A-Z]/.test(pw) },
    { label: 'Include at least one number',           met: /[0-9]/.test(pw) },
    { label: 'Include a special character',           met: /[^A-Za-z0-9]/.test(pw) },
  ];

  return (
    <div className="warden-change-password-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="breadcrumb">
          <span className="breadcrumb-link" onClick={() => navigate('/warden/dashboard')}>Dashboard</span>
          <span className="breadcrumb-sep">›</span>
          <span className="breadcrumb-link" onClick={() => navigate('/warden/profile')}>Profile</span>
          <span className="breadcrumb-sep">›</span>
          <span className="breadcrumb-active">Change Password</span>
        </div>
        <h1 className="page-title">Change Password</h1>
        <p className="page-subtitle">Ensure your account is secure by using a strong, unique password.</p>
      </div>

      {/* Main Card */}
      <div className="cp-main-card">

        <div className="cp-card-header">
          <div className="cp-shield-icon">
            <Shield size={22} />
          </div>
          <div>
            <h3 className="cp-card-title">Security Update</h3>
            <p className="cp-card-desc">Update your account password to stay protected.</p>
          </div>
        </div>

        <div className="cp-divider"></div>

        {successMsg && (
          <div className="cp-success-alert">
            <CheckCircle size={16} />
            {successMsg}
          </div>
        )}

        {/* Current Password */}
        <div className="cp-form-group">
          <label className="cp-label">Current Password</label>
          <div className={`cp-input-wrap ${errors.currentPassword ? 'cp-input-error' : ''}`}>
            <Lock size={16} className="cp-input-icon" />
            <input
              type={showPasswords.current ? 'text' : 'password'}
              name="currentPassword"
              placeholder="Enter your existing password"
              value={formData.currentPassword}
              onChange={handleChange}
              className="cp-input"
            />
            <button type="button" className="cp-eye-btn" onClick={() => toggleShow('current')} tabIndex={-1}>
              {showPasswords.current ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.currentPassword && (
            <span className="cp-error-msg"><AlertCircle size={13} /> {errors.currentPassword}</span>
          )}
        </div>

        {/* New Password */}
        <div className="cp-form-group">
          <label className="cp-label">New Password</label>
          <div className={`cp-input-wrap ${errors.newPassword ? 'cp-input-error' : ''}`}>
            <Lock size={16} className="cp-input-icon" />
            <input
              type={showPasswords.new ? 'text' : 'password'}
              name="newPassword"
              placeholder="Create a strong new password"
              value={formData.newPassword}
              onChange={handleChange}
              className="cp-input"
            />
            <button type="button" className="cp-eye-btn" onClick={() => toggleShow('new')} tabIndex={-1}>
              {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.newPassword && (
            <span className="cp-error-msg"><AlertCircle size={13} /> {errors.newPassword}</span>
          )}

          <div className="cp-requirements-box">
            <p className="cp-req-title">PASSWORD REQUIREMENTS:</p>
            <div className="cp-req-grid">
              {requirements.map((req, idx) => (
                <div key={idx} className={`cp-req-item ${req.met ? 'cp-req-met' : ''}`}>
                  <AlertCircle size={13} className="cp-req-icon" />
                  {req.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="cp-form-group">
          <label className="cp-label">Confirm New Password</label>
          <div className={`cp-input-wrap ${errors.confirmPassword ? 'cp-input-error' : ''}`}>
            <Lock size={16} className="cp-input-icon" />
            <input
              type={showPasswords.confirm ? 'text' : 'password'}
              name="confirmPassword"
              placeholder="Re-enter your new password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="cp-input"
            />
            <button type="button" className="cp-eye-btn" onClick={() => toggleShow('confirm')} tabIndex={-1}>
              {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <span className="cp-error-msg"><AlertCircle size={13} /> {errors.confirmPassword}</span>
          )}
        </div>

        <div className="cp-divider"></div>

        <div className="cp-actions">
          <button className="btn-cp-cancel" onClick={() => navigate('/warden/profile')}>
            Cancel
          </button>
          <button className="btn-cp-submit" onClick={handleSubmit}>
            Update Password
          </button>
        </div>
      </div>

      {/* Note */}
      <div className="cp-note-box">
        <AlertCircle size={16} className="cp-note-icon" />
        <p>
          <strong>Note:</strong> After updating your password, you will be required to re-login
          to all active sessions on other devices for security purposes.
        </p>
      </div>
    </div>
  );
};

export default WardenChangePassword;