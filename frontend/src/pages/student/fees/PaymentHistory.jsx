import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Download, Search, Filter, Eye, MoreHorizontal,
  CheckCircle, Clock, XCircle, Calendar, ChevronLeft,
  ChevronRight, AlertCircle, Shield
} from 'lucide-react';
import '../../../styles/student/fees/payment-history.css';

// ── Mock Data ─────────────────────────────────────────────────
const allTransactions = [
  { id: 'RCPT-88291', date: '20 Mar 2024', amount: 8500,  method: 'UPI',           status: 'Paid'    },
  { id: 'RCPT-88292', date: '15 Mar 2024', amount: 12000, method: 'Bank Transfer',  status: 'Paid'    },
  { id: 'RCPT-88293', date: '10 Mar 2024', amount: 7500,  method: 'Cash',           status: 'Pending' },
  { id: 'RCPT-88294', date: '28 Feb 2024', amount: 8500,  method: 'Card',           status: 'Paid'    },
  { id: 'RCPT-88295', date: '15 Feb 2024', amount: 8500,  method: 'UPI',            status: 'Failed'  },
  { id: 'RCPT-88296', date: '20 Jan 2024', amount: 9000,  method: 'Bank Transfer',  status: 'Paid'    },
  { id: 'RCPT-88297', date: '10 Jan 2024', amount: 12500, method: 'UPI',            status: 'Paid'    },
  { id: 'RCPT-88298', date: '05 Jan 2024', amount: 8500,  method: 'Cash',           status: 'Pending' },
  { id: 'RCPT-88299', date: '20 Dec 2023', amount: 9500,  method: 'UPI',            status: 'Paid'    },
  { id: 'RCPT-88300', date: '15 Dec 2023', amount: 12000, method: 'Bank Transfer',  status: 'Paid'    },
  { id: 'RCPT-88301', date: '10 Dec 2023', amount: 7500,  method: 'UPI',            status: 'Paid'    },
  { id: 'RCPT-88302', date: '05 Dec 2023', amount: 8500,  method: 'Cash',           status: 'Failed'  },
];

const statusCfg = {
  Paid:    { color: '#22c55e', bg: '#F0FDF4', icon: CheckCircle },
  Pending: { color: '#F59E0B', bg: '#FFF8E7', icon: Clock       },
  Failed:  { color: '#EF4444', bg: '#FEF2F2', icon: XCircle     },
};

const fmt = (n) => `₹${Number(n).toLocaleString('en-IN')}`;

const ROWS_PER_PAGE = 6;

