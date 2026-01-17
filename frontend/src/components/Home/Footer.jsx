import { Instagram, Facebook, Twitter, Linkedin } from "lucide-react";
// import "../../styles/Home/";

const Footer = () => {
  return (
    <footer className="footer">
      <p>© 2024 Hostel Management System</p>
      <div className="socials">
        <Instagram />
        <Facebook />
        <Twitter />
        <Linkedin />
      </div>
    </footer>
  );
};

export default Footer;
