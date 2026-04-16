import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Download, Search, Filter, Eye, MoreHorizontal,
  CheckCircle, Clock, XCircle, Calendar, ChevronLeft,
  ChevronRight, AlertCircle, Shield
} from 'lucide-react';
import { studentApi } from '../../../services/studentApi';
import { studentFeeApi } from '../../../services/adminFeeApi';
import '../../../styles/student/fees/payment-history.css';

const statusCfg = {
  Paid: { color: '#22c55e', bg: '#F0FDF4', icon: CheckCircle },
  Pending: { color: '#F59E0B', bg: '#FFF8E7', icon: Clock },
  Failed: { color: '#EF4444', bg: '#FEF2F2', icon: XCircle },
};

const fmt = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;
const ROWS_PER_PAGE = 6;

const mapStatus = (status) => {
  const normalized = String(status || '').toUpperCase();
  if (normalized === 'VERIFIED') return 'Paid';
  if (normalized === 'REJECTED') return 'Failed';
  return 'Pending';
};

const mapMethod = (method) => {
  const normalized = String(method || '').toUpperCase();
  if (normalized === 'BANK_TRANSFER') return 'Bank Transfer';
  if (normalized === 'UPI') return 'UPI';
  if (normalized === 'CASH') return 'Cash';
  return method || '-';
};

