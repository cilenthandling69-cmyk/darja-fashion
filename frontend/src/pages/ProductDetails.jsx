import { motion } from "framer-motion";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import api from "../api/client";
import { useCart } from "../context/CartContext";

export default function ProductDetails() {
  const { slug } = useParams();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");

  useEffect(() => {
    api.get(`/products/${slug}`).then(({ data }) => {
      setProduct(data.product);
      setSize(data.product.sizes?.[0] || "M");
      setColor(data.product.colors?.[0] || "Black");
    });
  }, [slug]);

  if (!product) return <div className="loader page-top">Loading product…</div>;

  const add = () => {
    addItem(product, { size, color });
    toast.success("Added to cart");
  };

  return (
    <section className="section container page-top">
      <Link to="/shop" className="back-link"><ArrowLeft size={17} /> Back to shop</Link>
      <div className="product-detail-grid">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="detail-image">
          <img src={product.images[0]} alt={product.name} />
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="detail-copy">
          <span className="eyebrow">{product.category}</span>
          <h1>{product.name}</h1>
          <div className="detail-price">₹{product.price.toLocaleString("en-IN")}</div>
          <p>{product.description}</p>

          <div className="option-group">
            <label>Size</label>
            <div className="option-buttons">
              {product.sizes.map((item) => <button key={item} className={size === item ? "active" : ""} onClick={() => setSize(item)}>{item}</button>)}
            </div>
          </div>
          <div className="option-group">
            <label>Color</label>
            <div className="option-buttons">
              {product.colors.map((item) => <button key={item} className={color === item ? "active" : ""} onClick={() => setColor(item)}>{item}</button>)}
            </div>
          </div>

          <button className="button button-primary button-full detail-add" onClick={add} disabled={product.stock < 1}>
            <ShoppingBag size={18} /> {product.stock < 1 ? "Sold out" : "Add to cart"}
          </button>
          <small>{product.stock} pieces available</small>
        </motion.div>
      </div>
    </section>
  );
}
