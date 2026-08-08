import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaQuoteLeft } from "react-icons/fa";

const values = [
  {
    number: "01",
    title: "Identity first",
    text: "We design for people who use clothing as a language, not as a uniform.",
  },
  {
    number: "02",
    title: "Quiet luxury",
    text: "Premium construction, thoughtful texture, and details that reward a closer look.",
  },
  {
    number: "03",
    title: "Fearless movement",
    text: "Every silhouette is shaped to move confidently from street to spotlight.",
  },
];

const stats = [
  ["2026", "Brand era"],
  ["100%", "Original direction"],
  ["24/7", "Creative energy"],
  ["India", "Designed from"],
];

const reveal = {
  hidden: { opacity: 0, y: 34 },
  visible: (index = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function About() {
  const heroRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 95]);
  const typeY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : -70]);

  return (
    <>
      <section ref={heroRef} className="about-hero page-top">
        <motion.div className="about-giant-type about-type-top" style={{ y: typeY }} aria-hidden="true">
          DARJA
        </motion.div>
        <motion.div className="about-giant-type about-type-bottom" style={{ y: typeY }} aria-hidden="true">
          FASHION
        </motion.div>

        <div className="container about-editorial-stage">
          <motion.div
            className="about-mini-note note-left"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 }}
          >
            <span>EST. 2026</span>
            <p>Luxury for the expressive generation.</p>
          </motion.div>

          <motion.div className="about-orbit" animate={reduceMotion ? undefined : { rotate: 360 }} transition={{ duration: 34, repeat: Infinity, ease: "linear" }}>
            <span>FASHION</span><span>IDENTITY</span><span>MOTION</span><span>ATTITUDE</span>
          </motion.div>

          <motion.div
            className="about-main-portrait"
            style={{ y: imageY }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <img
              src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1100&q=88"
              alt="Darja Fashion editorial"
            />
            <motion.span
              className="about-image-stamp"
              animate={reduceMotion ? undefined : { y: [0, -9, 0], rotate: [-3, 2, -3] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              ORIGINAL<br />DIRECTION
            </motion.span>
          </motion.div>

          <motion.div
            className="about-side-image about-side-left"
            initial={{ opacity: 0, rotate: -8, x: -30 }}
            animate={{ opacity: 1, rotate: -3, x: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            <img src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=700&q=85" alt="Fashion detail" />
            <span>MODERN MUSE</span>
          </motion.div>

          <motion.div
            className="about-side-image about-side-right"
            initial={{ opacity: 0, rotate: 8, x: 30 }}
            animate={{ opacity: 1, rotate: 3, x: 0 }}
            transition={{ delay: 0.42, duration: 0.7 }}
          >
            <img src="https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=700&q=85" alt="Premium fashion" />
            <span>NEW LANGUAGE</span>
          </motion.div>

          <motion.div
            className="about-script-title"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Own it.
          </motion.div>

          <motion.div
            className="about-mini-note note-right"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.45 }}
          >
            <span>THE MANIFESTO</span>
            <p>We do not follow the frame. We redesign it.</p>
          </motion.div>
        </div>
      </section>

      <section className="about-intro section">
        <div className="container about-intro-grid">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={reveal}>
            <span className="eyebrow">WHO WE ARE</span>
            <h1>Clothing with a point of view.</h1>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={reveal} custom={1}>
            <p>
              Darja Fashion is an independent clothing label built around contrast: polished and rebellious,
              minimal and expressive, familiar and completely new. We turn everyday pieces into visual statements.
            </p>
            <p>
              Our collections are designed for real movement and real personality—premium enough to feel special,
              effortless enough to become part of your daily identity.
            </p>
            <Link to="/shop" className="arrow-link about-link">Discover the collection <FaArrowRight /></Link>
          </motion.div>
        </div>
      </section>

      <section className="about-values section">
        <div className="container">
          <motion.div className="section-heading" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={reveal}>
            <div><span className="eyebrow">OUR DESIGN CODE</span><h2>What Darja stands for</h2></div>
          </motion.div>
          <div className="about-value-grid">
            {values.map((value, index) => (
              <motion.article
                key={value.number}
                custom={index}
                variants={reveal}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.25 }}
                whileHover={{ y: -10, rotate: index === 1 ? 0 : index === 0 ? -1 : 1 }}
              >
                <span>{value.number}</span>
                <h3>{value.title}</h3>
                <p>{value.text}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-quote-section">
        <div className="container about-quote-grid">
          <motion.div className="about-quote-image" initial={{ opacity: 0, x: -35 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <img src="https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=1200&q=88" alt="Darja fashion collection" />
          </motion.div>
          <motion.blockquote initial={{ opacity: 0, x: 35 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <FaQuoteLeft />
            <p>Style becomes powerful when it feels unmistakably yours.</p>
            <cite>— The Darja philosophy</cite>
          </motion.blockquote>
        </div>
      </section>

      <section className="about-stats section">
        <div className="container about-stats-grid">
          {stats.map(([number, label], index) => (
            <motion.div key={label} custom={index} variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <strong>{number}</strong><span>{label}</span>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
}
