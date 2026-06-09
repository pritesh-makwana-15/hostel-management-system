import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Send, CheckCircle, CalendarDays, School, MessageSquareText } from 'lucide-react';
import '../../../styles/student/fees/fee-certificate-request.css';

const FeeCertificateRequest = () => {
  const navigate = useNavigate();
  const [semester, setSemester] = useState('Odd Semester 2025');
  const [reason, setReason] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);

    setTimeout(() => {
      navigate('/student/fees/history');
    }, 1200);
  };

  return (
    <div className="fcr-page">
      <div className="fcr-shell">
        <button className="fcr-back-btn" onClick={() => navigate('/student/fees')}>
          <ArrowLeft size={15} /> Back to Fee Details
        </button>

        <div className="fcr-hero">
          <div className="fcr-hero-badge">
            <FileText size={16} /> Fee Certificate Request
          </div>
          <h1>Request a fee certificate for hostel or scholarship use</h1>
          <p>
            Submit the semester and reason, and the accounts team can prepare a certificate for verification.
          </p>
        </div>

        <div className="fcr-grid">
          <form className="fcr-form-card" onSubmit={handleSubmit}>
            <h2>Request Details</h2>

            <label className="fcr-field">
              <span><School size={14} /> Semester / Academic Period</span>
              <select value={semester} onChange={(e) => setSemester(e.target.value)}>
                <option>Odd Semester 2025</option>
                <option>Even Semester 2024</option>
                <option>Odd Semester 2024</option>
                <option>Annual Fee Certificate</option>
              </select>
            </label>

            <label className="fcr-field">
              <span><MessageSquareText size={14} /> Reason</span>
              <textarea
                rows={5}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Example: Scholarship application, bank loan, visa documentation..."
                required
              />
            </label>

            <button className="fcr-submit-btn" type="submit" disabled={submitted}>
              {submitted ? <><CheckCircle size={15} /> Request Submitted</> : <><Send size={15} /> Submit Request</>}
            </button>
          </form>

          <aside className="fcr-info-card">
            <div className="fcr-info-item">
              <CalendarDays size={16} />
              <div>
                <h3>Processing Time</h3>
                <p>Usually 1-2 working days after verification.</p>
              </div>
            </div>
            <div className="fcr-info-item">
              <FileText size={16} />
              <div>
                <h3>What it includes</h3>
                <p>Fee payment status, academic period, and hostel details.</p>
              </div>
            </div>
            <div className="fcr-info-item">
              <Send size={16} />
              <div>
                <h3>After submission</h3>
                <p>You will be redirected to payment history after the request is logged.</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default FeeCertificateRequest;