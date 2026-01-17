import { Outlet } from "react-router-dom";
import "../styles/layouts/AuthLayout.css";

const AuthLayout = () => {
  return (
    <div className="auth-layout">
      <div className="auth-container">
        {/* Optional Header */}
        {/*
        <div className="auth-header">
          <h1>HMS</h1>
          <p>Hostel Management System</p>
        </div>
        */}

        {/* Auth Card */}
        <div className="auth-card">
          <Outlet />
        </div>

        {/* Optional Footer */}
        {/*
        <div className="auth-footer">
          © 2025 HMS. All rights reserved.
        </div>
        */}
      </div>
    </div>
  );
};

export default AuthLayout;
