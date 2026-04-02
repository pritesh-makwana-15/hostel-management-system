import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Eye, Edit, Settings, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { hostelBlocks, roomTypes, occupancyStatusOptions } from '../../../data/roomsData';
import { adminRoomApi } from '../../../services/adminRoomApi';
import '../../../styles/admin/rooms/roomsList.css';

const RoomsList = () => {
  const navigate = useNavigate();

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [filters, setFilters] = useState({
    hostelBlock: '',
    roomType: '',
    occupancyStatus: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const roomsPerPage = 5;

  // Fetch rooms from backend
  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminRoomApi.getAll();
      setRooms(res.data.data || []);
    } catch (err) {
      setError('Failed to load rooms. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Filter rooms
  const filteredRooms = rooms.filter((room) => {
    const matchesBlock = !filters.hostelBlock || room.hostelBlock === filters.hostelBlock;
    const matchesType = !filters.roomType || room.roomType === filters.roomType;
    const matchesStatus = !filters.occupancyStatus || room.occupancyStatus === filters.occupancyStatus;
    return matchesBlock && matchesType && matchesStatus;
  });

  // Compute stats from live data
  const totalRooms = rooms.length;
  const totalBeds = rooms.reduce((s, r) => s + r.totalBeds, 0);
  const occupiedBeds = rooms.reduce((s, r) => s + r.occupiedBeds, 0);
  const availableBeds = rooms.reduce((s, r) => s + r.availableBeds, 0);

  // Pagination
  const indexOfLast = currentPage * roomsPerPage;
  const indexOfFirst = indexOfLast - roomsPerPage;
  const currentRooms = filteredRooms.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredRooms.length / roomsPerPage);

  const handleResetFilters = () => {
    setFilters({ hostelBlock: '', roomType: '', occupancyStatus: '' });
    setCurrentPage(1);
  };

  const getStatusColor = (status) => {
    if (status === 'Full') return '#EF4444';
    if (status === 'Partial') return '#F59E0B';
    return '#10B981';
  };

  const getRoomTypeBadgeClass = (type) =>
    type === 'AC' ? 'room-type-badge-ac' : 'room-type-badge-non-ac';

  return (
    <div className="rooms-list-page">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Rooms & Beds</h1>
          <div className="breadcrumb">
            <span>Dashboard</span>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-active">Rooms</span>
          </div>
        </div>
        <button className="btn-primary" onClick={() => navigate('/admin/rooms/add')}>
          <Plus size={20} />
          Add Room
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div style={{
          background: '#FEE2E2', color: '#B91C1C', border: '1px solid #FCA5A5',
          borderRadius: '8px', padding: '12px 16px', marginBottom: '16px', fontSize: '14px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          {error}
          <button onClick={fetchRooms} style={{ background: 'none', border: 'none', color: '#B91C1C', cursor: 'pointer', fontWeight: '600' }}>
            Retry
          </button>
        </div>
      )}

      {/* Filters Card */}
      <div className="filters-card">
        <h3 className="filters-title">Filter Rooms</h3>
        <div className="filters-grid">
          <div className="filter-group">
            <label>Hostel / Block</label>
            <select
              value={filters.hostelBlock}
              onChange={(e) => setFilters({ ...filters, hostelBlock: e.target.value })}
              className="filter-select"
            >
              <option value="">All Hostels</option>
              {hostelBlocks.map((b) => (
                <option key={b.id} value={b.name}>{b.name}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Room Type</label>
            <select
              value={filters.roomType}
              onChange={(e) => setFilters({ ...filters, roomType: e.target.value })}
              className="filter-select"
            >
              <option value="">All Types</option>
              {roomTypes.map((t) => (
                <option key={t.id} value={t.name}>{t.name}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Occupancy Status</label>
            <select
              value={filters.occupancyStatus}
              onChange={(e) => setFilters({ ...filters, occupancyStatus: e.target.value })}
              className="filter-select"
            >
              <option value="">All Status</option>
              {occupancyStatusOptions.map((s) => (
                <option key={s.id} value={s.name}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="filters-actions">
          <button className="btn-secondary" onClick={handleResetFilters}>Reset</button>
          <button className="btn-primary" onClick={() => setCurrentPage(1)}>Apply Filters</button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <div className="summary-icon" style={{ backgroundColor: '#E3F2FD', color: '#1976D2' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            </svg>
          </div>
          <div className="summary-content">
            <div className="summary-label">Total Rooms</div>
            <div className="summary-value">{totalRooms}</div>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon" style={{ backgroundColor: '#E0F2F1', color: '#00897B' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
          </div>
          <div className="summary-content">
            <div className="summary-label">Total Beds</div>
            <div className="summary-value">{totalBeds}</div>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon" style={{ backgroundColor: '#FFEBEE', color: '#C62828' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="8" r="4" /><path d="M12 12v8" />
            </svg>
          </div>
          <div className="summary-content">
            <div className="summary-label">Occupied Beds</div>
            <div className="summary-value">{occupiedBeds}</div>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon" style={{ backgroundColor: '#E8F5E9', color: '#43A047' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="10" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <div className="summary-content">
            <div className="summary-label">Available Beds</div>
            <div className="summary-value">{availableBeds}</div>
          </div>
        </div>
      </div>

      {/* Rooms Table */}
      <div className="table-card">
        {loading ? (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            Loading rooms...
          </div>
        ) : filteredRooms.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            No rooms found. <button className="btn-primary" style={{ marginLeft: '12px' }}
              onClick={() => navigate('/admin/rooms/add')}>Add First Room</button>
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="rooms-table">
                <thead>
                  <tr>
                    <th>Room ID</th>
                    <th>Block / Hostel</th>
                    <th>Room Number</th>
                    <th>Room Type</th>
                    <th>Total Beds</th>
                    <th>Occupied</th>
                    <th>Available</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRooms.map((room) => (
                    <tr key={room.id}>
                      <td className="room-id">#{room.id}</td>
                      <td>{room.hostelBlock}</td>
                      <td className="room-number">{room.roomNumber}</td>
                      <td>
                        <span className={`room-type-badge ${getRoomTypeBadgeClass(room.roomType)}`}>
                          {room.roomType}
                        </span>
                      </td>
                      <td>{room.totalBeds}</td>
                      <td>{room.occupiedBeds}</td>
                      <td>{room.availableBeds}</td>
                      <td>
                        <span className="status-badge" style={{
                          backgroundColor: `${getStatusColor(room.occupancyStatus)}20`,
                          color: getStatusColor(room.occupancyStatus),
                        }}>
                          {room.occupancyStatus}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="action-btn"
                            onClick={() => navigate(`/admin/rooms/${room.id}/beds`)}
                            title="View Beds"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            className="action-btn"
                            onClick={() => navigate(`/admin/rooms/${room.id}/edit`)}
                            title="Edit Room"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            className="action-btn"
                            onClick={() => navigate(`/admin/rooms/${room.id}/beds`)}
                            title="Manage Beds"
                          >
                            <Settings size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <div className="pagination-info">Page {currentPage} of {totalPages}</div>
                <div className="pagination-buttons">
                  <button className="pagination-btn" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
                    <ChevronsLeft size={16} />
                  </button>
                  <button className="pagination-btn" onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}>
                    <ChevronLeft size={16} /> Previous
                  </button>
                  <button className="pagination-btn" onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>
                    Next <ChevronRight size={16} />
                  </button>
                  <button className="pagination-btn" onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>
                    <ChevronsRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RoomsList;
