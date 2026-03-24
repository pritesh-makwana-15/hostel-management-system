import React from 'react';

const BedGrid = ({ beds, selectable = false, selectedBed, onSelect }) => {
  return (
    <div className="bed-grid">
      {beds.map((bed) => {
        const isOccupied = bed.status === 'Occupied';
        const isSelected = selectedBed === bed.id;

        if (selectable) {
          return (
            <div
              key={bed.id}
              className={`bed-select-card ${isOccupied ? 'bed-occupied-card' : 'bed-available-card'} ${isSelected ? 'bed-selected-card' : ''}`}
              onClick={() => !isOccupied && onSelect && onSelect(bed.id)}
            >
              <div className="bed-select-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8"/>
                  <path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4"/>
                  <path d="M12 10v10"/>
                  <path d="M2 20h20"/>
                </svg>
              </div>
              <span className="bed-select-label">{bed.id}</span>
              {isOccupied ? (
                <>
                  <span className="bed-select-name">{bed.studentName}</span>
                  <span className="bed-status-tag bed-tag-occupied">Occupied</span>
                </>
              ) : (
                <span className="bed-status-tag bed-tag-available">Available</span>
              )}
            </div>
          );
        }

        // Indicator dots (for room cards)
        return (
          <span
            key={bed.id}
            className={`bed-dot ${isOccupied ? 'bed-dot-occupied' : 'bed-dot-empty'}`}
            title={isOccupied ? bed.studentName : 'Available'}
          />
        );
      })}
    </div>
  );
};

export default BedGrid;