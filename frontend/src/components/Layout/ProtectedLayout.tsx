import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Loader from '../Common/Loader';

export default function ProtectedLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <Loader text="Checking your session..." />;
  if (!isAuthenticated) return <Navigate to="/auth/login" replace />;

  return <Outlet />;
}