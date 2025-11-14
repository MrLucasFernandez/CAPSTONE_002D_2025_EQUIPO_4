// authService.ts
import type { User } from '../types/user';

interface LoginCredentials {
  correo: string;
  contrasena: string;
}

interface AuthCredentials extends LoginCredentials {
  nombreUsuario: string;
  apellidoUsuario: string;
  telefono: string;
  rut: string;
  direccionUsuario: string;
}

/** Respuesta del backend */
interface BackendAuthResponse {
  message: string;
  usuario: any;
}

/** Configuración de la API */
const BASE_URL = import.meta.env.VITE_API_URL || ''; // '' permite proxy de Vite en dev/preview

interface RequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
}

/* ======================================================
  FUNCIÓN GENERAL PARA PETICIONES A LA API
====================================================== */
async function apiRequest<T>(endpoint: string, options: RequestOptions = { method: 'GET' }): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;

  const fetchOptions: RequestInit = {
    method: options.method,
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // IMPORTANTE para cookies HttpOnly
  };

  if (options.body) fetchOptions.body = JSON.stringify(options.body);

  const res = await fetch(url, fetchOptions);

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: `Error ${res.status}` }));
    throw new Error(`[${res.status}] ${err.message}`);
  }

  return res.json() as Promise<T>;
}

/* ======================================================
  LOGIN
====================================================== */
export async function login(credentials: LoginCredentials) {
  const res = await apiRequest<BackendAuthResponse>('/auth/login', {
    method: 'POST',
    body: credentials,
  });

  return {
    token: 'cookie-auth', // simbólico
    user: convertBackendUser(res.usuario),
  };
}

/* ======================================================
  REGISTER
====================================================== */
export async function register(credentials: AuthCredentials) {
  const res = await apiRequest<BackendAuthResponse>('/auth/register', {
    method: 'POST',
    body: credentials,
  });

  return {
    token: 'cookie-auth',
    user: convertBackendUser(res.usuario),
  };
}

/* ======================================================
  GET /auth/me
====================================================== */
export async function getMe(): Promise<User | null> {
  try {
    const me = await apiRequest<any>('/auth/me', { method: 'GET' });
    return convertBackendUser(me);
  } catch {
    console.warn('Usuario no autenticado o sesión expirada.');
    return null;
  }
}

/* ======================================================
  LOGOUT
====================================================== */
export async function logout(): Promise<void> {
  try {
    await apiRequest('/auth/logout', { method: 'POST' });
  } catch (err) {
    console.warn('Error al cerrar sesión', err);
  }
}

/* ======================================================
  FUNCIÓN DE MAPEO — backend → frontend
====================================================== */
function convertBackendUser(b: any): User {
  return {
    idUsuario: b.idUsuario ?? b.id ?? 0,
    correo: b.correo ?? '',
    nombreUsuario: b.nombreUsuario ?? (b.correo ? b.correo.split('@')[0] : ''),
    apellidoUsuario: b.apellidoUsuario ?? null,
    telefono: b.telefono ?? null,
    rut: b.rut ?? null,
    direccionUsuario: b.direccionUsuario ?? null,
    activo: b.activo ?? true,
    fechaCreacion: b.fechaCreacion ?? new Date().toISOString(),
    fechaActualizacion: b.fechaActualizacion ?? new Date().toISOString(),
    roles: Array.isArray(b.roles)
      ? b.roles.map((r: any) => ({
          idRol: r.idRol ?? r.id ?? 0,
          tipoRol: r.tipoRol ?? r.rolNombre ?? '',
          descripcionRol: r.descripcionRol ?? null,
        }))
      : [],
  };
}
