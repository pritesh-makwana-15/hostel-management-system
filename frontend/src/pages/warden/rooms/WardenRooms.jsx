import React, { useEffect, useMemo, useState } from 'react';
import { wardenRoomsApi } from '../../../services/wardenRoomsApi';
import RoomStats from '../../../components/warden/rooms/RoomStats';
import RoomFilter from '../../../components/warden/rooms/RoomFilter';
import RoomCard from '../../../components/warden/rooms/RoomCard';
import { Home } from 'lucide-react';
import '../../../styles/warden/rooms/rooms.css';

const WardenRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ search: '', block: '', type: '', status: '' });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await wardenRoomsApi.getAll();
        const data = res.data?.data || [];
        if (mounted) setRooms(Array.isArray(data) ? data : []);
      } catch (e) {
        if (mounted) setError(e.response?.data?.message || e.message || 'Failed to load rooms');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const stats = useMemo(() => {
    const totalRooms = rooms.length;
    const totalBeds = rooms.reduce((sum, r) => sum + (Number(r.totalBeds) || 0), 0);
    const occupiedBeds = rooms.reduce((sum, r) => sum + (Number(r.occupiedBeds) || 0), 0);
    const availableBeds = rooms.reduce((sum, r) => sum + (Number(r.availableBeds) || 0), 0);
    return { totalRooms, totalBeds, occupiedBeds, availableBeds };
  }, [rooms]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setFilters({ search: '', block: '', type: '', status: '' });
  };

  const filtered = useMemo(() => {
    return rooms.filter((room) => {
      const searchStr = `${room.roomNumber} ${room.blockHostel}`.toLowerCase();
      if (filters.search && !searchStr.includes(filters.search.toLowerCase())) return false;
      if (filters.block && room.blockHostel !== filters.block) return false;
      if (filters.type && room.roomType !== filters.type) return false;
      if (filters.status && room.occupancyStatus !== filters.status) return false;
      return true;
    });
  }, [filters, rooms]);

  if (loading) return <div className="loading">Loading rooms...</div>;
  if (error) return <div className="error">{error}</div>;

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