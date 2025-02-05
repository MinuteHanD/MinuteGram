import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, hasRole, authLoading } = useAuth();


  if (authLoading) {
    return <p>Loading............</p>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;