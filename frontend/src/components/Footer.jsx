import { FaEnvelope, FaInstagram, FaMapMarkerAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-marquee" aria-hidden="true">
        <div>
          DARJA FASHION — OWN THE FRAME — DARJA FASHION — OWN THE FRAME — DARJA FASHION — OWN THE FRAME —
        </div>
      </div>
      <div className="container footer-grid">
        <div>
          <div className="brand footer-brand">DARJA <span>FASHION</span></div>
          <p>Luxury streetwear shaped for bold movement, clean silhouettes, and everyday confidence.</p>
        </div>
        <div>
          <h4>Explore</h4>
          <Link to="/shop">New collection</Link>
          <Link to="/about">Our story</Link>
          <Link to="/contact">Contact us</Link>
          <Link to="/developer/login">Developer login</Link>
        </div>
        <div>
          <h4>Contact</h4>
          <p><FaEnvelope /> hello@darjafashion.com</p>
          <p><FaMapMarkerAlt /> India</p>
          <p><FaInstagram /> @darjafashion</p>
        </div>
      </div>
      <div className="footer-bottom">© {new Date().getFullYear()} Darja Fashion. Built with MERN.</div>
    </footer>
  );
}
