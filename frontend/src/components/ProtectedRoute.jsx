import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ developer = false }) {
  const { user, isDeveloper } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to={developer ? "/developer/login" : "/login"} replace state={{ from: location }} />;
  }

  if (developer && !isDeveloper) return <Navigate to="/" replace />;
  return <Outlet />;
}
