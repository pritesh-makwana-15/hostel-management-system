import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MapPin, Building2, FileText, Info, X } from 'lucide-react';
import { adminWardenApi } from '../../../services/adminWardenApi';
import { adminRoomApi } from '../../../services/adminRoomApi';
import '../../../styles/admin/wardens/assignBlock.css';

const AssignBlock = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [warden, setWarden] = useState(null);
  const [hostelOptions, setHostelOptions] = useState([]);
  const [blockOptions, setBlockOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    targetHostel: '',
    targetBlock: '',
    notes: '',
  });

  // Load warden data and room data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load warden data
        const wardenRes = await adminWardenApi.getById(id);
        const wardenData = wardenRes.data.data;
        setWarden(wardenData);

        // Load hostel blocks data
        const hostelBlocks = await adminRoomApi.getHostelBlocks();
        setHostelOptions(hostelBlocks);
        
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [id]);

  // Load blocks when hostel changes
  const handleHostelChange = async (e) => {
    const hostel = e.target.value;
    setFormData(prev => ({ ...prev, targetHostel: hostel, targetBlock: '' }));
    
    if (hostel) {
      try {
        const rooms = await adminRoomApi.getRoomsByHostel(hostel);
        setBlockOptions(rooms);
      } catch (err) {
        console.error('Error loading blocks:', err);
      }
    } else {
      setBlockOptions([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      // TODO: Call API to update warden assignment
      // await adminWardenApi.updateAssignment(id, formData);
      
      // For now, just navigate back
      navigate('/admin/wardens');
    } catch (err) {
      console.error('Error saving assignment:', err);
      setError('Failed to save assignment');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="assign-block-page">
        <div className="loading-spinner">Loading warden and room data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="assign-block-page">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  if (!warden) {
    return (
      <div className="assign-block-page">
        <div className="error-message">Warden not found</div>
      </div>
    );
  }

  return (
    <div className="assign-block-page">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-left">
          <MapPin size={22} className="header-icon" />
          <div>
            <h1 className="page-title">Assign Hostel / Block</h1>
            <p className="page-subtitle">
              Update the physical assignment for the selected warden. This will update their primary responsibility area.
            </p>
          </div>
        </div>
      </div>

      {/* Warden Profile Card */}
      <div className="warden-profile-card">
        <div className="profile-left">
          <div className="profile-avatar-wrapper">
            <img src={warden.photo} alt={warden.name} className="profile-avatar" />
            <span className="profile-status-dot" />
          </div>
          <div className="profile-details">
            <div className="profile-name-row">
              <h2 className="profile-name">{warden.name}</h2>
              <span className="profile-id-badge">{warden.id}</span>
            </div>
            <div className="profile-contact">
              <span>✉ {warden.email}</span>
              <span>📞 {warden.phone}</span>
            </div>
          </div>
        </div>
        <div className="profile-right">
          <span className="current-assignment-label">CURRENT ASSIGNMENT</span>
          <div className="current-assignment">
            <MapPin size={16} className="assignment-pin" />
            <div>
              <div className="assignment-hostel">No current assignment</div>
              <div className="assignment-block">Not assigned</div>
            </div>
          </div>
        </div>
      </div>

      {/* Assignment Form */}
      <form className="assign-form" onSubmit={handleSave}>
        <div className="form-card">
          <div className="form-card-header">
            <Building2 size={18} className="form-card-icon" />
            <div>
              <h2 className="form-card-title">New Assignment Details</h2>
              <p className="form-card-subtitle">Select the new hostel and block where this warden will be stationed.</p>
            </div>
          </div>

          <div className="assign-form-grid">
            <div className="form-group">
              <label className="form-label">
                Target Hostel <span className="required-star">*</span>
              </label>
              <select
                name="targetHostel"
                value={formData.targetHostel}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">Select Hostel</option>
                {hostelOptions.map((h) => (
                  <option key={h.id} value={h.name}>{h.name}</option>
                ))}
              </select>
              <span className="input-hint">Choose the primary campus location.</span>
            </div>
            <div className="form-group">
              <label className="form-label">
                Target Block <span className="required-star">*</span>
              </label>
              <select
                name="targetBlock"
                value={formData.targetBlock}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">Select Block</option>
                {blockOptions.map((b) => (
                  <option key={b.id} value={b.name}>{b.name}</option>
                ))}
              </select>
              <span className="input-hint">Specific building or section assignment.</span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              Assignment Notes <span className="optional-tag">Optional</span>
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="form-textarea"
              rows={5}
              placeholder="Provide context for this reassignment (e.g., Staff rotation, Urgent cover, etc.)"
            />
          </div>

          {/* Important Note */}
          <div className="important-consideration">
            <Info size={16} className="consideration-icon" />
            <div>
              <strong>Important Consideration</strong>
              <p>
                Assigning a warden to a new block will automatically notify the Block Manager and
                update the warden's access permissions for that specific location within 24 hours.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={() => navigate('/admin/wardens')}>
            <X size={16} /> Cancel
          </button>
          <button type="submit" className="btn-primary">
            <Building2 size={16} /> Save Assignment
          </button>
        </div>

        {/* Extra Links */}
        <div className="extra-links">
          <button type="button" className="extra-link">
            <FileText size={15} /> View Hostel Capacity
          </button>
          <button type="button" className="extra-link">
            <MapPin size={15} /> Warden Shift History
          </button>
        </div>
      </form>
    </div>
  );
};

export default AssignBlock;