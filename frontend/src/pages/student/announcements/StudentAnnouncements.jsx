// src/pages/student/announcements/StudentAnnouncements.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell, Bookmark, Share2, ChevronRight, Phone, Shield,
  CreditCard, Building2, MessageSquare, CalendarCheck,
  Clock, AlertCircle, CheckCircle2
} from 'lucide-react';
import AnnouncementCard from '../../../components/student/announcements/AnnouncementCard';
import NotificationPanel from '../../../components/student/announcements/NotificationPanel';
import FilterBar from '../../../components/student/announcements/FilterBar';
import { studentApi } from '../../../services/studentApi';
import '../../../styles/student/announcements/announcements.css';

// Fallback Data (used when API fails) ────────────────────────────────────────────────

const announcementsData = [
  {
    id: 1,
    category: 'Maintenance',
    priority: 'High Priority',
    isNew: true,
    isCritical: false,
    title: 'Annual Hostel Maintenance & Safety Drill Schedule',
    description:
      'Please be informed that the annual maintenance check and safety drill is scheduled for this weekend. This includes electrical inspections, plumbing checks, and fire safety walkthroughs. All residents are requested to cooperate with the inspection teams.',
    postedBy: 'Chief Warden',
    department: 'ADMINISTRATION',
    date: 'OCT 12, 2024',
    time: '09:00 AM',
    avatarInitials: 'CW',
    accentColor: '#F59E0B',
  },
  {
    id: 2,
    category: 'Important',
    priority: 'High Priority',
    isNew: false,
    isCritical: true,
    criticalCount: 2,
    title: 'Urgent: Water Supply Interruption in Block A & B',
    description:
      'Due to a pipe burst near the main tank, water supply will be suspended for Block A and B between 10 AM and 2 PM today. We advise residents to store sufficient water for immediate needs.',
    postedBy: 'Estate Manager',
    department: 'OPERATIONS',
    date: 'OCT 11, 2024',
    time: '07:30 AM',
    avatarInitials: 'EM',
    accentColor: '#EF4444',
    isScheduled: true,
    scheduledNote: 'Scheduled today at 4:30 PM. Please remain at your block.',
  },
  {
    id: 3,
    category: 'Event',
    priority: null,
    isNew: true,
    isCritical: false,
    title: 'Hostel Fest 2024: Volunteer Calls and Registration',
    description:
      'The annual cultural fest is just around the corner! We are looking for enthusiastic volunteers to help with event coordination, stage management, and hospitality. Register at the warden\'s office.',
    postedBy: 'Cultural Sec.',
    department: 'STUDENT COUNCIL',
    date: 'OCT 10, 2024',
    time: '02:00 PM',
    avatarInitials: 'CS',
    accentColor: '#22c55e',
    hasRead: false,
  },
  {
    id: 4,
    category: 'General',
    priority: null,
    isNew: false,
    isCritical: false,
    title: 'New Policy: Night Out Pass Digitalization',
    description:
      'In our efforts to streamline processes, all night-out pass requests must now be submitted through the HMS mobile application. Manual forms will no longer be accepted starting next Monday.',
    postedBy: 'Senior Warden',
    department: 'SECURITY',
    date: 'OCT 09, 2024',
    time: '11:45 AM',
    avatarInitials: 'SW',
    accentColor: '#1F3C88',
    hasRead: true,
  },
];

const notificationsData = [
  {
    id: 1,
    message: 'Your Wi-Fi complaint #CMP-8942 has been resolved.',
    time: '2 mins ago',
    isUnread: true,
  },
  {
    id: 2,
    message: 'Mess Refund of $45.00 has been credited to your wallet.',
    time: '1 hour ago',
    isUnread: true,
  },
  {
    id: 3,
    message: 'Reminder: Semester fee payment deadline is tomorrow.',
    time: '5 hours ago',
    isUnread: false,
  },
  {
    id: 4,
    message: "A new announcement regarding 'Maintenance' was posted.",
    time: '6 hours ago',
    isUnread: false,
  },
];

