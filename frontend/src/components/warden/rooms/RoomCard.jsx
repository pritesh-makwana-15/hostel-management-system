import React from 'react';
import { useNavigate } from 'react-router-dom';
import BedGrid from './BedGrid';

const getStatusColor = (status) => {
  switch (status) {
    case 'Available': return { color: '#10B981', bg: '#D1FAE5' };
    case 'Fully Occupied': return { color: '#EF4444', bg: '#FEE2E2' };
    default: return { color: '#3B82F6', bg: '#DBEAFE' };
  }
};

const getBarColor = (pct) => {
  if (pct === 100) return '#EF4444';
  if (pct >= 50) return '#1F3C88';
  return '#1F3C88';
};

const RoomCard = ({ room }) => {
  const navigate = useNavigate();
  const { color, bg } = getStatusColor(room.occupancyStatus);
  const pct = Math.round((room.occupiedBeds / room.totalBeds) * 100);
  const isFull = room.availableBeds === 0;

  return (
    <div className="room-card">
      <div className="room-card-header">
        <div className="room-card-title-row">
          <span className="room-card-number">{room.blockHostel.replace('Block ', '')}-{room.roomNumber}</span>
          <span className="room-card-type-badge">{room.roomType}</span>
        </div>
        <span className="room-card-status-badge" style={{ color, background: bg }}>
          {room.occupancyStatus === 'Partially Occupied' ? 'Available' : room.occupancyStatus}
        </span>
      </div>

      <div className="room-card-meta">
        {room.blockHostel} • FLOOR {room.floor.toUpperCase()}
      </div>

      <div className="room-card-occupancy-row">
        <span className="room-card-occ-label">Occupancy ({room.occupiedBeds}/{room.totalBeds})</span>
        <span className="room-card-occ-pct">{pct}%</span>
      </div>
      <div className="room-card-bar-bg">
        <div
          className="room-card-bar-fill"
          style={{ width: `${pct}%`, background: getBarColor(pct) }}
        />
      </div>

      <div className="room-card-beds-row">
        <BedGrid beds={room.beds} />
        <span className="room-card-beds-left">
          {room.availableBeds} {room.availableBeds === 1 ? 'bed' : 'beds'} left
        </span>
      </div>

      <div className="room-card-actions">
        <button
          className="room-card-btn room-card-btn-outline"
          onClick={() => navigate(`/warden/rooms/view/${room.id}`)}
        >
          View Room
        </button>
      </div>
    </div>
  );
};

export default RoomCard;