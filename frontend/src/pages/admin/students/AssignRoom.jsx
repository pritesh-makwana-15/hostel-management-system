import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Bed } from 'lucide-react';
import { getStudentById, roomsData, hostelBlocks, roomTypes } from '../../../data/studentsData';
import '../../../styles/admin/students/student-form.css';

const AssignRoom = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [student, setStudent] = useState(null);
  const [selectedBlock, setSelectedBlock] = useState('');
  const [selectedRoomType, setSelectedRoomType] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');
  const [selectedBed, setSelectedBed] = useState('');
  const [availableRooms, setAvailableRooms] = useState([]);
  const [selectedRoomData, setSelectedRoomData] = useState(null);

  useEffect(() => {
    const studentData = getStudentById(id);
    setStudent(studentData);
  }, [id]);

  useEffect(() => {
    if (selectedBlock || selectedRoomType) {
      const filtered = roomsData.filter(room => {
        const matchesBlock = !selectedBlock || room.block === selectedBlock;
        const matchesType = !selectedRoomType || room.type === selectedRoomType;
        const hasAvailableBeds = room.beds.some(bed => bed.status === 'Available');
        return matchesBlock && matchesType && hasAvailableBeds;
      });
      setAvailableRooms(filtered);
    } else {
      setAvailableRooms(roomsData.filter(room => 
        room.beds.some(bed => bed.status === 'Available')
      ));
    }
  }, [selectedBlock, selectedRoomType]);

  useEffect(() => {
    if (selectedRoom) {
      const roomData = roomsData.find(room => room.id === selectedRoom);
      setSelectedRoomData(roomData);
      setSelectedBed('');
    }
  }, [selectedRoom]);

  const handleAssign = () => {
    if (!selectedRoom || !selectedBed) {
      alert('Please select a room and bed');
      return;
    }
    
    // TODO: API call to assign room
    console.log('Assigning:', {
      studentId: id,
      roomId: selectedRoom,
      bedNo: selectedBed
    });
    
    navigate('/admin/students');
  };

  if (!student) {
    return <div>Loading...</div>;
  }

  return (
    <div className="student-form-page">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Assign Room & Bed</h1>
          <div className="breadcrumb">
            <span>Dashboard</span>
            <span className="breadcrumb-separator">›</span>
            <span>Students</span>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-active">Assign Room</span>
          </div>
        </div>
      </div>

      {/* Student Summary Card */}
      <div className="form-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <img 
            src={student.photo} 
            alt={student.fullName}
            style={{ 
              width: '80px', 
              height: '80px', 
              borderRadius: '50%',
              objectFit: 'cover'
            }}
          />
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}>
              {student.fullName}
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
              Enrollment No: {student.enrollmentNo}
            </p>
            <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
              {student.roomNo && student.bedNo ? (
                <>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    Current Allocation: Room {student.roomNo}, Bed {student.bedNo}
                  </span>
                  <span 
                    className="status-badge"
                    style={{ 
                      backgroundColor: '#10B98115',
                      color: '#10B981',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px'
                    }}
                  >
                    Active
                  </span>
                </>
              ) : (
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  No room assigned
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Room Allocation Form */}
      <div className="form-card">
        <h2 className="section-title">Room Allocation</h2>
        
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Hostel / Block</label>
            <select
              value={selectedBlock}
              onChange={(e) => setSelectedBlock(e.target.value)}
              className="form-input"
            >
              <option value="">Select Block</option>
              {hostelBlocks.map(block => (
                <option key={block.id} value={block.name}>{block.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Room Type</label>
            <select
              value={selectedRoomType}
              onChange={(e) => setSelectedRoomType(e.target.value)}
              className="form-input"
            >
              <option value="">Select Type</option>
              {roomTypes.map(type => (
                <option key={type.id} value={type.name}>{type.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group form-group-full">
            <label className="form-label">Room Number</label>
            <select
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
              className="form-input"
            >
              <option value="">Select Room</option>
              {availableRooms.map(room => (
                <option key={room.id} value={room.id}>
                  {room.roomNo} ({room.type})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Available Beds */}
        {selectedRoomData && (
          <>
            <div style={{ marginTop: '24px', marginBottom: '12px' }}>
              <label className="form-label">Available Beds</label>
            </div>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
              gap: '16px'
            }}>
              {selectedRoomData.beds.map((bed) => (
                <div
                  key={bed.bedNo}
                  onClick={() => bed.status === 'Available' && setSelectedBed(bed.bedNo)}
                  style={{
                    padding: '32px 24px',
                    borderRadius: 'var(--radius-card)',
                    border: selectedBed === bed.bedNo 
                      ? '2px solid var(--primary)' 
                      : '1px solid var(--border)',
                    background: bed.status === 'Occupied' 
                      ? 'var(--background)' 
                      : selectedBed === bed.bedNo 
                        ? 'var(--primary)' 
                        : 'white',
                    cursor: bed.status === 'Available' ? 'pointer' : 'not-allowed',
                    textAlign: 'center',
                    transition: 'all 0.2s',
                    position: 'relative'
                  }}
                >
                  <div style={{ 
                    position: 'absolute', 
                    top: '8px', 
                    right: '8px',
                    fontSize: '11px',
                    fontWeight: '500',
                    color: bed.status === 'Occupied' ? 'var(--text-secondary)' : 'var(--primary)',
                    background: bed.status === 'Occupied' ? 'transparent' : 'white',
                    padding: '4px 8px',
                    borderRadius: '4px'
                  }}>
                    {bed.status}
                  </div>
                  <Bed 
                    size={40} 
                    style={{ 
                      marginBottom: '12px',
                      color: selectedBed === bed.bedNo 
                        ? 'white' 
                        : bed.status === 'Occupied' 
                          ? 'var(--text-secondary)' 
                          : 'var(--text-primary)'
                    }}
                  />
                  <div style={{ 
                    fontSize: '18px', 
                    fontWeight: '600',
                    color: selectedBed === bed.bedNo 
                      ? 'white' 
                      : bed.status === 'Occupied' 
                        ? 'var(--text-secondary)' 
                        : 'var(--text-primary)'
                  }}>
                    {bed.bedNo}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Form Actions */}
      <div className="form-actions">
        <button 
          type="button" 
          className="btn-secondary"
          onClick={() => navigate('/admin/students')}
        >
          Cancel
        </button>
        <button 
          type="button" 
          className="btn-primary"
          onClick={handleAssign}
        >
          Assign Room
        </button>
      </div>
    </div>
  );
};

export default AssignRoom;