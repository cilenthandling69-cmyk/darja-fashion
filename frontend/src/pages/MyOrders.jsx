import { Box, Check, ChevronDown, Clock3, MapPin, PackageCheck, RefreshCw, ShoppingBag, Truck } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import api from "../api/client";

const stages = [
  { id: "placed", label: "Order placed", icon: ShoppingBag },
  { id: "confirmed", label: "Confirmed", icon: PackageCheck },
  { id: "packed", label: "Packed", icon: Box },
  { id: "dispatched", label: "Dispatched", icon: Truck },
  { id: "delivered", label: "Delivered", icon: Check },
];

const statusRank = {
  pending: 0, placed: 0, confirmed: 1, packed: 2,
  dispatched: 3, shipped: 3, delivered: 4,
};

const equivalentStatuses = {
  placed: ["placed", "pending"],
  confirmed: ["confirmed"],
  packed: ["packed"],
  dispatched: ["dispatched", "shipped"],
  delivered: ["delivered"],
};

const money = (value = 0) => `₹${Number(value).toLocaleString("en-IN")}`;

function historyDate(order, stage) {
  const entry = order.statusHistory?.find((item) => equivalentStatuses[stage].includes(item.status));
  if (entry) return new Date(entry.changedAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
  return stage === "placed" ? new Date(order.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "";
}

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState("");

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/orders/mine");
      setOrders(data.orders);
      setExpanded((current) => current || data.orders[0]?._id || "");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not load your orders");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    api.get("/orders/mine")
      .then(({ data }) => { if (active) { setOrders(data.orders); setExpanded(data.orders[0]?._id || ""); } })
      .catch((error) => { if (active) toast.error(error.response?.data?.message || "Could not load your orders"); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  return (
    <section className="section container page-top customer-orders-page">
      <div className="developer-heading customer-orders-heading">
        <div><span className="eyebrow">YOUR PURCHASES</span><h1>Track your orders</h1><p>Follow every order from confirmation to your doorstep.</p></div>
        <button className="button button-ghost" onClick={loadOrders} disabled={loading}><RefreshCw size={17} /> Refresh status</button>
      </div>

      {loading ? <div className="loader">Loading your orders…</div> : orders.length ? (
        <div className="customer-order-list">
          {orders.map((order) => {
            const isOpen = expanded === order._id;
            const currentRank = statusRank[order.orderStatus] ?? 0;
            const cancelled = order.orderStatus === "cancelled";
            return (
              <article className={`customer-order-card ${cancelled ? "cancelled" : ""}`} key={order._id}>
                <button className="customer-order-summary" onClick={() => setExpanded(isOpen ? "" : order._id)} aria-expanded={isOpen}>
                  <div><span className={`order-status-badge ${order.orderStatus}`}>{order.orderStatus}</span><h2>Order #{order._id.slice(-8).toUpperCase()}</h2><small>{new Date(order.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}</small></div>
                  <div className="customer-order-summary-right"><strong>{money(order.total)}</strong><span>{order.items.reduce((sum, item) => sum + item.quantity, 0)} items</span><ChevronDown className={isOpen ? "open" : ""} /></div>
                </button>

                {isOpen && <div className="customer-order-body">
                  {cancelled ? <div className="order-cancelled-notice"><Clock3 /> This order was cancelled. Contact support if you need help.</div> : (
                    <div className="tracking-timeline">
                      {stages.map(({ id, label, icon: Icon }, index) => {
                        const done = index <= currentRank;
                        const current = index === currentRank;
                        return <div key={id} className={`tracking-stage ${done ? "done" : ""} ${current ? "current" : ""}`}><i><Icon size={19} /></i><strong>{label}</strong><small>{done ? historyDate(order, id) : "Waiting"}</small></div>;
                      })}
                    </div>
                  )}

                  <div className="customer-order-content">
                    <div className="customer-order-products">
                      <h3>Order items</h3>
                      {order.items.map((item, index) => <div className="customer-tracking-item" key={`${item.product}-${index}`}><img src={item.image} alt={item.name} /><div><strong>{item.name}</strong><small>{item.quantity} × {money(item.price)} · {item.size} · {item.color}</small></div><strong>{money(item.quantity * item.price)}</strong></div>)}
                    </div>
                    <aside className="customer-delivery-card"><h3><MapPin size={17} /> Delivery details</h3><strong>{order.shippingAddress.fullName}</strong><p>{order.shippingAddress.address}<br />{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}<br />{order.shippingAddress.country}</p><p>{order.shippingAddress.phone}</p><div><span>Payment</span><strong>{order.paymentMethod} · {order.paymentStatus}</strong></div><div><span>Order total</span><strong>{money(order.total)}</strong></div></aside>
                  </div>
                </div>}
              </article>
            );
          })}
        </div>
      ) : <div className="empty-order-queue"><ShoppingBag size={40} /><h2>No orders yet</h2><p>Your purchases will appear here after checkout.</p><Link to="/shop" className="button button-primary">Start shopping</Link></div>}
    </section>
  );
}
