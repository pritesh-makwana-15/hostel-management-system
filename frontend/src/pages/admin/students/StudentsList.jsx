import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Plus, Eye, Edit, Home as HomeIcon, Trash2, X } from 'lucide-react';
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
  const queryClient = useQueryClient();

  const [toast, setToast] = useState(null); // { message, type }

  // ── Filters State ──────────────────────────────────────────
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

  // ── React Query: Fetch ────────────────────────────────────
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-students'],
    queryFn: async () => {
      const res = await adminStudentApi.getAll();
      const students = res.data.data;
      return Array.isArray(students) ? students : (students?.content || []);
    },
  });

  // ── React Query: Mutations ────────────────────────────────
  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => adminStudentApi.updateStatus(id, status),
    onSuccess: (res, variables) => {
      queryClient.invalidateQueries(['admin-students']);
      showToast(`Student updated successfully.`);
    },
    onError: () => showToast('Failed to update status.', 'error'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => adminStudentApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-students']);
      showToast('Student deleted successfully.');
    },
    onError: (error) => {
      console.error('Delete student error:', error);
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      console.error('Error data stringified:', JSON.stringify(error.response?.data, null, 2));
      console.error('Error message:', error.response?.data?.message);
      console.error('Full error:', error);
      showToast('Failed to delete student.', 'error');
    },
  });

  // ── Handlers ──────────────────────────────────────────────
  const deleteStudent = (student) => {
    if (!window.confirm(`Are you sure you want to delete ${student.name}?\n\nThis action cannot be undone and will remove all student data including:\n- Personal information\n- Academic records\n- Room assignments\n- Fee records`)) return;
    deleteMutation.mutate(student.id);
  };

  if (isLoading) return <div className="sl-loading">Loading students...</div>;
  if (error) return <div className="sl-error">Failed to load students.</div>;

  const students = data || [];

  // ── Unique course & room options ──────────────────────────
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
    setSearchTerm(''); setFilterCourse(''); setFilterRoom(''); setFilterStatus(''); setCurrentPage(1);
  };

  return (
    <div className="sl-page">
      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="sl-header">
        <div className="sl-header-left">
          <div className="sl-breadcrumb">
            <span>Dashboard</span>
            <span className="sl-breadcrumb-sep">›</span>
            <span className="sl-breadcrumb-active">Students</span>
          </div>
          <h1 className="sl-title">Students</h1>
        </div>
        <button onClick={() => navigate('/admin/students/add')} className="sl-btn-primary">
          <Plus size={16} /> Add Student
        </button>
      </div>

      {/* Filters */}
      <div className="sl-filters-card">
        <div className="sl-filters-grid">
          <div className="sl-filter-group">
            <div className="sl-search-icon"><Search size={16} /></div>
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="sl-search-input sl-filter-input"
            />
          </div>
          <select
            value={filterCourse}
            onChange={e => { setFilterCourse(e.target.value); setCurrentPage(1); }}
            className="sl-filter-select"
          >
            <option value="">All Courses</option>
            {courseOptions.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select
            value={filterRoom}
            onChange={e => { setFilterRoom(e.target.value); setCurrentPage(1); }}
            className="sl-filter-select"
          >
            <option value="">All Rooms</option>
            {roomOptions.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <select
            value={filterStatus}
            onChange={e => { setFilterStatus(e.target.value); setCurrentPage(1); }}
            className="sl-filter-select"
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="On Leave">On Leave</option>
          </select>
        </div>
        <div className="sl-filters-actions">
          <button onClick={handleReset} className="sl-btn-reset">Reset Filters</button>
          <div className="sl-results-count">
            {filtered.length} of {students.length} students
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="sl-table-card">
        <div className="sl-table-responsive">
          <table className="sl-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Student</th>
                <th>Course</th>
                <th>Room</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {current.length === 0 ? (
                <tr>
                  <td colSpan="6" className="sl-empty">No students found</td>
                </tr>
              ) : (
                current.map((student) => (
                  <tr key={student.id} className="sl-row">
                    <td className="sl-td-id">#{student.id}</td>
                    <td>
                      <div className="sl-student-cell">
                        <img src={student.photoUrl || '/default-avatar.png'} alt="" className="sl-avatar" />
                        <div>
                          <div className="sl-student-name">{student.name}</div>
                          <div className="sl-student-email">{student.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="sl-td">{student.course}</td>
                    <td className="sl-td">{student.roomNo}</td>
                    <td><StatusBadge status={student.status} /></td>
                    <td>
                      <div className="sl-actions">
                        <button onClick={() => navigate(`/admin/students/profile/${student.id}`)} className="sl-action-btn" title="View Profile">
                          <Eye size={16} />
                        </button>
                        <button onClick={() => navigate(`/admin/students/edit/${student.id}`)} className="sl-action-btn" title="Edit Student">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => navigate(`/admin/students/assign/${student.id}`)} className="sl-action-btn" title="Assign Room">
                          <HomeIcon size={16} />
                        </button>
                        <button
                          onClick={() => deleteStudent(student)}
                          disabled={deleteMutation.isPending}
                          className="sl-action-btn sl-action-btn--delete"
                          title="Delete Student"
                        >
                          {deleteMutation.isPending ? (
                            <div className="sl-spinner" />
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="sl-pagination">
            <button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="sl-page-btn"
            >
              ‹ Previous
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`sl-page-num ${currentPage === i + 1 ? 'sl-page-num--active' : ''}`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="sl-page-btn"
            >
              Next ›
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentsList;