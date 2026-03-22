// src/pages/warden/StudentsList.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Eye, Pencil, MoreVertical, Download } from 'lucide-react';
import {
  wardenStudentsData,
  getStatusColor,
} from '../../../data/wardenStudentsData';
import '../../../styles/warden/student/students-list.css';

const STUDENTS_PER_PAGE = 5;

const StudentsList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm]   = useState('');
  const [blockFloor, setBlockFloor]   = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenu, setOpenMenu]       = useState(null);

  /* ── Filter ──────────────────────────────────────────── */
  const filtered = wardenStudentsData.filter((s) => {
    const matchSearch =
      s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.enrollmentNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchBlock =
      !blockFloor ||
      s.hostelBlock.toLowerCase().includes(blockFloor.toLowerCase()) ||
      s.floor.toLowerCase().includes(blockFloor.toLowerCase());
    return matchSearch && matchBlock;
  });

  /* ── Pagination ───────────────────────────────────────── */
  const totalPages   = Math.max(1, Math.ceil(filtered.length / STUDENTS_PER_PAGE));
  const safePage     = Math.min(currentPage, totalPages);
  const start        = (safePage - 1) * STUDENTS_PER_PAGE;
  const pageStudents = filtered.slice(start, start + STUDENTS_PER_PAGE);

  const handleApply = () => setCurrentPage(1);
  const handleReset = () => { setSearchTerm(''); setBlockFloor(''); setCurrentPage(1); };

  /* ── Pagination button helpers ────────────────────────── */
  const buildPages = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1, 2, 3, '...', totalPages);
    }
    return pages;
  };

  /* ── Export CSV (simple) ──────────────────────────────── */
  const handleExport = () => {
    const header = 'Student ID,Full Name,Enrollment No,Phone,Room,Bed,Status';
    const rows = wardenStudentsData.map(
      (s) => `${s.id},${s.fullName},${s.enrollmentNo},${s.phone},${s.roomNo},${s.bedNo},${s.status}`
    );
    const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = 'students.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="wsl-page" onClick={() => setOpenMenu(null)}>

      {/* ── Page Header ─────────────────────────────────── */}
      <div className="wsl-header">
        <div className="wsl-header-left">
          <div className="wsl-breadcrumb">
            <span>Dashboard</span>
            <span className="wsl-bc-sep">›</span>
            <span className="wsl-bc-active">Students</span>
          </div>
          <h1 className="wsl-title">Students</h1>
        </div>
        <div className="wsl-header-right">
          <span className="wsl-total-badge">
            Total Students: {wardenStudentsData.length.toLocaleString()}
          </span>
          <button
            className="wsl-btn-primary"
            onClick={() => navigate('/warden/students/add')}
          >
            <Plus size={18} />
            Add New Student
          </button>
        </div>
      </div>

      {/* ── Filter Card ─────────────────────────────────── */}
      <div className="wsl-filter-card">
        <div className="wsl-filter-grid">
          <div className="wsl-filter-group">
            <label className="wsl-filter-label">QUICK SEARCH</label>
            <div className="wsl-search-wrap">
              <Search size={16} className="wsl-search-icon" />
              <input
                type="text"
                placeholder="Search by name or enrollment no."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="wsl-search-input"
              />
            </div>
          </div>
          <div className="wsl-filter-group">
            <label className="wsl-filter-label">BLOCK / FLOOR</label>
            <input
              type="text"
              placeholder="e.g. Block A, 2nd Floor"
              value={blockFloor}
              onChange={(e) => setBlockFloor(e.target.value)}
              className="wsl-filter-input"
            />
          </div>
          <div className="wsl-filter-actions">
            <button className="wsl-btn-primary" onClick={handleApply}>
              Apply Filters
            </button>
            <button className="wsl-btn-secondary" onClick={handleReset}>
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* ── Table Card ──────────────────────────────────── */}
      <div className="wsl-table-card">
        <div className="wsl-table-header">
          <h2 className="wsl-table-title">Student Records</h2>
          <button className="wsl-export-btn" onClick={handleExport}>
            <Download size={16} />
            Export CSV
          </button>
        </div>

        <div className="wsl-table-wrap">
          <table className="wsl-table">
            <thead>
              <tr>
                <th>STUDENT ID</th>
                <th>PHOTO</th>
                <th>FULL NAME</th>
                <th>ENROLLMENT NO</th>
                <th>PHONE</th>
                <th>ROOM</th>
                <th>BED</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {pageStudents.length === 0 ? (
                <tr>
                  <td colSpan={9} className="wsl-empty">No students found.</td>
                </tr>
              ) : (
                pageStudents.map((s) => {
                  const color = getStatusColor(s.status);
                  return (
                    <tr key={s.id}>
                      <td className="wsl-td-id">{s.id}</td>
                      <td>
                        <img src={s.photo} alt={s.fullName} className="wsl-photo" />
                      </td>
                      <td className="wsl-td-name">{s.fullName}</td>
                      <td>{s.enrollmentNo}</td>
                      <td>{s.phone}</td>
                      <td>{s.roomNo}</td>
                      <td>{s.bedNo}</td>
                      <td>
                        <span
                          className="wsl-status-badge"
                          style={{ color, background: `${color}18` }}
                        >
                          {s.status.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <div className="wsl-actions" onClick={(e) => e.stopPropagation()}>
                          <button
                            className="wsl-action-btn"
                            title="View Profile"
                            onClick={() => navigate(`/warden/students/profile/${s.id}`)}
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            className="wsl-action-btn"
                            title="Edit Student"
                            onClick={() => navigate(`/warden/students/edit/${s.id}`)}
                          >
                            <Pencil size={16} />
                          </button>
                          <div className="wsl-more-wrap">
                            <button
                              className="wsl-action-btn"
                              title="More"
                              onClick={() =>
                                setOpenMenu(openMenu === s.id ? null : s.id)
                              }
                            >
                              <MoreVertical size={16} />
                            </button>
                            {openMenu === s.id && (
                              <div className="wsl-dropdown">
                                <button className="wsl-dropdown-item">Change Status</button>
                                <button className="wsl-dropdown-item wsl-dropdown-danger">
                                  Deactivate
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ──────────────────────────────────── */}
        <div className="wsl-pagination">
          <span className="wsl-pagination-info">
            Showing <strong>{start + 1}–{Math.min(start + STUDENTS_PER_PAGE, filtered.length)}</strong> of{' '}
            <strong>{filtered.length}</strong> students
          </span>
          <div className="wsl-pagination-controls">
            <button
              className="wsl-page-btn"
              disabled={safePage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              ‹ Previous
            </button>
            {buildPages().map((p, i) =>
              p === '...' ? (
                <span key={`dot-${i}`} className="wsl-page-dots">...</span>
              ) : (
                <button
                  key={p}
                  className={`wsl-page-num ${safePage === p ? 'wsl-page-active' : ''}`}
                  onClick={() => setCurrentPage(p)}
                >
                  {p}
                </button>
              )
            )}
            <button
              className="wsl-page-btn"
              disabled={safePage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next ›
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Cards ──────────────────────────────────── */}
      <div className="wsl-mobile-list">
        {pageStudents.map((s) => {
          const color = getStatusColor(s.status);
          return (
            <div key={s.id} className="wsl-mobile-card">
              <div className="wsl-mobile-top">
                <img src={s.photo} alt={s.fullName} className="wsl-mobile-photo" />
                <div className="wsl-mobile-info">
                  <p className="wsl-mobile-name">{s.fullName}</p>
                  <p className="wsl-mobile-enroll">{s.enrollmentNo}</p>
                </div>
                <span
                  className="wsl-status-badge"
                  style={{ color, background: `${color}18` }}
                >
                  {s.status.toUpperCase()}
                </span>
              </div>
              <div className="wsl-mobile-details">
                <div className="wsl-mobile-row"><span>Phone:</span><span>{s.phone}</span></div>
                <div className="wsl-mobile-row"><span>Room:</span><span>{s.roomNo} – {s.bedNo}</span></div>
              </div>
              <div className="wsl-mobile-btns">
                <button className="wsl-mobile-btn" onClick={() => navigate(`/warden/students/profile/${s.id}`)}>
                  <Eye size={15} /> View
                </button>
                <button className="wsl-mobile-btn" onClick={() => navigate(`/warden/students/edit/${s.id}`)}>
                  <Pencil size={15} /> Edit
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default StudentsList;