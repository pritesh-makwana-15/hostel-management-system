// src/pages/warden/complaints/WardenComplaints.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Eye, Edit3, MoreVertical, Download, Plus,
  Search, RotateCcw, SlidersHorizontal,
  ClipboardList, Clock, CheckCircle2, ChevronLeft, ChevronRight
} from 'lucide-react';
import { complaintsData, hostelBlocks, statusOptions, getComplaintStats } from '../../../data/complaintsData';
import '../../../styles/warden/complaints/complaints.css';

const WardenComplaints = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [blockFilter, setBlockFilter] = useState('');
  const [dateRange, setDateRange] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenu, setOpenMenu] = useState(null);
  const itemsPerPage = 6;

  const stats = getComplaintStats();

  const filtered = complaintsData.filter(c => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      c.studentName.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q) ||
      c.roomNumber.toLowerCase().includes(q);
    const matchStatus = !statusFilter || c.status === statusFilter;
    const matchBlock = !blockFilter || c.hostelBlock === blockFilter;
    return matchSearch && matchStatus && matchBlock;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleReset = () => {
    setSearch('');
    setStatusFilter('');
    setBlockFilter('');
    setDateRange('');
    setCurrentPage(1);
  };

  const getStatusClass = (s) => {
    if (s === 'Open') return 'wc-badge wc-badge-pending';
    if (s === 'In Progress') return 'wc-badge wc-badge-inprogress';
    if (s === 'Resolved') return 'wc-badge wc-badge-resolved';
    return 'wc-badge wc-badge-closed';
  };

  const getStatusLabel = (s) => {
    if (s === 'Open') return 'Pending';
    return s;
  };

  const renderPages = () => {
    const pages = [];
    const addPage = (n) => pages.push(
      <button
        key={n}
        className={`wc-page-num ${currentPage === n ? 'active' : ''}`}
        onClick={() => setCurrentPage(n)}
      >{n}</button>
    );
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) addPage(i);
    } else {
      addPage(1); addPage(2); addPage(3);
      pages.push(<span key="e" className="wc-page-ellipsis">...</span>);
      addPage(totalPages);
    }
    return pages;
  };

  // Complaint title from type
  const getComplaintTitle = (c) => {
    const map = {
      'Plumbing': 'Plumbing Leak in Washroom',
      'Electrical': 'Broken Ceiling Fan',
      'Internet': 'Wi-Fi Connection Issues',
      'Furniture': 'Bed Frame Repair',
      'Cleaning': 'Hygiene Issue in Bathroom',
    };
    return map[c.complaintType] || c.complaintType + ' Issue';
  };

  return (
    <div className="wc-page">
      {/* Header */}
      <div className="wc-header">
        <div className="wc-header-left">
          <div className="wc-breadcrumb">
            <span>Dashboard</span>
            <span className="wc-breadcrumb-sep">›</span>
            <span className="wc-breadcrumb-active">Complaints</span>
          </div>
          <h1 className="wc-title">Complaints Management</h1>
        </div>
        <div className="wc-header-actions">
          <button className="wc-btn-outline">
            <Download size={15} /> Export Data
          </button>
          <button className="wc-btn-primary" onClick={() => {}}>
            <Plus size={15} /> Add Complaint
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="wc-stats-grid">
        <div className="wc-stat-card">
          <div className="wc-stat-info">
            <span className="wc-stat-label">Total Complaints</span>
            <span className="wc-stat-value">{stats.total}</span>
          </div>
          <div className="wc-stat-icon wc-icon-blue">
            <ClipboardList size={22} />
          </div>
        </div>
        <div className="wc-stat-card">
          <div className="wc-stat-info">
            <span className="wc-stat-label">Pending Complaints</span>
            <span className="wc-stat-value">{stats.open}</span>
          </div>
          <div className="wc-stat-icon wc-icon-orange">
            <Clock size={22} />
          </div>
        </div>
        <div className="wc-stat-card">
          <div className="wc-stat-info">
            <span className="wc-stat-label">Resolved Today</span>
            <span className="wc-stat-value">{stats.resolved}</span>
          </div>
          <div className="wc-stat-icon wc-icon-teal">
            <CheckCircle2 size={22} />
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="wc-filter-card">
        <div className="wc-filter-header">
          <SlidersHorizontal size={15} />
          <span>Filter Complaints</span>
        </div>
        <div className="wc-filter-row">
          <div className="wc-filter-group">
            <label className="wc-filter-label">SEARCH</label>
            <div className="wc-search-wrap">
              <Search size={15} className="wc-search-icon" />
              <input
                className="wc-search-input"
                placeholder="Student, ID, or room..."
                value={search}
                onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
              />
            </div>
          </div>
          <div className="wc-filter-group">
            <label className="wc-filter-label">STATUS</label>
            <select
              className="wc-filter-select"
              value={statusFilter}
              onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            >
              <option value="">All Status</option>
              {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="wc-filter-group">
            <label className="wc-filter-label">BLOCK / HOSTEL</label>
            <select
              className="wc-filter-select"
              value={blockFilter}
              onChange={e => { setBlockFilter(e.target.value); setCurrentPage(1); }}
            >
              <option value="">All Blocks</option>
              {hostelBlocks.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div className="wc-filter-group">
            <label className="wc-filter-label">DATE RANGE</label>
            <div className="wc-date-wrap">
              <input
                type="text"
                className="wc-filter-select"
                placeholder="Pick a date range"
                value={dateRange}
                onChange={e => setDateRange(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="wc-filter-actions">
          <button className="wc-btn-outline wc-reset-btn" onClick={handleReset}>
            <RotateCcw size={14} /> Reset
          </button>
          <button className="wc-btn-primary">Apply Filters</button>
        </div>
      </div>

      {/* Table */}
      <div className="wc-table-card">
        <div className="wc-table-wrap">
          <table className="wc-table">
            <thead>
              <tr>
                <th>Complaint ID</th>
                <th>Student Name</th>
                <th>Room</th>
                <th>Complaint Title</th>
                <th>Date Filed</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(c => (
                <tr key={c.id}>
                  <td>
                    <span
                      className="wc-complaint-id"
                      onClick={() => navigate(`/warden/complaints/view/${c.id}`)}
                    >
                      #{c.id}
                    </span>
                  </td>
                  <td className="wc-student-name">{c.studentName}</td>
                  <td>{c.roomNumber}</td>
                  <td className="wc-complaint-title">{getComplaintTitle(c)}</td>
                  <td className="wc-date">{c.submittedDate}</td>
                  <td>
                    <span className={getStatusClass(c.status)}>
                      {getStatusLabel(c.status)}
                    </span>
                  </td>
                  <td>
                    <div className="wc-actions">
                      <button
                        className="wc-action-btn"
                        title="View"
                        onClick={() => navigate(`/warden/complaints/view/${c.id}`)}
                      >
                        <Eye size={16} />
                      </button>
                      <button className="wc-action-btn" title="Edit">
                        <Edit3 size={16} />
                      </button>
                      <div className="wc-more-wrap">
                        <button
                          className="wc-action-btn"
                          title="More"
                          onClick={() => setOpenMenu(openMenu === c.id ? null : c.id)}
                        >
                          <MoreVertical size={16} />
                        </button>
                        {openMenu === c.id && (
                          <div className="wc-more-menu">
                            <button onClick={() => { navigate(`/warden/complaints/view/${c.id}`); setOpenMenu(null); }}>View Details</button>
                            <button onClick={() => setOpenMenu(null)}>Update Status</button>
                            <button onClick={() => setOpenMenu(null)}>Assign Warden</button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={7} className="wc-empty">No complaints found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="wc-pagination">
          <span className="wc-pagination-info">
            Showing {filtered.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length} complaints
          </span>
          <div className="wc-pagination-controls">
            <button
              className="wc-page-arrow"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
            >
              <ChevronLeft size={16} />
            </button>
            {renderPages()}
            <button
              className="wc-page-arrow"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="wc-footer">
        © 2024 Warden Complaints Management System • HMS v2.4.0
        <span className="wc-footer-links">
          <a href="#">Support</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </span>
      </div>
    </div>
  );
};

export default WardenComplaints;