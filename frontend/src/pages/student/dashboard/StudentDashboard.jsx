import React, { useState } from 'react';
import {
  AlertTriangle, Bell, Building2, CalendarCheck, Clock,
  CreditCard, FileText, MessageSquare, Phone, Shield,
  ThumbsUp, TrendingUp, ChevronRight, Plus, CheckCircle2,
  AlertCircle, Loader2, ExternalLink
} from 'lucide-react';
import '../../../styles/student/dashboard/StudentDashboard.css';

// ── Dummy Data ────────────────────────────────────────────────────────────────

const studentInfo = {
  name: 'Aryan Sharma',
  room: '101',
  block: 'B',
  floor: '1st Floor',
  course: 'B.C.A',
  joinDate: '2025-06-01',
};

const statsData = [
  {
    id: 1,
    label: 'Current Room',
    value: `Room ${studentInfo.room}`,
    sub: `${studentInfo.block} Block • ${studentInfo.floor}`,
    icon: Building2,
    accent: '#1F3C88',
    light: '#EEF2FF',
    highlight: true,
  },
  {
    id: 2,
    label: 'Fee Status',
    value: '₹0.00',
    sub: 'All dues cleared',
    badge: 'PAID',
    badgeColor: '#22c55e',
    icon: CreditCard,
    accent: '#2BBBAD',
    light: '#E0F7F5',
  },
  {
    id: 3,
    label: 'My Complaints',
    value: '2 Open',
    sub: '3 Resolved recently',
    icon: MessageSquare,
    accent: '#F59E0B',
    light: '#FFF8E7',
  },
  {
    id: 4,
    label: 'Notifications',
    value: '12',
    sub: '4 Unread alerts',
    badge: '+3 new',
    badgeColor: '#EF4444',
    icon: Bell,
    accent: '#8B5CF6',
    light: '#F3F0FF',
  },
];

const quickActions = [
  {
    id: 1,
    label: 'Raise Complaint',
    desc: 'Report issues with room, mess, or facilities',
    icon: AlertTriangle,
    color: '#EF4444',
    bg: '#FEF2F2',
  },
  {
    id: 2,
    label: 'View Feedback',
    desc: 'Track status of your previous requests',
    icon: ThumbsUp,
    color: '#2BBBAD',
    bg: '#E0F7F5',
  },
  {
    id: 3,
    label: 'Apply Leave',
    desc: 'Submit out-station or home visit requests',
    icon: CalendarCheck,
    color: '#1F3C88',
    bg: '#EEF2FF',
  },
  {
    id: 4,
    label: 'Pay Fees',
    desc: 'View breakdown and pay pending dues',
    icon: CreditCard,
    color: '#F59E0B',
    bg: '#FFF8E7',
  },
];

const announcements = [
  {
    id: 1,
    title: 'Maintenance Schedule: Block B',
    desc: 'Regular plumbing maintenance scheduled for tomorrow between 10:00 AM - 2:00 PM.',
    time: '2 hours ago • By Admin',
    isNew: true,
    accent: '#2BBBAD',
  },
  {
    id: 2,
    title: 'Mess Menu Update: Summer Season',
    desc: 'New dinner menu featuring seasonal vegetables and desserts starting next Monday.',
    time: 'Yesterday • By Mess Manager',
    isNew: false,
    accent: '#1F3C88',
  },
  {
    id: 3,
    title: 'Hostel Fest 2024: Volunteer Calls',
    desc: 'Register as a volunteer for the upcoming annual cultural fest and get certificates.',
    time: '3 days ago • By Cultural Sec.',
    isNew: false,
    accent: '#8B5CF6',
  },
];

