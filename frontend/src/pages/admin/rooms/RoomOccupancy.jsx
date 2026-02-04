import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bed, Settings } from 'lucide-react';
import { roomsData, getOccupancyColor, getOccupancyPercentage } from '../../../data/roomsData';
import '../../../styles/admin/rooms/roomOccupancy.css';

const RoomOccupancy = () => {
  const navigate = useNavigate();

  const handleViewBeds = (roomId) => {
    navigate(`/admin/rooms/${roomId}/beds`);
  };

  const handleManageRoom = (roomId) => {
    navigate(`/admin/rooms/${roomId}/edit`);
  };

  return (
    <div className="room-occupancy-page">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Room Occupancy Overview</h1>
          <div className="breadcrumb">
            <span>Dashboard</span>
            <span className="breadcrumb-separator">›</span>
            <span>Rooms</span>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-active">Occupancy</span>
          </div>
        </div>
      </div>

      {/* Occupancy Cards Grid */}
      <div className="occupancy-grid">
        {roomsData.map((room) => {
          const percentage = getOccupancyPercentage(room.occupiedBeds, room.totalBeds);
          const color = getOccupancyColor(room.occupiedBeds, room.totalBeds);
          
          return (
            <div key={room.id} className="occupancy-card">
              <div className="occupancy-card-header">
                <div className="room-info">
                  <h3 className="room-title">Room {room.roomNumber} - {room.blockHostel}</h3>
                  <span className={`room-type-badge ${room.roomType === 'AC' ? 'badge-ac' : 'badge-non-ac'}`}>
                    {room.roomType}
                  </span>
                </div>
              </div>

              <div className="occupancy-card-body">
                <div className="occupancy-text">
                  <span className="occupancy-value">{room.occupiedBeds} / {room.totalBeds}</span>
                  <span className="occupancy-label">beds occupied</span>
                </div>

                <div className="progress-bar-container">
                  <div 
                    className="progress-bar" 
                    style={{ 
                      width: `${percentage}%`,
                      backgroundColor: color
                    }}
                  ></div>
                </div>

                <div className="occupancy-percentage" style={{ color }}>
                  {percentage}% Occupancy
                </div>
              </div>

              <div className="occupancy-card-actions">
                <button 
                  className="action-btn action-btn-view"
                  onClick={() => handleViewBeds(room.id)}
                >
                  <Bed size={18} />
                  View Beds
                </button>
                <button 
                  className="action-btn action-btn-manage"
                  onClick={() => handleManageRoom(room.id)}
                >
                  <Settings size={18} />
                  Manage Room
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RoomOccupancy;