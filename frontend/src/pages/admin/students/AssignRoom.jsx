import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Bed } from 'lucide-react';
import { adminStudentApi } from '../../../services/adminStudentApi';
import { adminRoomApi } from '../../../services/adminRoomApi';
import '../../../styles/admin/students/student-form.css';

const AssignRoom = () => {
  const navigate    = useNavigate();
  const { id }      = useParams();

  const [student, setStudent]               = useState(null);
  const [allRooms, setAllRooms]             = useState([]);
  const [hostelBlocks, setHostelBlocks]     = useState([]);
  const [selectedBlock, setSelectedBlock]   = useState('');
  const [selectedType, setSelectedType]     = useState('');
  const [selectedRoom, setSelectedRoom]     = useState(null);
  const [selectedBed, setSelectedBed]       = useState('');
  const [loading, setLoading]               = useState(true);
  const [saving, setSaving]                 = useState(false);
  const [error, setError]                   = useState('');

  // Load student
  useEffect(() => {
    adminStudentApi.getById(id)
      .then(res => setStudent(res.data.data))
      .catch(() => setError('Failed to load student.'))
      .finally(() => setLoading(false));
  }, [id]);

  // Load all rooms and extract blocks
  useEffect(() => {
    adminRoomApi.getAll()
      .then(res => {
        const rooms = res.data.data || [];
        setAllRooms(rooms);
        const blocks = [...new Set(rooms.map(r => r.hostelBlock))];
        setHostelBlocks(blocks);
      })
      .catch(() => {
        // If API not ready, use fallback
        setHostelBlocks(['Block A', 'Block B', 'Block C', 'Block D']);
        setAllRooms([]);
      });
  }, []);

  // Filter rooms based on selected block and type
  const filteredRooms = allRooms.filter(room => {
    const matchesBlock = !selectedBlock || room.hostelBlock === selectedBlock;
    const matchesType = !selectedType || room.roomType === selectedType;
    return matchesBlock && matchesType;
  });

  const handleAssign = async () => {
    if (!selectedRoom || !selectedBed) {
      alert('Please select a room and bed.');
      return;
    }
    setSaving(true);
    try {
      await adminStudentApi.assignRoom(id, {
        roomId: selectedRoom.id,
        bedNo: selectedBed,
      });
      navigate('/admin/students');
    } catch (err) {
      setError('Failed to assign room. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="student-form-page">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Assign Room & Bed</h1>
          <div className="breadcrumb">
            <span>Dashboard</span><span className="breadcrumb-separator">›</span>
            <span>Students</span><span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-active">Assign Room</span>
          </div>
        </div>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {/* Student Summary */}
      {student && (
        <div className="form-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <img
              src={student.photoUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`}
              alt={student.name}
              style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '4px' }}>{student.name}</h2>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                {student.enrollmentNo || student.email}
              </p>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                {student.roomNo
                  ? `Current: Room ${student.roomNo}, Bed ${student.bedNo}`
                  : 'No room assigned yet'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Room Filters */}
      <div className="form-card">
        <h2 className="section-title">Room Allocation</h2>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Hostel / Block</label>
            <select value={selectedBlock} onChange={e => setSelectedBlock(e.target.value)}
              className="form-input">
              <option value="">All Blocks</option>
              {hostelBlocks.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Room Type</label>
            <select value={selectedType} onChange={e => setSelectedType(e.target.value)}
              className="form-input">
              <option value="">All Types</option>
              <option value="AC">AC</option>
              <option value="Non-AC">Non-AC</option>
            </select>
          </div>
          <div className="form-group form-group-full">
            <label className="form-label">Room Number</label>
            <select value={selectedRoom?.id || ''} onChange={e => {
              const room = filteredRooms.find(r => r.id === parseInt(e.target.value));
              setSelectedRoom(room || null);
              setSelectedBed('');
            }} className="form-input">
              <option value="">Select Room</option>
              {filteredRooms.map(r => (
                <option key={r.id} value={r.id}>
                  {r.roomNumber} ({r.roomType}) — {r.hostelBlock}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Bed Selection */}
        {selectedRoom && selectedRoom.beds && (
          <>
            <div style={{ margin: '24px 0 12px' }}>
              <label className="form-label">Available Beds</label>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '16px' }}>
              {selectedRoom.beds.filter(bed => bed.status === 'Available').map(bed => {
                const isSelected  = selectedBed === bed.bedNumber;
                return (
                  <div key={bed.bedNumber}
                    onClick={() => setSelectedBed(bed.bedNumber)}
                    style={{
                      padding: '28px 20px', borderRadius: '8px', textAlign: 'center',
                      border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border)',
                      background: isSelected ? 'var(--primary)' : 'white',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}>
                    <Bed size={36} style={{
                      marginBottom: '8px',
                      color: isSelected ? 'white' : 'var(--text-primary)',
                    }} />
                    <div style={{
                      fontSize: '16px', fontWeight: '600',
                      color: isSelected ? 'white' : 'var(--text-primary)',
                    }}>{bed.bedNumber}</div>
                    <div style={{ fontSize: '11px', marginTop: '4px',
                      color: isSelected ? 'white' : 'var(--primary)',
                    }}>{bed.status}</div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {filteredRooms.length === 0 && selectedBlock && (
          <p style={{ color: 'var(--text-secondary)', marginTop: '16px', fontSize: '14px' }}>
            No available rooms found. Try changing filters or add rooms first.
          </p>
        )}
      </div>

      {/* Summary */}
      {selectedRoom && selectedBed && (
        <div className="form-card">
          <h2 className="section-title">Assignment Summary</h2>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Block</label>
              <div className="form-input" style={{ background: 'var(--background)' }}>{selectedRoom.hostelBlock}</div>
            </div>
            <div className="form-group">
              <label className="form-label">Room Number</label>
              <div className="form-input" style={{ background: 'var(--background)' }}>{selectedRoom.roomNumber}</div>
            </div>
            <div className="form-group">
              <label className="form-label">Bed Number</label>
              <div className="form-input" style={{ background: 'var(--background)' }}>{selectedBed}</div>
            </div>
          </div>
        </div>
      )}

      <div className="form-actions">
        <button type="button" className="btn-secondary"
          onClick={() => navigate('/admin/students')}>Cancel</button>
        <button type="button" className="btn-primary" disabled={saving}
          onClick={handleAssign}>
          {saving ? 'Assigning...' : 'Assign Room'}
        </button>
      </div>
    </div>
  );
};

export default AssignRoom;