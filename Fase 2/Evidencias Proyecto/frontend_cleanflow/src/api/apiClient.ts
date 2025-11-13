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
 * Usa cookies httpOnly (enviadas automáticamente por el navegador).
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = { method: 'GET' } as RequestOptions
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;

  // 1️⃣ Configuración de headers
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // ❌ Ya no usamos Authorization Bearer ni localStorage
  // const token = localStorage.getItem('authToken');
  // if (requiresAuth && token) headers['Authorization'] = `Bearer ${token}`;

  // 2️⃣ Configuración del fetch (IMPORTANTE: incluir cookies)
  const fetchOptions: RequestInit = {
    method: options.method,
    headers,
    credentials: 'include', // ✅ necesario para que se envíen las cookies
  };

  // 3️⃣ Agregar cuerpo si corresponde
  if (options.body) {
    fetchOptions.body = JSON.stringify(options.body);
  }

  try {
    const respuesta = await fetch(url, fetchOptions);

    // 4️⃣ Manejo de errores HTTP
    if (!respuesta.ok) {
      const errorData = await respuesta.json().catch(() => ({
        message: `Error ${respuesta.status}`,
      }));

      throw new Error(`[${respuesta.status}] ${errorData.message || 'Error desconocido del servidor'}`);
    }

    // 5️⃣ Intentar parsear JSON si existe
    const contentType = respuesta.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return respuesta.json() as Promise<T>;
    }

    return {} as T;
  } catch (error) {
    console.error(`❌ Fallo en la petición a ${url}:`, error);
    throw error;
  }
}
