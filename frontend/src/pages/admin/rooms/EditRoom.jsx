import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Bed, ArrowLeft } from 'lucide-react';
import { hostelBlocks } from '../../../data/roomsData';
import { adminRoomApi } from '../../../services/adminRoomApi';
import '../../../styles/admin/rooms/addRoom.css';
import '../../../styles/admin/rooms/editRoom.css';

const EditRoom = () => {
  const navigate = useNavigate();
  const { roomId } = useParams();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [existingBeds, setExistingBeds] = useState([]);

  const [formData, setFormData] = useState({
    hostelBlock: '',
    roomNumber: '',
    roomType: 'Non-AC',
    floor: '',
    description: '',
    totalBeds: 4,
  });

  // Fetch existing room data on mount
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await adminRoomApi.getById(roomId);
        const room = res.data.data;
        setFormData({
          hostelBlock: room.hostelBlock || '',
          roomNumber: room.roomNumber || '',
          roomType: room.roomType || 'Non-AC',
          floor: room.floor || '',
          description: room.description || '',
          totalBeds: room.totalBeds || 4,
        });
        setExistingBeds(room.beds || []);
      } catch (err) {
        setError('Failed to load room data.');
      } finally {
        setFetching(false);
      }
    };
    fetchRoom();
  }, [roomId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      await adminRoomApi.update(roomId, payload);
      navigate('/admin/rooms');
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Failed to update room. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Build bed preview: keep existing bed statuses, add new ones, trim removed ones
  const buildBedPreview = () => {
    const total = Number(formData.totalBeds);
    const preview = [];
    for (let i = 1; i <= total; i++) {
      const existing = existingBeds.find((b) => b.bedNumber === `B${i}`);
      preview.push({
        id: `B${i}`,
        status: existing ? existing.status : 'Available',
      });
    }
    return preview;
  };

  const bedPreview = buildBedPreview();

  const getBedClass = (status) => {
    if (status === 'Occupied') return 'bed-card-occupied';
    if (status === 'Maintenance') return 'bed-card-maintenance';
    return 'bed-card-available';
  };

  if (fetching) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        Loading room data...
      </div>
    );
  }

  return (
    <div className="add-room-page edit-room-page">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Edit Room</h1>
          <div className="breadcrumb">
            <span>Dashboard</span>
            <span className="breadcrumb-separator">›</span>
            <span>Rooms</span>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-active">Edit</span>
          </div>
        </div>
        <button className="btn-secondary" onClick={handleCancel}>
          <ArrowLeft size={18} />
          Back to Rooms
        </button>
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
        <div className="form-card">
          <div className="form-card-header">
            <h3>Edit Room Details</h3>
            <p>Update room information. Reducing beds will remove available beds only.</p>
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
              Existing bed statuses are preserved. New beds are marked 'Available'.
            </p>
            <div className="bed-preview-grid">
              {bedPreview.map((bed) => (
                <div key={bed.id} className={`bed-card ${getBedClass(bed.status)}`}>
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
          <button type="button" className="btn-secondary" onClick={handleCancel} disabled={loading}>
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Updating...' : 'Update Room'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditRoom;
