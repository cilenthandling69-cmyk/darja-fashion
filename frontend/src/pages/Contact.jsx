import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaEnvelope, FaInstagram, FaMapMarkerAlt, FaPaperPlane, FaPhoneAlt, FaPlus } from "react-icons/fa";
import api from "../api/client";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

const faqs = [
  ["How long does delivery take?", "Most orders are delivered across India within 4–8 business days after dispatch."],
  ["Can I change my order?", "Contact us quickly with your order details. We can help before the order is packed or dispatched."],
  ["Do you accept collaborations?", "Yes. Select ‘Collaboration’ as the subject and include your profile or portfolio details."],
];

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [sending, setSending] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  const change = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setSending(true);
    try {
      const { data } = await api.post("/contact", form);
      toast.success(data.message || "Message sent successfully");
      setForm(initialForm);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not send your message");
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <section className="contact-hero page-top">
        <div className="contact-marquee" aria-hidden="true">
          <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ duration: 22, repeat: Infinity, ease: "linear" }}>
            LET’S CREATE SOMETHING BOLD — LET’S CREATE SOMETHING BOLD — LET’S CREATE SOMETHING BOLD —
          </motion.div>
        </div>
        <div className="container contact-hero-grid">
          <motion.div initial={{ opacity: 0, x: -35 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
            <span className="eyebrow">CONTACT DARJA</span>
            <h1>Say hello.<br /><em>We’re listening.</em></h1>
            <p>Questions about a product, an order, styling, or a collaboration? Send us a message and our team will get back to you.</p>
          </motion.div>
          <motion.div
            className="contact-hero-art"
            initial={{ opacity: 0, scale: 0.9, rotate: 3 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <img src="https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1200&q=88" alt="Darja Fashion studio" />
            <motion.span animate={{ rotate: 360 }} transition={{ duration: 24, repeat: Infinity, ease: "linear" }}>DARJA • CONTACT • STUDIO • </motion.span>
          </motion.div>
        </div>
      </section>

      <section className="contact-main section">
        <div className="container contact-layout">
          <motion.aside className="contact-details" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="eyebrow">FIND US</span>
            <h2>Start a conversation.</h2>
            <p>We usually respond within one business day.</p>

            <a href="mailto:hello@darjafashion.com"><FaEnvelope /><span><small>Email</small>hello@darjafashion.com</span></a>
            <a href="tel:+919876543210"><FaPhoneAlt /><span><small>Phone</small>+91 98765 43210</span></a>
            <div><FaMapMarkerAlt /><span><small>Studio</small>Mumbai, India</span></div>
            <a href="https://instagram.com" target="_blank" rel="noreferrer"><FaInstagram /><span><small>Instagram</small>@darjafashion</span></a>

            <div className="contact-hours">
              <span>Studio hours</span>
              <p>Monday–Saturday<br />10:00 AM–7:00 PM IST</p>
            </div>
          </motion.aside>

          <motion.form className="contact-form" onSubmit={submit} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="contact-form-heading">
              <span>01</span>
              <div><h2>Send a message</h2><p>Your message will be saved securely in the Darja developer dashboard.</p></div>
            </div>

            <div className="contact-form-grid">
              <label>Full name<input name="name" value={form.name} onChange={change} required maxLength="90" placeholder="Your name" /></label>
              <label>Email address<input name="email" type="email" value={form.email} onChange={change} required placeholder="you@example.com" /></label>
              <label>Phone number<input name="phone" value={form.phone} onChange={change} maxLength="24" placeholder="Optional" /></label>
              <label>Subject<select name="subject" value={form.subject} onChange={change} required><option value="">Choose a subject</option><option>Product enquiry</option><option>Order support</option><option>Returns and exchange</option><option>Collaboration</option><option>Other</option></select></label>
            </div>
            <label className="contact-message-field">Message<textarea name="message" rows="7" value={form.message} onChange={change} required maxLength="2500" placeholder="Tell us how we can help..." /></label>
            <button className="button button-primary contact-submit" disabled={sending}>
              <FaPaperPlane /> {sending ? "Sending…" : "Send message"}
            </button>
          </motion.form>
        </div>
      </section>

      <section className="contact-faq section">
        <div className="container contact-faq-grid">
          <div><span className="eyebrow">QUICK ANSWERS</span><h2>Before you message us.</h2></div>
          <div className="faq-list">
            {faqs.map(([question, answer], index) => (
              <article key={question} className={openFaq === index ? "open" : ""}>
                <button type="button" onClick={() => setOpenFaq(openFaq === index ? -1 : index)}>
                  <span>{question}</span><motion.i animate={{ rotate: openFaq === index ? 45 : 0 }}><FaPlus /></motion.i>
                </button>
                <AnimatePresence initial={false}>
                  {openFaq === index && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                      <p>{answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
