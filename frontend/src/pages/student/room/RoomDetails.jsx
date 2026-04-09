import React, { useState } from 'react';
import {
  BedDouble, MapPin, Layers, Users, CreditCard,
  AlertTriangle, ArrowLeftRight, Phone, ChevronRight,
  CalendarCheck, CheckCircle2, Clock, FileText,
  ArrowLeft, Info, Shield
} from 'lucide-react';
import '../../../styles/student/room/roomDetails.css';

// ── Dummy Data ────────────────────────────────────────────────────────────────

const roomData = {
  roomNumber: 'A-101',
  block: 'Block A',
  floor: '1st Floor',
  roomType: 'Double Sharing (AC)',
  bedId: 'Bed B1',
  status: 'Active',
  occupancy: '2 / 2 Filled',
  allocatedOn: 'Aug 24, 2023',
  checkInDate: '24 Aug 2023',
  agreementEnd: '15 Jul 2024',
};

const roommatesData = [
  {
    id: 1,
    name: 'Rahul Sharma',
    studentId: 'STU-882910-HMS',
    course: 'B.Sc. Computer Science',
    phone: '+1 (555) 123-4567',
    bedId: 'Bed B2',
    avatar: 'R',
    isEmpty: false,
  },
  {
    id: 2,
    name: '',
    studentId: '',
    course: '',
    phone: '',
    bedId: 'Bed B3',
    avatar: '',
    isEmpty: true,
  },
];

const rentData = {
  monthly: '₹15,000',
  nextDueDate: 'April 01, 2024',
  status: 'Paid',
};

const quickActions = [
  {
    id: 1,
    label: 'Raise Complaint',
    desc: 'Report issues with mess, room, or plumbing.',
    icon: AlertTriangle,
    color: '#EF4444',
    bg: '#FEF2F2',
  },
  {
    id: 2,
    label: 'Room Transfer',
    desc: 'Request a different block or room type.',
    icon: ArrowLeftRight,
    color: '#1F3C88',
    bg: '#EEF2FF',
  },
  {
    id: 3,
    label: 'Contact Warden',
    desc: 'Quick call for emergencies or policy help.',
    icon: Phone,
    color: '#2BBBAD',
    bg: '#E0F7F5',
  },
];

const activeServiceTickets = [
  {
    id: '#CMP-9021',
    title: 'Leaking Taps',
    category: 'Plumbing',
    status: 'In Progress',
    statusColor: '#1F3C88',
    statusBg: '#EEF2FF',
  },
  {
    id: '#CMP-8942',
    title: 'AC Filter Cleaning',
    category: 'Maintenance',
    status: 'Pending',
    statusColor: '#F59E0B',
    statusBg: '#FFF8E7',
  },
];

const paymentHistory = [
  { id: 1, date: 'Mar 20, 2024', desc: 'Monthly Rent - March 2024', amount: '₹15,000', status: 'Paid' },
  { id: 2, date: 'Feb 21, 2024', desc: 'Utility Surcharge - Feb 2024', amount: '₹1,200', status: 'Paid' },
  { id: 3, date: 'Feb 20, 2024', desc: 'Monthly Rent - Feb 2024', amount: '₹15,000', status: 'Paid' },
  { id: 4, date: 'Jan 18, 2024', desc: 'Amenity Fee (Semester 2)', amount: '₹3,500', status: 'Paid' },
  { id: 5, date: 'Dec 20, 2023', desc: 'Monthly Rent - Dec 2023', amount: '₹15,000', status: 'Paid' },
];

// ── Sub-Components ────────────────────────────────────────────────────────────

const StatusBadge = ({ label, color, bg }) => (
  <span className="srd-badge" style={{ color, backgroundColor: bg }}>
    {label}
  </span>
);

// ── Main Component ────────────────────────────────────────────────────────────

