import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { wardenRoomsApi } from '../../../services/wardenRoomsApi';
import { ArrowLeft, MapPin, Layers, BedDouble, Info, CheckCircle2, Users } from 'lucide-react';
import '../../../styles/warden/rooms/roomDetails.css';

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await wardenRoomsApi.getById(id);
        if (mounted) setRoom(res.data?.data || null);
      } catch (e) {
        if (mounted) setError(e.response?.data?.message || e.message || 'Failed to load room');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) return <div className="loading">Loading room...</div>;

  if (error) {
    return (
      <div className="rd-not-found">
        <p>{error}</p>
        <button onClick={() => navigate('/warden/rooms')}>← Back to List</button>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="rd-not-found">
        <p>Room not found.</p>
        <button onClick={() => navigate('/warden/rooms')}>← Back to List</button>
      </div>
    );
  }

  return (
    <div className="rd-page">
      {/* Header */}
      <div className="rd-header">
        <div>
          <h2 className="rd-title">Room Details</h2>
          <p className="rd-subtitle">Manage bed allocations and view resident student profiles.</p>
        </div>
        <div className="rd-header-actions">
          <button className="rd-btn-outline" onClick={() => navigate('/warden/rooms')}>
            <ArrowLeft size={16} /> Back to List
          </button>
        </div>
      </div>

      {/* Room Summary Card */}
      <div className="rd-summary-card">
        <div className="rd-summary-left">
          <div className="rd-summary-icon">
            <BedDouble size={28} />
          </div>
          <div className="rd-summary-info">
            <div className="rd-summary-room-row">
              <h3 className="rd-summary-room-no">{room.blockHostel.replace('Block ', '')}-{room.roomNumber}</h3>
              <span className="rd-type-badge">{room.roomType}</span>
            </div>
            <div className="rd-summary-meta">
              <span><MapPin size={13} /> {room.blockHostel}</span>
              <span><Layers size={13} /> Floor {room.floor}</span>
            </div>
          </div>
        </div>
        <div className="rd-summary-stats">
          <div className="rd-summary-stat">
            <span className="rd-stat-label">TOTAL BEDS</span>
            <span className="rd-stat-num">{room.totalBeds}</span>
          </div>
          <div className="rd-summary-stat">
            <span className="rd-stat-label">AVAILABLE</span>
            <span className="rd-stat-num rd-stat-available">{room.availableBeds}</span>
          </div>
        </div>
      </div>

      {/* Bed Allocation */}
      <div className="rd-section-card">
        <div className="rd-section-header">
          <div className="rd-section-title-row">
            <Users size={18} />
            <h4>Bed Allocation</h4>
            <span className="rd-occ-badge">{room.occupiedBeds} / {room.totalBeds} Occupied</span>
          </div>
          <div className="rd-legend">
            <span className="rd-legend-item"><span className="rd-legend-dot rd-dot-occupied" /> Occupied</span>
            <span className="rd-legend-item"><span className="rd-legend-dot rd-dot-available" /> Available</span>
          </div>
        </div>

        <div className="rd-beds-grid">
          {room.beds.map((bed) => {
            const isOccupied = bed.status === 'Occupied';
            return (
              <div key={bed.id} className={`rd-bed-card ${isOccupied ? 'rd-bed-occupied' : 'rd-bed-available'}`}>
                <span className="rd-bed-label">BED {bed.id}</span>
                {isOccupied ? (
                  <>
                    <div className="rd-bed-avatar">{bed.studentName.charAt(0)}</div>
                    <p className="rd-bed-name">{bed.studentName}</p>
                    <p className="rd-bed-enroll">{bed.enrollment}</p>
                    <button
                      className="rd-bed-action-btn"
                      onClick={() => navigate(`/warden/students/profile/${bed.enrollment}`)}
                    >
                      👁 View Profile
                    </button>
                  </>
                ) : (
                  <>
                    <div className="rd-bed-empty-icon">
                      <BedDouble size={32} />
                    </div>
                    <p className="rd-bed-available-text">Available</p>
                    <p className="rd-bed-available-sub">Ready for student assignment</p>
                    <button
                      className="rd-bed-assign-btn"
                      onClick={() => navigate(`/warden/rooms/view/${room.id}`)}
                    >
                      <Users size={14} /> View Room
                    </button>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Info Cards */}
      <div className="rd-info-grid">
        <div className="rd-info-card">
          <div className="rd-info-icon" style={{ background: '#EEF2FF', color: '#1F3C88' }}>
            <Info size={20} />
          </div>
          <div>
            <h5 className="rd-info-title">Room Amenities</h5>
            <ul className="rd-info-list">
              {room.roomType === 'AC' && <li>Central Air Conditioning</li>}
              <li>Individual Study Desks ({room.totalBeds})</li>
              <li>Attach Bathroom &amp; Shower</li>
            </ul>
          </div>
        </div>

        <div className="rd-info-card">
          <div className="rd-info-icon" style={{ background: '#E6FAF8', color: '#2BBBAD' }}>
            <CheckCircle2 size={20} />
          </div>
          <div>
            <h5 className="rd-info-title">Maintenance Status</h5>
            <p className="rd-info-text">Last inspection: 12 Mar 2024</p>
            <p className="rd-info-bold">All systems functional</p>
          </div>
        </div>

        <div className="rd-info-card">
          <div className="rd-info-icon" style={{ background: '#FEF3C7', color: '#F59E0B' }}>
            <Users size={20} />
          </div>
          <div>
            <h5 className="rd-info-title">Group Policy</h5>
            <p className="rd-info-text">Mixed {room.blockHostel} grouping.</p>
            <p className="rd-info-text">Silent hours: 10 PM – 6 AM</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;