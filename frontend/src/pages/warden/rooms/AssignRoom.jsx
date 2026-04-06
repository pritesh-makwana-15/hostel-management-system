import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StudentSelect from '../../../components/warden/rooms/StudentSelect';
import BedGrid from '../../../components/warden/rooms/BedGrid';
import { wardenRoomsApi } from '../../../services/wardenRoomsApi';
import { ArrowLeft, Building2, Info } from 'lucide-react';
import '../../../styles/warden/rooms/assignRoom.css';

const AssignRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedBed, setSelectedBed] = useState(null);
  const [assigned, setAssigned] = useState(false);
  const [assigning, setAssigning] = useState(false);

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

  const pct = useMemo(() => {
    if (!room?.totalBeds) return 0;
    return Math.round(((room.occupiedBeds || 0) / room.totalBeds) * 100);
  }, [room]);

  const canAssign = selectedStudent && selectedBed;

  if (loading) return <div className="loading">Loading assignment...</div>;

  if (error) {
    return (
      <div className="ar-not-found">
        <p>{error}</p>
        <button onClick={() => navigate('/warden/rooms')}>← Back</button>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="ar-not-found">
        <p>Room not found.</p>
        <button onClick={() => navigate('/warden/rooms')}>← Back</button>
      </div>
    );
  }

  const handleAssign = async () => {
    if (!canAssign) return;
    setAssigning(true);
    setError('');
    try {
      await wardenRoomsApi.assign(room.id, {
        studentId: selectedStudent.id,
        bedNo: selectedBed,
      });
      setAssigned(true);
      setTimeout(() => {
        navigate(`/warden/rooms/view/${room.id}`);
      }, 800);
    } catch (e) {
      setError(e.response?.data?.message || e.message || 'Failed to assign bed');
    } finally {
      setAssigning(false);
    }
  };

  return (
    <div className="ar-page">
      {/* Page Header */}
      <div className="ar-page-header">
        <div>
          <h2 className="ar-page-title">Assign Room &amp; Bed</h2>
          <p className="ar-page-sub">
            Configure student allocation for Room {room.blockHostel.replace('Block ', '')}-{room.roomNumber}
          </p>
        </div>
        <button className="ar-back-btn" onClick={() => navigate('/warden/rooms')}>
          <ArrowLeft size={16} /> Back to List
        </button>
      </div>

      <div className="ar-layout">
        {/* Left: Form */}
        <div className="ar-left">
          {/* Select Student */}
          <div className="ar-card">
            <div className="ar-card-title-row">
              <span className="ar-card-icon">👤</span>
              <div>
                <h4 className="ar-card-title">Select Student</h4>
                <p className="ar-card-sub">Search and confirm the student for this allocation</p>
              </div>
            </div>
            <StudentSelect selectedStudent={selectedStudent} onSelect={setSelectedStudent} />
          </div>

          {/* Bed Selection */}
          <div className="ar-card">
            <div className="ar-card-title-row">
              <span className="ar-card-icon">🛏</span>
              <div>
                <h4 className="ar-card-title">Bed Selection</h4>
                <p className="ar-card-sub">Choose an available slot from the room layout</p>
              </div>
            </div>
            <BedGrid
              beds={room.beds}
              selectable={true}
              selectedBed={selectedBed}
              onSelect={setSelectedBed}
            />
            <div className="ar-bed-notice">
              <Info size={14} />
              <span>
                Selecting a bed will reserve it for the chosen student. Occupied beds cannot be
                re-assigned without first checking out the current occupant from the Room Details screen.
              </span>
            </div>
          </div>

          {/* Assignment Summary + Actions */}
          <div className="ar-card ar-summary-bar">
            <div className="ar-summary-text">
              {canAssign ? (
                <span>
                  Assign <strong>{selectedStudent.name}</strong> to <strong>Bed {selectedBed}</strong> in Room{' '}
                  <strong>{room.blockHostel.replace('Block ', '')}-{room.roomNumber}</strong>
                </span>
              ) : (
                <span className="ar-summary-placeholder">Please select a student and an available bed slot...</span>
              )}
            </div>
            <div className="ar-action-btns">
              <button className="ar-cancel-btn" onClick={() => navigate('/warden/rooms')}>
                Cancel
              </button>
              <button
                className={`ar-assign-btn ${canAssign ? '' : 'ar-assign-btn-disabled'}`}
                onClick={handleAssign}
                disabled={!canAssign || assigning}
              >
                {assigned ? '✅ Assigned!' : assigning ? 'Assigning...' : '👤 Assign Bed'}
              </button>
            </div>
          </div>
        </div>

        {/* Right: Room Summary */}
        <div className="ar-right">
          <div className="ar-summary-card">
            <h4 className="ar-summary-title">Room Summary</h4>

            <div className="ar-summary-room-icon">
              <Building2 size={28} />
            </div>
            <p className="ar-summary-room-no">{room.blockHostel.replace('Block ', '')}-{room.roomNumber}</p>
            <p className="ar-summary-block">{room.blockHostel}</p>

            <div className="ar-summary-rows">
              <div className="ar-summary-row">
                <span>Room Type</span>
                <strong>{room.roomType} {room.totalBeds === 2 ? 'Double' : room.totalBeds === 4 ? 'Quad' : ''} Sharing</strong>
              </div>
              <div className="ar-summary-row">
                <span>Floor</span>
                <strong>{room.floor} Floor</strong>
              </div>
              <div className="ar-summary-row">
                <span>Total Capacity</span>
                <strong>{room.totalBeds} Beds</strong>
              </div>
              <div className="ar-summary-row">
                <span>Current Availability</span>
                <span className="ar-avail-badge">{room.availableBeds} Free</span>
              </div>
            </div>

            <div className="ar-occ-label">OCCUPANCY STATUS</div>
            <div className="ar-occ-bar-bg">
              <div className="ar-occ-bar-fill" style={{ width: `${pct}%` }} />
            </div>
            <div className="ar-occ-meta">
              <span>{room.occupiedBeds} Beds Occupied</span>
              <span>{room.availableBeds} Bed Available</span>
            </div>

            <div className="ar-block-avail-card">
              <div>
                <p className="ar-block-avail-label">{room.blockHostel.toUpperCase()} - TOTAL AVAILABILITY</p>
                <p className="ar-block-avail-num">12</p>
              </div>
              <Building2 size={22} color="#2BBBAD" />
            </div>

            <div className="ar-pending-card">
              <div>
                <p className="ar-pending-label">PENDING ASSIGNMENTS</p>
                <p className="ar-pending-num">5</p>
              </div>
              <span style={{ fontSize: 22 }}>👤</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignRoom;