// Asegúrate de que los tipos se importan correctamente desde '../types/auth'
interface User { id: number; nombreUsuario: string; role: string; } 
interface LoginCredentials { correo: string; contrasena: string; } 
interface AuthCredentials extends LoginCredentials { nombreUsuario: string; } 
interface AuthResponse { token: string; user: User; } 

// --- Configuración Global y Función Genérica ---
const BASE_URL = 'https://cleanflow-back-v0-1.onrender.com';

interface RequestOptions {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: any; 
    requiresAuth?: boolean;
}

export async function apiRequest<T>(endpoint: string, options: RequestOptions = { method: 'GET' } as RequestOptions): Promise<T> {
    const url = `${BASE_URL}${endpoint}`;
    const token = localStorage.getItem('authToken');
    
    const requiresAuth = options.requiresAuth !== false; 

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };

    if (requiresAuth) {
        if (!token) {
            throw new Error('No autorizado: Se requiere iniciar sesión.');
        }
        headers['Authorization'] = `Bearer ${token}`; 
    }

    const fetchOptions: RequestInit = {
        method: options.method,
        headers: headers,
    };

    if (options.body) {
        fetchOptions.body = JSON.stringify(options.body);
    }

    try {
        const respuesta = await fetch(url, fetchOptions);

        if (!respuesta.ok) {
            if (respuesta.status === 401) {
                localStorage.removeItem('authToken');
                // Aquí podrías querer disparar un evento global de logout
            }
            
            const errorData = await respuesta.json().catch(() => ({ message: `Error ${respuesta.status}` }));
            throw new Error(`[${respuesta.status}] ${errorData.message || 'Error desconocido del servidor'}`);
        }

        const contentType = respuesta.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            return respuesta.json() as Promise<T>; 
        }
        return {} as T; 

    } catch (error) {
        console.error(`Fallo en la petición a ${url}:`, error);
        throw error;
    }
}


// --- Implementación de Funciones de Autenticación usando apiRequest ---

// Endpoint de autenticación base
const AUTH_ENDPOINT = '/auth';

// 1. Función de Login
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    // 🚨 CLAVE: REQUIRES AUTH SE ESTABLECE A FALSE AQUÍ
    const response = await apiRequest<AuthResponse>(
        `${AUTH_ENDPOINT}/login`,
        {
            method: 'POST',
            body: credentials,
            requiresAuth: false, 
        }
    );
    return response;
};

// 2. Función de Registro
export const register = async (credentials: AuthCredentials): Promise<AuthResponse> => {
    // 🚨 CLAVE: REQUIRES AUTH SE ESTABLECE A FALSE AQUÍ
    const response = await apiRequest<AuthResponse>(
        `${AUTH_ENDPOINT}/register`,
        {
            method: 'POST',
            body: credentials,
            requiresAuth: false, 
        }
    );
    return response;
};
