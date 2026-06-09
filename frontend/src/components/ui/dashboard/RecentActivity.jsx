/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Clock } from 'lucide-react';

const statusStyle = (status) => {
  if (status === 'Completed') {
    return { backgroundColor: '#E8F5E9', color: '#43A047' };
  }
  return { backgroundColor: '#FFF3E0', color: '#FB8C00' };
};

const RecentActivity = ({ activities }) => {
  const [filter, setFilter] = useState('Last 24 Hours');

  const now = Date.now();
  const last24Hours = 24 * 60 * 60 * 1000;

  const filteredActivities = (activities || []).filter((activity) => {
    if (filter !== 'Last 24 Hours') return true;

    if (!activity.timestamp) return false;

    const ts = new Date(activity.timestamp).getTime();
    if (Number.isNaN(ts)) return false;

    return now - ts <= last24Hours;
  });

  return (
    <div className="warden-section-card">
      <div className="warden-activity-header">
        <div className="warden-activity-title-row">
          <Clock size={18} />
          <h2 className="warden-section-title">Recent Activity</h2>
        </div>
        <div className="warden-activity-filters">
          {['Last 24 Hours', 'All Time'].map((f) => (
            <button
              key={f}
              className={`warden-filter-btn ${filter === f ? 'warden-filter-active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop Table */}
      <div className="warden-activity-table-wrap">
        <table className="warden-activity-table">
          <thead>
            <tr>
              <th>TYPE</th>
              <th>DESCRIPTION</th>
              <th>DATE &amp; TIME</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {filteredActivities.map((a) => (
              <tr key={a.id}>
                <td className="warden-act-type">{a.type}</td>
                <td className="warden-act-desc">{a.description}</td>
                <td className="warden-act-time">
                  <Clock size={13} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                  {a.dateTime}
                </td>
                <td>
                  <span className="warden-act-badge" style={statusStyle(a.status)}>
                    {a.status}
                  </span>
                </td>
              </tr>
            ))}
            {filteredActivities.length === 0 && (
              <tr>
                <td colSpan={4} className="warden-act-empty">No activities found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="warden-activity-mobile">
        {filteredActivities.map((a) => (
          <div key={a.id} className="warden-act-card">
            <div className="warden-act-card-header">
              <span className="warden-act-type">{a.type}</span>
              <span className="warden-act-badge" style={statusStyle(a.status)}>
                {a.status}
              </span>
            </div>
            <p className="warden-act-desc">{a.description}</p>
            <span className="warden-act-time">{a.dateTime}</span>
          </div>
        ))}
        {filteredActivities.length === 0 && (
          <div className="warden-act-card">
            <p className="warden-act-desc">No activities found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;