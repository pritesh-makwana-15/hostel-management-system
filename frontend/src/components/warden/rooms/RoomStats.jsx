import React from 'react';
import { Building2, BedDouble, Users, CheckCircle } from 'lucide-react';

const RoomStats = ({ stats }) => {
  const statItems = [
    { label: 'TOTAL ROOMS', value: stats.totalRooms, icon: Building2, color: '#1F3C88', bg: '#EEF2FF' },
    { label: 'TOTAL BEDS', value: stats.totalBeds, icon: BedDouble, color: '#2BBBAD', bg: '#E6FAF8' },
    { label: 'OCCUPIED BEDS', value: stats.occupiedBeds, icon: Users, color: '#F59E0B', bg: '#FEF3C7' },
    { label: 'AVAILABLE BEDS', value: stats.availableBeds, icon: CheckCircle, color: '#10B981', bg: '#D1FAE5' },
  ];

  return (
    <div className="room-stats-grid">
      {statItems.map((item) => {
        const Icon = item.icon;
        return (
          <div className="room-stat-card" key={item.label}>
            <div className="room-stat-info">
              <span className="room-stat-label">{item.label}</span>
              <span className="room-stat-value">{item.value}</span>
            </div>
            <div className="room-stat-icon" style={{ background: item.bg, color: item.color }}>
              <Icon size={22} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RoomStats;