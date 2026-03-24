import React, { useState } from 'react';
import { Search } from 'lucide-react';

const mockStudents = [
  { id: 'S001', name: 'Rahul Singh', enrollment: 'ENR-2024-089', avatar: 'RS' },
  { id: 'S002', name: 'Amit Sharma', enrollment: 'ENR-2024-112', avatar: 'AS' },
  { id: 'S003', name: 'Priya Nair', enrollment: 'ENR-2024-078', avatar: 'PN' },
  { id: 'S004', name: 'Deepak Verma', enrollment: 'ENR-2024-045', avatar: 'DV' },
  { id: 'S005', name: 'Sneha Patel', enrollment: 'ENR-2024-133', avatar: 'SP' },
];

const StudentSelect = ({ selectedStudent, onSelect }) => {
  const [search, setSearch] = useState('');

  const filtered = mockStudents.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.enrollment.toLowerCase().includes(search.toLowerCase())
  );

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