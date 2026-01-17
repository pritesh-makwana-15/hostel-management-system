import { ChevronRight } from "lucide-react";
import "../../styles/Home/HeroSection.css";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section id="home" className="hero">
      <div className="hero-grid">
        <div className="hero-text">
          <h1>Smart & Secure Hostel Management System</h1>
          <p>
            Seamlessly manage bookings, fees, complaints, and attendance
            with a modern hostel solution.
          </p>
          <div className="home-hero-actions">
            <Link to="/login" className="home-hero-btn-primary">
              Login
            </Link>

            <Link to="#facilities" className="home-hero-btn-outline">
              Explore Hostel <ChevronRight size={16} />
            </Link>
          </div>

        </div>

        <div className="hero-image">
          <img
            src="https://images.unsplash.com/photo-1551434678-e076c223a692"
            alt="Dashboard"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
