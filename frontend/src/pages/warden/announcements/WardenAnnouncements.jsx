// src/pages/warden/announcements/WardenAnnouncements.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Megaphone, Radio, Archive, RefreshCw, Download, X } from 'lucide-react';
import { wardenApi } from '../../../services/wardenApi';
import AnnouncementCard from '../../../components/warden/announcements/AnnouncementCard';
import AnnouncementFilter from '../../../components/warden/announcements/AnnouncementFilter';
import AnnouncementTable from '../../../components/warden/announcements/AnnouncementTable';
import '../../../styles/warden/announcements/announcements.css';

const WardenAnnouncements = () => {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [targetFilter, setTargetFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const perPage = 5;

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        const response = await wardenApi.getActiveAnnouncements();
        const apiData = response.data?.data || [];

        const formatDate = (value) => {
          if (!value) return '';
          return new Date(value).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          });
        };

        const mapped = apiData.map((item) => ({
          id: item.id,
          title: item.title,
          description: item.message,
          targetAudience:
            item.audience === 'WARDENS'
              ? 'Wardens'
              : item.audience === 'BOTH'
              ? 'All Students & Wardens'
              : 'All Students',
          createdDate: formatDate(item.createdAt),
          expiryDate: formatDate(item.expiryDate),
          status:
            item.status === 'PUBLISHED'
              ? 'Active'
              : item.status === 'EXPIRED'
              ? 'Expired'
              : 'Scheduled',
          priority:
            item.priority?.charAt(0).toUpperCase() + item.priority?.slice(1).toLowerCase(),
          createdBy: item.createdBy,
        }));

        setAnnouncements(mapped);
      } catch (err) {
        console.error('Error loading announcements:', err);
        setError('Unable to load announcements from the database.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  const stats = {
    total: announcements.length,
    active: announcements.filter((a) => a.status === 'Active').length,
    expired: announcements.filter((a) => a.status === 'Expired').length,
  };

  const filtered = announcements.filter((a) => {
    const matchSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.description.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      !statusFilter || statusFilter === 'All Status' || a.status === statusFilter;
    const matchTarget =
      !targetFilter ||
      (targetFilter === 'All Students' && (a.targetAudience === 'All Students' || a.targetAudience === 'All Students & Wardens')) ||
      (targetFilter === 'Wardens' && (a.targetAudience === 'Wardens' || a.targetAudience === 'All Students & Wardens')) ||
      a.targetAudience === targetFilter;
    return matchSearch && matchStatus && matchTarget;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const handleReset = () => {
    setSearch('');
    setStatusFilter('All Status');
    setTargetFilter('');
    setCurrentPage(1);
  };

  const handleDelete = (ann) => {
    setDeleteTarget(ann);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    setShowDeleteModal(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const statusClass = (s) => {
    if (s === 'Active') return 'wa-status-active';
    if (s === 'Scheduled') return 'wa-status-scheduled';
    return 'wa-status-expired';
  };

  return (
    <div className="wa-page">
      {/* Toast */}
      {showToast && (
        <div className="wa-toast">
          <span>✓ Announcement deleted successfully.</span>
          <button onClick={() => setShowToast(false)}><X size={14} /></button>
        </div>
      )}

      {/* Header */}
      <div className="wa-header">
        <div className="wa-header-left">
          <h1 className="wa-page-title">Announcements</h1>
          <p className="wa-page-sub">Manage and track communications sent to hostel residents.</p>
        </div>
        <div className="wa-header-actions">
          <button className="wa-btn-secondary">Test Empty State</button>
          <button className="wa-btn-primary" onClick={() => navigate('/warden/announcements/create')}>
            <Plus size={16} /> Create Announcement
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="wa-stats-grid">
        <AnnouncementCard
          icon={Megaphone}
          label="Total Announcements"
          value={stats.total}
          iconBg="rgba(31,60,136,0.08)"
          iconColor="#1F3C88"
          subLabel="Cumulative announcements created"
        />
        <AnnouncementCard
          icon={Radio}
          label="Active"
          value={stats.active}
          iconBg="rgba(43,187,173,0.08)"
          iconColor="#2BBBAD"
          subLabel="Currently visible to students"
        />
        <AnnouncementCard
          icon={Archive}
          label="Expired"
          value={stats.expired}
          iconBg="rgba(107,114,128,0.08)"
          iconColor="#6B7280"
          subLabel="Past announcements archived"
        />
      </div>

      {/* Filters */}
      <AnnouncementFilter
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        targetFilter={targetFilter}
        setTargetFilter={setTargetFilter}
        onReset={handleReset}
      />

      {loading && <div className="wa-loading">Loading announcements from the database...</div>}
      {error && <div className="wa-error">{error}</div>}

      {/* Table Card */}
      <div className="wa-table-card">
        <div className="wa-table-header">
          <div />
          <div className="wa-table-header-actions">
            <button className="wa-btn-secondary wa-sm">
              <Download size={13} /> Export Data
            </button>
            <button className="wa-btn-secondary wa-sm">
              <RefreshCw size={13} /> Refresh
            </button>
          </div>
        </div>

        <AnnouncementTable data={paginated} onDelete={handleDelete} />

        {/* Pagination */}
        <div className="wa-pagination">
          <span className="wa-page-info">
            Showing {filtered.length === 0 ? 0 : (currentPage - 1) * perPage + 1}–
            {Math.min(currentPage * perPage, filtered.length)} of {filtered.length} announcements
          </span>
          <div className="wa-page-controls">
            <button
              className="wa-page-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              ‹
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                className={`wa-page-num ${currentPage === i + 1 ? 'active' : ''}`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            {totalPages > 4 && <span className="wa-page-ellipsis">...</span>}
            {totalPages > 4 && (
              <button className="wa-page-num" onClick={() => setCurrentPage(totalPages)}>
                {totalPages}
              </button>
            )}
            <button
              className="wa-page-btn"
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              ›
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="wa-mobile-cards">
        {paginated.map((a) => (
          <div key={a.id} className="wa-mobile-card">
            <div className="wa-mobile-card-top">
              <span
                className="wa-mobile-title"
                onClick={() => navigate(`/warden/announcements/view/${a.id}`)}
              >
                {a.title}
              </span>
              <span className={`wa-status-badge ${statusClass(a.status)}`}>{a.status}</span>
            </div>
            <div className="wa-mobile-meta">
              <span>{a.targetAudience}</span> · <span>{a.createdDate}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Pro Tip */}
      <div className="wa-pro-tip">
        <span className="wa-pro-tip-icon">💡</span>
        <div>
          <strong>Pro Tip: Targeted Broadcasts</strong>
          <p>You can target announcements specifically to Block A, B, or C. For critical maintenance, use the "Urgent" priority level to trigger push notifications for all residents.</p>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && deleteTarget && (
        <div className="wa-modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="wa-modal" onClick={(e) => e.stopPropagation()}>
            <button className="wa-modal-close" onClick={() => setShowDeleteModal(false)}>
              <X size={16} />
            </button>
            <div className="wa-modal-icon">!</div>
            <h2 className="wa-modal-title">Delete Announcement?</h2>
            <p className="wa-modal-text">
              Are you sure you want to delete <strong>{deleteTarget.title}</strong>? This action
              is permanent and cannot be undone.
            </p>
            <div className="wa-modal-actions">
              <button className="wa-btn-secondary" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button className="wa-btn-delete" onClick={handleConfirmDelete}>
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WardenAnnouncements;