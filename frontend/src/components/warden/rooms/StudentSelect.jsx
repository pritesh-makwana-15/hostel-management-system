import React, { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { wardenStudentsApi } from '../../../services/wardenStudentsApi';

const StudentSelect = ({ selectedStudent, onSelect }) => {
  const [search, setSearch] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        // Pull a large page so the UX stays the same as the mock list
        const res = await wardenStudentsApi.getAll({ page: 0, size: 1000 });
        const page = res.data?.data;
        const rows = page?.content || [];
        const mapped = rows.map((s) => {
          const name = s.name || '';
          const initials = name
            .split(' ')
            .filter(Boolean)
            .slice(0, 2)
            .map((p) => p[0]?.toUpperCase())
            .join('');
          return {
            id: s.id,
            name,
            enrollment: s.enrollmentNo || '',
            avatar: initials || 'ST',
          };
        });
        if (mounted) setStudents(mapped);
      } catch (e) {
        if (mounted) setError(e.response?.data?.message || e.message || 'Failed to load students');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return students.filter(
      (s) => s.name.toLowerCase().includes(q) || s.enrollment.toLowerCase().includes(q)
    );
  }, [search, students]);

  return (
    <div className="student-select-wrap">
      <div className="student-select-search">
        <Search size={16} />
        <input
          type="text"
          placeholder="Search student by name or enrollment ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="student-select-label">CANDIDATE STUDENTS</div>

      <div className="student-select-list">
        {loading && <div className="loading">Loading students...</div>}
        {!loading && error && <div className="error">{error}</div>}
        {filtered.map((student) => (
          <div
            key={student.id}
            className={`student-select-item ${selectedStudent?.id === student.id ? 'student-item-selected' : ''}`}
          >
            <div className="student-item-avatar">{student.avatar}</div>
            <div className="student-item-info">
              <span className="student-item-name">{student.name}</span>
              <span className="student-item-enroll">{student.enrollment}</span>
            </div>
            <button
              className={`student-item-btn ${selectedStudent?.id === student.id ? 'student-btn-selected' : ''}`}
              onClick={() => onSelect(student)}
            >
              {selectedStudent?.id === student.id ? 'Selected' : 'Select'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentSelect;