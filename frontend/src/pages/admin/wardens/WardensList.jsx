import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Eye, Edit, MapPin, Users, Shield, Building2, MessageSquare } from 'lucide-react';
import { wardensData, hostelOptions, blockOptions, wardenStatusOptions, wardenStats } from '../../../data/wardensData';
import '../../../styles/admin/wardens/wardensList.css';

const WardensList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ hostel: '', block: '', status: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const wardensPerPage = 5;

  const filteredWardens = wardensData.filter((w) => {
    const matchesSearch =
      w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.phone.includes(searchTerm);
    const matchesHostel = !filters.hostel || w.hostel === filters.hostel;
    const matchesBlock = !filters.block || w.block === filters.block;
    const matchesStatus = !filters.status || w.status === filters.status;
    return matchesSearch && matchesHostel && matchesBlock && matchesStatus;
  });

  const indexOfLast = currentPage * wardensPerPage;
  const indexOfFirst = indexOfLast - wardensPerPage;
  const currentWardens = filteredWardens.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredWardens.length / wardensPerPage);

  const handleReset = () => {
    setSearchTerm('');
    setFilters({ hostel: '', block: '', status: '' });
    setCurrentPage(1);
  };

  const getStatusColor = (status) => {
    const opt = wardenStatusOptions.find((s) => s.name === status);
    return opt ? opt.color : '#6B7280';
  };

  return (
    <div className="wardens-list-page">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Wardens</h1>
          <p className="page-subtitle">Manage and assign wardens to hostels and blocks.</p>
        </div>
        <button className="btn-primary" onClick={() => navigate('/admin/wardens/add')}>
          <Plus size={20} />
          Add Warden
        </button>
      </div>

      {/* Stats Cards */}
      <div className="warden-stats-grid">
        <div className="warden-stat-card">
          <div className="stat-icon stat-icon-blue"><Users size={22} /></div>
          <div className="stat-info">
            <span className="stat-value">{wardenStats.totalWardens}</span>
            <span className="stat-label">Total Wardens</span>
            <span className="stat-sub">+2 this month</span>
          </div>
        </div>
        <div className="warden-stat-card">
          <div className="stat-icon stat-icon-green"><Shield size={22} /></div>
          <div className="stat-info">
            <span className="stat-value">{wardenStats.activeWardens}</span>
            <span className="stat-label">Active Wardens</span>
          </div>
        </div>
        <div className="warden-stat-card">
          <div className="stat-icon stat-icon-teal"><Building2 size={22} /></div>
          <div className="stat-info">
            <span className="stat-value">{wardenStats.assignedBlocks}</span>
            <span className="stat-label">Assigned Blocks</span>
          </div>
        </div>
        <div className="warden-stat-card">
          <div className="stat-icon stat-icon-red"><MessageSquare size={22} /></div>
          <div className="stat-info">
            <span className="stat-value">{String(wardenStats.pendingComplaints).padStart(2, '0')}</span>
            <span className="stat-label">Pending Complaints</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-card">
        <div className="filters-header">
          <span className="filters-title">Filter Records</span>
        </div>
        <div className="filters-grid">
          <div className="filter-group search-group">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search name, email, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="filter-input search-input"
            />
          </div>
          <div className="filter-group">
            <select
              value={filters.hostel}
              onChange={(e) => setFilters({ ...filters, hostel: e.target.value })}
              className="filter-select"
            >
              <option value="">Select Hostel</option>
              {hostelOptions.map((h) => (
                <option key={h.id} value={h.name}>{h.name}</option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <select
              value={filters.block}
              onChange={(e) => setFilters({ ...filters, block: e.target.value })}
              className="filter-select"
            >
              <option value="">Select Block</option>
              {blockOptions.map((b) => (
                <option key={b.id} value={b.name}>{b.name}</option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="filter-select"
            >
              <option value="">Select Status</option>
              {wardenStatusOptions.map((s) => (
                <option key={s.id} value={s.name}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="filters-actions">
          <button className="btn-secondary" onClick={handleReset}>Reset</button>
          <button className="btn-primary">Apply Filters</button>
        </div>
      </div>

      {/* Table */}
      <div className="table-card">
        <div className="table-responsive">
          <table className="wardens-table">
            <thead>
              <tr>
                <th>Warden ID</th>
                <th>Name &amp; Email</th>
                <th>Phone</th>
                <th>Assigned Block</th>
                <th>Hostel</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentWardens.map((warden) => (
                <tr key={warden.id}>
                  <td className="warden-id">{warden.id}</td>
                  <td>
                    <div className="warden-name-cell">
                      <img
                        src={warden.photo}
                        alt={warden.name}
                        className="warden-avatar"
                      />
                      <div>
                        <div className="warden-name">{warden.name}</div>
                        <div className="warden-email">{warden.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>{warden.phone}</td>
                  <td>
                    <span className="block-badge">
                      <Building2 size={13} />
                      {warden.block}
                    </span>
                  </td>
                  <td>{warden.hostel}</td>
                  <td>
                    <span
                      className="status-badge"
                      style={{
                        backgroundColor: `${getStatusColor(warden.status)}18`,
                        color: getStatusColor(warden.status),
                      }}
                    >
                      {warden.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="action-btn"
                        title="View"
                        onClick={() => navigate(`/admin/wardens/${warden.id}/edit`)}
                      >
                        <Eye size={17} />
                      </button>
                      <button
                        className="action-btn"
                        title="Edit"
                        onClick={() => navigate(`/admin/wardens/${warden.id}/edit`)}
                      >
                        <Edit size={17} />
                      </button>
                      <button
                        className="action-btn"
                        title="Assign Block"
                        onClick={() => navigate(`/admin/wardens/${warden.id}/assign`)}
                      >
                        <MapPin size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="pagination-row">
          <span className="pagination-info">
            Showing {indexOfFirst + 1}–{Math.min(indexOfLast, filteredWardens.length)} of {filteredWardens.length} Wardens
          </span>
          <div className="pagination">
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              ‹
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                className={`pagination-number ${currentPage === i + 1 ? 'active' : ''}`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              ›
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="mobile-cards">
        {currentWardens.map((warden) => (
          <div key={warden.id} className="warden-mobile-card">
            <div className="mobile-card-header">
              <img src={warden.photo} alt={warden.name} className="mobile-avatar" />
              <div className="mobile-info">
                <h3>{warden.name}</h3>
                <p>{warden.email}</p>
              </div>
              <span
                className="status-badge"
                style={{
                  backgroundColor: `${getStatusColor(warden.status)}18`,
                  color: getStatusColor(warden.status),
                }}
              >
                {warden.status}
              </span>
            </div>
            <div className="mobile-card-details">
              <div className="detail-row"><span className="detail-label">Phone:</span><span>{warden.phone}</span></div>
              <div className="detail-row"><span className="detail-label">Block:</span><span>{warden.block}</span></div>
              <div className="detail-row"><span className="detail-label">Hostel:</span><span>{warden.hostel}</span></div>
            </div>
            <div className="mobile-card-actions">
              <button className="mobile-action-btn" onClick={() => navigate(`/admin/wardens/${warden.id}/edit`)}>
                <Eye size={16} /> View
              </button>
              <button className="mobile-action-btn" onClick={() => navigate(`/admin/wardens/${warden.id}/edit`)}>
                <Edit size={16} /> Edit
              </button>
              <button className="mobile-action-btn" onClick={() => navigate(`/admin/wardens/${warden.id}/assign`)}>
                <MapPin size={16} /> Assign
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WardensList;