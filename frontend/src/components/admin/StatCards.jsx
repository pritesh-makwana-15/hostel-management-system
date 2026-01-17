import React from 'react';
import { dashboardData } from '../../data/dashboardData';
import '../../styles/admin/StatCards.css';

const StatCards = () => {
  return (
    <div className="stat-cards">
      {dashboardData.stats.map((stat) => {
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