import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Plus, Eye, Pencil, MoreVertical, Download, X, ChevronRight, Filter } from 'lucide-react';
import { wardenStudentApi } from '../../../services/wardenStudentApi';

const wardenStudentStatusOptions = [
  { id: 'active',   name: 'Active',   color: '#059669', bg: 'bg-green-100', text: 'text-green-700' },
  { id: 'inactive', name: 'Inactive', color: '#DC2626', bg: 'bg-red-100',   text: 'text-red-700' },
  { id: 'on-leave', name: 'On Leave', color: '#D97706', bg: 'bg-amber-100', text: 'text-amber-700' },
];

const STUDENTS_PER_PAGE = 5;

const StudentsList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm]   = useState('');
  const [blockFloor, setBlockFloor]   = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenu, setOpenMenu]       = useState(null);

  // ── React Query: Fetch ────────────────────────────────────
  const { data, isLoading, error } = useQuery({
    queryKey: ['warden-students'],
    queryFn: async () => {
      const res = await wardenStudentApi.getAll();
      const students = res.data.data;
      return Array.isArray(students) ? students : (students?.content || []);
    },
  });

  // ── React Query: Mutation ────────────────────────────────
  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => wardenStudentApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries(['warden-students']);
      setOpenMenu(null);
    },
  });

  if (isLoading) return <div className="p-10 text-center text-gray-500">Loading students...</div>;
  if (error) return <div className="p-10 text-center text-red-500">Failed to load students.</div>;

  const students = data || [];

  /* ── Filter ──────────────────────────────────────────── */
  const filtered = students.filter((s) => {
    const name = s.name || '';
    const enroll = s.enrollmentNo || '';
    const block = s.hostelBlock || '';
    const floor = s.floor || '';
    const matchSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enroll.toLowerCase().includes(searchTerm.toLowerCase());
    const matchBlock =
      !blockFloor ||
      block.toLowerCase().includes(blockFloor.toLowerCase()) ||
      floor.toLowerCase().includes(blockFloor.toLowerCase());
    return matchSearch && matchBlock;
  });

  /* ── Pagination ───────────────────────────────────────── */
  const totalPages   = Math.max(1, Math.ceil(filtered.length / STUDENTS_PER_PAGE));
  const safePage     = Math.min(currentPage, totalPages);
  const start        = (safePage - 1) * STUDENTS_PER_PAGE;
  const pageStudents = filtered.slice(start, start + STUDENTS_PER_PAGE);

  const handleReset = () => { setSearchTerm(''); setBlockFloor(''); setCurrentPage(1); };

  const handleExport = () => {
    const header = 'Student ID,Full Name,Enrollment No,Phone,Room,Bed,Status';
    const rows = students.map(s => `${s.id},${s.name},${s.enrollmentNo},${s.phone},${s.roomNo},${s.bedNo},${s.status}`);
    const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'students.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6" onClick={() => setOpenMenu(null)}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
            <span>Dashboard</span>
            <ChevronRight size={12} />
            <span className="text-blue-600">Student Records</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Student Directory</h1>
        </div>
        <div className="bg-blue-50 px-4 py-2 rounded-xl border border-blue-100 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-sm font-bold text-blue-700">{students.length} Total Students</span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Search Students</label>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Name or Enrollment..." value={searchTerm} onChange={e => {setSearchTerm(e.target.value); setCurrentPage(1);}} className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Block / Floor</label>
            <div className="relative">
              <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="e.g. Block A" value={blockFloor} onChange={e => {setBlockFloor(e.target.value); setCurrentPage(1);}} className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all" />
            </div>
          </div>
          <div className="flex items-end gap-2">
            <button onClick={handleReset} className="flex-1 px-4 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all">Reset</button>
            <button onClick={handleExport} className="flex-1 px-4 py-2.5 text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all flex items-center justify-center gap-2"><Download size={16} /> Export</button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">ID</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Student</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Enrollment</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest hidden lg:table-cell">Phone</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Room</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pageStudents.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-400 italic text-sm">No student records found.</td></tr>
              ) : pageStudents.map(s => {
                const statusOpt = wardenStudentStatusOptions.find(o => o.name === s.status) || wardenStudentStatusOptions[0];
                return (
                  <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-xs font-bold text-gray-400">#{s.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={s.photoUrl} alt={s.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-sm" />
                        <span className="text-sm font-bold text-gray-800">{s.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">{s.enrollmentNo}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 hidden lg:table-cell">{s.phone}</td>
                    <td className="px-6 py-4 text-sm text-gray-600"><span className="font-bold">{s.roomNo}</span> – {s.bedNo}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${statusOpt.bg} ${statusOpt.text}`}>{s.status}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2" onClick={e => e.stopPropagation()}>
                        <button onClick={() => navigate(`/warden/students/profile/${s.id}`)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Eye size={16} /></button>
                        <button onClick={() => navigate(`/warden/students/edit/${s.id}`)} className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"><Pencil size={16} /></button>
                        <div className="relative">
                          <button onClick={() => setOpenMenu(openMenu === s.id ? null : s.id)} className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"><MoreVertical size={16} /></button>
                          {openMenu === s.id && (
                            <div className="absolute right-0 bottom-full mb-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-10 animate-in zoom-in-95 duration-200">
                              <div className="px-4 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">Change Status</div>
                              {wardenStudentStatusOptions.map(opt => (
                                <button key={opt.id} onClick={() => statusMutation.mutate({id: s.id, status: opt.name})} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                                  <div className="w-2 h-2 rounded-full" style={{backgroundColor: opt.color}} /> {opt.name}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 bg-gray-50/30 flex items-center justify-between border-t border-gray-100">
          <p className="text-xs text-gray-500 italic">Showing {pageStudents.length} of {filtered.length} students</p>
          <div className="flex gap-1">
            <button disabled={safePage === 1} onClick={() => setCurrentPage(p => p - 1)} className="px-3 py-1.5 text-xs font-bold text-gray-500 bg-white border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-all">Prev</button>
            <button disabled={safePage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="px-3 py-1.5 text-xs font-bold text-gray-500 bg-white border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-all">Next</button>
          </div>
        </div>
      </div>

      {/* Mobile view */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {pageStudents.map(s => (
          <div key={s.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <div className="flex items-center gap-4">
              <img src={s.photoUrl} alt={s.name} className="w-14 h-14 rounded-2xl object-cover" />
              <div>
                <h3 className="font-bold text-gray-900">{s.name}</h3>
                <p className="text-xs text-gray-500">{s.enrollmentNo}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-[11px]">
              <div><p className="text-gray-400 font-bold uppercase tracking-widest mb-0.5">Room</p><p className="text-gray-700 font-medium">{s.roomNo} - {s.bedNo}</p></div>
              <div><p className="text-gray-400 font-bold uppercase tracking-widest mb-0.5">Status</p><p className="text-blue-600 font-bold">{s.status}</p></div>
            </div>
            <div className="flex gap-2 pt-2">
              <button onClick={() => navigate(`/warden/students/profile/${s.id}`)} className="flex-1 py-2 text-xs font-bold text-blue-600 bg-blue-50 rounded-xl">View</button>
              <button onClick={() => navigate(`/warden/students/edit/${s.id}`)} className="flex-1 py-2 text-xs font-bold text-amber-600 bg-amber-50 rounded-xl">Edit</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentsList;