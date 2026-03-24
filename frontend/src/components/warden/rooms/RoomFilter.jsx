import React from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';

const RoomFilter = ({ filters, onChange, onReset }) => {
  return (
    <div className="room-filter-card">
      <div className="room-filter-header">
        <div className="room-filter-title">
          <Filter size={16} />
          <span>Filter Rooms</span>
        </div>
        <button className="room-filter-reset" onClick={onReset}>
          <RotateCcw size={14} /> Reset All
        </button>
      </div>

      <div className="room-filter-row">
        <div className="room-filter-search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search Room or Block..."
            value={filters.search}
            onChange={(e) => onChange('search', e.target.value)}
          />
        </div>

        <select
          className="room-filter-select"
          value={filters.block}
          onChange={(e) => onChange('block', e.target.value)}
        >
          <option value="">All Blocks</option>
          <option value="Block A">Block A</option>
          <option value="Block B">Block B</option>
          <option value="Block C">Block C</option>
          <option value="Block D">Block D</option>
        </select>

        <select
          className="room-filter-select"
          value={filters.type}
          onChange={(e) => onChange('type', e.target.value)}
        >
          <option value="">All Types</option>
          <option value="AC">AC</option>
          <option value="Non-AC">Non-AC</option>
        </select>

        <select
          className="room-filter-select"
          value={filters.status}
          onChange={(e) => onChange('status', e.target.value)}
        >
          <option value="">All Status</option>
          <option value="Available">Available</option>
          <option value="Partially Occupied">Partially Occupied</option>
          <option value="Fully Occupied">Fully Occupied</option>
        </select>
      </div>
    </div>
  );
};

export default RoomFilter;