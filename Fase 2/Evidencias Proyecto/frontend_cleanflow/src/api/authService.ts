// src/api/authService.ts
import { apiRequest } from './apiClient';
import type { AuthCredentials, AuthResponse } from '../types/auth';

/**
 * Petición para iniciar sesión (POST /auth/login)
 */
export function login(credentials: AuthCredentials): Promise<AuthResponse> {
    return apiRequest<AuthResponse>('/auth/login', { 
        method: 'POST', 
        body: credentials,
        // 🚨 NO necesita un token previo para iniciar sesión
        requiresAuth: false 
    });
}

/**
 * Petición para registrar un nuevo usuario (POST /auth/register)
 */
export function register(credentials: AuthCredentials): Promise<AuthResponse> {
    // Asumimos que el backend de registro también devuelve un token para iniciar la sesión automáticamente
    return apiRequest<AuthResponse>('/auth/register', { 
        method: 'POST', 
        body: credentials,
        //  NO necesita un token previo para registrarse
        requiresAuth: false 
    });
}

/**
 * Petición para refrescar el token (POST /auth/refresh)
 */
export function refreshToken(): Promise<AuthResponse> {
    // Esta petición SÍ necesita un token válido (el viejo) para obtener uno nuevo.
    // Si tu backend maneja el refresh token con un body, adapta la función.
    return apiRequest<AuthResponse>('/auth/refresh', { 
        method: 'POST', 
        // No necesita body si el token viejo se envía en los headers (Bearer)
        body: {}, 
        requiresAuth: true 
    });
}