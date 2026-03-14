import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Building2, Zap, Droplets, Wrench, Clock,
  CheckCircle, Save, IndianRupee
} from 'lucide-react';
import { hostelOptions, roomTypeOptions, feeCycleOptions } from '../../../data/feesData';
import '../../../styles/admin/fees/feeDetails.css';

const FeeDetails = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    hostel: 'Block A (Premium Boys)',
    roomType: 'AC Room',
    monthlyRent: '',
    securityDeposit: '',
    electricity: '',
    water: '',
    maintenance: '',
    lateFeePerDay: '',
    feeCycle: 'Monthly',
  });

  const set = (key) => (e) => setForm(prev => ({ ...prev, [key]: e.target.value }));

  const totalEstimate =
    (parseFloat(form.monthlyRent) || 0) +
    (parseFloat(form.electricity) || 0) +
    (parseFloat(form.water) || 0) +
    (parseFloat(form.maintenance) || 0);

  const handleSave = (e) => {
    e.preventDefault();
    console.log('Saving fee structure:', form);
    navigate('/admin/fees/structure');
  };

  return (
    <div className="fee-details-page">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-left">
          <div className="breadcrumb">
            <span>Dashboard</span><span className="breadcrumb-sep">›</span>
            <span>Fees</span><span className="breadcrumb-sep">›</span>
            <span>Fee Structure</span><span className="breadcrumb-sep">›</span>
            <span className="breadcrumb-active">Add</span>
          </div>
          <div className="title-row">
            <button className="back-btn" onClick={() => navigate('/admin/fees/structure')}>
              <ArrowLeft size={18} />
            </button>
            <h1 className="page-title">Fee Details</h1>
            <span className="draft-badge">Draft</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave}>
        {/* Structure Configuration */}
        <div className="form-card">
          <div className="section-header">
            <div className="section-accent" />
            <div>
              <h2 className="section-title">Structure Configuration</h2>
              <p className="section-sub">Define the financial and utility parameters for the selected room and hostel combination.</p>
            </div>
          </div>
        </div>

        {/* Hostel & Room Assignment */}
        <div className="form-card">
          <h3 className="sub-section-title">Hostel &amp; Room Assignment</h3>
          <p className="sub-section-sub">Select where this fee structure will be applicable.</p>
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Select Hostel</label>
              <div className="input-with-icon">
                <Building2 size={16} className="input-icon" />
                <select className="form-select" value={form.hostel} onChange={set('hostel')}>
                  {hostelOptions.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Room Type</label>
              <select className="form-select" value={form.roomType} onChange={set('roomType')}>
                {roomTypeOptions.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Base Financials */}
        <div className="form-card">
          <h3 className="sub-section-title">Base Financials</h3>
          <p className="sub-section-sub">Set the core monthly charges and security deposits.</p>
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Monthly Rent/Fee</label>
              <div className="input-with-icon">
                <IndianRupee size={15} className="input-icon" />
                <input
                  className="form-input"
                  type="number"
                  placeholder="e.g. 12000"
                  value={form.monthlyRent}
                  onChange={set('monthlyRent')}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Security Deposit (Refundable)</label>
              <div className="input-with-icon">
                <IndianRupee size={15} className="input-icon" />
                <input
                  className="form-input"
                  type="number"
                  placeholder="e.g. 25000"
                  value={form.securityDeposit}
                  onChange={set('securityDeposit')}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Utility Charges */}
        <div className="form-card">
          <h3 className="sub-section-title">Utility Charges</h3>
          <p className="sub-section-sub">Specify additional fixed charges for services.</p>
          <div className="form-grid-3">
            <div className="form-group">
              <label className="form-label">Electricity</label>
              <div className="input-with-icon">
                <Zap size={15} className="input-icon" />
                <input className="form-input" type="number" placeholder="Fixed amt" value={form.electricity} onChange={set('electricity')} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Water Usage</label>
              <div className="input-with-icon">
                <Droplets size={15} className="input-icon" />
                <input className="form-input" type="number" placeholder="Fixed amt" value={form.water} onChange={set('water')} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Maintenance</label>
              <div className="input-with-icon">
                <Wrench size={15} className="input-icon" />
                <input className="form-input" type="number" placeholder="Fixed amt" value={form.maintenance} onChange={set('maintenance')} />
              </div>
            </div>
          </div>
        </div>

        {/* Penalty & Billing Cycle */}
        <div className="form-card">
          <h3 className="sub-section-title">Penalty &amp; Billing Cycle</h3>
          <p className="sub-section-sub">Configure late fee rules and invoicing frequency.</p>
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Late Fee Penalty (Per Day)</label>
              <div className="input-with-icon">
                <Clock size={15} className="input-icon" />
                <input className="form-input" type="number" placeholder="e.g. 100" value={form.lateFeePerDay} onChange={set('lateFeePerDay')} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Fee Cycle</label>
              <select className="form-select" value={form.feeCycle} onChange={set('feeCycle')}>
                {feeCycleOptions.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions-card">
          <p className="actions-note">Review all fields carefully. Saving this structure will apply it to all new bookings for the selected hostel and room type.</p>
          <div className="actions-buttons">
            <button type="button" className="btn-cancel" onClick={() => navigate('/admin/fees/structure')}>Cancel</button>
            <button type="submit" className="btn-save">
              <Save size={16} /> Save Structure
            </button>
          </div>
        </div>
      </form>

      {/* Summary Cards */}
      <div className="summary-cards-grid">
        <div className="summary-card">
          <Building2 size={20} className="summary-icon summary-icon-blue" />
          <div>
            <div className="summary-label">Applicable Scope</div>
            <div className="summary-value">{form.hostel.split('(')[0].trim()}</div>
          </div>
        </div>
        <div className="summary-card">
          <IndianRupee size={20} className="summary-icon summary-icon-green" />
          <div>
            <div className="summary-label">Total Monthly Est.</div>
            <div className="summary-value">₹{totalEstimate.toLocaleString()} / Month</div>
          </div>
        </div>
        <div className="summary-card">
          <Clock size={20} className="summary-icon summary-icon-amber" />
          <div>
            <div className="summary-label">Invoicing Frequency</div>
            <div className="summary-value">{form.feeCycle} Cycles</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeeDetails;