// src/modules/admin/hooks/useAdminAuth.ts

import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

// 1. Tipos de datos
export type UserRole = 'admin' | 'customer' | 'guest';

interface UserData {
    id: number;
    nombre: string;
    role: UserRole;
    token?: string;
}

interface AuthContextType {
    user: UserData | null;
    isAuthenticated: boolean;
    login: (userData: UserData) => void;
    logout: () => void;
}

// 2. Creación del Contexto
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Proveedor del Contexto (AuthProvider)
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    
    // Inicializar el estado leyendo el localStorage
    const [user, setUser] = useState<UserData | null>(() => {
        try {
            const storedUser = localStorage.getItem('userData');
            if (storedUser) {
                return JSON.parse(storedUser) as UserData;
            }
        } catch (e) {
            console.error("Error al analizar los datos del usuario desde el almacenamiento", e);
            localStorage.clear();
        }
        return null;
    });

    // Función de LOGIN
    const login = (userData: UserData) => {
        setUser(userData);
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userRole', userData.role);
        localStorage.setItem('userData', JSON.stringify(userData));
    };

    // Función de LOGOUT
    const logout = () => {
        setUser(null);
        localStorage.clear();
    };

    const isAuthenticated = !!user;

    return React.createElement(
        AuthContext.Provider,
        { value: { user, isAuthenticated, login, logout } },
        children
    );
};

// 4. Hook personalizado useAdminAuth
// 🚨 CORRECCIÓN FINAL: Eliminar la anotación de tipo de retorno explícita
export const useAdminAuth = () => { 
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAdminAuth debe ser usado dentro de un AuthProvider');
    }
    // Dejamos que TypeScript infiera que el retorno es AuthContextType
    return context as AuthContextType; 
};