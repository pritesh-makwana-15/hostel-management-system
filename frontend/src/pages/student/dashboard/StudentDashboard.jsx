import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle, Bell, Building2, CalendarCheck, Clock,
  CreditCard, FileText, MessageSquare, Phone, Shield,
  ThumbsUp, ChevronRight, Plus,
  AlertCircle, ExternalLink
} from 'lucide-react';
import { studentApi } from '../../../services/studentApi';
import { studentFeeApi } from '../../../services/adminFeeApi';
import '../../../styles/student/dashboard/StudentDashboard.css';

const quickActions = [
  {
    id: 1,
    label: 'Raise Complaint',
    desc: 'Report issues with room, mess, or facilities',
    icon: AlertTriangle,
    color: '#EF4444',
    bg: '#FEF2F2',
    route: '/student/complaints/new',
  },
  {
    id: 2,
    label: 'View Feedback',
    desc: 'Track status of your previous requests',
    icon: ThumbsUp,
    color: '#2BBBAD',
    bg: '#E0F7F5',
    route: '/student/complaints',
  },
  {
    id: 4,
    label: 'Request Fee Verification',
    desc: 'View breakdown and submit payment requests',
    icon: CreditCard,
    color: '#F59E0B',
    bg: '#FFF8E7',
    route: '/student/fees/request',
  },
];

const defaultAnnouncements = [
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
    time: 'Yesterday • By Warden',
    isNew: false,
    accent: '#1F3C88',
  },
  {
    id: 3,
    title: 'Hostel Fest 2024: Volunteer Calls',
    desc: 'Register as a volunteer for the upcoming annual cultural fest and get certificates.',
    time: '3 days ago • By Admin',
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

// eslint-disable-next-line react/prop-types
const StatusBadge = ({ status }) => {
  const cfg = statusConfig[status] || { color: '#6B7280', bg: '#F3F4F6' };
  return (
    <span className="sd-status-badge" style={{ color: cfg.color, background: cfg.bg }}>
      {status}
    </span>
  );
};

const normalizeComplaintStatus = (status) => {
  const raw = String(status || '').trim().toLowerCase();
  if (raw === 'resolved' || raw === 'closed' || raw === 'completed') return 'Completed';
  if (raw === 'in progress' || raw === 'in_progress') return 'In Progress';
  if (raw === 'pending' || raw === 'open') return 'Pending';
  return 'Pending';
};

const activityTypeIcons = {
  'Fee Payment': CreditCard,
  'Room Check': Building2,
  'Complaint Log': MessageSquare,
  'Leave Approval': CalendarCheck,
  'Notice Sent': Bell,
};

const toAnnouncementColor = (priority) => {
  const p = String(priority || '').toUpperCase();
  if (p === 'URGENT') return '#EF4444';
  if (p === 'IMPORTANT') return '#F59E0B';
  return '#2BBBAD';
};

const toAnnouncementTime = (value, createdBy) => {
  const d = value ? new Date(value) : null;
  if (!d || Number.isNaN(d.getTime())) {
    return `By ${createdBy || 'Admin/Warden'}`;
  }
  const dt = d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  return `${dt} • By ${createdBy || 'Admin/Warden'}`;
};

const toActivityDateLabel = (value) => {
  const d = value ? new Date(value) : null;
  if (!d || Number.isNaN(d.getTime())) {
    return '-';
  }
  const day = d.toLocaleDateString('en-IN', { year: 'numeric', month: '2-digit', day: '2-digit' });
  const time = d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false });
  return `${day} ${time}`;
};

