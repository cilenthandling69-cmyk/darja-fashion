import { Banknote, Building2, CreditCard, Smartphone } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import { useCart } from "../context/CartContext";

const initialAddress = { fullName: "", phone: "", address: "", city: "", state: "", postalCode: "", country: "India" };

export default function Checkout() {
  const [shippingAddress, setShippingAddress] = useState(initialAddress);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    if (!items.length) return toast.error("Your cart is empty");
    setLoading(true);
    try {
      const payload = {
        items: items.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
        })),
        shippingAddress,
        paymentMethod,
      };
      const { data } = await api.post("/orders", payload);
      clearCart();
      toast.success(`Order ${data.order._id.slice(-6).toUpperCase()} placed${paymentMethod === "COD" ? "" : " — payment pending"}`);
      navigate("/orders");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not place order");
    } finally {
      setLoading(false);
    }
  };

  const shipping = subtotal >= 1999 ? 0 : 99;

  return (
    <section className="section container page-top checkout-grid">
      <form className="checkout-form" onSubmit={submit}>
        <span className="eyebrow">DELIVERY DETAILS</span><h1>Checkout</h1>
        {Object.keys(initialAddress).map((field) => (
          <label key={field}>{field.replace(/([A-Z])/g, " $1")}
            <input required value={shippingAddress[field]} onChange={(e) => setShippingAddress({ ...shippingAddress, [field]: e.target.value })} />
          </label>
        ))}
        <fieldset className="payment-methods">
          <legend>Payment method</legend>
          {[
            ["COD", "Cash on delivery", "Pay when your order arrives", Banknote],
            ["UPI", "UPI", "Google Pay, PhonePe, Paytm", Smartphone],
            ["CARD", "Credit / Debit card", "Visa, Mastercard and RuPay", CreditCard],
            ["NETBANKING", "Net banking", "Pay through your bank", Building2],
          ].map(([value, title, detail, Icon]) => (
            <label key={value} className={paymentMethod === value ? "selected" : ""}>
              <input type="radio" name="paymentMethod" value={value} checked={paymentMethod === value} onChange={(event) => setPaymentMethod(event.target.value)} />
              <Icon size={21} /><span><strong>{title}</strong><small>{detail}</small></span>
            </label>
          ))}
        </fieldset>
        {paymentMethod !== "COD" && <p className="payment-pending-note">Online gateway verification is being configured. Your order will be saved with payment marked as pending.</p>}
        <button className="button button-primary button-full" disabled={loading}>{loading ? "Placing order…" : paymentMethod === "COD" ? "Place COD order" : "Place order — payment pending"}</button>
      </form>
      <aside className="order-summary checkout-summary">
        <h2>Payable amount</h2>
        <div><span>Items</span><strong>₹{subtotal.toLocaleString("en-IN")}</strong></div>
        <div><span>Shipping</span><strong>{shipping ? `₹${shipping}` : "Free"}</strong></div>
        <div className="summary-total"><span>Total</span><strong>₹{(subtotal + shipping).toLocaleString("en-IN")}</strong></div>
        <p>Payment method: {paymentMethod === "COD" ? "Cash on delivery" : paymentMethod === "NETBANKING" ? "Net banking" : paymentMethod}</p>
      </aside>
    </section>
  );
}
