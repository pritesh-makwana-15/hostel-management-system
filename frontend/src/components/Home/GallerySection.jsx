import GalleryImage from "./GalleryImage";
import "../../styles/Home/GallerySection.css";

const GallerySection = () => {
  return (
    <section id="gallery" className="section">
      <h2 className="section-title">Hostel Gallery</h2>

      <div className="gallery-grid">
        <GalleryImage src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5" />
        <GalleryImage src="https://images.unsplash.com/photo-1497366216548-37526070297c" />
        <GalleryImage src="https://images.unsplash.com/photo-1517502884422-41eaead166d4" />
        <GalleryImage src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab" />
      </div>
    </section>
  );
};

export default GallerySection;
