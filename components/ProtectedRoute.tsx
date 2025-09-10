import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSite } from '../hooks/useSite';

interface ProtectedRouteProps {
  children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { auth } = useSite();

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
