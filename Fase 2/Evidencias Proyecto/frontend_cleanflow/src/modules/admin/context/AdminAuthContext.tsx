// src/modules/admin/context/AdminAuthContext.tsx

import React, { createContext, useContext, useEffect, useMemo } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from '../../auth/hooks/useAuth';
import type { AuthUser } from '../../auth/context/AuthContext';

// Contexto Admin
interface AdminAuthContextType {
    isAdmin: boolean;
    user: AuthUser | null;
    isLoading: boolean;
    isAuthenticated: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

// Nombre del rol que habilita privilegios de administrador
const ADMIN_ROLE = 'Administrador';

interface AdminAuthProviderProps { children: ReactNode; }

export const AdminAuthProvider: React.FC<AdminAuthProviderProps> = ({ children }) => {

    // Obtenemos información del AuthContext
    const { user, isAuthenticated, isLoading } = useAuth();

    /**
     * 🔥 Cálculo correcto de isAdmin:
     * Solo depende de user e isAuthenticated.
     * Eliminamos isLoading porque rompe el re-render al hacer login.
     */
    const isAdmin = useMemo(() => {
        if (!isAuthenticated || !user) return false;

        return Array.isArray(user.roles)
            ? user.roles.some(r => {
                if (!r.tipoRol) return false;

                // Normaliza roles (elimina acentos y pasa a mayúsculas)
                const userRole = r.tipoRol.normalize("NFD").replace(/\p{Diacritic}/gu, '').toUpperCase();
                const adminRole = ADMIN_ROLE.normalize("NFD").replace(/\p{Diacritic}/gu, '').toUpperCase();

                return userRole === adminRole;
            })
            : false;

    }, [user, isAuthenticated]); // 👈 dependencia corregida

    // Log para debug (opcional)
    useEffect(() => {
        if (!isLoading) {
            console.log('🔹 [AdminAuth] Usuario autenticado:', isAuthenticated, user);
            console.log('🔹 [AdminAuth] Rol Admin detectado:', isAdmin);
        }
    }, [isAuthenticated, isAdmin, user, isLoading]);

    const value: AdminAuthContextType = {
        isAdmin,
        user,
        isLoading,
        isAuthenticated
    };

    return (
        <AdminAuthContext.Provider value={value}>
            {children}
        </AdminAuthContext.Provider>
    );
};

/** Hook */
export const useAdminAuth = () => {
    const context = useContext(AdminAuthContext);
    if (!context) throw new Error('useAdminAuth debe ser usado dentro de un AdminAuthProvider');
    return context;
};
