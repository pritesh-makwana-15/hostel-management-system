import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Eye, Edit, Home as HomeIcon, ShieldOff, ShieldCheck, X } from 'lucide-react';
import { adminStudentApi } from '../../../services/adminStudentApi';
import '../../../styles/admin/students/students-list.css';

// ── Toast Component ───────────────────────────────────────────
const Toast = ({ message, type, onClose }) => (
  <div className={`sl-toast sl-toast--${type}`}>
    <span>{message}</span>
    <button className="sl-toast-close" onClick={onClose}><X size={14} /></button>
  </div>
);

// ── Status Badge ──────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const map = {
    'Active':   { cls: 'sl-badge--active',   label: 'Active'   },
    'Inactive': { cls: 'sl-badge--inactive', label: 'Inactive' },
    'On Leave': { cls: 'sl-badge--onleave',  label: 'On Leave' },
  };
  const cfg = map[status] || { cls: 'sl-badge--inactive', label: status || 'Unknown' };
  return <span className={`sl-badge ${cfg.cls}`}>{cfg.label}</span>;
};

const StudentsList = () => {
  const navigate = useNavigate();

  const [students, setStudents]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState('');
  const [togglingId, setTogglingId]   = useState(null); // which row is being toggled
  const [toast, setToast]             = useState(null); // { message, type }

  // ── Filters ───────────────────────────────────────────────
  const [searchTerm, setSearchTerm]   = useState('');
  const [filterCourse, setFilterCourse] = useState('');
  const [filterRoom, setFilterRoom]   = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 5;

  // ── Toast helper ──────────────────────────────────────────
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Fetch students ────────────────────────────────────────
  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      const res = await adminStudentApi.getAll();
      setStudents(res.data.data || []);
    } catch {
      setError('Failed to load students. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchStudents(); }, [fetchStudents]);

  // ── Toggle Active ↔ Inactive ──────────────────────────────
  const toggleStatus = async (student) => {
    const newStatus = student.status === 'Active' ? 'Inactive' : 'Active';
    const action    = newStatus === 'Inactive' ? 'deactivate' : 'activate';

    if (!window.confirm(`Are you sure you want to ${action} ${student.name}?`)) return;

    setTogglingId(student.id);
    try {
      await adminStudentApi.updateStatus(student.id, newStatus);
      // Update UI immediately without re-fetching
      setStudents(prev =>
        prev.map(s => s.id === student.id ? { ...s, status: newStatus } : s)
      );
      showToast(
        `Student ${student.name} ${action}d successfully.`,
        newStatus === 'Active' ? 'success' : 'warning'
      );
    } catch {
      showToast(`Failed to ${action} student. Please try again.`, 'error');
    } finally {
      setTogglingId(null);
    }
  };

  // ── Delete ────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    try {
      await adminStudentApi.delete(id);
      setStudents(prev => prev.filter(s => s.id !== id));
      showToast('Student deleted successfully.', 'success');
    } catch {
      showToast('Failed to delete student.', 'error');
    }
  };

  // ── Unique course & room options from data ────────────────
  const courseOptions = [...new Set(students.map(s => s.course).filter(Boolean))];
  const roomOptions   = [...new Set(students.map(s => s.roomNo).filter(Boolean))];

  // ── Filter logic ──────────────────────────────────────────
  const filtered = students.filter(s => {
    const matchSearch = !searchTerm ||
      s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.enrollmentNo?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCourse = !filterCourse || s.course === filterCourse;
    const matchRoom   = !filterRoom   || s.roomNo === filterRoom;
    const matchStatus = !filterStatus || s.status === filterStatus;
    return matchSearch && matchCourse && matchRoom && matchStatus;
  });

  const indexOfLast  = currentPage * studentsPerPage;
  const indexOfFirst = indexOfLast - studentsPerPage;
  const current      = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages   = Math.ceil(filtered.length / studentsPerPage);

  const handleReset = () => {
    setSearchTerm('');
    setFilterCourse('');
    setFilterRoom('');
    setFilterStatus('');
    setCurrentPage(1);
  };

  if (loading) return <div className="sl-loading">Loading students...</div>;
  if (error)   return <div className="sl-error">{error}</div>;

  return (
    <div className="sl-page">

      {/* ── Toast ── */}
      {toast && (
        <Toast message={toast.message} type={toast.type}
          onClose={() => setToast(null)} />
      )}

      {/* ── Header ── */}
      <div className="sl-header">
        <div className="sl-header-left">
          <h1 className="sl-title">Students</h1>
          <div className="sl-breadcrumb">
            <span>Dashboard</span>
            <span className="sl-breadcrumb-sep">›</span>
            <span className="sl-breadcrumb-active">Students</span>
          </div>
        </div>
        <button className="sl-btn-primary" onClick={() => navigate('/admin/students/add')}>
          <Plus size={18} /> Add Student
        </button>
      </div>

      {/* ── Filters ── */}
      <div className="sl-filters-card">
        <div className="sl-filters-grid">

          {/* Search */}
          <div className="sl-filter-group sl-filter-search">
            <Search size={16} className="sl-search-icon" />
            <input type="text" placeholder="Search name, email, enrollment..."
              value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="sl-filter-input sl-search-input" />
          </div>

          {/* Course */}
          <div className="sl-filter-group">
            <select value={filterCourse}
              onChange={e => { setFilterCourse(e.target.value); setCurrentPage(1); }}
              className="sl-filter-select">
              <option value="">All Courses</option>
              {courseOptions.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Room */}
          <div className="sl-filter-group">
            <select value={filterRoom}
              onChange={e => { setFilterRoom(e.target.value); setCurrentPage(1); }}
              className="sl-filter-select">
              <option value="">All Rooms</option>
              {roomOptions.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          {/* Status */}
          <div className="sl-filter-group">
            <select value={filterStatus}
              onChange={e => { setFilterStatus(e.target.value); setCurrentPage(1); }}
              className="sl-filter-select">
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="On Leave">On Leave</option>
            </select>
          </div>

        </div>

        <div className="sl-filters-actions">
          <span className="sl-results-count">
            Showing {filtered.length} of {students.length} students
          </span>
          <button className="sl-btn-reset" onClick={handleReset}>Reset Filters</button>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="sl-table-card">
        <div className="sl-table-responsive">
          <table className="sl-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Student</th>
                <th>Phone</th>
                <th>Course</th>
                <th>Room</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {current.length === 0 ? (
                <tr>
                  <td colSpan="7" className="sl-empty">
                    No students found. Try adjusting your filters.
                  </td>
                </tr>
              ) : current.map(student => (
                <tr key={student.id} className="sl-row">
                  <td className="sl-td-id">{student.id}</td>
                  <td>
                    <div className="sl-student-cell">
                      <img
                        src={student.photoUrl ||
                          `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`}
                        alt={student.name}
                        className="sl-avatar"
                      />
                      <div>
                        <div className="sl-student-name">{student.name}</div>
                        <div className="sl-student-email">{student.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="sl-td">{student.phone || '—'}</td>
                  <td className="sl-td">{student.course || '—'}</td>
                  <td className="sl-td">{student.roomNo || '—'}</td>
                  <td>
                    <StatusBadge status={student.status} />
                  </td>
                  <td>
                    <div className="sl-actions">

                      {/* View */}
                      <button className="sl-action-btn" title="View Profile"
                        onClick={() => navigate(`/admin/students/profile/${student.id}`)}>
                        <Eye size={16} />
                      </button>

                      {/* Edit */}
                      <button className="sl-action-btn" title="Edit Student"
                        onClick={() => navigate(`/admin/students/edit/${student.id}`)}>
                        <Edit size={16} />
                      </button>

                      {/* Assign Room */}
                      <button className="sl-action-btn" title="Assign Room"
                        onClick={() => navigate(`/admin/students/assign/${student.id}`)}>
                        <HomeIcon size={16} />
                      </button>

                      {/* Toggle Status */}
                      <button
                        className={`sl-action-btn ${
                          student.status === 'Active'
                            ? 'sl-action-btn--deactivate'
                            : 'sl-action-btn--activate'
                        }`}
                        title={student.status === 'Active' ? 'Deactivate' : 'Activate'}
                        disabled={togglingId === student.id}
                        onClick={() => toggleStatus(student)}
                      >
                        {togglingId === student.id ? (
                          <span className="sl-spinner" />
                        ) : student.status === 'Active' ? (
                          <ShieldOff size={16} />
                        ) : (
                          <ShieldCheck size={16} />
                        )}
                      </button>

                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div className="sl-pagination">
            <button className="sl-page-btn"
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}>‹ Previous</button>
            {[...Array(totalPages)].map((_, i) => (
              <button key={i + 1}
                className={`sl-page-num ${currentPage === i + 1 ? 'sl-page-num--active' : ''}`}
                onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
            ))}
            <button className="sl-page-btn"
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}>Next ›</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentsList;