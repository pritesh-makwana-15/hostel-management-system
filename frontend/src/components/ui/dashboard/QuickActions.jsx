import React from 'react';
import { useNavigate } from 'react-router-dom';

const QuickActions = ({ actions }) => {
  const navigate = useNavigate();

  const handleActionClick = (actionId) => {
    switch (actionId) {
      case 1:
        navigate('/warden/announcements/new');
        break;
      case 2:
        navigate('/warden/complaints');
        break;
      case 3:
        navigate('/admin/students/add');
        break;
      case 4:
        navigate('/warden/notifications');
        break;
      default:
        console.log('Unknown action:', actionId);
    }
  };

  return (
    <div className="warden-section-card">
      <h2 className="warden-section-title">Quick Actions</h2>
      <div className="warden-quick-grid">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button 
              key={action.id} 
              className="warden-quick-btn"
              onClick={() => handleActionClick(action.id)}
            >
              <div className="warden-quick-icon">
                <Icon size={28} />
              </div>
              <span className="warden-quick-label">{action.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;