import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Plus, Eye, Edit, Home as HomeIcon, ShieldOff, ShieldCheck, X } from 'lucide-react';
import { adminStudentApi } from '../../../services/adminStudentApi';

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
    onError: () => showToast('Failed to delete student.', 'error'),
  });

  // ── Handlers ──────────────────────────────────────────────
  const toggleStatus = (student) => {
    const newStatus = student.status === 'Active' ? 'Inactive' : 'Active';
    const action    = newStatus === 'Inactive' ? 'deactivate' : 'activate';
    if (!window.confirm(`Are you sure you want to ${action} ${student.name}?`)) return;
    statusMutation.mutate({ id: student.id, status: newStatus });
  };

  if (isLoading) return <div className="p-10 text-center text-gray-500">Loading students...</div>;
  if (error) return <div className="p-10 text-center text-red-500">Failed to load students.</div>;

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
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 p-4 rounded-lg shadow-lg text-white animate-in slide-in-from-right ${toast.type === 'error' ? 'bg-red-500' : 'bg-green-500'}`}>
          <span>{toast.message}</span>
          <button onClick={() => setToast(null)}><X size={14} /></button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Students</h1>
          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
            <span>Dashboard</span>
            <span className="text-gray-400">›</span>
            <span className="text-gray-800 font-medium">Students</span>
          </div>
        </div>
        <button onClick={() => navigate('/admin/students/add')} className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-5 py-2.5 rounded-lg font-medium transition-colors">
          <Plus size={18} /> Add Student
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative flex items-center">
            <Search size={16} className="absolute left-3 text-gray-400 pointer-events-none" />
            <input type="text" placeholder="Search..." value={searchTerm} onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all" />
          </div>
          <select value={filterCourse} onChange={e => { setFilterCourse(e.target.value); setCurrentPage(1); }} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all appearance-none bg-white">
            <option value="">All Courses</option>
            {courseOptions.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={filterRoom} onChange={e => { setFilterRoom(e.target.value); setCurrentPage(1); }} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all appearance-none bg-white">
            <option value="">All Rooms</option>
            {roomOptions.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setCurrentPage(1); }} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all appearance-none bg-white">
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="On Leave">On Leave</option>
          </select>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-gray-50">
          <span className="text-xs text-gray-500">Showing {filtered.length} students</span>
          <button onClick={handleReset} className="text-xs font-medium text-gray-600 hover:text-gray-900 px-3 py-1.5 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">Reset Filters</button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Student</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">Phone</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Course</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Room</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {current.length === 0 ? (
                <tr><td colSpan="7" className="px-6 py-10 text-center text-gray-500 text-sm italic">No students found.</td></tr>
              ) : current.map(student => (
                <tr key={student.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">#{student.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={student.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`} alt={student.name} className="w-9 h-9 rounded-full ring-2 ring-gray-100 object-cover" />
                      <div>
                        <div className="text-sm font-semibold text-gray-800">{student.name}</div>
                        <div className="text-[11px] text-gray-500">{student.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 hidden md:table-cell">{student.phone || '—'}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{student.course || '—'}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 hidden lg:table-cell">{student.roomNo || '—'}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                      student.status === 'Active' ? 'bg-green-100 text-green-700' : 
                      student.status === 'Inactive' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>{student.status}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => navigate(`/admin/students/profile/${student.id}`)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="View Profile"><Eye size={16} /></button>
                      <button onClick={() => navigate(`/admin/students/edit/${student.id}`)} className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all" title="Edit Student"><Edit size={16} /></button>
                      <button onClick={() => navigate(`/admin/students/assign/${student.id}`)} className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="Assign Room"><HomeIcon size={16} /></button>
                      <button 
                        onClick={() => toggleStatus(student)} 
                        disabled={statusMutation.isPending && statusMutation.variables?.id === student.id}
                        className={`p-2 rounded-lg transition-all ${student.status === 'Active' ? 'text-red-400 hover:text-red-600 hover:bg-red-50' : 'text-green-400 hover:text-green-600 hover:bg-green-50'}`}
                        title={student.status === 'Active' ? 'Deactivate' : 'Activate'}
                      >
                        {statusMutation.isPending && statusMutation.variables?.id === student.id ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : student.status === 'Active' ? <ShieldOff size={16} /> : <ShieldCheck size={16} />}
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
          <div className="flex items-center justify-center gap-2 p-6 border-t border-gray-100">
            <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="px-4 py-2 text-xs font-medium text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition-colors">‹ Previous</button>
            <div className="flex gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button key={i + 1} onClick={() => setCurrentPage(i + 1)} className={`w-9 h-9 flex items-center justify-center rounded-lg text-xs font-medium transition-all ${currentPage === i + 1 ? 'bg-blue-700 text-white shadow-lg shadow-blue-200' : 'text-gray-500 hover:bg-gray-100'}`}>{i + 1}</button>
              ))}
            </div>
            <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="px-4 py-2 text-xs font-medium text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 transition-colors">Next ›</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentsList;