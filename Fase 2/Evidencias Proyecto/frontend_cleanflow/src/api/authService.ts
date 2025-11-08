// src/api/authService.ts
import { apiRequest } from './apiClient';
import type { AuthCredentials, AuthResponse } from '../types/auth';

/**
 * Petición para iniciar sesión (POST /api/auth/login)
 */
export function login(credentials: AuthCredentials): Promise<AuthResponse> {
    return apiRequest<AuthResponse>('/auth/login', { 
        method: 'POST', 
        body: credentials,
        requiresAuth: false 
    });
}

/**
 * Petición para registrar un nuevo usuario (POST /api/auth/register)
 */
export function register(credentials: AuthCredentials): Promise<AuthResponse> {
    return apiRequest<AuthResponse>('/auth/register', { 
        method: 'POST', 
        body: credentials,
        requiresAuth: false 
    });
}

/**
 * Petición para refrescar el token (POST /api/auth/refresh)
 */
export function refreshToken(): Promise<AuthResponse> {
    // 💡 CORRECCIÓN: Agregamos el prefijo /api
    return apiRequest<AuthResponse>('/auth/refresh', { 
        method: 'POST', 
        body: {}, 
        requiresAuth: true 
    });
}