import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
// Importamos las funciones de la API
// NOTA: Ajusta esta ruta si '../authService' no es correcta en tu proyecto
import { 
    login as apiLogin, 
    register as apiRegister,
    logout as apiLogout,
} from '../api/authService'; 
import type { User } from '../types/user';
import type { LoginCredentials, AuthCredentials, AuthResponse } from '../types/auth'; // Importar LoginCredentials

// --- 1. Definición del Tipo de Contexto ---

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    authError: string | null; // <-- Propiedad añadida para el manejo de errores
    login: (credentials: LoginCredentials) => Promise<void>; // <-- Usamos LoginCredentials aquí
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
    const [authError, setAuthError] = useState<string | null>(null); // <-- Estado para errores

    // Función interna para guardar el estado después de una autenticación exitosa
    const saveAuthData = (tokenValue: string, userObject: User) => {
        setToken(tokenValue);
        setUser(userObject);
        setAuthError(null); // Limpiar cualquier error previo
    };
    
    // Función de ayuda que se usaría para obtener los datos del usuario después de recargar la página
    const fetchUserFromToken = useCallback(async (authToken: string) => {
        // CORRECCIÓN PARA ELIMINAR WARNING: Usar la variable temporalmente
        console.log("Validando token almacenado (ID):", authToken.substring(0, 10) + '...');
        
        // NOTA: Aquí debe ir la llamada a apiRequest<User>('/auth/me') para validar el token
        // y obtener los datos del usuario.
        
        // Simulación de carga...
        try {
             // Aquí iría: const userData = await apiRequest<User>('/auth/me'); 
             // setUser(userData);
        } catch (error) {
            console.error("Error al obtener datos del usuario con token:", error);
            // Si falla la validación del token, forzamos el logout.
            await apiLogout(); 
            setToken(null);
            setUser(null);
        }
    }, []);

    // --- 3. Implementación de Funciones del API ---

    const login = useCallback(async (credentials: LoginCredentials) => { // <-- Uso de LoginCredentials
        setAuthError(null);
        try {
            const response: AuthResponse = await apiLogin(credentials);
            saveAuthData(response.token, response.user);
        } catch (error) {
            const errorMessage = (error as Error).message || 'Fallo en la conexión o credenciales inválidas.';
            setAuthError(errorMessage);
            throw error; // Re-lanzar para que LoginPage detenga el loading/maneje el error.
        }
    }, []);

    const register = useCallback(async (credentials: AuthCredentials) => {
        setAuthError(null);
        try {
            const response: AuthResponse = await apiRegister(credentials);
            saveAuthData(response.token, response.user);
        } catch (error) {
            const errorMessage = (error as Error).message || 'Fallo en la conexión o datos de registro inválidos.';
            setAuthError(errorMessage);
            throw error;
        }
    }, []);

    const logout = useCallback(async () => {
        await apiLogout(); 
        setToken(null);
        setUser(null);
        setAuthError(null);
    }, []);
        
    // --- 4. Comprobación Inicial de Sesión (useEffect) ---
    useEffect(() => {
        const storedToken = localStorage.getItem('authToken');
        
        if (storedToken) {
            setToken(storedToken); 
            fetchUserFromToken(storedToken);
        }
        setIsLoading(false);
    }, [fetchUserFromToken]);

    const value = {
        user,
        token,
        isAuthenticated: !!token, 
        isLoading,
        authError, // <-- Propiedad añadida al value
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