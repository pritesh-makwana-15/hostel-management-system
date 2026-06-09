import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, CreditCard, CheckCircle, Clock, AlertTriangle,
  ArrowUpRight, FileText, Plus, MoreVertical, Banknote, Globe,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { adminFeesApi } from '../../../services/adminFeeApi';
import '../../../styles/admin/fees/feesDashboard.css';

const FeesDashboard = () => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feeRecords, setFeeRecords] = useState([]);
  const [payments, setPayments] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [updatingPaymentId, setUpdatingPaymentId] = useState(null);
  const [updateError, setUpdateError] = useState('');

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const [recordsRes, paymentsRes] = await Promise.all([
        adminFeesApi.getAllRecords(),
        adminFeesApi.getAllPayments(),
      ]);

      setFeeRecords(Array.isArray(recordsRes?.data?.data) ? recordsRes.data.data : []);
      setPayments(Array.isArray(paymentsRes?.data?.data) ? paymentsRes.data.data : []);
    } catch (e) {
      console.error('Failed to load admin fee dashboard:', e);
      setError(e?.response?.data?.message || 'Unable to load fee dashboard data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  useEffect(() => {
    const onDocClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  useEffect(() => {
    const onFocus = () => {
      loadDashboardData();
    };

    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [loadDashboardData]);

  const statusLabel = (status) => {
    const s = String(status || '').toUpperCase();
    if (s === 'VERIFIED') return 'Paid';
    if (s === 'REJECTED') return 'Not Verified';
    if (s === 'REFUNDED') return 'Not Verified';
    return 'Pending';
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Paid':
        return 'badge-paid';
      case 'Pending':
        return 'badge-pending';
      case 'Not Verified':
        return 'badge-failed';
      default:
        return '';
    }
  };

  const toCurrency = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`;

  const stats = useMemo(() => {
    const totalStudents = new Set(feeRecords.map((r) => r.studentId).filter(Boolean)).size;
    const totalMonthlyFees = feeRecords.reduce((sum, r) => sum + Number(r.totalFee || 0), 0);
    const feesCollected = payments
      .filter((p) => String(p.status || '').toUpperCase() === 'VERIFIED')
      .reduce((sum, p) => sum + Number(p.amount || 0), 0);
    const pendingFees = feeRecords.reduce((sum, r) => sum + Number(r.balance || 0), 0);
    const pendingVerification = payments
      .filter((p) => String(p.status || '').toUpperCase() === 'PENDING')
      .reduce((sum, p) => sum + Number(p.amount || 0), 0);

    const completionBase = totalMonthlyFees > 0 ? totalMonthlyFees : feesCollected + pendingFees;
    const completionPercent = completionBase > 0 ? Math.round((feesCollected / completionBase) * 100) : 0;

    return [
      { label: 'Total Students', value: String(totalStudents), sub: `${feeRecords.length} fee records`, icon: Users, color: '#1F3C88' },
      { label: 'Total Monthly Fees', value: toCurrency(totalMonthlyFees), sub: 'Projected from current records', icon: CreditCard, color: '#2BBBAD' },
      {
        label: 'Fees Collected',
        value: toCurrency(feesCollected),
        sub: `${completionPercent}% completion`,
        icon: CheckCircle,
        color: '#10B981',
      },
      { label: 'Pending Fees', value: toCurrency(pendingFees), sub: 'Outstanding student balances', icon: Clock, color: '#F59E0B' },
      { label: 'Pending Verification', value: toCurrency(pendingVerification), sub: 'Submitted by students', icon: AlertTriangle, color: '#EF4444' },
    ];
  }, [feeRecords, payments]);

  const monthlyCollectionData = useMemo(() => {
    const monthFmt = new Intl.DateTimeFormat('en', { month: 'short' });
    const now = new Date();
    const months = [];

    for (let i = 5; i >= 0; i -= 1) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      months.push({ month: monthFmt.format(d), key, collected: 0 });
    }

    const index = new Map(months.map((m, i) => [m.key, i]));

    payments.forEach((p) => {
      if (String(p.status || '').toUpperCase() !== 'VERIFIED') {
        return;
      }

      const rawDate = p.paymentDate || (p.createdAt ? p.createdAt.split(' ')[0] : null);
      if (!rawDate) {
        return;
      }

      const dt = new Date(rawDate);
      if (Number.isNaN(dt.getTime())) {
        return;
      }

      const key = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}`;
      const idx = index.get(key);
      if (idx !== undefined) {
        months[idx].collected += Number(p.amount || 0);
      }
    });

    return months;
  }, [payments]);

  const recentPayments = useMemo(() => payments.slice(0, 5), [payments]);
  const feeRecordById = useMemo(() => {
    const map = new Map();
    feeRecords.forEach((record) => {
      map.set(record.feeId, record);
    });
    return map;
  }, [feeRecords]);

  const getMethodIcon = (method) => {
    if (String(method || '').toUpperCase().includes('CASH')) return <Banknote size={14} />;
    return <Globe size={14} />;
  };

  const getInitials = (name) => String(name || 'NA').split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

  const avatarColors = ['#1F3C88', '#2BBBAD', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  const getVerifiedGuardReason = (payment) => {
    const current = String(payment?.status || '').toUpperCase();
    if (current !== 'PENDING') {
      return 'Only pending payments can be marked as verified.';
    }

    const linkedRecord = feeRecordById.get(payment?.feeId);
    if (!linkedRecord) {
      return '';
    }

    const remaining = Number(linkedRecord.balance || 0);
    const amount = Number(payment?.amount || 0);
    if (remaining <= 0) {
      return 'Fee is already fully paid for this student.';
    }
    if (amount > remaining) {
      return `Payment amount exceeds remaining balance (${toCurrency(remaining)}).`;
    }
    return '';
  };

  const getNotVerifiedGuardReason = (payment) => {
    const current = String(payment?.status || '').toUpperCase();
    return current === 'PENDING' ? '' : 'Only pending payments can be marked as not verified.';
  };

  const getActionGuardReason = (payment, targetStatus) => {
    if (targetStatus === 'VERIFIED') {
      return getVerifiedGuardReason(payment);
    }
    if (targetStatus === 'REJECTED') {
      return getNotVerifiedGuardReason(payment);
    }
    return 'Invalid action.';
  };

  const handlePaymentStatusChange = async (payment, newStatus) => {
    const guardReason = getActionGuardReason(payment, newStatus);
    if (guardReason) {
      setUpdateError(guardReason);
      return;
    }

    const paymentId = payment?.paymentId;
    if (!paymentId) {
      setUpdateError('Payment ID is missing. Please refresh and try again.');
      return;
    }

    setUpdatingPaymentId(paymentId);
    setUpdateError('');

    try {
      const notes = `Payment verification updated to ${newStatus}`;

      if (newStatus === 'VERIFIED') {
        await adminFeesApi.verifyPayment(paymentId, notes);
      } else if (newStatus === 'REJECTED') {
        await adminFeesApi.rejectPayment(paymentId, notes);
      }

      await loadDashboardData();
      setActiveDropdown(null);
    } catch (e) {
      console.error('Failed to update payment status:', e);
      const backendMessage =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        '';

      if (backendMessage?.toLowerCase().includes('only pending payments')) {
        await loadDashboardData();
        setUpdateError('This payment was already processed. Dashboard refreshed with latest status.');
      } else {
        const errorMessage = backendMessage || e?.message || 'Unable to update payment status.';
        setUpdateError(errorMessage);
      }
    } finally {
      setUpdatingPaymentId(null);
    }
  };

  const isActionDisabled = (payment, targetStatus) => {
    return Boolean(getActionGuardReason(payment, targetStatus));
  };

  if (loading) {
    return (
      <div className="fees-dashboard-page">
        <div className="chart-card">Loading fee dashboard...</div>
      </div>
    );
  }

  return (
    <div className="fees-dashboard-page">
      <div className="page-header">
        <div className="page-header-left">
          <div className="breadcrumb">
            <span>Dashboard</span><span className="breadcrumb-sep">›</span><span className="breadcrumb-active">Fees</span>
          </div>
          <h1 className="page-title">Fees Management</h1>
        </div>
        <div className="page-header-actions">
          <button className="btn-secondary" onClick={() => navigate('/admin/fees/history')}>
            <FileText size={16} /> Generate Invoice
          </button>
          <button className="btn-primary" onClick={() => navigate('/admin/fees/structure')}>
            <Plus size={16} /> Fee Structure
          </button>
        </div>
      </div>

      {error && (
        <div className="chart-card" style={{ color: '#b91c1c' }}>
          {error}
        </div>
      )}

      {updateError && (
        <div className="chart-card" style={{ color: '#b91c1c' }}>
          {updateError}
        </div>
      )}

      <div className="stats-grid">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div className="stat-card" key={s.label}>
              <div className="stat-card-top">
                <div className="stat-icon" style={{ background: `${s.color}15`, color: s.color }}>
                  <Icon size={22} />
                </div>
                <button className="stat-arrow"><ArrowUpRight size={16} /></button>
              </div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
              <div className="stat-sub">{s.sub}</div>
            </div>
          );
        })}
      </div>

      <div className="chart-card">
        <div className="chart-header">
          <div>
            <h2 className="chart-title">Monthly Fee Collection</h2>
            <p className="chart-sub">Overview of revenue generated from student hostel fees</p>
          </div>
          <button className="btn-secondary"><FileText size={14} /> Export Report</button>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={monthlyCollectionData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#6B7280' }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} tickFormatter={(v) => v.toLocaleString()} />
            <Tooltip
              formatter={(value) => [`₹${Number(value || 0).toLocaleString('en-IN')}`, 'Collected']}
              contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
            />
            <Legend iconType="circle" iconSize={10} wrapperStyle={{ paddingTop: '16px', fontSize: '13px' }} />
            <Bar dataKey="collected" name="Collected Fees" fill="#1F3C88" radius={[4, 4, 0, 0]} maxBarSize={60} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="table-card">
        <div className="table-header">
          <div>
            <h2 className="chart-title">Recent Payments</h2>
            <p className="chart-sub">The latest transactions across all hostels</p>
          </div>
          <button className="btn-link" onClick={() => navigate('/admin/fees/history')}>
            View All Payments
          </button>
        </div>
        <div className="table-responsive" ref={dropdownRef}>
          <table className="fees-table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Room Number</th>
                <th>Amount Paid</th>
                <th>Method</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentPayments.map((p, i) => {
                const name = p.studentName || `Student #${p.studentId || 'N/A'}`;
                const room = p.roomNo || '-';
                const amount = Number(p.amount || 0);
                const method = p.paymentMethod || '-';
                const date = p.paymentDate || (p.createdAt ? p.createdAt.split(' ')[0] : '-');
                const status = statusLabel(p.status);
                const actionKey = p.paymentId || `${p.studentId || 'student'}-${i}`;

                return (
                  <tr key={actionKey}>
                    <td>
                      <div className="student-cell">
                        <div className="avatar-circle" style={{ background: `${avatarColors[i % avatarColors.length]}20`, color: avatarColors[i % avatarColors.length] }}>
                          {getInitials(name)}
                        </div>
                        <span className="student-name">{name}</span>
                      </div>
                    </td>
                    <td><span className="room-badge">{room}</span></td>
                    <td className="amount-cell">₹{amount.toLocaleString('en-IN')}</td>
                    <td>
                      <div className="method-cell">
                        {getMethodIcon(method)}
                        <span>{method}</span>
                      </div>
                    </td>
                    <td>{date}</td>
                    <td><span className={`status-badge ${getStatusClass(status)}`}>{status}</span></td>
                    <td>
                      <div className="action-cell-wrap">
                        <button
                          className="action-more"
                          onClick={() => setActiveDropdown(activeDropdown === actionKey ? null : actionKey)}
                          disabled={updatingPaymentId === actionKey}
                          title="Change verification"
                        >
                          <MoreVertical size={16} />
                        </button>
                        {activeDropdown === actionKey && (
                          <div className="action-dropdown">
                            <button
                              className="dropdown-item dropdown-item-success"
                              onClick={() => handlePaymentStatusChange(p, 'VERIFIED')}
                              disabled={updatingPaymentId === actionKey || !p.paymentId || isActionDisabled(p, 'VERIFIED')}
                              title={getActionGuardReason(p, 'VERIFIED')}
                            >
                              Verified
                            </button>
                            <button
                              className="dropdown-item dropdown-item-danger"
                              onClick={() => handlePaymentStatusChange(p, 'REJECTED')}
                              disabled={updatingPaymentId === actionKey || !p.paymentId || isActionDisabled(p, 'REJECTED')}
                              title={getActionGuardReason(p, 'REJECTED')}
                            >
                              Not Verified
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FeesDashboard;