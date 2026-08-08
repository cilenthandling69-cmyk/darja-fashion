import { createContext, useContext, useMemo, useState } from "react";
import api from "../api/client";

const AuthContext = createContext(null);

function readUser() {
  try {
    return JSON.parse(localStorage.getItem("darja_user")) || null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readUser);
  const [loading, setLoading] = useState(false);

  const saveSession = ({ token, user: nextUser }) => {
    localStorage.setItem("darja_token", token);
    localStorage.setItem("darja_user", JSON.stringify(nextUser));
    setUser(nextUser);
  };

  const register = async (payload) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", payload);
      saveSession(data);
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const login = async (payload, developer = false) => {
    setLoading(true);
    try {
      const endpoint = developer ? "/auth/developer/login" : "/auth/login";
      const { data } = await api.post(endpoint, payload);
      saveSession(data);
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("darja_token");
    localStorage.removeItem("darja_user");
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, loading, register, login, logout, isDeveloper: user?.role === "developer" }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