const recentActivity = [
  {
    id: 1,
    type: 'Fee Payment',
    icon: CreditCard,
    desc: 'Utility fee for April 2024 ($45.00) was successfully paid via Student Portal.',
    time: '2 hours ago',
  },
  {
    id: 2,
    type: 'Room Check',
    icon: Building2,
    desc: 'Routine inventory check completed by Floor Supervisor.',
    time: 'Yesterday',
  },
];

// ── Main Component ────────────────────────────────────────────

const StudentAnnouncements = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(notificationsData);
  const [bookmarked, setBookmarked] = useState({});
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const notifRef = useRef(null);

  const unreadCount = notifications.filter((n) => n.isUnread).length;

  // Fetch announcements from API
  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await studentApi.getActiveAnnouncements();
      console.log('StudentAnnouncements: API response:', response);
      
      if (response.data && response.data.status === 'success') {
        const announcementsData = response.data.data;
        
        // Transform API data to match component expected format
        const transformedAnnouncements = announcementsData.map((announcement, index) => {
          const priority = announcement.priority || 'Normal';
          const isHighPriority = priority === 'Urgent' || priority === 'Important';
          
          return {
            id: announcement.id || index + 1,
            category: getCategoryFromPriority(priority),
            priority: isHighPriority ? 'High Priority' : null,
            isNew: index < 2, // Mark first 2 as new
            isCritical: priority === 'Urgent',
            title: announcement.title || 'Announcement',
            description: announcement.message || 'No description available',
            postedBy: announcement.createdBy || 'Administration',
            department: 'ADMINISTRATION',
            date: formatDate(announcement.publishDate),
            time: formatTime(announcement.publishDate),
            avatarInitials: getInitials(announcement.createdBy),
            accentColor: getAccentColor(priority),
          };
        });
        
        setAnnouncements(transformedAnnouncements);
      } else {
        console.log('StudentAnnouncements: Using fallback data - API response not successful');
        setAnnouncements(announcementsData);
        setError('Failed to load announcements, showing default content');
      }
    } catch (error) {
      console.error('StudentAnnouncements: Error fetching announcements:', error);
      console.log('StudentAnnouncements: Using fallback data due to error');
      setAnnouncements(announcementsData);
      setError('Error loading announcements, showing default content');
    } finally {
      setLoading(false);
    }
  };

  // Helper functions for data transformation
  const getCategoryFromPriority = (priority) => {
    switch (priority) {
      case 'Urgent': return 'Important';
      case 'Important': return 'Important';
      case 'Normal': return 'General';
      default: return 'General';
    }
  };

  const getInitials = (name) => {
    if (!name) return 'AD';
    const words = name.split(' ');
    return words.map(word => word[0]).join('').substring(0, 2).toUpperCase();
  };

  const getAccentColor = (priority) => {
    switch (priority) {
      case 'Urgent': return '#EF4444';
      case 'Important': return '#F59E0B';
      case 'Normal': return '#22c55e';
      default: return '#1F3C88';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'OCT 12, 2024';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }).toUpperCase();
  };

  const formatTime = (dateString) => {
    if (!dateString) return '09:00 AM';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  // Close notification panel on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isUnread: false })));
  };

  const handleToggleBookmark = (id) => {
    setBookmarked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filtered = announcements.filter((a) => {
    const matchSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.description.toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter === 'All' || a.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  // Loading state
  if (loading) {
    return (
      <div className="sa-page">
        <div className="sa-loading">
          <div className="sa-loading-spinner"></div>
          <p>Loading announcements...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="sa-page">
      {/* Error Banner */}
      {error && (
        <div className="sa-error-banner">
          <span>{error}</span>
        </div>
      )}
      
      {/* ── Page Header ── */}
      <div className="sa-header">
        <div className="sa-header-left">
          <div className="sa-breadcrumb">
            <span className="sa-breadcrumb-link" onClick={() => navigate('/student/dashboard')}>
              Dashboard
            </span>
            <ChevronRight size={14} className="sa-breadcrumb-sep" />
            <span className="sa-breadcrumb-active">Announcements</span>
          </div>
          <h1 className="sa-page-title">Announcements</h1>
          <p className="sa-page-sub">Stay updated with the latest hostel notices and emergency alerts.</p>
        </div>

        {/* Notification Bell (triggers panel) */}
        <div className="sa-header-right" ref={notifRef}>
          <button
            className="sa-notif-btn"
            onClick={() => setShowNotifications((p) => !p)}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="sa-notif-badge">{unreadCount}</span>
            )}
          </button>

          {showNotifications && (
            <NotificationPanel
              notifications={notifications}
              onMarkAllRead={handleMarkAllRead}
              onClose={() => setShowNotifications(false)}
            />
          )}
        </div>
      </div>

      {/* ── Tab Bar (All / Important / Bookmarks) ── */}
      <div className="sa-tabs">
        {['All', 'Important', 'Event', 'Maintenance', 'General'].map((tab) => (
          <button
            key={tab}
            className={`sa-tab ${categoryFilter === tab ? 'sa-tab-active' : ''}`}
            onClick={() => setCategoryFilter(tab)}
          >
            {tab}
          </button>
        ))}
        <button className="sa-tab sa-tab-bookmarks">
          <Bookmark size={14} />
          Bookmarks
        </button>
      </div>

      {/* ── Main Layout ── */}
      <div className="sa-layout">
        {/* Left: Announcement List */}
        <div className="sa-main">
          <FilterBar search={search} setSearch={setSearch} />

          <div className="sa-list">
            {filtered.length === 0 ? (
              <div className="sa-empty">No announcements match your search.</div>
            ) : (
              filtered.map((ann) => (
                <AnnouncementCard
                  key={ann.id}
                  announcement={ann}
                  bookmarked={!!bookmarked[ann.id]}
                  onBookmark={() => handleToggleBookmark(ann.id)}
                  onReadMore={() => navigate(`/student/announcements/${ann.id}`)}
                />
              ))
            )}
          </div>

          {/* Load More */}
          <div className="sa-load-more-wrap">
            <button className="sa-load-more-btn">Load Older Announcements</button>
          </div>
        </div>

        {/* Right Sidebar */}
        <aside className="sa-sidebar">
          {/* Quick Support */}
          <div className="sa-support-card">
            <div className="sa-support-header">
              <Bell size={16} />
              <span>Quick Support</span>
            </div>
            <p className="sa-support-sub">
              Need urgent help with your room or security? Contact our 24/7 warden helpline.
            </p>
            <div className="sa-support-contacts">
              <div className="sa-contact-row">
                <div className="sa-contact-label">
                  <Phone size={13} /> Warden Desk
                </div>
                <span className="sa-contact-val">+91 98765-43210</span>
              </div>
              <div className="sa-contact-row">
                <div className="sa-contact-label">
                  <Shield size={13} /> Security Desk
                </div>
                <span className="sa-contact-val">EXT. 404</span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="sa-activity-card">
            <h3 className="sa-activity-title">Recent Activity</h3>
            <div className="sa-activity-list">
              {recentActivity.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.id} className="sa-activity-item">
                    <div className="sa-activity-icon-wrap">
                      <Icon size={14} />
                    </div>
                    <div className="sa-activity-body">
                      <span className="sa-activity-type">{item.type}</span>
                      <p className="sa-activity-desc">{item.desc}</p>
                      <span className="sa-activity-time">
                        <Clock size={11} /> {item.time}
                      </span>
                    </div>
                    <ChevronRight size={14} className="sa-activity-arrow" />
                  </div>
                );
              })}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default StudentAnnouncements;