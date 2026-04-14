// src/pages/student/Complaints.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutGrid,
  Clock,
  Play,
  CheckCircle,
  Filter,
  Search,
  RefreshCw,
  MessageSquare,
  Paperclip,
  Download,
  Wrench,
  Zap,
  Wifi,
  Utensils,
  Brush,
  Package,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  complaintsData,
  getComplaintStats,
  statusOptions,
  priorityOptions,
  complaintTypes,
} from '../../../data/complaintsData';
import '../../../styles/student/complaints/complaints.css';

/* ── helpers ────────────────────────────────────────────── */
const getStatusClass = (status) => {
  const map = {
    'Open': 'status-open',
    'In Progress': 'status-in-progress',
    'Resolved': 'status-resolved',
    'Closed': 'status-closed',
    'Pending': 'status-pending',
    'Rejected': 'status-rejected',
  };
  return map[status] || 'status-open';
};

const getPriorityClass = (priority) => {
  const map = {
    High: 'priority-high',
    Medium: 'priority-medium',
    Low: 'priority-low',
  };
  return map[priority] || 'priority-medium';
};

const getCategoryIcon = (type) => {
  const map = {
    Plumbing: <Wrench size={14} />,
    Electrical: <Zap size={14} />,
    Internet: <Wifi size={14} />,
    'Mess / Food': <Utensils size={14} />,
    Cleaning: <Brush size={14} />,
    Furniture: <Package size={14} />,
  };
  return map[type] || <HelpCircle size={14} />;
};

