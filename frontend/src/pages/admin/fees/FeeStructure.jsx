import React, { useState, useEffect } from 'react';
import {
  Search, Filter, Download, Plus, Edit, PowerOff,
  Shield, Layers, Clock, MoreVertical, X
} from 'lucide-react';
import { feeStructureApi } from '../../../services/adminFeeApi';
import { adminRoomApi } from '../../../services/adminRoomApi';
import '../../../styles/admin/fees/feeStructure.css';

const FeeStructure = () => {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [feeStructures, setFeeStructures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [hostelBlocks, setHostelBlocks] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [checkingDuplicate, setCheckingDuplicate] = useState(false);
  const [remoteDuplicateSelected, setRemoteDuplicateSelected] = useState(false);
  const [formError, setFormError] = useState('');
  const [formData, setFormData] = useState({
    hostelBlock: '',
    roomType: 'AC',
    monthlyFee: '',
    securityDeposit: '',
    utilities: '',
    lateFee: '',
    status: 'Active'
  });

  const perPage = 5;

  const normalizeValue = (value) => (value || '').trim().toLowerCase();

  const isCombinationTaken = (hostelBlock, roomType, excludeId = null) => {
    const normalizedBlock = normalizeValue(hostelBlock);
    const normalizedRoom = normalizeValue(roomType);

    if (!normalizedBlock || !normalizedRoom) {
      return false;
    }

    return feeStructures.some((structure) => {
      if (excludeId && structure.id === excludeId) {
        return false;
      }
      return (
        normalizeValue(structure.hostelBlock) === normalizedBlock &&
        normalizeValue(structure.roomType) === normalizedRoom
      );
    });
  };

  const duplicateCombinationSelected = isCombinationTaken(
    formData.hostelBlock,
    formData.roomType,
    editData?.id || null
  );

  const combinationAlreadyExists = duplicateCombinationSelected || remoteDuplicateSelected;

  useEffect(() => {
    fetchFeeStructures();
    fetchHostelBlocks();
    testApiConnection();
  }, []);

  useEffect(() => {
    if (!showModal || !formData.hostelBlock || !formData.roomType) {
      setRemoteDuplicateSelected(false);
      setCheckingDuplicate(false);
      return;
    }

    if (duplicateCombinationSelected) {
      setRemoteDuplicateSelected(false);
      setCheckingDuplicate(false);
      return;
    }

    let cancelled = false;
    setCheckingDuplicate(true);

    const timer = setTimeout(async () => {
      try {
        const response = await feeStructureApi.exists(
          formData.hostelBlock,
          formData.roomType,
          editData?.id || null
        );
        if (!cancelled) {
          const exists = response.data?.status === 'success' && response.data?.data === true;
          setRemoteDuplicateSelected(Boolean(exists));
        }
      } catch (error) {
        console.error('Error checking fee structure combination:', error);
        if (!cancelled) {
          setRemoteDuplicateSelected(false);
        }
      } finally {
        if (!cancelled) {
          setCheckingDuplicate(false);
        }
      }
    }, 200);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [showModal, formData.hostelBlock, formData.roomType, editData?.id, duplicateCombinationSelected]);

  const testApiConnection = async () => {
    try {
      const response = await feeStructureApi.healthCheck();
      console.log('API test response:', response.data);
    } catch (error) {
      console.error('API test error:', error);
    }
  };

  const fetchFeeStructures = async () => {
    try {
      const response = await feeStructureApi.getAll();
      console.log('Fetch fee structures response:', response);
      console.log('Response.data:', response.data);
      console.log('Response.data.status:', response.data?.status);
      if (response.data && response.data.status === 'success') {
        setFeeStructures(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching fee structures:', error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = feeStructures.filter(s =>
    s.hostelBlock.toLowerCase().includes(search.toLowerCase()) ||
    s.roomType.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / perPage);
  const paged = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const handleOpenModal = (structure = null) => {
    setFormError('');
    setRemoteDuplicateSelected(false);
    if (structure) {
      setEditData(structure);
      setFormData({
        hostelBlock: structure.hostelBlock,
        roomType: structure.roomType,
        monthlyFee: structure.monthlyFee || '',
        securityDeposit: structure.securityDeposit || '',
        utilities: structure.utilities || '',
        lateFee: structure.lateFee || '',
        status: structure.status
      });
    } else {
      setEditData(null);
      setFormData({
        hostelBlock: '',
        roomType: 'AC',
        monthlyFee: '',
        securityDeposit: '',
        utilities: '',
        lateFee: '',
        status: 'Active'
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditData(null);
    setFormError('');
    setRemoteDuplicateSelected(false);
    setCheckingDuplicate(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormError('');
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (combinationAlreadyExists) {
      setFormError(`Fee structure already exists for ${formData.hostelBlock} + ${formData.roomType}. Please edit the existing one.`);
      return;
    }

    setSubmitting(true);
    try {
      const data = {
        hostelBlock: formData.hostelBlock,
        roomType: formData.roomType,
        monthlyFee: parseFloat(formData.monthlyFee),
        securityDeposit: parseFloat(formData.securityDeposit),
        utilities: formData.utilities ? parseFloat(formData.utilities) : null,
        lateFee: formData.lateFee ? parseFloat(formData.lateFee) : null,
        status: formData.status
      };

      console.log('Submitting fee structure:', data);
      console.log('Edit mode:', editData ? 'Update' : 'Create');
      
      const response = editData 
        ? await feeStructureApi.update(editData.id, data)
        : await feeStructureApi.create(data);
      
      console.log('Response:', response);
      console.log('Response.data:', response.data);
      console.log('Response.data.success:', response.data?.success);
      console.log('Response.data.status:', response.data?.status);
      console.log('Response.data.message:', response.data?.message);
      
      if (response.data && response.data.status === 'success') {
        fetchFeeStructures();
        handleCloseModal();
      } else {
        setFormError(response.data?.message || 'Unable to save fee structure. Please try again.');
      }
    } catch (error) {
      console.error('Error saving fee structure:', error);
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Data:', error.response.data);
        setFormError(error.response.data?.message || 'Unable to save fee structure.');
      } else {
        setFormError('Unable to save fee structure. Please check your connection and try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (structure) => {
    try {
      const newStatus = structure.status === 'Active' ? 'Inactive' : 'Active';
      await feeStructureApi.update(structure.id, { ...structure, status: newStatus });
      fetchFeeStructures();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const fetchHostelBlocks = async () => {
    try {
      console.log('Fetching hostel blocks...');
      const blocks = await adminRoomApi.getHostelBlocks();
      console.log('Hostel blocks fetched:', blocks);
      setHostelBlocks(blocks);
    } catch (error) {
      console.error('Error fetching hostel blocks:', error);
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      // Fallback to empty array
      setHostelBlocks([]);
    }
  };

  return (
    <div className="fee-structure-page">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-left">
          <div className="breadcrumb">
            <span>Dashboard</span><span className="breadcrumb-sep">›</span>
            <span>Fees</span><span className="breadcrumb-sep">›</span>
            <span className="breadcrumb-active">Fee Structure</span>
          </div>
          <h1 className="page-title">Fee Structure Setup</h1>
          <p className="page-sub">Manage and define fee configurations for different hostels and room categories.</p>
        </div>
        <button className="btn-primary" onClick={() => handleOpenModal()}>
          <Plus size={16} /> Add New Structure
        </button>
      </div>

      {/* Table Card */}
      <div className="table-card">
        {/* Toolbar */}
        <div className="table-toolbar">
          <div className="search-wrap">
            <Search size={16} className="search-icon" />
            <input
              className="search-input"
              placeholder="Search by Hostel or Room Type..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="toolbar-right">
            <button className="btn-outline"><Filter size={14} /> Filters</button>
            <button className="btn-outline"><Download size={14} /> Export CSV</button>
            <button className="btn-icon"><MoreVertical size={16} /></button>
          </div>
        </div>

        {/* Table */}
        <div className="table-responsive">
          <table className="fees-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Hostel Block</th>
                <th>Room Type</th>
                <th>Monthly Fee (₹)</th>
                <th>Security Deposit (₹)</th>
                <th>Utilities (₹)</th>
                <th>Late Fee (₹)</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center' }}>Loading...</td>
                </tr>
              ) : paged.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center' }}>No fee structures found</td>
                </tr>
              ) : (
                paged.map((s) => (
                  <tr key={s.id}>
                    <td className="str-id">{s.id}</td>
                    <td className="hostel-name">{s.hostelBlock}</td>
                    <td><span className={`room-type-badge ${s.roomType === 'AC' ? 'badge-ac' : 'badge-nonac'}`}>{s.roomType}</span></td>
                    <td className="fee-amount">₹{s.monthlyFee?.toLocaleString()}</td>
                    <td>₹{s.securityDeposit?.toLocaleString()}</td>
                    <td>{s.utilities ? `₹${s.utilities}` : '-'}</td>
                    <td className="late-fee-amount">{s.lateFee ? `₹${s.lateFee}` : '-'}</td>
                    <td>
                      <span className={`status-badge ${s.status === 'Active' ? 'badge-active' : 'badge-inactive'}`}>
                        {s.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="action-btn" title="Edit" onClick={() => handleOpenModal(s)}>
                          <Edit size={16} />
                        </button>
                        <button 
                          className="action-btn" 
                          title={s.status === 'Active' ? 'Deactivate' : 'Activate'}
                          onClick={() => handleToggleStatus(s)}
                        >
                          <PowerOff size={16} />
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
        <div className="table-footer">
          <span className="showing-text">Showing {paged.length > 0 ? (currentPage - 1) * perPage + 1 : 0} to {Math.min(currentPage * perPage, filtered.length)} of {filtered.length} entries</span>
          <div className="pagination">
            <button className="pag-btn" onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>
              Previous
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button key={i} className={`pag-num ${currentPage === i + 1 ? 'active' : ''}`} onClick={() => setCurrentPage(i + 1)}>
                {i + 1}
              </button>
            ))}
            <button className="pag-btn" onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages || totalPages === 0}>
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="info-cards-grid">
        <div className="info-card info-card-blue">
          <div className="info-card-icon"><Shield size={18} /></div>
          <div>
            <h4 className="info-card-title">Security Deposits</h4>
            <p className="info-card-text">One-time refundable security deposits are typically collected at the time of admission. These are not included in monthly billing cycles.</p>
          </div>
        </div>
        <div className="info-card info-card-teal">
          <div className="info-card-icon"><Layers size={18} /></div>
          <div>
            <h4 className="info-card-title">Room Categories</h4>
            <p className="info-card-text">Fee structures are linked to Room Types. Changing a room type for a student will automatically update their future billing structures.</p>
          </div>
        </div>
        <div className="info-card info-card-amber">
          <div className="info-card-icon"><Clock size={18} /></div>
          <div>
            <h4 className="info-card-title">Late Fee Rules</h4>
            <p className="info-card-text">Late fees are applied automatically 5 days after the due date. You can override specific penalties in the individual student ledger.</p>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editData ? 'Edit Fee Structure' : 'Add New Fee Structure'}</h2>
              <button className="modal-close" onClick={handleCloseModal}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Hostel Block</label>
                  <select name="hostelBlock" value={formData.hostelBlock} onChange={handleInputChange} required>
                    <option value="">Select Hostel Block</option>
                    {hostelBlocks.map(block => (
                      <option key={block.id} value={block.name}>{block.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Room Type</label>
                  <select name="roomType" value={formData.roomType} onChange={handleInputChange} required>
                    <option
                      value="AC"
                      disabled={
                        Boolean(formData.hostelBlock) &&
                        isCombinationTaken(formData.hostelBlock, 'AC', editData?.id || null)
                      }
                    >
                      AC
                    </option>
                    <option
                      value="Non-AC"
                      disabled={
                        Boolean(formData.hostelBlock) &&
                        isCombinationTaken(formData.hostelBlock, 'Non-AC', editData?.id || null)
                      }
                    >
                      Non-AC
                    </option>
                  </select>
                </div>
                {combinationAlreadyExists && (
                  <div className="form-warning">
                    This combination already exists. Please select a different Hostel Block or Room Type.
                  </div>
                )}
                {checkingDuplicate && (
                  <div className="form-warning">Checking combination availability...</div>
                )}
                {formError && <div className="form-error">{formError}</div>}
                <div className="form-row">
                  <div className="form-group">
                    <label>Monthly Fee (₹)</label>
                    <input type="number" name="monthlyFee" value={formData.monthlyFee} onChange={handleInputChange} required placeholder="e.g., 5000" />
                  </div>
                  <div className="form-group">
                    <label>Security Deposit (₹)</label>
                    <input type="number" name="securityDeposit" value={formData.securityDeposit} onChange={handleInputChange} required placeholder="e.g., 10000" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Utilities (₹)</label>
                    <input type="number" name="utilities" value={formData.utilities} onChange={handleInputChange} placeholder="Optional" />
                  </div>
                  <div className="form-group">
                    <label>Late Fee (₹)</label>
                    <input type="number" name="lateFee" value={formData.lateFee} onChange={handleInputChange} placeholder="Optional" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select name="status" value={formData.status} onChange={handleInputChange}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={handleCloseModal}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={submitting || checkingDuplicate || combinationAlreadyExists}>
                  {submitting ? 'Saving...' : (checkingDuplicate ? 'Checking...' : (editData ? 'Update' : 'Create'))}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeeStructure;