import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AuthScreen } from "./Login";

export default function DeveloperLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    try {
      await login(form, true);
      toast.success("Developer access granted");
      navigate("/developer/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Developer login failed");
    }
  };

  return (
    <AuthScreen title="Developer portal" subtitle="Restricted product and order management access.">
      <form onSubmit={submit} className="auth-form">
        <label>Developer email<input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
        <label>Password<input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>
        <button className="button button-primary button-full" disabled={loading}>{loading ? "Verifying…" : "Open dashboard"}</button>
      </form>
    </AuthScreen>
  );
}
