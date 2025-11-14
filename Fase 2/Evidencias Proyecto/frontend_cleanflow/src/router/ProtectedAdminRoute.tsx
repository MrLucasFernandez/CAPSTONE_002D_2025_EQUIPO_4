import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAdminAuth } from '../modules/admin/context/AdminAuthContext'; 

interface ProtectedAdminRouteProps {
  children?: React.ReactNode; 
}

export const ProtectedAdminRoute: React.FC<ProtectedAdminRouteProps> = ({ children }) => {
  const { isAdmin, isLoading, isAuthenticated } = useAdminAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="text-gray-700 text-lg">Verificando permisos y sesión...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/access-denied" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};
