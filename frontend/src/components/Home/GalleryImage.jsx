const GalleryImage = ({ src }) => {
  return (
    <div className="gallery-card">
      <img src={src} alt="Gallery" />
    </div>
  );
};

export default GalleryImage;
