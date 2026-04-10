import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CreditCard, Clock, Download, History, FileText,
  HelpCircle, CheckCircle, AlertCircle, AlertTriangle,
  ChevronRight, TrendingUp, Wifi, Zap, Wrench, Home, UtensilsCrossed
} from 'lucide-react';
import { studentFeeApi } from '../../../services/adminFeeApi';
import '../../../styles/student/fees/fee-details.css';

const fmt = (n) => n ? `₹${Number(n).toLocaleString('en-IN')}` : '₹0';

const statusConfig = {
  PAID:    { label: 'PAID',    color: '#22c55e', bg: '#F0FDF4', border: '#bbf7d0' },
  PARTIAL: { label: 'PARTIAL', color: '#F59E0B', bg: '#FFF8E7', border: '#fde68a' },
  PENDING: { label: 'PENDING', color: '#EF4444', bg: '#FEF2F2', border: '#fecaca' },
};

const txnStatusCfg = {
  Verified:  { color: '#22c55e', bg: '#F0FDF4' },
  Completed: { color: '#22c55e', bg: '#F0FDF4' },
  Paid:      { color: '#22c55e', bg: '#F0FDF4' },
  Pending:   { color: '#F59E0B', bg: '#FFF8E7' },
  Failed:    { color: '#EF4444', bg: '#FEF2F2' },
};

