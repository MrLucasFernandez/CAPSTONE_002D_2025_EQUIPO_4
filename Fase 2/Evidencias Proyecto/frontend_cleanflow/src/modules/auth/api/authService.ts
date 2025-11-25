// src/api/authService.ts
import type { User } from '../../../types/user';

/* ======================================================
    TIPOS
====================================================== */

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

interface BackendAuthResponse {
  message: string;
  usuario: any;
}

/* ======================================================
    CONFIG
====================================================== */

const BASE_URL = import.meta.env.VITE_API_URL || '';

interface RequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
}

/* ======================================================
    FETCH GENERICO (CON COOKIES)
====================================================== */
async function apiRequest<T>(endpoint: string, options: RequestOptions = { method: 'GET' }): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;

  const fetchOptions: RequestInit = {
    method: options.method,
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // 🔥 IMPORTANTÍSIMO para cookies HttpOnly
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
    LOGIN (CORREGIDO)
====================================================== */

export async function login(credentials: LoginCredentials) {
  // 1. Login → el backend devuelve cookie HttpOnly
  await apiRequest<BackendAuthResponse>('/auth/login', {
    method: 'POST',
    body: credentials,
  });

  // 2. 🔥 IMPORTANTE: obtener los datos REALES del usuario
  const me = await getMe();

  if (!me) {
    throw new Error('No fue posible obtener la sesión tras iniciar sesión.');
  }

  return {
    token: 'cookie-auth',
    user: me,
  };
}

/* ======================================================
    REGISTER (MISMA LÓGICA QUE LOGIN)
====================================================== */

export async function register(credentials: AuthCredentials) {
  await apiRequest<BackendAuthResponse>('/auth/register', {
    method: 'POST',
    body: credentials,
  });

  const me = await getMe();
  if (!me) {
    throw new Error('Error obteniendo sesión tras registrarse.');
  }

  return {
    token: 'cookie-auth',
    user: me,
  };
}

/* ======================================================
    GETME (SESIÓN DESDE COOKIE)
====================================================== */

export async function getMe(): Promise<User | null> {
  try {
    const me = await apiRequest<any>('/auth/me', { method: 'GET' });
    return convertBackendUser(me);
  } catch {
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
    MAPEO backend → frontend
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
