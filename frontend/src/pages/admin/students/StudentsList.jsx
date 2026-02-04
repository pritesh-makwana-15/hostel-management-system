import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Eye, Edit, Home as HomeIcon, Target } from 'lucide-react';
import { studentsData, hostelBlocks, roomTypes, statusOptions } from '../../../data/studentsData';
import '../../../styles/admin/students/students-list.css';

const StudentsList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    hostelBlock: '',
    roomType: '',
    status: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 5;

  // Filter students based on search and filters
  const filteredStudents = studentsData.filter(student => {
    const matchesSearch = 
      student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.enrollmentNo.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesBlock = !filters.hostelBlock || student.hostelBlock === filters.hostelBlock;
    const matchesRoomType = !filters.roomType || student.roomType === filters.roomType;
    const matchesStatus = !filters.status || student.status === filters.status;
    
    return matchesSearch && matchesBlock && matchesRoomType && matchesStatus;
  });

  // Pagination
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  const handleResetFilters = () => {
    setSearchTerm('');
    setFilters({
      hostelBlock: '',
      roomType: '',
      status: ''
    });
  };

  const getStatusColor = (status) => {
    const statusOption = statusOptions.find(opt => opt.name === status);
    return statusOption ? statusOption.color : '#6B7280';
  };

  return (
    <div className="students-list-page">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Students</h1>
          <div className="breadcrumb">
            <span>Dashboard</span>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-active">Students</span>
          </div>
        </div>
        <button 
          className="btn-primary"
          onClick={() => navigate('/admin/students/add')}
        >
          <Plus size={20} />
          Add Student
        </button>
      </div>

      {/* Filters Section */}
      <div className="filters-card">
        <div className="filters-grid">
          <div className="filter-group">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Search by Name or Enrollment No."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="filter-input search-input"
            />
          </div>

          <div className="filter-group">
            <select
              value={filters.hostelBlock}
              onChange={(e) => setFilters({...filters, hostelBlock: e.target.value})}
              className="filter-select"
            >
              <option value="">Hostel / Block</option>
              {hostelBlocks.map(block => (
                <option key={block.id} value={block.name}>{block.name}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <select
              value={filters.roomType}
              onChange={(e) => setFilters({...filters, roomType: e.target.value})}
              className="filter-select"
            >
              <option value="">Room Type</option>
              {roomTypes.map(type => (
                <option key={type.id} value={type.name}>{type.name}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="filter-select"
            >
              <option value="">Status</option>
              {statusOptions.map(status => (
                <option key={status.id} value={status.name}>{status.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="filters-actions">
          <button className="btn-secondary" onClick={handleResetFilters}>
            Reset
          </button>
          <button className="btn-primary">
            Apply Filters
          </button>
        </div>
      </div>

      {/* Students Table */}
      <div className="table-card">
        <div className="table-responsive">
          <table className="students-table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Photo</th>
                <th>Full Name</th>
                <th>Enrollment No</th>
                <th>Phone</th>
                <th>Room No</th>
                <th>Bed No</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentStudents.map((student) => (
                <tr key={student.id}>
                  <td>{student.id}</td>
                  <td>
                    <img 
                      src={student.photo} 
                      alt={student.fullName}
                      className="student-photo"
                    />
                  </td>
                  <td className="student-name">{student.fullName}</td>
                  <td>{student.enrollmentNo}</td>
                  <td>{student.phone}</td>
                  <td>{student.roomNo}</td>
                  <td>{student.bedNo}</td>
                  <td>
                    <span 
                      className="status-badge"
                      style={{ 
                        backgroundColor: `${getStatusColor(student.status)}15`,
                        color: getStatusColor(student.status)
                      }}
                    >
                      {student.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="action-btn"
                        onClick={() => navigate(`/admin/students/profile/${student.id}`)}
                        title="View Profile"
                      >
                        <Eye size={18} />
                      </button>
                      <button 
                        className="action-btn"
                        onClick={() => navigate(`/admin/students/edit/${student.id}`)}
                        title="Edit Student"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        className="action-btn"
                        onClick={() => navigate(`/admin/students/assign/${student.id}`)}
                        title="Assign Room"
                      >
                        <HomeIcon size={18} />
                      </button>
                      <button 
                        className="action-btn"
                        title="Change Status"
                      >
                        <Target size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button 
              className="pagination-btn"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              ‹ Previous
            </button>
            
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                className={`pagination-number ${currentPage === index + 1 ? 'active' : ''}`}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            
            <button 
              className="pagination-btn"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next ›
            </button>
          </div>
        )}
      </div>

      {/* Mobile Cards View */}
      <div className="mobile-cards">
        {currentStudents.map((student) => (
          <div key={student.id} className="student-mobile-card">
            <div className="mobile-card-header">
              <img 
                src={student.photo} 
                alt={student.fullName}
                className="mobile-photo"
              />
              <div className="mobile-info">
                <h3>{student.fullName}</h3>
                <p>{student.enrollmentNo}</p>
              </div>
              <span 
                className="status-badge"
                style={{ 
                  backgroundColor: `${getStatusColor(student.status)}15`,
                  color: getStatusColor(student.status)
                }}
              >
                {student.status}
              </span>
            </div>
            <div className="mobile-card-details">
              <div className="detail-row">
                <span className="detail-label">Phone:</span>
                <span>{student.phone}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Room:</span>
                <span>{student.roomNo} - {student.bedNo}</span>
              </div>
            </div>
            <div className="mobile-card-actions">
              <button 
                className="mobile-action-btn"
                onClick={() => navigate(`/admin/students/profile/${student.id}`)}
              >
                <Eye size={18} />
                View
              </button>
              <button 
                className="mobile-action-btn"
                onClick={() => navigate(`/admin/students/edit/${student.id}`)}
              >
                <Edit size={18} />
                Edit
              </button>
              <button 
                className="mobile-action-btn"
                onClick={() => navigate(`/admin/students/assign/${student.id}`)}
              >
                <HomeIcon size={18} />
                Assign
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentsList;