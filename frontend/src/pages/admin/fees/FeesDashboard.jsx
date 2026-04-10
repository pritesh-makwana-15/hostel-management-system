import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, CreditCard, CheckCircle, Clock, AlertTriangle,
  ArrowUpRight, FileText, Plus, MoreVertical, CreditCard as CardIcon,
  Banknote, Globe
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { recentPayments, monthlyCollectionData } from '../../../data/feesData';
import '../../../styles/admin/fees/feesDashboard.css';

const FeesDashboard = () => {
  const navigate = useNavigate();

  const stats = [
    { label: 'Total Students',   value: '1,240',   sub: '+12% from last month', icon: Users,         color: '#1F3C88' },
    { label: 'Total Monthly Fees', value: '₹150,000', sub: 'Projected Revenue',  icon: CreditCard,    color: '#2BBBAD' },
    { label: 'Fees Collected',   value: '₹132,450', sub: '88% Completion',       icon: CheckCircle,   color: '#10B981' },
    { label: 'Pending Fees',     value: '₹14,200',  sub: '142 Students',         icon: Clock,         color: '#F59E0B' },
    { label: 'Overdue Fees',     value: '₹3,350',   sub: 'Action Required',      icon: AlertTriangle, color: '#EF4444' },
  ];

  const getStatusClass = (status) => {
    switch (status) {
      case 'Paid':    return 'badge-paid';
      case 'Pending': return 'badge-pending';
      case 'Failed':  return 'badge-failed';
      default:        return '';
    }
  };

  const getMethodIcon = (method) => {
    if (method === 'Cash') return <Banknote size={14} />;
    return <Globe size={14} />;
  };

  const getInitials = (name) => name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  const avatarColors = ['#1F3C88', '#2BBBAD', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  return (
    <div className="fees-dashboard-page">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-left">
          <div className="breadcrumb">
            <span>Dashboard</span><span className="breadcrumb-sep">›</span><span className="breadcrumb-active">Fees</span>
          </div>
          <h1 className="page-title">Fees Management</h1>
        </div>
        <div className="page-header-actions">
          <button className="btn-secondary" onClick={() => navigate('/admin/fees/generate-invoice')}>
            <FileText size={16} /> Generate Invoice
          </button>
          <button className="btn-primary" onClick={() => navigate('/admin/fees/structure')}>
            <Plus size={16} /> Fee Structure
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div className="stat-card" key={i}>
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

      {/* Chart */}
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
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} tickFormatter={v => v.toLocaleString()} />
            <Tooltip
              formatter={(value) => [`$${value.toLocaleString()}`, 'Collected']}
              contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
            />
            <Legend iconType="circle" iconSize={10} wrapperStyle={{ paddingTop: '16px', fontSize: '13px' }} />
            <Bar dataKey="collected" name="Collected Fees" fill="#1F3C88" radius={[4, 4, 0, 0]} maxBarSize={60} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Payments */}
      <div className="table-card">
        <div className="table-header">
          <div>
            <h2 className="chart-title">Recent Payments</h2>
            <p className="chart-sub">The latest transactions across all hostels</p>
          </div>
          <button className="btn-link" onClick={() => navigate('/admin/fees/payment-history')}>
            View All Payments
          </button>
        </div>
        <div className="table-responsive">
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
              {recentPayments.map((p, i) => (
                <tr key={i}>
                  <td>
                    <div className="student-cell">
                      <div className="avatar-circle" style={{ background: `${avatarColors[i % avatarColors.length]}20`, color: avatarColors[i % avatarColors.length] }}>
                        {getInitials(p.name)}
                      </div>
                      <span className="student-name">{p.name}</span>
                    </div>
                  </td>
                  <td><span className="room-badge">{p.room}</span></td>
                  <td className="amount-cell">${p.amount.toLocaleString()}</td>
                  <td>
                    <div className="method-cell">
                      {getMethodIcon(p.method)}
                      <span>{p.method}</span>
                    </div>
                  </td>
                  <td>{p.date}</td>
                  <td><span className={`status-badge ${getStatusClass(p.status)}`}>{p.status}</span></td>
                  <td><button className="action-more"><MoreVertical size={16} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FeesDashboard;