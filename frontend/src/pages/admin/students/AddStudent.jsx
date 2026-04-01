import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { adminStudentApi } from '../../../services/adminStudentApi';
import { ChevronRight, Save, X } from 'lucide-react';

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

  const onSubmit = async (data) => {
    try {
      await adminStudentApi.create({
        ...data,
        status: 'Active',
      });
      navigate('/admin/students');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create student.');
    }
  };

  const Field = ({ label, name, type = 'text', children, ...props }) => (
    <div className="space-y-1.5">
      <label className="text-[13px] font-semibold text-gray-700 ml-0.5">{label}</label>
      {children ? children : (
        <input type={type} {...register(name)} {...props} className={`w-full px-4 py-2.5 bg-gray-50 border ${errors[name] ? 'border-red-500' : 'border-gray-200'} rounded-xl text-sm focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400`} />
      )}
      {errors[name] && <p className="text-[11px] text-red-500 ml-1">{errors[name].message}</p>}
    </div>
  );

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Add New Student</h1>
          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1.5">
            <span>Dashboard</span>
            <ChevronRight size={14} className="text-gray-300" />
            <span>Students</span>
            <ChevronRight size={14} className="text-gray-300" />
            <span className="text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded-md">Register</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        
        {/* Section: Personal */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100">
            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Personal Information</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Field label="Full Name *" name="name" placeholder="John Doe" />
            <Field label="Email Address *" name="email" type="email" placeholder="john@example.com" />
            <Field label="Account Password *" name="password" type="password" placeholder="••••••••" />
            <Field label="Phone Number" name="phone" placeholder="+91 00000 00000" />
            <Field label="Gender" name="gender">
              <div className="flex items-center gap-4 py-2">
                {['Male', 'Female', 'Other'].map(g => (
                  <label key={g} className="flex items-center gap-2 cursor-pointer group">
                    <input type="radio" value={g} {...register('gender')} className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                    <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">{g}</span>
                  </label>
                ))}
              </div>
            </Field>
            <Field label="Date of Birth" name="dob" type="date" />
            <Field label="Nationality" name="nationality" placeholder="e.g. Indian" />
          </div>
        </div>

        {/* Section: Academic */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100">
            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Academic Details</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Field label="Enrollment Number *" name="enrollmentNo" placeholder="ENR123456" />
            <Field label="Course / Department" name="course" placeholder="B.Tech Computer Science" />
            <Field label="Year / Semester" name="yearSemester">
              <select {...register('yearSemester')} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all appearance-none bg-no-repeat bg-[right_1rem_center]">
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
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100">
            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Guardian & Address</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Field label="Guardian Name" name="guardianName" placeholder="Michael Doe" />
            <Field label="Guardian Phone" name="guardianPhone" placeholder="+91 00000 00000" />
            <Field label="Relationship" name="guardianRelation" placeholder="Father" />
            <div className="md:col-span-2 lg:col-span-3">
              <Field label="Permanent Address" name="address">
                <textarea {...register('address')} rows="3" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all placeholder:text-gray-400" placeholder="Enter full address..." />
              </Field>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <button type="button" onClick={() => navigate('/admin/students')} className="px-6 py-2.5 text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all flex items-center gap-2">
            <X size={18} /> Cancel
          </button>
          <button type="submit" disabled={isSubmitting} className="px-8 py-2.5 bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center gap-2">
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : <Save size={18} />}
            Save Student
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddStudent;