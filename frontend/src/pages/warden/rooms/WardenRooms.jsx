import React, { useState, useMemo } from 'react';
import { roomsData, getTotalStats } from '../../../data/roomsData';
import RoomStats from '../../../components/warden/rooms/RoomStats';
import RoomFilter from '../../../components/warden/rooms/RoomFilter';
import RoomCard from '../../../components/warden/rooms/RoomCard';
import { Home } from 'lucide-react';
import '../../../styles/warden/rooms/rooms.css';

const WardenRooms = () => {
  const stats = getTotalStats();
  const [filters, setFilters] = useState({ search: '', block: '', type: '', status: '' });

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setFilters({ search: '', block: '', type: '', status: '' });
  };

  const filtered = useMemo(() => {
    return roomsData.filter((room) => {
      const searchStr = `${room.roomNumber} ${room.blockHostel}`.toLowerCase();
      if (filters.search && !searchStr.includes(filters.search.toLowerCase())) return false;
      if (filters.block && room.blockHostel !== filters.block) return false;
      if (filters.type && room.roomType !== filters.type) return false;
      if (filters.status && room.occupancyStatus !== filters.status) return false;
      return true;
    });
  }, [filters]);

  return (
    <div className="warden-rooms-page">
      <RoomStats stats={stats} />
      <RoomFilter filters={filters} onChange={handleFilterChange} onReset={handleReset} />

      <div className="rooms-overview-header">
        <div className="rooms-overview-title">
          <Home size={18} />
          <span>Rooms Overview</span>
          <span className="rooms-overview-count">(Showing {filtered.length} rooms)</span>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rooms-empty">No rooms match your filters.</div>
      ) : (
        <div className="rooms-grid">
          {filtered.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      )}
    </div>
  );
};

export default WardenRooms;