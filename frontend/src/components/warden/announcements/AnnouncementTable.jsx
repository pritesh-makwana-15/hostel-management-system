// src/components/warden/announcements/AnnouncementTable.jsx
import React from 'react';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const statusClass = (s) => {
  if (s === 'Active') return 'wa-status-active';
  if (s === 'Scheduled') return 'wa-status-scheduled';
  return 'wa-status-expired';
};

const AnnouncementTable = ({ data, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div className="wa-table-wrap">
      <table className="wa-table">
        <thead>
          <tr>
            <th>Announcement Details</th>
            <th>Target Audience</th>
            <th>Created Date</th>
            <th>Expiry Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={6} className="wa-empty">No announcements found.</td>
            </tr>
          ) : (
            data.map((a) => (
              <tr key={a.id}>
                <td>
                  <div
                    className="wa-table-title"
                    onClick={() => navigate(`/warden/announcements/view/${a.id}`)}
                  >
                    {a.title}
                  </div>
                  <div className="wa-table-id">{a.id}</div>
                </td>
                <td>{a.targetAudience}</td>
                <td>{a.createdDate}</td>
                <td>{a.expiryDate}</td>
                <td>
                  <span className={`wa-status-badge ${statusClass(a.status)}`}>
                    {a.status}
                  </span>
                </td>
                <td>
                  <div className="wa-actions">
                    <button
                      className="wa-action-btn"
                      title="View"
                      onClick={() => navigate(`/warden/announcements/view/${a.id}`)}
                    >
                      <Eye size={15} />
                    </button>
                    <button
                      className="wa-action-btn"
                      title="Edit"
                      onClick={() => navigate(`/warden/announcements/create`)}
                    >
                      <Edit size={15} />
                    </button>
                    <button
                      className="wa-action-btn wa-action-delete"
                      title="Delete"
                      onClick={() => onDelete(a)}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AnnouncementTable;