import React from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardData } from '../../data/dashboardData';
import '../../styles/admin/QuickActions.css';

const QuickActions = () => {
  const navigate = useNavigate();

  const handleQuickAction = (action) => {
    switch (action.id) {
      case 1: // Add Student
        navigate('/admin/students/add');
        break;
      case 2: // Add Room
        navigate('/admin/rooms/add');
        break;
      case 3: // Add Warden
        navigate('/admin/wardens/add');
        break;
      case 4: // Collect Fee
        navigate('/admin/fees/student');
        break;
      case 5: // New Announcement
        navigate('/admin/announcements/create');
        break;
      case 6: // View Complaints
        navigate('/admin/complaints');
        break;
      default:
        console.log('Unknown quick action:', action);
    }
  };

  return (
    <div className="quick-actions-card">
      <h2 className="section-title">Quick Actions</h2>
      <div className="quick-actions-grid">
        {dashboardData.quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <button 
              key={action.id} 
              className="quick-action-btn"
              onClick={() => handleQuickAction(action)}
              title={action.label}
            >
              <div className="quick-action-icon" style={{ backgroundColor: `${action.color}15` }}>
                <Icon size={24} style={{ color: action.color }} />
              </div>
              <span>{action.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;