import React, { useEffect, useMemo, useState } from 'react';
import { adminDashboardApi } from '../../services/adminDashboardApi';
import '../../styles/admin/Charts.css';

const Charts = () => {
  const [monthlyFeeData, setMonthlyFeeData] = useState([]);
  const [roomOccupancy, setRoomOccupancy] = useState({ occupied: 0, available: 0, maintenance: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadCharts = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await adminDashboardApi.getCharts();
        if (response.data?.status === 'success') {
          const data = response.data.data || {};
          setMonthlyFeeData(data.monthlyFeeData || []);
          setRoomOccupancy(data.roomOccupancy || { occupied: 0, available: 0, maintenance: 0 });
        } else {
          setMonthlyFeeData([]);
          setRoomOccupancy({ occupied: 0, available: 0, maintenance: 0 });
          setError('Failed to load chart data');
        }
      } catch {
        setMonthlyFeeData([]);
        setRoomOccupancy({ occupied: 0, available: 0, maintenance: 0 });
        setError('Failed to load chart data');
      } finally {
        setLoading(false);
      }
    };

    loadCharts();
  }, []);

  const maxValue = useMemo(() => {
    if (monthlyFeeData.length === 0) {
      return 1;
    }
    const maxFromData = Math.max(...monthlyFeeData.map((d) => Number(d.value || 0)));
    return maxFromData > 0 ? maxFromData : 1;
  }, [monthlyFeeData]);

  const occupancySegments = useMemo(() => {
    const occupied = Number(roomOccupancy.occupied || 0);
    const available = Number(roomOccupancy.available || 0);
    const maintenance = Number(roomOccupancy.maintenance || 0);
    const total = occupied + available + maintenance;
    const circumference = 2 * Math.PI * 80;

    if (total === 0) {
      return {
        occupied: { dasharray: `${circumference} ${circumference}`, dashoffset: 0 },
        available: { dasharray: `${circumference} ${circumference}`, dashoffset: -circumference },
        maintenance: { dasharray: `${circumference} ${circumference}`, dashoffset: -circumference }
      };
    }

    const occupiedLen = (occupied / total) * circumference;
    const availableLen = (available / total) * circumference;
    const maintenanceLen = (maintenance / total) * circumference;

    return {
      occupied: { dasharray: `${occupiedLen} ${circumference - occupiedLen}`, dashoffset: 0 },
      available: { dasharray: `${availableLen} ${circumference - availableLen}`, dashoffset: -occupiedLen },
      maintenance: { dasharray: `${maintenanceLen} ${circumference - maintenanceLen}`, dashoffset: -(occupiedLen + availableLen) }
    };
  }, [roomOccupancy]);

  const monthlyTotal = monthlyFeeData.reduce((sum, item) => sum + Number(item.value || 0), 0);

  if (loading) {
    return <div className="charts-container"><div className="loading">Loading chart data...</div></div>;
  }

  if (error) {
    return <div className="charts-container"><div className="error" style={{ color: '#EF4444' }}>{error}</div></div>;
  }

  return (
    <div className="charts-container">
      {/* Monthly Fee Collection */}
      <div className="chart-card">
        <div className="chart-header">
          <h2 className="section-title">Monthly Fee Collection</h2>
          <span className="chart-value">₹{monthlyTotal.toLocaleString('en-IN')}</span>
        </div>
        <div className="bar-chart">
          {monthlyFeeData.map((data) => (
            <div key={data.month} className="bar-container">
              <div 
                className="bar"
                style={{ height: `${(Number(data.value || 0) / maxValue) * 100}%` }}
              />
              <span className="bar-label">{data.month}</span>
            </div>
          ))}
        </div>
        <div className="chart-axis">
          <span>0</span>
          <span>{Math.round(maxValue * 0.25).toLocaleString('en-IN')}</span>
          <span>{Math.round(maxValue * 0.5).toLocaleString('en-IN')}</span>
          <span>{Math.round(maxValue * 0.75).toLocaleString('en-IN')}</span>
          <span>{Math.round(maxValue).toLocaleString('en-IN')}</span>
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
              strokeDasharray={occupancySegments.occupied.dasharray}
              strokeDashoffset={occupancySegments.occupied.dashoffset}
            />
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="#FB8C00"
              strokeWidth="30"
              strokeDasharray={occupancySegments.available.dasharray}
              strokeDashoffset={occupancySegments.available.dashoffset}
            />
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="#2BBBAD"
              strokeWidth="30"
              strokeDasharray={occupancySegments.maintenance.dasharray}
              strokeDashoffset={occupancySegments.maintenance.dashoffset}
            />
          </svg>
        </div>
        <div className="donut-legend">
          <div className="legend-item">
            <span className="legend-dot" style={{ backgroundColor: '#1F3C88' }} />
            <span className="legend-label">Occupied ({roomOccupancy.occupied || 0})</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ backgroundColor: '#FB8C00' }} />
            <span className="legend-label">Available ({roomOccupancy.available || 0})</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ backgroundColor: '#2BBBAD' }} />
            <span className="legend-label">Maintenance ({roomOccupancy.maintenance || 0})</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Charts;