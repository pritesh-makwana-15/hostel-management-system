import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  History, CheckCircle, User, Building2, BookOpen,
  CreditCard, FileText, Receipt, Download, IndianRupee,
  Lightbulb, Calendar, Hash, AlignLeft
} from 'lucide-react';
import { invoiceStudents } from '../../../data/feesData';
import '../../../styles/admin/fees/generateInvoice.css';

const GenerateInvoice = () => {
  const navigate = useNavigate();
  const student = invoiceStudents[0];

  const [form, setForm] = useState({
    monthlyFee:    student.monthlyFee,
    utilities:     student.utilities,
    previousDues:  0,
    lateFee:       0,
    discount:      0,
    paymentMethod: '',
    transactionId: 'TXN-9821-0012',
    paymentDate:   '',
    notes:         '',
  });

  const set = (k) => (e) => setForm(prev => ({ ...prev, [k]: e.target.value }));

  const total =
    (parseFloat(form.monthlyFee) || 0) +
    (parseFloat(form.utilities) || 0) +
    (parseFloat(form.previousDues) || 0) +
    (parseFloat(form.lateFee) || 0) -
    (parseFloat(form.discount) || 0);

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div className="generate-invoice-page">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-left">
          <div className="breadcrumb">
            <span>Dashboard</span><span className="breadcrumb-sep">›</span>
            <span>Fees</span><span className="breadcrumb-sep">›</span>
            <span className="breadcrumb-active">Generate Invoice</span>
          </div>
          <h1 className="page-title">Generate Invoice</h1>
        </div>
        <button className="btn-secondary" onClick={() => navigate('/admin/fees/payment-history')}>
          <History size={15} /> View Payment History
        </button>
      </div>

      <div className="invoice-layout">
        {/* Left: Form */}
        <div className="invoice-form">
          {/* Active Billing Session */}
          <div className="session-bar">
            <span className="session-label">ACTIVE BILLING SESSION</span>
            <span className="session-verified"><CheckCircle size={13} /> Student Verified</span>
          </div>

          {/* Student Info */}
          <div className="student-info-card">
            <div className="student-avatar-lg">AM</div>
            <div className="student-info-grid">
              <div className="info-field">
                <span className="info-field-label"><User size={12} /> STUDENT NAME</span>
                <span className="info-field-value">{student.name}</span>
              </div>
              <div className="info-field">
                <span className="info-field-label"><Hash size={12} /> ENROLLMENT ID</span>
                <span className="info-field-value">{student.id}</span>
              </div>
              <div className="info-field">
                <span className="info-field-label"><Building2 size={12} /> HOSTEL/BLOCK</span>
                <span className="info-field-value">{student.hostel} / {student.block}</span>
              </div>
              <div className="info-field">
                <span className="info-field-label"><Building2 size={12} /> ROOM NO.</span>
                <span className="info-field-value">{student.room}</span>
              </div>
              <div className="info-field info-field-full">
                <span className="info-field-label"><BookOpen size={12} /> COURSE / DEPT.</span>
                <span className="info-field-value">{student.course}</span>
              </div>
            </div>
          </div>

          {/* Fee Breakdown */}
          <div className="form-section">
            <h3 className="form-section-title"><Receipt size={16} /> Fee Breakdown</h3>
            <p className="form-section-sub">Enter the charges for the current billing cycle.</p>
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">MONTHLY HOSTEL FEE</label>
                <div className="input-with-icon">
                  <CreditCard size={14} className="input-icon" />
                  <input className="form-input" type="number" value={form.monthlyFee} onChange={set('monthlyFee')} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">UTILITIES (ELECTRICITY/WATER)</label>
                <div className="input-with-icon">
                  <Lightbulb size={14} className="input-icon" />
                  <input className="form-input" type="number" value={form.utilities} onChange={set('utilities')} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">PREVIOUS PENDING DUES</label>
                <div className="input-with-icon">
                  <History size={14} className="input-icon" />
                  <input className="form-input" type="number" value={form.previousDues} onChange={set('previousDues')} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">LATE FEE CHARGES</label>
                <div className="input-with-icon">
                  <Calendar size={14} className="input-icon" />
                  <input className="form-input" type="number" value={form.lateFee} onChange={set('lateFee')} />
                </div>
              </div>
              <div className="form-group form-group-full">
                <label className="form-label">DISCOUNT (SCHOLARSHIP/WAIVER)</label>
                <div className="input-with-icon">
                  <IndianRupee size={14} className="input-icon" />
                  <input className="form-input" type="number" value={form.discount} onChange={set('discount')} />
                </div>
              </div>
            </div>

            {/* Calculated Total */}
            <div className="calculated-total">
              <div>
                <div className="calc-label">Calculated Total</div>
                <div className="calc-sub">Automatic calculation based on inputs above.</div>
              </div>
              <div className="calc-amount">₹{total.toLocaleString()}</div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="form-section">
            <h3 className="form-section-title"><CreditCard size={16} /> Payment Details</h3>
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">PAYMENT METHOD</label>
                <input className="form-input no-icon" type="text" placeholder="UPI / Cash / Bank Transfer..." value={form.paymentMethod} onChange={set('paymentMethod')} />
              </div>
              <div className="form-group">
                <label className="form-label">TRANSACTION / REFERENCE ID</label>
                <div className="input-with-icon">
                  <FileText size={14} className="input-icon" />
                  <input className="form-input" type="text" value={form.transactionId} onChange={set('transactionId')} />
                </div>
              </div>
              <div className="form-group form-group-full">
                <label className="form-label">PAYMENT DATE</label>
                <div className="input-with-icon">
                  <Calendar size={14} className="input-icon" />
                  <input className="form-input" type="date" value={form.paymentDate} onChange={set('paymentDate')} />
                </div>
              </div>
              <div className="form-group form-group-full">
                <label className="form-label">INTERNAL NOTES</label>
                <textarea
                  className="form-textarea"
                  placeholder="Add any specific details about this transaction..."
                  value={form.notes}
                  onChange={set('notes')}
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="invoice-actions">
            <span className="actions-note">Review all details carefully. Invoices cannot be deleted once generated.</span>
            <div className="actions-buttons">
              <button className="btn-cancel" onClick={() => navigate('/admin/fees')}>Cancel</button>
              <button className="btn-download"><Download size={15} /> Download PDF</button>
              <button className="btn-generate"><Receipt size={15} /> Generate Invoice</button>
            </div>
          </div>
        </div>

        {/* Right: Live Preview */}
        <div className="invoice-preview-panel">
          <h3 className="preview-title">Live Preview</h3>
          <p className="preview-sub">Real-time document generated for verification.</p>

          <div className="invoice-preview">
            <div className="preview-header">
              <div className="preview-logo"><IndianRupee size={18} /></div>
              <div>
                <div className="preview-invoice-label">INVOICE</div>
                <div className="preview-invoice-num">#INV-2024-102</div>
              </div>
              <div className="preview-date-block">
                <span className="preview-date-label">DATE ISSUED</span>
                <span className="preview-date-value">{dateStr}</span>
              </div>
            </div>

            <div className="preview-billed">
              <div>
                <div className="preview-billed-label">BILLED TO</div>
                <div className="preview-billed-name">{student.name}</div>
                <div className="preview-billed-sub">Room {student.room}, {student.block}</div>
                <div className="preview-billed-sub">{student.hostel} Hostel</div>
              </div>
              <span className="preview-status-badge">Generated</span>
            </div>

            <div className="preview-line-items">
              {[
                { label: `Monthly Fees (Oct 2024)`,  val: form.monthlyFee },
                { label: 'Utility Charges',           val: form.utilities },
                { label: 'Previous Balance',          val: form.previousDues },
                { label: 'Late Payment Fee',          val: form.lateFee },
                { label: 'Scholarship Discount',      val: -form.discount },
              ].map((item, i) => (
                <div className="preview-line" key={i}>
                  <span>{item.label}</span>
                  <span className={item.val < 0 ? 'preview-negative' : ''}>
                    {item.val < 0 ? '-' : ''}₹{Math.abs(parseFloat(item.val) || 0).toLocaleString()}
                  </span>
                </div>
              ))}
              <div className="preview-total-line">
                <span>Total Payable</span>
                <span className="preview-total-amount">₹{total.toLocaleString()}</span>
              </div>
            </div>

            <div className="preview-footer-note">
              This is a computer-generated document. No signature required. Questions? Contact support@hmshostel.com
            </div>
          </div>

          {/* Pro Tip */}
          <div className="pro-tip">
            <Lightbulb size={16} className="pro-tip-icon" />
            <div>
              <div className="pro-tip-title">Pro Tip</div>
              <div className="pro-tip-text">Always double-check the Transaction ID for UPI payments before generating the final invoice.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateInvoice;