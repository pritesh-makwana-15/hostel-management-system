import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Smartphone, Building2, Banknote,
  Calendar, Hash, Upload, FileText, AlertCircle,
  CheckCircle, Clock, Info
} from 'lucide-react';
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

  const handleFileChange = (e) => {
    if (e.target.files[0]) setFile(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => {
      navigate('/student/fees/receipt/RCP-2024-99021');
    }, 1500);
  };

  const selectedMethod = METHODS.find((m) => m.id === method);

  return (
    <div className="pf-page">

      {/* ── Breadcrumb + Title ── */}
      <div className="pf-breadcrumb">
        <button className="pf-back-btn" onClick={() => navigate('/student/fees')}>
          <ArrowLeft size={15} />
          Fee Details
        </button>
        <span className="pf-bc-sep">›</span>
        <span className="pf-bc-current">Pay Fee (Offline)</span>
      </div>

      <div className="pf-header">
        <div>
          <h1 className="pf-title">Offline Fee Submission</h1>
          <p className="pf-subtitle">
            Paid manually via Cash or Bank Transfer? Submit your payment details here for administrative verification and receipt generation.
          </p>
        </div>
      </div>

      {/* ── Summary Cards ── */}
      <div className="pf-summary-row">
        <div className="pf-sum-card">
          <div className="pf-sum-icon"><Clock size={18} /></div>
          <div>
            <p className="pf-sum-label">Total Outstanding</p>
            <p className="pf-sum-value">₹12,500.00</p>
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
            <p className="pf-sum-value">₹12,500.00</p>
          </div>
        </div>
      </div>

      {/* ── Main Grid ── */}
      <div className="pf-main-grid">

        {/* ── Form ── */}
        <div className="pf-form-card">
          <h3 className="pf-section-title">Payment Transaction Details</h3>
          <p className="pf-section-sub">Enter the details as per your bank transaction or cash deposit slip.</p>

          {/* Method Selection */}
          <div className="pf-field-group">
            <label className="pf-label">Select Payment Method</label>
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
              <label className="pf-label">Payment Amount (₹)</label>
              <div className="pf-input-wrap">
                <span className="pf-input-icon">₹</span>
                <input
                  type="number"
                  className="pf-input pf-input--icon"
                  placeholder="e.g. 8500"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <span className="pf-hint">Enter the exact amount mentioned on your receipt.</span>
            </div>
            <div className="pf-field-group">
              <label className="pf-label">Payment Date</label>
              <div className="pf-input-wrap">
                <span className="pf-input-icon"><Calendar size={15} /></span>
                <input
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
              <label className="pf-label">Transaction / Reference ID</label>
              <div className="pf-input-wrap">
                <span className="pf-input-icon"><Hash size={15} /></span>
                <input
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
              <label className="pf-label">Upload Payment Proof (Receipt/Screenshot)</label>
              <div
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
              </div>
              <span className="pf-hint">Max size: 5MB. Clear visuals only.</span>
            </div>
          </div>

          {/* Notes */}
          <div className="pf-field-group">
            <label className="pf-label">Internal Notes (Optional)</label>
            <textarea
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
            <div className="pf-footer-actions">
              <button className="pf-btn-cancel" onClick={() => navigate('/student/fees')}>
                Cancel
              </button>
              <button
                className={`pf-btn-submit ${submitted ? 'pf-btn-submitted' : ''}`}
                onClick={handleSubmit}
                disabled={submitted}
              >
                {submitted ? (
                  <><CheckCircle size={15} /> Submitted!</>
                ) : (
                  <>Submit Payment Proof</>
                )}
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
                  <span className="pf-rp-val">Alex Johnson</span>
                </div>
                <div>
                  <span className="pf-rp-label">DATE ISSUED</span>
                  <span className="pf-rp-val">{date}</span>
                </div>
              </div>

              <div className="pf-rp-divider" />

              <div className="pf-rp-line">
                <span>Hostel Fees (April 2024)</span>
                <span className="pf-rp-fee">{amount ? `₹${Number(amount).toLocaleString('en-IN')}` : '₹0.00'}</span>
              </div>
              <div className="pf-rp-line">
                <span>Payment Method</span>
                <span className="pf-rp-fee">{selectedMethod?.label.split(' ')[0]}</span>
              </div>

              <div className="pf-rp-divider" />

              <div className="pf-rp-total-row">
                <span>Total Amount Paid</span>
                <span className="pf-rp-total-val">{amount ? `₹${Number(amount).toLocaleString('en-IN')}` : '₹0.00'}</span>
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