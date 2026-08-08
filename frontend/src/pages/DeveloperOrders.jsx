import { ArrowLeft, Box, CheckCircle2, Clock3, MapPin, PackageCheck, RefreshCw, Truck, UserRound } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import api from "../api/client";

const queues = [
  { id: "pending", label: "Pending", icon: Clock3, statuses: ["pending", "confirmed", "packed"] },
  { id: "placed", label: "Placed", icon: PackageCheck, statuses: ["placed"] },
  { id: "dispatched", label: "Dispatched", icon: Truck, statuses: ["dispatched", "shipped"] },
  { id: "delivered", label: "Delivered", icon: CheckCircle2, statuses: ["delivered"] },
];

const orderStatuses = ["pending", "placed", "confirmed", "packed", "dispatched", "delivered", "cancelled"];
const paymentStatuses = ["pending", "paid", "failed", "refunded"];
const money = (value = 0) => `₹${Number(value).toLocaleString("en-IN")}`;

export default function DeveloperOrders() {
  const [orders, setOrders] = useState([]);
  const [activeQueue, setActiveQueue] = useState("placed");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState("");

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/orders");
      setOrders(data.orders);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not load orders");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    api.get("/orders")
      .then(({ data }) => { if (active) setOrders(data.orders); })
      .catch((error) => { if (active) toast.error(error.response?.data?.message || "Could not load orders"); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const counts = useMemo(() => Object.fromEntries(queues.map((queue) => [
    queue.id,
    orders.filter((order) => queue.statuses.includes(order.orderStatus)).length,
  ])), [orders]);

  const visibleOrders = useMemo(() => {
    const queue = queues.find((item) => item.id === activeQueue);
    return orders.filter((order) => queue.statuses.includes(order.orderStatus));
  }, [activeQueue, orders]);

  const updateOrder = async (order, changes) => {
    setUpdating(order._id);
    try {
      const { data } = await api.patch(`/orders/${order._id}/status`, changes);
      setOrders((current) => current.map((item) => item._id === order._id ? { ...item, ...data.order } : item));
      toast.success("Order updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not update order");
    } finally {
      setUpdating("");
    }
  };

  return (
    <section className="section container page-top developer-orders-page">
      <div className="developer-heading">
        <div>
          <Link to="/developer/dashboard" className="back-link"><ArrowLeft size={17} /> Dashboard</Link>
          <span className="eyebrow">ORDER OPERATIONS</span>
          <h1>Manage orders</h1>
          <p>Review customer details, items, payment, delivery address, and fulfilment status.</p>
        </div>
        <button className="button button-ghost" onClick={loadOrders} disabled={loading}><RefreshCw size={17} /> Refresh</button>
      </div>

      <div className="order-queue-tabs" role="tablist" aria-label="Order queues">
        {queues.map(({ id, label, icon: Icon }) => (
          <button key={id} role="tab" aria-selected={activeQueue === id} className={activeQueue === id ? "active" : ""} onClick={() => setActiveQueue(id)}>
            <Icon size={20} /><span>{label}</span><strong>{counts[id] || 0}</strong>
          </button>
        ))}
      </div>

      {loading ? <div className="loader">Loading orders…</div> : (
        <div className="developer-order-list">
          {visibleOrders.map((order) => (
            <article className="developer-order-card" key={order._id}>
              <header className="developer-order-head">
                <div>
                  <span className={`order-status-badge ${order.orderStatus}`}>{order.orderStatus}</span>
                  <h2>Order #{order._id.slice(-8).toUpperCase()}</h2>
                  <time>{new Date(order.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</time>
                </div>
                <strong className="developer-order-total">{money(order.total)}</strong>
              </header>

              <div className="developer-order-details">
                <section>
                  <h3><UserRound size={17} /> Customer</h3>
                  <strong>{order.shippingAddress?.fullName || order.customer?.name}</strong>
                  <a href={`mailto:${order.customer?.email}`}>{order.customer?.email}</a>
                  <a href={`tel:${order.shippingAddress?.phone}`}>{order.shippingAddress?.phone}</a>
                </section>
                <section>
                  <h3><MapPin size={17} /> Delivery address</h3>
                  <p>{order.shippingAddress?.address}</p>
                  <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}</p>
                  <p>{order.shippingAddress?.country}</p>
                </section>
                <section>
                  <h3><CheckCircle2 size={17} /> Payment</h3>
                  <p><span>Method</span><strong>{order.paymentMethod}</strong></p>
                  <p><span>Subtotal</span><strong>{money(order.subtotal)}</strong></p>
                  <p><span>Shipping</span><strong>{order.shippingFee ? money(order.shippingFee) : "Free"}</strong></p>
                </section>
              </div>

              <div className="developer-order-items">
                <h3><Box size={17} /> Items ({order.items.reduce((sum, item) => sum + item.quantity, 0)})</h3>
                {order.items.map((item, index) => (
                  <div className="developer-order-item" key={`${item.product}-${index}`}>
                    <img src={item.image} alt={item.name} />
                    <div><strong>{item.name}</strong><small>Size: {item.size} · Color: {item.color}</small></div>
                    <span>{item.quantity} × {money(item.price)}</span>
                    <strong>{money(item.price * item.quantity)}</strong>
                  </div>
                ))}
              </div>

              <footer className="developer-order-actions">
                <label>Order status
                  <select disabled={updating === order._id} value={order.orderStatus} onChange={(event) => updateOrder(order, { orderStatus: event.target.value })}>
                    {orderStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
                  </select>
                </label>
                <label>Payment status
                  <select disabled={updating === order._id} value={order.paymentStatus} onChange={(event) => updateOrder(order, { paymentStatus: event.target.value })}>
                    {paymentStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
                  </select>
                </label>
                {order.orderStatus !== "dispatched" && order.orderStatus !== "delivered" && (
                  <button className="button button-primary" disabled={updating === order._id} onClick={() => updateOrder(order, { orderStatus: "dispatched" })}><Truck size={17} /> Dispatch order</button>
                )}
              </footer>
            </article>
          ))}
          {!visibleOrders.length && <div className="empty-order-queue"><PackageCheck size={38} /><h2>No {activeQueue} orders</h2><p>Orders in this stage will appear here.</p></div>}
        </div>
      )}
    </section>
  );
}
