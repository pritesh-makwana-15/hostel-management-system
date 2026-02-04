import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Eye, Edit, Settings, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { roomsData, hostelBlocks, roomTypes, occupancyStatusOptions, getTotalStats } from '../../../data/roomsData';
import '../../../styles/admin/rooms/roomsList.css';

const RoomsList = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    hostelBlock: '',
    roomType: '',
    occupancyStatus: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const roomsPerPage = 5;

  // Get stats
  const stats = getTotalStats();

  // Filter rooms
  const filteredRooms = roomsData.filter(room => {
    const matchesBlock = !filters.hostelBlock || room.blockHostel === filters.hostelBlock;
    const matchesType = !filters.roomType || room.roomType === filters.roomType;
    const matchesStatus = !filters.occupancyStatus || room.occupancyStatus === filters.occupancyStatus;
    
    return matchesBlock && matchesType && matchesStatus;
  });

  // Pagination
  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = filteredRooms.slice(indexOfFirstRoom, indexOfLastRoom);
  const totalPages = Math.ceil(filteredRooms.length / roomsPerPage);

  const handleResetFilters = () => {
    setFilters({
      hostelBlock: '',
      roomType: '',
      occupancyStatus: ''
    });
    setCurrentPage(1);
  };

  const handleApplyFilters = () => {
    setCurrentPage(1);
  };

  const getStatusColor = (status) => {
    const statusOption = occupancyStatusOptions.find(opt => opt.name === status);
    return statusOption ? statusOption.color : '#6B7280';
  };

  const getRoomTypeBadgeClass = (type) => {
    return type === 'AC' ? 'room-type-badge-ac' : 'room-type-badge-non-ac';
  };

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
        <button 
          className="btn-primary"
          onClick={() => navigate('/admin/rooms/add')}
        >
          <Plus size={20} />
          Add Room
        </button>
      </div>

      {/* Filters Card */}
      <div className="filters-card">
        <h3 className="filters-title">Filter Rooms</h3>
        <div className="filters-grid">
          <div className="filter-group">
            <label>Hostel / Block</label>
            <select
              value={filters.hostelBlock}
              onChange={(e) => setFilters({...filters, hostelBlock: e.target.value})}
              className="filter-select"
            >
              <option value="">Select a hostel</option>
              {hostelBlocks.map(block => (
                <option key={block.id} value={block.name}>{block.name}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Room Type</label>
            <select
              value={filters.roomType}
              onChange={(e) => setFilters({...filters, roomType: e.target.value})}
              className="filter-select"
            >
              <option value="">Select room type</option>
              {roomTypes.map(type => (
                <option key={type.id} value={type.name}>{type.name}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Occupancy Status</label>
            <select
              value={filters.occupancyStatus}
              onChange={(e) => setFilters({...filters, occupancyStatus: e.target.value})}
              className="filter-select"
            >
              <option value="">Select status</option>
              {occupancyStatusOptions.map(status => (
                <option key={status.id} value={status.name}>{status.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="filters-actions">
          <button className="btn-secondary" onClick={handleResetFilters}>
            Reset
          </button>
          <button className="btn-primary" onClick={handleApplyFilters}>
            Apply Filters
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <div className="summary-icon" style={{ backgroundColor: '#E3F2FD', color: '#1976D2' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            </svg>
          </div>
          <div className="summary-content">
            <div className="summary-label">Total Rooms</div>
            <div className="summary-value">{stats.totalRooms}</div>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon" style={{ backgroundColor: '#E0F2F1', color: '#00897B' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
            </svg>
          </div>
          <div className="summary-content">
            <div className="summary-label">Total Beds</div>
            <div className="summary-value">{stats.totalBeds}</div>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon" style={{ backgroundColor: '#FFEBEE', color: '#C62828' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="8" r="4"/>
              <path d="M12 12v8"/>
            </svg>
          </div>
          <div className="summary-content">
            <div className="summary-label">Occupied Beds</div>
            <div className="summary-value">{stats.occupiedBeds}</div>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon" style={{ backgroundColor: '#E8F5E9', color: '#43A047' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="10" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <div className="summary-content">
            <div className="summary-label">Available Beds</div>
            <div className="summary-value">{stats.availableBeds}</div>
          </div>
        </div>
      </div>

      {/* Rooms Table */}
      <div className="table-card">
        <div className="table-responsive">
          <table className="rooms-table">
            <thead>
              <tr>
                <th>Room ID</th>
                <th>Block / Hostel</th>
                <th>Room Number</th>
                <th>Room Type</th>
                <th>Total Beds</th>
                <th>Occupied Beds</th>
                <th>Available Beds</th>
                <th>Occupancy Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentRooms.map((room) => (
                <tr key={room.id}>
                  <td className="room-id">{room.id}</td>
                  <td>{room.blockHostel}</td>
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
                    <span 
                      className="status-badge"
                      style={{ 
                        backgroundColor: `${getStatusColor(room.occupancyStatus)}15`,
                        color: getStatusColor(room.occupancyStatus)
                      }}
                    >
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
            <div className="pagination-info">
              Page {currentPage} of {totalPages}
            </div>
            <div className="pagination-buttons">
              <button 
                className="pagination-btn"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                title="First Page"
              >
                <ChevronsLeft size={16} />
              </button>
              <button 
                className="pagination-btn"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={16} />
                Previous
              </button>
              
              <button 
                className="pagination-btn"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight size={16} />
              </button>
              <button 
                className="pagination-btn"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                title="Last Page"
              >
                <ChevronsRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomsList;