// src/pages/admin/complaints/ComplaintsList.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Plus, Eye, UserCheck, MessageSquare, Edit3,
  Download, RotateCcw, SlidersHorizontal, ClipboardList,
  AlertCircle, Clock, CheckCircle2, X
} from 'lucide-react';
import {
  complaintsData,
  hostelBlocks,
  complaintTypes,
  statusOptions,
  priorityOptions,
  getComplaintStats,
} from '../../../data/complaintsData';
import '../../../styles/admin/complaints/complaintsList.css';

// ── Add Complaint Modal ──────────────────────────────────────
const AddComplaintModal = ({ onClose }) => {
  const [form, setForm] = useState({
    studentName: '', studentId: '', roomNumber: '',
    hostelBlock: '', complaintType: '', priority: '', description: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: API call
    alert('Complaint added successfully!');
    onClose();
  };

  return (
    <div className="cl-modal-overlay" onClick={onClose}>
      <div className="cl-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cl-modal-header">
          <h2 className="cl-modal-title">Add New Complaint</h2>
          <button className="cl-modal-close" onClick={onClose}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="cl-modal-body">
          <div className="cl-form-grid">
            <div className="cl-form-group">
              <label className="cl-form-label">Student Name</label>
              <input className="cl-form-input" placeholder="Enter student name"
                value={form.studentName} onChange={e => setForm({ ...form, studentName: e.target.value })} required />
            </div>
            <div className="cl-form-group">
              <label className="cl-form-label">Student ID</label>
              <input className="cl-form-input" placeholder="e.g. STU-2291"
                value={form.studentId} onChange={e => setForm({ ...form, studentId: e.target.value })} required />
            </div>
            <div className="cl-form-group">
              <label className="cl-form-label">Room Number</label>
              <input className="cl-form-input" placeholder="e.g. A-101"
                value={form.roomNumber} onChange={e => setForm({ ...form, roomNumber: e.target.value })} required />
            </div>
            <div className="cl-form-group">
              <label className="cl-form-label">Hostel / Block</label>
              <select className="cl-form-input" value={form.hostelBlock}
                onChange={e => setForm({ ...form, hostelBlock: e.target.value })} required>
                <option value="">Select Block</option>
                {hostelBlocks.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div className="cl-form-group">
              <label className="cl-form-label">Complaint Type</label>
              <select className="cl-form-input" value={form.complaintType}
                onChange={e => setForm({ ...form, complaintType: e.target.value })} required>
                <option value="">Select Type</option>
                {complaintTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="cl-form-group">
              <label className="cl-form-label">Priority</label>
              <select className="cl-form-input" value={form.priority}
                onChange={e => setForm({ ...form, priority: e.target.value })} required>
                <option value="">Select Priority</option>
                {priorityOptions.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="cl-form-group cl-form-group-full">
              <label className="cl-form-label">Description</label>
              <textarea className="cl-form-input cl-form-textarea"
                placeholder="Describe the complaint in detail..."
                rows={4} value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })} required />
            </div>
          </div>
          <div className="cl-modal-actions">
            <button type="button" className="cl-btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="cl-btn-primary"><Plus size={16} /> Add Complaint</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ── Main Component ───────────────────────────────────────────
const ComplaintsList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ hostelBlock: '', complaintType: '', status: '', priority: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const itemsPerPage = 6;

  const stats = getComplaintStats();

  const filtered = complaintsData.filter(c => {
    const q = searchTerm.toLowerCase();
    const matchSearch =
      c.studentName.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q) ||
      c.roomNumber.toLowerCase().includes(q);
    const matchBlock = !filters.hostelBlock || c.hostelBlock === filters.hostelBlock;
    const matchType = !filters.complaintType || c.complaintType === filters.complaintType;
    const matchStatus = !filters.status || c.status === filters.status;
    const matchPriority = !filters.priority || c.priority === filters.priority;
    return matchSearch && matchBlock && matchType && matchStatus && matchPriority;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleReset = () => {
    setSearchTerm('');
    setFilters({ hostelBlock: '', complaintType: '', status: '', priority: '' });
    setCurrentPage(1);
  };

  const getPriorityClass = (p) => {
    if (p === 'High') return 'cl-badge-priority cl-priority-high';
    if (p === 'Medium') return 'cl-badge-priority cl-priority-medium';
    return 'cl-badge-priority cl-priority-low';
  };

  const getStatusClass = (s) => {
    if (s === 'Open') return 'cl-badge-status cl-status-open';
    if (s === 'In Progress') return 'cl-badge-status cl-status-inprogress';
    if (s === 'Resolved') return 'cl-badge-status cl-status-resolved';
    return 'cl-badge-status cl-status-closed';
  };

  const renderPageNumbers = () => {
    const pages = [];
    const show = (n) => pages.push(
      <button key={n} className={`cl-page-num ${currentPage === n ? 'active' : ''}`}
        onClick={() => setCurrentPage(n)}>{n}</button>
    );
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) show(i);
    } else {
      show(1);
      if (currentPage > 3) pages.push(<span key="l-ellipsis" className="cl-page-ellipsis">...</span>);
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) show(i);
      if (currentPage < totalPages - 2) pages.push(<span key="r-ellipsis" className="cl-page-ellipsis">...</span>);
      show(totalPages);
    }
    return pages;
  };

  return (
    <div className="cl-page">
      {/* Header */}
      <div className="cl-page-header">
        <div className="cl-page-header-left">
          <h1 className="cl-page-title">Complaints Management</h1>
          <div className="cl-breadcrumb">
            <span>Dashboard</span>
            <span className="cl-breadcrumb-sep">›</span>
            <span className="cl-breadcrumb-active">Complaints</span>
          </div>
        </div>
        <div className="cl-page-header-actions">
          <button className="cl-btn-secondary"><Download size={16} /> Export Data</button>
          <button className="cl-btn-primary" onClick={() => setShowModal(true)}><Plus size={16} /> Add Complaint</button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="cl-stats-grid">
        <div className="cl-stat-card">
          <div className="cl-stat-icon cl-stat-icon-blue"><ClipboardList size={22} /></div>
          <div className="cl-stat-info">
            <span className="cl-stat-label">Total Complaints</span>
            <span className="cl-stat-value">{stats.total}</span>
          </div>
        </div>
        <div className="cl-stat-card">
          <div className="cl-stat-icon cl-stat-icon-red"><AlertCircle size={22} /></div>
          <div className="cl-stat-info">
            <span className="cl-stat-label">Open Complaints</span>
            <span className="cl-stat-value">{stats.open}</span>
          </div>
        </div>
        <div className="cl-stat-card">
          <div className="cl-stat-icon cl-stat-icon-yellow"><Clock size={22} /></div>
          <div className="cl-stat-info">
            <span className="cl-stat-label">In Progress</span>
            <span className="cl-stat-value">{stats.inProgress}</span>
          </div>
        </div>
        <div className="cl-stat-card">
          <div className="cl-stat-icon cl-stat-icon-green"><CheckCircle2 size={22} /></div>
          <div className="cl-stat-info">
            <span className="cl-stat-label">Resolved Today</span>
            <span className="cl-stat-value">{stats.resolved}</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="cl-filters-card">
        <div className="cl-filters-header">
          <SlidersHorizontal size={16} />
          <span>Filter Complaints</span>
        </div>
        <div className="cl-search-row">
          <div className="cl-search-wrap">
            <Search size={18} className="cl-search-icon" />
            <input className="cl-search-input" placeholder="Search by student name, complaint ID, or room number..."
              value={searchTerm} onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }} />
          </div>
          <button className="cl-btn-secondary cl-reset-btn" onClick={handleReset}><RotateCcw size={15} /> Reset</button>
          <button className="cl-btn-primary">Apply Filters</button>
        </div>
        <div className="cl-dropdowns-row">
          <div className="cl-dropdown-group">
            <label className="cl-dropdown-label">HOSTEL / BLOCK</label>
            <select className="cl-filter-select" value={filters.hostelBlock}
              onChange={e => { setFilters({ ...filters, hostelBlock: e.target.value }); setCurrentPage(1); }}>
              <option value="">All Hostels</option>
              {hostelBlocks.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div className="cl-dropdown-group">
            <label className="cl-dropdown-label">COMPLAINT TYPE</label>
            <select className="cl-filter-select" value={filters.complaintType}
              onChange={e => { setFilters({ ...filters, complaintType: e.target.value }); setCurrentPage(1); }}>
              <option value="">All Types</option>
              {complaintTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="cl-dropdown-group">
            <label className="cl-dropdown-label">STATUS</label>
            <select className="cl-filter-select" value={filters.status}
              onChange={e => { setFilters({ ...filters, status: e.target.value }); setCurrentPage(1); }}>
              <option value="">All Status</option>
              {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="cl-dropdown-group">
            <label className="cl-dropdown-label">PRIORITY</label>
            <select className="cl-filter-select" value={filters.priority}
              onChange={e => { setFilters({ ...filters, priority: e.target.value }); setCurrentPage(1); }}>
              <option value="">All Priority</option>
              {priorityOptions.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="cl-table-card">
        <div className="cl-table-wrap">
          <table className="cl-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Student Name</th>
                <th>Room</th>
                <th>Type</th>
                <th>Priority</th>
                <th>Submitted</th>
                <th>Assigned Warden</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(c => (
                <tr key={c.id}>
                  <td><span className="cl-complaint-id">{c.id}</span></td>
                  <td className="cl-student-name">{c.studentName}</td>
                  <td>{c.roomNumber}</td>
                  <td>{c.complaintType}</td>
                  <td><span className={getPriorityClass(c.priority)}>{c.priority}</span></td>
                  <td className="cl-date">{c.submittedDate}</td>
                  <td className={c.assignedWarden ? '' : 'cl-not-assigned'}>
                    {c.assignedWarden || 'Not Assigned'}
                  </td>
                  <td><span className={getStatusClass(c.status)}>{c.status}</span></td>
                  <td>
                    <div className="cl-actions">
                      <button className="cl-action-btn" title="View" onClick={() => navigate(`/admin/complaints/${c.id}`)}><Eye size={16} /></button>
                      <button className="cl-action-btn" title="Assign Warden" onClick={() => navigate(`/admin/complaints/${c.id}/assign`)}><UserCheck size={16} /></button>
                      <button className="cl-action-btn" title="Reply" onClick={() => navigate(`/admin/complaints/${c.id}/response`)}><MessageSquare size={16} /></button>
                      <button className="cl-action-btn" title="Update Status" onClick={() => navigate(`/admin/complaints/${c.id}/response`)}><Edit3 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr><td colSpan={9} className="cl-empty">No complaints found matching your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="cl-pagination">
          <span className="cl-pagination-info">
            Showing {filtered.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length} complaints
          </span>
          <div className="cl-pagination-controls">
            <button className="cl-page-btn" disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}>‹</button>
            {renderPageNumbers()}
            <button className="cl-page-btn" disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(p => p + 1)}>›</button>
          </div>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="cl-mobile-cards">
        {paginated.map(c => (
          <div key={c.id} className="cl-mobile-card">
            <div className="cl-mobile-card-header">
              <span className="cl-complaint-id">{c.id}</span>
              <span className={getStatusClass(c.status)}>{c.status}</span>
            </div>
            <div className="cl-mobile-card-body">
              <div className="cl-mobile-row"><span>Student</span><span>{c.studentName}</span></div>
              <div className="cl-mobile-row"><span>Room</span><span>{c.roomNumber}</span></div>
              <div className="cl-mobile-row"><span>Type</span><span>{c.complaintType}</span></div>
              <div className="cl-mobile-row"><span>Priority</span><span className={getPriorityClass(c.priority)}>{c.priority}</span></div>
              <div className="cl-mobile-row"><span>Warden</span><span>{c.assignedWarden || 'Not Assigned'}</span></div>
            </div>
            <div className="cl-mobile-card-actions">
              <button className="cl-mobile-action" onClick={() => navigate(`/admin/complaints/${c.id}`)}><Eye size={15} /> View</button>
              <button className="cl-mobile-action" onClick={() => navigate(`/admin/complaints/${c.id}/assign`)}><UserCheck size={15} /> Assign</button>
              <button className="cl-mobile-action" onClick={() => navigate(`/admin/complaints/${c.id}/response`)}><MessageSquare size={15} /> Reply</button>
            </div>
          </div>
        ))}
      </div>

      {showModal && <AddComplaintModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default ComplaintsList;