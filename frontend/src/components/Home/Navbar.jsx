import { useState } from "react";
import { Building2, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import "../../styles/Home/Navbar.css";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="home-nav-navbar">
      <div className="home-nav-container">
        
        {/* LEFT: Logo */}
        <Link to="/" className="home-nav-logo">
          <span className="home-nav-logo-icon">
            <Building2 size={18} />
          </span>
          <span className="home-nav-logo-text">
            Hostel Management System
          </span>
        </Link>

        {/* RIGHT: Menu + Actions */}
        <div className="home-nav-right">
          <nav className="home-nav-links">
            <a href="#home">Home</a>
            <a href="#facilities">Facilities</a>
            <a href="#gallery">Gallery</a>
            <a href="#contact">Contact</a>
          </nav>

          <div className="home-nav-actions">
            <Link to="/login" className="home-nav-btn-primary">Login</Link>
            <Link to="/register" className="home-nav-btn-outline">Register</Link>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button
          className="home-nav-mobile-toggle"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="home-nav-mobile-menu">
          <a href="#home" onClick={() => setOpen(false)}>Home</a>
          <a href="#facilities" onClick={() => setOpen(false)}>Facilities</a>
          <a href="#gallery" onClick={() => setOpen(false)}>Gallery</a>
          <a href="#contact" onClick={() => setOpen(false)}>Contact</a>

          <div className="home-nav-mobile-actions">
            <Link to="/login" onClick={() => setOpen(false)}>Login</Link>
            <Link to="/register" onClick={() => setOpen(false)}>Register</Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
