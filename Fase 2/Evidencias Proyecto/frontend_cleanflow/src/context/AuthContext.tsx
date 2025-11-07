import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
// Importamos las funciones de la API
import { login as apiLogin, register as apiRegister } from '../api/authService'; 
import type { User } from '../types/user';
import type { AuthCredentials, AuthResponse } from '../types/auth'; 

// --- 1. Definición del Tipo de Contexto ---

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: AuthCredentials) => Promise<void>;
    register: (credentials: AuthCredentials) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- 2. Componente Proveedor (Provider) ---

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

  // Función interna para guardar el estado después de una autenticación exitosa
    const saveAuthData = (tokenValue: string, userObject: User) => {
    localStorage.setItem('authToken', tokenValue);
    // Opcional: guardar otros datos importantes del usuario en localStorage
    setToken(tokenValue);
    setUser(userObject);
    };

  // --- 3. Implementación de Funciones del API ---

    const login = useCallback(async (credentials: AuthCredentials) => {
    // La función apiLogin viene de src/api/authService.ts
    const response: AuthResponse = await apiLogin(credentials);
    saveAuthData(response.token, response.user);
    }, []);

    const register = useCallback(async (credentials: AuthCredentials) => {
    // La función apiRegister viene de src/api/authService.ts
    const response: AuthResponse = await apiRegister(credentials);
    saveAuthData(response.token, response.user);
    }, []);

    const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    // Si guardaste otros datos, elimínalos aquí
    setToken(null);
    setUser(null);
    }, []);
  // --- 4. Comprobación Inicial de Sesión (useEffect) ---
    useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    
    if (storedToken) {
        // En un proyecto real, la mejor práctica es usar el token para llamar
        // a un endpoint de validación (ej: GET /auth/me) para obtener los
        // datos frescos del usuario.
        
        setToken(storedToken); 
        // NOTE: Aquí deberías ejecutar la lógica para obtener el objeto User
        // Asumiendo que esa lógica se implementará después de este paso.
    }
    setIsLoading(false);
    }, []);

    const value = {
    user,
    token,
    isAuthenticated: !!token, 
    isLoading,
    login,
    register,
    logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// --- 5. Hook Personalizado ---

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    return context;
};