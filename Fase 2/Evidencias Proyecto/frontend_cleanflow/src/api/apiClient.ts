const BASE_URL = 'https://cleanflow-back-v0-1.onrender.com';

/**
 * Interfaz genérica para la configuración de la petición.
 */
interface RequestOptions {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: any; 
    requiresAuth?: boolean; // Por defecto: true
}

/**
 * Función genérica para hacer peticiones al backend.
 * Incluye automáticamente el token de autenticación si está disponible.
 * * @param endpoint - La ruta del endpoint, ej: '/usuarios'.
 * @param options - Opciones de la petición (método, cuerpo).
 * @returns Los datos de la respuesta en formato JSON (tipados con <T>).
 */
export async function apiRequest<T>(endpoint: string, options: RequestOptions = { method: 'GET' } as RequestOptions): Promise<T> {
    const url = `${BASE_URL}${endpoint}`;
    const token = localStorage.getItem('authToken');
    
    // Por defecto, todas las peticiones requieren token a menos que se especifique lo contrario
    const requiresAuth = options.requiresAuth !== false; 

    // 1. Configuración de Headers
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };

    if (requiresAuth) {
        if (!token) {
            // Si falta el token, lanza un error de inmediato
            throw new Error('No autorizado: Se requiere iniciar sesión.');
        }
        // Inyección del token para el acceso a recursos protegidos
        headers['Authorization'] = `Bearer ${token}`; 
    }

    // 2. Opciones de Fetch
    const fetchOptions: RequestInit = {
        method: options.method,
        headers: headers,
    };

    // 3. Añadir el cuerpo (body) para POST/PUT/DELETE
    if (options.body) {
        fetchOptions.body = JSON.stringify(options.body);
    }

    try {
        const respuesta = await fetch(url, fetchOptions);

        // 4. Manejo de Errores HTTP
        if (!respuesta.ok) {
            if (respuesta.status === 401) {
                // Si el token es inválido o expiró
                localStorage.removeItem('authToken');
                // Considera redirigir al login aquí (ej: window.location.href = '/login')
            }
            
            // Intentar leer el mensaje de error del backend
            const errorData = await respuesta.json().catch(() => ({ message: `Error ${respuesta.status}` }));
            throw new Error(`[${respuesta.status}] ${errorData.message || 'Error desconocido del servidor'}`);
        }

        // 5. Retornar el JSON (o un objeto vacío si no hay contenido)
        const contentType = respuesta.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            return respuesta.json() as Promise<T>; 
        }
        // Retorna un tipo vacío para DELETE (204 No Content)
        return {} as T; 

    } catch (error) {
        console.error(`Fallo en la petición a ${url}:`, error);
        throw error;
    }
}