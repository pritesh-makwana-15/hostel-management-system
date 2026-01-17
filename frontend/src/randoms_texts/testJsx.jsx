import React, { useState } from 'react';
import { 
  Building2, 
  Shield, 
  Wifi, 
  UtensilsCrossed, 
  Droplet, 
  Zap,
  Menu,
  X,
  ChevronRight,
  Instagram,
  Facebook,
  Twitter,
  Linkedin
} from 'lucide-react';

const Home = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9]">
      {/* Navbar */}
      <header className="sticky top-0 bg-white border-b border-[#E5E7EB] z-50">
        <nav className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#1F3C88] rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-[#2E2E2E] font-semibold text-lg hidden sm:inline">
                Hostel Management System
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-10">
              <a 
                href="#home" 
                className="text-sm font-medium text-[#1F3C88] hover:text-[#2BBBAD] transition-colors"
              >
                Home
              </a>
              <a 
                href="#facilities" 
                className="text-sm font-medium text-[#6B7280] hover:text-[#1F3C88] transition-colors"
              >
                Facilities
              </a>
              <a 
                href="#gallery" 
                className="text-sm font-medium text-[#6B7280] hover:text-[#1F3C88] transition-colors"
              >
                Gallery
              </a>
              <a 
                href="#contact" 
                className="text-sm font-medium text-[#6B7280] hover:text-[#1F3C88] transition-colors"
              >
                Contact
              </a>
            </div>

            {/* Auth Buttons */}
            <div className="hidden lg:flex items-center gap-4">
              <button 
                className="px-6 py-2.5 text-sm font-medium text-white bg-[#1F3C88] rounded-md hover:bg-[#2BBBAD] transition-all active:scale-95"
              >
                Login
              </button>
              <button 
                className="px-6 py-2.5 text-sm font-medium text-[#1F3C88] border-2 border-[#1F3C88] rounded-md hover:bg-[#1F3C88] hover:text-white transition-all active:scale-95"
              >
                Register
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#2E2E2E] hover:text-[#1F3C88] transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden py-6 border-t border-[#E5E7EB]">
              <div className="flex flex-col gap-5">
                <a 
                  href="#home" 
                  className="text-sm font-medium text-[#1F3C88] hover:text-[#2BBBAD] transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </a>
                <a 
                  href="#facilities" 
                  className="text-sm font-medium text-[#6B7280] hover:text-[#1F3C88] transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Facilities
                </a>
                <a 
                  href="#gallery" 
                  className="text-sm font-medium text-[#6B7280] hover:text-[#1F3C88] transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Gallery
                </a>
                <a 
                  href="#contact" 
                  className="text-sm font-medium text-[#6B7280] hover:text-[#1F3C88] transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
                </a>
                <div className="flex flex-col gap-3 pt-3">
                  <button 
                    className="px-6 py-2.5 text-sm font-medium text-white bg-[#1F3C88] rounded-md hover:bg-[#2BBBAD] transition-all text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </button>
                  <button 
                    className="px-6 py-2.5 text-sm font-medium text-[#1F3C88] border-2 border-[#1F3C88] rounded-md hover:bg-[#1F3C88] hover:text-white transition-all text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Register
                  </button>
                </div>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <section id="home" className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column */}
          <div className="order-2 lg:order-1">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#2E2E2E] leading-tight mb-5">
              Smart & Secure Hostel Management System
            </h1>
            <p className="text-[#6B7280] text-base lg:text-lg mb-8 leading-relaxed">
              Seamlessly manage online room bookings, fee payments, and handle complaints & attendance tracking with our comprehensive solution designed for modern hostels.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                className="px-7 py-3.5 text-sm font-medium text-white bg-[#1F3C88] rounded-md hover:bg-[#2BBBAD] transition-all active:scale-95 text-center"
              >
                Login
              </button>
              <button 
                className="px-7 py-3.5 text-sm font-medium text-[#1F3C88] border-2 border-[#1F3C88] rounded-md hover:bg-[#1F3C88] hover:text-white transition-all active:scale-95 text-center flex items-center justify-center gap-2"
              >
                Explore Hostel
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column - Dashboard Image */}
          <div className="order-1 lg:order-2">
            <div className="bg-white rounded-xl shadow-[0px_4px_12px_rgba(0,0,0,0.08)] overflow-hidden hover:shadow-[0px_6px_18px_rgba(0,0,0,0.12)] transition-shadow">
              <img 
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop" 
                alt="Hostel Dashboard" 
                className="w-full h-[350px] lg:h-[450px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Hostel Facilities Section */}
      <section id="facilities" className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-16 lg:py-20">
        <h2 className="text-3xl lg:text-4xl font-semibold text-[#2E2E2E] text-center mb-14">
          Hostel Facilities
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          <FacilityCard 
            icon={<Building2 className="w-10 h-10 text-[#1F3C88]" />}
            title="Spacious Rooms"
            description="Comfortable and well-ventilated rooms with ample space."
          />
          <FacilityCard 
            icon={<Shield className="w-10 h-10 text-[#1F3C88]" />}
            title="24×7 Security"
            description="CCTV surveillance and vigilant staff ensure complete safety."
          />
          <FacilityCard 
            icon={<Wifi className="w-10 h-10 text-[#1F3C88]" />}
            title="High-Speed Wi-Fi"
            description="Uninterrupted internet access for studies and entertainment."
          />
          <FacilityCard 
            icon={<UtensilsCrossed className="w-10 h-10 text-[#1F3C88]" />}
            title="Mess Facility"
            description="Nutritious and delicious meals served hygienically."
          />
          <FacilityCard 
            icon={<Droplet className="w-10 h-10 text-[#1F3C88]" />}
            title="Clean Drinking Water"
            description="RO purified drinking water available round the clock."
          />
          <FacilityCard 
            icon={<Zap className="w-10 h-10 text-[#1F3C88]" />}
            title="Power Backup"
            description="Generator backup ensures continuous power supply."
          />
        </div>
      </section>

      {/* Hostel Gallery Section */}
      <section id="gallery" className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-16 lg:py-20">
        <h2 className="text-3xl lg:text-4xl font-semibold text-[#2E2E2E] text-center mb-14">
          Hostel Gallery
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <GalleryImage src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&h=400&fit=crop" alt="Hostel Room" />
          <GalleryImage src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop" alt="Study Area" />
          <GalleryImage src="https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=600&h=400&fit=crop" alt="Common Area" />
          <GalleryImage src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop" alt="Hostel Building" />
          <GalleryImage src="https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600&h=400&fit=crop" alt="Discussion Room" />
          <GalleryImage src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=600&h=400&fit=crop" alt="Recreation Area" />
          <GalleryImage src="https://images.unsplash.com/photo-1577415124269-fc1140ec20d8?w=600&h=400&fit=crop" alt="Mess Hall" />
          <GalleryImage src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&h=400&fit=crop" alt="Student Studying" />
        </div>
        <div className="text-center">
          <button className="px-8 py-3 text-sm font-medium text-[#1F3C88] border-2 border-[#1F3C88] rounded-md hover:bg-[#1F3C88] hover:text-white transition-all active:scale-95">
            View More Photos
          </button>
        </div>
      </section>

      {/* Admission / Inquiry Section */}
      <section id="contact" className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-16 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Left Column */}
          <div className="lg:pt-4">
            <h2 className="text-3xl lg:text-4xl font-semibold text-[#2E2E2E] mb-5">
              Looking for Hostel Admission?
            </h2>
            <p className="text-[#6B7280] text-base lg:text-lg mb-8 leading-relaxed">
              Our team is ready to assist you with any questions. Reach out today!
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[#2BBBAD] rounded-full mt-2"></div>
                <span className="text-[#2E2E2E] text-base">Easy admission process</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[#2BBBAD] rounded-full mt-2"></div>
                <span className="text-[#2E2E2E] text-base">Affordable and transparent fees</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[#2BBBAD] rounded-full mt-2"></div>
                <span className="text-[#2E2E2E] text-base">Safe and secure living environment</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[#2BBBAD] rounded-full mt-2"></div>
                <span className="text-[#2E2E2E] text-base">Modern amenities for comfortable stay</span>
              </li>
            </ul>
          </div>

          {/* Right Column - Inquiry Form */}
          <div className="bg-white rounded-xl shadow-[0px_4px_12px_rgba(0,0,0,0.08)] p-8 lg:p-10">
            <h3 className="text-xl font-semibold text-[#2E2E2E] mb-8">Send Us Your Inquiry</h3>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-[#2E2E2E] mb-2">Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your Name" 
                  className="w-full px-4 py-3 border border-[#E5E7EB] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1F3C88] focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2E2E2E] mb-2">Email</label>
                <input 
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your@email.com" 
                  className="w-full px-4 py-3 border border-[#E5E7EB] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1F3C88] focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2E2E2E] mb-2">Phone</label>
                <input 
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+1 234 567 8900" 
                  className="w-full px-4 py-3 border border-[#E5E7EB] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1F3C88] focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2E2E2E] mb-2">Message</label>
                <textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows="4" 
                  placeholder="How can we help you?" 
                  className="w-full px-4 py-3 border border-[#E5E7EB] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1F3C88] focus:border-transparent transition-all resize-none"
                ></textarea>
              </div>
              <button 
                onClick={handleSubmit}
                className="w-full px-6 py-3.5 text-sm font-medium text-white bg-[#1F3C88] rounded-md hover:bg-[#2BBBAD] transition-all active:scale-95"
              >
                Submit Inquiry
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1F3C88] text-white mt-16">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-14">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            {/* Hostel Info */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-[#1F3C88]" />
                </div>
                <span className="font-semibold text-lg">Hostel Management System</span>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed mb-6">
                Hostel Management System provides a smart and secure environment for hostel residents.
              </p>
              <div className="flex items-center gap-4">
                <button className="w-9 h-9 bg-white/10 rounded-md flex items-center justify-center hover:bg-[#2BBBAD] transition-colors">
                  <Instagram className="w-4 h-4" />
                </button>
                <button className="w-9 h-9 bg-white/10 rounded-md flex items-center justify-center hover:bg-[#2BBBAD] transition-colors">
                  <Facebook className="w-4 h-4" />
                </button>
                <button className="w-9 h-9 bg-white/10 rounded-md flex items-center justify-center hover:bg-[#2BBBAD] transition-colors">
                  <Twitter className="w-4 h-4" />
                </button>
                <button className="w-9 h-9 bg-white/10 rounded-md flex items-center justify-center hover:bg-[#2BBBAD] transition-colors">
                  <Linkedin className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Hostel Info Links */}
            <div>
              <h4 className="font-semibold text-lg mb-5">Hostel Info</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">About Us</a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">Privacy Policy</a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">Terms of Service</a>
                </li>
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-lg mb-5">Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">Rooms</a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">Admissions</a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-300 hover:text-white transition-colors">FAQ</a>
                </li>
              </ul>
            </div>

            {/* Contact Details */}
            <div>
              <h4 className="font-semibold text-lg mb-5">Contact Details</h4>
              <ul className="space-y-3">
                <li className="text-sm text-gray-300">Email: info@hms.com</li>
                <li className="text-sm text-gray-300">Phone: +1 234 567 890</li>
                <li className="text-sm text-gray-300">Address: 123 Hostel St, City, Country</li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-white/20 pt-8 text-center">
            <p className="text-sm text-gray-300">
              © 2024 Hostel Management System. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Facility Card Component
const FacilityCard = ({ icon, title, description }) => {
  return (
    <div className="bg-white rounded-xl p-7 shadow-[0px_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0px_6px_18px_rgba(0,0,0,0.12)] transition-all">
      <div className="mb-5">{icon}</div>
      <h3 className="text-lg font-semibold text-[#2E2E2E] mb-3">{title}</h3>
      <p className="text-sm text-[#6B7280] leading-relaxed">{description}</p>
    </div>
  );
};

// Gallery Image Component
const GalleryImage = ({ src, alt }) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-[0px_4px_12px_rgba(0,0,0,0.08)] hover:shadow-[0px_6px_18px_rgba(0,0,0,0.12)] transition-all group">
      <img 
        src={src} 
        alt={alt} 
        className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
      />
    </div>
  );
};

export default Home;