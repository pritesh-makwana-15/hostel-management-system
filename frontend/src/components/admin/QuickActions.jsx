import React from 'react';
import { dashboardData } from '../../data/dashboardData';
import '../../styles/admin/QuickActions.css';

const QuickActions = () => {
  return (
    <div className="quick-actions-card">
      <h2 className="section-title">Quick Actions</h2>
      <div className="quick-actions-grid">
        {dashboardData.quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <button key={action.id} className="quick-action-btn">
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