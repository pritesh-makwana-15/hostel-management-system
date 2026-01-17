import React from 'react';
import '../../styles/common/ComingSoon.css';

const ComingSoon = ({ title }) => {
  return (
    <div className="coming-soon">
      <div className="coming-soon-content">
        <h1 className="coming-soon-title">{title}</h1>
        <div className="coming-soon-icon">🚧</div>
        <h2 className="coming-soon-subtitle">Coming Soon</h2>
        <p className="coming-soon-text">
          This page is under development and will be available soon.
        </p>
      </div>
    </div>
  );
};

export default ComingSoon;