import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Eye, Edit, MapPin, Trash2 } from 'lucide-react';
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
      console.log('WardensList: API response:', res);
      const wardensData = res.data.data || [];
      console.log('WardensList: Wardens data:', wardensData);
      setWardens(wardensData);
    } catch (error) {
      console.error('WardensList: Error loading wardens:', error);
      setError('Failed to load wardens: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (warden) => {
    if (!window.confirm(`Are you sure you want to delete ${warden.name}?\n\nThis action cannot be undone and will remove all warden data including:\n- Personal information\n- Contact details\n- Assignment records\n- Access permissions`)) return;
    try {
      await adminWardenApi.delete(warden.id);
      setWardens(prev => prev.filter(w => w.id !== warden.id));
      alert('Warden deleted successfully.');
    } catch (error) {
      console.error('Delete warden error:', error);
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      alert('Failed to delete warden: ' + (error.response?.data?.message || error.message));
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
                        onClick={() => navigate(`/admin/wardens/edit/${w.id}`)}>
                        <Eye size={17} /></button>
                      <button className="action-btn" title="Edit"
                        onClick={() => navigate(`/admin/wardens/edit/${w.id}`)}>
                        <Edit size={17} /></button>
                      <button className="action-btn" title="Assign"
                        onClick={() => navigate(`/admin/wardens/assign/${w.id}`)}>
                        <MapPin size={17} /></button>
                      <button className="action-btn action-btn--delete" title="Delete"
                        onClick={() => handleDelete(w)}>
                        <Trash2 size={17} /></button>
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