/* ── Component ──────────────────────────────────────────── */
const Complaints = () => {
  const navigate = useNavigate();
  const stats = getComplaintStats();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [priorityFilter, setPriorityFilter] = useState('All Priority');
  const [filtered, setFiltered] = useState(complaintsData);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const applyFilters = () => {
    let result = [...complaintsData];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.id.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q) ||
          c.complaintType.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== 'All Status') result = result.filter((c) => c.status === statusFilter);
    if (categoryFilter !== 'All Categories') result = result.filter((c) => c.complaintType === categoryFilter);
    if (priorityFilter !== 'All Priority') result = result.filter((c) => c.priority === priorityFilter);
    setFiltered(result);
    setPage(1);
  };

  const handleReset = () => {
    setSearch('');
    setStatusFilter('All Status');
    setCategoryFilter('All Categories');
    setPriorityFilter('All Priority');
    setFiltered(complaintsData);
    setPage(1);
  };

  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const paginated = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <div className="complaints-page">
      {/* ── Header ── */}
      <div className="complaints-header">
        <div className="complaints-header-left">
          <h1>My Complaints</h1>
          <p>Track and manage your submitted hostel maintenance requests.</p>
        </div>
        <div className="complaints-header-actions">
          <button className="btn-secondary" onClick={() => {}}>
            <Download size={15} /> Export
          </button>
          <button className="btn-primary" onClick={() => navigate('/student/complaints/new')}>
            <span style={{ fontSize: 18, lineHeight: 1 }}>+</span> New Complaint
          </button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="complaints-stats">
        <div className="stat-card">
          <div className="stat-card-info">
            <label>Total Complaints</label>
            <div className="stat-number">{String(stats.total).padStart(2, '0')}</div>
          </div>
          <div className="stat-card-icon total"><LayoutGrid size={20} /></div>
        </div>
        <div className="stat-card">
          <div className="stat-card-info">
            <label>Open</label>
            <div className="stat-number">{String(stats.open).padStart(2, '0')}</div>
          </div>
          <div className="stat-card-icon open"><Clock size={20} /></div>
        </div>
        <div className="stat-card">
          <div className="stat-card-info">
            <label>In Progress</label>
            <div className="stat-number">{String(stats.inProgress).padStart(2, '0')}</div>
          </div>
          <div className="stat-card-icon progress"><Play size={20} /></div>
        </div>
        <div className="stat-card">
          <div className="stat-card-info">
            <label>Resolved Today</label>
            <div className="stat-number">{String(stats.resolved).padStart(2, '0')}</div>
          </div>
          <div className="stat-card-icon resolved"><CheckCircle size={20} /></div>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="complaints-filter-bar">
        <div className="filter-bar-title">
          <Filter size={15} /> Filter Complaints
        </div>
        <div className="filter-bar-row">
          <div className="filter-input-wrap">
            <Search size={15} className="filter-icon" />
            <input
              type="text"
              placeholder="Search by ID, title, or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option>All Status</option>
            {statusOptions.map((s) => <option key={s}>{s}</option>)}
          </select>
          <select
            className="filter-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option>All Categories</option>
            {complaintTypes.map((t) => <option key={t}>{t}</option>)}
          </select>
          <select
            className="filter-select"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option>All Priority</option>
            {priorityOptions.map((p) => <option key={p}>{p}</option>)}
          </select>
          <div className="filter-actions">
            <button className="btn-reset" onClick={handleReset}>
              <RefreshCw size={14} /> Reset
            </button>
            <button className="btn-apply" onClick={applyFilters}>
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="complaints-table-card">
        <div className="complaints-table-wrap">
          <table className="complaints-table">
            <thead>
              <tr>
                <th>Complaint ID</th>
                <th>Complaint Title</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Submitted Date</th>
                <th>Assigned Warden</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <div className="empty-state">
                      <MessageSquare size={40} />
                      <p>No complaints found matching your filters.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <span
                        className="complaint-id-link"
                        onClick={() => navigate(`/student/complaints/${c.id}`)}
                      >
                        #{c.id}
                      </span>
                    </td>
                    <td>
                      <div className="complaint-title-cell">
                        <div className="title">{c.category}</div>
                        <div className="meta">
                          <span><MessageSquare size={11} /> {c.timeline.length}</span>
                          <span><Paperclip size={11} /> {c.attachments.length}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="category-cell">
                        <span className="category-icon">{getCategoryIcon(c.complaintType)}</span>
                        {c.complaintType}
                      </div>
                    </td>
                    <td>
                      <span className={`priority-badge ${getPriorityClass(c.priority)}`}>
                        {c.priority}
                      </span>
                    </td>
                    <td>{new Date(c.submittedDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                    <td>{c.assignedWarden || <span style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>Waiting...</span>}</td>
                    <td>
                      <span className={`status-badge ${getStatusClass(c.status)}`}>
                        {c.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="view-details-btn"
                        onClick={() => navigate(`/student/complaints/${c.id}`)}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        <div className="complaints-pagination">
          <div className="pagination-info">
            <span>Rows per page:</span>
            <select
              className="rows-select"
              value={rowsPerPage}
              onChange={(e) => { setRowsPerPage(Number(e.target.value)); setPage(1); }}
            >
              {[5, 10, 20].map((n) => <option key={n}>{n}</option>)}
            </select>
            <span>
              Showing {filtered.length === 0 ? 0 : (page - 1) * rowsPerPage + 1}–
              {Math.min(page * rowsPerPage, filtered.length)} of {filtered.length} complaints
            </span>
          </div>
          <div className="pagination-controls">
            <button className="page-btn" onClick={() => setPage(1)} disabled={page === 1}>«</button>
            <button className="page-btn" onClick={() => setPage((p) => p - 1)} disabled={page === 1}>
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                className={`page-btn ${page === p ? 'active' : ''}`}
                onClick={() => setPage(p)}
              >
                {p}
              </button>
            ))}
            <button className="page-btn" onClick={() => setPage((p) => p + 1)} disabled={page === totalPages || totalPages === 0}>
              <ChevronRight size={14} />
            </button>
            <button className="page-btn" onClick={() => setPage(totalPages)} disabled={page === totalPages || totalPages === 0}>»</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Complaints;