import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CreditCard, Upload, Calendar, DollarSign, AlertCircle,
  CheckCircle, FileText, ArrowLeft, Info
} from 'lucide-react';
import { studentFeeApi } from '../../services/adminFeeApi';
import '../../styles/student/fees/fee-payment.css';

const FeePayment = () => {
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feeDetails, setFeeDetails] = useState(null);
  const [formData, setFormData] = useState({
    academicCycle: '',
    amount: '',
    paymentMethod: 'BANK_TRANSFER',
    transactionId: '',
    proofFile: null,
    paymentDate: new Date().toISOString().split('T')[0],
    notes: ''
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadFeeDetails();
  }, []);

  const loadFeeDetails = async () => {
    try {
      setLoading(true);
      const response = await studentFeeApi.getFeeDetails();
      const details = response?.data?.data;
      
      if (details) {
        setFeeDetails(details);
        setFormData(prev => ({
          ...prev,
          academicCycle: details.academicCycle || '',
          amount: details.balance?.toString() || ''
        }));
      }
    } catch (error) {
      console.error('Error loading fee details:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.academicCycle) newErrors.academicCycle = 'Academic cycle is required';
    if (!formData.amount || parseFloat(formData.amount) <= 0) newErrors.amount = 'Amount must be greater than 0';
    if (!formData.paymentMethod) newErrors.paymentMethod = 'Payment method is required';
    if (!formData.transactionId.trim()) newErrors.transactionId = 'Transaction ID is required';
    if (!formData.paymentDate) newErrors.paymentDate = 'Payment date is required';
    
    if (feeDetails && parseFloat(formData.amount) > parseFloat(feeDetails.balance || 0)) {
      newErrors.amount = 'Amount cannot exceed outstanding balance';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          proofFile: 'File size must be less than 5MB'
        }));
        return;
      }
      
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          proofFile: 'Only JPG, PNG, and PDF files are allowed'
        }));
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        proofFile: file
      }));
      
      if (errors.proofFile) {
        setErrors(prev => ({
          ...prev,
          proofFile: ''
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setSubmitting(true);
      
      const submissionData = {
        academicCycle: formData.academicCycle,
        amount: parseFloat(formData.amount),
        paymentMethod: formData.paymentMethod,
        transactionId: formData.transactionId,
        paymentDate: formData.paymentDate,
        notes: formData.notes
      };
      
      const response = await studentFeeApi.submitPaymentRequest(submissionData);
      
      if (response.data) {
        setSuccess(true);
        setFormData(prev => ({
          ...prev,
          transactionId: '',
          proofFile: null,
          notes: ''
        }));
      }
    } catch (error) {
      console.error('Error submitting payment:', error);
      setErrors(prev => ({
        ...prev,
        submit: error.response?.data?.message || 'Failed to submit payment. Please try again.'
      }));
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount || 0);
  };

  if (loading) {
    return (
      <div className="fp-page">
        <div className="fp-loading">
          <div className="fp-spinner"></div>
          <p>Loading fee details...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="fp-page">
        <div className="fp-success-card">
          <div className="fp-success-icon">
            <CheckCircle size={48} color="#10B981" />
          </div>
          <h2>Payment Request Submitted Successfully!</h2>
          <p>Your payment request has been submitted for admin verification. You will receive a notification once it's processed.</p>
          <div className="fp-success-actions">
            <button className="fp-btn-primary" onClick={() => navigate('/student/fees/history')}>
              View Payment History
            </button>
            <button className="fp-btn-secondary" onClick={() => setSuccess(false)}>
              Submit Another Payment
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!feeDetails) {
    return (
      <div className="fp-page">
        <div className="fp-error-card">
          <AlertCircle size={48} color="#EF4444" />
          <h2>Fee Details Not Available</h2>
          <p>We couldn't load your fee details. Please contact the hostel administration.</p>
          <button className="fp-btn-primary" onClick={() => navigate('/student/dashboard')}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (feeDetails.status === 'PAID' || parseFloat(feeDetails.balance || 0) <= 0) {
    return (
      <div className="fp-page">
        <div className="fp-success-card">
          <CheckCircle size={48} color="#10B981" />
          <h2>Fee Already Paid</h2>
          <p>Your fee for this academic cycle has been fully paid. No further payments are required.</p>
          <div className="fp-success-actions">
            <button className="fp-btn-primary" onClick={() => navigate('/student/fees/history')}>
              View Payment History
            </button>
            <button className="fp-btn-secondary" onClick={() => navigate('/student/dashboard')}>
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fp-page">
      <div className="fp-header">
        <button className="fp-back-btn" onClick={() => navigate('/student/dashboard')}>
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
        <h1 className="fp-title">Fee Payment Request</h1>
        <p className="fp-subtitle">Submit your hostel fee payment request for admin verification</p>
      </div>

      <div className="fp-content">
        <div className="fp-summary-card">
          <div className="fp-summary-header">
            <FileText size={20} />
            <h3>Fee Summary</h3>
          </div>
          <div className="fp-summary-grid">
            <div className="fp-summary-item">
              <span className="fp-summary-label">Academic Cycle</span>
              <span className="fp-summary-value">{feeDetails.academicCycle || 'N/A'}</span>
            </div>
            <div className="fp-summary-item">
              <span className="fp-summary-label">Total Fee</span>
              <span className="fp-summary-value">{formatCurrency(feeDetails.totalFee)}</span>
            </div>
            <div className="fp-summary-item">
              <span className="fp-summary-label">Paid Amount</span>
              <span className="fp-summary-value">{formatCurrency(feeDetails.paidAmount)}</span>
            </div>
            <div className="fp-summary-item">
              <span className="fp-summary-label">Outstanding Balance</span>
              <span className="fp-summary-value fp-balance">{formatCurrency(feeDetails.balance)}</span>
            </div>
          </div>
        </div>

        <div className="fp-form-card">
          <div className="fp-form-header">
            <CreditCard size={20} />
            <h3>Payment Details</h3>
          </div>
          
          <form onSubmit={handleSubmit} className="fp-form">
            <div className="fp-form-grid">
              <div className="fp-form-group">
                <label className="fp-label">Academic Cycle</label>
                <input
                  type="text"
                  name="academicCycle"
                  value={formData.academicCycle}
                  onChange={handleInputChange}
                  className="fp-input"
                  readOnly
                />
              </div>

              <div className="fp-form-group">
                <label className="fp-label">Payment Amount *</label>
                <div className="fp-input-wrapper">
                  <DollarSign size={16} className="fp-input-icon" />
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    className={`fp-input ${errors.amount ? 'fp-error' : ''}`}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    max={feeDetails.balance || 0}
                  />
                </div>
                {errors.amount && <span className="fp-error-text">{errors.amount}</span>}
              </div>

              <div className="fp-form-group">
                <label className="fp-label">Payment Method *</label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                  className={`fp-select ${errors.paymentMethod ? 'fp-error' : ''}`}
                >
                  <option value="BANK_TRANSFER">Bank Transfer</option>
                  <option value="UPI">UPI</option>
                  <option value="CASH">Cash</option>
                  <option value="OFFLINE">Offline</option>
                </select>
                {errors.paymentMethod && <span className="fp-error-text">{errors.paymentMethod}</span>}
              </div>

              <div className="fp-form-group">
                <label className="fp-label">Transaction ID *</label>
                <input
                  type="text"
                  name="transactionId"
                  value={formData.transactionId}
                  onChange={handleInputChange}
                  className={`fp-input ${errors.transactionId ? 'fp-error' : ''}`}
                  placeholder="Enter transaction ID"
                />
                {errors.transactionId && <span className="fp-error-text">{errors.transactionId}</span>}
              </div>

              <div className="fp-form-group">
                <label className="fp-label">Payment Date *</label>
                <div className="fp-input-wrapper">
                  <Calendar size={16} className="fp-input-icon" />
                  <input
                    type="date"
                    name="paymentDate"
                    value={formData.paymentDate}
                    onChange={handleInputChange}
                    className={`fp-input ${errors.paymentDate ? 'fp-error' : ''}`}
                    max={new Date().toISOString().split('T')[0]}
                  />
                </div>
                {errors.paymentDate && <span className="fp-error-text">{errors.paymentDate}</span>}
              </div>

              <div className="fp-form-group">
                <label className="fp-label">Payment Proof (Optional)</label>
                <div className="fp-file-upload">
                  <input
                    type="file"
                    id="proofFile"
                    onChange={handleFileChange}
                    accept="image/jpeg,image/png,application/pdf"
                    className="fp-file-input"
                  />
                  <label htmlFor="proofFile" className="fp-file-label">
                    <Upload size={16} />
                    <span>{formData.proofFile ? formData.proofFile.name : 'Choose file or drag here'}</span>
                  </label>
                </div>
                <small className="fp-file-hint">Accepted formats: JPG, PNG, PDF (Max 5MB)</small>
                {errors.proofFile && <span className="fp-error-text">{errors.proofFile}</span>}
              </div>

              <div className="fp-form-group fp-full-width">
                <label className="fp-label">Additional Notes (Optional)</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="fp-textarea"
                  placeholder="Any additional information about this payment..."
                  rows={3}
                />
              </div>
            </div>

            {errors.submit && (
              <div className="fp-error-message">
                <AlertCircle size={16} />
                {errors.submit}
              </div>
            )}

            <div className="fp-form-actions">
              <button
                type="submit"
                className="fp-btn-submit"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <div className="fp-btn-spinner"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <CreditCard size={16} />
                    Submit Payment
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="fp-info-card">
          <div className="fp-info-header">
            <Info size={20} />
            <h3>Important Information</h3>
          </div>
          <ul className="fp-info-list">
            <li>Payments will be verified by hostel administration before being processed</li>
            <li>Upload payment proof for faster verification</li>
            <li>Keep your transaction ID safe for future reference</li>
            <li>Payment status will be updated in your payment history</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FeePayment;