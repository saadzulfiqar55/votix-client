import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!user) return <Navigate to="/login" />;

  if (allowedRoles.length && !allowedRoles.includes(user.role)) {
    return <div className="text-red-500 text-center mt-10">Access Denied</div>;
  }

  return children;
}