const FeeDetails = () => {
  const navigate = useNavigate();
  const [feeStructure, setFeeStructure] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeState, setActiveState] = useState('pending');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFeeDetails();
  }, []);

  const fetchFeeDetails = async () => {
    try {
      const response = await studentFeeApi.getFeeStructure();
      if (response.data.success && response.data.data && response.data.data.length > 0) {
        setFeeStructure(response.data.data[0]);
        setActiveState('pending');
      } else {
        setFeeStructure(null);
      }
    } catch (err) {
      console.error('Error fetching fee details:', err);
      setError('Failed to load fee details');
    } finally {
      setLoading(false);
    }
  };

  const data = feeStructure ? {
    status: 'PENDING',
    month: new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }),
    totalFee: (feeStructure.monthlyFee || 0) + (feeStructure.utilities || 0),
    paidAmount: 0,
    remaining: (feeStructure.monthlyFee || 0) + (feeStructure.utilities || 0),
    dueDate: `15th ${new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}`,
    message: `Your fee for ${feeStructure.roomType} room in ${feeStructure.hostelBlock} is pending. Please pay your monthly fee of ₹${feeStructure.monthlyFee?.toLocaleString()}.`,
    progressPercent: 0,
    breakdown: [
      { label: `Monthly Hostel Rent (${feeStructure.roomType} Room - ${feeStructure.hostelBlock})`, icon: Home, amount: feeStructure.monthlyFee || 0 },
      { label: 'Mess Charges (Standard Veg/Non-Veg)', icon: UtensilsCrossed, amount: 3500 },
      { label: 'Electricity (Based on usage)', icon: Zap, amount: feeStructure.utilities || 0 },
      { label: 'Maintenance & Security Fee', icon: Wrench, amount: 500 },
      { label: 'Wi-Fi Services', icon: Wifi, amount: 300 },
    ],
    recentTxns: [],
  } : {
    status: 'PENDING',
    month: new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }),
    totalFee: 0,
    paidAmount: 0,
    remaining: 0,
    dueDate: 'N/A',
    message: 'No room assigned yet. Please contact the administration.',
    progressPercent: 0,
    breakdown: [],
    recentTxns: [],
  };

  const scfg = statusConfig[data.status];

  const progressColor = data.status === 'PAID' ? '#22c55e' : data.status === 'PARTIAL' ? '#F59E0B' : '#EF4444';

  if (loading) {
    return (
      <div className="fd-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <p>Loading fee details...</p>
      </div>
    );
  }

  return (
    <div className="fd-page">
      {/* Page Header */}
      <div className="fd-header">
        <div>
          <h1 className="fd-title">Fee Details</h1>
          <p className="fd-subtitle">Manage your hostel and mess fees for the current academic session.</p>
        </div>
        <div className="fd-header-actions">
          <button className="fd-btn-outline" onClick={() => navigate('/student/fees/history')}>
            <History size={15} /> View History
          </button>
          {feeStructure && (
            <button className="fd-btn-primary" onClick={() => navigate('/student/fees/pay')}>
              <CreditCard size={15} /> Pay Fee
            </button>
          )}
        </div>
      </div>

      {/* Main Grid */}
      <div className="fd-main-grid">
        {/* Left Column */}
        <div className="fd-left">
          {/* Fee Summary Card */}
          <div className="fd-summary-card">
            <div className="fd-summary-top">
              <div>
                <div className="fd-summary-badge" style={{ color: scfg.color, background: scfg.bg, border: `1px solid ${scfg.border}` }}>
                  {data.status === 'PAID'    && <CheckCircle  size={12} />}
                  {data.status === 'PARTIAL' && <AlertCircle  size={12} />}
                  {data.status === 'PENDING' && <AlertTriangle size={12} />}
                  {scfg.label}
                </div>
                <h2 className="fd-summary-title">Fee Summary: {data.month}</h2>
                <p className="fd-summary-msg">{data.message}</p>
              </div>
              <div className="fd-summary-due">
                <Clock size={13} />
                Due Date: {data.dueDate}
              </div>
            </div>

            <div className="fd-summary-stats">
              <div className="fd-stat-box">
                <span className="fd-stat-label">TOTAL FEE</span>
                <span className="fd-stat-value">{fmt(data.totalFee)}</span>
              </div>
              <div className="fd-stat-box">
                <span className="fd-stat-label">AMOUNT PAID</span>
                <span className="fd-stat-value" style={{ color: '#22c55e' }}>{fmt(data.paidAmount)}</span>
              </div>
              <div className="fd-stat-box">
                <span className="fd-stat-label">BALANCE DUE</span>
                <span className="fd-stat-value" style={{ color: data.remaining > 0 ? '#EF4444' : '#22c55e' }}>
                  {fmt(data.remaining)}
                </span>
              </div>
            </div>

            {data.status === 'PENDING' && feeStructure && (
              <div className="fd-pay-now-strip">
                <span><Clock size={13} /> Due Date: {data.dueDate}</span>
                <button className="fd-btn-primary fd-btn-sm" onClick={() => navigate('/student/fees/pay')}>
                  Pay Fee Now <ChevronRight size={14} />
                </button>
              </div>
            )}
          </div>

          {/* Fee Breakdown */}
          <div className="fd-card">
            <div className="fd-card-header">
              <div>
                <h3 className="fd-card-title"><FileText size={16} /> Fee Breakdown</h3>
                <p className="fd-card-sub">Academic Session 2024-25 | Current Cycle</p>
              </div>
              <button className="fd-export-btn"><Download size={14} /> Export CSV</button>
            </div>
            <div className="fd-breakdown-list">
              {data.breakdown.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="fd-breakdown-row">
                    <div className="fd-breakdown-left">
                      <div className="fd-breakdown-icon"><Icon size={15} /></div>
                      <span>{item.label}</span>
                    </div>
                    <span className="fd-breakdown-amount">{fmt(item.amount)}</span>
                  </div>
                );
              })}
              <div className="fd-breakdown-total">
                <span>Total Monthly Payable</span>
                <span>{fmt(data.totalFee)}</span>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="fd-card">
            <div className="fd-card-header">
              <h3 className="fd-card-title"><History size={16} /> Recent Transactions</h3>
              <button className="fd-link-btn" onClick={() => navigate('/student/fees/history')}>
                View All <ChevronRight size={13} />
              </button>
            </div>
            {data.recentTxns.length > 0 ? (
              <div className="fd-table-wrap">
                <table className="fd-table">
                  <thead>
                    <tr>
                      <th>RECEIPT ID</th>
                      <th>DATE</th>
                      <th>METHOD</th>
                      <th>AMOUNT</th>
                      <th>STATUS</th>
                      <th>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentTxns.map((txn) => {
                      const tcfg = txnStatusCfg[txn.status] || { color: '#6B7280', bg: '#F4F6F9' };
                      return (
                        <tr key={txn.id}>
                          <td className="fd-txn-id">{txn.id}</td>
                          <td>{txn.date}</td>
                          <td>{txn.method}</td>
                          <td className="fd-txn-amount">{fmt(txn.amount)}</td>
                          <td>
                            <span className="fd-txn-badge" style={{ color: tcfg.color, background: tcfg.bg }}>
                              {txn.status}
                            </span>
                          </td>
                          <td>
                            <button
                              className="fd-view-btn"
                              onClick={() => navigate(`/student/fees/receipt/${txn.id}`)}
                              title="View Receipt"
                            >
                              <FileText size={15} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ padding: '20px', textAlign: 'center', color: '#6B7280' }}>
                No recent transactions
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="fd-right">
          {/* Payment Status Card */}
          <div className="fd-card">
            <h3 className="fd-card-title" style={{ marginBottom: 16 }}>
              <TrendingUp size={16} /> Payment Status
            </h3>
            <div className="fd-progress-ring-wrap">
              <div className="fd-progress-circle">
                <svg viewBox="0 0 100 100" className="fd-ring-svg">
                  <circle cx="50" cy="50" r="40" className="fd-ring-track" />
                  <circle
                    cx="50" cy="50" r="40"
                    className="fd-ring-fill"
                    style={{
                      stroke: progressColor,
                      strokeDasharray: `${data.progressPercent * 2.513} 251.3`,
                    }}
                  />
                </svg>
                <div className="fd-ring-inner">
                  {data.status === 'PAID'
                    ? <CheckCircle size={28} color="#22c55e" />
                    : <span className="fd-ring-pct" style={{ color: progressColor }}>{data.progressPercent}%</span>
                  }
                </div>
              </div>
              <p className="fd-progress-label" style={{ color: progressColor }}>
                {data.status === 'PAID' ? '100% Completed' : `${data.progressPercent}% Paid`}
              </p>
              {data.status === 'PAID' && (
                <p className="fd-progress-quote">"Your financial standing is excellent."</p>
              )}
            </div>
            <div className="fd-progress-bar-wrap">
              <div className="fd-progress-meta">
                <span>PROGRESS</span>
                <span>{fmt(data.paidAmount)} / {fmt(data.totalFee)}</span>
              </div>
              <div className="fd-progress-bar-bg">
                <div
                  className="fd-progress-bar-fill"
                  style={{ width: `${data.progressPercent}%`, background: progressColor }}
                />
              </div>
              <div className="fd-progress-meta" style={{ marginTop: 6 }}>
                <span style={{ color: '#22c55e' }}>Paid: {fmt(data.paidAmount)}</span>
                <span style={{ color: '#EF4444' }}>Pending: {fmt(data.remaining)}</span>
              </div>
            </div>
          </div>

          {/* Fee Structure Info Card */}
          {feeStructure && (
            <div className="fd-card">
              <h3 className="fd-card-title" style={{ marginBottom: 14 }}>Your Fee Structure</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e5e7eb' }}>
                  <span style={{ color: '#6B7280' }}>Room Type</span>
                  <span style={{ fontWeight: 500 }}>{feeStructure.roomType}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e5e7eb' }}>
                  <span style={{ color: '#6B7280' }}>Hostel Block</span>
                  <span style={{ fontWeight: 500 }}>{feeStructure.hostelBlock}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e5e7eb' }}>
                  <span style={{ color: '#6B7280' }}>Monthly Fee</span>
                  <span style={{ fontWeight: 600, color: '#1f3c86' }}>₹{feeStructure.monthlyFee?.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e5e7eb' }}>
                  <span style={{ color: '#6B7280' }}>Security Deposit</span>
                  <span style={{ fontWeight: 500 }}>₹{feeStructure.securityDeposit?.toLocaleString()}</span>
                </div>
                {feeStructure.lateFee && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                    <span style={{ color: '#6B7280' }}>Late Fee</span>
                    <span style={{ fontWeight: 500, color: '#EF4444' }}>₹{feeStructure.lateFee}/day</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="fd-card">
            <h3 className="fd-card-title" style={{ marginBottom: 14 }}>Quick Actions</h3>
            {[
              { icon: Download,  label: 'Download Latest Receipt', onClick: () => {} },
              { icon: History,   label: 'View Payment History',    onClick: () => navigate('/student/fees/history') },
              { icon: CreditCard,label: 'Pay Fee',                  onClick: () => feeStructure ? navigate('/student/fees/pay') : () => {} },
              { icon: FileText,  label: 'Request Fee Certificate', onClick: () => {} },
            ].map((action, i) => {
              const Icon = action.icon;
              return (
                <button key={i} className="fd-quick-action" onClick={action.onClick}>
                  <div className="fd-qa-icon"><Icon size={16} /></div>
                  <span className="fd-qa-label">{action.label}</span>
                  <ChevronRight size={15} className="fd-qa-arrow" />
                </button>
              );
            })}
          </div>

          {/* Help Card */}
          <div className="fd-help-card">
            <div className="fd-help-icon"><HelpCircle size={22} /></div>
            <h4 className="fd-help-title">Need Help?</h4>
            <p className="fd-help-msg">
              If you notice any discrepancies in your fee breakdown, please contact the Accounts Office or raise a ticket.
            </p>
            <button className="fd-help-btn">Contact Support</button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default FeeDetails;