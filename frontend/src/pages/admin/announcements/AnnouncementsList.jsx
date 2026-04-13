// src/pages/admin/announcements/AnnouncementsList.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Search, Eye, Edit, Send, Trash2,
  RotateCcw, Filter, Download,
  Megaphone, Radio, Calendar
} from 'lucide-react';
import '../../../styles/admin/announcements/announcementsList.css';

const AnnouncementsList = () => {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [idFilter, setIdFilter] = useState('');
  const [audienceFilter, setAudienceFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const perPage = 5;

  // Fetch announcements from backend
  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      setError('');
      
      const token = localStorage.getItem('hms_token');
      const response = await fetch('http://localhost:8080/api/announcements/all', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.data) {
          setAnnouncements(data.data);
        }
      } else {
        setError('Failed to fetch announcements');
      }
    } catch (err) {
      console.error('Error fetching announcements:', err);
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  // Status logic based on dates
  const getAnnouncementStatus = (announcement) => {
    const now = new Date();
    const publishDate = announcement.publishDate ? new Date(announcement.publishDate) : null;
    const expiryDate = announcement.expiryDate ? new Date(announcement.expiryDate) : null;

    if (publishDate && now < publishDate) {
      return 'Scheduled';
    } else if (expiryDate && now > expiryDate) {
      return 'Expired';
    } else {
      return 'Active';
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Filter announcements
  const filtered = announcements.filter((a) => {
    const status = getAnnouncementStatus(a);
    const searchValue = search.toLowerCase();
    const matchSearch =
      a.title.toLowerCase().includes(searchValue) ||
      a.id.toString().toLowerCase().includes(searchValue);

    const idValue = idFilter.trim().toLowerCase().replace(/^ann-/, '');
    const matchId =
      idValue === '' ||
      a.id.toString().toLowerCase().includes(idValue);

    const matchAudience = audienceFilter === 'All' || a.audience === audienceFilter;
    const matchStatus = statusFilter === 'All' || status === statusFilter;
    return matchSearch && matchId && matchAudience && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  // Calculate stats
  const stats = {
    total: announcements.length,
    active: announcements.filter(a => getAnnouncementStatus(a) === 'Active').length,
    scheduled: announcements.filter(a => getAnnouncementStatus(a) === 'Scheduled').length
  };

  const handleReset = () => {
    setSearch('');
    setIdFilter('');
    setAudienceFilter('All');
    setStatusFilter('All');
    setCurrentPage(1);
  };

  const handleApplyFilters = () => {
    setCurrentPage(1);
  };

  const handleDeleteClick = (ann) => {
    setDeleteTarget(ann);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      const token = localStorage.getItem('hms_token');
      const response = await fetch(`http://localhost:8080/api/announcements/${deleteTarget.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setAnnouncements(prev => prev.filter(a => a.id !== deleteTarget.id));
        setToastMessage('Announcement deleted successfully');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      } else {
        setToastMessage('Failed to delete announcement');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
    } catch (err) {
      console.error('Error deleting announcement:', err);
      setToastMessage('Error connecting to server');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }

    setShowDeleteModal(false);
    setDeleteTarget(null);
  };

  const handleExport = () => {
    const csvContent = [
      ['ID', 'Title', 'Audience', 'Created By', 'Publish Date', 'Expiry Date', 'Status'],
      ...filtered.map(a => [
        `ANN-${a.id}`,
        a.title,
        a.audience,
        a.createdBy || 'Admin',
        formatDate(a.publishDate),
        formatDate(a.expiryDate),
        getAnnouncementStatus(a)
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'announcements.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusClass = (s) => {
    if (s === 'Active') return 'al-status-active';
    if (s === 'Scheduled') return 'al-status-scheduled';
    return 'al-status-expired';
  };

  const getAudienceBadge = (a) => {
    if (a === 'Students') return 'al-audience-students';
    if (a === 'Wardens') return 'al-audience-wardens';
    return 'al-audience-all';
  };

  return (
    <div className="al-page">
      {/* Toast */}
      {showToast && (
        <div className="al-toast">
          <span>×</span> {toastMessage}
          <button onClick={() => setShowToast(false)}>×</button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="al-loading">
          <div className="al-loading-spinner"></div>
          <p>Loading announcements...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="al-error">
          <p>{error}</p>
        </div>
      )}

      {/* Header */}
      <div className="al-header">
        <div className="al-header-left">
          <div className="al-breadcrumb">
            <span>Dashboard</span><span className="al-sep">›</span>
            <span className="al-breadcrumb-active">Announcements</span>
          </div>
          <h1 className="al-title">Announcements</h1>
        </div>
        <button className="al-btn-primary" onClick={() => navigate('/admin/announcements/create')}>
          <Plus size={18} /> Create Announcement
        </button>
      </div>

      {/* Stats */}
      <div className="al-stats-grid">
        <div className="al-stat-card">
          <div className="al-stat-icon al-icon-blue"><Megaphone size={22} /></div>
          <div className="al-stat-body">
            <div className="al-stat-label">Total Announcements</div>
            <div className="al-stat-value">{stats.total}</div>
          </div>
        </div>
        <div className="al-stat-card">
          <div className="al-stat-icon al-icon-green"><Radio size={22} /></div>
          <div className="al-stat-body">
            <div className="al-stat-label">Active Announcements</div>
            <div className="al-stat-value">{stats.active}</div>
          </div>
        </div>
        <div className="al-stat-card">
          <div className="al-stat-icon al-icon-orange"><Calendar size={22} /></div>
          <div className="al-stat-body">
            <div className="al-stat-label">Scheduled Announcements</div>
            <div className="al-stat-value">{stats.scheduled}</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="al-filters-card">
        <div className="al-filters-header">
          <Filter size={16} /> Advanced Filters
        </div>
        <div className="al-filters-row">
          <div className="al-search-wrap">
            <Search size={16} className="al-search-icon" />
            <input
              className="al-search-input"
              type="text"
              placeholder="Search announcement title or ID..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            />
          </div>
          <input
            className="al-filter-input"
            type="text"
            placeholder="Announcement ID (e.g. ANN-001)"
            value={idFilter}
            onChange={(e) => { setIdFilter(e.target.value); setCurrentPage(1); }}
          />
          <select
            className="al-filter-select"
            value={audienceFilter}
            onChange={(e) => { setAudienceFilter(e.target.value); setCurrentPage(1); }}
          >
            <option value="All">All Audience</option>
            <option value="Students">Students</option>
            <option value="Wardens">Wardens</option>
            <option value="Both">Both</option>
          </select>
          <select
            className="al-filter-select"
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Expired">Expired</option>
          </select>
          <button className="al-btn-primary al-apply-btn" onClick={handleApplyFilters}>Apply Filters</button>
          <button className="al-btn-secondary" onClick={handleReset}>
            <RotateCcw size={14} /> Reset
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="al-table-card">
        <div className="al-table-header-row">
          <h2 className="al-table-title">Announcement Records</h2>
          <div className="al-table-actions">
            <button className="al-btn-secondary al-sm" onClick={handleExport}><Download size={14} /> Export Data</button>
          </div>
        </div>
        <div className="al-table-wrap">
          <table className="al-table">
            <thead>
              <tr>
                <th>Announcement ID</th>
                <th>Title</th>
                <th>Audience</th>
                <th>Created By</th>
                <th>Publish Date</th>
                <th>Expiry Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr><td colSpan={8} className="al-empty">No announcements found.</td></tr>
              ) : paginated.map((a) => {
                const status = getAnnouncementStatus(a);
                return (
                <tr key={a.id}>
                  <td className="al-id">ANN-{a.id}</td>
                  <td className="al-title-cell">{a.title}</td>
                  <td><span className={`al-audience-badge ${getAudienceBadge(a.audience)}`}>{a.audience}</span></td>
                  <td className="al-created-by">{a.createdBy || 'Admin'}</td>
                  <td>{formatDate(a.publishDate)}</td>
                  <td>{formatDate(a.expiryDate)}</td>
                  <td><span className={`al-status-badge ${getStatusClass(status)}`}>{status}</span></td>
                  <td>
                    <div className="al-actions">
                      <button className="al-action-btn" title="View" onClick={() => navigate(`/admin/announcements/edit/${a.id}`)}>
                        <Eye size={15} />
                      </button>
                      <button className="al-action-btn" title="Edit" onClick={() => navigate(`/admin/announcements/edit/${a.id}`)}>
                        <Edit size={15} />
                      </button>
                      <button className="al-action-btn" title="Broadcast" onClick={() => navigate(`/admin/announcements/broadcast/${a.id}`)}>
                        <Send size={15} />
                      </button>
                      <button className="al-action-btn al-action-delete" title="Delete" onClick={() => handleDeleteClick(a)}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="al-pagination">
          <span className="al-page-info">
            Showing {filtered.length === 0 ? 0 : (currentPage - 1) * perPage + 1}–{Math.min(currentPage * perPage, filtered.length)} of {filtered.length} announcements
          </span>
          <div className="al-page-controls">
            <button className="al-page-btn" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>Previous</button>
            {[...Array(totalPages)].map((_, i) => (
              <button key={i} className={`al-page-num ${currentPage === i + 1 ? 'active' : ''}`} onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
            ))}
            {totalPages > 4 && <span className="al-page-ellipsis">...</span>}
            <button className="al-page-btn" disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(p => p + 1)}>Next</button>
          </div>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="al-mobile-cards">
        {paginated.map((a) => {
          const status = getAnnouncementStatus(a);
          return (
          <div key={a.id} className="al-mobile-card">
            <div className="al-mobile-card-top">
              <span className="al-id">ANN-{a.id}</span>
              <span className={`al-status-badge ${getStatusClass(status)}`}>{status}</span>
            </div>
            <div className="al-mobile-card-title">{a.title}</div>
            <div className="al-mobile-card-meta">
              <span className={`al-audience-badge ${getAudienceBadge(a.audience)}`}>{a.audience}</span>
              <span className="al-mobile-date">{formatDate(a.publishDate)}</span>
            </div>
            <div className="al-mobile-card-actions">
              <button className="al-mobile-action" onClick={() => navigate(`/admin/announcements/edit/${a.id}`)}>
                <Eye size={15} /> View
              </button>
              <button className="al-mobile-action" onClick={() => navigate(`/admin/announcements/edit/${a.id}`)}>
                <Edit size={15} /> Edit
              </button>
              <button className="al-mobile-action" onClick={() => navigate(`/admin/announcements/broadcast/${a.id}`)}>
                <Send size={15} /> Broadcast
              </button>
              <button className="al-mobile-action al-mobile-delete" onClick={() => handleDeleteClick(a)}>
                <Trash2 size={15} /> Delete
              </button>
            </div>
          </div>
          );
        })}
      </div>

      {/* Delete Modal */}
      {showDeleteModal && deleteTarget && (
        <div className="al-modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="al-modal" onClick={(e) => e.stopPropagation()}>
            <button className="al-modal-close" onClick={() => setShowDeleteModal(false)}>✕</button>
            <div className="al-modal-icon">!</div>
            <h2 className="al-modal-title">Delete Announcement?</h2>
            <p className="al-modal-text">
              Are you sure you want to delete <strong>{deleteTarget.id}</strong>? This action is permanent and will remove the announcement from all recipient feeds.
            </p>
            <div className="al-modal-actions">
              <button className="al-btn-secondary al-modal-cancel" onClick={() => setShowDeleteModal(false)}>Cancel</button>
              <button className="al-btn-delete" onClick={handleConfirmDelete}>Confirm Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnnouncementsList;