import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BedDouble, MapPin, Layers, Users, CreditCard,
  AlertTriangle, ArrowLeftRight, Phone, ChevronRight,
  CalendarCheck, CheckCircle, Clock, FileText,
  ArrowLeft, Info, Shield, RefreshCw, Database,
  User, Home, Wifi, Zap, Wrench, UtensilsCrossed,
  Eye, BookOpen
} from 'lucide-react';
import '../../../styles/student/room/roomDetails.css';

const RealTimeRoomData = () => {
  const navigate = useNavigate();
  
  console.log('RealTimeRoomData component loaded - Updated version');
  const [roomData, setRoomData] = useState({});
  const [roommates, setRoommates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Fetch real-time room data from database
  const fetchRoomData = async () => {
    try {
      setError('');
      setLoading(true);
      
      // Get student profile first to get room information
      const profileResponse = await fetch('http://localhost:8080/api/student/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('hms_token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        console.log('Student profile data:', profileData);
        
        if (profileData && profileData.data) {
          const student = profileData.data;
          
          // Transform room data from database
          const transformedRoomData = {
            roomNumber: student.roomNo || '',
            block: student.hostelBlock || '',
            floor: student.floor || '',
            roomType: student.roomType || '',
            bedId: student.bedNo || '',
            status: student.status || 'Active',
            occupancy: student.occupancy || '',
            allocatedOn: student.allocatedOn ? new Date(student.allocatedOn).toLocaleDateString('en-IN') : '',
            checkInDate: student.joinDate ? new Date(student.joinDate).toLocaleDateString('en-IN') : '',
            agreementEnd: student.agreementEnd || '',
            monthlyRent: student.monthlyRent || '',
            nextDueDate: student.nextDueDate || '',
            rentStatus: student.rentStatus || 'Pending'
          };
          
          setRoomData(transformedRoomData);
          
          // If room data exists, fetch roommates
          if (student.roomNo) {
            await fetchRoommates(student.roomNo);
          }
        }
      } else {
        const errorText = await profileResponse.text();
        console.error('Profile API Error:', profileResponse.status, errorText);
        setError(`Failed to fetch room data: ${profileResponse.status}`);
      }
      
    } catch (err) {
      console.error('Error fetching room data:', err);
      setError('Failed to connect to database. Please check if backend is running.');
    } finally {
      setLoading(false);
      setLastRefresh(new Date());
    }
  };

  // Fetch roommates for the current room
  const fetchRoommates = async (roomNumber) => {
    try {
      const response = await fetch(`http://localhost:8080/api/student/roommates?room=${roomNumber}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('hms_token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Roommates data:', data);
        
        if (data && data.data) {
          const transformedRoommates = data.data.map((roommate, index) => ({
            id: roommate.id || index + 1,
            name: roommate.name || '',
            studentId: roommate.studentId || roommate.enrollmentNo || '',
            course: roommate.course || '',
            phone: roommate.phone || '',
            bedId: roommate.bedNo || `Bed ${index + 1}`,
            avatar: roommate.name ? roommate.name.charAt(0).toUpperCase() : '',
            isEmpty: !roommate.name
          }));
          
          setRoommates(transformedRoommates);
        }
      } else {
        console.log('Roommates API not available, using empty data');
        setRoommates([]);
      }
    } catch (err) {
      console.log('Error fetching roommates:', err);
      setRoommates([]);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchRoomData();
  }, []);

  // Helper function to check if field has valid data
  const hasValidData = (value) => {
    return value && value !== '' && value !== null && value !== undefined;
  };

  // Helper function to render empty fields
  const renderEmptyField = (value, placeholder = 'N/A') => {
    return value || <span style={{ color: '#9CA3AF', fontStyle: 'italic' }}>{placeholder}</span>;
  };

  // Status Badge Component
  const StatusBadge = ({ label, color, bg }) => (
    <span className="srd-badge" style={{ color, backgroundColor: bg }}>
      {label}
    </span>
  );

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return { color: '#16a34a', bg: '#F0FDF4' };
      case 'pending': return { color: '#F59E0B', bg: '#FFF8E7' };
      case 'inactive': return { color: '#EF4444', bg: '#FEF2F2' };
      default: return { color: '#6B7280', bg: '#F4F6F9' };
    }
  };

  const quickActions = [
    {
      id: 1,
      label: 'Raise Complaint',
      desc: 'Report issues with mess, room, or plumbing.',
      icon: AlertTriangle,
      color: '#EF4444',
      bg: '#FEF2F2',
      onClick: () => navigate('/student/complaints')
    },
    {
      id: 2,
      label: 'Room Transfer',
      desc: 'Request a different block or room type.',
      icon: ArrowLeftRight,
      color: '#1F3C88',
      bg: '#EEF2FF',
      onClick: () => {}
    },
    {
      id: 3,
      label: 'Contact Warden',
      desc: 'Quick call for emergencies or policy help.',
      icon: Phone,
      color: '#2BBBAD',
      bg: '#E0F7F5',
      onClick: () => {}
    },
  ];

  if (loading) {
    return (
      <div className="srd-page">
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: '400px',
          gap: '16px'
        }}>
          <div className="spinner" style={{ 
            width: '40px', 
            height: '40px', 
            border: '4px solid #E5E7EB',
            borderTop: '4px solid #1F3C88',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ color: '#6B7280' }}>Loading room data from database...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="srd-page">
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: '400px',
          gap: '16px'
        }}>
          <Database size={48} style={{ color: '#EF4444' }} />
          <h3 style={{ color: '#EF4444', margin: 0 }}>Database Connection Error</h3>
          <p style={{ color: '#6B7280', textAlign: 'center', margin: 0 }}>{error}</p>
          <button
            onClick={fetchRoomData}
            style={{
              padding: '10px 20px',
              backgroundColor: '#1F3C88',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusColor(roomData.status);

  return (
    <div className="srd-page">

      {/* Header with Real-time Status */}
      <div className="srd-header">
        <div>
          <h1 className="srd-page-title">
            <Database size={24} style={{ marginRight: '8px' }} />
            Room Details - Real-time Data
          </h1>
          <p className="srd-page-sub">
            Live view of your room allocation from database
            <span style={{ marginLeft: '8px', color: '#10B981', fontSize: '12px' }}>
              Last updated: {lastRefresh.toLocaleTimeString()}
            </span>
          </p>
        </div>
        <div className="srd-header-actions">
          <button 
            onClick={fetchRoomData}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              padding: '8px 16px',
              backgroundColor: '#1F3C88',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            <RefreshCw size={16} />
            Refresh Now
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="srd-layout">

        {/* LEFT COLUMN */}
        <div className="srd-left">

          {/* Room Overview Card */}
          <div className="srd-room-overview">
            <div className="srd-room-overview-left">
              <div className="srd-room-icon-wrap">
                <BedDouble size={28} />
              </div>
              <div className="srd-room-info">
                <div className="srd-room-top-row">
                  <div>
                    <p className="srd-room-label">CURRENT ROOM</p>
                    <h2 className="srd-room-number">
                      {renderEmptyField(roomData.roomNumber, 'Not Assigned')}
                    </h2>
                    <p className="srd-room-meta">
                      <MapPin size={12} /> {renderEmptyField(roomData.block)} &bull; {renderEmptyField(roomData.floor)}
                    </p>
                  </div>
                  <StatusBadge label={renderEmptyField(roomData.status, 'Unknown')} {...statusConfig} />
                </div>
                <div className="srd-room-chips">
                  {hasValidData(roomData.roomType) && (
                    <div className="srd-chip">
                      <span className="srd-chip-label">ROOM TYPE</span>
                      <span className="srd-chip-value">{roomData.roomType}</span>
                    </div>
                  )}
                  {hasValidData(roomData.bedId) && (
                    <div className="srd-chip">
                      <span className="srd-chip-label">BED ID</span>
                      <span className="srd-chip-value">{roomData.bedId}</span>
                    </div>
                  )}
                  {hasValidData(roomData.occupancy) && (
                    <div className="srd-chip">
                      <span className="srd-chip-label">OCCUPANCY</span>
                      <span className="srd-chip-value">{roomData.occupancy}</span>
                    </div>
                  )}
                  {hasValidData(roomData.allocatedOn) && (
                    <div className="srd-chip">
                      <span className="srd-chip-label">ALLOCATED ON</span>
                      <span className="srd-chip-value">{roomData.allocatedOn}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Roommates */}
          <div className="srd-card">
            <div className="srd-card-header">
              <div className="srd-card-title-row">
                <Users size={17} color="#1F3C88" />
                <h3 className="srd-card-title">Roommates</h3>
                <span className="srd-count-badge">{roommates.filter(r => !r.isEmpty).length}</span>
              </div>
              <button className="srd-link-btn">Invite for Study</button>
            </div>

            <div className="srd-roommates-grid">
              {roommates.length > 0 ? (
                roommates.map((rm) =>
                  rm.isEmpty ? (
                    <div key={rm.id} className="srd-roommate-card srd-roommate-empty">
                      <BedDouble size={32} color="#CBD5E1" />
                      <p className="srd-empty-label">Empty Bed</p>
                      <p className="srd-empty-sub">Currently no student assigned to {rm.bedId}</p>
                    </div>
                  ) : (
                    <div key={rm.id} className="srd-roommate-card">
                      <div className="srd-roommate-header">
                        <div className="srd-roommate-avatar">{rm.avatar}</div>
                        <div className="srd-roommate-info">
                          <p className="srd-roommate-name">{rm.name}</p>
                          <p className="srd-roommate-id">{rm.studentId}</p>
                        </div>
                        <button
                          className="srd-mini-profile-btn"
                          onClick={() => navigate(`/student/roommates/${rm.studentId}`)}
                          title="View Full Profile"
                        >
                          <Eye size={14} />
                        </button>
                      </div>
                      <div className="srd-roommate-details">
                        <div className="srd-roommate-detail-item">
                          <BookOpen size={12} />
                          <span>{rm.course || 'Not specified'}</span>
                        </div>
                        <div className="srd-roommate-detail-item">
                          <Phone size={12} />
                          <span>{rm.phone || 'Not provided'}</span>
                        </div>
                        <div className="srd-roommate-detail-item">
                          <BedDouble size={12} />
                          <span>{rm.bedId}</span>
                        </div>
                      </div>
                      <button
                        className="srd-profile-btn"
                        onClick={() => navigate(`/student/roommates/${rm.studentId}`)}
                      >
                        <Eye size={14} /> View Profile
                      </button>
                    </div>
                  )
                )
              ) : (
                <div style={{ 
                  gridColumn: '1 / -1', 
                  textAlign: 'center', 
                  padding: '40px',
                  color: '#9CA3AF'
                }}>
                  <Users size={48} style={{ marginBottom: '16px' }} />
                  <p>No roommate data available</p>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div className="srd-right">

          {(hasValidData(roomData.monthlyRent) || hasValidData(roomData.nextDueDate) || hasValidData(roomData.rentStatus)) && (
            <div className="srd-card">
              <div className="srd-card-header">
                <div className="srd-card-title-row">
                  <CreditCard size={17} color="#1F3C88" />
                  <h3 className="srd-card-title">Rent Details</h3>
                </div>
                {hasValidData(roomData.rentStatus) && (
                  <StatusBadge label={roomData.rentStatus} {...getStatusColor(roomData.rentStatus)} />
                )}
              </div>

              <div className="srd-rent-row">
                {hasValidData(roomData.monthlyRent) && (
                  <div>
                    <p className="srd-rent-label">MONTHLY RENT</p>
                    <p className="srd-rent-amount">Rs. {roomData.monthlyRent}</p>
                  </div>
                )}
                {hasValidData(roomData.nextDueDate) && (
                  <div>
                    <p className="srd-rent-label">NEXT DUE DATE</p>
                    <p className="srd-rent-due">{roomData.nextDueDate}</p>
                  </div>
                )}
              </div>

              <button 
                className="srd-pay-btn"
                onClick={() => navigate('/student/fees')}
              >
                Pay Now
              </button>
              <p className="srd-pay-note">
                {roomData.rentStatus === 'Paid' 
                  ? 'You are currently cleared of all pending dues for this month.'
                  : 'Please clear your pending dues to avoid late fees.'
                }
              </p>
            </div>
          )}

          {/* Quick Actions */}
          <div className="srd-card">
            <div className="srd-card-header-simple">
              <Shield size={15} color="#6B7280" />
              <h3 className="srd-card-title-sm">QUICK ACTIONS</h3>
            </div>
            <div className="srd-quick-list">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button key={action.id} className="srd-quick-item" onClick={action.onClick}>
                    <div className="srd-quick-icon" style={{ background: action.bg, color: action.color }}>
                      <Icon size={18} />
                    </div>
                    <div className="srd-quick-text">
                      <span className="srd-quick-label">{action.label}</span>
                      <span className="srd-quick-desc">{action.desc}</span>
                    </div>
                    <ChevronRight size={15} color="#9CA3AF" />
                  </button>
                );
              })}
            </div>
          </div>

          {(hasValidData(roomData.checkInDate) || hasValidData(roomData.agreementEnd)) && (
            <div className="srd-card">
              <div className="srd-card-header-simple">
                <Info size={15} color="#6B7280" />
                <h3 className="srd-card-title-sm">ROOM POLICY &amp; INFO</h3>
              </div>
              <div className="srd-policy-rows">
                {hasValidData(roomData.checkInDate) && (
                  <div className="srd-policy-row">
                    <span className="srd-policy-label">Check-in Date</span>
                    <span className="srd-policy-value">{roomData.checkInDate}</span>
                  </div>
                )}
                {hasValidData(roomData.agreementEnd) && (
                  <div className="srd-policy-row">
                    <span className="srd-policy-label">Agreement End</span>
                    <span className="srd-policy-value">{roomData.agreementEnd}</span>
                  </div>
                )}
              </div>
              <div className="srd-policy-note">
                <p className="srd-policy-note-label">IMPORTANT NOTE</p>
                <p className="srd-policy-note-text">
                  "Room inspections are scheduled every 1st Monday of the month. Please ensure no unauthorized electronics are used."
                </p>
                <p className="srd-policy-note-time">Last verified: {lastRefresh.toLocaleString('en-IN')}</p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default RealTimeRoomData;
