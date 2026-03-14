// src/pages/admin/announcements/NotificationHistory.jsx
import React, { useState } from 'react';
import { Search, Eye, RefreshCw, X, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { notificationHistoryData } from '../../../data/announcementsData';
import '../../../styles/admin/announcements/notificationHistory.css';

const NotificationHistory = () => {
  const [search, setSearch] = useState('');
  const [recipientFilter, setRecipientFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedNotif, setSelectedNotif] = useState(null);
  const [showResendModal, setShowResendModal] = useState(false);
  const perPage = 5;

  const filtered = notificationHistoryData.filter((n) => {
    const matchSearch = n.announcementTitle.toLowerCase().includes(search.toLowerCase()) || n.id.toLowerCase().includes(search.toLowerCase());
    const matchRecipient = !recipientFilter || n.recipientType === recipientFilter;
    const matchStatus = !statusFilter || n.deliveryStatus === statusFilter;
    return matchSearch && matchRecipient && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const handleViewDetails = (notif) => {
    setSelectedNotif(notif);
    setDrawerOpen(true);
  };

  const getStatusClass = (s) => {
    if (s === 'Sent') return 'nh-status-sent';
    if (s === 'Scheduled') return 'nh-status-scheduled';
    return 'nh-status-failed';
  };

  const getStatusIcon = (s) => {
    if (s === 'Sent') return <CheckCircle size={13} />;
    if (s === 'Scheduled') return <Clock size={13} />;
    return <AlertCircle size={13} />;
  };

  const getRecipientLogClass = (s) => {
    if (s === 'SUCCESS') return 'nh-log-success';
    return 'nh-log-failed';
  };

  return (
    <div className="nh-page">
      {/* Header */}
      <div className="nh-header">
        <div className="nh-header-left">
          <div className="nh-breadcrumb">
            <span>Dashboard</span><span className="nh-sep">›</span>
            <span>Announcements</span><span className="nh-sep">›</span>
            <span className="nh-breadcrumb-active">History</span>
          </div>
          <h1 className="nh-title">Notification History</h1>
          <p className="nh-subtitle">Track and manage the delivery of all broadcasted announcements.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="nh-filters-card">
        <div className="nh-filters-row">
          <div className="nh-search-wrap">
            <Search size={15} className="nh-search-icon" />
            <input
              className="nh-search-input"
              type="text"
              placeholder="Search Announcement..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            />
          </div>
          <div className="nh-date-range">
            <input className="nh-date-input" type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} placeholder="From" />
            <span className="nh-date-sep">—</span>
            <input className="nh-date-input" type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} placeholder="To" />
          </div>
          <select className="nh-filter-select" value={recipientFilter} onChange={(e) => { setRecipientFilter(e.target.value); setCurrentPage(1); }}>
            <option value="">All Recipients</option>
            <option value="Students">Students</option>
            <option value="Wardens">Wardens</option>
            <option value="All">All</option>
          </select>
          <select className="nh-filter-select" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}>
            <option value="">All Status</option>
            <option value="Sent">Sent</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="nh-table-card">
        <div className="nh-table-wrap">
          <table className="nh-table">
            <thead>
              <tr>
                <th>Notification ID</th>
                <th>Announcement Title</th>
                <th>Recipient Type</th>
                <th>Recipients Count</th>
                <th>Sent Date</th>
                <th>Delivery Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr><td colSpan={7} className="nh-empty">No notifications found.</td></tr>
              ) : paginated.map((n) => (
                <tr key={n.id}>
                  <td className="nh-notif-id">{n.id}</td>
                  <td className="nh-ann-title">{n.announcementTitle}</td>
                  <td>{n.recipientType}</td>
                  <td className="nh-count">{n.recipientsCount}</td>
                  <td>{n.sentDate}<br /><span className="nh-time">{n.sentTime}</span></td>
                  <td>
                    <span className={`nh-status-badge ${getStatusClass(n.deliveryStatus)}`}>
                      {getStatusIcon(n.deliveryStatus)} {n.deliveryStatus}
                    </span>
                  </td>
                  <td>
                    <div className="nh-actions">
                      <button className="nh-action-btn" title="View Details" onClick={() => handleViewDetails(n)}>
                        <Eye size={15} />
                      </button>
                      <button className="nh-action-btn" title="Resend" onClick={() => { setSelectedNotif(n); setShowResendModal(true); }}>
                        <RefreshCw size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="nh-pagination">
          <span className="nh-page-info">Showing {filtered.length === 0 ? 0 : (currentPage - 1) * perPage + 1}–{Math.min(currentPage * perPage, filtered.length)} of {filtered.length}</span>
          <div className="nh-page-controls">
            <button className="nh-page-btn" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>‹</button>
            {[...Array(totalPages)].map((_, i) => (
              <button key={i} className={`nh-page-num ${currentPage === i + 1 ? 'active' : ''}`} onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
            ))}
            <button className="nh-page-btn" disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(p => p + 1)}>›</button>
          </div>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="nh-mobile-cards">
        {paginated.map((n) => (
          <div key={n.id} className="nh-mobile-card">
            <div className="nh-mobile-card-top">
              <span className="nh-notif-id">{n.id}</span>
              <span className={`nh-status-badge ${getStatusClass(n.deliveryStatus)}`}>{getStatusIcon(n.deliveryStatus)} {n.deliveryStatus}</span>
            </div>
            <div className="nh-mobile-title">{n.announcementTitle}</div>
            <div className="nh-mobile-meta">
              <span>{n.recipientType}</span> · <span>{n.recipientsCount} recipients</span> · <span>{n.sentDate}</span>
            </div>
            <div className="nh-mobile-actions">
              <button className="nh-mobile-action" onClick={() => handleViewDetails(n)}><Eye size={14} /> View Details</button>
              <button className="nh-mobile-action" onClick={() => { setSelectedNotif(n); setShowResendModal(true); }}><RefreshCw size={14} /> Resend</button>
            </div>
          </div>
        ))}
      </div>

      {/* Drawer */}
      {drawerOpen && selectedNotif && (
        <>
          <div className="nh-drawer-overlay" onClick={() => setDrawerOpen(false)} />
          <div className="nh-drawer">
            <div className="nh-drawer-header">
              <div className="nh-drawer-header-left">
                <h2 className="nh-drawer-title">Delivery Details</h2>
                <span className={`nh-status-badge ${getStatusClass(selectedNotif.deliveryStatus)}`}>{selectedNotif.deliveryStatus}</span>
              </div>
              <button className="nh-drawer-close" onClick={() => setDrawerOpen(false)}><X size={18} /></button>
            </div>
            <div className="nh-drawer-body">
              <p className="nh-drawer-notif-id">Notification ID: <span className="nh-id-blue">{selectedNotif.id}</span></p>

              <div className="nh-drawer-section-title">ANNOUNCEMENT CONTENT</div>
              <h3 className="nh-drawer-ann-title">{selectedNotif.announcementTitle}</h3>
              <p className="nh-drawer-ann-message">{selectedNotif.message}</p>

              <div className="nh-drawer-section-title">DELIVERY METRICS</div>
              <div className="nh-metrics-grid">
                <div className="nh-metric">
                  <span className="nh-metric-value nh-metric-blue">{selectedNotif.targeted}</span>
                  <span className="nh-metric-label">TARGETED</span>
                </div>
                <div className="nh-metric">
                  <span className="nh-metric-value nh-metric-green">{selectedNotif.delivered}</span>
                  <span className="nh-metric-label">DELIVERED</span>
                </div>
                <div className="nh-metric">
                  <span className="nh-metric-value nh-metric-red">{selectedNotif.failed}</span>
                  <span className="nh-metric-label">FAILED</span>
                </div>
              </div>

              {selectedNotif.recipientLogs?.length > 0 && (
                <>
                  <div className="nh-drawer-section-title nh-logs-header">
                    RECIPIENT LOGS <span className="nh-logs-sub">Recent 10 items</span>
                  </div>
                  <div className="nh-log-table-header">
                    <span>Recipient Name</span><span>Room</span><span>Status</span>
                  </div>
                  {selectedNotif.recipientLogs.map((log, i) => (
                    <div key={i} className="nh-log-row">
                      <span>{log.name}</span>
                      <span>{log.room}</span>
                      <span className={`nh-log-status ${getRecipientLogClass(log.status)}`}>{log.status}</span>
                    </div>
                  ))}
                </>
              )}

              <button className="nh-resend-failed-btn" onClick={() => setShowResendModal(true)}>
                <RefreshCw size={15} /> Resend to Failed Recipients
              </button>
            </div>
          </div>
        </>
      )}

      {/* Resend Modal */}
      {showResendModal && selectedNotif && (
        <div className="nh-modal-overlay" onClick={() => setShowResendModal(false)}>
          <div className="nh-modal" onClick={(e) => e.stopPropagation()}>
            <button className="nh-modal-close" onClick={() => setShowResendModal(false)}><X size={16} /></button>
            <div className="nh-modal-icon"><RefreshCw size={28} /></div>
            <h2 className="nh-modal-title">Resend Notification?</h2>
            <p className="nh-modal-text">
              Are you sure you want to resend <strong>"{selectedNotif.announcementTitle}"</strong> to all {selectedNotif.recipientsCount} recipients? This will trigger new push and email notifications.
            </p>
            <div className="nh-modal-details">
              <div className="nh-modal-detail-row"><span>Original ID:</span><span>{selectedNotif.id}</span></div>
              <div className="nh-modal-detail-row"><span>Target Audience:</span><span>{selectedNotif.audience}</span></div>
            </div>
            <div className="nh-modal-actions">
              <button className="nh-btn-cancel-modal" onClick={() => setShowResendModal(false)}>Cancel</button>
              <button className="nh-btn-resend" onClick={() => setShowResendModal(false)}>Yes, Resend Now</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationHistory;