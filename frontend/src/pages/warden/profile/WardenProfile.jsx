import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, Mail, Phone, Shield, Calendar,
  Edit2, Lock, LogOut, CheckCircle, X, Save,
  Clock, Key, Monitor
} from 'lucide-react';
import '../../../styles/warden/profile/wardenProfile.css';

const wardenData = {
  name: 'John Doe',
  wardenId: 'WRD001',
  email: 'warden@hms.com',
  phone: '+91 9876543210',
  username: 'warden_john',
  role: 'Warden',
  accessLevel: 'Block B Management',
  accountCreated: '05 Mar 2024',
  lastLogin: '25 Mar 2026, 09:15 AM',
  accountStatus: 'Active',
  activeSessions: 2,
};

const WardenProfile = () => {
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: wardenData.name,
    phone: wardenData.phone,
  });
  const [savedData, setSavedData] = useState({
    name: wardenData.name,
    phone: wardenData.phone,
  });

  const handleEditToggle = () => {
    setIsEditing(true);
    setFormData({ name: savedData.name, phone: savedData.phone });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({ name: savedData.name, phone: savedData.phone });
  };

  const handleSave = () => {
    setSavedData({ ...formData });
    setIsEditing(false);
  };

  const handleLogoutAll = () => {
    navigate('/login');
  };

  return (
    <div className="warden-profile-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="breadcrumb">
          <span className="breadcrumb-link" onClick={() => navigate('/warden/dashboard')}>Dashboard</span>
          <span className="breadcrumb-sep">›</span>
          <span className="breadcrumb-active">Warden Profile</span>
        </div>
        <h1 className="page-title">Warden Profile</h1>
        <p className="page-subtitle">Manage your account information and security preferences.</p>
      </div>

      {/* Profile Hero Card */}
      <div className="profile-hero-card">
        <div className="profile-hero-left">
          <div className="profile-avatar-wrap">
            <div className="profile-avatar">
              <User size={40} />
            </div>
            <span className="profile-online-dot"></span>
          </div>
          <div className="profile-hero-info">
            {isEditing ? (
              <input
                className="profile-name-input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            ) : (
              <h2 className="profile-hero-name">{savedData.name}</h2>
            )}
            <div className="profile-hero-meta">
              <span className="role-badge">
                <Shield size={12} />
                {wardenData.role}
              </span>
              <span className="warden-id-dot">•</span>
              <span className="warden-id">{wardenData.wardenId}</span>
            </div>
          </div>
        </div>

        <div className="profile-hero-actions">
          {isEditing ? (
            <>
              <button className="btn-cancel-edit" onClick={handleCancel}>
                <X size={16} />
                Cancel
              </button>
              <button className="btn-save-profile" onClick={handleSave}>
                <Save size={16} />
                Save Changes
              </button>
            </>
          ) : (
            <button className="btn-edit-profile" onClick={handleEditToggle}>
              <Edit2 size={16} />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Info Strip */}
      <div className="profile-info-strip">
        <div className="info-strip-item">
          <div className="info-strip-icon"><Mail size={16} /></div>
          <div className="info-strip-content">
            <span className="info-strip-label">EMAIL ADDRESS</span>
            <span className="info-strip-value">{wardenData.email}</span>
          </div>
        </div>

        <div className="info-strip-divider"></div>

        <div className="info-strip-item">
          <div className="info-strip-icon"><Phone size={16} /></div>
          <div className="info-strip-content">
            <span className="info-strip-label">PHONE NUMBER</span>
            {isEditing ? (
              <input
                className="info-strip-input"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            ) : (
              <span className="info-strip-value">{savedData.phone}</span>
            )}
          </div>
        </div>

        <div className="info-strip-divider"></div>

        <div className="info-strip-item">
          <div className="info-strip-icon"><Shield size={16} /></div>
          <div className="info-strip-content">
            <span className="info-strip-label">ACCESS LEVEL</span>
            <span className="info-strip-value">{wardenData.accessLevel}</span>
          </div>
        </div>

        <div className="info-strip-divider"></div>

        <div className="info-strip-item">
          <div className="info-strip-icon"><Calendar size={16} /></div>
          <div className="info-strip-content">
            <span className="info-strip-label">MEMBER SINCE</span>
            <span className="info-strip-value">{wardenData.accountCreated}</span>
          </div>
        </div>
      </div>

      {/* Lower Grid */}
      <div className="profile-lower-grid">

        {/* Account Information */}
        <div className="profile-section-card">
          <div className="section-card-header">
            <User size={20} className="section-card-icon" />
            <div>
              <h3 className="section-card-title">Account Information</h3>
              <p className="section-card-subtitle">Internal system metadata and status.</p>
            </div>
          </div>

          <div className="account-info-table">
            <div className="account-info-row">
              <span className="account-info-label">Username</span>
              <span className="account-info-value">{wardenData.username}</span>
            </div>
            <div className="account-info-row">
              <span className="account-info-label">Primary Role</span>
              <span className="account-info-value account-info-bold">{wardenData.role}</span>
            </div>
            <div className="account-info-row">
              <span className="account-info-label">Last Login</span>
              <span className="account-info-value">
                <Clock size={14} style={{ marginRight: 6, color: 'var(--text-secondary)' }} />
                {wardenData.lastLogin}
              </span>
            </div>
            <div className="account-info-row no-border">
              <span className="account-info-label">Account Status</span>
              <span className="status-badge-active">
                <CheckCircle size={13} />
                {wardenData.accountStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="profile-section-card">
          <div className="section-card-header">
            <Shield size={20} className="section-card-icon" />
            <div>
              <h3 className="section-card-title">Security Settings</h3>
              <p className="section-card-subtitle">Update your credentials and manage sessions.</p>
            </div>
          </div>

          <div className="security-action-card">
            <div className="security-action-icon-wrap">
              <Key size={20} />
            </div>
            <div className="security-action-info">
              <h4 className="security-action-title">Change Password</h4>
              <p className="security-action-desc">
                It is recommended to change your password every 90 days to maintain high account security.
              </p>
              <button
                className="btn-update-password"
                onClick={() => navigate('/warden/change-password')}
              >
                Update Password
              </button>
            </div>
          </div>

          <div className="security-action-card">
            <div className="security-action-icon-wrap logout-icon-wrap">
              <Monitor size={20} />
            </div>
            <div className="security-action-info">
              <h4 className="security-action-title">Logout from Sessions</h4>
              <p className="security-action-desc">
                You are currently logged into {wardenData.activeSessions} active devices. Logout to terminate all other sessions.
              </p>
              <button className="btn-logout-devices" onClick={handleLogoutAll}>
                <LogOut size={15} />
                Logout All Devices
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default WardenProfile;