const toPaymentActivityStatus = (status) => {
  const s = String(status || '').toUpperCase();
  if (s === 'VERIFIED') return 'Completed';
  if (s === 'REJECTED' || s === 'REFUNDED') return 'Completed';
  return 'Pending';
};

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [activityFilter, setActivityFilter] = useState('Last 24 Hours');
  const [studentInfo, setStudentInfo] = useState(null);
  const [feeData, setFeeData] = useState(null);
  const [announcements, setAnnouncements] = useState(defaultAnnouncements);
  const [complaints, setComplaints] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [paymentSummary, setPaymentSummary] = useState({ paidAmount: 0, pendingAmount: 0 });
  const [loading, setLoading] = useState(true);

  const profile = studentInfo || {
    name: 'Student',
    room: 'N/A',
    block: 'N/A',
    floor: 'N/A',
  };

  const paidAmount = Number(
    paymentSummary.paidAmount > 0 ? paymentSummary.paidAmount : Number(feeData?.paidAmount || 0)
  );
  const pendingAmount = Number(
    paymentSummary.pendingAmount > 0 || Number(feeData?.balance || 0) === 0
      ? paymentSummary.pendingAmount
      : Number(feeData?.balance || 0)
  );

  let feeStatus = String(feeData?.status || 'PENDING').toUpperCase();
  if (pendingAmount <= 0) {
    feeStatus = 'PAID';
  } else if (paidAmount > 0) {
    feeStatus = 'PARTIAL';
  }

  const openComplaintsCount = complaints.filter((c) => c.status !== 'Completed').length;
  const completedComplaintsCount = complaints.filter((c) => c.status === 'Completed').length;

  const filteredActivities = recentActivities.filter((a) => {
    if (activityFilter === 'All Time') return true;
    const ts = new Date(a.timestamp).getTime();
    if (Number.isNaN(ts)) return false;
    return ts >= Date.now() - (24 * 60 * 60 * 1000);
  });

  const statsData = [
    {
      id: 1,
      label: 'Current Room',
      value: `Room ${profile.room}`,
      sub: `${profile.block} Block • ${profile.floor}`,
      icon: Building2,
      accent: '#1F3C88',
      light: '#EEF2FF',
      highlight: true,
    },
    {
      id: 2,
      label: 'Amount Paid',
      value: `₹${paidAmount.toLocaleString('en-IN')}`,
      sub: feeStatus === 'PAID' ? 'All dues cleared' : `₹${pendingAmount.toLocaleString('en-IN')} pending`,
      badge: feeStatus,
      badgeColor: feeStatus === 'PAID' ? '#22c55e' : '#F59E0B',
      icon: CreditCard,
      accent: '#2BBBAD',
      light: '#E0F7F5',
    },
    {
      id: 3,
      label: 'My Complaints',
      value: `${openComplaintsCount} Open`,
      sub: `${completedComplaintsCount} Resolved recently`,
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

  useEffect(() => {
    loadStudentData();
  }, []);

  useEffect(() => {
    const onFocus = () => {
      loadStudentData();
    };

    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  const loadStudentData = async () => {
    try {
      setLoading(true);
      const [profileResult, feeResult, paymentsResult, announcementsResult, complaintsResult] = await Promise.allSettled([
        studentApi.getProfile(),
        studentFeeApi.getFeeDetails(),
        studentFeeApi.getPayments(),
        studentApi.getActiveAnnouncements(),
        studentApi.getComplaints(),
      ]);

      const profileResponse = profileResult.status === 'fulfilled' ? profileResult.value : null;
      const feeResponse = feeResult.status === 'fulfilled' ? feeResult.value : null;
      const paymentsResponse = paymentsResult.status === 'fulfilled' ? paymentsResult.value : null;
      const announcementResponse = announcementsResult.status === 'fulfilled' ? announcementsResult.value : null;
      const complaintsResponse = complaintsResult.status === 'fulfilled' ? complaintsResult.value : null;

      const profileData = profileResponse?.data?.data;
      const fee = feeResponse?.data?.data;

      if (profileData) {
        setStudentInfo({
          name: profileData.name || 'Student',
          room: profileData.roomNo || 'N/A',
          block: profileData.hostelBlock || 'N/A',
          floor: profileData.floor || 'N/A',
          course: profileData.course || 'N/A',
          joinDate: profileData.joinDate || 'N/A',
        });
      }

      const allPayments = Array.isArray(paymentsResponse?.data?.data) ? paymentsResponse.data.data : [];
      const verifiedTotal = allPayments
        .filter((p) => String(p.status || '').toUpperCase() === 'VERIFIED')
        .reduce((sum, p) => sum + Number(p.amount || 0), 0);

      if (fee) {
        setFeeData(fee);
      }

      const totalFee = Number(fee?.totalFee || 0);
      const pending = totalFee > 0
        ? Math.max(0, totalFee - verifiedTotal)
        : Number(fee?.balance || 0);

      setPaymentSummary({
        paidAmount: verifiedTotal,
        pendingAmount: pending,
      });

      const liveRows = Array.isArray(announcementResponse?.data?.data)
        ? announcementResponse.data.data
        : [];

      if (liveRows.length > 0) {
        const mapped = liveRows
          .slice()
          .sort((a, b) => {
            const at = new Date(a.publishDate || a.createdAt || 0).getTime();
            const bt = new Date(b.publishDate || b.createdAt || 0).getTime();
            return bt - at;
          })
          .slice(0, 3)
          .map((a, idx) => ({
            id: a.id || `ann-${idx}`,
            title: a.title || 'Hostel Announcement',
            desc: a.message || 'No details provided.',
            time: toAnnouncementTime(a.publishDate || a.createdAt, a.createdBy),
            isNew: idx === 0,
            accent: toAnnouncementColor(a.priority),
          }));

        setAnnouncements(mapped);
      } else {
        setAnnouncements(defaultAnnouncements);
      }

      const complaintRows = Array.isArray(complaintsResponse?.data?.data)
        ? complaintsResponse.data.data
        : [];

      const mappedComplaints = complaintRows
        .slice()
        .sort((a, b) => {
          const aDate = new Date(a.submittedDate || 0).getTime();
          const bDate = new Date(b.submittedDate || 0).getTime();
          return bDate - aDate;
        })
        .slice(0, 5)
        .map((c, idx) => ({
          id: c.id || `CMP-${idx + 1}`,
          title: c.title || 'Complaint',
          category: c.category || 'General',
          status: normalizeComplaintStatus(c.status),
        }));

      setComplaints(mappedComplaints);

      const paymentActivities = allPayments.map((p, idx) => {
        const ts = p.verifiedAt || p.createdAt || p.paymentDate;
        return {
          id: `pay-${p.paymentId || idx}`,
          type: 'Fee Payment',
          desc: p.amount
            ? `Payment request of ₹${Number(p.amount).toLocaleString('en-IN')} was submitted (${String(p.status || 'PENDING').toUpperCase()}).`
            : `Payment request ${p.paymentId || ''} was updated.`,
          dateTime: toActivityDateLabel(ts),
          timestamp: ts,
          status: toPaymentActivityStatus(p.status),
        };
      });

      const complaintActivities = complaintRows.map((c, idx) => {
        let ts = null;
        if (c.submittedDate) {
          const submittedTime = c.submittedTime ? String(c.submittedTime) : '';
          ts = submittedTime ? `${c.submittedDate}T${submittedTime}` : `${c.submittedDate}`;
        }
        return {
          id: `cmp-${c.id || idx}`,
          type: 'Complaint Log',
          desc: `${c.id || 'Complaint'}: ${c.title || 'Issue reported'}`,
          dateTime: toActivityDateLabel(ts),
          timestamp: ts,
          status: normalizeComplaintStatus(c.status),
        };
      });

      const announcementActivities = liveRows.map((a, idx) => {
        const ts = a.publishDate || a.createdAt;
        return {
          id: `ann-${a.id || idx}`,
          type: 'Notice Sent',
          desc: a.title || 'Announcement posted',
          dateTime: toActivityDateLabel(ts),
          timestamp: ts,
          status: 'Completed',
        };
      });

      const mergedActivities = [...paymentActivities, ...complaintActivities, ...announcementActivities]
        .filter((a) => a.timestamp && !Number.isNaN(new Date(a.timestamp).getTime()))
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 10);

      setRecentActivities(mergedActivities);
    } catch (error) {
      console.error('Error loading student data:', error);
      setAnnouncements(defaultAnnouncements);
      setComplaints([]);
      setRecentActivities([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="sd-page">
        <div className="sd-card">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="sd-page">
      <div className="sd-header">
        <div className="sd-header-left">
          <h1 className="sd-welcome-title">Welcome back, {profile.name}!</h1>
          <p className="sd-welcome-sub">Everything looks good with your hostel stay today.</p>
          <div className="sd-room-badge">
            <Building2 size={13} />
            Room {profile.room} • Block {profile.block}
          </div>
        </div>
        <div className="sd-header-actions">
          <button className="sd-btn-primary" onClick={() => navigate('/student/complaints/new')}>
            <AlertTriangle size={15} />
            Raise Complaint
          </button>
        </div>
      </div>

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
                <span className="sd-stat-label" style={{ color: stat.highlight ? 'rgba(255,255,255,0.75)' : '#6B7280' }}>
                  {stat.label}
                </span>
                {stat.badge && (
                  <span className="sd-stat-badge" style={{ backgroundColor: stat.badgeColor, color: '#fff' }}>
                    {stat.badge}
                  </span>
                )}
              </div>
              <div className="sd-stat-body">
                <div>
                  <p className="sd-stat-value" style={{ color: stat.highlight ? '#fff' : '#2E2E2E' }}>{stat.value}</p>
                  <p className="sd-stat-sub" style={{ color: stat.highlight ? 'rgba(255,255,255,0.65)' : '#6B7280' }}>{stat.sub}</p>
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

      <div className="sd-card">
        <h2 className="sd-section-title">Quick Actions</h2>
        <div className="sd-quick-grid">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button key={action.id} className="sd-quick-btn" onClick={() => navigate(action.route)}>
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

      <div className="sd-middle-row">
        <div className="sd-card">
          <div className="sd-card-header">
            <div>
              <h2 className="sd-section-title">Recent Announcements</h2>
              <p className="sd-section-sub">Stay updated with latest hostel news</p>
            </div>
            <button className="sd-link-btn" onClick={() => navigate('/student/announcements')}>
              View All <ExternalLink size={13} />
            </button>
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

      <div className="sd-card">
        <div className="sd-card-header">
          <div>
            <h2 className="sd-section-title">Active Complaints</h2>
            <p className="sd-section-sub">Tracking your ongoing service requests</p>
          </div>
          <button className="sd-btn-primary sd-btn-sm" onClick={() => navigate('/student/complaints/new')}>
            <Plus size={14} /> New Request
          </button>
        </div>

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
              {complaints.length > 0 ? complaints.map((c) => (
                <tr key={c.id}>
                  <td className="sd-complaint-id">{c.id}</td>
                  <td className="sd-complaint-title">{c.title}</td>
                  <td className="sd-complaint-cat">{c.category}</td>
                  <td><StatusBadge status={c.status} /></td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="sd-complaint-cat" style={{ textAlign: 'center', padding: '16px' }}>
                    No complaints found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="sd-complaint-cards">
          {complaints.length > 0 ? complaints.map((c) => (
            <div key={c.id} className="sd-complaint-card">
              <div className="sd-complaint-card-top">
                <span className="sd-complaint-id">{c.id}</span>
                <StatusBadge status={c.status} />
              </div>
              <p className="sd-complaint-title">{c.title}</p>
              <span className="sd-complaint-cat">{c.category}</span>
            </div>
          )) : (
            <div className="sd-complaint-card">
              <p className="sd-complaint-title">No active complaints</p>
              <span className="sd-complaint-cat">Raise a new request to get started.</span>
            </div>
          )}
        </div>
      </div>

      <div className="sd-bottom-row">
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
                {filteredActivities.length > 0 ? filteredActivities.map((a) => {
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
                }) : (
                  <tr>
                    <td colSpan={4} className="sd-complaint-cat" style={{ textAlign: 'center', padding: '16px' }}>
                      No recent activity available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="sd-activity-cards">
            {filteredActivities.length > 0 ? filteredActivities.map((a) => {
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
            }) : (
              <div className="sd-activity-card">
                <p className="sd-act-desc">No recent activity available.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
