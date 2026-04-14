import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { adminStudentApi } from '../../../services/adminStudentApi';
import { ChevronRight, Save, X } from 'lucide-react';
import '../../../styles/admin/students/student-form.css';

const yearSemesterOptions = [
  '1st Year / 1st Semester', '1st Year / 2nd Semester',
  '2nd Year / 3rd Semester', '2nd Year / 4th Semester',
  '3rd Year / 5th Semester', '3rd Year / 6th Semester',
  '4th Year / 7th Semester', '4th Year / 8th Semester',
];

const studentSchema = z.object({
  name: z.string().min(3, 'Full name must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
  gender: z.enum(['Male', 'Female', 'Other']),
  dob: z.string().optional().nullable(),
  nationality: z.string().default('Indian'),
  enrollmentNo: z.string().min(1, 'Enrollment number is required'),
  course: z.string().optional(),
  yearSemester: z.string().optional(),
  batch: z.string().optional(),
  program: z.string().optional(),
  joinDate: z.string().optional().nullable(),
  guardianName: z.string().optional(),
  guardianPhone: z.string().optional(),
  guardianRelation: z.string().optional(),
  address: z.string().optional(),
});

const AddStudent = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(studentSchema),
    defaultValues: { gender: 'Male', nationality: 'Indian' }
  });

  const normalizeDateForBackend = (value, fieldLabel) => {
    if (!value) return value;
    const raw = String(value).trim();
    if (!raw) return raw;

    // Accept already-normalized backend format: YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;

    // Accept UI format: DD-MM-YYYY
    const m = raw.match(/^(\d{2})-(\d{2})-(\d{4})$/);
    if (m) {
      const [, dd, mm, yyyy] = m;
      return `${yyyy}-${mm}-${dd}`;
    }

    alert(`Please enter ${fieldLabel} in DD-MM-YYYY format (4-digit year)`);
    throw new Error(`Invalid ${fieldLabel} format`);
  };

  const onSubmit = async (data) => {
    try {
      const dataToSend = { ...data };
      dataToSend.dob = normalizeDateForBackend(dataToSend.dob, 'date of birth');
      
      if (dataToSend.joinDate) {
        dataToSend.joinDate = normalizeDateForBackend(dataToSend.joinDate, 'join date');
      }
      
      await adminStudentApi.create({
        ...dataToSend,
        status: 'Active',
      });
      navigate('/admin/students');
    } catch (err) {
      if (err?.message?.startsWith('Invalid ') || err?.message?.includes('format')) return;
      alert(err.response?.data?.message || 'Failed to create student.');
    }
  };

  const Field = ({ label, name, type = 'text', children, ...props }) => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      {children ? children : (
        <input type={type} {...register(name)} {...props} className="form-input" />
      )}
      {errors[name] && <p className="text-[11px] text-red-500 ml-1">{errors[name].message}</p>}
    </div>
  );

  return (
    <div className="student-form-page">
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Add New Student</h1>
          <div className="breadcrumb">
            <span>Dashboard</span><span className="breadcrumb-separator">›</span>
            <span>Students</span><span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-active">Add</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        
        {/* Section: Personal */}
        <div className="form-card">
          <h2 className="section-title">Personal Information</h2>
          <div className="form-grid">
            <Field label="Full Name *" name="name" placeholder="John Doe" />
            <Field label="Email Address *" name="email" type="email" placeholder="john@example.com" />
            <Field label="Account Password *" name="password" type="password" placeholder="••••••••" />
            <Field label="Phone Number" name="phone" placeholder="+91 00000 00000" />
            <Field label="Gender" name="gender">
              <div className="radio-group">
                {['Male', 'Female', 'Other'].map(g => (
                  <label key={g} className="radio-label">
                    <input type="radio" value={g} {...register('gender')} />
                    <span>{g}</span>
                  </label>
                ))}
              </div>
            </Field>
            <Field label="Date of Birth" name="dob" type="date" />
            <Field label="Nationality" name="nationality" placeholder="e.g. Indian" />
          </div>
        </div>

        {/* Section: Academic */}
        <div className="form-card">
          <h2 className="section-title">Academic Details</h2>
          <div className="form-grid">
            <Field label="Enrollment Number *" name="enrollmentNo" placeholder="ENR123456" />
            <Field label="Course / Department" name="course" placeholder="B.Tech Computer Science" />
            <Field label="Year / Semester" name="yearSemester">
              <select {...register('yearSemester')} className="form-input">
                <option value="">Select Option</option>
                {yearSemesterOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </Field>
            <Field label="Batch" name="batch" placeholder="2022-2026" />
            <Field label="Program" name="program" placeholder="Undergraduate" />
            <Field label="Join Date" name="joinDate" type="date" />
          </div>
        </div>

        {/* Section: Guardian */}
        <div className="form-card">
          <h2 className="section-title">Guardian & Address</h2>
          <div className="form-grid">
            <Field label="Guardian Name" name="guardianName" placeholder="Michael Doe" />
            <Field label="Guardian Phone" name="guardianPhone" placeholder="+91 00000 00000" />
            <Field label="Relationship" name="guardianRelation" placeholder="Father" />
            <div className="form-group form-group-full">
              <Field label="Permanent Address" name="address">
                <textarea {...register('address')} rows="3" className="form-textarea" placeholder="Enter full address..." />
              </Field>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="form-actions">
          <button type="button" onClick={() => navigate('/admin/students')} className="btn-secondary">
            <X size={18} />
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting} className="btn-primary">
            {isSubmitting ? (
              <div className="spinner" />
            ) : <Save size={18} />}
            Save Student
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddStudent;