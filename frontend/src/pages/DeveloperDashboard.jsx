import { Edit3, Mail, PackageCheck, PackagePlus, RefreshCw, Send, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import api from "../api/client";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  compareAtPrice: "",
  category: "Hoodies",
  image: "",
  sizes: "S, M, L, XL",
  colors: "Black",
  stock: "10",
  featured: false,
  active: true,
};

export default function DeveloperDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [messages, setMessages] = useState([]);
  const [replies, setReplies] = useState({});
  const [replyingId, setReplyingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const [productResponse, orderResponse, contactResponse] = await Promise.all([
        api.get("/products/developer/all"),
        api.get("/orders"),
        api.get("/contact"),
      ]);
      setProducts(productResponse.data.products);
      setOrders(orderResponse.data.orders);
      setMessages(contactResponse.data.messages);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not load developer data");
    }
  };

  useEffect(() => { load(); }, []);

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    const payload = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      compareAtPrice: Number(form.compareAtPrice) || 0,
      category: form.category,
      images: [form.image],
      sizes: form.sizes.split(",").map((item) => item.trim()).filter(Boolean),
      colors: form.colors.split(",").map((item) => item.trim()).filter(Boolean),
      stock: Number(form.stock),
      featured: form.featured,
      active: form.active,
    };

    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
        toast.success("Product updated");
      } else {
        await api.post("/products", payload);
        toast.success("Product added");
      }
      setForm(emptyForm);
      setEditingId(null);
      await load();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not save product");
    } finally {
      setSaving(false);
    }
  };

  const edit = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      compareAtPrice: product.compareAtPrice || "",
      category: product.category,
      image: product.images?.[0] || "",
      sizes: product.sizes.join(", "),
      colors: product.colors.join(", "),
      stock: product.stock,
      featured: product.featured,
      active: product.active,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this product permanently?")) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success("Product deleted");
      load();
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  const updateOrder = async (id, orderStatus) => {
    try {
      await api.patch(`/orders/${id}/status`, { orderStatus });
      toast.success("Order status updated");
      load();
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  const updateMessage = async (id, status) => {
    try {
      await api.patch(`/contact/${id}/status`, { status });
      toast.success("Message status updated");
      load();
    } catch (error) {
      toast.error(error.response?.data?.message || "Message update failed");
    }
  };

  const sendReply = async (message) => {
    const reply = (replies[message._id] ?? message.reply ?? "").trim();
    if (!reply) return toast.error("Write a reply first");
    setReplyingId(message._id);
    try {
      const { data } = await api.patch(`/contact/${message._id}/reply`, { reply });
      setMessages((current) => current.map((item) => item._id === message._id ? data.message : item));
      setReplies((current) => ({ ...current, [message._id]: reply }));
      const subject = `Re: ${message.subject}`;
      window.location.href = `mailto:${encodeURIComponent(message.email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(reply)}`;
      toast.success("Reply saved — opening your email app to send it");
    } catch (error) {
      toast.error(error.response?.data?.message || "Reply could not be saved");
    } finally {
      setReplyingId(null);
    }
  };

  return (
    <section className="section container page-top developer-page">
      <div className="developer-heading">
        <div><span className="eyebrow">RESTRICTED ACCESS</span><h1>Developer dashboard</h1><p>Add products, manage orders, and respond to contact enquiries.</p></div>
        <div className="developer-heading-actions">
          <Link className="button button-dark" to="/developer/orders"><PackageCheck size={17} /> Manage orders</Link>
          <button className="button button-ghost" onClick={load}><RefreshCw size={17} /> Refresh</button>
        </div>
      </div>

      <div className="developer-grid">
        <form className="admin-form" onSubmit={submit}>
          <h2><PackagePlus size={21} /> {editingId ? "Edit product" : "Add product"}</h2>
          <label>Product name<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
          <label>Description<textarea required rows="5" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
          <div className="form-row">
            <label>Price<input required type="number" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></label>
            <label>Compare price<input type="number" min="0" value={form.compareAtPrice} onChange={(e) => setForm({ ...form, compareAtPrice: e.target.value })} /></label>
          </div>
          <div className="form-row">
            <label>Category<select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}><option>Hoodies</option><option>Jackets</option><option>T-Shirts</option><option>Bottomwear</option><option>Co-ords</option><option>Accessories</option></select></label>
            <label>Stock<input required type="number" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} /></label>
          </div>
          <label>Image URL<input type="url" required value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} /></label>
          <label>Sizes, comma separated<input value={form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })} /></label>
          <label>Colors, comma separated<input value={form.colors} onChange={(e) => setForm({ ...form, colors: e.target.value })} /></label>
          <div className="checkbox-row"><label><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Featured</label><label><input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} /> Active</label></div>
          <div className="form-actions">
            <button className="button button-primary" disabled={saving}>{saving ? "Saving…" : editingId ? "Update product" : "Add product"}</button>
            {editingId && <button type="button" className="button button-ghost" onClick={() => { setEditingId(null); setForm(emptyForm); }}>Cancel</button>}
          </div>
        </form>

        <div className="admin-list-panel">
          <h2>Products ({products.length})</h2>
          <div className="admin-product-list">
            {products.map((product) => (
              <article key={product._id}>
                <img src={product.images?.[0]} alt={product.name} />
                <div><h3>{product.name}</h3><p>{product.category} · ₹{product.price.toLocaleString("en-IN")} · Stock {product.stock}</p><span className={product.active ? "status active" : "status"}>{product.active ? "Active" : "Hidden"}</span></div>
                <button onClick={() => edit(product)} title="Edit"><Edit3 size={18} /></button>
                <button onClick={() => remove(product._id)} title="Delete"><Trash2 size={18} /></button>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className="orders-panel messages-panel">
        <h2><Mail size={20} /> Contact messages ({messages.length})</h2>
        <div className="contact-message-list">
          {messages.map((message) => (
            <article key={message._id} className={`developer-message ${message.status}`}>
              <div className="developer-message-head">
                <div><strong>{message.name}</strong><a href={`mailto:${message.email}`}>{message.email}</a></div>
                <select value={message.status} onChange={(e) => updateMessage(message._id, e.target.value)}><option>new</option><option>read</option><option>replied</option></select>
              </div>
              <h3>{message.subject}</h3>
              <p>{message.message}</p>
              <small>{message.phone || "No phone"} · {new Date(message.createdAt).toLocaleString()}</small>
              {message.reply && (
                <div className="saved-contact-reply"><strong>Saved reply</strong><p>{message.reply}</p>{message.repliedAt && <small>{new Date(message.repliedAt).toLocaleString()}</small>}</div>
              )}
              <div className="contact-reply-box">
                <label>Reply to {message.name}</label>
                <textarea rows="4" maxLength="5000" placeholder="Write your reply here…" value={replies[message._id] ?? message.reply ?? ""} onChange={(event) => setReplies((current) => ({ ...current, [message._id]: event.target.value }))} />
                <button className="button button-dark" disabled={replyingId === message._id} onClick={() => sendReply(message)}><Send size={16} /> {replyingId === message._id ? "Saving…" : "Save & open email"}</button>
              </div>
            </article>
          ))}
          {!messages.length && <p className="empty-table">No contact messages yet.</p>}
        </div>
      </div>

      <div className="orders-panel">
        <h2>Recent orders ({orders.length})</h2>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Order</th><th>Customer</th><th>Total</th><th>Payment</th><th>Status</th></tr></thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>#{order._id.slice(-6).toUpperCase()}</td>
                  <td>{order.customer?.name}<small>{order.customer?.email}</small></td>
                  <td>₹{order.total.toLocaleString("en-IN")}</td>
                  <td>{order.paymentMethod} · {order.paymentStatus}</td>
                  <td><select value={order.orderStatus} onChange={(e) => updateOrder(order._id, e.target.value)}><option>placed</option><option>confirmed</option><option>packed</option><option>shipped</option><option>delivered</option><option>cancelled</option></select></td>
                </tr>
              ))}
            </tbody>
          </table>
          {!orders.length && <p className="empty-table">No customer orders yet.</p>}
        </div>
      </div>
    </section>
  );
}
