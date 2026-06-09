import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, FileText, Send, CreditCard,
  ChevronLeft, ChevronRight, RefreshCw
} from 'lucide-react';
import { adminFeesApi } from '../../../services/adminFeeApi';
import '../../../styles/admin/fees/studentFeeRecords.css';

const hostelList = ['All Hostels'];
const statusList = ['All Status', 'PAID', 'PARTIAL', 'PENDING'];

const monthFromCycle = (cycle) => {
  if (!cycle) return 'Unknown';
  const parts = String(cycle).split('-');
  if (parts.length === 2) {
    const year = Number(parts[0]);
    const month = Number(parts[1]);
    if (!Number.isNaN(year) && !Number.isNaN(month)) {
      return new Date(year, month - 1, 1).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
    }
  }
  return cycle;
};

const StudentFeeRecords = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [hostel, setHostel] = useState('All Hostels');
  const [status, setStatus] = useState('All Status');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [records, setRecords] = useState([]);
  const perPage = 5;

  const loadRecords = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await adminFeesApi.getAllRecords();
      const rows = Array.isArray(response?.data?.data) ? response.data.data : [];
      setRecords(rows);
    } catch (e) {
      console.error('Failed to load student fee records', e);
      setError(e?.response?.data?.message || 'Unable to load student fee records.');
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  const hostels = useMemo(() => {
    const values = [...new Set(records.map((r) => r.hostelBlock).filter(Boolean))];
    return [...hostelList, ...values];
  }, [records]);

  const monthList = useMemo(() => {
    const values = [...new Set(records.map((r) => monthFromCycle(r.academicCycle)).filter(Boolean))];
    return values;
  }, [records]);

  const [month, setMonth] = useState('All Months');

  const filtered = useMemo(() => {
    return records.filter((r) => {
      const q = search.trim().toLowerCase();
      const recordStatus = String(r.status || '').toUpperCase();
      const recordMonth = monthFromCycle(r.academicCycle);

      const matchSearch =
        !q ||
        String(r.studentName || '').toLowerCase().includes(q) ||
        String(r.enrollmentNo || '').toLowerCase().includes(q);
      const matchHostel = hostel === 'All Hostels' || String(r.hostelBlock || '') === hostel;
      const matchStatus = status === 'All Status' || recordStatus === status;
      const matchMonth = month === 'All Months' || recordMonth === month;

      return matchSearch && matchHostel && matchStatus && matchMonth;
    });
  }, [records, search, hostel, status, month]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * perPage, safePage * perPage);

  const getInitials = (name) => String(name || 'NA').split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
  const avatarColors = ['#1F3C88', '#2BBBAD', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  const statusBadge = (value) => {
    const s = String(value || '').toUpperCase();
    const map = { PAID: 'badge-paid', PARTIAL: 'badge-pending', PENDING: 'badge-overdue' };
    return `status-badge ${map[s] || ''}`;
  };

  return (
    <div className="student-fee-records-page">
      <div className="page-header">
        <div className="page-header-left">
          <div className="breadcrumb">
            <span>Dashboard</span><span className="breadcrumb-sep">›</span>
            <span>Fees</span><span className="breadcrumb-sep">›</span>
            <span className="breadcrumb-active">Student Records</span>
          </div>
          <h1 className="page-title">Student Fee Records</h1>
        </div>
        <div className="page-header-actions">
          <button className="btn-secondary"><FileText size={15} /> Export Report</button>
          <button className="btn-secondary"><Send size={15} /> Send Payment Reminder</button>
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
            <label className="filter-label" htmlFor="admin-student-fee-search">SEARCH STUDENT</label>
            <div className="input-wrap">
              <Search size={15} className="input-icon" />
              <input
                id="admin-student-fee-search"
                className="filter-input"
                placeholder="Enter name or Student ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="filter-col">
            <label className="filter-label" htmlFor="admin-student-fee-hostel">HOSTEL</label>
            <select id="admin-student-fee-hostel" className="filter-select" value={hostel} onChange={(e) => setHostel(e.target.value)}>
              {hostels.map((h) => <option key={h}>{h}</option>)}
            </select>
          </div>
          <div className="filter-col">
            <label className="filter-label" htmlFor="admin-student-fee-status">STATUS</label>
            <select id="admin-student-fee-status" className="filter-select" value={status} onChange={(e) => setStatus(e.target.value)}>
              {statusList.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="filter-col">
            <label className="filter-label" htmlFor="admin-student-fee-month">MONTH</label>
            <select id="admin-student-fee-month" className="filter-select" value={month} onChange={(e) => setMonth(e.target.value)}>
              <option>All Months</option>
              {monthList.map((m) => <option key={m}>{m}</option>)}
            </select>
          </div>
          <div className="filter-col filter-col-actions">
            <button className="btn-primary filter-btn" onClick={() => setPage(1)}>Apply Filters</button>
            <button
              className="btn-reset"
              onClick={() => {
                setSearch('');
                setHostel('All Hostels');
                setStatus('All Status');
                setMonth('All Months');
                setPage(1);
              }}
            >
              <RefreshCw size={14} />
            </button>
          </div>
        </div>
      </div>

      <div className="table-card">
        <div className="table-responsive">
          <table className="fees-table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Student Name</th>
                <th>Hostel</th>
                <th>Month</th>
                <th>Total</th>
                <th>Balance</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {!loading && paged.map((r, i) => (
                <tr key={r.feeId || `${r.studentId}-${r.academicCycle}-${i}`}>
                  <td className="str-id">{r.enrollmentNo || '-'}</td>
                  <td>
                    <div className="student-cell">
                      <div className="avatar-circle" style={{ background: `${avatarColors[i % avatarColors.length]}20`, color: avatarColors[i % avatarColors.length] }}>
                        {getInitials(r.studentName)}
                      </div>
                      <span className="student-name">{r.studentName || '-'}</span>
                    </div>
                  </td>
                  <td>{r.hostelBlock || '-'}</td>
                  <td>{monthFromCycle(r.academicCycle)}</td>
                  <td className="amount-cell">₹{Number(r.totalFee || 0).toLocaleString('en-IN')}</td>
                  <td className="amount-cell">₹{Number(r.balance || 0).toLocaleString('en-IN')}</td>
                  <td><span className={statusBadge(r.status)}>{String(r.status || '-').toUpperCase()}</span></td>
                  <td>
                    <div className="record-actions">
                      <button className="action-text-btn" onClick={() => navigate('/admin/fees/history')}>
                        <FileText size={14} /> View Payments
                      </button>
                      <button className="action-text-btn action-record" onClick={() => navigate('/admin/fees/history')}>
                        <CreditCard size={14} /> Verify Payment
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {(loading || paged.length === 0) && (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '20px', color: '#6B7280' }}>
                    {loading ? 'Loading records...' : 'No fee records found.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="table-footer">
          <span className="showing-text">
            Showing {filtered.length === 0 ? 0 : (safePage - 1) * perPage + 1}-{Math.min(safePage * perPage, filtered.length)} of {filtered.length} records
          </span>
          <div className="pagination">
            <button className="pag-arrow" onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={safePage === 1}>
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((n) => (
              <button key={n} className={`pag-num ${safePage === n ? 'active' : ''}`} onClick={() => setPage(n)}>{n}</button>
            ))}
            {totalPages > 5 && <span className="pag-dots">...</span>}
            {totalPages > 5 && (
              <button className={`pag-num ${safePage === totalPages ? 'active' : ''}`} onClick={() => setPage(totalPages)}>{totalPages}</button>
            )}
            <button className="pag-arrow" onClick={() => setPage((p) => Math.min(p + 1, totalPages))} disabled={safePage === totalPages}>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentFeeRecords;
