import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { adminWardenApi } from '../../../services/adminWardenApi';
import '../../../styles/admin/wardens/editWarden.css';

const genderOptions  = ['Male', 'Female', 'Other'];

const EditWarden = () => {
  const navigate = useNavigate();
  const { id }   = useParams();

  console.log('EditWarden: Component mounted, ID from params:', id);

  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);
  const [error, setError]           = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData]     = useState({
    name: '', email: '', phone: '', gender: '',
    joinDate: '', address: '', password: '',
  });

  useEffect(() => {
    console.log('EditWarden: Loading warden with ID:', id);
    adminWardenApi.getById(id)
      .then(res => {
        console.log('EditWarden: API response:', res);
        const w = res.data.data;
        console.log('EditWarden: Warden data:', w);
        setFormData({
          name:     w.name     || '',
          email:    w.email    || '',
          phone:    w.phone    || '',
          gender:   w.gender   || '',
          joinDate: w.joinDate || '',
          address:  w.address  || '',
          password: '',
        });
      })
      .catch(error => {
        console.error('EditWarden: Error loading warden:', error);
        setError('Failed to load warden data: ' + (error.response?.data?.message || error.message));
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await adminWardenApi.update(id, formData);
      navigate('/admin/wardens');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update warden.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading">Loading warden data...</div>;

  return (
    <div className="edit-warden-page">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate('/admin/wardens')}>
          <ArrowLeft size={18} /> Back to Wardens
        </button>
        <div className="header-content">
          <div>
            <h1 className="page-title">Edit Warden Profile</h1>
            <p className="page-subtitle">Update warden information</p>
          </div>
        </div>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <form className="warden-form" onSubmit={handleUpdate}>
        <div className="form-card">
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
                {genderOptions.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Date of Joining</label>
              <input type="text" name="joinDate" value={formData.joinDate}
                onChange={handleChange} className="form-input" 
                placeholder="DD-MM-YYYY or DD-MM-YYYYYY" />
            </div>
            <div className="form-group form-group-full">
              <label className="form-label">Address</label>
              <textarea name="address" value={formData.address}
                onChange={handleChange} className="form-input" rows="2" />
            </div>
          </div>

          <div className="form-section-label">Change Password</div>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">New Password (leave blank to keep current)</label>
              <div className="input-wrapper">
                <input type={showPassword ? 'text' : 'password'} name="password"
                  value={formData.password} onChange={handleChange}
                  className="form-input" placeholder="••••••••" />
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
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Updating...' : 'Update Warden'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditWarden;