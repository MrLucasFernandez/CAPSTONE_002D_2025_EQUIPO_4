// authService.ts

interface User {
  id: number;
  correo: string;
  nombreUsuario?: string;
  role?: string;
}

interface LoginCredentials {
  correo: string;
  contrasena: string;
}

interface AuthCredentials extends LoginCredentials {
  nombreUsuario: string;
}

// --- Estructura real que devuelve el backend ---
interface ServerAuthResponse {
  message: string;
  usuario: {
    id: number;
    correo: string;
  };
}

// --- Estructura usada internamente en el frontend ---
interface AuthResponse {
  token: string;
  user: User;
}

const BASE_URL = 'https://cleanflow-back-v0-1.onrender.com';

interface RequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  requiresAuth?: boolean;
}

/* ======================================================
    FUNCIÓN GENERAL PARA PETICIONES A LA API
    Incluye credenciales (cookies HTTP-only)
   ====================================================== */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = { method: 'GET' } as RequestOptions
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const fetchOptions: RequestInit = {
    method: options.method,
    headers,
    credentials: 'include', // 🔥 Permite enviar y recibir cookies HTTP-only
  };

  if (options.body) {
    fetchOptions.body = JSON.stringify(options.body);
  }

  try {
    const respuesta = await fetch(url, fetchOptions);

    if (!respuesta.ok) {
      const errorData = await respuesta
        .json()
        .catch(() => ({ message: `Error ${respuesta.status}` }));

      // Si el backend devuelve 401, probablemente expiró el token o cookie
      if (respuesta.status === 401) {
        console.warn('⚠️ Sesión no autorizada o expirada.');
      }

      throw new Error(`[${respuesta.status}] ${errorData.message || 'Error desconocido del servidor'}`);
    }

    const contentType = respuesta.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return respuesta.json() as Promise<T>;
    }

    return {} as T;
  } catch (error) {
    console.error(`Fallo en la petición a ${url}:`, error);
    throw error;
  }
}

const AUTH_ENDPOINT = '/auth';

/* ======================================================
    LOGIN (usa cookies HTTP-only en backend)
   ====================================================== */
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  // 1️⃣ Login inicial
  const body = {
    correo: credentials.correo,
    contrasena: credentials.contrasena,
  };

  const loginResponse = await apiRequest<ServerAuthResponse>(`${AUTH_ENDPOINT}/login`, {
    method: 'POST',
    body,
    requiresAuth: false,
  });

  console.log('✅ Respuesta del login backend:', loginResponse);

  if (!loginResponse || !loginResponse.usuario?.id) {
    throw new Error('Respuesta de autenticación incompleta. El servidor no devolvió los datos de usuario.');
  }

  const userId = loginResponse.usuario.id;

  // 2️⃣ Intentamos obtener información extendida del usuario usando la cookie de sesión
  let userData: any = null;
  try {
    userData = await apiRequest<any>(`/usuarios/${userId}`, {
      method: 'GET',
      requiresAuth: true, // ✅ Ahora las cookies se envían automáticamente
    });
  } catch (error) {
    console.warn('⚠️ No se pudo obtener info extendida del usuario (probablemente 401). Usando datos básicos.', error);
  }

  // 3️⃣ Fallback si no hay datos extra
  const user: User = {
    id: userData?.idUsuario || loginResponse.usuario.id,
    correo: userData?.correo || loginResponse.usuario.correo,
    nombreUsuario: userData?.nombreUsuario || 'Usuario',
    role: userData?.roles?.[0]?.tipoRol || 'Usuario',
  };

  // 4️⃣ Ya no guardamos token en localStorage (se maneja vía cookies)
  const response: AuthResponse = {
    token: 'cookie-auth', // simbólico, para estructura interna
    user,
  };

  console.log(`✅ Usuario logueado: ${user.nombreUsuario} (${user.role})`);
  return response;
};

/* ======================================================
    REGISTER
   ====================================================== */
export const register = async (credentials: AuthCredentials): Promise<AuthResponse> => {
  const body = {
    nombreUsuario: credentials.nombreUsuario,
    correo: credentials.correo,
    contrasena: credentials.contrasena,
  };

  const serverResponse = await apiRequest<ServerAuthResponse>(`${AUTH_ENDPOINT}/register`, {
    method: 'POST',
    body,
    requiresAuth: false,
  });

  console.log('✅ Respuesta de registro:', serverResponse);

  if (!serverResponse || !serverResponse.usuario) {
    console.error('❌ Respuesta de registro API inválida:', serverResponse);
    throw new Error('Respuesta de registro incompleta. El servidor no devolvió los datos del usuario.');
  }

  const response: AuthResponse = {
    token: 'cookie-auth',
    user: {
      id: serverResponse.usuario.id,
      correo: serverResponse.usuario.correo,
      nombreUsuario: credentials.nombreUsuario,
      role: 'Usuario',
    },
  };

  return response;
};

/* ======================================================
   LOGOUT
   ====================================================== */
export const logout = async (): Promise<void> => {
  try {
    await apiRequest<void>(`${AUTH_ENDPOINT}/logout`, {
      method: 'POST',
      requiresAuth: true,
    });
    console.log('✅ Sesión cerrada correctamente (cookie eliminada)');
  } catch (error) {
    console.warn('⚠️ Falló el logout en el servidor. Continuando con limpieza local.', error);
  }
};
