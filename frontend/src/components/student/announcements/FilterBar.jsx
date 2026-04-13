// src/components/student/announcements/FilterBar.jsx
import React from 'react';
import { Search } from 'lucide-react';

const FilterBar = ({ search, setSearch }) => {
  return (
    <div className="sfb-wrap">
      <div className="sfb-search">
        <Search size={16} className="sfb-icon" />
        <input
          type="text"
          className="sfb-input"
          placeholder="Search notices, tags, categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
    </div>
  );
};

export default FilterBar;