import { Navigate } from 'react-router-dom';
import useAuthStore from '../../stores/useAuthStore';

export default function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user?.rol)) return <Navigate to="/bienvenida" replace />;

  return children;
}