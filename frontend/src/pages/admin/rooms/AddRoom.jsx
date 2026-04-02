import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bed } from 'lucide-react';
import { hostelBlocks } from '../../../data/roomsData';
import { adminRoomApi } from '../../../services/adminRoomApi';
import '../../../styles/admin/rooms/addRoom.css';

const AddRoom = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    hostelBlock: '',
    roomNumber: '',
    roomType: 'Non-AC',
    floor: '',
    description: '',
    totalBeds: 4,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleReset = () => {
    setFormData({
      hostelBlock: '',
      roomNumber: '',
      roomType: 'Non-AC',
      floor: '',
      description: '',
      totalBeds: 4,
    });
    setError('');
  };

  const handleCancel = () => navigate('/admin/rooms');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        totalBeds: parseInt(formData.totalBeds, 10),
      };
      await adminRoomApi.create(payload);
      navigate('/admin/rooms');
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Failed to add room. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const generateBedPreview = () => {
    const beds = [];
    for (let i = 1; i <= Number(formData.totalBeds); i++) {
      beds.push({ id: `B${i}`, status: 'Available' });
    }
    return beds;
  };

  const bedPreview = generateBedPreview();

  return (
    <div className="add-room-page">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Add Room</h1>
          <div className="breadcrumb">
            <span>Dashboard</span>
            <span className="breadcrumb-separator">›</span>
            <span>Rooms</span>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-active">Add</span>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div style={{
          background: '#FEE2E2', color: '#B91C1C', border: '1px solid #FCA5A5',
          borderRadius: '8px', padding: '12px 16px', marginBottom: '16px', fontSize: '14px'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Room Details Card */}
        <div className="form-card">
          <div className="form-card-header">
            <h3>Room Details</h3>
            <p>Enter the information to add a new room to the hostel.</p>
          </div>

          {/* Room Information */}
          <div className="form-section">
            <h4 className="section-title">Room Information</h4>

            <div className="form-grid">
              <div className="form-group">
                <label>Hostel / Block <span className="required">*</span></label>
                <select
                  name="hostelBlock"
                  value={formData.hostelBlock}
                  onChange={handleInputChange}
                  className="form-select"
                  required
                >
                  <option value="">Select a hostel</option>
                  {hostelBlocks.map((block) => (
                    <option key={block.id} value={block.name}>{block.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Room Number <span className="required">*</span></label>
                <input
                  type="text"
                  name="roomNumber"
                  value={formData.roomNumber}
                  onChange={handleInputChange}
                  placeholder="e.g. 101"
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>Room Type <span className="required">*</span></label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input type="radio" name="roomType" value="AC"
                      checked={formData.roomType === 'AC'} onChange={handleInputChange} />
                    <span>AC</span>
                  </label>
                  <label className="radio-label">
                    <input type="radio" name="roomType" value="Non-AC"
                      checked={formData.roomType === 'Non-AC'} onChange={handleInputChange} />
                    <span>Non-AC</span>
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label>Floor (Optional)</label>
                <input
                  type="text"
                  name="floor"
                  value={formData.floor}
                  onChange={handleInputChange}
                  placeholder="e.g. 1st"
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Description (Optional)</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Any additional details about the room..."
                className="form-textarea"
                rows="4"
              />
            </div>
          </div>

          {/* Bed Configuration */}
          <div className="form-section">
            <h4 className="section-title">Bed Configuration</h4>
            <div className="form-group">
              <label>Total Beds <span className="required">*</span></label>
              <input
                type="number"
                name="totalBeds"
                value={formData.totalBeds}
                onChange={handleInputChange}
                min="1"
                max="10"
                className="form-input"
                style={{ maxWidth: '200px' }}
                required
              />
            </div>
          </div>

          {/* Bed Preview */}
          <div className="form-section">
            <h4 className="section-title">Bed Preview</h4>
            <p className="section-description">
              All newly added beds are marked 'Available' automatically.
            </p>
            <div className="bed-preview-grid">
              {bedPreview.map((bed) => (
                <div key={bed.id} className="bed-card bed-card-available">
                  <div className="bed-icon"><Bed size={24} /></div>
                  <div className="bed-id">{bed.id}</div>
                  <div className="bed-status">{bed.status}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={handleReset} disabled={loading}>
            Reset
          </button>
          <button type="button" className="btn-secondary" onClick={handleCancel} disabled={loading}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Save Room'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddRoom;
