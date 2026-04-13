import React, { useState, useEffect } from 'react';
import { Bell, Plus, AlertCircle } from 'lucide-react';
import AnnouncementTable from '../../components/warden/announcements/AnnouncementTable';
import AnnouncementFilter from '../../components/warden/announcements/AnnouncementFilter';
import { wardenApi } from '../../services/wardenApi';
import '../../../styles/warden/announcements/announcements.css';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [targetFilter, setTargetFilter] = useState('');

  // Transform backend announcement data to frontend format
  const transformAnnouncement = (announcement) => {
    const now = new Date();
    const expiryDate = announcement.expiryDate ? new Date(announcement.expiryDate) : null;
    const publishDate = announcement.publishDate ? new Date(announcement.publishDate) : null;

    // Determine status based on dates and backend status
    let status = 'Active';
    if (announcement.status === 'EXPIRED' || (expiryDate && expiryDate < now)) {
      status = 'Expired';
    } else if (announcement.status === 'DRAFT') {
      status = 'Draft';
    } else if (publishDate && publishDate > now) {
      status = 'Scheduled';
    }

    // Map audience enum to target audience string
    const audienceMap = {
      'STUDENTS': 'Students',
      'WARDENS': 'Wardens',
      'BOTH': 'All Students'
    };

    return {
      id: announcement.id,
      title: announcement.title,
      description: announcement.message,
      targetAudience: audienceMap[announcement.audience] || announcement.audience,
      createdDate: announcement.createdAt ? new Date(announcement.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }) : 'N/A',
      expiryDate: announcement.expiryDate ? new Date(announcement.expiryDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }) : 'N/A',
      status: status,
      priority: announcement.priority || 'Normal',
      createdBy: announcement.createdBy || 'System'
    };
  };

  // Fetch announcements from API
  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching announcements from API...');
      const response = await wardenApi.getActiveAnnouncements();
      console.log('API Response:', response);

      if (response.data?.success) {
        console.log('Raw data from API:', response.data.data);
        const transformedData = response.data.data.map(transformAnnouncement);
        console.log('Transformed data:', transformedData);
        setAnnouncements(transformedData);
        setFilteredAnnouncements(transformedData);
      } else {
        console.error('API returned success=false:', response.data);
        setError('Failed to fetch announcements: ' + (response.data?.message || 'Unknown error'));
      }
    } catch (err) {
      console.error('Error fetching announcements:', err);
      console.error('Error response:', err.response);
      setError(err.response?.data?.message || err.message || 'Failed to fetch announcements');
    } finally {
      setLoading(false);
    }
  };

  // Filter announcements based on search and filters
  const applyFilters = () => {
    let filtered = [...announcements];

    // Search filter
    if (search) {
      filtered = filtered.filter(announcement =>
        announcement.title.toLowerCase().includes(search.toLowerCase()) ||
        announcement.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'All Status') {
      filtered = filtered.filter(announcement => announcement.status === statusFilter);
    }

    // Target audience filter
    if (targetFilter) {
      filtered = filtered.filter(announcement => announcement.targetAudience === targetFilter);
    }

    setFilteredAnnouncements(filtered);
  };

  // Reset filters
  const resetFilters = () => {
    setSearch('');
    setStatusFilter('All Status');
    setTargetFilter('');
    setFilteredAnnouncements(announcements);
  };

  // Handle delete (wardens might not have delete permission, but keeping for UI consistency)
  const handleDelete = (announcement) => {
    // Wardens typically don't delete announcements, but show alert for now
    alert(`Delete functionality not available for wardens. Announcement: ${announcement.title}`);
  };

  // Apply filters when filter states change
  useEffect(() => {
    applyFilters();
  }, [search, statusFilter, targetFilter, announcements]);

  // Fetch announcements on component mount
  useEffect(() => {
    fetchAnnouncements();
  }, []);

  if (loading) {
    return (
      <div className="wa-page">
        <div className="wa-header">
          <div>
            <h1 className="wa-page-title">Announcements</h1>
          </div>
        </div>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '18px', marginBottom: '10px' }}>Loading announcements...</div>
          <div style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #1F3C88', borderRadius: '50%', animation: 'wa-spin 1s linear infinite', margin: '0 auto' }}></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="wa-page">
        <div className="wa-header">
          <div>
            <h1 className="wa-page-title">Announcements</h1>
          </div>
        </div>
        <div style={{ textAlign: 'center', padding: '40px', color: '#dc2626' }}>
          <AlertCircle size={48} style={{ margin: '0 auto 20px', display: 'block' }} />
          <h3 style={{ margin: '0 0 10px', color: '#dc2626' }}>Error Loading Announcements</h3>
          <p style={{ margin: '0 0 20px', color: '#6B7280' }}>{error}</p>
          <button className="wa-btn-primary" onClick={fetchAnnouncements}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="wa-page">
      <div className="wa-header">
        <div>
          <h1 className="wa-page-title">Announcements</h1>
        </div>
        <div className="wa-header-actions">
          <button className="wa-btn-secondary">
            <Plus size={16} />
            Create Announcement
          </button>
        </div>
      </div>

      <div className="wa-content">
        <AnnouncementFilter
          search={search}
          setSearch={setSearch}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          targetFilter={targetFilter}
          setTargetFilter={setTargetFilter}
          onReset={resetFilters}
        />

        <div className="wa-stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '24px' }}>
          <div className="wa-stat-card">
            <div className="wa-stat-icon" style={{ background: '#e3f2fd', color: '#1976d2' }}>
              <Bell size={22} />
            </div>
            <div className="wa-stat-body">
              <div className="wa-stat-label">Total Announcements</div>
              <div className="wa-stat-value">{announcements.length}</div>
            </div>
          </div>
          <div className="wa-stat-card">
            <div className="wa-stat-icon" style={{ background: '#e8f5e8', color: '#388e3c' }}>
              <Bell size={22} />
            </div>
            <div className="wa-stat-body">
              <div className="wa-stat-label">Active</div>
              <div className="wa-stat-value">
                {announcements.filter(a => a.status === 'Active').length}
              </div>
            </div>
          </div>
          <div className="wa-stat-card">
            <div className="wa-stat-icon" style={{ background: '#fff3e0', color: '#f57c00' }}>
              <Bell size={22} />
            </div>
            <div className="wa-stat-body">
              <div className="wa-stat-label">Scheduled</div>
              <div className="wa-stat-value">
                {announcements.filter(a => a.status === 'Scheduled').length}
              </div>
            </div>
          </div>
        </div>

        <div className="wa-table-card">
          <AnnouncementTable
            data={filteredAnnouncements}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default Announcements;