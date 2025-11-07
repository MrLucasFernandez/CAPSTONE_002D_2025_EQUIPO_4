import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
// Importamos el hook que ahora contiene la lógica de verificación de rol
import { useAdminAuth } from '../modules/admin/context/AdminAuthContext'; 

interface ProtectedAdminRouteProps {
  // Outlet renderiza los componentes hijos de la ruta protegida
  children?: React.ReactNode; 
}

export const ProtectedAdminRoute: React.FC<ProtectedAdminRouteProps> = ({ children }) => {
  // 1. CONSUMIMOS EL ESTADO DE AUTORIZACIÓN
  const { isAdmin, isLoading, isAuthenticated} = useAdminAuth();

  // 2. VERIFICACIÓN DE ESTADOS
  
  // Si el AuthProvider principal está cargando, esperamos.
  if (isLoading) {
    return <div>Verificando permisos y sesión...</div>; 
  }
  
  // Si el usuario no está autenticado (isAuthenticated ya viene del useAuth subyacente)
  // Nota: Esto también cubre el caso de !user
  if (!isAuthenticated) {
    // Redirigimos al login si no hay sesión
    return <Navigate to="/login" replace />; 
  }
  
  // Si está autenticado pero NO es Administrador
  if (!isAdmin) {
    // Redirigimos a la página de acceso denegado
    return <Navigate to="/access-denied" replace />; 
  }

  // 3. Si es Admin, renderizamos el contenido
  return children ? <>{children}</> : <Outlet />;
};