import "../../styles/Home/ContactSection.css";

const ContactSection = ({ formData, handleInputChange, handleSubmit }) => {

  // 🔹 Local storage save handler
  const handleLocalSubmit = (e) => {
    e.preventDefault();

    // Get existing inquiries
    const existingInquiries =
      JSON.parse(localStorage.getItem("hms_inquiries")) || [];

    // Add new inquiry with timestamp
    const newInquiry = {
      ...formData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    };

    // Save back to localStorage
    localStorage.setItem(
      "hms_inquiries",
      JSON.stringify([...existingInquiries, newInquiry])
    );

    // Keep existing submit logic (future backend)
    if (handleSubmit) {
      handleSubmit(e);
    }

    alert("Inquiry submitted successfully!");
  };

  return (
    <section id="contact" className="contact-section">
      <div className="contact-container">
        {/* Left Column */}
        <div className="contact-info">
          <h2>Looking for Hostel Admission?</h2>
          <p>
            Our team is ready to assist you with any questions. Reach out today!
          </p>

          <ul className="contact-points">
            <li>Easy admission process</li>
            <li>Affordable and transparent fees</li>
            <li>Safe and secure living environment</li>
            <li>Modern amenities for comfortable stay</li>
          </ul>
        </div>

        {/* Right Column – Form */}
        <div className="contact-form-card">
          <h3>Send Us Your Inquiry</h3>

          <form className="contact-form" onSubmit={handleLocalSubmit}>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Your Name"
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your@email.com"
                required
              />
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+1 234 567 8900"
                required
              />
            </div>

            <div className="form-group">
              <label>Message</label>
              <textarea
                name="message"
                rows="4"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="How can we help you?"
                required
              />
            </div>

            <button type="submit" className="submit-btn">
              Submit Inquiry
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