const PaymentHistory = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [method, setMethod] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [studentProfile, setStudentProfile] = useState(null);
  const [allTransactions, setAllTransactions] = useState([]);

  useEffect(() => {
    const loadStudentPayments = async () => {
      try {
        setLoading(true);
        const [profileResponse, paymentsResponse] = await Promise.all([
          studentApi.getProfile(),
          studentFeeApi.getPayments(),
        ]);

        const profile = profileResponse?.data?.data || null;
        setStudentProfile(profile);

        const backendPayments = Array.isArray(paymentsResponse?.data?.data)
          ? paymentsResponse.data.data
          : [];

        const payments = backendPayments.map((payment) => ({
          id: payment.paymentId,
          date: payment.paymentDate,
          amount: payment.amount,
          method: mapMethod(payment.paymentMethod),
          status: mapStatus(payment.status),
        }));

        setAllTransactions(payments);
      } catch (error) {
        console.error('Failed to load student payment history:', error);
        setAllTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    loadStudentPayments();
  }, []);

  const filtered = allTransactions.filter((txn) => {
    const matchSearch = !search || txn.id?.toLowerCase().includes(search.toLowerCase());
    const matchMethod = !method || txn.method === method;
    const matchStatus = !status || txn.status === status;
    return matchSearch && matchMethod && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const pageData = filtered.slice((safePage - 1) * ROWS_PER_PAGE, safePage * ROWS_PER_PAGE);

  const summary = useMemo(() => {
    const totalPaid = allTransactions
      .filter((txn) => txn.status === 'Paid')
      .reduce((sum, txn) => sum + Number(txn.amount || 0), 0);

    const pendingAmt = allTransactions
      .filter((txn) => txn.status === 'Pending')
      .reduce((sum, txn) => sum + Number(txn.amount || 0), 0);

    const lastPayment = allTransactions.find((txn) => txn.status === 'Paid') || allTransactions[0] || null;

    return { totalPaid, pendingAmt, lastPayment };
  }, [allTransactions]);

  const methodOptions = [...new Set(allTransactions.map((txn) => txn.method).filter(Boolean))];

  const handleApply = () => setPage(1);
  const handleReset = () => {
    setSearch('');
    setMethod('');
    setStatus('');
    setPage(1);
  };

  return (
    <div className="ph-page">
      <div className="ph-header">
        <div>
          <h1 className="ph-title">Payment History</h1>
          <p className="ph-subtitle">Only payments submitted by your account are shown here.</p>
        </div>
        <button className="ph-export-btn">
          <Download size={15} /> Export CSV
        </button>
      </div>

      <div className="ph-filters-card">
        <div className="ph-filters-grid">
          <div className="ph-filter-group">
            <label className="ph-filter-label" htmlFor="payment-history-search">SEARCH</label>
            <div className="ph-input-wrap">
              <Search size={14} className="ph-input-icon" />
              <input
                id="payment-history-search"
                type="text"
                className="ph-input ph-input--icon"
                placeholder="Receipt ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="ph-filter-group">
            <label className="ph-filter-label" htmlFor="payment-history-date">DATE RANGE</label>
            <div className="ph-input-wrap">
              <Calendar size={14} className="ph-input-icon" />
              <input id="payment-history-date" type="date" className="ph-input ph-input--icon" />
            </div>
          </div>
          <div className="ph-filter-group">
            <label className="ph-filter-label" htmlFor="payment-history-method">METHOD</label>
            <select
              id="payment-history-method"
              className="ph-select"
              value={method}
              onChange={(e) => setMethod(e.target.value)}
            >
              <option value="">All Methods</option>
              {methodOptions.map((methodOption) => (
                <option key={methodOption} value={methodOption}>{methodOption}</option>
              ))}
            </select>
          </div>
          <div className="ph-filter-group">
            <label className="ph-filter-label" htmlFor="payment-history-status">STATUS</label>
            <select
              id="payment-history-status"
              className="ph-select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </select>
          </div>
          <div className="ph-filter-actions">
            <button className="ph-btn-reset" onClick={handleReset}>Reset</button>
            <button className="ph-btn-apply" onClick={handleApply}>
              <Filter size={14} /> Apply
            </button>
          </div>
        </div>
      </div>

      <div className="ph-table-card">
        <div className="ph-table-header">
          <div>
            <h3 className="ph-table-title">Your Transactions</h3>
            <p className="ph-table-sub">Showing {pageData.length} of {filtered.length} transactions</p>
          </div>
          <div className="ph-rows-label">
            Student: <strong>{studentProfile?.name || 'Loading...'}</strong>
          </div>
        </div>

        <div className="ph-table-wrap">
          <table className="ph-table">
            <thead>
              <tr>
                <th>RECEIPT ID</th>
                <th>DATE</th>
                <th>AMOUNT</th>
                <th>METHOD</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {!loading && pageData.map((txn) => {
                const scfg = statusCfg[txn.status] || { color: '#6B7280', bg: '#F4F6F9', icon: Clock };
                const Icon = scfg.icon;
                return (
                  <tr key={txn.id}>
                    <td>
                      <div className="ph-receipt-id">
                        {txn.id}
                        <span className="ph-id-arrow">↗</span>
                      </div>
                    </td>
                    <td className="ph-date">{txn.date || '-'}</td>
                    <td className="ph-amount">{fmt(txn.amount)}</td>
                    <td>
                      <div className="ph-method">
                        <span className="ph-method-icon">⊟</span>
                        {txn.method || '-'}
                      </div>
                    </td>
                    <td>
                      <span className="ph-status-badge" style={{ color: scfg.color, background: scfg.bg }}>
                        <Icon size={11} />
                        {txn.status}
                      </span>
                    </td>
                    <td>
                      <div className="ph-actions-row">
                        <button
                          className="ph-action-btn"
                          title="View Receipt"
                          onClick={() => navigate(`/student/fees/receipt/${txn.id}`)}
                        >
                          <Eye size={14} />
                        </button>
                        <button className="ph-action-btn" title="Download">
                          <Download size={14} />
                        </button>
                        <button className="ph-action-btn" title="More">
                          <MoreHorizontal size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {(loading || pageData.length === 0) && (
                <tr>
                  <td colSpan={6} className="ph-empty">
                    {loading ? 'Loading payment history...' : 'No student payments found. Submit a payment to generate your first receipt.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="ph-pagination">
          <span className="ph-page-info">
            Showing <strong>{filtered.length === 0 ? 0 : (safePage - 1) * ROWS_PER_PAGE + 1}–{Math.min(safePage * ROWS_PER_PAGE, filtered.length)}</strong> of <strong>{filtered.length}</strong> transactions
          </span>
          <div className="ph-page-controls">
            <button
              className="ph-page-btn"
              disabled={safePage === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft size={15} />
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                className={`ph-page-btn ${safePage === p ? 'ph-page-active' : ''}`}
                onClick={() => setPage(p)}
              >
                {p}
              </button>
            ))}
            {totalPages > 5 && <span className="ph-page-ellipsis">…</span>}
            {totalPages > 5 && (
              <button className="ph-page-btn" onClick={() => setPage(totalPages)}>{totalPages}</button>
            )}
            <button
              className="ph-page-btn"
              disabled={safePage === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>

      <div className="ph-summary-row">
        <div className="ph-summary-card">
          <div className="ph-sum-icon"><Clock size={20} /></div>
          <div>
            <p className="ph-sum-label">Total Paid</p>
            <p className="ph-sum-big">{fmt(summary.totalPaid)}</p>
            <p className="ph-sum-sub">Calculated from your verified student payments</p>
          </div>
        </div>
        <div className="ph-summary-card">
          <div className="ph-sum-icon ph-sum-icon--warn"><Clock size={20} /></div>
          <div>
            <p className="ph-sum-label">Pending Verification</p>
            <p className="ph-sum-big">{fmt(summary.pendingAmt)}</p>
            <p className="ph-sum-sub">Transactions awaiting approval</p>
          </div>
        </div>
        <div className="ph-summary-card">
          <div className="ph-sum-icon ph-sum-icon--blue"><Calendar size={20} /></div>
          <div>
            <p className="ph-sum-label">Last Payment Date</p>
            <p className="ph-sum-big ph-sum-big--date">{summary.lastPayment?.date || '-'}</p>
            <p className="ph-sum-sub">Latest transaction from your account</p>
          </div>
        </div>
      </div>

      <div className="ph-reconcile-card">
        <div className="ph-reconcile-left">
          <AlertCircle size={18} color="#6B7280" />
          <div>
            <p className="ph-reconcile-title">Reconciliation Notice</p>
            <p className="ph-reconcile-msg">
              If you find any discrepancy in your own payment records, please raise a support ticket within 7 days of the transaction date.
            </p>
          </div>
        </div>
        <button className="ph-refund-btn">
          <Shield size={13} /> View Refund Policy →
        </button>
      </div>
    </div>
  );
};

export default PaymentHistory;
