import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, ChevronDown, FileText, Send, Eye, CreditCard,
  MoreVertical, ChevronLeft, ChevronRight, RefreshCw
} from 'lucide-react';
import { studentFeeRecords } from '../../../data/feesData';
import '../../../styles/admin/fees/studentFeeRecords.css';

const hostelList  = ['All Hostels', 'North Wing Boys', 'South Wing Girls', 'Main Block'];
const statusList  = ['All Status', 'Paid', 'Pending', 'Overdue'];
const monthList   = ['Jan 2024', 'Feb 2024', 'Mar 2024', 'Apr 2024', 'May 2024', 'Jun 2024'];

const StudentFeeRecords = () => {
  const navigate = useNavigate();
  const [search,  setSearch]  = useState('');
  const [hostel,  setHostel]  = useState('All Hostels');
  const [status,  setStatus]  = useState('All Status');
  const [month,   setMonth]   = useState('Mar 2024');
  const [page,    setPage]    = useState(1);
  const perPage = 5;

  const filtered = studentFeeRecords.filter(r => {
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) || r.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = status === 'All Status' || r.status === status;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  const getInitials = (name) => name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const avatarColors = ['#1F3C88', '#2BBBAD', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  const statusBadge = (s) => {
    const map = { Paid: 'badge-paid', Pending: 'badge-pending', Overdue: 'badge-overdue' };
    return `status-badge ${map[s] || ''}`;
  };

  return (
    <div className="student-fee-records-page">
      {/* Header */}
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

      {/* Filters */}
      <div className="filters-card">
        <div className="filters-row">
          <div className="filter-col filter-col-search">
            <label className="filter-label">SEARCH STUDENT</label>
            <div className="input-wrap">
              <Search size={15} className="input-icon" />
              <input
                className="filter-input"
                placeholder="Enter name or Student ID..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="filter-col">
            <label className="filter-label">HOSTEL</label>
            <select className="filter-select" value={hostel} onChange={e => setHostel(e.target.value)}>
              {hostelList.map(h => <option key={h}>{h}</option>)}
            </select>
          </div>
          <div className="filter-col">
            <label className="filter-label">STATUS</label>
            <select className="filter-select" value={status} onChange={e => setStatus(e.target.value)}>
              {statusList.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="filter-col">
            <label className="filter-label">MONTH</label>
            <select className="filter-select" value={month} onChange={e => setMonth(e.target.value)}>
              {monthList.map(m => <option key={m}>{m}</option>)}
            </select>
          </div>
          <div className="filter-col filter-col-actions">
            <button className="btn-primary filter-btn" onClick={() => setPage(1)}>Apply Filters</button>
            <button className="btn-reset" onClick={() => { setSearch(''); setHostel('All Hostels'); setStatus('All Status'); setPage(1); }}>
              <RefreshCw size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="table-card">
        <div className="table-responsive">
          <table className="fees-table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Student Name</th>
                <th>Room</th>
                <th>Month</th>
                <th>Amount</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((r, i) => (
                <tr key={r.id}>
                  <td className="str-id">{r.id}</td>
                  <td>
                    <div className="student-cell">
                      <div className="avatar-circle" style={{ background: `${avatarColors[i % avatarColors.length]}20`, color: avatarColors[i % avatarColors.length] }}>
                        {getInitials(r.name)}
                      </div>
                      <span className="student-name">{r.name}</span>
                    </div>
                  </td>
                  <td>{r.room}</td>
                  <td>{r.month}</td>
                  <td className="amount-cell">₹{r.amount.toLocaleString()}</td>
                  <td>{r.dueDate}</td>
                  <td><span className={statusBadge(r.status)}>{r.status}</span></td>
                  <td>
                    <div className="record-actions">
                      <button className="action-text-btn" onClick={() => navigate('/admin/fees/generate-invoice')}>
                        <FileText size={14} /> View Invoice
                      </button>
                      <button className="action-text-btn action-record">
                        <CreditCard size={14} /> Record Payment
                      </button>
                      <button className="action-more"><MoreVertical size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="table-footer">
          <span className="showing-text">Showing 1-{paged.length} of {filtered.length} records</span>
          <div className="pagination">
            <button className="pag-arrow" onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1}>
              <ChevronLeft size={16} />
            </button>
            {[...Array(Math.min(totalPages, 5))].map((_, i) => (
              <button key={i} className={`pag-num ${page === i + 1 ? 'active' : ''}`} onClick={() => setPage(i + 1)}>{i + 1}</button>
            ))}
            {totalPages > 5 && <span className="pag-dots">...</span>}
            {totalPages > 5 && (
              <button className={`pag-num ${page === totalPages ? 'active' : ''}`} onClick={() => setPage(totalPages)}>{totalPages}</button>
            )}
            <button className="pag-arrow" onClick={() => setPage(p => Math.min(p + 1, totalPages))} disabled={page === totalPages}>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentFeeRecords;