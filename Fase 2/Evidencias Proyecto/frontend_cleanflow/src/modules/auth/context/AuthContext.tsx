// src/context/AuthContext.tsx

import React, { createContext, useState, useEffect, useCallback } from 'react';
import { login as apiLogin, register as apiRegister, logout as apiLogout, getMe } from '../api/authService';
import type { User } from '../../../types/user';
import type { LoginCredentials, AuthCredentials, AuthResponse } from '../../../types/auth';

/** Usuario mínimo globalmente */
export interface AuthUser {
    idUsuario: number;
    correo: string;
    nombreUsuario: string;
    roles?: { tipoRol: string; idRol?: number }[];
}

/** Contexto de autenticación */
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

interface AuthProviderProps {
    children: React.ReactNode;
}

/** 🔥 Detectar si existe cookie de sesión (access_token) */
function hasAuthCookie() {
    return document.cookie.split("; ").some((c) => c.startsWith("access_token="));
}

/** Normaliza roles y usuario del backend */
const normalizeUser = (u: User): AuthUser => ({
    idUsuario: u.idUsuario,
    correo: u.correo,
    nombreUsuario: u.nombreUsuario,
    roles: u.roles?.map(r => ({ tipoRol: r.tipoRol, idRol: r.idRol })),
});

/** AuthProvider */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [authError, setAuthError] = useState<string | null>(null);

    /** 🚀 Cargar sesión inicial desde /auth/me PERO solo si hay cookie */
    const loadSession = useCallback(async () => {

        // ⛔ No hay cookie → NO llamar a /auth/me
        if (!hasAuthCookie()) {
            setUser(null);
            setIsLoading(false);
            return;
        }

        try {
            const me = await getMe();
            if (me) setUser(normalizeUser(me));
        } catch {
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { loadSession(); }, [loadSession]);

    /** LOGIN */
    const login = useCallback(async (credentials: LoginCredentials) => {
        setAuthError(null);
        try {
            const res: AuthResponse = await apiLogin(credentials);
            setUser(normalizeUser(res.user));
        } catch (error) {
            const msg = (error as Error).message || 'Error de login';
            setAuthError(msg);
            throw error;
        }
    }, []);

    /** REGISTER */
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

    /** LOGOUT */
    const logout = useCallback(async () => {
        try {
            await apiLogout();
        } finally {
            setUser(null);
        }
    }, []);

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            isLoading,
            authError,
            login,
            register,
            logout,
        }}>
            {children}
        </AuthContext.Provider>
    );
};
