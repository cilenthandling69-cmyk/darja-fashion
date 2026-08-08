import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Truck, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get("/products?featured=true&limit=4")
      .then(({ data }) => setProducts(data.products))
      .catch(() => setProducts([]));
  }, []);

  return (
    <>
      <section className="hero">
        <div className="hero-orb orb-one" />
        <div className="hero-orb orb-two" />
        <div className="container hero-grid">
          <motion.div
            className="hero-copy"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="hero-kicker"><Sparkles size={16} /> DROP 01 — THE DARK MOTION</span>
            <h1>Wear the energy.<br /><em>Own the frame.</em></h1>
            <p>Darja Fashion blends luxury minimalism with fearless streetwear, built for people who never enter quietly.</p>
            <div className="hero-actions">
              <Link to="/shop" className="button button-primary">Shop the drop <ArrowRight size={18} /></Link>
              <a href="#featured" className="button button-ghost">Explore collection</a>
            </div>
          </motion.div>

          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.92, rotate: 2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
          >
            <img
              src="https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=1400&q=90"
              alt="Darja Fashion streetwear"
            />
            <motion.div
              className="floating-label"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              LIMITED<br /><strong>EDITION</strong>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="trust-strip">
        <div className="container trust-grid">
          <div><Truck /><span><strong>Fast delivery</strong> Across India</span></div>
          <div><ShieldCheck /><span><strong>Secure checkout</strong> Protected ordering</span></div>
          <div><Sparkles /><span><strong>Premium quality</strong> Curated materials</span></div>
        </div>
      </section>

      <section className="section container" id="featured">
        <div className="section-heading">
          <div>
            <span className="eyebrow">CURATED FOR YOU</span>
            <h2>Featured pieces</h2>
          </div>
          <Link to="/shop" className="arrow-link">View all <ArrowRight size={18} /></Link>
        </div>
        <div className="product-grid">
          {products.map((product) => <ProductCard key={product._id} product={product} />)}
        </div>
      </section>

      <section className="editorial-section">
        <div className="container editorial-grid">
          <motion.img
            src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=90"
            alt="Fashion editorial"
            initial={{ opacity: 0, x: -35 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          />
          <motion.div
            initial={{ opacity: 0, x: 35 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="eyebrow">DARJA MANIFESTO</span>
            <h2>Not made to blend in.</h2>
            <p>Every Darja silhouette is designed around movement, contrast, and identity. Luxury should feel alive—not untouchable.</p>
            <Link to="/shop" className="button button-light">Build your look <ArrowRight size={18} /></Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
