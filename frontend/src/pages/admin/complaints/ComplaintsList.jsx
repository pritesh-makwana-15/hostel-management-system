// src/pages/admin/complaints/ComplaintsList.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Eye, UserCheck, MessageSquare, Edit3,
  Download, RotateCcw, SlidersHorizontal, ClipboardList,
  AlertCircle, Clock, CheckCircle2, Loader
} from 'lucide-react';
import { adminComplaintApi } from '../../../services/adminOtherApi';
import '../../../styles/admin/complaints/complaintsList.css';

const ComplaintsList = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ hostelBlock: '', complaintType: '', status: '', priority: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true);
        const res = await adminComplaintApi.getAll();
        if (res.data && res.data.data) {
          setComplaints(res.data.data);
          setError(null);
        } else {
          setError('No data received from server');
          setComplaints([]);
        }
      } catch (err) {
        console.error('Error fetching complaints:', {
          status: err.response?.status,
          statusText: err.response?.statusText,
          message: err.response?.data?.message || err.message,
          data: err.response?.data,
          url: err.config?.url,
        });
        const errorMsg = err.response?.data?.message || err.response?.statusText || err.message || 'Failed to fetch complaints';
        setError(`Error: ${errorMsg}`);
        setComplaints([]);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  const stats = {
    total: complaints.length,
    open: complaints.filter(c => c.status === 'Open').length,
    inProgress: complaints.filter(c => c.status === 'In Progress').length,
    resolved: complaints.filter(c => c.status === 'Resolved' || c.status === 'Closed').length,
  };

  const hostelBlocks = [...new Set(complaints.filter(c => c.hostelBlock).map(c => c.hostelBlock))];
  const complaintTypes = [...new Set(complaints.filter(c => c.category).map(c => c.category))];
  const statusOptions = ['Open',  'In Progress', 'Resolved', 'Closed'];
  const priorityOptions = ['High', 'Medium', 'Low'];

  const filtered = complaints.filter(c => {
    const q = searchTerm.toLowerCase();
    const matchSearch = c.studentName.toLowerCase().includes(q) || c.complaintCode.toLowerCase().includes(q) || c.roomNumber.toLowerCase().includes(q);
    const matchBlock = !filters.hostelBlock || c.hostelBlock === filters.hostelBlock;
    const matchType = !filters.complaintType || c.category === filters.complaintType;
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
    const show = (n) => pages.push(<button key={n} className={`cl-page-num ${currentPage === n ? 'active' : ''}`} onClick={() => setCurrentPage(n)}>{n}</button>);
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

  if (loading) {
    return (
      <div className="cl-page">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <Loader size={40} className="cl-spinner" style={{ animation: 'spin 1s linear infinite' }} />
          <span style={{ marginLeft: '10px' }}>Loading compl... ints...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="cl-page">
      <div className="cl-page-header">
        <div className="cl-page-header-left">
          <h1 className="cl-page-title">Complaints Management</h1>
          <div className="cl-breadcrumb">
            <span>Dashboard</span>
            <span className="cl-breadcrumb-sep">�</span>
            <span className="cl-breadcrumb-active">Complaints</span>
          </div>
        </div>
        <div className="cl-page-header-actions">
          <button className="cl-btn-secondary"><Download size={16} /> Export Data</button>
        </div>
      </div>

      {error && <div style={{ padding: '10px 15px', backgroundColor: '#fee', color: '#c33', borderRadius: '4px', marginBottom: '15px' }}>{error}</div>}

      <div className="cl-stats-grid">
        <div className="cl-stat-card">
          <div className="cl-stat-icon cl-stat-icon-blue"><ClipboardList size={22} /></div>
          <div className="cl-stat-info"><span className="cl-stat-label">Total Complaints</span><span className="cl-stat-value">{stats.total}</span></div>
        </div>
        <div className="cl-stat-card">
          <div className="cl-stat-icon cl-stat-icon-red"><AlertCircle size={22} /></div>
          <div className="cl-stat-info"><span className="cl-stat-label">Open Complaints</span><span className="cl-stat-value">{stats.open}</span></div>
        </div>
        <div className="cl-stat-card">
          <div className="cl-stat-icon cl-stat-icon-yellow"><Clock size={22} /></div>
          <div className="cl-stat-info"><span className="cl-stat-label">In Progress</span><span className="cl-stat-value">{stats.inProgress}</span></div>
        </div>
        <div className="cl-stat-card">
          <div className="cl-stat-icon cl-stat-icon-green"><CheckCircle2 size={22} /></div>
          <div className="cl-stat-info"><span className="cl-stat-label">Resolved</span><span className="cl-stat-value">{stats.resolved}</span></div>
        </div>
      </div>

      <div className="cl-filters-card">
        <div className="cl-filters-header"><SlidersHorizontal size={16} /><span>Filter Complaints</span></div>
        <div className="cl-search-row">
          <div className="cl-search-wrap">
            <Search size={18} className="cl-search-icon" />
            <input className="cl-search-input" placeholder="Search by student name, complaint ID, or room number..." value={searchTerm} onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }} />
          </div>
          <button className="cl-btn-secondary cl-reset-btn" onClick={handleReset}><RotateCcw size={15} /> Reset</button>
          <button className="cl-btn-primary">Apply Filters</button>
        </div>
        <div className="cl-dropdowns-row">
          <div className="cl-dropdown-group">
            <label className="cl-dropdown-label">HOSTEL / BLOCK</label>
            <select className="cl-filter-select" value={filters.hostelBlock} onChange={e => { setFilters({ ...filters, hostelBlock: e.target.value }); setCurrentPage(1); }}>
              <option value="">All Hostels</option>
              {hostelBlocks.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div className="cl-dropdown-group">
            <label className="cl-dropdown-label">COMPLAINT TYPE</label>
            <select className="cl-filter-select" value={filters.complaintType} onChange={e => { setFilters({ ...filters, complaintType: e.target.value }); setCurrentPage(1); }}>
              <option value="">All Types</option>
              {complaintTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="cl-dropdown-group">
            <label className="cl-dropdown-label">STATUS</label>
            <select className="cl-filter-select" value={filters.status} onChange={e => { setFilters({ ...filters, status: e.target.value }); setCurrentPage(1); }}>
              <option value="">All Status</option>
              {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="cl-dropdown-group">
            <label className="cl-dropdown-label">PRIORITY</label>
            <select className="cl-filter-select" value={filters.priority} onChange={e => { setFilters({ ...filters, priority: e.target.value }); setCurrentPage(1); }}>
              <option value="">All Priority</option>
              {priorityOptions.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="cl-table-card">
        <div className="cl-table-wrap">
          <table className="cl-table">
            <thead>
              <tr><th>ID</th><th>Student Name</th><th>Room</th><th>Type</th><th>Priority</th><th>Submitted</th><th>Assigned Warden</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {paginated.map(c => (
                <tr key={c.id}>
                  <td><span className="cl-complaint-id">{c.complaintCode}</span></td>
                  <td className="cl-student-name">{c.studentName}</td>
                  <td>{c.roomNumber}</td>
                  <td>{c.category}</td>
                  <td><span className={getPriorityClass(c.priority)}>{c.priority}</span></td>
                  <td className="cl-date">{c.submittedDate}</td>
                  <td className={c.assignedWardenName && c.assignedWardenName !== 'Not Assigned' ? '' : 'cl-not-assigned'}>{c.assignedWardenName || 'Not Assigned'}</td>
                  <td><span className={getStatusClass(c.status)}>{c.status}</span></td>
                  <td>
                    <div className="cl-actions">
                      <button className="cl-action-btn" title="View" onClick={() => navigate(`/admin/complaints/${c.id}`)}><Eye size={16} /></button>
                      <button className="cl-action-btn" title="Assign Warden" onClick={() => navigate(`/admin/complaints/assign/${c.id}`)}><UserCheck size={16} /></button>
                      <button className="cl-action-btn" title="Reply" onClick={() => navigate(`/admin/complaints/response/${c.id}`)}><MessageSquare size={16} /></button>
                      <button className="cl-action-btn" title="Update Status" onClick={() => navigate(`/admin/complaints/response/${c.id}`)}><Edit3 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && <tr><td colSpan={9} className="cl-empty">No complaints found matching your filters.</td></tr>}
            </tbody>
          </table>
        </div>

        <div className="cl-pagination">
          <span className="cl-pagination-info">Showing {filtered.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}�{Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length} complaints</span>
          <div className="cl-pagination-controls">
            <button className="cl-page-btn" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>�</button>
            {renderPageNumbers()}
            <button className="cl-page-btn" disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(p => p + 1)}>�</button>
          </div>
        </div>
      </div>

      <div className="cl-mobile-cards">
        {paginated.map(c => (
          <div key={c.id} className="cl-mobile-card">
            <div className="cl-mobile-card-header">
              <span className="cl-complaint-id">{c.complaintCode}</span>
              <span className={getStatusClass(c.status)}>{c.status}</span>
            </div>
            <div className="cl-mobile-card-body">
              <div className="cl-mobile-row"><span>Student</span><span>{c.studentName}</span></div>
              <div className="cl-mobile-row"><span>Room</span><span>{c.roomNumber}</span></div>
              <div className="cl-mobile-row"><span>Type</span><span>{c.category}</span></div>
              <div className="cl-mobile-row"><span>Priority</span><span className={getPriorityClass(c.priority)}>{c.priority}</span></div>
              <div className="cl-mobile-row"><span>Warden</span><span>{c.assignedWardenName || 'Not Assigned'}</span></div>
            </div>
            <div className="cl-mobile-card-actions">
              <button className="cl-mobile-action" onClick={() => navigate(`/admin/complaints/${c.id}`)}><Eye size={15} /> View</button>
              <button className="cl-mobile-action" onClick={() => navigate(`/admin/complaints/assign/${c.id}`)}><UserCheck size={15} /> Assign</button>
              <button className="cl-mobile-action" onClick={() => navigate(`/admin/complaints/response/${c.id}`)}><MessageSquare size={15} /> Reply</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComplaintsList;
