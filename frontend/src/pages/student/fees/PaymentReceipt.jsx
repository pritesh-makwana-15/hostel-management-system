import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, Printer, Download, CheckCircle, Clock,
  User, MapPin, Calendar, CreditCard, Hash, Shield,
  ExternalLink, FileText, Eye
} from 'lucide-react';
import '../../../styles/student/fees/payment-receipt.css';

// ── Mock receipt data keyed by id ─────────────────────────────
const receipts = {
  'RCP-2024-99021': {
    status: 'pending',
    receiptId: 'RCP-2024-99021',
    amount: 12500,
    amountWords: 'Twelve Thousand Five Hundred Rupees Only',
    student: { name: 'Alex Johnson', id: 'HMS-2024-089', room: 'Block B, Room 101' },
    transaction: { date: 'October 24, 2023', method: 'UPI Transfer (PhonePe)', txnId: 'TXN998211029472' },
    generatedOn: new Date().toLocaleString('en-IN'),
  },
  'RCPT-88291': {
    status: 'verified',
    receiptId: 'RCP-2024-04-102',
    amount: 8500,
    amountWords: 'Eight Thousand Five Hundred Rupees Only',
    student: { name: 'Alex Johnson', id: 'HMS-2024-089', room: 'B-Block, Room 304 (Sharing)' },
    transaction: { date: 'April 20, 2024, 14:30 PM', method: 'UPI (Google Pay)', txnId: '829100445522' },
    generatedOn: 'April 20, 2024 at 14:30:12',
  },
};

// Fallback for any unknown id
const defaultReceipt = {
  status: 'verified',
  receiptId: 'RCP-2024-00001',
  amount: 12500,
  amountWords: 'Twelve Thousand Five Hundred Rupees Only',
  student: { name: 'Alex Johnson', id: 'HMS-2024-089', room: 'Block B, Room 101' },
  transaction: { date: 'October 02, 2024', method: 'UPI (GPay)', txnId: 'TXN123456789' },
  generatedOn: new Date().toLocaleString('en-IN'),
};

const fmt = (n) => `₹${Number(n).toLocaleString('en-IN')}`;

