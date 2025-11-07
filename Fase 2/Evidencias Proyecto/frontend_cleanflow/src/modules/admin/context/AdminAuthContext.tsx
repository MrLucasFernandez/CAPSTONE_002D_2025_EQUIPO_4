import React, { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from '../../../context/AuthContext';
import type { User, Rol } from '../../../types/user'; 

// 1. Tipificación del Contexto de Administración
interface AdminAuthContextType {
    isAdmin: boolean;
    // Referenciamos el tipo User | null directamente, corregido del error 2536
    user: User | null; 
    isLoading: boolean;
    isAuthenticated: boolean;
}

// Valor inicial y contexto
const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

// Rol que definimos en el router (lo hacemos constante)
const ADMIN_ROLE = 'ADMINISTRADOR'; 

// 2. Componente Proveedor
interface AdminAuthProviderProps {
    children: ReactNode;
}

export const AdminAuthProvider: React.FC<AdminAuthProviderProps> = ({ children }) => {
    // Consumimos el estado del contexto global (Autenticación)
    const { user, isAuthenticated, isLoading } = useAuth();

    // 3. Lógica de verificación de permisos
    // Esta lógica es el corazón de la Autorización
    const isAdmin = React.useMemo(() => {
        // Si aún no carga o no está autenticado, no es Admin.
        if (isLoading || !isAuthenticated || !user) {
            return false;
        }

        // Verificamos si el usuario tiene el rol requerido
        const hasAdminRole = user.roles?.some(
            // Comparamos en mayúsculas para asegurar la robustez
            (rol: Rol) => rol.tipoRol.toUpperCase() === ADMIN_ROLE.toUpperCase()
        );

        return hasAdminRole || false;
    }, [user, isAuthenticated, isLoading]); // Se recalcula si el user o estado de auth cambia

    // 4. Valores provistos
    const value: AdminAuthContextType = {
        isAdmin,
        user,
        isLoading,
        isAuthenticated,
    };

    return (
        <AdminAuthContext.Provider value={value}>
            {children}
        </AdminAuthContext.Provider>
    );
};

// 5. Hook personalizado para consumir el contexto de Admin
export const useAdminAuth = () => {
    const context = useContext(AdminAuthContext);
    if (context === undefined) {
        throw new Error('useAdminAuth debe ser usado dentro de un AdminAuthProvider');
    }
    return context;
};