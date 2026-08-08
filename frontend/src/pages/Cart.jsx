import { Minus, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { items, removeItem, updateQuantity, subtotal } = useCart();
  const shipping = subtotal >= 1999 || subtotal === 0 ? 0 : 99;

  return (
    <section className="section container page-top">
      <div className="page-header compact"><span className="eyebrow">YOUR BAG</span><h1>Shopping cart</h1></div>
      {!items.length ? (
        <div className="empty-state"><h3>Your cart is empty</h3><p>Add something bold to start your look.</p><Link className="button button-primary" to="/shop">Shop now</Link></div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            {items.map((item) => (
              <article className="cart-item" key={item.key}>
                <img src={item.product.images[0]} alt={item.product.name} />
                <div className="cart-item-copy">
                  <Link to={`/product/${item.product.slug}`}><h3>{item.product.name}</h3></Link>
                  <p>{item.size} · {item.color}</p>
                  <strong>₹{item.product.price.toLocaleString("en-IN")}</strong>
                </div>
                <div className="quantity-control">
                  <button onClick={() => updateQuantity(item.key, item.quantity - 1)}><Minus size={15} /></button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.key, item.quantity + 1)}><Plus size={15} /></button>
                </div>
                <button className="remove-button" onClick={() => removeItem(item.key)}><Trash2 size={18} /></button>
              </article>
            ))}
          </div>
          <aside className="order-summary">
            <h2>Order summary</h2>
            <div><span>Subtotal</span><strong>₹{subtotal.toLocaleString("en-IN")}</strong></div>
            <div><span>Shipping</span><strong>{shipping ? `₹${shipping}` : "Free"}</strong></div>
            <div className="summary-total"><span>Total</span><strong>₹{(subtotal + shipping).toLocaleString("en-IN")}</strong></div>
            <Link className="button button-primary button-full" to="/checkout">Checkout</Link>
          </aside>
        </div>
      )}
    </section>
  );
}
