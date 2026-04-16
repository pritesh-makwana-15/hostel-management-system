import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CreditCard, Clock, Download, History, FileText,
  HelpCircle, CheckCircle, AlertCircle, AlertTriangle,
  ChevronRight, TrendingUp, Zap, Wrench, Home
} from 'lucide-react';
import { studentFeeApi } from '../../../services/adminFeeApi';
import '../../../styles/student/fees/fee-details.css';

const fmt = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

const statusConfig = {
  PAID: { label: 'PAID', color: '#22c55e', bg: '#F0FDF4', border: '#bbf7d0' },
  PARTIAL: { label: 'PARTIAL', color: '#F59E0B', bg: '#FFF8E7', border: '#fde68a' },
  PENDING: { label: 'PENDING', color: '#EF4444', bg: '#FEF2F2', border: '#fecaca' },
};

const txnStatusCfg = {
  VERIFIED: { color: '#22c55e', bg: '#F0FDF4' },
  PENDING: { color: '#F59E0B', bg: '#FFF8E7' },
  REJECTED: { color: '#EF4444', bg: '#FEF2F2' },
};

const progressColorByStatus = {
  PAID: '#22c55e',
  PARTIAL: '#F59E0B',
  PENDING: '#EF4444',
};

const FeeDetails = () => {
  const navigate = useNavigate();
  const [feeSummary, setFeeSummary] = useState(null);
  const [recentPayments, setRecentPayments] = useState([]);
  const [lastReceiptId, setLastReceiptId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError('');
        const [summaryResponse, paymentsResponse] = await Promise.all([
          studentFeeApi.getMyRecord(),
          studentFeeApi.getPayments(),
        ]);

        const summary = summaryResponse?.data?.data || null;
        const payments = Array.isArray(paymentsResponse?.data?.data) ? paymentsResponse.data.data : [];

        setFeeSummary(summary);
        setRecentPayments(payments.slice(0, 5));
        setLastReceiptId(payments[0]?.paymentId || '');
      } catch (err) {
        console.error('Error fetching fee details:', err);
        setFeeSummary(null);
        setRecentPayments([]);
        setLastReceiptId('');
        setError(err?.response?.data?.message || 'Unable to load fee details.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalFee = Number(feeSummary?.totalFee || 0);
  const paidAmount = Number(feeSummary?.paidAmount || 0);
  const remainingFee = Math.max(0, totalFee - paidAmount);
  const currentStatus = (feeSummary?.status || 'PENDING').toUpperCase();

  const progressPercent = totalFee > 0 ? Math.min(100, Math.round((paidAmount / totalFee) * 100)) : 0;
  const progressColor = progressColorByStatus[currentStatus] || '#EF4444';
  const statusUi = statusConfig[currentStatus] || statusConfig.PENDING;

  const data = feeSummary
    ? {
        status: currentStatus,
        month: feeSummary.academicCycle,
        totalFee,
        paidAmount,
        remaining: remainingFee,
        dueDate: `15th ${new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}`,
        message: `Fee details for ${feeSummary.roomType} room in ${feeSummary.hostelBlock} (${feeSummary.academicCycle}).`,
        progressPercent,
        breakdown: [
          {
            label: `Monthly Hostel Rent (${feeSummary.roomType} - ${feeSummary.hostelBlock})`,
            icon: Home,
            amount: feeSummary.monthlyFee || 0,
          },
          { label: 'Utilities', icon: Zap, amount: feeSummary.utilities || 0 },
          { label: 'Security Deposit (One Time)', icon: Wrench, amount: feeSummary.securityDeposit || 0 },
          { label: 'Late Fee (Per Day, if applicable)', icon: Clock, amount: feeSummary.lateFee || 0 },
        ],
      }
    : {
        status: 'PENDING',
        month: new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }),
        totalFee: 0,
        paidAmount: 0,
        remaining: 0,
        dueDate: 'N/A',
        message: error || 'No fee record found. Please contact administration.',
        progressPercent: 0,
        breakdown: [],
      };

  if (loading) {
    return (
      <div className="fd-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <p>Loading fee details...</p>
      </div>
    );
  }

  return (
    <div className="fd-page">
      <div className="fd-header">
        <div>
          <h1 className="fd-title">Fee Details</h1>
          <p className="fd-subtitle">Manage your hostel and mess fees for the current academic session.</p>
        </div>
        <div className="fd-header-actions">
          <button className="fd-btn-outline" onClick={() => navigate('/student/fees/history')}>
            <History size={15} /> View History
          </button>
          {feeSummary && remainingFee > 0 && (
            <button className="fd-btn-primary" onClick={() => navigate('/student/fees/pay')}>
              <CreditCard size={15} /> Pay Fee
            </button>
          )}
        </div>
      </div>

      <div className="fd-main-grid">
        <div className="fd-left">
          <div className="fd-summary-card">
            <div className="fd-summary-top">
              <div>
                <div className="fd-summary-badge" style={{ color: statusUi.color, background: statusUi.bg, border: `1px solid ${statusUi.border}` }}>
                  {data.status === 'PAID' && <CheckCircle size={12} />}
                  {data.status === 'PARTIAL' && <AlertCircle size={12} />}
                  {data.status === 'PENDING' && <AlertTriangle size={12} />}
                  {statusUi.label}
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

            {data.remaining > 0 && feeSummary && (
              <div className="fd-pay-now-strip">
                <span><Clock size={13} /> ₹{Number(data.remaining).toLocaleString('en-IN')} remaining</span>
                <button className="fd-btn-primary fd-btn-sm" onClick={() => navigate('/student/fees/pay')}>
                  Pay Fee Now <ChevronRight size={14} />
                </button>
              </div>
            )}
          </div>

          <div className="fd-card">
            <div className="fd-card-header">
              <div>
                <h3 className="fd-card-title"><FileText size={16} /> Fee Breakdown</h3>
                <p className="fd-card-sub">Academic Session 2024-25 | Current Cycle</p>
              </div>
              <button className="fd-export-btn"><Download size={14} /> Export CSV</button>
            </div>
            <div className="fd-breakdown-list">
              {data.breakdown.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="fd-breakdown-row">
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

          <div className="fd-card">
            <div className="fd-card-header">
              <h3 className="fd-card-title"><History size={16} /> Recent Transactions</h3>
              <button className="fd-link-btn" onClick={() => navigate('/student/fees/history')}>
                View All <ChevronRight size={13} />
              </button>
            </div>
            {recentPayments.length > 0 ? (
              <div className="fd-table-wrap">
                <table className="fd-table">
                  <thead>
                    <tr>
                      <th>PAYMENT ID</th>
                      <th>DATE</th>
                      <th>METHOD</th>
                      <th>AMOUNT</th>
                      <th>STATUS</th>
                      <th>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentPayments.map((txn) => {
                      const status = String(txn.status || 'PENDING').toUpperCase();
                      const tcfg = txnStatusCfg[status] || { color: '#6B7280', bg: '#F4F6F9' };
                      return (
                        <tr key={txn.paymentId}>
                          <td className="fd-txn-id">{txn.paymentId}</td>
                          <td>{txn.paymentDate || '-'}</td>
                          <td>{txn.paymentMethod || '-'}</td>
                          <td className="fd-txn-amount">{fmt(txn.amount)}</td>
                          <td>
                            <span className="fd-txn-badge" style={{ color: tcfg.color, background: tcfg.bg }}>
                              {status}
                            </span>
                          </td>
                          <td>
                            <button
                              className="fd-view-btn"
                              onClick={() => navigate(`/student/fees/receipt/${txn.paymentId}`)}
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
              <div style={{ padding: '20px', textAlign: 'center', color: '#6B7280' }}>No recent transactions</div>
            )}
          </div>
        </div>

        <div className="fd-right">
          <div className="fd-card">
            <h3 className="fd-card-title" style={{ marginBottom: 16 }}>
              <TrendingUp size={16} /> Payment Status
            </h3>
            <div className="fd-progress-ring-wrap">
              <div className="fd-progress-circle">
                <svg viewBox="0 0 100 100" className="fd-ring-svg">
                  <circle cx="50" cy="50" r="40" className="fd-ring-track" />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
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
                    : <span className="fd-ring-pct" style={{ color: progressColor }}>{data.progressPercent}%</span>}
                </div>
              </div>
              <p className="fd-progress-label" style={{ color: progressColor }}>
                {data.status === 'PAID' ? '100% Completed' : `${data.progressPercent}% Paid`}
              </p>
            </div>
            <div className="fd-progress-bar-wrap">
              <div className="fd-progress-meta">
                <span>PROGRESS</span>
                <span>{fmt(data.paidAmount)} / {fmt(data.totalFee)}</span>
              </div>
              <div className="fd-progress-bar-bg">
                <div className="fd-progress-bar-fill" style={{ width: `${data.progressPercent}%`, background: progressColor }} />
              </div>
              <div className="fd-progress-meta" style={{ marginTop: 6 }}>
                <span style={{ color: '#22c55e' }}>Paid: {fmt(data.paidAmount)}</span>
                <span style={{ color: '#EF4444' }}>Pending: {fmt(data.remaining)}</span>
              </div>
            </div>
          </div>

          {feeSummary && (
            <div className="fd-card">
              <h3 className="fd-card-title" style={{ marginBottom: 14 }}>Your Fee Structure</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e5e7eb' }}>
                  <span style={{ color: '#6B7280' }}>Student</span>
                  <span style={{ fontWeight: 500 }}>{feeSummary.studentName || 'N/A'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e5e7eb' }}>
                  <span style={{ color: '#6B7280' }}>Enrollment No</span>
                  <span style={{ fontWeight: 500 }}>{feeSummary.enrollmentNo || 'N/A'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e5e7eb' }}>
                  <span style={{ color: '#6B7280' }}>Room Type</span>
                  <span style={{ fontWeight: 500 }}>{feeSummary.roomType}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e5e7eb' }}>
                  <span style={{ color: '#6B7280' }}>Hostel Block</span>
                  <span style={{ fontWeight: 500 }}>{feeSummary.hostelBlock}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e5e7eb' }}>
                  <span style={{ color: '#6B7280' }}>Monthly Fee</span>
                  <span style={{ fontWeight: 600, color: '#1f3c86' }}>{fmt(feeSummary.monthlyFee)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e5e7eb' }}>
                  <span style={{ color: '#6B7280' }}>Security Deposit</span>
                  <span style={{ fontWeight: 500 }}>{fmt(feeSummary.securityDeposit)}</span>
                </div>
              </div>
            </div>
          )}

          <div className="fd-card">
            <h3 className="fd-card-title" style={{ marginBottom: 14 }}>Quick Actions</h3>
            {[
              {
                icon: Download,
                label: 'Download Latest Receipt',
                onClick: () => (lastReceiptId ? navigate(`/student/fees/receipt/${lastReceiptId}`) : navigate('/student/fees/history')),
              },
              { icon: History, label: 'View Payment History', onClick: () => navigate('/student/fees/history') },
              {
                icon: CreditCard,
                label: 'Pay Fee',
                onClick: () => (remainingFee > 0 ? navigate('/student/fees/pay') : navigate('/student/fees/history')),
              },
              { icon: FileText, label: 'Request Fee Certificate', onClick: () => navigate('/student/fees/certificate') },
            ].map((action) => {
              const Icon = action.icon;
              return (
                <button key={action.label} className="fd-quick-action" onClick={action.onClick}>
                  <div className="fd-qa-icon"><Icon size={16} /></div>
                  <span className="fd-qa-label">{action.label}</span>
                  <ChevronRight size={15} className="fd-qa-arrow" />
                </button>
              );
            })}
          </div>

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