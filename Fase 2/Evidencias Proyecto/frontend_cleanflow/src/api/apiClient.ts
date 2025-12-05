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
    // No forzamos Content-Type si no hay body (algunos endpoints/servidores fallan con DELETE + Content-Type)
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
  };

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
      // Intentar parsear JSON; si no, leer texto crudo para obtener más contexto del 500
      let errorMessage = `Error ${respuesta.status}`;
      let rawText = '';
      try {
        const text = await respuesta.text();
        rawText = text;
        // intentar parsear como JSON para sacar message
        try {
          const parsed = JSON.parse(text);
          errorMessage = parsed?.message || parsed?.error || JSON.stringify(parsed) || errorMessage;
        } catch {
          // no es JSON, usar texto crudo
          errorMessage = text || errorMessage;
        }
      } catch (e) {
        // ignore
      }

      // recopilar headers para diagnóstico
      const respHeaders: Record<string, string> = {};
      respuesta.headers.forEach((value, key) => {
        respHeaders[key] = value;
      });

      // loguear información útil antes de lanzar
      try {
        console.error(`apiRequest fallo: ${options.method} ${url}`, {
          status: respuesta.status,
          statusText: respuesta.statusText,
          body: errorMessage,
          rawText,
          responseHeaders: respHeaders,
        });
      } catch (e) {
        // ignore logging errors
      }

      throw new Error(`[${respuesta.status} ${respuesta.statusText}] ${errorMessage} (request: ${options.method} ${url})`);
    }

    // 5️⃣ Intentar parsear JSON si existe, sino devolver objeto vacío
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