const StudentRoomDetails = () => {
  return (
    <div className="srd-page">

      {/* ── Page Header ── */}
      <div className="srd-header">
        <div>
          <h1 className="srd-page-title">Room Details</h1>
          <p className="srd-page-sub">View your current room allocation, roommates, and service status.</p>
        </div>
        <div className="srd-header-actions">
          <button className="srd-btn-outline">
            <ArrowLeftRight size={15} />
            Request Room Change
          </button>
          <button className="srd-btn-primary">
            <AlertTriangle size={15} />
            Raise Complaint
          </button>
        </div>
      </div>

      {/* ── Main Layout: Left + Right ── */}
      <div className="srd-layout">

        {/* ── LEFT COLUMN ── */}
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
                    <h2 className="srd-room-number">{roomData.roomNumber}</h2>
                    <p className="srd-room-meta">
                      <MapPin size={12} /> {roomData.block} &bull; {roomData.floor}
                    </p>
                  </div>
                  <StatusBadge label={roomData.status} color="#16a34a" bg="#F0FDF4" />
                </div>
                <div className="srd-room-chips">
                  <div className="srd-chip">
                    <span className="srd-chip-label">ROOM TYPE</span>
                    <span className="srd-chip-value">{roomData.roomType}</span>
                  </div>
                  <div className="srd-chip">
                    <span className="srd-chip-label">BED ID</span>
                    <span className="srd-chip-value">{roomData.bedId}</span>
                  </div>
                  <div className="srd-chip">
                    <span className="srd-chip-label">OCCUPANCY</span>
                    <span className="srd-chip-value srd-chip-red">{roomData.occupancy}</span>
                  </div>
                  <div className="srd-chip">
                    <span className="srd-chip-label">ALLOCATED ON</span>
                    <span className="srd-chip-value">{roomData.allocatedOn}</span>
                  </div>
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
                <span className="srd-count-badge">1</span>
              </div>
              <button className="srd-link-btn">Invite for Study</button>
            </div>

            <div className="srd-roommates-grid">
              {roommatesData.map((rm) =>
                rm.isEmpty ? (
                  <div key={rm.id} className="srd-roommate-card srd-roommate-empty">
                    <BedDouble size={32} color="#CBD5E1" />
                    <p className="srd-empty-label">Empty Bed</p>
                    <p className="srd-empty-sub">Currently no student assigned to {rm.bedId}</p>
                  </div>
                ) : (
                  <div key={rm.id} className="srd-roommate-card">
                    <div className="srd-roommate-avatar">{rm.avatar}</div>
                    <p className="srd-roommate-name">{rm.name}</p>
                    <p className="srd-roommate-id">{rm.studentId}</p>
                    <p className="srd-roommate-course">{rm.course}</p>
                    <p className="srd-roommate-phone">
                      <Phone size={12} /> {rm.phone}
                    </p>
                    <button className="srd-profile-btn">View Profile</button>
                  </div>
                )
              )}

              {/* Add Roommate slot */}
              <div className="srd-roommate-card srd-roommate-add">
                <div className="srd-add-icon">+</div>
                <p className="srd-empty-label">Add Roommate</p>
                <p className="srd-empty-sub">Request specific roommate pairing</p>
              </div>
            </div>
          </div>

          {/* Recent Payment History */}
          <div className="srd-card">
            <div className="srd-card-header">
              <div className="srd-card-title-row">
                <CreditCard size={17} color="#1F3C88" />
                <h3 className="srd-card-title">Recent Payment History</h3>
              </div>
              <button className="srd-link-btn">View Full History</button>
            </div>
            <p className="srd-card-sub">Review your last 5 transactions related to this room.</p>

            {/* Desktop Table */}
            <div className="srd-table-wrap">
              <table className="srd-table">
                <thead>
                  <tr>
                    <th>DATE</th>
                    <th>DESCRIPTION</th>
                    <th>AMOUNT</th>
                    <th>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentHistory.map((p) => (
                    <tr key={p.id}>
                      <td className="srd-td-date">{p.date}</td>
                      <td className="srd-td-desc">{p.desc}</td>
                      <td className="srd-td-amount">{p.amount}</td>
                      <td>
                        <StatusBadge label={p.status} color="#16a34a" bg="#F0FDF4" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="srd-payment-cards">
              {paymentHistory.map((p) => (
                <div key={p.id} className="srd-payment-card">
                  <div className="srd-payment-card-top">
                    <span className="srd-td-desc">{p.desc}</span>
                    <StatusBadge label={p.status} color="#16a34a" bg="#F0FDF4" />
                  </div>
                  <div className="srd-payment-card-bot">
                    <span className="srd-td-date">{p.date}</span>
                    <span className="srd-td-amount">{p.amount}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="srd-right">

          {/* Rent Details */}
          <div className="srd-card">
            <div className="srd-card-header">
              <div className="srd-card-title-row">
                <CreditCard size={17} color="#1F3C88" />
                <h3 className="srd-card-title">Rent Details</h3>
              </div>
              <StatusBadge label="Paid" color="#16a34a" bg="#F0FDF4" />
            </div>

            <div className="srd-rent-row">
              <div>
                <p className="srd-rent-label">MONTHLY RENT</p>
                <p className="srd-rent-amount">{rentData.monthly}</p>
              </div>
              <div>
                <p className="srd-rent-label">NEXT DUE DATE</p>
                <p className="srd-rent-due">{rentData.nextDueDate}</p>
              </div>
            </div>

            <button className="srd-pay-btn">Pay Next Installment</button>
            <p className="srd-pay-note">You are currently cleared of all pending dues for this month.</p>
          </div>

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
                  <button key={action.id} className="srd-quick-item">
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

          {/* Active Room Service */}
          <div className="srd-card">
            <div className="srd-card-header">
              <div className="srd-card-title-row">
                <Clock size={17} color="#1F3C88" />
                <h3 className="srd-card-title">Active Room Service</h3>
              </div>
            </div>
            <div className="srd-tickets-list">
              {activeServiceTickets.map((t) => (
                <div key={t.id} className="srd-ticket-item">
                  <div className="srd-ticket-top">
                    <span className="srd-ticket-id">{t.id}</span>
                    <StatusBadge label={t.status} color={t.statusColor} bg={t.statusBg} />
                  </div>
                  <p className="srd-ticket-title">{t.title}</p>
                  <p className="srd-ticket-cat">{t.category}</p>
                </div>
              ))}
            </div>
            <button className="srd-view-all-btn">View All Room Tickets</button>
          </div>

          {/* Room Policy & Info */}
          <div className="srd-card">
            <div className="srd-card-header-simple">
              <Info size={15} color="#6B7280" />
              <h3 className="srd-card-title-sm">ROOM POLICY &amp; INFO</h3>
            </div>
            <div className="srd-policy-rows">
              <div className="srd-policy-row">
                <span className="srd-policy-label">Check-in Date</span>
                <span className="srd-policy-value">{roomData.checkInDate}</span>
              </div>
              <div className="srd-policy-row">
                <span className="srd-policy-label">Agreement End</span>
                <span className="srd-policy-value">{roomData.agreementEnd}</span>
              </div>
            </div>
            <div className="srd-policy-note">
              <p className="srd-policy-note-label">IMPORTANT NOTE</p>
              <p className="srd-policy-note-text">
                "Room inspections are scheduled every 1st Monday of the month. Please ensure no unauthorized electronics are used."
              </p>
              <p className="srd-policy-note-time">Last verified: 12 Mar 2024 • 10:45 AM</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default StudentRoomDetails;