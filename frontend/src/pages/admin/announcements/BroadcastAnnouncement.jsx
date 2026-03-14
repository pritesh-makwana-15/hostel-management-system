// src/pages/admin/announcements/BroadcastAnnouncement.jsx
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Megaphone, Users, Clock, Send, X, Paperclip, Info, Calendar } from 'lucide-react';
import { getAnnouncementById } from '../../../data/announcementsData';
import '../../../styles/admin/announcements/broadcastAnnouncement.css';

const BroadcastAnnouncement = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const ann = getAnnouncementById(id) || {
    id: 'ANN-2024-020',
    title: 'Annual Hostel Maintenance & Safety Drill Schedule',
    audience: 'All Students',
    priority: 'Urgent',
    message: `Dear Students,\n\nPlease be informed that the annual maintenance check and safety drill is scheduled for this weekend. This includes electrical inspections, plumbing checks, and a fire safety walkthrough.\n\nSchedule:\nSaturday, Oct 12: Blocks A & B (09:00 AM - 05:00 PM)\nSunday, Oct 13: Blocks C & D (09:00 AM - 05:00 PM)\n\nDuring these times, there may be brief interruptions in power and water services. We appreciate your cooperation in maintaining a safe environment.\n\nRegards,\nHostel Administration`,
    attachments: [
      { name: 'Safety_Guidelines.pdf', size: '1.2 MB', type: 'PDF' },
      { name: 'Maintenance_Checklist.jpg', size: '850 KB', type: 'IMG' },
    ],
  };

  const [hostel, setHostel] = useState('All Hostels');
  const [block, setBlock] = useState('All Blocks (A, B, C, D)');
  const [targetUsers, setTargetUsers] = useState({ allStudents: true, wardens: false, floorManagers: false });
  const [delivery, setDelivery] = useState('immediate');
  const [scheduleDate, setScheduleDate] = useState('');

  const estimatedReach = targetUsers.allStudents ? 1240 : targetUsers.wardens ? 45 : 12;

  const getPriorityClass = (p) => {
    if (p === 'Urgent') return 'ba-priority-urgent';
    if (p === 'Important') return 'ba-priority-important';
    return 'ba-priority-normal';
  };

  const toggleTarget = (key) => {
    setTargetUsers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="ba-page">
      {/* Header */}
      <div className="ba-header">
        <div className="ba-breadcrumb">
          <span>Dashboard</span><span className="ba-sep">›</span>
          <span>Announcements</span><span className="ba-sep">›</span>
          <span className="ba-breadcrumb-active">Broadcast</span>
        </div>
        <h1 className="ba-title">Broadcast Announcement</h1>
        <p className="ba-subtitle">Finalize recipients and delivery options for your announcement.</p>
      </div>

      <div className="ba-layout">
        {/* Left - Preview */}
        <div className="ba-left">
          <div className="ba-preview-card">
            <div className="ba-preview-header">
              <div className="ba-preview-header-left">
                <Megaphone size={16} />
                <span>Announcement Preview</span>
              </div>
              <span className={`ba-priority-badge ${getPriorityClass(ann.priority)}`}>{ann.priority}</span>
            </div>
            <div className="ba-preview-body">
              <div className="ba-preview-audience">TARGET AUDIENCE: {ann.audience?.toUpperCase()}</div>
              <h2 className="ba-preview-title">{ann.title}</h2>
              <div className="ba-preview-message">
                {ann.message.split('\n').map((line, i) => (
                  <p key={i}>{line || <br />}</p>
                ))}
              </div>
              {ann.attachments?.length > 0 && (
                <div className="ba-attachments">
                  <div className="ba-attachments-label"><Paperclip size={14} /> Attachments ({ann.attachments.length})</div>
                  <div className="ba-attachments-list">
                    {ann.attachments.map((a, i) => (
                      <div key={i} className={`ba-attachment-item ba-att-${a.type?.toLowerCase()}`}>
                        <span className="ba-att-type">{a.type}</span>
                        <div>
                          <div className="ba-att-name">{a.name}</div>
                          <div className="ba-att-size">{a.size}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Pre-broadcast check */}
          <div className="ba-precheck">
            <Info size={16} className="ba-precheck-icon" />
            <div>
              <strong>Pre-broadcast Check</strong>
              <p>Once broadcast, this message will be delivered to the mobile app and student portal. Urgent announcements also trigger SMS alerts.</p>
            </div>
          </div>
        </div>

        {/* Right - Controls */}
        <div className="ba-right">
          {/* Target Recipients */}
          <div className="ba-control-card">
            <div className="ba-control-title"><Users size={16} /> Target Recipients</div>

            <div className="ba-field-group">
              <label className="ba-field-label">SELECT HOSTEL</label>
              <div className="ba-select-with-icon">
                <span className="ba-select-icon">🏠</span>
                <select className="ba-select" value={hostel} onChange={(e) => setHostel(e.target.value)}>
                  <option>All Hostels</option>
                  <option>North Campus</option>
                  <option>South Campus</option>
                </select>
              </div>
            </div>

            <div className="ba-field-group">
              <label className="ba-field-label">SELECT BLOCK</label>
              <div className="ba-select-with-icon">
                <span className="ba-select-icon">🏠</span>
                <select className="ba-select" value={block} onChange={(e) => setBlock(e.target.value)}>
                  <option>All Blocks (A, B, C, D)</option>
                  <option>Block A</option>
                  <option>Block B</option>
                  <option>Block C</option>
                  <option>Block D</option>
                </select>
              </div>
            </div>

            <div className="ba-field-group">
              <label className="ba-field-label">TARGET USERS</label>
              <div className="ba-checkboxes">
                <label className="ba-checkbox-label">
                  <input type="checkbox" checked={targetUsers.allStudents} onChange={() => toggleTarget('allStudents')} />
                  <span>All Students in Selected Blocks</span>
                </label>
                <label className="ba-checkbox-label">
                  <input type="checkbox" checked={targetUsers.wardens} onChange={() => toggleTarget('wardens')} />
                  <span>Include Residential Wardens</span>
                </label>
                <label className="ba-checkbox-label">
                  <input type="checkbox" checked={targetUsers.floorManagers} onChange={() => toggleTarget('floorManagers')} />
                  <span>Specific Floor Managers</span>
                </label>
              </div>
            </div>

            <div className="ba-reach">
              <span className="ba-reach-dot" />
              Estimated Reach
              <strong className="ba-reach-count">{estimatedReach.toLocaleString()} Recipients</strong>
            </div>
          </div>

          {/* Delivery Schedule */}
          <div className="ba-control-card">
            <div className="ba-control-title"><Clock size={16} /> Delivery Schedule</div>
            <label className={`ba-delivery-option ${delivery === 'immediate' ? 'ba-delivery-active' : ''}`}>
              <input type="radio" name="delivery" value="immediate" checked={delivery === 'immediate'} onChange={() => setDelivery('immediate')} />
              <span>Send Immediately</span>
              <Send size={16} className="ba-delivery-icon" />
            </label>
            <label className={`ba-delivery-option ${delivery === 'schedule' ? 'ba-delivery-active' : ''}`}>
              <input type="radio" name="delivery" value="schedule" checked={delivery === 'schedule'} onChange={() => setDelivery('schedule')} />
              <span>Schedule for Later</span>
              <Calendar size={16} className="ba-delivery-icon" />
            </label>
            {delivery === 'schedule' && (
              <input
                className="ba-date-input"
                type="datetime-local"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
              />
            )}
          </div>

          {/* Actions */}
          <button className="ba-btn-send">Send Broadcast</button>
          <button className="ba-btn-cancel" onClick={() => navigate('/admin/announcements')}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default BroadcastAnnouncement;