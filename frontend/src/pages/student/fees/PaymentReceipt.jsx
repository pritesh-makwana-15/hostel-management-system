import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, Printer, Download, CheckCircle, Clock,
  User, MapPin, Calendar, CreditCard, Hash, Shield,
  ExternalLink, FileText, Eye
} from 'lucide-react';
import { studentApi } from '../../../services/studentApi';
import { studentFeeApi } from '../../../services/adminFeeApi';
import '../../../styles/student/fees/payment-receipt.css';

const fmt = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

const mapStatus = (status) => {
  const normalized = String(status || '').toUpperCase();
  if (normalized === 'VERIFIED') return 'Paid';
  if (normalized === 'REJECTED') return 'Failed';
  return 'Pending';
};

const mapMethod = (method) => {
  const normalized = String(method || '').toUpperCase();
  if (normalized === 'BANK_TRANSFER') return 'Bank Transfer';
  if (normalized === 'UPI') return 'UPI';
  if (normalized === 'CASH') return 'Cash';
  return method || '-';
};

const PaymentReceipt = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [studentProfile, setStudentProfile] = useState(null);
  const [receipt, setReceipt] = useState(null);

  useEffect(() => {
    const loadReceipt = async () => {
      try {
        setLoading(true);
        const [profileResponse, receiptResponse, summaryResponse] = await Promise.all([
          studentApi.getProfile(),
          studentFeeApi.getPaymentById(id),
          studentFeeApi.getMyRecord(),
        ]);

        const profile = profileResponse?.data?.data || null;
        setStudentProfile(profile);

        const payment = receiptResponse?.data?.data || null;
        const summary = summaryResponse?.data?.data || null;

        const studentReceipt = payment
          ? {
              id: payment.paymentId,
              amount: payment.amount,
              status: mapStatus(payment.status),
              studentName: payment.studentName || profile?.name,
              studentId: payment.enrollmentNo || profile?.enrollmentNo,
              room: `${payment.hostelBlock || '-'}, Room ${payment.roomNo || '-'}`,
              date: payment.paymentDate,
              method: mapMethod(payment.paymentMethod),
              txnId: payment.transactionId,
              generatedOn: payment.createdAt,
              feeBreakdown: {
                monthly: Number(summary?.monthlyFee || 0),
                utilities: Number(summary?.utilities || 0),
                lateFee: Number(summary?.lateFee || 0),
                securityDeposit: Number(summary?.securityDeposit || 0),
              },
            }
          : null;

        setReceipt(studentReceipt);
      } catch (error) {
        console.error('Error loading student receipt:', error);
        setReceipt(null);
      } finally {
        setLoading(false);
      }
    };

    loadReceipt();
  }, [id]);

  const active = (receipt?.status || 'Pending') === 'Paid';

  const breakdown = useMemo(() => {
    const source = receipt?.feeBreakdown || {};
    return {
      monthly: Number(source.monthly || 0),
      utilities: Number(source.utilities || 0),
      lateFee: Number(source.lateFee || 0),
      securityDeposit: Number(source.securityDeposit || 0),
    };
  }, [receipt]);

  if (loading) {
    return (
      <div className="pr-page">
        <div className="pr-receipt-wrap">
          <div className="pr-receipt-card">
            <p>Loading your receipt...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!receipt) {
    return (
      <div className="pr-page">
        <div className="pr-receipt-wrap">
          <div className="pr-receipt-card">
            <h2 className="pr-rec-title">Receipt Not Found</h2>
            <p className="pr-rec-sub">
              This receipt does not belong to your account or does not exist.
            </p>
            <div className="pr-bottom-cards">
              <button className="pr-nav-card" onClick={() => navigate('/student/fees/history')}>
                <div className="pr-nav-card-icon"><ExternalLink size={18} /></div>
                <div>
                  <p className="pr-nav-card-title">Go to Payment History</p>
                  <p className="pr-nav-card-sub">View receipts submitted by your account</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pr-page">
      <div className="pr-topbar">
        <button className="pr-back-btn" onClick={() => navigate('/student/fees/history')}>
          <ArrowLeft size={15} /> Back to Payment History
        </button>
        <div className="pr-topbar-right">
          <span className="pr-gen-date">Receipt generated on {receipt.generatedOn || '-'}</span>
          <button className="pr-icon-btn"><Printer size={15} /> Print</button>
          <button className="pr-icon-btn pr-icon-btn--primary"><Download size={15} /> Download PDF</button>
        </div>
      </div>

      <div className="pr-receipt-wrap">
        <div className="pr-receipt-card">
          <div className="pr-rec-header">
            <div className="pr-rec-header-left">
              {active ? (
                <div className="pr-rec-icon-wrap">
                  <FileText size={20} color="#fff" />
                </div>
              ) : null}
              <div>
                <h2 className="pr-rec-title">Payment Receipt</h2>
                <p className="pr-rec-sub">Hostel Management System – {active ? 'Official Document' : 'Fee Acknowledgement'}</p>
              </div>
            </div>
            <div className="pr-rec-header-right">
              {active ? (
                <>
                  <div className="pr-verified-badge">
                    <CheckCircle size={14} /> VERIFIED
                  </div>
                  <div className="pr-rec-actions">
                    <button className="pr-icon-btn"><Printer size={14} /> Print</button>
                    <button className="pr-icon-btn pr-icon-btn--primary"><Download size={14} /> Download PDF</button>
                  </div>
                </>
              ) : (
                <div className="pr-pending-badge">
                  <Clock size={14} /> Pending Verification
                </div>
              )}
              {!active && <p className="pr-rec-id">ID: {receipt.id}</p>}
            </div>
          </div>

          <div className="pr-amount-section">
            <p className="pr-amount-label">{active ? 'TOTAL AMOUNT PAID' : 'AMOUNT ACKNOWLEDGEMENT'}</p>
            <p className="pr-amount-value">{fmt(receipt.amount)}.00</p>
            {active && <p className="pr-amount-words">Amount received from student account only</p>}
          </div>

          <div className="pr-info-grid">
            <div className="pr-info-section">
              <h4 className="pr-info-section-title">
                <span className="pr-info-accent" aria-hidden="true" />{' '}
                <span>STUDENT INFORMATION</span>
              </h4>
              <div className="pr-info-rows">
                <div className="pr-info-row">
                  <div className="pr-info-key"><User size={13} /> STUDENT NAME</div>
                  <span className="pr-info-val">{receipt.studentName || studentProfile?.name || '-'}</span>
                </div>
                <div className="pr-info-row">
                  <div className="pr-info-key"><Hash size={13} /> STUDENT ID</div>
                  <span className="pr-info-val">{receipt.studentId || studentProfile?.enrollmentNo || '-'}</span>
                </div>
                <div className="pr-info-row">
                  <div className="pr-info-key"><MapPin size={13} /> ROOM NUMBER</div>
                  <span className="pr-info-val pr-info-val--bold">{receipt.room || '-'}</span>
                </div>
              </div>
            </div>
            <div className="pr-info-section">
              <h4 className="pr-info-section-title">
                <span className="pr-info-accent" aria-hidden="true" />{' '}
                <span>TRANSACTION DETAILS</span>
              </h4>
              <div className="pr-info-rows">
                <div className="pr-info-row">
                  <div className="pr-info-key"><Calendar size={13} /> PAYMENT DATE</div>
                  <span className="pr-info-val">{receipt.date || '-'}</span>
                </div>
                <div className="pr-info-row">
                  <div className="pr-info-key"><CreditCard size={13} /> PAYMENT METHOD</div>
                  <span className="pr-info-val">{receipt.method || '-'}</span>
                </div>
                <div className="pr-info-row">
                  <div className="pr-info-key"><Hash size={13} /> TRANSACTION ID</div>
                  <span className="pr-info-val pr-info-val--mono">{receipt.txnId || '-'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pr-info-grid">
            <div className="pr-info-section">
              <h4 className="pr-info-section-title">
                <span className="pr-info-accent" aria-hidden="true" />{' '}
                <span>FEE BREAKDOWN</span>
              </h4>
              <div className="pr-info-rows">
                <div className="pr-info-row"><div className="pr-info-key">MONTHLY FEE</div><span className="pr-info-val">{fmt(breakdown.monthly)}</span></div>
                <div className="pr-info-row"><div className="pr-info-key">UTILITIES</div><span className="pr-info-val">{fmt(breakdown.utilities)}</span></div>
                <div className="pr-info-row"><div className="pr-info-key">LATE FEE</div><span className="pr-info-val">{fmt(breakdown.lateFee)}</span></div>
                <div className="pr-info-row"><div className="pr-info-key">SECURITY DEPOSIT</div><span className="pr-info-val">{fmt(breakdown.securityDeposit)}</span></div>
              </div>
            </div>
          </div>

          {active && (
            <div className="pr-footer-row">
              <div>
                <p className="pr-rec-id-label">RECEIPT IDENTIFIER</p>
                <div className="pr-rec-id-chip">{receipt.id}</div>
              </div>
              <div className="pr-digital-sig">
                <Shield size={14} />
                <div>
                  <span className="pr-sig-label">DIGITAL VERIFICATION</span>
                  <span className="pr-sig-val">Signed by HMS Financial System</span>
                </div>
              </div>
            </div>
          )}

          {!active && (
            <div className="pr-verification-note">
              <Clock size={15} />
              <div>
                <p className="pr-vn-title">Verification in Progress</p>
                <p className="pr-vn-msg">
                  This receipt is created from your payment submission and is visible only to your student account.
                </p>
              </div>
            </div>
          )}

          {active && (
            <div className="pr-legal-note">
              This is a computer-generated receipt and does not require a physical signature.
            </div>
          )}

          {!active && (
            <div className="pr-gen-footer">
              <div>
                <span className="pr-gen-label">GENERATED ON</span>
                <span className="pr-gen-val">{receipt.generatedOn || '-'}</span>
              </div>
              <span className="pr-system-label">SYSTEM GENERATED ACKNOWLEDGEMENT</span>
            </div>
          )}
        </div>

        {active ? (
          <div className="pr-bottom-actions">
            <button className="pr-bottom-btn" onClick={() => navigate('/student/fees/history')}>
              <Shield size={16} /> View Verification Log
            </button>
            <button className="pr-bottom-btn">
              <Download size={16} /> Download CSV Statement
            </button>
          </div>
        ) : (
          <div className="pr-bottom-cards">
            <button className="pr-nav-card" onClick={() => navigate('/student/fees')}>
              <div className="pr-nav-card-icon"><ExternalLink size={18} /></div>
              <div>
                <p className="pr-nav-card-title">Go to Fee Dashboard</p>
                <p className="pr-nav-card-sub">Review your pending dues and breakdown</p>
              </div>
            </button>
            <button className="pr-nav-card">
              <div className="pr-nav-card-icon"><Eye size={18} /></div>
              <div>
                <p className="pr-nav-card-title">Track Verification</p>
                <p className="pr-nav-card-sub">Monitor the status of your transaction</p>
              </div>
            </button>
          </div>
        )}

        {!active && (
          <p className="pr-contact-note">
            "Need immediate assistance? Please contact the hostel warden desk at +91 98765-43210"
          </p>
        )}
      </div>
    </div>
  );
};

export default PaymentReceipt;
