import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ children, adminOnly = false, moderatorOnly = false }) => {
  const { isAuthenticated, loading, isAdmin, isModerator } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" />;
  }

  if (moderatorOnly && !isModerator) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;