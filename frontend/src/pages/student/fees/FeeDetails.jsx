import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CreditCard, Clock, Download, History, FileText,
  HelpCircle, CheckCircle, AlertCircle, AlertTriangle,
  ChevronRight, TrendingUp, Wifi, Zap, Wrench, Home, UtensilsCrossed
} from 'lucide-react';
import '../../../styles/student/fees/fee-details.css';

// ── Mock Data ─────────────────────────────────────────────────
const feeData = {
  paid: {
    status: 'PAID',
    month: 'October 2024',
    totalFee: 12500,
    paidAmount: 12500,
    remaining: 0,
    dueDate: 'Oct 15, 2024',
    message: 'All dues for the current billing cycle have been cleared successfully.',
    progressPercent: 100,
    breakdown: [
      { label: 'Monthly Hostel Rent (Premium AC Room)', icon: Home,           amount: 7500 },
      { label: 'Mess Charges (Standard Veg/Non-Veg)',  icon: UtensilsCrossed, amount: 3200 },
      { label: 'Electricity (Metered Usage – 45 Units)',icon: Zap,            amount: 900  },
      { label: 'Maintenance & Security Fee',           icon: Wrench,          amount: 600  },
      { label: 'Wi-Fi (High Speed – 100 Mbps)',        icon: Wifi,            amount: 300  },
    ],
    recentTxns: [
      { id: 'RCPT-9921', date: 'Oct 02, 2024', method: 'UPI (GPay)',     amount: 12500, status: 'Verified' },
      { id: 'RCPT-8712', date: 'Sep 05, 2024', method: 'Bank Transfer',  amount: 12200, status: 'Verified' },
    ],
  },
  partial: {
    status: 'PARTIAL',
    month: 'April 2024',
    totalFee: 45000,
    paidAmount: 27000,
    remaining: 18000,
    dueDate: 'Oct 15, 2024',
    message: 'A late fee of ₹100/day will be applicable if the remaining balance is not cleared by the due date.',
    progressPercent: 60,
    breakdown: [
      { label: 'Hostel Room Rent (Premium Boys – Block A)', icon: Home,            amount: 30000 },
      { label: 'Monthly Mess Charges (Veg + Non-Veg)',      icon: UtensilsCrossed, amount: 12000 },
      { label: 'Electricity & Power Backup (Variable)',      icon: Zap,             amount: 1850  },
      { label: 'Water & Maintenance Charges (Fixed)',        icon: Wrench,          amount: 1150  },
    ],
    recentTxns: [
      { id: 'TXN-2024-8829', date: 'Sep 12, 2024', method: 'UPI Payment',    amount: 10000, status: 'Completed' },
      { id: 'TXN-2024-7412', date: 'Aug 15, 2024', method: 'Bank Transfer',  amount: 8500,  status: 'Completed' },
      { id: 'TXN-2024-6903', date: 'Jul 10, 2024', method: 'Cash Deposit',   amount: 8500,  status: 'Completed' },
    ],
  },
  pending: {
    status: 'PENDING',
    month: 'April 2024',
    totalFee: 12500,
    paidAmount: 4000,
    remaining: 8500,
    dueDate: '15th April, 2024',
    message: 'Your payment for April is currently overdue by 2 days. Late fees of ₹50/day will apply after 15th April.',
    progressPercent: 32,
    breakdown: [
      { label: 'Room Rent (Standard AC) – Block B, Room 101', icon: Home,            amount: 7000 },
      { label: 'Mess Charges – Regular Meal Plan',             icon: UtensilsCrossed, amount: 3500 },
      { label: 'Electricity & Water – Metered Consumption',    icon: Zap,             amount: 1500 },
      { label: 'Internet/WiFi Services – High Speed Fiber',    icon: Wifi,            amount: 500  },
    ],
    recentTxns: [
      { id: 'TXN-88295', date: '2024-04-05', method: 'UPI',           amount: 4000,  status: 'Paid'    },
      { id: 'TXN-88241', date: '2024-04-02', method: 'Bank Transfer', amount: 8500,  status: 'Failed'  },
      { id: 'TXN-87110', date: '2024-03-15', method: 'UPI',           amount: 12500, status: 'Paid'    },
    ],
  },
};

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

const fmt = (n) => `₹${Number(n).toLocaleString('en-IN')}`;

// ── Component ─────────────────────────────────────────────────
const FeeDetails = () => {
  const navigate = useNavigate();
  const [activeState, setActiveState] = useState('paid'); // 'paid' | 'partial' | 'pending'
  const data = feeData[activeState];
  const scfg = statusConfig[data.status];

  const progressColor =
    data.status === 'PAID'    ? '#22c55e' :
    data.status === 'PARTIAL' ? '#F59E0B' : '#EF4444';

  return (
    <div className="fd-page">

      {/* ── Demo State Switcher ── */}
      <div className="fd-demo-bar">
        <span className="fd-demo-label">Preview State:</span>
        {['paid', 'partial', 'pending'].map((s) => (
          <button
            key={s}
            className={`fd-demo-btn ${activeState === s ? 'fd-demo-active' : ''}`}
            onClick={() => setActiveState(s)}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* ── Page Header ── */}
      <div className="fd-header">
        <div>
          <h1 className="fd-title">Fee Details</h1>
          <p className="fd-subtitle">Manage your hostel and mess fees for the current academic session.</p>
        </div>
        <div className="fd-header-actions">
          <button className="fd-btn-outline" onClick={() => navigate('/student/fees/history')}>
            <History size={15} /> View History
          </button>
          <button className="fd-btn-primary" onClick={() => navigate('/student/fees/pay')}>
            <CreditCard size={15} /> Pay Fee
          </button>
        </div>
      </div>

      {/* ── Main Grid ── */}
      <div className="fd-main-grid">

        {/* ── Left Column ── */}
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

            {data.status === 'PENDING' && (
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

            {data.status === 'PAID' && (
              <div className="fd-receipt-note">
                <AlertCircle size={14} />
                Receipt for this transaction has been automatically generated and sent to your registered email.
              </div>
            )}
          </div>

          {/* Recent Transactions */}
          <div className="fd-card">
            <div className="fd-card-header">
              <h3 className="fd-card-title"><History size={16} /> Recent Transactions</h3>
              <button className="fd-link-btn" onClick={() => navigate('/student/fees/history')}>
                View All <ChevronRight size={13} />
              </button>
            </div>
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
          </div>
        </div>

        {/* ── Right Column ── */}
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
            {data.status === 'PARTIAL' && (
              <div className="fd-next-due">
                <Clock size={13} /> Next Due: {data.dueDate}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="fd-card">
            <h3 className="fd-card-title" style={{ marginBottom: 14 }}>Quick Actions</h3>
            {[
              { icon: Download,  label: 'Download Latest Receipt', onClick: () => navigate(`/student/fees/receipt/RCPT-9921`) },
              { icon: History,   label: 'View Payment History',    onClick: () => navigate('/student/fees/history') },
              { icon: CreditCard,label: 'Update Payment Method',   onClick: () => {} },
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