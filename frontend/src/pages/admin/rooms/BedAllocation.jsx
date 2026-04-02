import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Bed, X, ArrowLeft } from 'lucide-react';
import { bedStatusOptions } from '../../../data/roomsData';
import { adminRoomApi } from '../../../services/adminRoomApi';
import '../../../styles/admin/rooms/bedAllocation.css';

const BedAllocation = () => {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [selectedBed, setSelectedBed] = useState(null);
  const [bedStatus, setBedStatus] = useState('');
  const [roomData, setRoomData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await adminRoomApi.getById(roomId);
        setRoomData(response.data.data);
      } catch (error) {
        console.error('Error fetching room:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [roomId]);

  const handleBedClick = (bed) => {
    setSelectedBed(bed);
    setBedStatus(bed.status);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedBed(null);
    setBedStatus('');
  };

  const handleSaveChanges = () => {
    console.log('Saving changes for bed:', selectedBed.id, 'New status:', bedStatus);
    alert(`Bed ${selectedBed.id} status updated to ${bedStatus}`);
    handleCloseModal();
  };

  const handleBackToRooms = () => {
    navigate('/admin/rooms');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!roomData) {
    return <div>Room not found</div>;
  }

  return (
    <div className="bed-allocation-page">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Bed Allocation for Room {roomData.roomNumber}</h1>
          <div className="breadcrumb">
            <span>Dashboard</span>
            <span className="breadcrumb-separator">›</span>
            <span>Rooms</span>
            <span className="breadcrumb-separator">›</span>
            <span>Room {roomData.roomNumber}</span>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-active">Bed Allocation</span>
          </div>
        </div>
        <button className="btn-secondary" onClick={handleBackToRooms}>
          <ArrowLeft size={18} />
          Back to Rooms
        </button>
      </div>

      {/* Room Info Card */}
      <div className="room-info-card">
        <div className="room-info-header">
          <h3>Room {roomData.roomNumber}</h3>
          <span className={`room-type-badge ${roomData.roomType === 'AC' ? 'badge-ac' : 'badge-non-ac'}`}>
            {roomData.roomType}
          </span>
        </div>
        <div className="room-info-details">
          <div className="info-item">
            <span className="info-label">Block / Hostel</span>
            <span className="info-value">{roomData.hostelBlock}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Total Beds</span>
            <span className="info-value">{roomData.totalBeds}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Occupied</span>
            <span className="info-value" style={{ color: '#EF4444' }}>{roomData.occupiedBeds} Beds</span>
          </div>
          <div className="info-item">
            <span className="info-label">Available</span>
            <span className="info-value" style={{ color: '#10B981' }}>{roomData.availableBeds} Beds</span>
          </div>
        </div>
      </div>

      {/* Bed Grid */}
      <div className="beds-grid-card">
        <div className="beds-grid">
          {roomData.beds.map((bed) => (
            <div
              key={bed.id}
              className={`bed-card ${
                bed.status === 'Occupied' ? 'bed-card-occupied' :
                bed.status === 'Maintenance' ? 'bed-card-maintenance' :
                'bed-card-available'
              }`}
              onClick={() => handleBedClick(bed)}
            >
              <div className="bed-icon">
                <Bed size={32} />
              </div>
              <div className="bed-id">{bed.bedNumber}</div>
              <div className="bed-status-badge">
                {bed.status === 'Occupied' && (
                  <span className="occupied-badge">Occupied</span>
                )}
                {bed.status === 'Available' && (
                  <span className="available-badge">Available</span>
                )}
                {bed.status === 'Maintenance' && (
                  <span className="maintenance-badge">Maintenance</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <>
          <div className="modal-overlay" onClick={handleCloseModal}></div>
          <div className="modal">
            <div className="modal-header">
              <h3>Manage Bed {selectedBed?.bedNumber}</h3>
              <button className="modal-close" onClick={handleCloseModal}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <p className="modal-description">Update the status or allocate this bed.</p>
              
              <div className="form-group">
                <label>Status</label>
                <select
                  value={bedStatus}
                  onChange={(e) => setBedStatus(e.target.value)}
                  className="form-select"
                >
                  {bedStatusOptions.map(option => (
                    <option key={option.id} value={option.name}>{option.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={handleCloseModal}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleSaveChanges}>
                Save Changes
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default BedAllocation;