const systemAlerts = [
  {
    id: 1,
    title: 'Emergency Drill Scheduled',
    desc: 'Block B will have a fire drill today at 4:30 PM. Please gather at the assembly point.',
    badge: 'HIGH PRIORITY',
    badgeColor: '#EF4444',
    time: null,
    dot: '#EF4444',
  },
  {
    id: 2,
    title: 'Mess Refund Processed',
    desc: 'The mess refund for the week of April 1st has been credited to your wallet.',
    time: '10:45 AM',
    dot: '#2BBBAD',
  },
  {
    id: 3,
    title: 'Complaint Resolved',
    desc: "Your request #CMP-8810 'Broken Fan' has been marked as resolved. Please verify.",
    time: 'Yesterday',
    dot: '#1F3C88',
  },
  {
    id: 4,
    title: 'Upcoming Fee Deadline',
    desc: 'Quarterly hostel fees for May-July are due by 30th April. Pay soon to avoid penalties.',
    time: '2 days ago',
    dot: '#F59E0B',
  },
];

const statusConfig = {
  'In Progress': { color: '#1F3C88', bg: '#EEF2FF' },
  Pending: { color: '#F59E0B', bg: '#FFF8E7' },
  Completed: { color: '#22c55e', bg: '#F0FDF4' },
};

const complaints = [
  { id: '#CMP-9021', title: 'Leaking Taps', category: 'Plumbing', status: 'In Progress' },
  { id: '#CMP-8942', title: 'Wi-Fi Connectivity', category: 'IT Services', status: 'Pending' },
  { id: '#CMP-8810', title: 'Broken Fan', category: 'Electrical', status: 'Completed' },
];

const activityTypeIcons = {
  'Fee Payment': CreditCard,
  'Room Check': Building2,
  'Complaint Log': MessageSquare,
  'Leave Approval': CalendarCheck,
  'Notice Sent': Bell,
};

const activities = [
  { id: 1, type: 'Fee Payment', desc: 'Mess & Utility Fee for April 2024 paid successfully.', dateTime: '2024-03-20 14:30', status: 'Completed' },
  { id: 2, type: 'Room Check', desc: 'Routine inventory check completed by Floor Supervisor.', dateTime: '2024-03-19 10:00', status: 'Completed' },
  { id: 3, type: 'Complaint Log', desc: 'New complaint #CMP-9021 registered for plumbing repair.', dateTime: '2024-03-18 16:45', status: 'Pending' },
  { id: 4, type: 'Leave Approval', desc: 'Weekend leave request for home visit approved.', dateTime: '2024-03-17 09:15', status: 'Completed' },
  { id: 5, type: 'Notice Sent', desc: 'Summer vacation closing notice acknowledged.', dateTime: '2024-03-16 11:00', status: 'Completed' },
];

// ── Sub-components ────────────────────────────────────────────────────────────

