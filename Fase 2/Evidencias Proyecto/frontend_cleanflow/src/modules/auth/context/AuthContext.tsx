// src/context/AuthContext.tsx

import React, { createContext, useState, useEffect, useCallback } from 'react';
import {
    login as apiLogin,
    register as apiRegister,
    logout as apiLogout,
    getMe,
} from '../api/authService';

import type { User } from '../../../types/user';
import type { LoginCredentials, AuthCredentials, AuthResponse } from '../../../types/auth';


// ==========================================================
// Interfaces
// ==========================================================
export interface AuthUser {
    idUsuario: number;
    correo: string;
    nombreUsuario: string;
    roles?: { tipoRol: string; idRol?: number }[];
}

interface AuthContextType {
    user: AuthUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    authError: string | null;
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (credentials: AuthCredentials) => Promise<void>;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);


// ==========================================================
// Normalizador de usuario
// ==========================================================
const normalizeUser = (u: User): AuthUser => ({
    idUsuario: u.idUsuario,
    correo: u.correo,
    nombreUsuario: u.nombreUsuario,
    roles: u.roles?.map(r => ({ tipoRol: r.tipoRol, idRol: r.idRol })),
});


// ==========================================================
// AuthProvider
// ==========================================================
interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [authError, setAuthError] = useState<string | null>(null);


    // ======================================================
    // Cargar sesión desde el servidor SIEMPRE.
    // No se lee document.cookie porque HttpOnly lo impide.
    // ======================================================
    const loadSession = useCallback(async () => {
        try {
            const me = await getMe(); // Backend decide si hay sesión válida
            if (me) setUser(normalizeUser(me));
            else setUser(null);
        } catch {
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadSession();
    }, [loadSession]);


    // ======================================================
    // LOGIN
    // ======================================================
    const login = useCallback(async (credentials: LoginCredentials) => {
        setAuthError(null);
        try {
            const res: AuthResponse = await apiLogin(credentials);
            setUser(normalizeUser(res.user)); // backend set-cookie ya dejó la sesión activa
        } catch (error) {
            const msg = (error as Error).message || 'Error de login';
            setAuthError(msg);
            throw error;
        }
    }, []);


    // ======================================================
    // REGISTER
    // ======================================================
    const register = useCallback(async (credentials: AuthCredentials) => {
        setAuthError(null);
        try {
            const res: AuthResponse = await apiRegister(credentials);
            setUser(normalizeUser(res.user));
        } catch (error) {
            const msg = (error as Error).message || 'Error al registrar';
            setAuthError(msg);
            throw error;
        }
    }, []);


    // ======================================================
    // LOGOUT
    // ======================================================
    const logout = useCallback(async () => {
        try {
            await apiLogout(); // borra cookie en backend
        } finally {
            setUser(null);
        }
    }, []);


    // ======================================================
    // Render provider
    // ======================================================
    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isLoading,
                authError,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
