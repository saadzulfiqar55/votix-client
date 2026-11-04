import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === "super_admin" || user.role === "election_admin") {
      return <Navigate to="/admin" replace />;
    }
    if (user.role === "election_manager") {
      return <Navigate to="/manager" replace />;
    }
    if (user.role === "polling_officer") {
      return <Navigate to="/officer" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
