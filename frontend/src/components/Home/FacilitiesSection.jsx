import {
  Building2,
  Shield,
  Wifi,
  UtensilsCrossed,
  Droplet,
  Zap,
} from "lucide-react";
import FacilityCard from "./FacilityCard";
import "../../styles/Home/FacilitiesSection.css";

const FacilitiesSection = () => {
  return (
    <section id="facilities" className="section">
      <h2 className="section-title">Hostel Facilities</h2>

      <div className="facility-grid">
        <FacilityCard icon={<Building2 />} title="Spacious Rooms" desc="Comfortable and ventilated rooms." />
        <FacilityCard icon={<Shield />} title="24×7 Security" desc="CCTV & staff security." />
        <FacilityCard icon={<Wifi />} title="High-Speed Wi-Fi" desc="Fast internet access." />
        <FacilityCard icon={<UtensilsCrossed />} title="Mess Facility" desc="Healthy meals." />
        <FacilityCard icon={<Droplet />} title="Clean Water" desc="RO purified water." />
        <FacilityCard icon={<Zap />} title="Power Backup" desc="Generator support." />
      </div>
    </section>
  );
};

export default FacilitiesSection;
