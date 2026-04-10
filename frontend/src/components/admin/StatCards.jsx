import React, { useState, useEffect } from 'react';
import { Users, Building2, Bed, BedDouble, Briefcase, IndianRupee } from 'lucide-react';
import { adminDashboardApi } from '../../services/adminDashboardApi';
import { dashboardData } from '../../data/dashboardData';
import '../../styles/admin/StatCards.css';

const StatCards = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const res = await adminDashboardApi.getStats();
      console.log('StatCards: Dashboard stats response:', res);
      
      if (res.data && res.data.status === 'success') {
        const dbStats = res.data.data || {};
        
        // Map database stats to the expected format
        const mappedStats = [
          {
            id: 1,
            title: 'Total Students',
            value: dbStats.totalStudents || '0',
            description: 'From database',
            icon: Users,
            iconBg: '#E3F2FD',
            iconColor: '#1976D2'
          },
          {
            id: 2,
            title: 'Total Rooms',
            value: dbStats.totalRooms || '0',
            description: dbStats.occupiedRooms ? `${dbStats.totalRooms - dbStats.occupiedRooms} Available` : 'All Available',
            icon: Building2,
            iconBg: '#E0F2F1',
            iconColor: '#00897B'
          },
          {
            id: 3,
            title: 'Occupied Rooms',
            value: dbStats.occupiedRooms || '0',
            description: dbStats.occupancyRate ? `${dbStats.occupancyRate}% Occupancy` : '0% Occupancy',
            icon: Bed,
            iconBg: '#FFF3E0',
            iconColor: '#FB8C00'
          },
          {
            id: 4,
            title: 'Available Rooms',
            value: dbStats.availableRooms || '0',
            description: 'Ready for allocation',
            icon: BedDouble,
            iconBg: '#F3E5F5',
            iconColor: '#8E24AA'
          },
          {
            id: 5,
            title: 'Total Wardens',
            value: dbStats.totalWardens || '0',
            description: 'All Active',
            icon: Briefcase,
            iconBg: '#E8F5E9',
            iconColor: '#43A047'
          },
          {
            id: 6,
            title: 'Monthly Fee Collection',
            value: '₹0', // Would need separate API for fee data
            description: 'From database',
            icon: IndianRupee,
            iconBg: '#FFF9C4',
            iconColor: '#F57F17'
          }
        ];
        
        setStats(mappedStats);
      } else {
        // Use dummy data as fallback if API fails
        console.log('StatCards: Using dummy data as fallback');
        setStats(dashboardData.stats);
      }
    } catch (error) {
      console.error('StatCards: Error fetching dashboard stats:', error);
      console.log('StatCards: Using dummy data as fallback');
      // Use dummy data as fallback
      setStats(dashboardData.stats);
      setError('Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="stat-cards">
        <div className="loading">Loading dashboard stats...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="stat-cards">
        <div className="error" style={{ color: '#EF4444', textAlign: 'center', padding: '20px' }}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="stat-cards">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.id} className="stat-card">
            <div className="stat-card-icon" style={{ backgroundColor: stat.iconBg }}>
              <Icon size={24} style={{ color: stat.iconColor }} />
            </div>
            <div className="stat-card-content">
              <h3 className="stat-card-value">{stat.value}</h3>
              <p className="stat-card-title">{stat.title}</p>
              <p className="stat-card-description">{stat.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatCards;