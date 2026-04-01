import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, Eye, Pencil, MoreVertical, Download } from "lucide-react";
import { wardenStudentApi } from "../../../services/wardenStudentApi";
import "../../../styles/warden/student/students-list.css";

const STUDENTS_PER_PAGE = 5;

const StudentsList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [blockFloor, setBlockFloor] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenu, setOpenMenu] = useState(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["warden-students"],
    queryFn: async () => {
      const res = await wardenStudentApi.getAll();
      return res.data.data?.content || [];
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) =>
      wardenStudentApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries(["warden-students"]);
      setOpenMenu(null);
    },
  });

  if (isLoading)
    return <div className="wsl-loading">Loading students...</div>;

  if (error)
    return <div className="wsl-error">Failed to load students.</div>;

  const students = data || [];

  /* FILTER */
  const filtered = students.filter((s) => {
    const matchSearch =
      s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.enrollmentNo?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchBlock =
      !blockFloor ||
      s.hostelBlock?.toLowerCase().includes(blockFloor.toLowerCase()) ||
      s.floor?.toLowerCase().includes(blockFloor.toLowerCase());

    return matchSearch && matchBlock;
  });

  /* PAGINATION */
  const totalPages = Math.ceil(filtered.length / STUDENTS_PER_PAGE);
  const start = (currentPage - 1) * STUDENTS_PER_PAGE;
  const pageStudents = filtered.slice(start, start + STUDENTS_PER_PAGE);

  const handleReset = () => {
    setSearchTerm("");
    setBlockFloor("");
    setCurrentPage(1);
  };

  const handleExport = () => {
    const header = "ID,Name,Enrollment";
    const rows = students.map(
      (s) => `${s.id},${s.name},${s.enrollmentNo}`
    );

    const blob = new Blob([[header, ...rows].join("\n")], {
      type: "text/csv",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "students.csv";
    a.click();
  };

  return (
    <div className="wsl-page">

      {/* HEADER */}
      <div className="wsl-header">
        <div className="wsl-header-left">
          <div className="wsl-breadcrumb">
            <span>Warden</span>
            <span className="wsl-bc-sep">/</span>
            <span className="wsl-bc-active">Students</span>
          </div>
          <h1 className="wsl-title">Student Directory</h1>
        </div>
        <div className="wsl-header-right">
          <div className="wsl-total-badge">
            {students.length} Students
          </div>
        </div>
      </div>

      {/* FILTER */}
      <div className="wsl-filter-card">
        <div className="wsl-filter-grid">
          <div className="wsl-filter-group">
            <label className="wsl-filter-label">Search</label>
            <div className="wsl-search-wrap">
              <Search size={16} className="wsl-search-icon" />
              <input
                type="text"
                placeholder="Search student..."
                className="wsl-search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="wsl-filter-group">
            <label className="wsl-filter-label">Block / Floor</label>
            <input
              type="text"
              placeholder="Block / Floor"
              className="wsl-filter-input"
              value={blockFloor}
              onChange={(e) => setBlockFloor(e.target.value)}
            />
          </div>

          <div className="wsl-filter-actions">
            <button className="wsl-btn-secondary" onClick={handleReset}>
              Reset
            </button>
            <button className="wsl-btn-primary" onClick={handleExport}>
              <Download size={16} /> Export
            </button>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="wsl-table-card">
        <div className="wsl-table-header">
          <h3 className="wsl-table-title">Students List</h3>
          <button className="wsl-export-btn" onClick={handleExport}>
            <Download size={14} /> Export CSV
          </button>
        </div>
        <div className="wsl-table-wrap">
          <table className="wsl-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Student</th>
                <th>Enrollment</th>
                <th>Room</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {pageStudents.length === 0 ? (
                <tr>
                  <td colSpan="6" className="wsl-empty">
                    No students found
                  </td>
                </tr>
              ) : (
                pageStudents.map((s) => (
                <tr key={s.id}>
                  <td className="wsl-td-id">#{s.id}</td>

                  <td>
                    <div className="wsl-actions">
                      <img src={s.photoUrl} alt="" className="wsl-photo" />
                      <span className="wsl-td-name">{s.name}</span>
                    </div>
                  </td>

                  <td>{s.enrollmentNo}</td>

                  <td>
                    {s.roomNo} - {s.bedNo}
                  </td>

                  <td>
                    <span className="wsl-status-badge">
                      {s.status}
                    </span>
                  </td>

                  <td>
                    <div className="wsl-actions">
                      <button
                        className="wsl-action-btn"
                        onClick={() =>
                          navigate(`/warden/students/profile/${s.id}`)
                        }
                      >
                        <Eye size={16} />
                      </button>

                      <button
                        className="wsl-action-btn"
                        onClick={() =>
                          navigate(`/warden/students/edit/${s.id}`)
                        }
                      >
                        <Pencil size={16} />
                      </button>

                      <button className="wsl-action-btn">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>

        {/* PAGINATION */}
        <div className="wsl-pagination">
          <div className="wsl-pagination-info">
            Showing <strong>{start + 1}-{Math.min(start + STUDENTS_PER_PAGE, filtered.length)}</strong> of <strong>{filtered.length}</strong> students
          </div>
          <div className="wsl-pagination-controls">
            <button
              className="wsl-page-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                className={`wsl-page-num ${page === currentPage ? 'wsl-page-active' : ''}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
            <button
              className="wsl-page-btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE CARDS */}
      <div className="wsl-mobile-list">
        {pageStudents.map((s) => (
          <div key={s.id} className="wsl-mobile-card">
            <div className="wsl-mobile-top">
              <img src={s.photoUrl} alt="" className="wsl-mobile-photo" />
              <div className="wsl-mobile-info">
                <h4 className="wsl-mobile-name">{s.name}</h4>
                <p className="wsl-mobile-enroll">{s.enrollmentNo}</p>
              </div>
            </div>
            <div className="wsl-mobile-details">
              <div className="wsl-mobile-row">
                <span>Room</span>
                <span>{s.roomNo} - {s.bedNo}</span>
              </div>
              <div className="wsl-mobile-row">
                <span>Status</span>
                <span>{s.status}</span>
              </div>
            </div>
            <div className="wsl-mobile-btns">
              <button
                className="wsl-mobile-btn"
                onClick={() => navigate(`/warden/students/profile/${s.id}`)}
              >
                <Eye size={14} /> View
              </button>
              <button
                className="wsl-mobile-btn"
                onClick={() => navigate(`/warden/students/edit/${s.id}`)}
              >
                <Pencil size={14} /> Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentsList;