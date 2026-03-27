import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Eye, Edit, MapPin } from 'lucide-react';
import { adminWardenApi } from '../../../services/adminWardenApi';
import '../../../styles/admin/wardens/wardensList.css';

const WardensList = () => {
  const navigate = useNavigate();
  const [wardens, setWardens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const wardensPerPage = 5;

  useEffect(() => { fetchWardens(); }, []);

  const fetchWardens = async () => {
    try {
      setLoading(true);
      const res = await adminWardenApi.getAll();
      setWardens(res.data.data || []);
    } catch {
      setError('Failed to load wardens.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this warden?')) return;
    try {
      await adminWardenApi.delete(id);
      setWardens(prev => prev.filter(w => w.id !== id));
    } catch {
      alert('Failed to delete warden.');
    }
  };

  const filtered = wardens.filter(w =>
    w.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLast = currentPage * wardensPerPage;
  const indexOfFirst = indexOfLast - wardensPerPage;
  const current = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / wardensPerPage);

  if (loading) return <div className="loading">Loading wardens...</div>;
  if (error)   return <div className="error">{error}</div>;

  return (
    <div className="wardens-list-page">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Wardens</h1>
          <p className="page-subtitle">Manage and assign wardens to hostels and blocks.</p>
        </div>
        <button className="btn-primary" onClick={() => navigate('/admin/wardens/add')}>
          <Plus size={20} /> Add Warden
        </button>
      </div>

      <div className="filters-card">
        <div className="filter-group search-group">
          <Search size={18} className="search-icon" />
          <input type="text" placeholder="Search name or email..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="filter-input search-input" />
        </div>
      </div>

      <div className="table-card">
        <div className="table-responsive">
          <table className="wardens-table">
            <thead>
              <tr>
                <th>ID</th><th>Name & Email</th><th>Phone</th>
                <th>Gender</th><th>Join Date</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {current.length === 0 ? (
                <tr><td colSpan="6" style={{ textAlign: 'center' }}>No wardens found.</td></tr>
              ) : current.map(w => (
                <tr key={w.id}>
                  <td>{w.id}</td>
                  <td>
                    <div className="warden-name-cell">
                      <div>
                        <div className="warden-name">{w.name}</div>
                        <div className="warden-email">{w.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>{w.phone || '—'}</td>
                  <td>{w.gender || '—'}</td>
                  <td>{w.joinDate || '—'}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-btn" title="View"
                        onClick={() => navigate(`/admin/wardens/${w.id}/edit`)}>
                        <Eye size={17} /></button>
                      <button className="action-btn" title="Edit"
                        onClick={() => navigate(`/admin/wardens/${w.id}/edit`)}>
                        <Edit size={17} /></button>
                      <button className="action-btn" title="Assign"
                        onClick={() => navigate(`/admin/wardens/${w.id}/assign`)}>
                        <MapPin size={17} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pagination-row">
          <div className="pagination">
            <button className="pagination-btn"
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}>‹</button>
            {[...Array(totalPages)].map((_, i) => (
              <button key={i + 1}
                className={`pagination-number ${currentPage === i + 1 ? 'active' : ''}`}
                onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
            ))}
            <button className="pagination-btn"
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}>›</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WardensList;