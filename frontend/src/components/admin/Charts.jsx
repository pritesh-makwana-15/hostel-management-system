import React from 'react';
import { dashboardData } from '../../data/dashboardData';
import '../../styles/admin/Charts.css';

const Charts = () => {
  const maxValue = Math.max(...dashboardData.monthlyFeeData.map(d => d.value));

  return (
    <div className="charts-container">
      {/* Monthly Fee Collection */}
      <div className="chart-card">
        <div className="chart-header">
          <h2 className="section-title">Monthly Fee Collection</h2>
          <span className="chart-value">1700000</span>
        </div>
        <div className="bar-chart">
          {dashboardData.monthlyFeeData.map((data, index) => (
            <div key={index} className="bar-container">
              <div 
                className="bar"
                style={{ height: `${(data.value / maxValue) * 100}%` }}
              />
              <span className="bar-label">{data.month}</span>
            </div>
          ))}
        </div>
        <div className="chart-axis">
          <span>0</span>
          <span>425000</span>
          <span>850000</span>
          <span>1275000</span>
          <span>1700000</span>
        </div>
      </div>

      {/* Room Occupancy */}
      <div className="chart-card">
        <h2 className="section-title">Room Occupancy</h2>
        <div className="donut-chart">
          <svg viewBox="0 0 200 200" className="donut-svg">
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="#1F3C88"
              strokeWidth="30"
              strokeDasharray="452 452"
              strokeDashoffset="45"
            />
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="#FB8C00"
              strokeWidth="30"
              strokeDasharray="452 452"
              strokeDashoffset="-270"
            />
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="#2BBBAD"
              strokeWidth="30"
              strokeDasharray="452 452"
              strokeDashoffset="-360"
            />
          </svg>
        </div>
        <div className="donut-legend">
          <div className="legend-item">
            <span className="legend-dot" style={{ backgroundColor: '#1F3C88' }} />
            <span className="legend-label">Occupied</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ backgroundColor: '#FB8C00' }} />
            <span className="legend-label">Available</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ backgroundColor: '#2BBBAD' }} />
            <span className="legend-label">Maintenance</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Charts;