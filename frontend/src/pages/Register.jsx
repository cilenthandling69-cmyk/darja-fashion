import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AuthScreen } from "./Login";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    try {
      await register(form);
      toast.success("Your account is ready");
      navigate("/");
    } catch (error) {
      const message = error.response?.data?.message
        || (error.request ? "Cannot reach the server. Please make sure the backend is running." : error.message)
        || "Registration failed";
      toast.error(message);
    }
  };

  return (
    <AuthScreen title="Join Darja" subtitle="Create your account and build your next look.">
      <form onSubmit={submit} className="auth-form">
        <label>Name<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
        <label>Email<input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
        <label>Password<input type="password" minLength="8" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>
        <button className="button button-primary button-full" disabled={loading}>{loading ? "Creating…" : "Create account"}</button>
        <p>Already registered? <Link to="/login">Sign in</Link></p>
      </form>
    </AuthScreen>
  );
}
