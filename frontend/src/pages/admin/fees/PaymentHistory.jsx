import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Download, Receipt, Filter, ChevronLeft, ChevronRight,
  ArrowUpRight, Eye, RefreshCw, FileText, AlertTriangle
} from 'lucide-react';
import { paymentTransactions } from '../../../data/feesData';
import '../../../styles/admin/fees/paymentHistory.css';

const methodOptions = ['', 'UPI', 'Cash', 'Card', 'Bank Transfer', 'Online'];
const statusOptions = ['', 'Paid', 'Pending', 'Failed', 'Refunded'];

const PaymentHistory = () => {
  const navigate = useNavigate();
  const [search,     setSearch]    = useState('');
  const [startDate,  setStartDate] = useState('');
  const [endDate,    setEndDate]   = useState('');
  const [method,     setMethod]    = useState('');
  const [status,     setStatus]    = useState('');
  const [page,       setPage]      = useState(1);
  const perPage = 5;

  const filtered = paymentTransactions.filter(t => {
    const s = search.toLowerCase();
    const matchSearch = t.name.toLowerCase().includes(s) || t.txnId.toLowerCase().includes(s);
    const matchMethod = !method || t.method === method;
    const matchStatus = !status || t.status === status;
    return matchSearch && matchMethod && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  const getInitials = (name) => name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const avatarColors = ['#1F3C88', '#2BBBAD', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  const statusBadgeClass = (s) => {
    const map = { Paid: 'badge-paid', Pending: 'badge-pending', Failed: 'badge-failed', Refunded: 'badge-refunded' };
    return `status-badge ${map[s] || ''}`;
  };

  const handleReset = () => {
    setSearch(''); setStartDate(''); setEndDate(''); setMethod(''); setStatus(''); setPage(1);
  };

  return (
    <div className="payment-history-page">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-left">
          <div className="breadcrumb">
            <span>Dashboard</span><span className="breadcrumb-sep">›</span>
            <span>Fees</span><span className="breadcrumb-sep">›</span>
            <span className="breadcrumb-active">Payment History</span>
          </div>
          <h1 className="page-title">Payment History</h1>
          <p className="page-sub">Audit and track all financial transactions within the hostel system.</p>
        </div>
        <div className="page-header-actions">
          <button className="btn-secondary"><Download size={15} /> Export Payments</button>
          <button className="btn-primary" onClick={() => navigate('/admin/fees/generate-invoice')}>
            <ArrowUpRight size={15} /> Generate Invoice
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-card">
        <div className="filters-row">
          <div className="filter-col filter-col-search">
            <label className="filter-label">Search Student</label>
            <div className="input-wrap">
              <Search size={15} className="input-icon" />
              <input
                className="filter-input"
                placeholder="Enter Name or ID..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="filter-col filter-col-date">
            <label className="filter-label">Date Range</label>
            <div className="date-range">
              <div className="input-wrap">
                <input className="filter-input" type="date" placeholder="Start Date" value={startDate} onChange={e => setStartDate(e.target.value)} />
              </div>
              <div className="input-wrap">
                <input className="filter-input" type="date" placeholder="End Date" value={endDate} onChange={e => setEndDate(e.target.value)} />
              </div>
            </div>
          </div>
          <div className="filter-col">
            <label className="filter-label">Payment Method</label>
            <select className="filter-select" value={method} onChange={e => setMethod(e.target.value)}>
              <option value="">All Methods</option>
              {methodOptions.filter(Boolean).map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div className="filter-col">
            <label className="filter-label">Transaction Status</label>
            <select className="filter-select" value={status} onChange={e => setStatus(e.target.value)}>
              <option value="">All Status</option>
              {statusOptions.filter(Boolean).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div className="filter-actions">
          <button className="btn-reset-filters" onClick={handleReset}><RefreshCw size={13} /> Reset Filters</button>
          <button className="btn-apply-filters" onClick={() => setPage(1)}><Filter size={13} /> APPLY FILTERS</button>
        </div>
      </div>

      {/* Table */}
      <div className="table-card">
        <div className="table-responsive">
          <table className="fees-table">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Student Name</th>
                <th>Room No.</th>
                <th>Amount Paid</th>
                <th>Method</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((t, i) => (
                <tr key={t.txnId}>
                  <td className="txn-id">{t.txnId}</td>
                  <td>
                    <div className="student-cell">
                      <div className="avatar-circle" style={{ background: `${avatarColors[i % avatarColors.length]}20`, color: avatarColors[i % avatarColors.length] }}>
                        {getInitials(t.name)}
                      </div>
                      <span className="student-name">{t.name}</span>
                    </div>
                  </td>
                  <td>{t.room}</td>
                  <td className="amount-cell">₹{t.amount.toLocaleString()}</td>
                  <td>{t.method}</td>
                  <td>{t.date}</td>
                  <td><span className={statusBadgeClass(t.status)}>{t.status}</span></td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-btn" title="View"><Eye size={15} /></button>
                      <button className="action-btn" title="Invoice"><FileText size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="table-footer">
          <span className="showing-text">Showing 1-{paged.length} of {filtered.length} transactions</span>
          <div className="pagination">
            <button className="pag-arrow" onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1}>
              <ChevronLeft size={15} />
            </button>
            {[1, 2, 3].map(n => (
              <button key={n} className={`pag-num ${page === n ? 'active' : ''}`} onClick={() => setPage(n)}>{n}</button>
            ))}
            <span className="pag-dots">...</span>
            <button className="pag-num" onClick={() => setPage(12)}>12</button>
            <button className="pag-arrow" onClick={() => setPage(p => Math.min(p + 1, totalPages))} disabled={page === totalPages}>
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-stats-grid">
        <div className="summary-stat-card">
          <div className="ss-icon ss-icon-blue"><FileText size={20} /></div>
          <div>
            <div className="ss-label">TOTAL COLLECTED TODAY</div>
            <div className="ss-value">₹42,500</div>
          </div>
        </div>
        <div className="summary-stat-card">
          <div className="ss-icon ss-icon-red"><AlertTriangle size={20} /></div>
          <div>
            <div className="ss-label">FAILED TRANSACTIONS</div>
            <div className="ss-value">08</div>
          </div>
        </div>
        <div className="summary-stat-card">
          <div className="ss-icon ss-icon-teal"><Eye size={20} /></div>
          <div>
            <div className="ss-label">PENDING RECONCILIATIONS</div>
            <div className="ss-value">12</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;