const PaymentReceipt = () => {
  const navigate = useNavigate();
  const { id }   = useParams();

  const receipt = receipts[id] || defaultReceipt;
  const isVerified = receipt.status === 'verified';

  // Demo toggle
  const [demoStatus, setDemoStatus] = useState(receipt.status);
  const activeReceipt = { ...receipt, status: demoStatus };
  const active = demoStatus === 'verified';

  return (
    <div className="pr-page">

      {/* ── Top Bar ── */}
      <div className="pr-topbar">
        <button className="pr-back-btn" onClick={() => navigate('/student/fees/history')}>
          <ArrowLeft size={15} /> Back to Payment History
        </button>
        <div className="pr-topbar-right">
          <span className="pr-gen-date">Receipt generated on {activeReceipt.generatedOn}</span>
          <button className="pr-icon-btn"><Printer size={15} /> Print</button>
          <button className="pr-icon-btn pr-icon-btn--primary"><Download size={15} /> Download PDF</button>
        </div>
      </div>

      {/* ── Demo Toggle ── */}
      <div className="pr-demo-bar">
        <span className="pr-demo-label">Preview State:</span>
        <button
          className={`pr-demo-btn ${demoStatus === 'pending' ? 'pr-demo-active' : ''}`}
          onClick={() => setDemoStatus('pending')}
        >Pending</button>
        <button
          className={`pr-demo-btn ${demoStatus === 'verified' ? 'pr-demo-active' : ''}`}
          onClick={() => setDemoStatus('verified')}
        >Verified</button>
      </div>

      {/* ── Receipt Card ── */}
      <div className="pr-receipt-wrap">
        <div className="pr-receipt-card">

          {/* Header */}
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
              {!active && <p className="pr-rec-id">ID: {activeReceipt.receiptId}</p>}
            </div>
          </div>

          {/* Amount Highlight */}
          <div className="pr-amount-section">
            <p className="pr-amount-label">{active ? 'TOTAL AMOUNT PAID' : 'AMOUNT ACKNOWLEDGEMENT'}</p>
            <p className="pr-amount-value">{fmt(activeReceipt.amount)}.00</p>
            {active && <p className="pr-amount-words">{activeReceipt.amountWords}</p>}
          </div>

          {/* Info Grid */}
          {active ? (
            <div className="pr-info-grid">
              <div className="pr-info-section">
                <h4 className="pr-info-section-title">
                  <span className="pr-info-accent" />
                  STUDENT INFORMATION
                </h4>
                <div className="pr-info-rows">
                  <div className="pr-info-row">
                    <div className="pr-info-key"><User size={13} /> STUDENT NAME</div>
                    <span className="pr-info-val">{activeReceipt.student.name}</span>
                  </div>
                  <div className="pr-info-row">
                    <div className="pr-info-key"><Hash size={13} /> STUDENT ID</div>
                    <span className="pr-info-val">{activeReceipt.student.id}</span>
                  </div>
                  <div className="pr-info-row">
                    <div className="pr-info-key"><MapPin size={13} /> ROOM NUMBER</div>
                    <span className="pr-info-val pr-info-val--bold">{activeReceipt.student.room}</span>
                  </div>
                </div>
              </div>
              <div className="pr-info-section">
                <h4 className="pr-info-section-title">
                  <span className="pr-info-accent" />
                  TRANSACTION DETAILS
                </h4>
                <div className="pr-info-rows">
                  <div className="pr-info-row">
                    <div className="pr-info-key"><Calendar size={13} /> PAYMENT DATE</div>
                    <span className="pr-info-val">{activeReceipt.transaction.date}</span>
                  </div>
                  <div className="pr-info-row">
                    <div className="pr-info-key"><CreditCard size={13} /> PAYMENT METHOD</div>
                    <span className="pr-info-val">{activeReceipt.transaction.method}</span>
                  </div>
                  <div className="pr-info-row">
                    <div className="pr-info-key"><Hash size={13} /> TRANSACTION ID</div>
                    <span className="pr-info-val pr-info-val--mono">{activeReceipt.transaction.txnId}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="pr-detail-simple">
              <div className="pr-detail-row">
                <div className="pr-detail-cell">
                  <User size={14} />
                  <div>
                    <span className="pr-detail-label">STUDENT NAME</span>
                    <span className="pr-detail-val">{activeReceipt.student.name}</span>
                  </div>
                </div>
                <div className="pr-detail-cell">
                  <MapPin size={14} />
                  <div>
                    <span className="pr-detail-label">ROOM NUMBER</span>
                    <span className="pr-detail-val">{activeReceipt.student.room}</span>
                  </div>
                </div>
              </div>
              <div className="pr-detail-row">
                <div className="pr-detail-cell">
                  <Calendar size={14} />
                  <div>
                    <span className="pr-detail-label">PAYMENT DATE</span>
                    <span className="pr-detail-val">{activeReceipt.transaction.date}</span>
                  </div>
                </div>
                <div className="pr-detail-cell">
                  <CreditCard size={14} />
                  <div>
                    <span className="pr-detail-label">PAYMENT METHOD</span>
                    <span className="pr-detail-val">{activeReceipt.transaction.method}</span>
                  </div>
                </div>
              </div>
              <div className="pr-detail-row">
                <div className="pr-detail-cell">
                  <Hash size={14} />
                  <div>
                    <span className="pr-detail-label">TRANSACTION ID</span>
                    <span className="pr-detail-val pr-detail-val--mono">{activeReceipt.transaction.txnId}</span>
                  </div>
                </div>
                <div className="pr-detail-cell">
                  <Shield size={14} />
                  <div>
                    <span className="pr-detail-label">STUDENT ID</span>
                    <span className="pr-detail-val">{activeReceipt.student.id}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Receipt ID + Digital Sig (verified) */}
          {active && (
            <div className="pr-footer-row">
              <div>
                <p className="pr-rec-id-label">RECEIPT IDENTIFIER</p>
                <div className="pr-rec-id-chip">{activeReceipt.receiptId}</div>
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

          {/* Pending Verification Note */}
          {!active && (
            <div className="pr-verification-note">
              <Clock size={15} />
              <div>
                <p className="pr-vn-title">Verification in Progress</p>
                <p className="pr-vn-msg">
                  Your offline payment proof has been submitted successfully. It usually takes 24-48 working hours for the accounts department to reconcile and verify the transaction. You will be notified once the status is updated to 'Verified'.
                </p>
              </div>
            </div>
          )}

          {/* Verified: Legal note */}
          {active && (
            <div className="pr-legal-note">
              This is a computer-generated receipt and does not require a physical signature. For any discrepancies, please contact the Hostel Warden's office or the Financial Support Desk with the Transaction ID provided above.
            </div>
          )}

          {/* Generated on (pending only) */}
          {!active && (
            <div className="pr-gen-footer">
              <div>
                <span className="pr-gen-label">GENERATED ON</span>
                <span className="pr-gen-val">{activeReceipt.generatedOn}</span>
              </div>
              <span className="pr-system-label">SYSTEM GENERATED ACKNOWLEDGEMENT</span>
            </div>
          )}
        </div>

        {/* ── Bottom Actions ── */}
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
                <p className="pr-nav-card-sub">Monitor the status of this transaction</p>
              </div>
            </button>
          </div>
        )}

        {/* Contact note (pending) */}
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