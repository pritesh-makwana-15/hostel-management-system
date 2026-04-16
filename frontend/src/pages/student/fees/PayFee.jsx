import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Smartphone, Building2, Banknote,
  Calendar, Hash, Upload, FileText, AlertCircle,
  CheckCircle, Clock, Info
} from 'lucide-react';
import { studentApi } from '../../../services/studentApi';
import { studentFeeApi } from '../../../services/adminFeeApi';
import '../../../styles/student/fees/pay-fee.css';

const today = new Date().toISOString().split('T')[0];

const METHODS = [
  { id: 'upi',  label: 'UPI Transfer',  icon: Smartphone },
  { id: 'bank', label: 'Bank Transfer', icon: Building2  },
  { id: 'cash', label: 'Cash Deposit',  icon: Banknote   },
];

const PayFee = () => {
  const navigate = useNavigate();

  const [method, setMethod]   = useState('upi');
  const [amount, setAmount]   = useState('');
  const [date, setDate]       = useState(today);
  const [txnId, setTxnId]     = useState('');
  const [notes, setNotes]     = useState('');
  const [file, setFile]       = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [loadingFee, setLoadingFee] = useState(true);
  const [feeError, setFeeError] = useState('');
  const [studentProfile, setStudentProfile] = useState(null);
  const [feeStructure, setFeeStructure] = useState(null);
  const [feeRecordSummary, setFeeRecordSummary] = useState(null);

  useEffect(() => {
    const loadFeeData = async () => {
      try {
        setLoadingFee(true);
        setFeeError('');

        const [profileResponse, feeResponse, feeRecordResponse] = await Promise.all([
          studentApi.getProfile(),
          studentFeeApi.getMyFee(),
          studentFeeApi.getMyRecord(),
        ]);

        setStudentProfile(profileResponse?.data?.data || null);
        setFeeStructure(feeResponse?.data?.data || null);
        setFeeRecordSummary(feeRecordResponse?.data?.data || null);
      } catch (error) {
        console.error('Error loading student fee data:', error);
        setFeeError(error?.response?.data?.message || 'Unable to load fee structure for your room and room type.');
      } finally {
        setLoadingFee(false);
      }
    };

    loadFeeData();
  }, []);

  const amountBreakdown = useMemo(() => {
    const monthly = Number(feeStructure?.monthlyFee || 0);
    const utilities = Number(feeStructure?.utilities || 0);
    const lateFee = Number(feeStructure?.lateFee || 0);
    const securityDeposit = Number(feeStructure?.securityDeposit || 0);
    const totalPayable = monthly + utilities + lateFee;

    return {
      monthly,
      utilities,
      lateFee,
      securityDeposit,
      totalPayable,
    };
  }, [feeStructure]);

  const outstandingAmount = Number(
    feeRecordSummary?.balance ?? amountBreakdown.totalPayable ?? 0
  );
  const isFullyPaid = outstandingAmount <= 0;

  const amountNumber = Number(amount || 0);
  const receiptStudentName = studentProfile?.name || 'Student';
  const receiptRoom = studentProfile?.roomNo || 'Not Assigned';
  const receiptBlock = feeStructure?.hostelBlock || studentProfile?.hostelBlock || 'Not Assigned';
  const receiptRoomType = feeStructure?.roomType || studentProfile?.roomType || 'Not Assigned';
  const payableAmountDisplay = `₹${outstandingAmount.toLocaleString('en-IN')}`;
  let feeStatusMessage = { text: 'No fee structure is mapped to your current room assignment.', color: '#b45309' };
  if (loadingFee) {
    feeStatusMessage = { text: 'Loading fee structure based on your room assignment...', color: undefined };
  } else if (feeError) {
    feeStatusMessage = { text: feeError, color: '#dc2626' };
  } else if (feeStructure) {
    feeStatusMessage = { text: `Showing fee structure for Block ${receiptBlock} and ${receiptRoomType} room.`, color: undefined };
  }

  const handleFileChange = (e) => {
    if (e.target.files[0]) setFile(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async () => {
    if (isFullyPaid) {
      setSubmitError('You have already paid fees for this cycle.');
      return;
    }

    const parsedAmount = Number(amount || outstandingAmount || 0);
    if (!parsedAmount || parsedAmount <= 0) {
      setSubmitError('Please enter a valid payment amount.');
      return;
    }

    if (parsedAmount > outstandingAmount) {
      setSubmitError(`Payment amount cannot exceed remaining balance of ₹${outstandingAmount.toLocaleString('en-IN')}.`);
      return;
    }

    setSubmitError('');
    setSubmitting(true);

    const generatedTxnId = txnId || `OFFLINE-${Date.now()}`;
    let apiMethod = 'CASH';
    if (method === 'upi') {
      apiMethod = 'UPI';
    } else if (method === 'bank') {
      apiMethod = 'BANK_TRANSFER';
    }
    const academicCycle = feeRecordSummary?.academicCycle;

    let paymentId = `RCP-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

    try {
      const payload = {
        amount: parsedAmount,
        paymentMethod: apiMethod,
        transactionId: generatedTxnId,
        proofFile: file?.name || null,
        paymentDate: date,
        notes,
      };

      if (academicCycle) {
        payload.academicCycle = academicCycle;
      }

      const response = await studentFeeApi.submitPaymentRequest(payload);
      paymentId = response?.data?.data?.paymentId || paymentId;
    } catch (error) {
      setSubmitError(error?.response?.data?.message || 'Unable to submit payment right now. Please try again.');
      setSubmitting(false);
      return;
    }

    setSubmitted(true);
    setSubmitting(false);
    setTimeout(() => {
      navigate(`/student/fees/receipt/${paymentId}`);
    }, 1500);
  };

  const selectedMethod = METHODS.find((m) => m.id === method);
  let submitButtonLabel = 'Submit Verification Request';
  if (submitted) {
    submitButtonLabel = 'Submitted!';
  } else if (submitting) {
    submitButtonLabel = 'Submitting...';
  }

  if (!loadingFee && !feeError && isFullyPaid) {
    return (
      <div className="pf-page">
        <div className="pf-breadcrumb">
          <button className="pf-back-btn" onClick={() => navigate('/student/fees')}>
            <ArrowLeft size={15} />
            Fee Details
          </button>
          <span className="pf-bc-sep">›</span>
          <span className="pf-bc-current">Payment Request (Offline)</span>
        </div>

        <div className="pf-header">
          <div>
            <h1 className="pf-title">Offline Payment Request</h1>
            <p className="pf-subtitle">You have already paid fees for this cycle.</p>
          </div>
        </div>

        <div className="pf-main-grid">
          <div className="pf-form-card">
            <h3 className="pf-section-title">Fees Already Paid</h3>
            <p className="pf-section-sub">
              Your payment is fully verified from admin side. No further payment request is required.
            </p>
            <div className="pf-form-footer" style={{ marginTop: 18 }}>
              <div className="pf-footer-actions">
                <button className="pf-btn-cancel" onClick={() => navigate('/student/fees/history')}>
                  View Payment History
                </button>
                <button className="pf-btn-submit" onClick={() => navigate('/student/fees')}>
                  Back to Fee Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pf-page">

      {/* ── Breadcrumb + Title ── */}
      <div className="pf-breadcrumb">
        <button className="pf-back-btn" onClick={() => navigate('/student/fees')}>
          <ArrowLeft size={15} />
          Fee Details
        </button>
        <span className="pf-bc-sep">›</span>
        <span className="pf-bc-current">Payment Request (Offline)</span>
      </div>

      <div className="pf-header">
        <div>
          <h1 className="pf-title">Offline Payment Request</h1>
          <p className="pf-subtitle">
            Paid manually via Cash or Bank Transfer? Submit a payment request for administrative verification and receipt generation.
          </p>
          <p className="pf-subtitle" style={feeStatusMessage.color ? { color: feeStatusMessage.color } : undefined}>
            {feeStatusMessage.text}
          </p>
        </div>
      </div>

      {/* ── Summary Cards ── */}
      <div className="pf-summary-row">
        <div className="pf-sum-card">
          <div className="pf-sum-icon"><Clock size={18} /></div>
          <div>
            <p className="pf-sum-label">Total Outstanding</p>
            <p className="pf-sum-value">{payableAmountDisplay}</p>
          </div>
        </div>
        <div className="pf-sum-card">
          <div className="pf-sum-icon pf-sum-icon--warn"><Calendar size={18} /></div>
          <div>
            <p className="pf-sum-label">Pending Verification</p>
            <p className="pf-sum-value">₹0.00</p>
          </div>
        </div>
        <div className="pf-sum-card pf-sum-card--active">
          <div className="pf-sum-icon pf-sum-icon--dark"><CheckCircle size={18} /></div>
          <div>
            <p className="pf-sum-label">Payable Amount</p>
            <p className="pf-sum-value">{payableAmountDisplay}</p>
          </div>
        </div>
      </div>

      {/* ── Main Grid ── */}
      <div className="pf-main-grid">

        {/* ── Form ── */}
        <div className="pf-form-card">
          <h3 className="pf-section-title">Payment Request Details</h3>
          <p className="pf-section-sub">Enter the details from your bank transaction or cash deposit slip.</p>

          {/* Method Selection */}
          <div className="pf-field-group">
            <p className="pf-label">Select Payment Method</p>
            <div className="pf-method-row">
              {METHODS.map((m) => {
                const Icon = m.icon;
                return (
                  <button
                    key={m.id}
                    className={`pf-method-btn ${method === m.id ? 'pf-method-active' : ''}`}
                    onClick={() => setMethod(m.id)}
                  >
                    <Icon size={16} />
                    {m.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Amount + Date */}
          <div className="pf-row-2">
            <div className="pf-field-group">
              <label className="pf-label" htmlFor="payment-amount">Payment Amount (₹)</label>
              <div className="pf-input-wrap">
                <span className="pf-input-icon">₹</span>
                <input
                  id="payment-amount"
                  type="number"
                  className="pf-input pf-input--icon"
                  placeholder="e.g. 8500"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <span className="pf-hint">Enter the exact amount mentioned on your receipt.</span>
              {feeStructure && (
                <span className="pf-hint">
                  Suggested payable amount: {payableAmountDisplay} (Monthly: ₹{amountBreakdown.monthly.toLocaleString('en-IN')}, Utilities: ₹{amountBreakdown.utilities.toLocaleString('en-IN')}, Late Fee: ₹{amountBreakdown.lateFee.toLocaleString('en-IN')})
                </span>
              )}
              {isFullyPaid && (
                <span className="pf-hint" style={{ color: '#16a34a' }}>
                  This fee cycle is fully paid. New payment submissions are disabled.
                </span>
              )}
            </div>
            <div className="pf-field-group">
              <label className="pf-label" htmlFor="payment-date">Payment Date</label>
              <div className="pf-input-wrap">
                <span className="pf-input-icon"><Calendar size={15} /></span>
                <input
                  id="payment-date"
                  type="date"
                  className="pf-input pf-input--icon"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <span className="pf-hint">Select the date on which the transaction was made.</span>
            </div>
          </div>

          {/* Transaction ID + Upload */}
          <div className="pf-row-2">
            <div className="pf-field-group">
              <label className="pf-label" htmlFor="transaction-id">Transaction / Reference ID</label>
              <div className="pf-input-wrap">
                <span className="pf-input-icon"><Hash size={15} /></span>
                <input
                  id="transaction-id"
                  type="text"
                  className="pf-input pf-input--icon"
                  placeholder="e.g. TXN982103321"
                  value={txnId}
                  onChange={(e) => setTxnId(e.target.value)}
                />
              </div>
              {method !== 'cash' && (
                <span className="pf-hint pf-hint--req">Mandatory for UPI and Bank Transfers.</span>
              )}
            </div>
            <div className="pf-field-group">
              <label className="pf-label" htmlFor="pf-file-input">Upload Payment Proof (Receipt/Screenshot)</label>
              <button
                type="button"
                className={`pf-upload-zone ${file ? 'pf-upload-filled' : ''}`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => document.getElementById('pf-file-input').click()}
              >
                <input
                  id="pf-file-input"
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
                {file ? (
                  <div className="pf-upload-filled-content">
                    <CheckCircle size={18} color="#22c55e" />
                    <span>{file.name}</span>
                  </div>
                ) : (
                  <>
                    <Upload size={18} />
                    <span>Click to browse or drag &amp; drop</span>
                    <span className="pf-upload-types">JPG / PNG / PDF</span>
                  </>
                )}
              </button>
              <span className="pf-hint">Max size: 5MB. Clear visuals only.</span>
            </div>
          </div>

          {/* Notes */}
          <div className="pf-field-group">
            <label className="pf-label" htmlFor="payment-notes">Internal Notes (Optional)</label>
            <textarea
              id="payment-notes"
              className="pf-textarea"
              rows={4}
              placeholder="Add any specific details like branch name, UPI app used, or payment reason..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {/* Footer */}
          <div className="pf-form-footer">
            <div className="pf-footer-warn">
              <AlertCircle size={14} />
              <em>Incomplete or incorrect details will lead to payment rejection.</em>
            </div>
            {submitError && <div className="pf-footer-warn" style={{ color: '#dc2626' }}>{submitError}</div>}
            <div className="pf-footer-actions">
              <button className="pf-btn-cancel" onClick={() => navigate('/student/fees')}>
                Cancel
              </button>
              <button
                className={`pf-btn-submit ${submitted ? 'pf-btn-submitted' : ''}`}
                onClick={handleSubmit}
                disabled={submitted || submitting || loadingFee || !studentProfile?.id || isFullyPaid || Number(amount || outstandingAmount || 0) <= 0}
              >
                {submitted ? <><CheckCircle size={15} /> {submitButtonLabel}</> : <>{submitButtonLabel}</>}
              </button>
            </div>
          </div>
        </div>

        {/* ── Live Preview ── */}
        <div className="pf-preview-col">
          <div className="pf-preview-card">
            <div className="pf-preview-tabs">
              <span className="pf-preview-tab pf-preview-tab-active">LIVE PREVIEW</span>
              <span className="pf-preview-tab-badge">Drafting</span>
            </div>

            <div className="pf-receipt-preview">
              <div className="pf-rp-icons">
                <div className="pf-rp-icon"><span>₹</span></div>
                <div className="pf-rp-icon pf-rp-icon--doc"><FileText size={18} /></div>
              </div>
              <h4 className="pf-rp-title">HMS FEE RECEIPT</h4>
              <p className="pf-rp-id">Receipt No: HMS-REC-2024-XXXX</p>

              <div className="pf-rp-divider" />

              <div className="pf-rp-row">
                <div>
                  <span className="pf-rp-label">STUDENT NAME</span>
                  <span className="pf-rp-val">{receiptStudentName}</span>
                </div>
                <div>
                  <span className="pf-rp-label">DATE ISSUED</span>
                  <span className="pf-rp-val">{date}</span>
                </div>
              </div>

              <div className="pf-rp-row">
                <div>
                  <span className="pf-rp-label">HOSTEL / ROOM</span>
                  <span className="pf-rp-val">{receiptBlock} / {receiptRoom}</span>
                </div>
                <div>
                  <span className="pf-rp-label">ROOM TYPE</span>
                  <span className="pf-rp-val">{receiptRoomType}</span>
                </div>
              </div>

              <div className="pf-rp-divider" />

              <div className="pf-rp-line">
                <span>Monthly Fee</span>
                <span className="pf-rp-fee">₹{amountBreakdown.monthly.toLocaleString('en-IN')}</span>
              </div>
              <div className="pf-rp-line">
                <span>Utilities</span>
                <span className="pf-rp-fee">₹{amountBreakdown.utilities.toLocaleString('en-IN')}</span>
              </div>
              <div className="pf-rp-line">
                <span>Late Fee</span>
                <span className="pf-rp-fee">₹{amountBreakdown.lateFee.toLocaleString('en-IN')}</span>
              </div>
              <div className="pf-rp-line">
                <span>Security Deposit</span>
                <span className="pf-rp-fee">₹{amountBreakdown.securityDeposit.toLocaleString('en-IN')}</span>
              </div>
              <div className="pf-rp-line">
                <span>Payment Method</span>
                <span className="pf-rp-fee">{selectedMethod?.label.split(' ')[0]}</span>
              </div>

              <div className="pf-rp-divider" />

              <div className="pf-rp-total-row">
                <span>Total Amount Paid</span>
                <span className="pf-rp-total-val">{amount ? `₹${amountNumber.toLocaleString('en-IN')}` : payableAmountDisplay}</span>
              </div>

              <div className="pf-rp-note">
                This is a digital preview of your offline payment submission. The actual receipt will be verified by the accounts office within 24-48 hours.
              </div>
            </div>
          </div>

          {/* Pro Tip */}
          <div className="pf-tip-card">
            <div className="pf-tip-header"><Info size={15} /> Pro Tip</div>
            <p className="pf-tip-text">
              Ensure the uploaded receipt clearly shows the Transaction ID and Date for faster verification.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PayFee;