const PaymentHistory = () => {
  const navigate = useNavigate();

  const [search, setSearch]     = useState('');
  const [method, setMethod]     = useState('');
  const [status, setStatus]     = useState('');
  const [page, setPage]         = useState(1);

  const filtered = allTransactions.filter((t) => {
    const matchSearch = !search || t.id.toLowerCase().includes(search.toLowerCase());
    const matchMethod = !method || t.method === method;
    const matchStatus = !status || t.status === status;
    return matchSearch && matchMethod && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / ROWS_PER_PAGE);
  const pageData   = filtered.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);

  const totalPaid = allTransactions
    .filter((t) => t.status === 'Paid')
    .reduce((sum, t) => sum + t.amount, 0);
  const pendingAmt = allTransactions
    .filter((t) => t.status === 'Pending')
    .reduce((sum, t) => sum + t.amount, 0);
  const lastPayment = allTransactions.find((t) => t.status === 'Paid');

  const handleApply = () => setPage(1);
  const handleReset = () => { setSearch(''); setMethod(''); setStatus(''); setPage(1); };

  return (
    <div className="ph-page">

      {/* ── Header ── */}
      <div className="ph-header">
        <div>
          <h1 className="ph-title">Payment History</h1>
          <p className="ph-subtitle">Review and manage your historical fee transactions and receipts.</p>
        </div>
        <button className="ph-export-btn">
          <Download size={15} /> Export CSV
        </button>
      </div>

      {/* ── Filters ── */}
      <div className="ph-filters-card">
        <div className="ph-filters-grid">
          <div className="ph-filter-group">
            <label className="ph-filter-label">SEARCH</label>
            <div className="ph-input-wrap">
              <Search size={14} className="ph-input-icon" />
              <input
                type="text"
                className="ph-input ph-input--icon"
                placeholder="Receipt ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="ph-filter-group">
            <label className="ph-filter-label">DATE RANGE</label>
            <div className="ph-input-wrap">
              <Calendar size={14} className="ph-input-icon" />
              <input type="date" className="ph-input ph-input--icon" />
            </div>
          </div>
          <div className="ph-filter-group">
            <label className="ph-filter-label">METHOD</label>
            <select
              className="ph-select"
              value={method}
              onChange={(e) => setMethod(e.target.value)}
            >
              <option value="">All Methods</option>
              <option value="UPI">UPI</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
            </select>
          </div>
          <div className="ph-filter-group">
            <label className="ph-filter-label">STATUS</label>
            <select
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

      {/* ── Table Card ── */}
      <div className="ph-table-card">
        <div className="ph-table-header">
          <div>
            <h3 className="ph-table-title">Recent Transactions</h3>
            <p className="ph-table-sub">Showing {pageData.length} of {filtered.length} transactions</p>
          </div>
          <div className="ph-rows-label">Rows per page: <strong>{ROWS_PER_PAGE}</strong></div>
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
              {pageData.map((txn) => {
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
                    <td className="ph-date">{txn.date}</td>
                    <td className="ph-amount">{fmt(txn.amount)}</td>
                    <td>
                      <div className="ph-method">
                        <span className="ph-method-icon">⊟</span>
                        {txn.method}
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
              {pageData.length === 0 && (
                <tr>
                  <td colSpan={6} className="ph-empty">No transactions found for the selected filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="ph-pagination">
          <span className="ph-page-info">
            Showing <strong>{(page - 1) * ROWS_PER_PAGE + 1}–{Math.min(page * ROWS_PER_PAGE, filtered.length)}</strong> of <strong>{filtered.length}</strong> transactions
          </span>
          <div className="ph-page-controls">
            <button
              className="ph-page-btn"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft size={15} />
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                className={`ph-page-btn ${page === p ? 'ph-page-active' : ''}`}
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
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Summary Cards ── */}
      <div className="ph-summary-row">
        <div className="ph-summary-card">
          <div className="ph-sum-icon"><Clock size={20} /></div>
          <div>
            <p className="ph-sum-label">Total Paid (FY 2023-24)</p>
            <p className="ph-sum-big">{fmt(totalPaid)}</p>
            <p className="ph-sum-sub">85% of total annual fees settled</p>
          </div>
        </div>
        <div className="ph-summary-card">
          <div className="ph-sum-icon ph-sum-icon--warn"><Clock size={20} /></div>
          <div>
            <p className="ph-sum-label">Pending Verification</p>
            <p className="ph-sum-big">{fmt(pendingAmt)}</p>
            <p className="ph-sum-sub">1 transaction awaiting approval</p>
          </div>
        </div>
        <div className="ph-summary-card">
          <div className="ph-sum-icon ph-sum-icon--blue"><Calendar size={20} /></div>
          <div>
            <p className="ph-sum-label">Last Payment Date</p>
            <p className="ph-sum-big ph-sum-big--date">{lastPayment?.date}</p>
            <p className="ph-sum-sub">Successful UPI transaction</p>
          </div>
        </div>
      </div>

      {/* ── Reconciliation Notice ── */}
      <div className="ph-reconcile-card">
        <div className="ph-reconcile-left">
          <AlertCircle size={18} color="#6B7280" />
          <div>
            <p className="ph-reconcile-title">Reconciliation Notice</p>
            <p className="ph-reconcile-msg">
              If you find any discrepancy in your payment records, please raise a support ticket within 7 days of the transaction date for reconciliation.
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