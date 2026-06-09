import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Download, Filter, ChevronLeft, ChevronRight,
  ArrowUpRight, RefreshCw, FileText, AlertTriangle, CheckCircle
} from 'lucide-react';
import { adminFeesApi } from '../../../services/adminFeeApi';
import '../../../styles/admin/fees/paymentHistory.css';

const methodOptions = ['', 'UPI', 'CASH', 'BANK_TRANSFER', 'OFFLINE'];
const statusOptions = ['', 'PENDING', 'VERIFIED', 'REJECTED', 'REFUNDED'];

const toDateValue = (value) => {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
};

const PaymentHistory = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [method, setMethod] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState('');
  const [error, setError] = useState('');
  const [payments, setPayments] = useState([]);
  const perPage = 5;

  const loadPayments = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await adminFeesApi.getAllPayments();
      const rawRows = Array.isArray(response?.data?.data) ? response.data.data : [];
      const rows = rawRows
        .filter((row) => row && typeof row === 'object')
        .map((row) => ({
          ...row,
          paymentId: row.paymentId || '',
          transactionId: row.transactionId || '',
          studentName: row.studentName || '',
          paymentMethod: row.paymentMethod || '',
          status: row.status || '',
          amount: Number(row.amount || 0),
          paymentDate: row.paymentDate || '',
          createdAt: row.createdAt || '',
        }));
      setPayments(rows);
    } catch (e) {
      console.error('Failed to load payment history', e);
      setError(e?.response?.data?.message || 'Unable to load payment history.');
      setPayments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  useEffect(() => {
    const onFocus = () => {
      loadPayments();
    };

    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [loadPayments]);

  const filtered = useMemo(() => {
    return payments.filter((t) => {
      if (!t) return false;
      const q = search.trim().toLowerCase();
      const rawDate = t.paymentDate || (t.createdAt ? String(t.createdAt).split(' ')[0] : null);
      const txDate = toDateValue(rawDate);
      const start = startDate ? toDateValue(startDate) : null;
      const end = endDate ? toDateValue(endDate) : null;

      const matchSearch =
        !q ||
        String(t.studentName || '').toLowerCase().includes(q) ||
        String(t.transactionId || '').toLowerCase().includes(q) ||
        String(t.paymentId || '').toLowerCase().includes(q);

      const matchMethod = !method || String(t.paymentMethod || '').toUpperCase() === method;
      const matchStatus = !status || String(t.status || '').toUpperCase() === status;
      const matchStart = !start || (txDate && txDate >= start);
      const matchEnd = !end || (txDate && txDate <= end);

      return matchSearch && matchMethod && matchStatus && matchStart && matchEnd;
    });
  }, [payments, search, method, status, startDate, endDate]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * perPage, safePage * perPage);

  const getInitials = (name) => String(name || 'NA').split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
  const avatarColors = ['#1F3C88', '#2BBBAD', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  const statusBadgeClass = (s) => {
    const normalized = String(s || '').toUpperCase();
    const map = {
      VERIFIED: 'badge-paid',
      PENDING: 'badge-pending',
      REJECTED: 'badge-failed',
      REFUNDED: 'badge-refunded',
    };
    return `status-badge ${map[normalized] || ''}`;
  };

  const statusLabel = (s) => {
    const normalized = String(s || '').toUpperCase();
    if (normalized === 'VERIFIED') return 'Paid';
    if (normalized === 'PENDING') return 'Pending';
    if (normalized === 'REJECTED') return 'Not Verified';
    if (normalized === 'REFUNDED') return 'Not Verified';
    return normalized || '-';
  };

  const handleReset = () => {
    setSearch('');
    setStartDate('');
    setEndDate('');
    setMethod('');
    setStatus('');
    setPage(1);
  };

  const updatePaymentStatus = async (paymentId, nextStatus) => {
    if (!paymentId) return;

    try {
      setUpdatingId(paymentId);
      setError('');

      if (nextStatus === 'VERIFIED') {
        await adminFeesApi.verifyPayment(paymentId, 'Verified from payment history panel');
      } else if (nextStatus === 'REJECTED') {
        await adminFeesApi.rejectPayment(paymentId, 'Rejected from payment history panel');
      }

      await loadPayments();
    } catch (e) {
      console.error('Failed to update payment status', e);
      const backendMessage = e?.response?.data?.message || e?.response?.data?.error || '';
      if (backendMessage?.toLowerCase().includes('only pending payments')) {
        await loadPayments();
        setError('This payment was already processed. List refreshed with latest status.');
      } else {
        setError(backendMessage || 'Unable to update payment status.');
      }
    } finally {
      setUpdatingId('');
    }
  };

  const summary = useMemo(() => {
    const totalCollected = payments
      .filter((p) => String(p.status || '').toUpperCase() === 'VERIFIED')
      .reduce((sum, p) => sum + Number(p.amount || 0), 0);
    const failedCount = payments.filter((p) => String(p.status || '').toUpperCase() === 'REJECTED').length;
    const pendingCount = payments.filter((p) => String(p.status || '').toUpperCase() === 'PENDING').length;

    return {
      totalCollected,
      failedCount,
      pendingCount,
    };
  }, [payments]);

  return (
    <div className="payment-history-page">
      <div className="page-header">
        <div className="page-header-left">
          <div className="breadcrumb">
            <span>Dashboard</span><span className="breadcrumb-sep">›</span>
            <span>Fees</span><span className="breadcrumb-sep">›</span>
            <span className="breadcrumb-active">Payment History</span>
          </div>
          <h1 className="page-title">Payment History</h1>
          <p className="page-sub">Audit and track payment requests and verification actions.</p>
        </div>
        <div className="page-header-actions">
          <button className="btn-secondary"><Download size={15} /> Export Payments</button>
          <button className="btn-primary" onClick={() => navigate('/admin/fees')}>
            <ArrowUpRight size={15} /> Generate Invoice
          </button>
        </div>
      </div>

      {error && (
        <div className="filters-card" style={{ color: '#b91c1c' }}>
          {error}
        </div>
      )}

      <div className="filters-card">
        <div className="filters-row">
          <div className="filter-col filter-col-search">
            <label className="filter-label" htmlFor="admin-payment-search">Search Student</label>
            <div className="input-wrap">
              <Search size={15} className="input-icon" />
              <input
                id="admin-payment-search"
                className="filter-input"
                placeholder="Enter Name, Txn ID or Payment ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="filter-col filter-col-date">
            <label className="filter-label" htmlFor="admin-payment-start-date">Date Range</label>
            <div className="date-range">
              <div className="input-wrap">
                <input
                  id="admin-payment-start-date"
                  className="filter-input"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="input-wrap">
                <input
                  id="admin-payment-end-date"
                  className="filter-input"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="filter-col">
            <label className="filter-label" htmlFor="admin-payment-method">Payment Method</label>
            <select id="admin-payment-method" className="filter-select" value={method} onChange={(e) => setMethod(e.target.value)}>
              <option value="">All Methods</option>
              {methodOptions.filter(Boolean).map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div className="filter-col">
            <label className="filter-label" htmlFor="admin-payment-status">Transaction Status</label>
            <select id="admin-payment-status" className="filter-select" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">All Status</option>
              {statusOptions.filter(Boolean).map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div className="filter-actions">
          <button className="btn-reset-filters" onClick={handleReset}><RefreshCw size={13} /> Reset Filters</button>
          <button className="btn-apply-filters" onClick={() => setPage(1)}><Filter size={13} /> APPLY FILTERS</button>
        </div>
      </div>

      <div className="table-card">
        <div className="table-responsive">
          <table className="fees-table">
            <thead>
              <tr>
                <th>Payment ID</th>
                <th>Student Name</th>
                <th>Txn ID</th>
                <th>Amount Paid</th>
                <th>Method</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {!loading && paged.map((t, i) => (
                <tr key={t.paymentId || `${t.transactionId}-${i}`}>
                  <td className="txn-id">{t.paymentId || '-'}</td>
                  <td>
                    <div className="student-cell">
                      <div className="avatar-circle" style={{ background: `${avatarColors[i % avatarColors.length]}20`, color: avatarColors[i % avatarColors.length] }}>
                        {getInitials(t.studentName)}
                      </div>
                      <span className="student-name">{t.studentName || '-'}</span>
                    </div>
                  </td>
                  <td className="txn-id">{t.transactionId || '-'}</td>
                  <td className="amount-cell">₹{Number(t.amount || 0).toLocaleString('en-IN')}</td>
                  <td>{t.paymentMethod || '-'}</td>
                  <td>{t.paymentDate || '-'}</td>
                  <td><span className={statusBadgeClass(t.status)}>{statusLabel(t.status)}</span></td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="action-btn"
                        title="Mark Verified"
                        onClick={() => updatePaymentStatus(t.paymentId, 'VERIFIED')}
                        disabled={updatingId === t.paymentId || String(t.status || '').toUpperCase() !== 'PENDING'}
                      >
                        Verified
                      </button>
                      <button
                        className="action-btn"
                        title="Mark Not Verified"
                        onClick={() => updatePaymentStatus(t.paymentId, 'REJECTED')}
                        disabled={updatingId === t.paymentId || String(t.status || '').toUpperCase() !== 'PENDING'}
                      >
                        Not Verified
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {(loading || paged.length === 0) && (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '20px', color: '#6B7280' }}>
                    {loading ? 'Loading payments...' : 'No payments found for selected filters.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="table-footer">
          <span className="showing-text">
            Showing {filtered.length === 0 ? 0 : (safePage - 1) * perPage + 1}-{Math.min(safePage * perPage, filtered.length)} of {filtered.length} transactions
          </span>
          <div className="pagination">
            <button className="pag-arrow" onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={safePage === 1}>
              <ChevronLeft size={15} />
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, idx) => idx + 1).map((n) => (
              <button key={n} className={`pag-num ${safePage === n ? 'active' : ''}`} onClick={() => setPage(n)}>{n}</button>
            ))}
            {totalPages > 5 && <span className="pag-dots">...</span>}
            {totalPages > 5 && (
              <button className="pag-num" onClick={() => setPage(totalPages)}>{totalPages}</button>
            )}
            <button className="pag-arrow" onClick={() => setPage((p) => Math.min(p + 1, totalPages))} disabled={safePage === totalPages}>
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>

      <div className="summary-stats-grid">
        <div className="summary-stat-card">
          <div className="ss-icon ss-icon-blue"><FileText size={20} /></div>
          <div>
            <div className="ss-label">TOTAL VERIFIED</div>
            <div className="ss-value">₹{summary.totalCollected.toLocaleString('en-IN')}</div>
          </div>
        </div>
        <div className="summary-stat-card">
          <div className="ss-icon ss-icon-red"><AlertTriangle size={20} /></div>
          <div>
            <div className="ss-label">NOT VERIFIED PAYMENTS</div>
            <div className="ss-value">{summary.failedCount}</div>
          </div>
        </div>
        <div className="summary-stat-card">
          <div className="ss-icon ss-icon-teal"><CheckCircle size={20} /></div>
          <div>
            <div className="ss-label">PENDING VERIFICATION</div>
            <div className="ss-value">{summary.pendingCount}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;
