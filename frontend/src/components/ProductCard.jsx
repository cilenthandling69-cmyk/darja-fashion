import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { addItem } = useCart();

  const add = () => {
    addItem(product);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <motion.article
      className="product-card"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.35 }}
    >
      <Link to={`/product/${product.slug}`} className="product-image-wrap">
        <img src={product.images?.[0]} alt={product.name} className="product-image" />
        {product.featured && <span className="product-badge">Featured</span>}
      </Link>
      <div className="product-info">
        <span className="eyebrow">{product.category}</span>
        <Link to={`/product/${product.slug}`}><h3>{product.name}</h3></Link>
        <div className="price-row">
          <strong>₹{product.price.toLocaleString("en-IN")}</strong>
          {product.compareAtPrice > product.price && (
            <del>₹{product.compareAtPrice.toLocaleString("en-IN")}</del>
          )}
        </div>
        <button className="button button-dark button-full" onClick={add} disabled={product.stock < 1}>
          <ShoppingBag size={17} /> {product.stock < 1 ? "Sold out" : "Add to cart"}
        </button>
      </div>
    </motion.article>
  );
}
