// src/components/warden/announcements/AnnouncementFilter.jsx
import React from 'react';
import { Search, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { statusOptions, targetOptions } from '../../../data/wardenAnnouncementsData';

const AnnouncementFilter = ({ search, setSearch, statusFilter, setStatusFilter, targetFilter, setTargetFilter, onReset }) => {
  return (
    <div className="wa-filters-card">
      <div className="wa-filters-row">
        <div className="wa-search-wrap">
          <Search size={15} className="wa-search-icon" />
          <input
            className="wa-search-input"
            type="text"
            placeholder="Search by title or message..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="wa-filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          {statusOptions.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
        <select
          className="wa-filter-select"
          value={targetFilter}
          onChange={(e) => setTargetFilter(e.target.value)}
        >
          <option value="">All Students</option>
          {targetOptions.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
        <button className="wa-btn-primary wa-apply-btn">Apply Filters</button>
        <button className="wa-btn-secondary" onClick={onReset}>
          <RotateCcw size={14} /> Reset
        </button>
      </div>
    </div>
  );
};

export default AnnouncementFilter;