import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Lock, Eye, EyeOff } from 'lucide-react';
import { wardenAPI } from '../../../services/api';
import '../../../styles/admin/wardens/addWarden.css';

const AddWarden = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', gender: '',
    joinDate: '', address: '', password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await wardenAPI.create({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        gender: formData.gender,
        address: formData.address,
        joinDate: formData.joinDate || null,
      });
      navigate('/admin/wardens');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create warden.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-warden-page">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate('/admin/wardens')}>
          <ArrowLeft size={18} /> Back to Wardens
        </button>
        <div>
          <h1 className="page-title">Add New Warden</h1>
          <p className="page-subtitle">Fill in the details to register a new warden.</p>
        </div>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <form className="warden-form" onSubmit={handleSave}>
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
              <select name="gender" value={formData.gender}
                onChange={handleChange} className="form-select">
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Date of Joining</label>
              <input type="date" name="joinDate" value={formData.joinDate}
                onChange={handleChange} className="form-input" />
            </div>
            <div className="form-group form-group-full">
              <label className="form-label">Address</label>
              <textarea name="address" value={formData.address}
                onChange={handleChange} className="form-input" rows="2" />
            </div>
          </div>

          <div className="form-section-label">Login Credentials</div>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Password *</label>
              <div className="input-wrapper">
                <Lock size={16} className="input-icon" />
                <input type={showPassword ? 'text' : 'password'} name="password"
                  value={formData.password} onChange={handleChange}
                  className="form-input" required />
                <button type="button" className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-secondary"
            onClick={() => navigate('/admin/wardens')}>Cancel</button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Warden'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddWarden;