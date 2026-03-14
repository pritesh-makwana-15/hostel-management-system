import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Filter, Download, Plus, Edit, PowerOff,
  Shield, Layers, Clock, MoreVertical, ChevronLeft, ChevronRight
} from 'lucide-react';
import { feeStructures } from '../../../data/feesData';
import '../../../styles/admin/fees/feeStructure.css';

const FeeStructure = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 5;

  const filtered = feeStructures.filter(s =>
    s.id.toLowerCase().includes(search.toLowerCase()) ||
    s.hostelName.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / perPage);
  const paged = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  return (
    <div className="fee-structure-page">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-left">
          <div className="breadcrumb">
            <span>Dashboard</span><span className="breadcrumb-sep">›</span>
            <span>Fees</span><span className="breadcrumb-sep">›</span>
            <span className="breadcrumb-active">Fee Structure</span>
          </div>
          <h1 className="page-title">Fee Structure Setup</h1>
          <p className="page-sub">Manage and define fee configurations for different hostels and room categories.</p>
        </div>
        <button className="btn-primary" onClick={() => navigate('/admin/fees/structure/new')}>
          <Plus size={16} /> Add New Structure
        </button>
      </div>

      {/* Table Card */}
      <div className="table-card">
        {/* Toolbar */}
        <div className="table-toolbar">
          <div className="search-wrap">
            <Search size={16} className="search-icon" />
            <input
              className="search-input"
              placeholder="Search by ID or Hostel..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="toolbar-right">
            <button className="btn-outline"><Filter size={14} /> Filters</button>
            <button className="btn-outline"><Download size={14} /> Export CSV</button>
            <button className="btn-icon"><MoreVertical size={16} /></button>
          </div>
        </div>

        {/* Table */}
        <div className="table-responsive">
          <table className="fees-table">
            <thead>
              <tr>
                <th>Structure ID</th>
                <th>Hostel Name</th>
                <th>Room Type</th>
                <th>Monthly Fee ($)</th>
                <th>Security Deposit ($)</th>
                <th>Utilities ($)</th>
                <th>Late Fee ($)</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((s) => (
                <tr key={s.id}>
                  <td className="str-id">{s.id}</td>
                  <td className="hostel-name">{s.hostelName}</td>
                  <td><span className={`room-type-badge ${s.roomType === 'AC' ? 'badge-ac' : 'badge-nonac'}`}>{s.roomType}</span></td>
                  <td className="fee-amount">{s.monthlyFee.toLocaleString()}</td>
                  <td>{s.securityDeposit.toLocaleString()}</td>
                  <td>{s.utilities}</td>
                  <td className="late-fee-amount">{s.lateFee}</td>
                  <td>
                    <span className={`status-badge ${s.status === 'Active' ? 'badge-active' : 'badge-inactive'}`}>
                      {s.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-btn" title="Edit" onClick={() => navigate('/admin/fees/structure/new')}>
                        <Edit size={16} />
                      </button>
                      <button className="action-btn" title="Deactivate">
                        <PowerOff size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="table-footer">
          <span className="showing-text">Showing 1 to {paged.length} of {filtered.length} entries</span>
          <div className="pagination">
            <button className="pag-btn" onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>
              Previous
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button key={i} className={`pag-num ${currentPage === i + 1 ? 'active' : ''}`} onClick={() => setCurrentPage(i + 1)}>
                {i + 1}
              </button>
            ))}
            <button className="pag-btn" onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="info-cards-grid">
        <div className="info-card info-card-blue">
          <div className="info-card-icon"><Shield size={18} /></div>
          <div>
            <h4 className="info-card-title">Security Deposits</h4>
            <p className="info-card-text">One-time refundable security deposits are typically collected at the time of admission. These are not included in monthly billing cycles.</p>
          </div>
        </div>
        <div className="info-card info-card-teal">
          <div className="info-card-icon"><Layers size={18} /></div>
          <div>
            <h4 className="info-card-title">Room Categories</h4>
            <p className="info-card-text">Fee structures are linked to Room Types. Changing a room type for a student will automatically update their future billing structures.</p>
          </div>
        </div>
        <div className="info-card info-card-amber">
          <div className="info-card-icon"><Clock size={18} /></div>
          <div>
            <h4 className="info-card-title">Late Fee Rules</h4>
            <p className="info-card-text">Late fees are applied automatically 5 days after the due date. You can override specific penalties in the individual student ledger.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeeStructure;