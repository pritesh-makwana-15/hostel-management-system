const FacilityCard = ({ icon, title, desc }) => {
  return (
    <div className="facility-card">
      {icon}
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  );
};

export default FacilityCard;
