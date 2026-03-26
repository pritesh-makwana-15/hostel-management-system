import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Eye, Edit, Home as HomeIcon } from 'lucide-react';
import { studentAPI } from '../../../services/api';
import '../../../styles/admin/students/students-list.css';

const StudentsList = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 5;

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await studentAPI.getAll();
      setStudents(res.data.data || []);
    } catch (err) {
      setError('Failed to load students. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    try {
      await studentAPI.delete(id);
      setStudents(prev => prev.filter(s => s.id !== id));
    } catch {
      alert('Failed to delete student.');
    }
  };

  const filtered = students.filter(s =>
    s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLast = currentPage * studentsPerPage;
  const indexOfFirst = indexOfLast - studentsPerPage;
  const current = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / studentsPerPage);

  if (loading) return <div className="loading">Loading students...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="students-list-page">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Students</h1>
          <div className="breadcrumb">
            <span>Dashboard</span>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-active">Students</span>
          </div>
        </div>
        <button className="btn-primary" onClick={() => navigate('/admin/students/add')}>
          <Plus size={20} /> Add Student
        </button>
      </div>

      <div className="filters-card">
        <div className="filter-group">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Search by Name or Email"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="filter-input search-input"
          />
        </div>
      </div>

      <div className="table-card">
        <div className="table-responsive">
          <table className="students-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Course</th>
                <th>Room</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {current.length === 0 ? (
                <tr><td colSpan="7" style={{textAlign:'center'}}>No students found.</td></tr>
              ) : current.map(student => (
                <tr key={student.id}>
                  <td>{student.id}</td>
                  <td className="student-name">{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.phone}</td>
                  <td>{student.course}</td>
                  <td>{student.roomId || '—'}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-btn"
                        onClick={() => navigate(`/admin/students/profile/${student.id}`)} title="View">
                        <Eye size={18} />
                      </button>
                      <button className="action-btn"
                        onClick={() => navigate(`/admin/students/edit/${student.id}`)} title="Edit">
                        <Edit size={18} />
                      </button>
                      <button className="action-btn"
                        onClick={() => navigate(`/admin/students/assign/${student.id}`)} title="Assign Room">
                        <HomeIcon size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <button className="pagination-btn"
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}>‹ Previous</button>
            {[...Array(totalPages)].map((_, i) => (
              <button key={i + 1}
                className={`pagination-number ${currentPage === i + 1 ? 'active' : ''}`}
                onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
            ))}
            <button className="pagination-btn"
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}>Next ›</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentsList;