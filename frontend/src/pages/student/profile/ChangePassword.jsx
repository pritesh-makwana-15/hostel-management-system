import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Lock, Eye, EyeOff, CheckCircle, X,
  AlertCircle, ChevronRight, Shield, Info
} from 'lucide-react';
import { studentApi } from '../../../services/studentApi';
import '../../../styles/student/profile/changePassword.css';

// Password requirement checker
const getRequirements = (password, confirmPassword) => [
  { id: 'length',    label: 'At least 8 characters long',            met: password.length >= 8 },
  { id: 'uppercase', label: 'Contains an uppercase letter',          met: /[A-Z]/.test(password) },
  { id: 'number',    label: 'Contains at least one number',          met: /[0-9]/.test(password) },
  { id: 'special',   label: 'Contains a special character (@$!%*?)', met: /[@$!%*?&#^]/.test(password) },
  { id: 'match',     label: 'Passwords must match',                  met: password.length > 0 && password === confirmPassword },
];

const ChangePassword = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword:     '',
    confirmPassword: '',
  });

  const [show, setShow] = useState({
    currentPassword: false,
    newPassword:     false,
    confirmPassword: false,
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const requirements = getRequirements(formData.newPassword, formData.confirmPassword);
  const allMet = requirements.every((r) => r.met);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const toggleShow = (field) => {
    setShow((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.currentPassword) {
      setError('Please enter your current password.');
      return;
    }
    if (!allMet) {
      setError('Please meet all password requirements before submitting.');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      await studentApi.changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      
      setSubmitted(true);
      setTimeout(() => navigate('/student/profile'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password. Please check your current password and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cp-page">

      {/* Page Header */}
      <div className="cp-page-header">
        <div>
          <div className="cp-breadcrumb">
            <span className="cp-bc-link" onClick={() => navigate('/student/dashboard')}>Dashboard</span>
            <ChevronRight size={13} />
            <span className="cp-bc-link" onClick={() => navigate('/student/profile')}>My Profile</span>
            <ChevronRight size={13} />
            <span className="cp-bc-active">Change Password</span>
          </div>
          <h1 className="cp-page-title">Security Settings</h1>
          <p className="cp-page-subtitle">Ensure your account is secure by using a strong, unique password.</p>
        </div>
        <button className="cp-btn-back" onClick={() => navigate('/student/profile')}>
          Back to Profile
        </button>
      </div>

      {/* Success State */}
      {submitted && (
        <div className="cp-success-banner">
          <CheckCircle size={18} />
          <span>Password updated successfully! Redirecting to your profile...</span>
        </div>
      )}

      {/* Main Form Card */}
      <div className="cp-center-wrap">
        <div className="cp-card">

          {/* Card Header */}
          <div className="cp-card-top">
            <div className="cp-card-icon-wrap"><Lock size={22} /></div>
            <div>
              <h2 className="cp-card-title">Change Password</h2>
              <p className="cp-card-sub">Update your credentials regularly to keep your hostel account secure.</p>
            </div>
          </div>

          {error && (
            <div className="cp-error-note">
              <AlertCircle size={15} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Current Password */}
            <div className="cp-field-group">
              <label className="cp-label">Current Password</label>
              <div className="cp-input-wrap">
                <Lock size={16} className="cp-input-icon" />
                <input
                  type={show.currentPassword ? 'text' : 'password'}
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  placeholder="Enter your current password"
                  className="cp-input"
                  autoComplete="current-password"
                />
                <button type="button" className="cp-eye-btn" onClick={() => toggleShow('currentPassword')}>
                  {show.currentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="cp-field-group">
              <label className="cp-label">New Password</label>
              <div className="cp-input-wrap">
                <Lock size={16} className="cp-input-icon" />
                <input
                  type={show.newPassword ? 'text' : 'password'}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Create a strong new password"
                  className="cp-input"
                  autoComplete="new-password"
                />
                <button type="button" className="cp-eye-btn" onClick={() => toggleShow('newPassword')}>
                  {show.newPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Password Requirements */}
              {formData.newPassword.length > 0 && (
                <div className="cp-requirements">
                  <p className="cp-req-title">SECURITY REQUIREMENTS</p>
                  {requirements.map((req) => (
                    <div key={req.id} className={`cp-req-item ${req.met ? 'cp-req-item--met' : ''}`}>
                      {req.met
                        ? <CheckCircle size={13} className="cp-req-icon cp-req-icon--met" />
                        : <div className="cp-req-circle" />
                      }
                      <span>{req.label}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Static requirements when no input yet */}
              {formData.newPassword.length === 0 && (
                <div className="cp-requirements">
                  <p className="cp-req-title">SECURITY REQUIREMENTS</p>
                  {requirements.map((req) => (
                    <div key={req.id} className="cp-req-item">
                      <div className="cp-req-circle" />
                      <span>{req.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="cp-field-group">
              <label className="cp-label">Confirm New Password</label>
              <div className="cp-input-wrap">
                <Lock size={16} className="cp-input-icon" />
                <input
                  type={show.confirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat your new password"
                  className={`cp-input ${
                    formData.confirmPassword && formData.newPassword !== formData.confirmPassword
                      ? 'cp-input--error'
                      : ''
                  }`}
                  autoComplete="new-password"
                />
                <button type="button" className="cp-eye-btn" onClick={() => toggleShow('confirmPassword')}>
                  {show.confirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
                <p className="cp-mismatch">Passwords do not match.</p>
              )}
            </div>

            {/* Security Note */}
            <div className="cp-security-note">
              <Info size={16} className="cp-note-icon" />
              <div>
                <strong>Important Security Note</strong>
                <p>Changing your password will automatically log you out of all other active sessions across different devices and browsers to ensure your account's integrity.</p>
              </div>
            </div>

            {/* Form Buttons */}
            <div className="cp-form-actions">
              <button type="button" className="cp-btn-cancel" onClick={() => navigate('/student/profile')}>
                Cancel
              </button>
              <button
                type="submit"
                className={`cp-btn-submit ${allMet && formData.currentPassword ? '' : 'cp-btn-submit--disabled'}`}
                disabled={submitted || loading}
              >
                {loading ? 'Updating...' : submitted ? <><CheckCircle size={15} /> Updated!</> : 'Update Password'}
              </button>
            </div>
          </form>
        </div>

        {/* Footer Note */}
        <div className="cp-footer-note">
          <Shield size={28} className="cp-footer-shield" />
          <p className="cp-footer-text">
            Last password change: <strong>January 15, 2024</strong> <span className="cp-footer-ago">(45 days ago)</span>
          </p>
          <div className="cp-footer-links">
            <button className="cp-footer-link">Security Policy</button>
            <button className="cp-footer-link">Two-Factor Auth</button>
            <button className="cp-footer-link">Login History</button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ChangePassword;
