import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { authAPI } from '../services/api';
import { Eye, EyeOff, Building2 } from 'lucide-react';
import '../styles/layouts/Login.css';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!credentials.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(credentials.email)) {
      newErrors.email = 'Enter a valid email address';
    }
    if (!credentials.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await authAPI.login({
        email: credentials.email.toLowerCase().trim(),
        password: credentials.password,
      });

      const { token, role, name, email } = response.data;

      login(token, { role, name, email });

      const redirectMap = {
        ADMIN: '/admin/dashboard',
        WARDEN: '/warden/dashboard',
        STUDENT: '/student/dashboard',
      };

      navigate(redirectMap[role] || '/login');

    } catch (error) {
      if (error.response?.status === 401) {
        setErrors({ submit: 'Invalid email or password. Please try again.' });
      } else if (!error.response) {
        setErrors({ submit: 'Cannot connect to server. Please check if backend is running.' });
      } else {
        setErrors({ submit: error.response?.data?.error || 'Login failed. Please try again.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = credentials.email && credentials.password && !isSubmitting;

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-branding">
          <div className="branding-content">
            <div className="brand-icon">
              <Building2 size={40} strokeWidth={2} />
            </div>
            <h1 className="brand-title">Hostel Management System</h1>
            <p className="brand-subtitle">Secure login for Admin, Warden & Students</p>
            <div className="branding-illustration">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80"
                alt="Hostel Management"
                className="illustration-image"
              />
            </div>
          </div>
        </div>

        <div className="login-form-section">
          <div className="form-wrapper">
            <div className="form-header">
              <h2 className="form-title">Login to Your Account</h2>
              <p className="form-subtitle">Enter your credentials to continue</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={credentials.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  autoComplete="email"
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={credentials.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    className={`form-input ${errors.password ? 'error' : ''}`}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && <span className="error-message">{errors.password}</span>}
              </div>

              {errors.submit && <div className="submit-error">{errors.submit}</div>}

              <div className="form-footer">
                <a href="#" className="forgot-link">Forgot password?</a>
              </div>

              <button type="submit" className="submit-btn" disabled={!isFormValid}>
                {isSubmitting ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <div className="login-footer">© 2026 Hostel Management System</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;