import { useState } from "react";
import "../../styles/Home/Home.css";

import Navbar from "../../components/Home/Navbar";
import HeroSection from "../../components/Home/HeroSection";
import FacilitiesSection from "../../components/Home/FacilitiesSection";
import GallerySection from "../../components/Home/GallerySection";
import ContactSection from "../../components/Home/ContactSection";
import Footer from "../../components/Home/Footer";

const Home = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleInputChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="home">
      <Navbar />
      <HeroSection />
      <FacilitiesSection />
      <GallerySection />
      <ContactSection
        formData={formData}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
      />
      <Footer />
    </div>
  );
};

export default Home;
