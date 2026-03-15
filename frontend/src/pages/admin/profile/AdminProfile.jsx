import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, Mail, Phone, Shield, Calendar,
  Edit2, Lock, LogOut, CheckCircle, X, Save,
  Clock, Key, Monitor
} from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import '../../../styles/admin/profile/adminProfile.css';

const adminData = {
  name: 'Pritesh Makwana',
  adminId: 'ADM001',
  email: 'admin@hms.com',
  phone: '+91 9876543210',
  username: 'admin_pritesh',
  role: 'System Administrator',
  accessLevel: 'Full Access / Root',
  accountCreated: '12 Jan 2025',
  lastLogin: '14 Mar 2026, 10:30 AM',
  accountStatus: 'Active',
  activeSessions: 2,
};

const AdminProfile = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: adminData.name,
    phone: adminData.phone,
  });
  const [savedData, setSavedData] = useState({
    name: adminData.name,
    phone: adminData.phone,
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
    logout();
    navigate('/login');
  };

  return (
    <div className="admin-profile-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-left">
          <div className="breadcrumb">
            <span className="breadcrumb-link" onClick={() => navigate('/admin/dashboard')}>Dashboard</span>
            <span className="breadcrumb-sep">›</span>
            <span className="breadcrumb-active">Admin Profile</span>
          </div>
          <h1 className="page-title">Admin Profile</h1>
          <p className="page-subtitle">Manage your account information and security preferences.</p>
        </div>
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
                {adminData.role}
              </span>
              <span className="admin-id-dot">•</span>
              <span className="admin-id">{adminData.adminId}</span>
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
          <div className="info-strip-icon">
            <Mail size={16} />
          </div>
          <div className="info-strip-content">
            <span className="info-strip-label">EMAIL ADDRESS</span>
            <span className="info-strip-value">{adminData.email}</span>
          </div>
        </div>

        <div className="info-strip-divider"></div>

        <div className="info-strip-item">
          <div className="info-strip-icon">
            <Phone size={16} />
          </div>
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
          <div className="info-strip-icon">
            <Shield size={16} />
          </div>
          <div className="info-strip-content">
            <span className="info-strip-label">ACCESS LEVEL</span>
            <span className="info-strip-value">{adminData.accessLevel}</span>
          </div>
        </div>

        <div className="info-strip-divider"></div>

        <div className="info-strip-item">
          <div className="info-strip-icon">
            <Calendar size={16} />
          </div>
          <div className="info-strip-content">
            <span className="info-strip-label">MEMBER SINCE</span>
            <span className="info-strip-value">{adminData.accountCreated}</span>
          </div>
        </div>
      </div>

      {/* Lower Grid: Account Info + Security Settings */}
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
              <span className="account-info-value">{adminData.username}</span>
            </div>
            <div className="account-info-row">
              <span className="account-info-label">Primary Role</span>
              <span className="account-info-value account-info-bold">{adminData.role}</span>
            </div>
            <div className="account-info-row">
              <span className="account-info-label">Last Login</span>
              <span className="account-info-value">
                <Clock size={14} style={{ marginRight: 6, color: 'var(--text-secondary)' }} />
                {adminData.lastLogin}
              </span>
            </div>
            <div className="account-info-row no-border">
              <span className="account-info-label">Account Status</span>
              <span className="status-badge-active">
                <CheckCircle size={13} />
                {adminData.accountStatus}
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

          {/* Change Password Card */}
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
                onClick={() => navigate('/admin/profile/change-password')}
              >
                Update Password
              </button>
            </div>
          </div>

          {/* Logout All Devices Card */}
          <div className="security-action-card">
            <div className="security-action-icon-wrap logout-icon-wrap">
              <Monitor size={20} />
            </div>
            <div className="security-action-info">
              <h4 className="security-action-title">Logout from Sessions</h4>
              <p className="security-action-desc">
                You are currently logged into {adminData.activeSessions} active devices. Logout to terminate all other sessions.
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

export default AdminProfile;