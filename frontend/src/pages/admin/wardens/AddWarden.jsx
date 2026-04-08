import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Lock, Eye, EyeOff } from 'lucide-react';
// import { wardenAPI } from '../../../services/api';
import { adminWardenApi } from '../../../services/adminWardenApi';
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
      // Convert date format from DD-MM-YYYY to YYYY-MM-DD for backend
      const dataToSend = { ...formData };
      if (dataToSend.joinDate) {
        // Handle DD-MM-YYYY format only
        const dateParts = dataToSend.joinDate.split('-');
        if (dateParts.length === 3) {
          const day = dateParts[0].padStart(2, '0');
          const month = dateParts[1].padStart(2, '0');
          const year = dateParts[2];
          
          // Validate year is 4 digits
          if (year.length === 4) {
            dataToSend.joinDate = `${year}-${month}-${day}`;
          } else {
            setError('Please enter date in DD-MM-YYYY format (4-digit year)');
            setLoading(false);
            return;
          }
        }
      }
      
      await adminWardenApi.create({
        name: dataToSend.name,
        email: dataToSend.email,
        password: dataToSend.password,
        phone: dataToSend.phone,
        gender: dataToSend.gender,
        address: dataToSend.address,
        joinDate: dataToSend.joinDate || null,
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
              <div className="radio-group">
                <label className="radio-label">
                  <input type="radio" name="gender" value="Male"
                    checked={formData.gender === 'Male'}
                    onChange={handleChange} className="radio-input" />
                  <span className="radio-text">Male</span>
                </label>
                <label className="radio-label">
                  <input type="radio" name="gender" value="Female"
                    checked={formData.gender === 'Female'}
                    onChange={handleChange} className="radio-input" />
                  <span className="radio-text">Female</span>
                </label>
                <label className="radio-label">
                  <input type="radio" name="gender" value="Other"
                    checked={formData.gender === 'Other'}
                    onChange={handleChange} className="radio-input" />
                  <span className="radio-text">Other</span>
                </label>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Date of Joining</label>
              <input type="text" name="joinDate" value={formData.joinDate}
                onChange={handleChange} className="form-input" 
                placeholder="DD-MM-YYYY" />
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