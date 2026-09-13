import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (user) return <Outlet />;

  if (loading) return null;

  return <Navigate to="/login" replace />;
};

export default ProtectedRoute;