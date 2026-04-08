import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { adminWardenApi } from '../../../services/adminWardenApi';
import '../../../styles/admin/wardens/editWarden.css';

const genderOptions  = ['Male', 'Female', 'Other'];

// Convert ISO date (YYYY-MM-DD) to display format (DD-MM-YYYY)
const convertToDisplayFormat = (isoDate) => {
  if (!isoDate) return '';
  
  try {
    // Handle if it's already a string in DD-MM-YYYY format
    if (typeof isoDate === 'string' && isoDate.includes('-')) {
      const parts = isoDate.split('-');
      if (parts.length === 3 && parts[0].length === 2 && parts[2].length === 4) {
        // Already in DD-MM-YYYY format
        return isoDate;
      }
    }
    
    // Convert from ISO format or Date object
    const date = new Date(isoDate);
    if (isNaN(date.getTime())) return isoDate; // Return original if invalid
    
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}-${month}-${year}`;
  } catch (error) {
    console.error('Date conversion error:', error);
    return isoDate;
  }
};

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

  // Debug: Log state changes
  console.log('EditWarden: Current state - loading:', loading, 'error:', error, 'formData:', formData);

  useEffect(() => {
    console.log('EditWarden: Loading warden with ID:', id);
    
    if (!id) {
      console.error('EditWarden: No ID provided in URL params');
      setError('No warden ID provided');
      setLoading(false);
      return;
    }

    // Add timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      console.warn('EditWarden: API call taking too long, setting loading to false');
      setError('Request timed out. Please check your connection and try again.');
      setLoading(false);
    }, 10000); // 10 seconds timeout

    adminWardenApi.getById(id)
      .then(res => {
        clearTimeout(timeout);
        console.log('EditWarden: API response:', res);
        console.log('EditWarden: Response data:', res.data);
        
        if (!res.data || !res.data.data) {
          console.error('EditWarden: Invalid response structure - no data found');
          console.error('EditWarden: Full response structure:', JSON.stringify(res, null, 2));
          
          // Try fallback - some APIs might return data directly
          if (res.data && typeof res.data === 'object' && (res.data.name || res.data.email)) {
            console.log('EditWarden: Using fallback data structure');
            const w = res.data;
            setFormData({
              name:     w.name     || '',
              email:    w.email    || '',
              phone:    w.phone    || '',
              gender:   w.gender   || '',
              joinDate: w.joinDate || '',
              address:  w.address  || '',
              password: '',
            });
            return;
          }
          
          setError('Invalid response from server');
          return;
        }
        
        const w = res.data.data;
        console.log('EditWarden: Warden data:', w);
        
        if (!w) {
          console.error('EditWarden: Warden not found in response');
          setError('Warden not found');
          return;
        }
        
        setFormData({
          name:     w.name     || '',
          email:    w.email    || '',
          phone:    w.phone    || '',
          gender:   w.gender   || '',
          joinDate: w.joinDate ? convertToDisplayFormat(w.joinDate) : '',
          address:  w.address  || '',
          password: '',
        });
      })
      .catch(error => {
        clearTimeout(timeout);
        console.error('EditWarden: Error loading warden:', error);
        console.error('EditWarden: Error response:', error.response);
        
        let errorMessage = 'Failed to load warden data';
        
        if (error.response?.status === 404) {
          errorMessage = `Warden with ID ${id} not found`;
        } else if (error.response?.status === 403) {
          errorMessage = 'Access denied - you may not have permission to edit wardens';
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        setError(errorMessage);
      })
      .finally(() => {
        clearTimeout(timeout);
        setLoading(false);
      });
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
            console.warn('EditWarden: Invalid year format, expected 4 digits:', year);
            setError('Please enter date in DD-MM-YYYY format (4-digit year)');
            setSaving(false);
            return;
          }
        }
      }
      
      console.log('EditWarden: Sending data to backend:', dataToSend);
      await adminWardenApi.update(id, dataToSend);
      navigate('/admin/wardens');
    } catch (err) {
      console.error('EditWarden: Update error:', err);
      setError(err.response?.data?.message || 'Failed to update warden.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading">Loading warden...</div>;

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

          <div className="form-section-label">Change Password</div>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">New Password (leave blank to keep current)</label>
              <div className="input-wrapper">
                <input type={showPassword ? 'text' : 'password'} name="password"
                  value={formData.password} onChange={handleChange}
                  className="form-input" placeholder="•••••••" />
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
