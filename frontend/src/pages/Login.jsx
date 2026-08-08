import { motion } from "framer-motion";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const submit = async (event) => {
    event.preventDefault();
    try {
      await login(form);
      toast.success("Welcome back");
      navigate(location.state?.from?.pathname || "/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <AuthScreen title="Welcome back" subtitle="Sign in to continue your Darja experience.">
      <form onSubmit={submit} className="auth-form">
        <label>Email<input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
        <label>Password<input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>
        <button className="button button-primary button-full" disabled={loading}>{loading ? "Signing in…" : "Sign in"}</button>
        <p>New to Darja? <Link to="/register">Create an account</Link></p>
        <p className="muted-link"><Link to="/developer/login">Developer login</Link></p>
      </form>
    </AuthScreen>
  );
}

export function AuthScreen({ title, subtitle, children }) {
  return (
    <section className="auth-page page-top">
      <motion.div className="auth-card" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
        <div className="brand auth-brand">DARJA <span>FASHION</span></div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
        {children}
      </motion.div>
    </section>
  );
}
