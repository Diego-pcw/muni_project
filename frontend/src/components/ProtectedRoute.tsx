// src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute: React.FC<{ requiredRole?: string }> = ({ requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) return <div style={{ padding: 20 }}>Comprobando sesión...</div>;

  // no autenticado => redirect to login for routes that need auth
  if (!user && !requiredRole) {
    // route requires auth but no specific role (example: /dashboard)
    return <Navigate to="/login" replace />;
  }

  if (!user && requiredRole) {
    // route requires a role (admin) but not authenticated -> go to login
    return <Navigate to="/login" replace />;
  }

  // if a role is required but user doesn't have it -> send to public home
  if (requiredRole && user && user.rol !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  // user is authenticated and role is fine (or no role required)
  return <Outlet />;
};
