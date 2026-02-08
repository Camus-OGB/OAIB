import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-text">
        <span className="text-sm text-muted-foreground">Chargement...</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/connexion" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};