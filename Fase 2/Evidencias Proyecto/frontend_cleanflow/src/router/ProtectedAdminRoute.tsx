import { Navigate, Outlet } from 'react-router-dom';
import React from 'react';
// Asegúrate de que la ruta al hook de auth sea correcta desde aquí
import { useAdminAuth } from '../modules/admin/hooks/useAdminAuth'; 


/**
 * Este componente actúa como un guardia de ruta.
 * Verifica si el usuario está autenticado y tiene el rol 'admin'.
 */
export const ProtectedAdminRoute: React.FC = () => {
    // 1. Obtener el estado del contexto.
    // Asumo que tu hook devuelve isAuthenticated y el objeto user
    const { user, isAuthenticated } = useAdminAuth(); 

    // 2. Comprobar el rol (más simple y tipado correctamente)
    const isAdmin = isAuthenticated && user?.role === 'admin';

    // 3. Simulación de carga (Mantengo la estructura por si la quieres implementar después)
    // En un sistema real, el hook AuthProvider tendría un estado 'isLoading'.
    const isLoading = false; 

    // Muestra "Cargando..." (Si implementas la lógica de carga real)
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

    // Si es Admin y está autenticado, renderizar el componente hijo (<AdminLayout />)
    return <Outlet />;
};
