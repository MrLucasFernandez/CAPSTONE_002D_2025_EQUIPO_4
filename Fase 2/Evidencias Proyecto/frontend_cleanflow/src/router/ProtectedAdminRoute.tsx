import { Navigate, Outlet } from 'react-router-dom';
import React from 'react';
import { useAdminAuth } from '../modules/admin/hooks/useAdminAuth'; 

export const ProtectedAdminRoute: React.FC = () => {

    const { user, isAuthenticated } = useAdminAuth(); 

    const isAdmin = isAuthenticated && user?.role === 'admin';

    const isLoading = false; 

    if (isLoading) {
        return <div className="p-4 text-center text-lg">Verificando permisos...</div>;
    }

    // --- Decisiones de Renderizado ---
    
    if (!isAuthenticated) {
        // Si NO está logueado, redirigir a Login
        // Esto es lo primero que debe fallar.
        return <Navigate to="/login" replace />;
    }

    if (!isAdmin) {
        // Si está logueado pero NO es admin, redirigir a la página principal.
        // Esto previene que un usuario 'cliente' vea contenido de administrador.
        return <Navigate to="/" replace />; 
    }

    // Si es Admin y está autenticado, renderizar el componente(<AdminLayout />)
    return <Outlet />;
};