const StatusBadge = ({ status }) => {
  const cfg = statusConfig[status] || { color: '#6B7280', bg: '#F4F6F9' };
  return (
    <span className="sd-badge" style={{ color: cfg.color, backgroundColor: cfg.bg }}>
      {status === 'In Progress' && <Loader2 size={10} className="sd-badge-icon spin" />}
      {status === 'Pending' && <AlertCircle size={10} className="sd-badge-icon" />}
      {status === 'Completed' && <CheckCircle2 size={10} className="sd-badge-icon" />}
      {status}
    </span>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────

const StudentDashboard = () => {
  const [activityFilter, setActivityFilter] = useState('Last 24 Hours');

  return (
    <div className="sd-page">

      {/* ── Welcome Header ── */}
      <div className="sd-header">
        <div className="sd-header-left">
          <h1 className="sd-welcome-title">Welcome back, {studentInfo.name}!</h1>
          <p className="sd-welcome-sub">Everything looks good with your hostel stay today.</p>
          <div className="sd-room-badge">
            <Building2 size={13} />
            Room {studentInfo.room} • Block {studentInfo.block}
          </div>
        </div>
        <div className="sd-header-actions">
          <button className="sd-btn-primary">
            <AlertTriangle size={15} />
            Raise Complaint
          </button>
          <button className="sd-btn-outline">
            <CalendarCheck size={15} />
            Request Leave
          </button>
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div className="sd-stats-grid">
        {statsData.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.id}
              className={`sd-stat-card ${stat.highlight ? 'sd-stat-card--highlight' : ''}`}
              style={stat.highlight ? { background: `linear-gradient(135deg, ${stat.accent} 0%, #162d6b 100%)` } : {}}
            >
              <div className="sd-stat-top">
                <span
                  className="sd-stat-label"
                  style={{ color: stat.highlight ? 'rgba(255,255,255,0.75)' : '#6B7280' }}
                >
                  {stat.label}
                </span>
                {stat.badge && (
                  <span
                    className="sd-stat-badge"
                    style={{ backgroundColor: stat.badgeColor, color: '#fff' }}
                  >
                    {stat.badge}
                  </span>
                )}
              </div>
              <div className="sd-stat-body">
                <div>
                  <p
                    className="sd-stat-value"
                    style={{ color: stat.highlight ? '#fff' : '#2E2E2E' }}
                  >
                    {stat.value}
                  </p>
                  <p
                    className="sd-stat-sub"
                    style={{ color: stat.highlight ? 'rgba(255,255,255,0.65)' : '#6B7280' }}
                  >
                    {stat.sub}
                  </p>
                </div>
                <div
                  className="sd-stat-icon"
                  style={{
                    background: stat.highlight ? 'rgba(255,255,255,0.15)' : stat.light,
                    color: stat.highlight ? '#fff' : stat.accent,
                  }}
                >
                  <Icon size={22} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Quick Actions ── */}
      <div className="sd-card">
        <h2 className="sd-section-title">Quick Actions</h2>
        <div className="sd-quick-grid">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button key={action.id} className="sd-quick-btn">
                <div className="sd-quick-icon" style={{ background: action.bg, color: action.color }}>
                  <Icon size={26} />
                </div>
                <div className="sd-quick-text">
                  <span className="sd-quick-label">{action.label}</span>
                  <span className="sd-quick-desc">{action.desc}</span>
                </div>
                <ChevronRight size={16} className="sd-quick-arrow" />
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Announcements + System Alerts ── */}
      <div className="sd-middle-row">

        {/* Announcements */}
        <div className="sd-card">
          <div className="sd-card-header">
            <div>
              <h2 className="sd-section-title">Recent Announcements</h2>
              <p className="sd-section-sub">Stay updated with latest hostel news</p>
            </div>
            <button className="sd-link-btn">View All <ExternalLink size={13} /></button>
          </div>
          <div className="sd-ann-list">
            {announcements.map((a) => (
              <div key={a.id} className="sd-ann-item">
                <div className="sd-ann-accent" style={{ background: a.accent }} />
                <div className="sd-ann-body">
                  <div className="sd-ann-title-row">
                    <span className="sd-ann-title">{a.title}</span>
                    {a.isNew && <span className="sd-new-badge">NEW</span>}
                  </div>
                  <p className="sd-ann-desc">{a.desc}</p>
                  <span className="sd-ann-time">{a.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Alerts */}
        <div className="sd-card sd-alerts-card">
          <div className="sd-card-header">
            <h2 className="sd-section-title sd-alerts-title">
              <AlertCircle size={18} color="#EF4444" />
              System Alerts
            </h2>
          </div>
          <div className="sd-alerts-list">
            {systemAlerts.map((alert) => (
              <div key={alert.id} className="sd-alert-item">
                <span className="sd-alert-dot" style={{ background: alert.dot }} />
                <div className="sd-alert-content">
                  <span className="sd-alert-title">{alert.title}</span>
                  <p className="sd-alert-desc">{alert.desc}</p>
                  {alert.badge && (
                    <span className="sd-priority-badge" style={{ color: alert.badgeColor, borderColor: alert.badgeColor }}>
                      {alert.badge}
                    </span>
                  )}
                  {alert.time && <span className="sd-alert-time">{alert.time}</span>}
                </div>
              </div>
            ))}
          </div>
          <button className="sd-view-notif-btn">View All Notifications</button>
        </div>

      </div>

      {/* ── Active Complaints ── */}
      <div className="sd-card">
        <div className="sd-card-header">
          <div>
            <h2 className="sd-section-title">Active Complaints</h2>
            <p className="sd-section-sub">Tracking your ongoing service requests</p>
          </div>
          <button className="sd-btn-primary sd-btn-sm">
            <Plus size={14} /> New Request
          </button>
        </div>

        {/* Desktop Table */}
        <div className="sd-table-wrap">
          <table className="sd-table">
            <thead>
              <tr>
                <th>COMPLAINT ID</th>
                <th>TITLE</th>
                <th>CATEGORY</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((c) => (
                <tr key={c.id}>
                  <td className="sd-complaint-id">{c.id}</td>
                  <td className="sd-complaint-title">{c.title}</td>
                  <td className="sd-complaint-cat">{c.category}</td>
                  <td><StatusBadge status={c.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="sd-complaint-cards">
          {complaints.map((c) => (
            <div key={c.id} className="sd-complaint-card">
              <div className="sd-complaint-card-top">
                <span className="sd-complaint-id">{c.id}</span>
                <StatusBadge status={c.status} />
              </div>
              <p className="sd-complaint-title">{c.title}</p>
              <span className="sd-complaint-cat">{c.category}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Quick Support + Recent Activity ── */}
      <div className="sd-bottom-row">

        {/* Quick Support */}
        <div className="sd-support-card">
          <div className="sd-support-header">
            <Shield size={20} />
            <h2 className="sd-support-title">Quick Support</h2>
          </div>
          <p className="sd-support-sub">Need urgent help with your room or security? Contact our 24/7 warden helpline.</p>
          <div className="sd-support-contacts">
            <div className="sd-contact-item">
              <div className="sd-contact-label">
                <Phone size={14} />
                Warden Desk
              </div>
              <span className="sd-contact-num">+91 98765-43210</span>
            </div>
            <div className="sd-contact-item">
              <div className="sd-contact-label">
                <Shield size={14} />
                Security Desk
              </div>
              <span className="sd-contact-num">Ext. 404</span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="sd-card sd-activity-card">
          <div className="sd-card-header">
            <div className="sd-activity-title-row">
              <Clock size={18} color="#1F3C88" />
              <h2 className="sd-section-title">Recent Activity</h2>
            </div>
            <div className="sd-filter-group">
              {['Last 24 Hours', 'All Time'].map((f) => (
                <button
                  key={f}
                  className={`sd-filter-btn ${activityFilter === f ? 'sd-filter-active' : ''}`}
                  onClick={() => setActivityFilter(f)}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Desktop Table */}
          <div className="sd-table-wrap">
            <table className="sd-table">
              <thead>
                <tr>
                  <th>ACTIVITY TYPE</th>
                  <th>DESCRIPTION</th>
                  <th>DATE &amp; TIME</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((a) => {
                  const Icon = activityTypeIcons[a.type] || FileText;
                  return (
                    <tr key={a.id}>
                      <td>
                        <div className="sd-act-type">
                          <Icon size={14} />
                          {a.type}
                        </div>
                      </td>
                      <td className="sd-act-desc">{a.desc}</td>
                      <td className="sd-act-time">
                        <Clock size={12} />
                        {a.dateTime}
                      </td>
                      <td><StatusBadge status={a.status} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="sd-activity-cards">
            {activities.map((a) => {
              const Icon = activityTypeIcons[a.type] || FileText;
              return (
                <div key={a.id} className="sd-activity-card">
                  <div className="sd-activity-card-top">
                    <span className="sd-act-type"><Icon size={13} />{a.type}</span>
                    <StatusBadge status={a.status} />
                  </div>
                  <p className="sd-act-desc">{a.desc}</p>
                  <span className="sd-act-time"><Clock size={11} />{a.dateTime}</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default StudentDashboard;