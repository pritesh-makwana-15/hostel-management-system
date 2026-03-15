import React from 'react';

const QuickActions = ({ actions }) => {
  return (
    <div className="warden-section-card">
      <h2 className="warden-section-title">Quick Actions</h2>
      <div className="warden-quick-grid">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button key={action.id} className="warden-quick-btn">
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