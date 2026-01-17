import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Eye, EyeOff, Building2 } from 'lucide-react';
import '../styles/layouts/Login.css';

const Login = () => {
  const [selectedRole, setSelectedRole] = useState('STUDENT');
  const [credentials, setCredentials] = useState({
    emailOrUsername: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  // Initialize dummy users on first load
  useEffect(() => {
    const existingUsers = localStorage.getItem('hms_users');
    
    if (!existingUsers) {
      const dummyUsers = [
        {
          id: 1,
          role: 'ADMIN',
          username: 'admin',
          email: 'admin@hms.com',
          password: 'admin123',
          name: 'System Admin'
        },
        {
          id: 2,
          role: 'WARDEN',
          username: 'warden',
          email: 'warden@hms.com',
          password: 'warden123',
          name: 'Hostel Warden'
        },
        {
          id: 3,
          role: 'STUDENT',
          username: 'student',
          email: 'student@hms.com',
          password: 'student123',
          name: 'John Doe'
        }
      ];
      
      localStorage.setItem('hms_users', JSON.stringify(dummyUsers));
      console.log('Dummy users created successfully');
    }
  }, []);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!credentials.emailOrUsername.trim()) {
      newErrors.emailOrUsername = 'Email or username is required';
    }

    if (!credentials.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate async operation
    setTimeout(() => {
      try {
        const users = JSON.parse(localStorage.getItem('hms_users') || '[]');
        
        const user = users.find(u => 
          u.role === selectedRole &&
          (u.email === credentials.emailOrUsername.toLowerCase() || 
           u.username === credentials.emailOrUsername.toLowerCase()) &&
          u.password === credentials.password
        );

        if (user) {
          // Create session
          const session = {
            id: user.id,
            role: user.role.toLowerCase(),
            username: user.username,
            email: user.email,
            name: user.name,
            isLoggedIn: true,
            loginTime: new Date().toISOString()
          };

          localStorage.setItem('hms_session', JSON.stringify(session));
          
          // Use AuthContext login
          login(user.role.toLowerCase(), {
            id: user.id,
            name: user.name,
            email: user.email,
            username: user.username
          });

          // Navigate to dashboard
          navigate(`/${user.role.toLowerCase()}/dashboard`);
        } else {
          setErrors({
            submit: 'Invalid credentials. Please check your email/username and password.'
          });
        }
      } catch (error) {
        console.error('Login error:', error);
        setErrors({
          submit: 'An error occurred during login. Please try again.'
        });
      } finally {
        setIsSubmitting(false);
      }
    }, 500);
  };

  const isFormValid = credentials.emailOrUsername && credentials.password && !isSubmitting;

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Left Side - Branding */}
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

        {/* Right Side - Login Form */}
        <div className="login-form-section">
          <div className="form-wrapper">
            <div className="form-header">
              <h2 className="form-title">Login to Your Account</h2>
              <p className="form-subtitle">Select your role and enter your credentials</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              {/* Role Selection */}
              <div className="form-group">
                <div className="role-selector">
                  <button
                    type="button"
                    className={`role-btn ${selectedRole === 'ADMIN' ? 'active' : ''}`}
                    onClick={() => handleRoleSelect('ADMIN')}
                  >
                    Admin
                  </button>
                  <button
                    type="button"
                    className={`role-btn ${selectedRole === 'WARDEN' ? 'active' : ''}`}
                    onClick={() => handleRoleSelect('WARDEN')}
                  >
                    Warden
                  </button>
                  <button
                    type="button"
                    className={`role-btn ${selectedRole === 'STUDENT' ? 'active' : ''}`}
                    onClick={() => handleRoleSelect('STUDENT')}
                  >
                    Student
                  </button>
                </div>
              </div>

              {/* Email or Username */}
              <div className="form-group">
                <label htmlFor="emailOrUsername" className="form-label">
                  Email or Username
                </label>
                <input
                  type="text"
                  id="emailOrUsername"
                  name="emailOrUsername"
                  value={credentials.emailOrUsername}
                  onChange={handleInputChange}
                  placeholder="Enter your email or username"
                  className={`form-input ${errors.emailOrUsername ? 'error' : ''}`}
                  autoComplete="username"
                />
                {errors.emailOrUsername && (
                  <span className="error-message">{errors.emailOrUsername}</span>
                )}
              </div>

              {/* Password */}
              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
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
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <span className="error-message">{errors.password}</span>
                )}
              </div>

              {/* Submit Error */}
              {errors.submit && (
                <div className="submit-error">
                  {errors.submit}
                </div>
              )}

              {/* Forgot Password */}
              <div className="form-footer">
                <a href="#" className="forgot-link">
                  Forgot password?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="submit-btn"
                disabled={!isFormValid}
              >
                {isSubmitting ? 'Logging in...' : 'Login'}
              </button>
            </form>

            {/* Footer */}
            <div className="login-footer">
              © 2026 Hostel Management System
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;