/*import { useCallback } from 'react';
import { useAdminAuth } from './useAdminAuth'; 

const API_BASE_URL = 'http://localhost:3001/api'; 

/**
 * Hook personalizado para realizar solicitudes a la API con autenticación.
 * Lee el token del usuario directamente del hook de autenticación en cada llamada.

export const useApi = () => {
    // Obtenemos el objeto user (que contiene el token) y la función logout
    const { user, logout } = useAdminAuth(); 
    
    // 🛑 IMPORTANTE: No extraemos el token aquí, sino dentro del useCallback,
    // para asegurarnos de que la función secureFetch tenga siempre el valor más fresco.

    const secureFetch = useCallback(async (endpoint: string, options: RequestInit = {}) => {
        
        const currentToken = user?.token; // ⬅️ Leemos el token más fresco aquí
        
        const url = `${API_BASE_URL}${endpoint}`;
        
        // 1. Inicializar headers y forzar el tipado
        const baseHeaders: Record<string, string> = {
            'Content-Type': 'application/json',
            ...(options.headers as Record<string, string> || {}),
        };

        // 2. Inyectar el token si existe y es una cadena válida
        if (currentToken) {
            baseHeaders['Authorization'] = `Bearer ${currentToken}`; 
        } 
        
        // 3. Realizar la solicitud
        const response = await fetch(url, {
            ...options,
            headers: baseHeaders,
        });

        // 4. Manejar el 401/403: Token inválido o expirado
        if (response.status === 401 || response.status === 403) {
            console.error(`Acceso no autorizado a ${endpoint}. Token inválido/expirado (${response.status}). Cerrando sesión.`);
            logout(); 
            throw new Error("Su sesión ha expirado o el acceso fue denegado.");
        }

        return response;

    }, [user?.token, logout]); // ⬅️ Dependemos de user?.token y logout

    return { secureFetch };
};*/